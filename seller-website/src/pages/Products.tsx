import { useEffect, useState } from "react";
import SellerLayout from "@/components/layout/SellerLayout";
import {
  Package,
  Search,
  Plus,
  MoreHorizontal,
  Edit3,
  Trash2,
  Zap,
  Tag,
  Loader2,
  RefreshCw,
  AlertCircle,
  Archive,
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { productService } from "@/services/productService";
import { categoryService } from "@/services/categoryService";
import { uploadService } from "@/services/uploadService";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);

  // Asset Dialog State
  const [isUrlDialogOpen, setIsUrlDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [urlError, setUrlError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    brand: "",
    categoryId: "",
    basePrice: 0,
    salePrice: 0,
    totalStock: 0,
    sku: "",
    tags: "",
    thumbnail: "",
    images: [] as string[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getSellerProducts({ limit: 100 }),
        categoryService.getCategoryTree(),
      ]);

      setProducts(productsRes.data?.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      setError("Failed to synchronize with backend registry.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenSheet = (product: any = null) => {
    setError(null);
    if (product) {
      setEditingProduct(product);
      setFormData({
        title: product.title || "",
        shortDescription: product.shortDescription || "",
        fullDescription: product.fullDescription || "",
        brand: product.brand || "",
        categoryId: product.categoryId || "",
        basePrice: product.basePrice || 0,
        salePrice: product.salePrice || 0,
        totalStock: product.totalStock || 0,
        sku: product.sku || "",
        tags: product.tags?.join(", ") || "",
        thumbnail: product.thumbnail || "",
        images: product.images || [],
      });
      setFieldErrors({});
    } else {
      setEditingProduct(null);
      setFormData({
        title: "",
        shortDescription: "",
        fullDescription: "",
        brand: "",
        categoryId: "",
        basePrice: 0,
        salePrice: 0,
        totalStock: 0,
        sku: "",
        tags: "",
        thumbnail: "",
        images: [],
      });
      setFieldErrors({});
    }
    setIsSheetOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      if (!formData.categoryId) {
        setFieldErrors({ categoryId: "Categorical classification is mandatory." });
        throw new Error("Validation mismatch.");
      }

      const payload = {
        title: formData.title,
        shortDescription: formData.shortDescription,
        fullDescription: formData.fullDescription,
        brand: formData.brand || undefined,
        categoryId: formData.categoryId,
        basePrice: Number(formData.basePrice),
        salePrice: formData.salePrice ? Number(formData.salePrice) : undefined,
        totalStock: Number(formData.totalStock),
        sku: formData.sku,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
        thumbnail: formData.thumbnail || formData.images[0] || "",
        images: formData.images,
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, payload);
      } else {
        await productService.createProduct(payload);
      }
      setIsSheetOpen(false);
      fetchData();
    } catch (err: any) {
      console.error("Form submission failed:", err);
      
      // Handle Zod/Backend Field Validation Errors
      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        const mappedErrors: Record<string, string> = {};
        
        // Zod errors usually come as { path: string[], message: string }
        if (Array.isArray(errors)) {
          errors.forEach((e: any) => {
            const field = e.path?.[e.path.length - 1];
            if (field) mappedErrors[field] = e.message;
          });
        }
        setFieldErrors(mappedErrors);
        setError("Integrity validation failed. Check highlighted fields.");
        setIsErrorDialogOpen(true);
      } else {
        setError(
          err.response?.data?.message || err.message || "Operation failed.",
        );
        setIsErrorDialogOpen(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const formatAssetUrl = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    return `${backendUrl}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const res = await uploadService.uploadProductImages(files);
      const newImages = res.data.images.map((img: any) => formatAssetUrl(img.url));
      const newThumbnail = res.data.thumbnail ? formatAssetUrl(res.data.thumbnail.url) : newImages[0];
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
        thumbnail: prev.thumbnail || newThumbnail,
      }));
    } catch (err) {
      setError("Asset synchronization failed. verify storage protocol.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) {
      setUrlError("URL protocol cannot be null.");
      return;
    }

    if (urlInput.startsWith("http") || urlInput.startsWith("https")) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, urlInput],
        thumbnail: prev.thumbnail || urlInput,
      }));
      setUrlInput("");
      setUrlError(null);
      setIsUrlDialogOpen(false);
    } else {
      setUrlError("Invalid registry protocol. Assets must be served via HTTPS.");
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const removed = newImages.splice(index, 1)[0];
      return {
        ...prev,
        images: newImages,
        thumbnail: prev.thumbnail === removed ? newImages[0] || "" : prev.thumbnail,
      };
    });
  };

  const handleDeleteSub = async (productId: string) => {
    if (
      window.confirm(
        "Archive this asset and terminate its presence in the global marketplace?",
      )
    ) {
      try {
        await productService.deleteProduct(productId);
        fetchData();
      } catch (err) {
        console.error("Delete failed:", err);
        setError("Termination protocol failed.");
      }
    }
  };

  return (
    <SellerLayout>
      <div className="space-y-12 animate-in fade-in duration-1000">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <Tag size={12} className="text-black" />
              Inventory Control
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              Merchant Listings
            </h1>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              Scale your catalog across the global network
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => handleOpenSheet()}
              className="h-14 px-8 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all flex items-center gap-3 shadow-2xl shadow-black/20"
            >
              <Plus size={18} />
              Add New Product
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label: "Active Listings",
              value: products.length.toString(),
              icon: Zap,
              color: "text-green-500",
            },
            {
              label: "Stock Value",
              value: `₹${(products.reduce((acc, p) => acc + p.basePrice * p.totalStock, 0) / 100000).toFixed(1)}L`,
              icon: Package,
              color: "text-blue-500",
            },
            {
              label: "Archived Items",
              value: "0",
              icon: Archive,
              color: "text-zinc-400",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-8 bg-white rounded-[35px] border border-zinc-100 shadow-sm hover:shadow-xl transition-all flex items-center gap-6 group"
            >
              <div
                className={`w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center ${stat.color} group-hover:bg-zinc-900 group-hover:text-white transition-all`}
              >
                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                  {stat.label}
                </p>
                <h2 className="text-2xl font-black italic tracking-tight">
                  {stat.value}
                </h2>
              </div>
            </div>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-500">
            <AlertCircle className="text-red-500" size={18} />
            <p className="text-[10px] font-black uppercase tracking-widest text-red-600">
              {error}
            </p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-300 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="bg-white rounded-[35px] border border-zinc-100 p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="flex-1 relative w-full">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Search SKU, Name, Category..."
              className="w-full h-14 pl-14 pr-6 rounded-2xl bg-zinc-50/50 border border-zinc-50 focus:outline-none focus:bg-white focus:border-black text-[11px] font-black uppercase tracking-widest transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button
              onClick={fetchData}
              disabled={loading}
              className="h-14 px-6 md:px-8 bg-white border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-zinc-50 transition-all disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <RefreshCw size={18} />
              )}{" "}
              Sync Matrix
            </button>
          </div>
        </div>

        <div className="bg-white rounded-[45px] border border-zinc-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-20 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <Loader2 className="animate-spin text-black" size={64} />
                  <Zap
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-zinc-100"
                    size={24}
                  />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                  Authenticating Local Registry...
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#fcfcfc] border-b border-zinc-50">
                  <tr>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                      Identity
                    </th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-l border-zinc-50">
                      Gross Price
                    </th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-l border-zinc-50">
                      Units Avail
                    </th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 border-l border-zinc-50">
                      Terminal Status
                    </th>
                    <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {products
                    .filter(
                      (p) =>
                        p.title
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase()) ||
                        p.sku.toLowerCase().includes(searchTerm.toLowerCase()),
                    )
                    .map((prd, i) => (
                      <tr
                        key={prd._id}
                        className="group hover:bg-[#fafafa] transition-all duration-300"
                      >
                        <td className="px-10 py-8">
                          <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                              <img
                                src={formatAssetUrl(
                                  prd.thumbnail ||
                                  prd.images?.[0]
                                ) || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"}
                                alt={prd.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="space-y-1">
                              <p className="text-[11px] font-black uppercase tracking-tight text-zinc-900 leading-tight">
                                {prd.title}
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest italic">
                                  {prd.sku}
                                </span>
                                <div className="h-1 w-1 rounded-full bg-zinc-200" />
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                                  v{i + 1}.0
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-10 py-8 border-l border-zinc-50">
                          <span className="text-[11px] font-black italic tracking-tighter text-zinc-900">
                            ₹{prd.basePrice.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-10 py-8 border-l border-zinc-50">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${prd.totalStock > 10 ? "bg-green-500" : prd.totalStock > 0 ? "bg-amber-500" : "bg-red-500"} shadow-lg shadow-current/20`}
                            />
                            <span className="text-[11px] font-black text-zinc-600">
                              {prd.totalStock} Units
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-8 border-l border-zinc-50">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${prd.status === "active" ? "bg-green-500" : "bg-zinc-300"}`}
                            />
                            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">
                              {prd.status}
                            </span>
                          </div>
                        </td>
                        <td className="px-10 py-8 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="h-11 w-11 flex items-center justify-center hover:bg-black hover:text-white rounded-xl transition-all text-zinc-400 border border-transparent hover:border-black">
                                <MoreHorizontal size={20} />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 rounded-2xl shadow-2xl p-2 border-zinc-100"
                            >
                              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-4 py-3">
                                Management
                              </DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleOpenSheet(prd)}
                                className="p-3 rounded-xl cursor-pointer gap-3 text-[10px] font-black uppercase tracking-widest text-blue-600 focus:bg-blue-50"
                              >
                                <Edit3 size={16} /> Modify Content
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-zinc-50 mx-2" />
                              <DropdownMenuItem
                                onClick={() => handleDeleteSub(prd._id)}
                                className="p-3 rounded-xl cursor-pointer gap-3 text-[10px] font-black uppercase tracking-widest text-red-600 focus:bg-red-50"
                              >
                                <Trash2 size={16} /> Archive Product
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  {!loading && products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-32 text-center">
                        <Package
                          className="mx-auto text-zinc-100 mb-6"
                          size={64}
                        />
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-300">
                          No active assets registered in terminal.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="w-full sm:max-w-[700px] p-0 border-l border-zinc-100 shadow-2xl">
            <div className="h-full flex flex-col bg-white">
              <SheetHeader className="p-10 border-b border-zinc-50 space-y-1">
                <SheetTitle className="text-4xl font-black italic uppercase tracking-tighter leading-none">
                  {editingProduct ? "Modify Registry" : "Initialize Asset"}
                </SheetTitle>
                <SheetDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">
                  Global Merchant Catalog Provisioning Protocol
                </SheetDescription>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
                <form
                  id="product-form"
                  onSubmit={handleSubmit}
                  className="space-y-12"
                >
                  <div className="space-y-8">
                    <div className="grid gap-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        Asset Nomenclature
                      </Label>
                      <Input
                        required
                        placeholder="e.g. Ultra Horizon Pro 5G"
                        className="h-16 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white text-base"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                      />
                      {fieldErrors.title && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{fieldErrors.title}</p>}
                      {formData.title && (
                        <p className="text-[9px] font-bold text-zinc-300 uppercase italic">
                          Registry Slug: {formData.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="grid gap-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                          Categorical Class
                        </Label>
                        <select
                          required
                          className={`h-16 px-5 rounded-2xl border ${fieldErrors.categoryId ? 'border-red-500' : 'border-zinc-100'} bg-zinc-50/50 text-sm font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-black transition-all`}
                          value={formData.categoryId}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              categoryId: e.target.value,
                            })
                          }
                        >
                          <option value="">Select Category</option>
                          {categories.map((cat: any) => (
                            <optgroup
                              key={cat._id}
                              label={cat.name.toUpperCase()}
                              className="text-[8px] tracking-widest"
                            >
                              <option
                                value={cat._id}
                                className="text-sm font-bold"
                              >
                                {cat.name}
                              </option>
                              {cat.subcategories?.map((sub: any) => (
                                <option
                                  key={sub._id}
                                  value={sub._id}
                                  className="text-sm"
                                >
                                  -- {sub.name}
                                </option>
                              ))}
                            </optgroup>
                          ))}
                        </select>
                        {fieldErrors.categoryId && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{fieldErrors.categoryId}</p>}
                      </div>
                      <div className="grid gap-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                          Registry SKU
                        </Label>
                        <Input
                          required
                          placeholder="UH-PRO-001"
                          className={`h-16 rounded-2xl ${fieldErrors.sku ? 'border-red-500' : 'border-zinc-100'} bg-zinc-50/50 focus:bg-white text-base`}
                          value={formData.sku}
                          onChange={(e) =>
                            setFormData({ ...formData, sku: e.target.value })
                          }
                        />
                        {fieldErrors.sku && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{fieldErrors.sku}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="grid gap-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                          Principal Price (INR)
                        </Label>
                        <Input
                          required
                          type="number"
                          placeholder="0.00"
                          className={`h-16 rounded-2xl ${fieldErrors.basePrice ? 'border-red-500' : 'border-zinc-100'} bg-zinc-50/50 focus:bg-white text-base`}
                          value={formData.basePrice}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              basePrice: Number(e.target.value),
                            })
                          }
                        />
                        {fieldErrors.basePrice && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{fieldErrors.basePrice}</p>}
                      </div>
                      <div className="grid gap-4">
                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                          Inventory Units
                        </Label>
                        <Input
                          required
                          type="number"
                          placeholder="0"
                          className={`h-16 rounded-2xl ${fieldErrors.totalStock ? 'border-red-500' : 'border-zinc-100'} bg-zinc-50/50 focus:bg-white text-base`}
                          value={formData.totalStock}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              totalStock: Number(e.target.value),
                            })
                          }
                        />
                        {fieldErrors.totalStock && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{fieldErrors.totalStock}</p>}
                      </div>
                    </div>

                    <div className="grid gap-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        Brief Synopsis
                      </Label>
                      <Input
                        required
                        placeholder="Impactful summary for premium catalog previews"
                        className={`h-16 rounded-2xl ${fieldErrors.shortDescription ? 'border-red-500' : 'border-zinc-100'} bg-zinc-50/50 focus:bg-white text-base`}
                        value={formData.shortDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            shortDescription: e.target.value,
                          })
                        }
                      />
                      {fieldErrors.shortDescription && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{fieldErrors.shortDescription}</p>}
                    </div>

                    <div className="grid gap-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        Comprehensive Technical Manual
                      </Label>
                      <Textarea
                        required
                        placeholder="Deep-dive product specifications and narrative content..."
                        className={`min-h-[220px] rounded-[30px] ${fieldErrors.fullDescription ? 'border-red-500' : 'border-zinc-100'} bg-zinc-50/50 focus:bg-white text-base p-6 leading-relaxed`}
                        value={formData.fullDescription}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            fullDescription: e.target.value,
                          })
                        }
                      />
                      {fieldErrors.fullDescription && <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">{fieldErrors.fullDescription}</p>}
                    </div>

                    <div className="grid gap-4">
                      <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                        Global Search Tags (CSV)
                      </Label>
                      <Input
                        placeholder="premium, flagship, high-performance"
                        className="h-16 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white text-base"
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData({ ...formData, tags: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                           Asset Visuals
                         </Label>
                         <div className="flex gap-2">
                            <button
                               type="button"
                               onClick={() => {
                                 setUrlError(null);
                                 setUrlInput("");
                                 setIsUrlDialogOpen(true);
                               }}
                               className="px-4 py-2 border border-zinc-100 rounded-xl text-[9px] font-black uppercase hover:bg-zinc-50 flex items-center gap-2"
                            >
                               <LinkIcon size={12} /> Add via URL
                            </button>
                            <label className={`px-4 py-2 ${isUploading ? 'bg-zinc-100 text-zinc-400' : 'bg-black text-white'} rounded-xl text-[9px] font-black uppercase hover:bg-zinc-800 flex items-center gap-2 cursor-pointer shadow-xl shadow-black/10 transition-all`}>
                               {isUploading ? <Loader2 className="animate-spin" size={12} /> : <Upload size={12} />} 
                               {isUploading ? "Syncing..." : "Upload Binaries"}
                               <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                            </label>
                         </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                         {formData.images.map((img, idx) => (
                            <div key={idx} className={`relative aspect-square rounded-[25px] border-2 group overflow-hidden ${formData.thumbnail === img ? 'border-black' : 'border-zinc-100'}`}>
                               <img src={img} className="w-full h-full object-cover" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                                  <button
                                     type="button"
                                     onClick={() => setFormData({...formData, thumbnail: img})}
                                     className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                                     title="Set as Terminal Thumbnail"
                                  >
                                     <Zap size={14} className={formData.thumbnail === img ? "fill-black" : ""} />
                                  </button>
                                  <button
                                     type="button"
                                     onClick={() => removeImage(idx)}
                                     className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl"
                                  >
                                     <X size={14} />
                                  </button>
                               </div>
                               {formData.thumbnail === img && (
                                  <div className="absolute top-3 left-3 px-2 py-1 bg-black text-white text-[7px] font-black uppercase tracking-widest rounded-lg">
                                     Primary
                                  </div>
                               )}
                            </div>
                         ))}
                         {formData.images.length === 0 && (
                            <div className="col-span-3 h-40 rounded-[35px] border-2 border-dashed border-zinc-100 flex flex-col items-center justify-center gap-3">
                               <ImageIcon className="text-zinc-100" size={32} />
                               <p className="text-[9px] font-black uppercase tracking-widest text-zinc-300">No assets Provisioned</p>
                            </div>
                         )}
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="p-10 border-t border-zinc-50 flex items-center gap-6 bg-zinc-50/30">
                <Button
                  type="button"
                  variant="outline"
                  className="h-16 flex-1 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] border-zinc-200 hover:bg-white transition-all shadow-sm"
                  onClick={() => setIsSheetOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  form="product-form"
                  disabled={submitting}
                  className="h-16 flex-1 rounded-3xl bg-black text-white font-black uppercase tracking-[0.3em] text-[10px] hover:shadow-2xl shadow-black/30 hover:scale-[1.02] transition-all"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : editingProduct ? (
                    "Update Global Matrix"
                  ) : (
                    "Finalize Protocol"
                  )}
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* External Asset Provisioning Dialog */}
        <Dialog open={isUrlDialogOpen} onOpenChange={setIsUrlDialogOpen}>
          <DialogContent className="p-10 sm:rounded-[35px] border-zinc-100 bg-white">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-zinc-900">
                Asset URL Protocol
              </DialogTitle>
              <DialogDescription className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-2">
                Provisioning external media for the global storefront
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              <div className="grid gap-3">
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  External Destination Path
                </Label>
                <Input
                  placeholder="https://images.unsplash.com/source..."
                  className="h-16 rounded-2xl border-zinc-100 bg-zinc-50/50 focus:bg-white text-base"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    setUrlError(null);
                  }}
                  autoFocus
                />
                {urlError && (
                  <p className="text-[9px] font-black uppercase text-red-500 tracking-widest animate-in slide-in-from-top-2">
                    {urlError}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="mt-10 gap-3">
              <Button
                variant="outline"
                onClick={() => setIsUrlDialogOpen(false)}
                className="h-14 flex-1 rounded-2xl font-black uppercase text-[10px] tracking-widest border-zinc-100"
              >
                Terminate
              </Button>
              <Button
                onClick={handleAddUrl}
                className="h-14 flex-1 rounded-2xl bg-black text-white font-black uppercase text-[10px] tracking-widest hover:shadow-2xl shadow-black/20"
              >
                Provision Asset
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Diagnostic Error Summary Dialog */}
        <Dialog open={isErrorDialogOpen} onOpenChange={setIsErrorDialogOpen}>
          <DialogContent className="p-10 sm:rounded-[40px] border-zinc-100 bg-white">
            <DialogHeader className="mb-8">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 mb-6">
                 <AlertCircle size={28} />
              </div>
              <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter text-black">
                Registry Anomaly
              </DialogTitle>
              <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-red-400 mt-2">
                Critical data integrity mismatch detected
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
               <div className="bg-red-50/50 border border-red-100 rounded-[25px] p-8 space-y-4">
                  {Object.entries(fieldErrors).map(([field, msg]) => (
                    <div key={field} className="flex items-start gap-4 group">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                       <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-red-600">{field.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-[11px] font-bold text-zinc-900 leading-tight">{msg}</p>
                       </div>
                    </div>
                  ))}
                  {Object.keys(fieldErrors).length === 0 && error && (
                    <div className="flex items-start gap-4">
                       <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                       <p className="text-[11px] font-bold text-zinc-900 leading-tight">{error}</p>
                    </div>
                  )}
               </div>
               <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest text-center px-6">
                  Please synchronize your local inventory with the global marketplace protocols.
               </p>
            </div>

            <DialogFooter className="mt-12">
              <Button
                onClick={() => setIsErrorDialogOpen(false)}
                className="w-full h-18 rounded-[25px] bg-black text-white font-black uppercase text-[11px] tracking-[0.4em] hover:shadow-2xl shadow-black/20 hover:scale-[1.01] transition-all"
              >
                Acknowledge & Correct
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SellerLayout>
  );
}

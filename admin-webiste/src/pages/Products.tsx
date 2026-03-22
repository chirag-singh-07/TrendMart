import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  AlertTriangle,
  Layers,
  Star,
  TrendingUp,
  X,
  Loader2,
  CheckCircle,
  Ban,
  Package,
  RefreshCw,
} from "lucide-react";
import { productService, type Product } from "../services/productService";
import { categoryService, type Category } from "../services/categoryService";

const ITEMS_PER_PAGE = 12;

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Product | null>(null);
  const [statusModal, setStatusModal] = useState<{ product: Product; newStatus: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Stats
  const [stats, setStats] = useState({ totalProducts: 0, activeProducts: 0, outOfStockProducts: 0, draftProducts: 0 });

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = { page, limit: ITEMS_PER_PAGE };
      if (filterStatus !== "all") params.status = filterStatus;
      if (filterCategory !== "all") params.categoryId = filterCategory;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const data = await productService.getAll(params);
      setProducts(data.products);
      setTotalPages(data.pages);
    } catch {
      setError("Failed to load products. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterCategory, searchTerm]);

  const fetchCategories = async () => {
    try {
      const cats = await categoryService.getAll();
      setCategories(cats);
    } catch {}
  };

  const fetchStats = async () => {
    try {
      const s = await productService.getDashboardStats();
      setStats(s);
    } catch {}
  };

  useEffect(() => {
    fetchCategories();
    fetchStats();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await productService.delete(deleteConfirm._id);
      setDeleteConfirm(null);
      showToast("Product deleted successfully");
      fetchProducts();
      fetchStats();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete product", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!statusModal) return;
    setUpdatingStatus(true);
    try {
      await productService.updateStatus(statusModal.product._id, statusModal.newStatus);
      setStatusModal(null);
      showToast("Product status updated");
      fetchProducts();
      fetchStats();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to update status", "error");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await productService.toggleFeatured(product._id);
      showToast(`Product ${product.isFeatured ? "unfeatured" : "featured"}`);
      fetchProducts();
    } catch {
      showToast("Failed to toggle featured status", "error");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "draft": return "bg-zinc-100 text-zinc-600";
      case "out_of_stock": return "bg-red-100 text-red-700";
      case "banned": return "bg-purple-100 text-purple-700";
      default: return "bg-zinc-100 text-zinc-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle size={12} />;
      case "banned": return <Ban size={12} />;
      case "out_of_stock": return <Package size={12} />;
      default: return null;
    }
  };

  const getCategoryName = (p: Product) => {
    if (typeof p.categoryId === "object" && p.categoryId !== null) {
      return (p.categoryId as any).name;
    }
    return categories.find((c) => c._id === p.categoryId)?.name || "—";
  };

  const isLowStock = (p: Product) => p.totalStock > 0 && p.totalStock <= p.lowStockThreshold;

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg font-bold text-[11px] uppercase tracking-widest transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Products
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Manage all products across the platform
          </p>
        </div>
        <button
          onClick={fetchProducts}
          className="px-6 py-3 border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center gap-2 w-fit"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.totalProducts, color: "text-zinc-900", bg: "bg-zinc-50" },
          { label: "Active", value: stats.activeProducts, color: "text-green-600", bg: "bg-green-50" },
          { label: "Out of Stock", value: stats.outOfStockProducts, color: "text-red-600", bg: "bg-red-50" },
          { label: "Drafts", value: stats.draftProducts, color: "text-zinc-500", bg: "bg-zinc-50" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} rounded-2xl border border-zinc-200 p-5`}>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500 mb-2">{s.label}</p>
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              placeholder="Search products..."
              className="w-full h-10 pl-11 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
            className="h-10 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
            className="h-10 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-500" />
          <p className="text-[10px] font-bold text-red-700">{error}</p>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-zinc-400" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200">
          <Box size={48} className="mx-auto text-zinc-200 mb-4" />
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-zinc-400 hover:shadow-md transition-all group"
            >
              {/* Image */}
              <div className="relative h-44 bg-zinc-100 overflow-hidden">
                {product.thumbnail ? (
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Box size={32} className="text-zinc-300" />
                  </div>
                )}
                {isLowStock(product) && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase">
                    Low Stock
                  </div>
                )}
                {product.isFeatured && (
                  <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded-lg text-[8px] font-black uppercase flex items-center gap-1">
                    <Star size={10} fill="white" /> Featured
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{getCategoryName(product)}</p>
                <h3 className="font-black text-[11px] tracking-tight line-clamp-2">{product.title}</h3>

                <div className="flex items-center justify-between">
                  <p className="font-black text-[13px]">₹{product.basePrice.toLocaleString()}</p>
                  <p className="text-[9px] text-zinc-500">Stock: {product.totalStock}</p>
                </div>

                {product.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star size={10} className="text-yellow-500" fill="#EAB308" />
                    <span className="text-[9px] font-bold text-zinc-600">{product.averageRating.toFixed(1)}</span>
                    <span className="text-[8px] text-zinc-400">({product.totalReviews})</span>
                  </div>
                )}

                <span className={`inline-flex items-center gap-1 text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${getStatusColor(product.status)}`}>
                  {getStatusIcon(product.status)}
                  {product.status.replace("_", " ")}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 pt-2 border-t border-zinc-100">
                  <button
                    onClick={() => setViewProduct(product)}
                    className="flex-1 py-2 text-[8px] font-black uppercase rounded-lg hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1"
                    title="View Details"
                  >
                    <Eye size={11} /> View
                  </button>
                  <button
                    onClick={() =>
                      setStatusModal({
                        product,
                        newStatus: product.status === "active" ? "draft" : "active",
                      })
                    }
                    className="flex-1 py-2 text-[8px] font-black uppercase rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 text-blue-600"
                    title="Change Status"
                  >
                    <Edit2 size={11} /> Status
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(product)}
                    className={`flex-1 py-2 text-[8px] font-black uppercase rounded-lg transition-colors flex items-center justify-center gap-1 ${
                      product.isFeatured ? "hover:bg-yellow-50 text-yellow-600" : "hover:bg-zinc-100 text-zinc-600"
                    }`}
                    title="Toggle Featured"
                  >
                    <TrendingUp size={11} />
                    {product.isFeatured ? "Unfeature" : "Feature"}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(product)}
                    className="flex-1 py-2 text-[8px] font-black uppercase rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1 text-red-500"
                    title="Delete"
                  >
                    <Trash2 size={11} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-[10px] font-black transition-all ${
                p === page ? "bg-black text-white" : "bg-white border border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* ── View Modal ── */}
      {viewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-8 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">{viewProduct.title}</h2>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-1">SKU: {viewProduct.sku}</p>
                </div>
                <button onClick={() => setViewProduct(null)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              {viewProduct.thumbnail && (
                <img src={viewProduct.thumbnail} alt={viewProduct.title} className="w-full h-56 object-cover rounded-2xl" />
              )}

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Base Price", value: `₹${viewProduct.basePrice.toLocaleString()}` },
                  { label: "Sale Price", value: viewProduct.salePrice ? `₹${viewProduct.salePrice.toLocaleString()}` : "—" },
                  { label: "Total Stock", value: viewProduct.totalStock },
                  { label: "Status", value: viewProduct.status },
                  { label: "Brand", value: viewProduct.brand || "—" },
                  { label: "Category", value: getCategoryName(viewProduct) },
                  { label: "Rating", value: `${viewProduct.averageRating.toFixed(1)} (${viewProduct.totalReviews} reviews)` },
                  { label: "Total Sales", value: viewProduct.totalSales },
                  { label: "Views", value: viewProduct.viewCount },
                  { label: "Featured", value: viewProduct.isFeatured ? "Yes" : "No" },
                ].map((item) => (
                  <div key={item.label} className="bg-zinc-50 rounded-xl p-4">
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-1">{item.label}</p>
                    <p className="text-[12px] font-black">{String(item.value)}</p>
                  </div>
                ))}
              </div>

              <div className="bg-zinc-50 rounded-xl p-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Short Description</p>
                <p className="text-[11px] text-zinc-700">{viewProduct.shortDescription}</p>
              </div>

              {viewProduct.tags.length > 0 && (
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {viewProduct.tags.map((tag) => (
                      <span key={tag} className="text-[8px] font-bold px-3 py-1 bg-zinc-100 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => { setDeleteConfirm(viewProduct); setViewProduct(null); }}
                  className="px-6 py-2 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-colors"
                >
                  Delete Product
                </button>
                <button
                  onClick={() => setViewProduct(null)}
                  className="px-6 py-2 border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Status Update Modal ── */}
      {statusModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 space-y-6">
            <h3 className="text-xl font-black uppercase tracking-tighter">Update Status</h3>
            <p className="text-[11px] text-zinc-600">
              Change <strong>{statusModal.product.title}</strong> status to:
            </p>
            <select
              value={statusModal.newStatus}
              onChange={(e) => setStatusModal({ ...statusModal, newStatus: e.target.value })}
              className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-[10px] font-bold uppercase focus:outline-none focus:border-black"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="banned">Banned</option>
            </select>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setStatusModal(null)} className="px-6 py-2 border border-zinc-200 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-50">Cancel</button>
              <button
                onClick={handleStatusUpdate}
                disabled={updatingStatus}
                className="px-6 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase hover:bg-zinc-800 disabled:opacity-50 flex items-center gap-2"
              >
                {updatingStatus && <Loader2 size={14} className="animate-spin" />}
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">Delete Product</h3>
                <p className="text-[10px] text-zinc-500 font-bold uppercase mt-1">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-[12px] text-zinc-600">
              Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>? All product data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 border border-zinc-200 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting && <Loader2 size={14} className="animate-spin" />}
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;

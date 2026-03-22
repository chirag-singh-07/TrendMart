import React, { useState, useEffect } from "react";
import {
  Layers,
  Plus,
  Edit2,
  Trash2,
  Search,
  Package,
  AlertTriangle,
  X,
  Loader2,
  CheckCircle,
  Image as ImageIcon,
  RefreshCw,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { categoryService, type Category, type CreateCategoryPayload } from "../services/categoryService";

const emptyForm: CreateCategoryPayload = {
  name: "",
  slug: "",
  description: "",
  parentCategoryId: null,
  image: "",
  displayOrder: 0,
  isActive: true,
};

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Category | null>(null);
  const [form, setForm] = useState<CreateCategoryPayload>(emptyForm);
  const [formError, setFormError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageInputMode, setImageInputMode] = useState<"url" | "upload">("url");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch {
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const filteredCategories = categories.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" ? c.isActive : !c.isActive);
    return matchesSearch && matchesStatus;
  });

  const openAddForm = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setImageInputMode("url");
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (cat: Category) => {
    setEditTarget(cat);
    setForm({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      parentCategoryId: cat.parentCategoryId
        ? (cat.parentCategoryId as any)._id || cat.parentCategoryId
        : null,
      image: cat.image || "",
      displayOrder: cat.displayOrder,
      isActive: cat.isActive,
    });
    setSelectedFile(null);
    setImageInputMode(cat.image?.startsWith("http") ? "url" : "url"); // Default to URL for existing
    setFormError("");
    setShowForm(true);
  };

  const handleSlugify = (name: string) => {
    return name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  const handleNameChange = (val: string) => {
    setForm((f) => ({
      ...f,
      name: val,
      slug: editTarget ? f.slug : handleSlugify(val),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.slug.trim()) {
      setFormError("Name and slug are required.");
      return;
    }

    setSaving(true);
    try {
      let finalForm = { ...form };

      // Handle Image Upload if in upload mode
      if (imageInputMode === "upload" && selectedFile) {
        try {
          const uploadedUrl = await categoryService.uploadImage(selectedFile);
          finalForm.image = uploadedUrl;
        } catch (err: any) {
          setFormError("Image upload failed: " + (err.response?.data?.message || "Unknown error"));
          setSaving(false);
          return;
        }
      }

      if (editTarget) {
        await categoryService.update(editTarget._id, finalForm);
        showToast("Category updated successfully");
      } else {
        await categoryService.create(finalForm);
        showToast("Category created successfully");
      }
      setShowForm(false);
      fetchCategories();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        showToast("File size must be less than 2MB", "error");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await categoryService.delete(deleteConfirm._id);
      setDeleteConfirm(null);
      showToast("Category deleted successfully");
      fetchCategories();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete category", "error");
    } finally {
      setDeleting(false);
    }
  };

  const getParentName = (cat: Category) => {
    if (!cat.parentCategoryId) return null;
    if (typeof cat.parentCategoryId === "object") return (cat.parentCategoryId as any).name;
    return categories.find((c) => c._id === (cat.parentCategoryId as any))?.name || "Parent";
  };

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg font-bold text-[11px] uppercase tracking-widest ${toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Categories</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Create and organize product categories
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCategories}
            className="px-5 py-3 border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center gap-2"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={openAddForm}
            className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Add Category
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: categories.length, color: "text-zinc-900" },
          { label: "Active", value: categories.filter((c) => c.isActive).length, color: "text-green-600" },
          { label: "Inactive", value: categories.filter((c) => !c.isActive).length, color: "text-zinc-400" },
          { label: "Root", value: categories.filter((c) => c.level === 0).length, color: "text-blue-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-zinc-200 p-4">
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
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search categories..."
              className="w-full h-10 pl-11 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-10 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-[10px] font-bold focus:outline-none focus:border-black"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
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

      {/* Categories Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-zinc-400" />
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200">
          <Layers size={48} className="mx-auto text-zinc-200 mb-4" />
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">No categories found</p>
          <button onClick={openAddForm} className="mt-4 px-6 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800">
            Add First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <div
              key={category._id}
              className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-zinc-400 hover:shadow-md transition-all group"
            >
              {/* Image */}
              <div className="relative h-40 bg-zinc-100 overflow-hidden">
                {category.image ? (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={32} className="text-zinc-300" />
                  </div>
                )}
                <div className={`absolute top-3 right-3 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${category.isActive ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                  {category.isActive ? "Active" : "Inactive"}
                </div>
                {category.level > 0 && (
                  <div className="absolute top-3 left-3 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                    Sub-Category
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div>
                  <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest">{category.slug}</p>
                  <h3 className="font-black text-[13px] tracking-tight mt-1">{category.name}</h3>
                  {getParentName(category) && (
                    <p className="text-[9px] text-zinc-500 mt-1">Parent: <strong>{getParentName(category)}</strong></p>
                  )}
                </div>

                {category.description && (
                  <p className="text-[10px] text-zinc-500 line-clamp-2">{category.description}</p>
                )}

                <div className="flex items-center gap-2 py-3 border-y border-zinc-100">
                  <Package size={13} className="text-zinc-400" />
                  <p className="text-[9px] font-bold text-zinc-600">Display Order: {category.displayOrder}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditForm(category)}
                    className="flex-1 py-2 text-[8px] font-black uppercase rounded-xl hover:bg-zinc-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(category)}
                    className="flex-1 py-2 text-[8px] font-black uppercase rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-1 text-red-500"
                  >
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add/Edit Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  {editTarget ? "Edit Category" : "New Category"}
                </h2>
                <button onClick={() => setShowForm(false)} className="p-2 hover:bg-zinc-100 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-[10px] font-bold text-red-700 flex items-center gap-2">
                    <AlertTriangle size={14} /> {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g., Electronics"
                      required
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                      Slug *
                    </label>
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="e.g., electronics"
                      required
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Category description..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                      Parent Category
                    </label>
                    <select
                      value={form.parentCategoryId || ""}
                      onChange={(e) => setForm({ ...form, parentCategoryId: e.target.value || null })}
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold"
                    >
                      <option value="">None (Root Category)</option>
                      {categories
                        .filter((c) => c._id !== editTarget?._id && c.level === 0)
                        .map((c) => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={form.displayOrder}
                      onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                      min={0}
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      Category Image
                    </label>
                    <div className="flex bg-zinc-100 p-1 rounded-lg gap-1">
                      <button
                        type="button"
                        onClick={() => setImageInputMode("url")}
                        className={`px-3 py-1 rounded-md text-[8px] font-black uppercase transition-all flex items-center gap-1.5 ${imageInputMode === "url" ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-zinc-700"}`}
                      >
                        <LinkIcon size={10} /> URL
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputMode("upload")}
                        className={`px-3 py-1 rounded-md text-[8px] font-black uppercase transition-all flex items-center gap-1.5 ${imageInputMode === "upload" ? "bg-white shadow-sm text-black" : "text-zinc-500 hover:text-zinc-700"}`}
                      >
                        <Upload size={10} /> Upload
                      </button>
                    </div>
                  </div>

                  {imageInputMode === "url" ? (
                    <div className="space-y-3">
                      <input
                        type="url"
                        value={form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold"
                      />
                      {form.image && (
                        <div className="relative h-32 rounded-2xl overflow-hidden border border-zinc-200 group">
                          <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button type="button" onClick={() => setForm({ ...form, image: "" })} className="p-2 bg-white rounded-full text-red-600 shadow-lg">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div
                        onClick={() => document.getElementById("file-upload")?.click()}
                        className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${selectedFile ? "border-green-400 bg-green-50" : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"}`}
                      >
                        <input
                          id="file-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        {selectedFile ? (
                          <>
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-1">
                              <CheckCircle size={20} className="text-green-600" />
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-black uppercase text-green-700 truncate max-w-[200px]">{selectedFile.name}</p>
                              <p className="text-[9px] text-green-600 mt-1 uppercase font-bold">{(selectedFile.size / 1024).toFixed(0)} KB</p>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                              className="px-3 py-1 bg-white border border-green-200 rounded-lg text-[8px] font-black uppercase text-red-500 hover:bg-red-50 transition-colors"
                            >
                              Remove
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center mb-1">
                              <Upload size={20} className="text-zinc-400" />
                            </div>
                            <div className="text-center">
                              <p className="text-[10px] font-black uppercase tracking-widest text-black">Click to select image</p>
                              <p className="text-[9px] text-zinc-400 mt-1 uppercase font-bold">JPG, PNG, WebP up to 2MB</p>
                            </div>
                          </>
                        )}
                      </div>
                      {selectedFile && (
                        <div className="h-32 rounded-2xl overflow-hidden border border-zinc-200">
                          <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 accent-black"
                  />
                  <label htmlFor="isActive" className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                    Active (visible to users)
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 border border-zinc-200 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    {editTarget ? "Save Changes" : "Create Category"}
                  </button>
                </div>
              </form>
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
                <h3 className="text-xl font-black uppercase tracking-tighter">Delete Category</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-bold mt-1">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-[12px] text-zinc-600">
              Are you sure you want to delete <strong>"{deleteConfirm.name}"</strong>? This will fail if products are still assigned to this category.
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

export default Categories;

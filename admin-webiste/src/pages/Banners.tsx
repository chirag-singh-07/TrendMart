import React, { useState, useEffect } from "react";
import {
  Image,
  Plus,
  Edit2,
  Trash2,
  Eye,
  X,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Link2,
  Calendar,
  MonitorSmartphone,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Globe,
  Upload,
  Link as LinkIcon,
} from "lucide-react";
import { offerService, type Banner, type CreateBannerPayload } from "../services/offerService";

const emptyForm: CreateBannerPayload = {
  title: "",
  image: "",
  redirectUrl: "",
  targetAudience: "all",
  appTarget: "home",
  startDate: "",
  endDate: "",
  isActive: true,
};

const appTargetOptions = [
  { value: "home", label: "Home Screen" },
  { value: "category", label: "Category Page" },
  { value: "product", label: "Product Page" },
  { value: "checkout", label: "Checkout Page" },
];

const audienceOptions = [
  { value: "all", label: "All Users" },
  { value: "buyers", label: "Buyers" },
  { value: "sellers", label: "Sellers" },
  { value: "new_users", label: "New Users" },
  { value: "premium", label: "Premium Users" },
];

const Banners: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [filterAppTarget, setFilterAppTarget] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Banner | null>(null);
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Banner | null>(null);
  const [form, setForm] = useState<CreateBannerPayload>(emptyForm);
  const [formError, setFormError] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageInputMode, setImageInputMode] = useState<"url" | "upload">("url");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBanners = async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = {};
      if (filterAppTarget !== "all") params.appTarget = filterAppTarget;
      if (filterStatus !== "all") params.isActive = filterStatus === "active";
      const data = await offerService.getAll(params);
      setBanners(data);
    } catch {
      setError("Failed to load offer banners.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBanners(); }, [filterAppTarget, filterStatus]);

  const filteredBanners = banners;

  const openAddForm = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setSelectedFile(null);
    setImageInputMode("url");
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (banner: Banner) => {
    setEditTarget(banner);
    setForm({
      title: banner.title,
      image: banner.image,
      redirectUrl: banner.redirectUrl || "",
      targetAudience: banner.targetAudience,
      appTarget: banner.appTarget,
      startDate: banner.startDate.slice(0, 10),
      endDate: banner.endDate.slice(0, 10),
      isActive: banner.isActive,
    });
    setSelectedFile(null);
    setImageInputMode(banner.image?.startsWith("http") ? "url" : "url");
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.title || (!form.image && !selectedFile) || !form.appTarget || !form.startDate || !form.endDate) {
      setFormError("Title, Image, App Target, Start Date and End Date are required.");
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setFormError("End date cannot be before start date.");
      return;
    }

    setSaving(true);
    try {
      let finalForm = { ...form };

      // Handle Image Upload if in upload mode
      if (imageInputMode === "upload" && selectedFile) {
        try {
          const uploadedUrl = await offerService.uploadImage(selectedFile);
          finalForm.image = uploadedUrl;
        } catch (err: any) {
          setFormError("Image upload failed: " + (err.response?.data?.message || "Unknown error"));
          setSaving(false);
          return;
        }
      }

      if (editTarget) {
        await offerService.update(editTarget._id, finalForm);
        showToast("Banner updated successfully");
      } else {
        await offerService.create(finalForm);
        showToast("Banner created successfully");
      }
      setShowForm(false);
      fetchBanners();
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

  const handleToggle = async (banner: Banner) => {
    try {
      await offerService.toggleStatus(banner._id);
      showToast(`Banner ${banner.isActive ? "deactivated" : "activated"}`);
      fetchBanners();
    } catch {
      showToast("Failed to toggle status", "error");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await offerService.delete(deleteConfirm._id);
      setDeleteConfirm(null);
      showToast("Banner deleted successfully");
      fetchBanners();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete banner", "error");
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const isExpired = (d: string) => new Date(d) < new Date();

  const getStatusBadge = (banner: Banner) => {
    if (!banner.isActive) return { label: "Inactive", cls: "bg-zinc-100 text-zinc-500" };
    if (isExpired(banner.endDate)) return { label: "Expired", cls: "bg-red-100 text-red-600" };
    if (new Date(banner.startDate) > new Date()) return { label: "Scheduled", cls: "bg-blue-100 text-blue-600" };
    return { label: "Live", cls: "bg-green-100 text-green-700" };
  };

  const activeBanners = banners.filter((b) => b.isActive && !isExpired(b.endDate));
  const expiredBanners = banners.filter((b) => isExpired(b.endDate));

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
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Offer Banners</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Manage promotional banners for website & mobile app
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchBanners}
            className="px-5 py-3 border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center gap-2"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={openAddForm}
            className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2"
          >
            <Plus size={18} /> Add Banner
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total", value: banners.length, color: "text-zinc-900" },
          { label: "Live", value: activeBanners.length, color: "text-green-600" },
          { label: "Inactive", value: banners.filter((b) => !b.isActive).length, color: "text-zinc-400" },
          { label: "Expired", value: expiredBanners.length, color: "text-red-500" },
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
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">App Target</label>
            <select
              value={filterAppTarget}
              onChange={(e) => setFilterAppTarget(e.target.value)}
              className="w-full h-10 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-[10px] font-bold focus:outline-none focus:border-black"
            >
              <option value="all">All Screens</option>
              {appTargetOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full h-10 px-4 rounded-xl bg-zinc-50 border border-zinc-200 text-[10px] font-bold focus:outline-none focus:border-black"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
          <AlertTriangle size={20} className="text-red-500" />
          <p className="text-[10px] font-bold text-red-700">{error}</p>
        </div>
      )}

      {/* Banners List */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={32} className="animate-spin text-zinc-400" />
        </div>
      ) : filteredBanners.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-zinc-200">
          <Image size={48} className="mx-auto text-zinc-200 mb-4" />
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">No banners found</p>
          <button onClick={openAddForm} className="mt-4 px-6 py-2 bg-black text-white rounded-xl text-[10px] font-black uppercase hover:bg-zinc-800">
            Create First Banner
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBanners.map((banner) => {
            const badge = getStatusBadge(banner);
            return (
              <div
                key={banner._id}
                className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:border-zinc-400 hover:shadow-md transition-all group"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="w-full md:w-64 h-44 bg-zinc-100 overflow-hidden flex-shrink-0 relative">
                    {banner.image ? (
                      <img
                        src={banner.image}
                        alt={banner.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Image size={32} className="text-zinc-300" />
                      </div>
                    )}
                    <div className={`absolute top-3 left-3 text-[8px] font-black uppercase px-3 py-1 rounded-full ${badge.cls}`}>
                      {badge.label}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-black text-[14px] tracking-tight">{banner.title}</h3>
                          {banner.redirectUrl && (
                            <div className="flex items-center gap-2 mt-1">
                              <Link2 size={11} className="text-zinc-400" />
                              <p className="text-[9px] text-zinc-500 truncate max-w-xs">{banner.redirectUrl}</p>
                            </div>
                          )}
                        </div>
                        {/* Toggle */}
                        <button onClick={() => handleToggle(banner)} className="flex-shrink-0">
                          {banner.isActive
                            ? <ToggleRight size={28} className="text-green-500" />
                            : <ToggleLeft size={28} className="text-zinc-300" />}
                        </button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-zinc-100">
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 mb-1 flex items-center gap-1">
                            <MonitorSmartphone size={10} /> App Screen
                          </p>
                          <p className="text-[10px] font-black capitalize">
                            {appTargetOptions.find((o) => o.value === banner.appTarget)?.label}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 mb-1 flex items-center gap-1">
                            <Globe size={10} /> Audience
                          </p>
                          <p className="text-[10px] font-black capitalize">
                            {audienceOptions.find((o) => o.value === banner.targetAudience)?.label}
                          </p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 mb-1 flex items-center gap-1">
                            <Calendar size={10} /> Start
                          </p>
                          <p className="text-[10px] font-black">{formatDate(banner.startDate)}</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-black uppercase text-zinc-400 mb-1 flex items-center gap-1">
                            <Calendar size={10} /> End
                          </p>
                          <p className={`text-[10px] font-black ${isExpired(banner.endDate) ? "text-red-500" : ""}`}>
                            {formatDate(banner.endDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-zinc-100">
                      <button
                        onClick={() => setPreviewBanner(banner)}
                        className="px-4 py-2 text-[8px] font-black uppercase rounded-xl hover:bg-zinc-100 transition-colors flex items-center gap-1"
                      >
                        <Eye size={12} /> Preview
                      </button>
                      <button
                        onClick={() => openEditForm(banner)}
                        className="px-4 py-2 text-[8px] font-black uppercase rounded-xl hover:bg-blue-50 transition-colors flex items-center gap-1 text-blue-600"
                      >
                        <Edit2 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(banner)}
                        className="px-4 py-2 text-[8px] font-black uppercase rounded-xl hover:bg-red-50 transition-colors flex items-center gap-1 text-red-500"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Add/Edit Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  {editTarget ? "Edit Banner" : "New Offer Banner"}
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

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Banner Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g., Summer Sale 50% Off"
                    required
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                      Banner Image *
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
                        placeholder="https://example.com/banner.jpg"
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
                        onClick={() => document.getElementById("banner-upload")?.click()}
                        className={`cursor-pointer border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all ${selectedFile ? "border-green-400 bg-green-50" : "border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50"}`}
                      >
                        <input
                          id="banner-upload"
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
                              <p className="text-[10px] font-black uppercase tracking-widest text-black">Click to select banner image</p>
                              <p className="text-[9px] text-zinc-400 mt-1 uppercase font-bold">JPG, PNG, WebP up to 2MB</p>
                            </div>
                          </>
                        )}
                      </div>
                      {selectedFile && (
                        <div className="h-40 rounded-2xl overflow-hidden border border-zinc-200">
                          <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Redirect URL</label>
                  <input
                    type="text"
                    value={form.redirectUrl}
                    onChange={(e) => setForm({ ...form, redirectUrl: e.target.value })}
                    placeholder="e.g., /sale/summer"
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">App Target *</label>
                    <select
                      value={form.appTarget}
                      onChange={(e) => setForm({ ...form, appTarget: e.target.value as any })}
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold"
                    >
                      {appTargetOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Target Audience</label>
                    <select
                      value={form.targetAudience}
                      onChange={(e) => setForm({ ...form, targetAudience: e.target.value as any })}
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold"
                    >
                      {audienceOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">Start Date *</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      required
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">End Date *</label>
                    <input
                      type="date"
                      value={form.endDate}
                      min={form.startDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      required
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="bannerActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-4 h-4 accent-black"
                  />
                  <label htmlFor="bannerActive" className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
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
                    {editTarget ? "Save Changes" : "Create Banner"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Preview Modal ── */}
      {previewBanner && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="relative">
              {previewBanner.image ? (
                <img src={previewBanner.image} alt={previewBanner.title} className="w-full h-72 object-cover" />
              ) : (
                <div className="w-full h-72 bg-zinc-100 flex items-center justify-center">
                  <Image size={48} className="text-zinc-300" />
                </div>
              )}
              <button
                onClick={() => setPreviewBanner(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-xl hover:bg-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-black uppercase tracking-tighter">{previewBanner.title}</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "App Screen", value: appTargetOptions.find((o) => o.value === previewBanner.appTarget)?.label },
                  { label: "Audience", value: audienceOptions.find((o) => o.value === previewBanner.targetAudience)?.label },
                  { label: "Start", value: formatDate(previewBanner.startDate) },
                  { label: "End", value: formatDate(previewBanner.endDate) },
                ].map((item) => (
                  <div key={item.label} className="bg-zinc-50 rounded-xl p-3">
                    <p className="text-[9px] font-black uppercase text-zinc-400 mb-1">{item.label}</p>
                    <p className="text-[11px] font-black">{item.value}</p>
                  </div>
                ))}
              </div>
              {previewBanner.redirectUrl && (
                <div className="flex items-center gap-2 bg-zinc-50 rounded-xl p-3">
                  <Link2 size={14} className="text-zinc-400" />
                  <p className="text-[10px] text-zinc-600">{previewBanner.redirectUrl}</p>
                </div>
              )}
              <button
                onClick={() => setPreviewBanner(null)}
                className="w-full py-3 border border-zinc-200 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-50"
              >
                Close Preview
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
                <h3 className="text-xl font-black uppercase tracking-tighter">Delete Banner</h3>
                <p className="text-[10px] text-zinc-500 uppercase font-bold mt-1">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-[12px] text-zinc-600">
              Are you sure you want to delete <strong>"{deleteConfirm.title}"</strong>?
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

export default Banners;

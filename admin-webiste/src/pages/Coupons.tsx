import React, { useState, useEffect } from "react";
import {
  Ticket,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle,
  AlertTriangle,
  X,
  Loader2,
  RefreshCw,
  Calendar,
  DollarSign,
  Percent,
  Users,
  ArrowRight,
} from "lucide-react";
import { couponService, type Coupon, type CreateCouponPayload } from "../services/couponService";

const emptyForm: CreateCouponPayload = {
  code: "",
  description: "",
  discountType: "percentage",
  discountValue: 0,
  minOrderAmount: 0,
  usageLimit: 100,
  perUserLimit: 1,
  startDate: new Date().toISOString().split("T")[0],
  expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  isActive: true,
};

const Coupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<Coupon | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<Coupon | null>(null);
  const [form, setForm] = useState<CreateCouponPayload>(emptyForm);
  const [formError, setFormError] = useState("");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchCoupons = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await couponService.getAll();
      setCoupons(data);
    } catch {
      setError("Failed to load coupons.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const filteredCoupons = (coupons || []).filter((c) => {
    const matchesSearch =
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.description || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || c.discountType === filterType;
    const matchesStatus =
      filterStatus === "all" || (filterStatus === "active" ? c.isActive : !c.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const openAddForm = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (coupon: Coupon) => {
    setEditTarget(coupon);
    setForm({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit,
      perUserLimit: coupon.perUserLimit,
      startDate: coupon.startDate.split("T")[0],
      expiresAt: coupon.expiresAt.split("T")[0],
      isActive: coupon.isActive,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.code.trim()) {
      setFormError("Coupon code is required.");
      return;
    }

    setSaving(true);
    try {
      if (editTarget) {
        await couponService.update(editTarget._id, form);
        showToast("Coupon updated successfully");
      } else {
        await couponService.create(form);
        showToast("Coupon created successfully");
      }
      setShowForm(false);
      fetchCoupons();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "An error occurred.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await couponService.delete(deleteConfirm._id);
      setDeleteConfirm(null);
      showToast("Coupon deleted successfully");
      fetchCoupons();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to delete coupon", "error");
    } finally {
      setDeleting(false);
    }
  };

  const handleToggle = async (coupon: Coupon) => {
    try {
      await couponService.toggleStatus(coupon._id);
      showToast(`Coupon ${coupon.isActive ? "deactivated" : "activated"}`);
      fetchCoupons();
    } catch {
      showToast("Failed to toggle status", "error");
    }
  };

  const isExpired = (date: string) => new Date(date) < new Date();

  return (
    <div className="space-y-8 pb-10">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg font-bold text-[11px] uppercase tracking-widest ${
            toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Coupons</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Generate and manage discounts for your customers
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchCoupons}
            className="px-5 py-3 border border-zinc-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center gap-2"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={openAddForm}
            className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-black/10"
          >
            <Plus size={18} /> Create Coupon
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Coupons", value: (coupons || []).length, icon: Ticket, color: "zinc" },
          { label: "Active Now", value: (coupons || []).filter(c => c.isActive && !isExpired(c.expiresAt)).length, icon: CheckCircle, color: "green" },
          { label: "Expired", value: (coupons || []).filter(c => isExpired(c.expiresAt)).length, icon: Calendar, color: "red" },
          { label: "Total Redemptions", value: (coupons || []).reduce((sum, c) => sum + (c.usedCount || 0), 0), icon: Users, color: "blue" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-zinc-200 p-6 flex items-start justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">{s.label}</p>
              <p className={`text-3xl font-black text-${s.color}-600`}>{s.value}</p>
            </div>
            <div className={`p-2 bg-${s.color}-50 rounded-xl text-${s.color}-600`}>
              <s.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by code or description..."
              className="w-full h-12 pl-11 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold uppercase tracking-widest placeholder:text-zinc-400"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-12 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-black"
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage</option>
            <option value="flat">Flat Amount</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="h-12 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-black"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-20">
            <Loader2 size={32} className="animate-spin text-zinc-400" />
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border border-zinc-200">
            <Ticket size={48} className="mx-auto text-zinc-200 mb-4" />
            <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">No coupons found</p>
          </div>
        ) : (
          filteredCoupons.map((coupon) => (
            <div
              key={coupon._id}
              className={`bg-white rounded-3xl border ${
                coupon.isActive && !isExpired(coupon.expiresAt)
                  ? "border-zinc-200"
                  : "border-zinc-100 opacity-80"
              } overflow-hidden hover:border-black hover:shadow-xl transition-all group`}
            >
              {/* Card Header */}
              <div className="p-6 border-b border-zinc-100 bg-zinc-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    coupon.discountType === 'percentage' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                  }`}>
                    {coupon.discountType === 'percentage' ? <Percent size={18} /> : <DollarSign size={18} />}
                  </div>
                  <div>
                    <h3 className="font-black text-[13px] tracking-tight group-hover:text-black">
                      {coupon.code}
                    </h3>
                    <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-widest">
                      {coupon.discountType} Discount
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                   <span className={`text-[15px] font-black ${
                     coupon.discountType === 'percentage' ? 'text-orange-600' : 'text-green-600'
                   }`}>
                     {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                   </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {coupon.description && (
                  <p className="text-[10px] text-zinc-500 font-medium leading-relaxed italic">
                    "{coupon.description}"
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
                    <p className="text-[8px] font-black uppercase text-zinc-400 mb-1">Used</p>
                    <p className="text-[11px] font-black flex items-center gap-2">
                      <Users size={12} className="text-zinc-400" />
                      {coupon.usedCount} / {coupon.usageLimit || '∞'}
                    </p>
                  </div>
                  <div className="bg-zinc-50 rounded-2xl p-3 border border-zinc-100">
                    <p className="text-[8px] font-black uppercase text-zinc-400 mb-1">Min Order</p>
                    <p className="text-[11px] font-black">₹{coupon.minOrderAmount || 0}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[9px] font-black text-zinc-500 bg-white border border-zinc-100 rounded-xl px-4 py-2 uppercase tracking-widest">
                  <div className="flex items-center gap-2">
                    <Calendar size={12} />
                    <span>Starts {new Date(coupon.startDate).toLocaleDateString()}</span>
                  </div>
                  <ArrowRight size={10} className="text-zinc-300" />
                  <div className={`flex items-center gap-2 ${isExpired(coupon.expiresAt) ? 'text-red-500' : ''}`}>
                    <Calendar size={12} />
                    <span>Expires {new Date(coupon.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={() => openEditForm(coupon)}
                    className="flex-1 py-3 bg-zinc-50 text-black border border-zinc-200 rounded-xl text-[8px] font-black uppercase hover:bg-black hover:text-white hover:border-black transition-all flex items-center justify-center gap-2"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleToggle(coupon)}
                    className={`flex-1 py-3 border rounded-xl text-[8px] font-black uppercase transition-all flex items-center justify-center gap-2 ${
                      coupon.isActive 
                        ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-600 hover:text-white' 
                        : 'bg-zinc-100 text-zinc-500 border-zinc-200 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    {coupon.isActive ? 'Active' : 'Deactive'}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(coupon)}
                    className="w-12 h-12 border border-zinc-200 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Progress Bar (Usage) */}
              {coupon.usageLimit && (
                <div className="h-1.5 w-full bg-zinc-100">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      (coupon.usedCount / coupon.usageLimit) > 0.8 ? 'bg-red-500' : 'bg-black'
                    }`}
                    style={{ width: `${Math.min(100, (coupon.usedCount / coupon.usageLimit) * 100)}%` }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* ── Add/Edit Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic">
                    {editTarget ? "Edit Coupon" : "New Coupon"}
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Configure your discount rules</p>
                </div>
                <button onClick={() => setShowForm(false)} className="p-3 hover:bg-zinc-100 rounded-[20px] transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-[10px] font-bold text-red-700 flex items-center gap-3">
                    <AlertTriangle size={18} /> {formError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block text-center">
                      Coupon Code *
                    </label>
                    <input
                      type="text"
                      value={form.code}
                      onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., SUMMER50"
                      required
                      className="w-full h-16 px-6 rounded-[24px] bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-black text-2xl font-black uppercase tracking-tighter text-center"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">
                      Description
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="What is this coupon for?"
                      className="w-full px-6 py-4 rounded-[24px] bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-black text-[11px] font-bold resize-none"
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">
                      Discount Type
                    </label>
                    <select
                      value={form.discountType}
                      onChange={(e) => setForm({ ...form, discountType: e.target.value as any })}
                      className="w-full h-14 px-6 rounded-[20px] bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-black text-[11px] font-bold uppercase tracking-widest cursor-pointer"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount (₹)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">
                      Discount Value *
                    </label>
                    <div className="relative">
                       <input
                        type="number"
                        value={form.discountValue}
                        onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                        min={0}
                        required
                        className="w-full h-14 px-6 rounded-[20px] bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-black text-[14px] font-black"
                      />
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 text-zinc-400 font-black">
                        {form.discountType === 'percentage' ? '%' : '₹'}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">
                      Min Order Amount
                    </label>
                    <input
                      type="number"
                      value={form.minOrderAmount}
                      onChange={(e) => setForm({ ...form, minOrderAmount: Number(e.target.value) })}
                      className="w-full h-14 px-6 rounded-[20px] bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-black text-[12px] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">
                      Max Discount (Optional)
                    </label>
                    <input
                      type="number"
                      value={form.maxDiscount || ''}
                      onChange={(e) => setForm({ ...form, maxDiscount: e.target.value ? Number(e.target.value) : undefined })}
                      placeholder="N/A"
                      className="w-full h-14 px-6 rounded-[20px] bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-black text-[12px] font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">
                      Total Usage Limit
                    </label>
                    <input
                      type="number"
                      value={form.usageLimit || ''}
                      onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })}
                      className="w-full h-14 px-6 rounded-[20px] bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-black text-[12px] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">
                      Per User Limit
                    </label>
                    <input
                      type="number"
                      value={form.perUserLimit || ''}
                      onChange={(e) => setForm({ ...form, perUserLimit: Number(e.target.value) })}
                      className="w-full h-14 px-6 rounded-[20px] bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-black text-[12px] font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      required
                      className="w-full h-14 px-6 rounded-[20px] bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-black text-[11px] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">
                      Expiration Date *
                    </label>
                    <input
                      type="date"
                      value={form.expiresAt}
                      min={form.startDate}
                      onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                      required
                      className="w-full h-14 px-6 rounded-[20px] bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-black text-[11px] font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-zinc-50 p-6 rounded-[24px]">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={form.isActive}
                    onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                    className="w-6 h-6 rounded-lg accent-black cursor-pointer"
                  />
                  <div>
                    <label htmlFor="isActive" className="text-[11px] font-black uppercase tracking-widest cursor-pointer">
                      Activate this coupon immediately
                    </label>
                    <p className="text-[9px] text-zinc-400 font-medium">Customers can start using it once activated and dates match.</p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-5 border-2 border-zinc-100 rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-2 py-5 bg-black text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-black/20"
                  >
                    {saving && <Loader2 size={16} className="animate-spin" />}
                    {editTarget ? "Update Coupon" : "Create Coupon"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Modal ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-md shadow-2xl p-10 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[30px] flex items-center justify-center mx-auto mb-6">
              <Trash2 size={40} strokeWidth={2.5} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-2">Delete Coupon?</h3>
            <p className="text-[12px] text-zinc-500 font-medium leading-relaxed mb-8">
              Are you sure you want to permanently delete <strong className="text-black">"{deleteConfirm.code}"</strong>? This will remove all associated usage history.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="w-full py-5 bg-red-600 text-white rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg shadow-red-200"
              >
                {deleting && <Loader2 size={16} className="animate-spin" />}
                Confirm Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="w-full py-5 border-2 border-zinc-100 rounded-[24px] text-[11px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Coupons;

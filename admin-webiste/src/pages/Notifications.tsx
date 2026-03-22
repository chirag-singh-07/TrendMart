import React, { useState, useEffect } from "react";
import {
  Bell,
  Trash2,
  Search,
  CheckCircle,
  AlertTriangle,
  X,
  Loader2,
  RefreshCw,
  Eye,
  Send,
  Users,
  Mail,
  Smartphone,
  Info,
  Layers,
  ShoppingBag,
  Store,
} from "lucide-react";
import {
  adminNotificationService,
  type Notification,
  type CreateNotificationPayload,
} from "../services/adminNotificationService";

const initialForm: CreateNotificationPayload = {
  title: "",
  message: "",
  type: "promo",
  targetType: "all",
  sendEmail: true,
  sendPush: true,
};

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  // Modal state
  const [showForm, setShowForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Notification | null>(null);
  const [form, setForm] = useState<CreateNotificationPayload>(initialForm);
  const [formError, setFormError] = useState("");

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchNotifications = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminNotificationService.getAll();
      setNotifications(data);
    } catch {
      setError("Failed to load notification history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const filteredNotifications = notifications.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || n.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.title.trim() || !form.message.trim()) {
      setFormError("Title and message are required.");
      return;
    }

    if (!form.sendEmail && !form.sendPush) {
      setFormError("Select at least one delivery method (Email or Push).");
      return;
    }

    setSending(true);
    try {
      await adminNotificationService.send(form);
      showToast("Notification successfully queued for delivery");
      setShowForm(false);
      fetchNotifications();
    } catch (err: any) {
      setFormError(err.response?.data?.message || "An error occurred.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await adminNotificationService.delete(deleteConfirm._id);
      setDeleteConfirm(null);
      showToast("Notification history removed");
      fetchNotifications();
    } catch (err: any) {
      showToast(
        err.response?.data?.message || "Failed to remove entry",
        "error",
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg font-bold text-[11px] uppercase tracking-widest ${
            toast.type === "success"
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={16} />
          ) : (
            <AlertTriangle size={16} />
          )}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Notifications
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Send real-time alerts to your app and web users
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchNotifications}
            className="px-5 py-3 border border-zinc-200 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-50 transition-all flex items-center gap-2"
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-black/10"
          >
            <Send size={18} /> New Announcement
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Sent Notifications",
            value: notifications.length,
            icon: Send,
            color: "zinc",
          },
          {
            label: "Active Promos",
            value: notifications.filter((n) => n.type === "promo").length,
            icon: Bell,
            color: "orange",
          },
          {
            label: "System Alerts",
            value: notifications.filter((n) => n.type === "system").length,
            icon: Info,
            color: "blue",
          },
          {
            label: "Unread (Global)",
            value: "3.4K",
            icon: Eye,
            color: "green",
          }, // Mock data for unread
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl border border-zinc-200 p-6 flex items-start justify-between"
          >
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-2">
                {s.label}
              </p>
              <p className="text-3xl font-black">{s.value}</p>
            </div>
            <div className={`p-2 bg-zinc-50 rounded-xl text-black`}>
              <s.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notification history..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="h-12 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-[10px] font-black uppercase tracking-widest focus:outline-none"
        >
          <option value="all">Everywhere</option>
          <option value="promo">Promotional</option>
          <option value="system">System Alerts</option>
        </select>
      </div>

      {/* History List */}
      <div className="bg-white rounded-3xl border border-zinc-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 size={32} className="animate-spin text-zinc-400" />
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="text-center py-20">
            <Bell size={48} className="mx-auto text-zinc-200 mb-4" />
            <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
              No history found
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Target Audience
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Message Details
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                  Channels
                </th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">
                  Sent Time
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredNotifications.map((n) => (
                <tr
                  key={n._id}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                >
                  <td className="p-6 align-top">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-black">
                        {n.targetType === "buyers" ? (
                          <ShoppingBag size={18} />
                        ) : n.targetType === "sellers" ? (
                          <Store size={18} />
                        ) : (
                          <Users size={18} />
                        )}
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">
                          {n.targetType}
                        </p>
                        <p className="text-[9px] text-zinc-400 font-bold uppercase">
                          {n.type} Broadcast
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 max-w-md align-top">
                    <div>
                      <p className="text-[12px] font-black tracking-tight mb-1">
                        {n.title}
                      </p>
                      <p className="text-[10px] text-zinc-500 line-clamp-2 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  </td>
                  <td className="p-6 align-top">
                    <div className="flex gap-2">
                      <div
                        className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400"
                        title="Email Delivery"
                      >
                        <Mail size={14} className="text-blue-500 opacity-60" />
                      </div>
                      <div
                        className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400"
                        title="Push Delivery"
                      >
                        <Smartphone
                          size={14}
                          className="text-orange-500 opacity-60"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-right align-top">
                    <p className="text-[10px] font-bold text-zinc-600 mb-2">
                      {new Date(n.sentAt).toLocaleString()}
                    </p>
                    <button
                      onClick={() => setDeleteConfirm(n)}
                      className="text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Add Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-xl shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-10">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic flex items-center gap-3">
                    <Send size={28} className="text-black" /> Post Announcement
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
                    Direct communication to all TrendMart users
                  </p>
                </div>
                <button
                  onClick={() => setShowForm(false)}
                  className="p-3 hover:bg-zinc-100 rounded-[20px] transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {formError && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-[10px] font-bold text-red-700 flex items-center gap-3">
                    <AlertTriangle size={18} /> {formError}
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-3 block">
                    Audience Targeting
                  </label>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { id: "all", label: "Everyone", icon: Users },
                      { id: "buyers", label: "Buyers", icon: ShoppingBag },
                      { id: "sellers", label: "Sellers", icon: Store },
                      { id: "selective", label: "Individual", icon: Layers },
                    ].map((item: any) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, targetType: item.id as any })
                        }
                        className={`p-4 rounded-[20px] border-2 transition-all flex flex-col items-center gap-2 ${
                          form.targetType === item.id
                            ? "bg-black border-black text-white"
                            : "border-zinc-100 text-zinc-400 hover:border-zinc-200"
                        }`}
                      >
                        <item.icon size={20} />
                        <span className="text-[9px] font-black uppercase tracking-tight">
                          {item.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-2 block">
                      Notification Category
                    </label>
                    <select
                      value={form.type}
                      onChange={(e) =>
                        setForm({ ...form, type: e.target.value as any })
                      }
                      className="w-full h-12 px-5 rounded-[15px] bg-zinc-50 border-2 border-zinc-100 text-[10px] font-black uppercase focus:outline-none focus:border-black"
                    >
                      <option value="promo">Promotional / Campaign</option>
                      <option value="system">System Maintenance</option>
                      <option value="order">Order Specific</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    placeholder="Subject Header..."
                    required
                    className="w-full h-14 px-6 rounded-[20px] bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-black text-[13px] font-black"
                  />
                  <textarea
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    placeholder="Detailed message body..."
                    rows={4}
                    required
                    className="w-full px-6 py-4 rounded-[20px] bg-zinc-50 border-2 border-zinc-100 focus:outline-none focus:border-black text-[11px] font-bold resize-none"
                  />
                </div>

                <div className="p-6 bg-zinc-50 rounded-[24px] space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Delivery Channels
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, sendEmail: !form.sendEmail })
                      }
                      className={`p-5 rounded-[20px] border-2 flex items-center gap-4 transition-all ${
                        form.sendEmail
                          ? "bg-white border-blue-200 shadow-md"
                          : "border-dashed border-zinc-200 opacity-50"
                      }`}
                    >
                      <Mail
                        size={24}
                        className={
                          form.sendEmail ? "text-blue-500" : "text-zinc-400"
                        }
                      />
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-tight">
                          Website / Email
                        </p>
                        <p className="text-[8px] font-medium text-zinc-400 capitalize">
                          Real-time Delivery
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, sendPush: !form.sendPush })
                      }
                      className={`p-5 rounded-[20px] border-2 flex items-center gap-4 transition-all ${
                        form.sendPush
                          ? "bg-white border-orange-200 shadow-md"
                          : "border-dashed border-zinc-200 opacity-50"
                      }`}
                    >
                      <Smartphone
                        size={24}
                        className={
                          form.sendPush ? "text-orange-500" : "text-zinc-400"
                        }
                      />
                      <div className="text-left">
                        <p className="text-[10px] font-black uppercase tracking-tight">
                          App / In-App Push
                        </p>
                        <p className="text-[8px] font-medium text-zinc-400 capitalize">
                          FCM Notification
                        </p>
                      </div>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-5 bg-black text-white rounded-[24px] text-[12px] font-black uppercase tracking-widest hover:bg-zinc-800 disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-black/20"
                >
                  {sending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  Send Mass Notification
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

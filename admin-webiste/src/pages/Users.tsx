import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  CheckCircle,
  AlertTriangle,
  X,
  Loader2,
  RefreshCw,
  Shield,
  ShieldAlert,
  UserPlus,
  Lock,
} from "lucide-react";
import { adminUserService, adminStaffService, type User } from "../services/adminUserService";

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Current Admin Role check
  const [adminData, setAdminData] = useState<any>(null);

  // Modal for creating staff
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffForm, setStaffForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin" as "admin" | "moderator",
  });
  const [staffSaving, setStaffSaving] = useState(false);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (filterRole !== "all") params.role = filterRole;
      if (filterStatus !== "all") params.status = filterStatus;

      const data = await adminUserService.getAll(params);
      setUsers(data.users || []);
    } catch (err: any) {
      // Error is handled via showToast or UI state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      setAdminData(JSON.parse(stored));
    }
    fetchUsers();
  }, [filterRole, filterStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleStatusUpdate = async (userId: string, status: string) => {
    try {
      await adminUserService.updateStatus(userId, { status });
      showToast(`User status updated to ${status}`);
      fetchUsers();
    } catch {
      showToast("Failed to update status", "error");
    }
  };

  const handleToggleBlock = async (user: User) => {
    try {
      await adminUserService.updateStatus(user._id, { 
        isBlocked: !user.isBlocked,
        blockReason: !user.isBlocked ? "Administrative restriction" : ""
      });
      showToast(user.isBlocked ? "User unblocked" : "User blocked");
      fetchUsers();
    } catch {
      showToast("Action failed", "error");
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffSaving(true);
    try {
      await adminStaffService.create(staffForm);
      showToast("Staff admin created successfully");
      setShowStaffModal(false);
      setStaffForm({ name: "", email: "", password: "", role: "admin" });
      fetchUsers();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Failed to create staff", "error");
    } finally {
      setStaffSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "suspended": return "bg-orange-100 text-orange-700";
      case "deleted": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "buyer": return "bg-blue-100 text-blue-700";
      case "seller": return "bg-purple-100 text-purple-700";
      case "admin": return "bg-black text-white";
      case "super_admin": return "bg-red-600 text-white";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-100 flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg font-bold text-[11px] uppercase tracking-widest ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Users Management</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Control platform access and account privileges
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchUsers}
            className="px-5 py-3 border border-zinc-200 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-50 transition-all flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
          {adminData?.role === "super_admin" && (
            <button 
              onClick={() => setShowStaffModal(true)}
              className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-lg shadow-black/10"
            >
              <UserPlus size={18} /> Add Staff Admin
            </button>
          )}
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold uppercase tracking-widest placeholder:text-zinc-400"
          />
        </form>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="h-12 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-black"
        >
          <option value="all">All Roles</option>
          <option value="buyer">Buyers</option>
          <option value="seller">Sellers</option>
          <option value="admin">Admins</option>
          <option value="super_admin">Super Admins</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-12 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-black"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="deleted">Deleted</option>
        </select>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-[40px] border border-zinc-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">User Identity</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Account Details</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Security</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                   <td colSpan={4} className="p-20 text-center">
                      <Loader2 size={40} className="animate-spin text-zinc-200 mx-auto" />
                   </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                   <td colSpan={4} className="p-20 text-center">
                      <Users size={40} className="text-zinc-100 mx-auto mb-4" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Database is empty</p>
                   </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-zinc-50 transition-colors group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-zinc-100 rounded-[15px] flex items-center justify-center font-black text-zinc-400">
                           {user.firstName ? user.firstName[0] : 'U'}
                        </div>
                        <div>
                           <p className="text-[12px] font-black uppercase tracking-tighter">{user.firstName} {user.lastName}</p>
                           <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest mt-0.5">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                       <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-[10px] ${getRoleColor(user.role)}`}>
                          {user.role}
                       </span>
                       <div className="mt-3 flex items-center gap-4 text-[9px] font-bold text-zinc-500 uppercase tracking-tight">
                          <span className="flex items-center gap-1.5"><Mail size={12} /> {user.email.substring(0, 15)}...</span>
                          <span className="flex items-center gap-1.5"><Phone size={12} /> {user.phone}</span>
                       </div>
                    </td>
                    <td className="p-6">
                       <div className="space-y-3">
                          <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-[10px] ${getStatusColor(user.accountStatus)}`}>
                             {user.accountStatus}
                          </span>
                          {user.isBlocked && (
                             <p className="text-[8px] font-black text-red-500 flex items-center gap-1.5 uppercase tracking-widest">
                                <ShieldAlert size={12} /> Blocked
                             </p>
                          )}
                       </div>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end gap-2">
                          <button 
                            title="Toggle Status"
                            onClick={() => handleStatusUpdate(user._id, user.accountStatus === 'suspended' ? 'active' : 'suspended')}
                            className="p-3 bg-zinc-50 rounded-xl hover:bg-zinc-900 hover:text-white transition-all"
                          >
                             <Shield size={18} />
                          </button>
                          <button 
                            title="Toggle Block"
                            onClick={() => handleToggleBlock(user)}
                            className={`p-3 rounded-xl transition-all ${user.isBlocked ? 'bg-black text-white' : 'bg-red-50 text-red-600 hover:bg-red-600 hover:text-white'}`}
                          >
                             <ShieldAlert size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Staff Modal */}
      {showStaffModal && (
        <div className="fixed inset-0 z-110 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4">
           <div className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl p-10">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-3xl font-black uppercase tracking-tighter italic">Create Staff</h2>
                 <button onClick={() => setShowStaffModal(false)} className="p-3 bg-zinc-50 rounded-2xl">
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleCreateStaff} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Full Name</label>
                    <input 
                      type="text" 
                      required 
                      value={staffForm.name}
                      onChange={e => setStaffForm({...staffForm, name: e.target.value})}
                      className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:border-black text-[12px] font-bold"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Official Email</label>
                    <div className="relative">
                       <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" />
                       <input 
                        type="email" 
                        required 
                        value={staffForm.email}
                        onChange={e => setStaffForm({...staffForm, email: e.target.value})}
                        className="w-full h-14 pl-14 pr-6 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:border-black text-[12px] font-bold"
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Temp Password</label>
                    <div className="relative">
                       <Lock size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300" />
                       <input 
                        type="password" 
                        required 
                        value={staffForm.password}
                        onChange={e => setStaffForm({...staffForm, password: e.target.value})}
                        className="w-full h-14 pl-14 pr-6 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:border-black text-[12px] font-bold"
                      />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Assignment Role</label>
                    <select 
                      value={staffForm.role}
                      onChange={e => setStaffForm({...staffForm, role: e.target.value as any})}
                      className="w-full h-14 px-6 rounded-2xl bg-zinc-50 border border-zinc-100 focus:outline-none focus:border-black text-[10px] font-black uppercase tracking-widest"
                    >
                      <option value="admin">Platform Admin</option>
                      <option value="moderator">Platform Moderator</option>
                    </select>
                 </div>

                 <button 
                  type="submit" 
                  disabled={staffSaving}
                  className="w-full py-5 bg-black text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                 >
                    {staffSaving && <Loader2 size={16} className="animate-spin" />}
                    Deploy Staff Account
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;

import React, { useState } from "react";
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
} from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "buyer" | "seller" | "admin";
  status: "active" | "inactive" | "blocked";
  joinDate: string;
  totalOrders: number;
}

const UsersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const users: User[] = [
    {
      id: "USR001",
      name: "John Doe",
      email: "john@example.com",
      phone: "+919876543210",
      role: "buyer",
      status: "active",
      joinDate: "2024-01-15",
      totalOrders: 12,
    },
    {
      id: "USR002",
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+919876543211",
      role: "seller",
      status: "active",
      joinDate: "2024-01-10",
      totalOrders: 45,
    },
    {
      id: "USR003",
      name: "Mike Johnson",
      email: "mike@example.com",
      phone: "+919876543212",
      role: "buyer",
      status: "active",
      joinDate: "2024-02-01",
      totalOrders: 8,
    },
    {
      id: "USR004",
      name: "Sarah Williams",
      email: "sarah@example.com",
      phone: "+919876543213",
      role: "buyer",
      status: "inactive",
      joinDate: "2023-12-20",
      totalOrders: 0,
    },
    {
      id: "USR005",
      name: "Robert Brown",
      email: "robert@example.com",
      phone: "+919876543214",
      role: "seller",
      status: "blocked",
      joinDate: "2024-01-05",
      totalOrders: 3,
    },
  ];

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus =
      filterStatus === "all" || user.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "inactive":
        return "bg-gray-100 text-gray-700";
      case "blocked":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "buyer":
        return "bg-blue-100 text-blue-700";
      case "seller":
        return "bg-purple-100 text-purple-700";
      case "admin":
        return "bg-black text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Users Management
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Manage and monitor all users
          </p>
        </div>
        <button className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 w-fit">
          <Plus size={18} />
          Add User
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
              Search Users
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full h-11 pl-12 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black focus:bg-white text-[10px] font-bold"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                Role
              </label>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold uppercase"
              >
                <option value="all">All Roles</option>
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold uppercase"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  <input type="checkbox" className="w-4 h-4 rounded accent-black" />
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  User
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Contact
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Role
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Orders
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(
                              selectedUsers.filter((id) => id !== user.id)
                            );
                          }
                        }}
                        className="w-4 h-4 rounded accent-black"
                      />
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-black text-[10px] uppercase tracking-widest">
                          {user.name}
                        </p>
                        <p className="text-[9px] text-zinc-500 mt-1">
                          {user.id}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[9px]">
                          <Mail size={14} className="text-zinc-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-[9px]">
                          <Phone size={14} className="text-zinc-400" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getRoleColor(
                          user.role
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusColor(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-bold text-[10px]">
                      {user.totalOrders}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
                          <Eye size={16} className="text-zinc-600" />
                        </button>
                        <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
                          <Edit2 size={16} className="text-zinc-600" />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg transition-colors">
                          <Trash2 size={16} className="text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                      No users found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination and Info */}
      <div className="flex items-center justify-between text-[10px]">
        <p className="font-bold text-zinc-600 uppercase tracking-widest">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 font-black uppercase text-[9px]">
            Previous
          </button>
          <button className="w-10 h-10 rounded-lg bg-black text-white font-black text-[9px] flex items-center justify-center">
            1
          </button>
          <button className="px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 font-black uppercase text-[9px]">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsersList;

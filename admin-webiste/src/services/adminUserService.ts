import api from "../lib/api";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  accountStatus: "active" | "suspended" | "deleted";
  isBlocked: boolean;
  blockReason?: string;
  createdAt: string;
}

export const adminUserService = {
  getAll: async (params?: any): Promise<{ users: User[]; total: number; pages: number }> => {
    const res = await api.get("/admin/users", { params });
    return res.data;
  },

  updateStatus: async (id: string, payload: any): Promise<User> => {
    const res = await api.patch(`/admin/users/${id}/status`, payload);
    return res.data.user;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/users/${id}`);
  },
};

// Staff Admin service (for creating other admins)
export const adminStaffService = {
  getAll: async (): Promise<any[]> => {
    const res = await api.get("/admin/users");
    return res.data.admins;
  },

  create: async (payload: any): Promise<any> => {
    const res = await api.post("/admin/create-user", payload);
    return res.data.admin;
  },

  resetPassword: async (id: string, newPassword: string): Promise<void> => {
    await api.post(`/admin/reset-password/${id}`, { newPassword });
  },
};

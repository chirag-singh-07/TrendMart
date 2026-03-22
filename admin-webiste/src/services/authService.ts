import api from "../lib/api";

export const authService = {
  login: async (email: string, password: string) => {
    const res = await api.post("/admin/login", { email, password });
    if (res.data.token) {
      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminUser", JSON.stringify(res.data.admin));
    }
    return res.data;
  },

  logout: () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
  },

  getStoredAdmin: () => {
    const stored = localStorage.getItem("adminUser");
    return stored ? JSON.parse(stored) : null;
  },
};

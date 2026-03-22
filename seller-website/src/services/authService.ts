import api from "../lib/api";

export const authService = {
  register: async (data: any) => {
    const response = await api.post("/auth/register", {
      ...data,
      role: "seller",
    });
    return response.data;
  },

  verifyEmail: async (userId: string, otp: string) => {
    const response = await api.post("/auth/verify-email", { userId, otp });
    return response.data;
  },

  resendOtp: async (userId: string, type: string) => {
    const response = await api.post("/auth/resend-otp", { userId, type });
    return response.data;
  },

  login: async (data: any) => {
    const response = await api.post("/auth/login", data);
    if (response.data.success) {
      localStorage.setItem("seller_token", response.data.data.accessToken);
      localStorage.setItem("seller_data", JSON.stringify(response.data.data.user));
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("seller_token");
      localStorage.removeItem("seller_data");
    }
  },

  getMe: async () => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};

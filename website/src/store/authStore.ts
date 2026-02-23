import { create } from "zustand";
import authService, { type User } from "@/services/authService";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    navigate: (path: string) => void,
  ) => Promise<void>;
  register: (payload: any, navigate: (path: string) => void) => Promise<void>;
  verifyEmail: (otp: string, navigate: (path: string) => void) => Promise<void>;
  resendOtp: (type: string) => Promise<void>;
  logout: (navigate: (path: string) => void) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    otp: string,
    newPassword: string,
    navigate: (path: string) => void,
  ) => Promise<void>;
  initializeAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: false,

  setLoading: (loading) => set({ isLoading: loading }),

  login: async (email, password, navigate) => {
    set({ isLoading: true });
    try {
      const data = await authService.login({ email, password });
      localStorage.setItem("accessToken", data.accessToken);
      set({
        user: data.user,
        accessToken: data.accessToken,
        isAuthenticated: true,
      });
      navigate("/");
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (payload, navigate) => {
    set({ isLoading: true });
    try {
      const data = await authService.register(payload);
      localStorage.setItem("pendingUserId", data.userId);
      navigate("/verify-email");
    } finally {
      set({ isLoading: false });
    }
  },

  verifyEmail: async (otp, navigate) => {
    set({ isLoading: true });
    try {
      const userId = localStorage.getItem("pendingUserId");
      if (!userId) throw new Error("Verification ID missing");
      await authService.verifyEmail({ otp, userId });
      localStorage.removeItem("pendingUserId");
      navigate("/login");
    } finally {
      set({ isLoading: false });
    }
  },

  resendOtp: async (type) => {
    const userId =
      localStorage.getItem("pendingUserId") ||
      localStorage.getItem("resetUserId");
    if (!userId) throw new Error("User ID missing for OTP resend");
    await authService.resendOtp({ userId, type });
  },

  logout: async (navigate) => {
    set({ isLoading: true });
    try {
      await authService.logout();
    } finally {
      localStorage.removeItem("accessToken");
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      navigate("/login");
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true });
    try {
      const response = (await authService.forgotPassword(email)) as any;
      if (response && response.userId) {
        localStorage.setItem("resetUserId", response.userId);
      }
    } finally {
      set({ isLoading: false });
    }
  },

  resetPassword: async (otp, newPassword, navigate) => {
    set({ isLoading: true });
    try {
      const userId = localStorage.getItem("resetUserId");
      if (!userId) throw new Error("Reset ID missing");
      await authService.resetPassword({ otp, password: newPassword, userId });
      localStorage.removeItem("resetUserId");
      navigate("/login");
    } finally {
      set({ isLoading: false });
    }
  },

  initializeAuth: async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      set({ isLoading: true });
      try {
        const { user } = await authService.getMe();
        set({ user, accessToken: token, isAuthenticated: true });
      } catch (err) {
        localStorage.removeItem("accessToken");
        set({ user: null, accessToken: null, isAuthenticated: false });
      } finally {
        set({ isLoading: false });
      }
    }
  },
}));

import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/user";

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  isCheckingAuth: true,

  signUp: async (formData, toast, navigate) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/auth/register`, formData);

      set({
        user: response.data.data,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      toast({
        position: "top-right",
        title: "Signed up successfully",
        type: "success",
      });
      console.log("Sign-up response:", response.data.data.isVerified);
      navigate("/verify-email");
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error signing up ",
      });
      toast({
        position: "top-right",
        title: error.response.data.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your signUp.",
        type: "error",
        variant: "destructive",
      });
      throw error;
    }
  },

  login: async (formData, navigate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);
      set({
        user: response.data.data,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });
      // toast({
      //   position: "top-right",
      //   title: response.data.message || "Logged in successfully",
      //   type: "success",
      // });
      // toast.success("Logged in successfully", {
      //   duration: 3000,
      //   autoClose: true,
      // });
      navigate("/");
      // toast.success("Event has been created.");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Error logging in";
      toast.error(errorMessage);
      // Delay state update slightly to ensure toast renders
      setTimeout(() => {
        set({
          isLoading: false,
          error: errorMessage,
        });
      }, 100);

      throw error;
    }
  },

  verifyEmail: async (code, toast, navigate) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, {
        code,
      });
      set({
        user: response.data.data,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      toast({
        position: "top-right",
        title: "Email verified successfully",
        type: "success",
      });
      navigate("/");
      return response.data.data;
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error verify email ",
      });
      toast({
        position: "top-right",
        title: error.response.data.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your signUp.",
        type: "error",
        variant: "destructive",
      });
      throw error;
    }
  },
  logout: async (navigate) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/logout`);
      set({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
      navigate("/login");
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error logging out ",
      });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null, isCheckingAuth: true });
    try {
      const response = await axios.get(`${API_URL}/auth/check-auth`);
      set({
        user: response.data.data,
        isLoading: false,
        isAuthenticated: true,
        error: null,
        isCheckingAuth: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error checking auth ",
        isCheckingAuth: false,
      });
    }
  },
  forgotPasswordApi: async (formData, toast, navigate) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/forgot-password`, formData);
      set({
        isLoading: false,
        error: null,
      });
      toast({
        position: "top-right",
        title: "Password reset link sent successfully",
        type: "success",
      });
      navigate("/forgot-password-sent");
    } catch (error) {
      set({
        isLoading: false,
        error:
          error.response.data.message || "Error sending password reset link ",
      });
      toast({
        position: "top-right",
        title: error.response.data.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your signUp.",
        type: "error",
        variant: "destructive",
      });
      throw error;
    }
  },
  resetPasswordApi: async (formData, token, toast, navigate) => {
    console.log("Reset Password Token:", token);
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/reset-password/${token}`, formData);
      set({
        isLoading: false,
        error: null,
      });
      toast({
        position: "top-right",
        title: "Password reset successfully",
        type: "success",
      });
      navigate("/login");
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error resetting password ",
      });
      toast({
        position: "top-right",
        title: error.response.data.message || "Uh oh! Something went wrong.",
        description: "There was a problem with your signUp.",
        type: "error",
        variant: "destructive",
      });
      throw error;
    }
  },
}));

import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL_1 || "http://localhost:8000/api/user";

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
      const errorMessage = error.response?.data?.message || "Error signing up";

      set({
        isLoading: false,
        error: errorMessage,
      });

      toast({
        position: "top-right",
        title: "Uh oh! Something went wrong.",
        description: errorMessage, // Shows backend error message
        type: "error",
        variant: "destructive",
      });

      throw error;
    }
  },

  login: async (formData, toast, navigate) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post(`${API_URL}/auth/login`, formData);

      set({
        user: response.data.data,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      toast({
        position: "top-right",
        title: "Logged in successfully",
        type: "success",
      });

      console.log("Login response:", response.data.data.isVerified);

      navigate("/");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred during login.";

      set({
        isLoading: false,
        error: errorMessage,
      });

      toast({
        position: "top-right",
        title: "Login Failed",
        description: errorMessage, // Shows backend error message
        type: "error",
        variant: "destructive",
      });

      console.error("Login error:", errorMessage);
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
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred during email verification.";

      set({
        isLoading: false,
        error: errorMessage,
      });

      toast({
        position: "top-right",
        title: "Email Verification Failed",
        description: errorMessage, // Shows backend error message
        type: "error",
        variant: "destructive",
      });

      console.error("Email verification error:", errorMessage);
    }
  },

  logout: async (toast, navigate) => {
    set({ isLoading: true, error: null });

    try {
      await axios.post(`${API_URL}/auth/logout`);

      set({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });

      toast({
        position: "top-right",
        title: "Logged out successfully",
        type: "success",
      });

      navigate("/login");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred during logout.";

      set({
        isLoading: false,
        error: errorMessage,
      });

      toast({
        position: "top-right",
        title: "Logout Failed",
        description: errorMessage, // Shows backend error message
        type: "error",
        variant: "destructive",
      });

      console.error("Logout error:", errorMessage);
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

      // Optional: add a success toast message for authentication check
      //   console.log("Authentication verified successfully");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred while checking authentication.";

      set({
        isLoading: false,
        error: errorMessage,
        isCheckingAuth: false,
      });

      console.error("Authentication check error:", errorMessage);
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
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred while sending the password reset link.";

      set({
        isLoading: false,
        error: errorMessage,
      });

      toast({
        position: "top-right",
        title: "Password Reset Failed",
        description: errorMessage, // Shows backend error message
        type: "error",
        variant: "destructive",
      });

      console.error("Password reset error:", errorMessage);
      throw error;
    }
  },
  resetPasswordApi: async (formData, token, toast, navigate) => {
    console.log("Reset Password Token:", token); // Helpful for debugging
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
      const errorMessage =
        error.response?.data?.message ||
        "An unexpected error occurred while resetting the password.";

      set({
        isLoading: false,
        error: errorMessage,
      });

      toast({
        position: "top-right",
        title: "Password Reset Failed",
        description: errorMessage, // Shows backend error message
        type: "error",
        variant: "destructive",
      });

      console.error("Password reset error:", errorMessage);
      throw error;
    }
  },
}));

import { create } from "zustand";
import axios from "axios";

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
      navigate("/");
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error login ",
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
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${API_URL}/auth/logout`);
      set({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error.response.data.message || "Error logging out ",
      });
    }
  },

  checkAuth: async () => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
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
}));

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
}));

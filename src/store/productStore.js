import axios from "axios";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";
axios.defaults.withCredentials = true;

export const useProductStore = create((set) => ({
  products: [],
  isLoading: false,
  error: null,
  productDetails: null,
  featureProducts: [],
  TrendingProducts: [],
  BestSellerProducts: [],

  fetchProducts: async ({ filterParams, sortParams }) => {
    // console.log("ok", filterParams);

    // Default sortParams to "1"
    set({ isLoading: true, error: null });
    try {
      const query = new URLSearchParams({
        ...filterParams,
        ...(sortParams && { sortBy: sortParams }), // Add sortBy only if it's valid
      });
      const response = await axios.get(
        `${API_URL}/admin/product/all-products?${query}`
      );
      //   console.log("products", response.data.data);
      set({ products: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchProductDetailsById: async (productId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/admin/product/${productId}`);
      set({ productDetails: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      // Handle error
      console.error("Fetch product details error:", error.message);
    }
  },
  fetchFeatureProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/user/product/feature-products`
      );
      // console.log("featureProducts", response.data.data);
      set({ featureProducts: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
      // Handle error
      console.error("Fetch feature products error:", error.message);
    }
  },
  fetchTrendingProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(
        `${API_URL}/user/product/trending-products`
      );
      set({ TrendingProducts: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  fetchBestSellerProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/user/product/best-sellers`);
      // console.log("BestSellerProducts", response.data.data);
      set({ BestSellerProducts: response.data.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));

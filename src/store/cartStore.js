import { create } from "zustand";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL_1 || "http://localhost:8000/api/user";

axios.defaults.withCredentials = true;

export const useCartStore = create((set, get) => ({
  cart: [],
  isLoading: false,
  error: null,

  addToCart: async (productId, quantity) => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/cart/add`, {
        productId,
        quantity,
      });
      set({ cart: response.data.data.items, isLoading: false });
      //   console.log("Product added to cart:", response);
    } catch (error) {
      console.error("Error adding to cart:", error);
      set({ error: "Error adding to cart", isLoading: false });
    }
  },

  fetchCartItems: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await axios.get(`${API_URL}/cart/all`);
      set({ cart: response.data.data.items, isLoading: false });
      console.log("Cart items fetched:", response.data.data.items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      set({ error: "Error fetching cart items", isLoading: false });
    }
  },

  removeFromCart: async (productId) => {
    try {
      set({ isLoading: true, error: null });
      await axios.delete(`${API_URL}/cart/delete/${productId}`);
      set((state) => ({
        cart: state.cart.filter((item) => item._id !== productId),
        isLoading: false,
      }));
      console.log("Product removed from cart:", productId);
    } catch (error) {
      console.error("Error removing from cart:", error);
      set({ error: "Error removing from cart", isLoading: false });
    }
  },

  updateCartItemQuantity: async (productId, quantity) => {
    try {
      set({ isLoading: true, error: null });
      await axios.put(`${API_URL}/cart/update`, { productId, quantity });

      // Fetch the latest cart instead of modifying it manually
      await get().fetchCartItems();
      console.log("Cart item quantity updated:", productId, quantity);
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      set({ error: "Error updating cart item quantity", isLoading: false });
    }
  },
}));

import api from "../lib/api";

export const productService = {
  getSellerProducts: async (filters: any = {}) => {
    const response = await api.get("/products/seller/my-products", { params: filters });
    return response.data;
  },

  getProductById: async (productId: string) => {
    const response = await api.get(`/products/${productId}`);
    return response.data;
  },

  createProduct: async (data: any) => {
    const response = await api.post("/products", data);
    return response.data;
  },

  updateProduct: async (productId: string, data: any) => {
    const response = await api.patch(`/products/${productId}`, data);
    return response.data;
  },

  deleteProduct: async (productId: string) => {
    const response = await api.delete(`/products/${productId}`);
    return response.data;
  },

  publishProduct: async (productId: string) => {
    const response = await api.patch(`/products/${productId}/publish`);
    return response.data;
  },

  updateStock: async (productId: string, quantity: number, operation: "increment" | "decrement" | "set") => {
    const response = await api.patch(`/products/${productId}/stock`, { quantity, operation });
    return response.data;
  }
};

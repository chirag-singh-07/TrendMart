import api from "../lib/api";

export const categoryService = {
  getCategoryTree: async () => {
    const response = await api.get("/categories");
    return response.data;
  },

  getAllCategories: async () => {
    const response = await api.get("/categories/all");
    return response.data;
  },

  getCategoryById: async (categoryId: string) => {
    const response = await api.get(`/categories/${categoryId}`);
    return response.data;
  }
};

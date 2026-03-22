import api from "../lib/api";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: { _id: string; name: string; slug: string } | null;
  level: number;
  image?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: string | null;
  image?: string;
  displayOrder?: number;
  isActive?: boolean;
}

export const categoryService = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get("/admin/manage/categories");
    return res.data.categories;
  },

  create: async (payload: CreateCategoryPayload): Promise<Category> => {
    const res = await api.post("/admin/manage/categories", payload);
    return res.data.category;
  },

  update: async (id: string, payload: Partial<CreateCategoryPayload>): Promise<Category> => {
    const res = await api.patch(`/admin/manage/categories/${id}`, payload);
    return res.data.category;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/manage/categories/${id}`);
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post("/upload/category", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // The backend returns { success: true, message: "...", data: { url: "..." } }
    return res.data.data.url;
  },
};

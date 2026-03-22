import api from "../lib/api";

export interface Banner {
  _id: string;
  title: string;
  image: string;
  redirectUrl?: string;
  targetAudience: "all" | "buyers" | "sellers" | "new_users" | "premium";
  appTarget: "home" | "category" | "product" | "checkout";
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt?: string;
}

export interface CreateBannerPayload {
  title: string;
  image: string;
  redirectUrl?: string;
  targetAudience?: "all" | "buyers" | "sellers" | "new_users" | "premium";
  appTarget: "home" | "category" | "product" | "checkout";
  startDate: string;
  endDate: string;
  isActive?: boolean;
}

export const offerService = {
  getAll: async (params?: { appTarget?: string; isActive?: boolean }): Promise<Banner[]> => {
    const res = await api.get("/admin/banners", { params });
    return res.data.banners;
  },

  getById: async (id: string): Promise<Banner> => {
    const res = await api.get(`/admin/banners/${id}`);
    return res.data.banner;
  },

  create: async (payload: CreateBannerPayload): Promise<Banner> => {
    const res = await api.post("/admin/banners", payload);
    return res.data.banner;
  },

  update: async (id: string, payload: Partial<CreateBannerPayload>): Promise<Banner> => {
    const res = await api.patch(`/admin/banners/${id}`, payload);
    return res.data.banner;
  },

  toggleStatus: async (id: string): Promise<Banner> => {
    const res = await api.patch(`/admin/banners/${id}/toggle`);
    return res.data.banner;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/banners/${id}`);
  },

  uploadImage: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await api.post("/upload/banner", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data.url;
  },
};

import api from "../lib/api";

export interface Product {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  brand?: string;
  categoryId: { _id: string; name: string; slug: string } | string;
  sellerId: { _id: string; firstName: string; lastName: string; email: string } | string;
  basePrice: number;
  salePrice?: number;
  currency: string;
  totalStock: number;
  lowStockThreshold: number;
  sku: string;
  tags: string[];
  images: string[];
  thumbnail: string;
  isFeatured: boolean;
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  viewCount: number;
  status: "draft" | "active" | "out_of_stock" | "banned";
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  products: Product[];
  total: number;
  page: number;
  pages: number;
}

export const productService = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    categoryId?: string;
    search?: string;
  }): Promise<ProductsResponse> => {
    const res = await api.get("/admin/manage/products", { params });
    return res.data;
  },

  getById: async (id: string): Promise<Product> => {
    const res = await api.get(`/admin/manage/products/${id}`);
    return res.data.product;
  },

  updateStatus: async (id: string, status: string): Promise<Product> => {
    const res = await api.patch(`/admin/manage/products/${id}/status`, { status });
    return res.data.product;
  },

  toggleFeatured: async (id: string): Promise<Product> => {
    const res = await api.patch(`/admin/manage/products/${id}/featured`);
    return res.data.product;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/manage/products/${id}`);
  },

  getDashboardStats: async () => {
    const res = await api.get("/admin/manage/stats");
    return res.data.stats;
  },
};

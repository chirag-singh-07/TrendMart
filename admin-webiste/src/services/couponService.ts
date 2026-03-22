import api from "../lib/api";

export interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  startDate: string;
  expiresAt: string;
  usedCount: number;
  isActive: boolean;
}

export interface CreateCouponPayload {
  code: string;
  description?: string;
  discountType: "percentage" | "flat";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  startDate: string;
  expiresAt: string;
  isActive?: boolean;
}

export const couponService = {
  getAll: async (params?: any): Promise<Coupon[]> => {
    const res = await api.get("/admin/coupons", { params });
    // The backend uses a wrapper: res.data.data.items (items from service, data from controller)
    return res.data.data.items || [];
  },

  getById: async (id: string): Promise<Coupon> => {
    const res = await api.get(`/admin/coupons/${id}`);
    return res.data.data.coupon;
  },

  create: async (payload: CreateCouponPayload): Promise<Coupon> => {
    const res = await api.post("/admin/coupons", payload);
    return res.data.data.coupon;
  },

  update: async (id: string, payload: Partial<CreateCouponPayload>): Promise<Coupon> => {
    const res = await api.patch(`/admin/coupons/${id}`, payload);
    return res.data.data.coupon;
  },

  toggleStatus: async (id: string): Promise<Coupon> => {
    const res = await api.patch(`/admin/coupons/${id}/toggle`);
    return res.data.data.coupon;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/coupons/${id}`);
  },

  getStats: async (id: string): Promise<any> => {
    const res = await api.get(`/admin/coupons/${id}/stats`);
    return res.data.data.stats;
  },

  getUsage: async (id: string, params?: any): Promise<any> => {
    const res = await api.get(`/admin/coupons/${id}/usage`, { params });
    return res.data.data;
  },
};

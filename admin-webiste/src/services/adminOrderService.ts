import api from "../lib/api";

export interface Order {
  _id: string;
  orderNumber: string;
  userId: any;
  items: any[];
  totalAmount: number;
  orderStatus: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  shippingAddress: any;
  createdAt: string;
}

export const adminOrderService = {
  getAll: async (params?: any): Promise<{ orders: Order[]; total: number; pages: number }> => {
    const res = await api.get("/admin/orders", { params });
    // The backend uses a wrapper: res.data.data (from controller status ok)
    return res.data.data;
  },

  getById: async (id: string): Promise<Order> => {
    const res = await api.get(`/admin/orders/${id}`);
    return res.data.data.order;
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const res = await api.patch(`/admin/orders/${id}/status`, { status });
    return res.data.data.order;
  },

  getRevenue: async (params?: any): Promise<any> => {
    const res = await api.get("/admin/orders/revenue", { params });
    return res.data.data;
  },
};

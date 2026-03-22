import api from "../lib/api";

export interface Notification {
  _id: string;
  userId: any; // could be null if broadcast
  title: string;
  message: string;
  type: "promo" | "system" | "order" | "review" | "payout";
  sentAt: string;
  isRead: boolean;
  status?: "sent" | "failed" | "pending";
  targetType?: "all" | "selective" | "buyers" | "sellers";
}

export interface CreateNotificationPayload {
  title: string;
  message: string;
  type: "promo" | "system" | "order" | "review" | "payout";
  targetType: "all" | "buyers" | "sellers" | "selective";
  userIds?: string[]; // for selective targeting
  sendEmail: boolean;
  sendPush: boolean;
}

export const adminNotificationService = {
  getAll: async (params?: any): Promise<Notification[]> => {
    const res = await api.get("/admin/notifications", { params });
    return res.data.notifications;
  },

  send: async (payload: CreateNotificationPayload): Promise<any> => {
    const res = await api.post("/admin/notifications/send", payload);
    return res.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/admin/notifications/${id}`);
  },

  getStats: async (): Promise<any> => {
    const res = await api.get("/admin/notifications/stats");
    return res.data.stats;
  },
};

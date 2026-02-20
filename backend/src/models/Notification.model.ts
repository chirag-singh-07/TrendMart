import mongoose, { Schema, model, Document } from "mongoose";
import { INotification, NotificationType } from "../interfaces";

// ==================== Notification Model ====================

export interface INotificationDocument extends INotification, Document {}

const NotificationSchema = new Schema<INotificationDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: [
      "order",
      "promo",
      "system",
      "review",
      "payout",
    ] satisfies NotificationType[],
    required: true,
  },
  redirectUrl: { type: String },
  isRead: { type: Boolean, default: false },
  sentAt: { type: Date, required: true, default: Date.now },
});

// user's notification inbox — newest first
NotificationSchema.index({ userId: 1, sentAt: -1 });

// unread notification count badge
NotificationSchema.index({ userId: 1, isRead: 1 });

// TTL — auto-delete notifications older than 60 days
NotificationSchema.index(
  { sentAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 60 },
);

const Notification =
  mongoose.models.Notification ||
  model<INotificationDocument>("Notification", NotificationSchema);

export default Notification;

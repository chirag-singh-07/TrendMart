import mongoose, { Schema, model, Document } from "mongoose";
import { IUserActivity, ActivityActionType, DeviceType } from "../interfaces";

// ==================== UserActivity Model ====================

export interface IUserActivityDocument extends IUserActivity, Document {}

const UserActivitySchema = new Schema<IUserActivityDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // optional — guest users won't have a userId
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    actionType: {
      type: String,
      enum: [
        "view",
        "add_to_cart",
        "purchase",
        "wishlist",
        "remove_from_cart",
      ] satisfies ActivityActionType[],
      required: true,
    },
    sessionId: { type: String, required: true },
    device: {
      type: String,
      enum: ["mobile", "tablet", "desktop"] satisfies DeviceType[],
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// recommendation engine — recent activity per user
UserActivitySchema.index({ userId: 1, createdAt: -1 });

// trending products — most viewed/purchased
UserActivitySchema.index({ productId: 1, actionType: 1 });

// session-based activity (guest users)
UserActivitySchema.index({ sessionId: 1 });

// TTL index — auto-delete activity logs older than 90 days
UserActivitySchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 90 },
);

const UserActivity =
  mongoose.models.UserActivity ||
  model<IUserActivityDocument>("UserActivity", UserActivitySchema);

export default UserActivity;

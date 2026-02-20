import mongoose, { Schema, model, Document } from "mongoose";
import { ICouponUsage } from "../interfaces";

// ==================== CouponUsage Model ====================

export interface ICouponUsageDocument extends ICouponUsage, Document {}

const CouponUsageSchema = new Schema<ICouponUsageDocument>({
  couponId: {
    type: Schema.Types.ObjectId,
    ref: "Coupon",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  discountApplied: { type: Number, required: true },
  usedAt: { type: Date, required: true, default: Date.now },
});

// enforce perUserLimit — count how many times a user used a coupon
CouponUsageSchema.index({ couponId: 1, userId: 1 });

// audit trail — all coupons applied to an order
CouponUsageSchema.index({ orderId: 1 });

const CouponUsage =
  mongoose.models.CouponUsage ||
  model<ICouponUsageDocument>("CouponUsage", CouponUsageSchema);

export default CouponUsage;

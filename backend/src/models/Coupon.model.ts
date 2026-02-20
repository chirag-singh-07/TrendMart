import mongoose, { Schema, model, Document } from "mongoose";
import { ICoupon, DiscountType } from "../interfaces";

// ==================== Coupon Model ====================

export interface ICouponDocument extends ICoupon, Document {}

const CouponSchema = new Schema<ICouponDocument>({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
  },
  description: { type: String },
  discountType: {
    type: String,
    enum: ["percentage", "flat"] satisfies DiscountType[],
    required: true,
  },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number },
  maxDiscount: { type: Number }, // cap for percentage discounts
  usageLimit: { type: Number }, // total uses allowed across all users
  perUserLimit: { type: Number }, // max uses per individual user
  applicableProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  applicableCategories: [
    {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  startDate: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

// checkout — validate coupon by code
CouponSchema.index({ code: 1 });

// filter active, non-expired coupons
CouponSchema.index({ isActive: 1, expiresAt: 1 });

const Coupon =
  mongoose.models.Coupon || model<ICouponDocument>("Coupon", CouponSchema);

export default Coupon;

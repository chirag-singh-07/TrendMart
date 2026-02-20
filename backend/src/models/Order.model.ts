import mongoose, { Schema, model, Document } from "mongoose";
import {
  IOrder,
  OrderStatus,
  PaymentStatus,
  RefundStatus,
} from "../interfaces";
export interface IOrderDocument extends IOrder, Document {}

const SellerBreakdownSchema = new Schema(
  {
    sellerId: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
    sellerEarnings: { type: Number, required: true },
  },
  { _id: false }                            // no separate _id for subdocuments
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sellerBreakdown: {
      type: [SellerBreakdownSchema],
      default: [],
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, required: true, default: 0 },
    shippingFee: { type: Number, required: true, default: 0 },
    discountAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
    paymentId: {
      type: Schema.Types.ObjectId,
      ref: "Payment",
    },
    deliveryAddressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ] satisfies OrderStatus[],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: [
        "pending",
        "paid",
        "failed",
        "refunded",
        "partially_refunded",
      ] satisfies PaymentStatus[],
      default: "pending",
    },
    cancellationReason: {
      type: String,
      trim: true,
    },
    refundStatus: {
      type: String,
      enum: [
        "none",
        "requested",
        "processing",
        "completed",
        "rejected",
      ] satisfies RefundStatus[],
      default: "none",
    },
  },
  {
    timestamps: true,
  }
);

// fetch all orders for a user sorted by newest
OrderSchema.index({ userId: 1, createdAt: -1 });

// fast order lookup by order number (used in order tracking)
OrderSchema.index({ orderNumber: 1 });

// admin dashboard filtering by status
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ paymentStatus: 1 });

const Order = mongoose.models.Order || model<IOrderDocument>("Order", OrderSchema);

export default Order;
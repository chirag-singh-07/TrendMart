import mongoose, { Schema, model, Document } from "mongoose";
import {
  IPayment,
  PaymentMethod,
  GatewayName,
  PaymentStatus,
} from "../interfaces";

// ==================== Payment Model ====================

export interface IPaymentDocument extends IPayment, Document {}

const PaymentSchema = new Schema<IPaymentDocument>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: [
        "credit_card",
        "debit_card",
        "upi",
        "net_banking",
        "wallet",
        "cash_on_delivery",
      ] satisfies PaymentMethod[],
      required: true,
    },
    gatewayName: {
      type: String,
      enum: ["razorpay", "stripe", "paypal", "manual"] satisfies GatewayName[],
      required: true,
    },
    transactionId: { type: String, required: true, unique: true },
    gatewayPaymentId: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: "INR" },
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
    failureReason: { type: String },
    refundedAmount: { type: Number, default: 0 },
    paidAt: { type: Date },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// link payment to its order
PaymentSchema.index({ orderId: 1 });

// user payment history
PaymentSchema.index({ userId: 1, createdAt: -1 });

// fast lookup by gateway payment ID for webhook handling
PaymentSchema.index({ gatewayPaymentId: 1 });

// admin filtering by payment status
PaymentSchema.index({ paymentStatus: 1 });

const Payment =
  mongoose.models.Payment || model<IPaymentDocument>("Payment", PaymentSchema);

export default Payment;

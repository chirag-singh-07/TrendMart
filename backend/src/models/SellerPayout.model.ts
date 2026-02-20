import mongoose, { Schema, model, Document } from "mongoose";
import { ISellerPayout, PayoutStatus, PayoutMethod } from "../interfaces";

// ==================== SellerPayout Model ====================

export interface ISellerPayoutDocument extends ISellerPayout, Document {}

const SellerPayoutSchema = new Schema<ISellerPayoutDocument>({
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  orderIds: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
  grossAmount: { type: Number, required: true },
  commissionAmount: { type: Number, required: true },
  netAmount: { type: Number, required: true }, // grossAmount - commissionAmount
  payoutStatus: {
    type: String,
    enum: [
      "pending",
      "processing",
      "completed",
      "failed",
      "on_hold",
    ] satisfies PayoutStatus[],
    default: "pending",
  },
  payoutMethod: {
    type: String,
    enum: ["bank_transfer", "upi", "wallet"] satisfies PayoutMethod[],
    required: true,
  },
  transactionReference: { type: String }, // bank/UPI ref after processing
  processedAt: { type: Date },
});

// seller's payout history
SellerPayoutSchema.index({ sellerId: 1 });

// admin — filter payouts by status
SellerPayoutSchema.index({ payoutStatus: 1 });

const SellerPayout =
  mongoose.models.SellerPayout ||
  model<ISellerPayoutDocument>("SellerPayout", SellerPayoutSchema);

export default SellerPayout;

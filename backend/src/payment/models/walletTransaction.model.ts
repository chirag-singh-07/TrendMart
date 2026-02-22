import mongoose, { Schema, model, Document } from "mongoose";

export type WalletTransactionType = "credit" | "debit";
export type WalletTransactionSource =
  | "refund"
  | "cashback"
  | "topup"
  | "order_payment"
  | "withdrawal"
  | "payout"
  | "admin_credit";
export type WalletTransactionStatus = "pending" | "completed" | "failed";

export interface IWalletTransaction {
  _id: mongoose.Types.ObjectId;
  walletId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  type: WalletTransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  source: WalletTransactionSource;
  referenceId?: string;
  referenceModel?: string;
  description: string;
  status: WalletTransactionStatus;
  createdAt: Date;
}

export interface IWalletTransactionDocument
  extends IWalletTransaction, Document {}

const WalletTransactionSchema = new Schema<IWalletTransactionDocument>(
  {
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["credit", "debit"] satisfies WalletTransactionType[],
      required: true,
    },
    amount: { type: Number, required: true, min: 0 },
    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
    source: {
      type: String,
      enum: [
        "refund",
        "cashback",
        "topup",
        "order_payment",
        "withdrawal",
        "payout",
        "admin_credit",
      ] satisfies WalletTransactionSource[],
      required: true,
    },
    referenceId: { type: String },
    referenceModel: { type: String },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "completed",
        "failed",
      ] satisfies WalletTransactionStatus[],
      default: "completed",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

WalletTransactionSchema.index({ walletId: 1, createdAt: -1 });
WalletTransactionSchema.index({ userId: 1, createdAt: -1 });
WalletTransactionSchema.index({ referenceId: 1 });

const WalletTransaction =
  mongoose.models.WalletTransaction ||
  model<IWalletTransactionDocument>(
    "WalletTransaction",
    WalletTransactionSchema,
  );

export default WalletTransaction;

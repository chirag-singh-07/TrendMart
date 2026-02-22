import mongoose, { Schema, model, Document } from "mongoose";

export interface IWallet {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWalletDocument extends IWallet, Document {}

const WalletSchema = new Schema<IWalletDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

WalletSchema.index({ userId: 1 }, { unique: true });

const Wallet =
  mongoose.models.Wallet || model<IWalletDocument>("Wallet", WalletSchema);

export default Wallet;

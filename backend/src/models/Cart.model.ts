import mongoose, { Schema, model, Document } from "mongoose";
import { ICart, ICartItem } from "../interfaces";
import { NextFunction } from "express";

// ==================== Cart Model ====================

// Separate interface for instance methods
export interface ICartMethods {
  recalculateTotals(): void;
}

export interface ICartDocument extends ICart, Document, ICartMethods {}

const CartItemPriceSnapshotSchema = new Schema(
  {
    basePrice: { type: Number, required: true },
    salePrice: { type: Number },
    currency: { type: String, required: true, default: "INR" },
  },
  { _id: false },
);

const CartItemSchema = new Schema<ICartItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantId: {
      type: Schema.Types.ObjectId,
      ref: "ProductVariant",
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    priceSnapshot: {
      type: CartItemPriceSnapshotSchema,
      required: true,
    },
  },
  { _id: false }, // items are subdocuments, not a separate collection
);

const CartSchema = new Schema<
  ICartDocument,
  mongoose.Model<ICartDocument, {}, ICartMethods>,
  ICartMethods
>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one cart per user
    },
    items: {
      type: [CartItemSchema],
      default: [],
    },
    totalItems: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  },
);

// fast cart lookup by userId
CartSchema.index({ userId: 1 });

// check if a specific product is already in the cart
CartSchema.index({ userId: 1, "items.productId": 1 });

// check if a specific variant is already in the cart
CartSchema.index({ userId: 1, "items.variantId": 1 });

// ==================== Cart Methods ====================

// recalculates totalItems and totalAmount from the items array
CartSchema.methods.recalculateTotals = function () {
  this.totalItems = this.items.reduce(
    (sum: number, item: ICartItem) => sum + item.quantity,
    0,
  );
  this.totalAmount = this.items.reduce((sum: number, item: ICartItem) => {
    const price = item.priceSnapshot.salePrice ?? item.priceSnapshot.basePrice;
    return sum + price * item.quantity;
  }, 0);
};

// auto-recalculate totals before every save
CartSchema.pre("save", function (this: ICartDocument, next) {
  this.recalculateTotals();
  next();
});

const Cart =
  mongoose.models.Cart || mongoose.model<ICartDocument>("Cart", CartSchema);

export default Cart;

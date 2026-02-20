import mongoose, { Schema, model, Document } from "mongoose";
import { IOrderItem } from "../interfaces";

export interface IOrderItemDocument extends IOrderItem, Document {}

const PriceSnapshotSchema = new Schema(
  {
    basePrice: { type: Number, required: true },
    salePrice: { type: Number },
    currency: { type: String, required: true },
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
  },
  { _id: false },
);

const OrderItemSchema = new Schema<IOrderItemDocument>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  variantId: {
    type: Schema.Types.ObjectId,
    ref: "ProductVariant",
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  priceSnapshot: {
    type: PriceSnapshotSchema,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

// fetch all items belonging to an order
OrderItemSchema.index({ orderId: 1 });

// seller dashboard — fetch all items sold by a seller
OrderItemSchema.index({ sellerId: 1 });

// check if a user purchased a specific product (for verified review)
OrderItemSchema.index({ productId: 1, sellerId: 1 });

export const OrderItem = model<IOrderItemDocument>(
  "OrderItem",
  OrderItemSchema,
);

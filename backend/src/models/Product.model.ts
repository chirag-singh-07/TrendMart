import mongoose from "mongoose";
import { IProduct, ProductStatus } from "../interfaces";

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    fullDescription: { type: String, required: true },
    brand: { type: String },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    basePrice: { type: Number, required: true },
    salePrice: { type: Number },
    currency: { type: String, required: true, default: "INR" },
    totalStock: { type: Number, required: true, default: 0 },
    lowStockThreshold: { type: Number, default: 5 },
    sku: { type: String, required: true, unique: true },
    barcode: { type: String, unique: true, sparse: true },
    tags: [{ type: String }],
    images: [{ type: String }],
    thumbnail: { type: String, required: true },
    weight: { type: Number },
    dimensions: {
      length: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
    isFeatured: { type: Boolean, default: false },
    shippingClass: { type: String },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: [
        "draft",
        "active",
        "out_of_stock",
        "banned",
      ] satisfies ProductStatus[],
      default: "draft",
    },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }],
    },
  },
  { timestamps: true },
);

// fast lookup by seller's products
ProductSchema.index({ sellerId: 1 });

// fast lookup by category
ProductSchema.index({ categoryId: 1 });

// search by slug
ProductSchema.index({ slug: 1 });

// featured products carousel
ProductSchema.index({ isFeatured: 1 });

// admin/seller dashboard filtering
ProductSchema.index({ status: 1 });

const Product =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;

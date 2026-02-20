import mongoose, { Schema, model } from "mongoose";
import { IProductVariant } from "../../interfaces";

// ==================== ProductVariant Model ====================

// attributes is an array of {name, value} subdocuments
const VariantAttributeSchema = new Schema(
  {
    name: { type: String, required: true }, // e.g. "color", "size"
    value: { type: String, required: true }, // e.g. "red", "XL"
  },
  { _id: false },
);

const ProductVariantSchema = new Schema<IProductVariant>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantName: {
      type: String,
      required: true, // e.g. "Red / XL"
    },
    attributes: {
      type: [VariantAttributeSchema],
      default: [],
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
    },
    image: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// all variants for a product
ProductVariantSchema.index({ productId: 1 });

// fast SKU lookup
ProductVariantSchema.index({ sku: 1 });

const ProductVariant =
  mongoose.models.ProductVariant ||
  model<IProductVariant>("ProductVariant", ProductVariantSchema);

export default ProductVariant;

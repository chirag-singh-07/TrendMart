import ProductVariant from "../models/variant.model";
import Product from "../models/product.model";
import { IProductVariant } from "../../interfaces";
import { recalculateProductStock } from "../utils/stock.util";
import { productCacheService } from "./productCache.service";
import AppError from "../../utils/AppError";

/**
 * Variant Service - Handles product variations
 */
export const variantService = {
  /**
   * Create a new variant for a product
   */
  async createVariant(
    productId: string,
    data: Partial<IProductVariant>,
    sellerId: string,
  ): Promise<IProductVariant> {
    const product = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);
    if (product.sellerId.toString() !== sellerId)
      throw new AppError("Unauthorized", 403);

    const existingSku = await ProductVariant.findOne({ sku: data.sku });
    if (existingSku) throw new AppError("SKU already exists", 409);

    if (data.isDefault) {
      await ProductVariant.updateMany({ productId }, { isDefault: false });
    }

    const variant = await ProductVariant.create({
      ...data,
      productId,
    });

    await recalculateProductStock(productId);
    await productCacheService.invalidateProductCache(productId);

    return variant;
  },

  /**
   * Update an existing variant
   */
  async updateVariant(
    variantId: string,
    data: Partial<IProductVariant>,
    sellerId: string,
  ): Promise<IProductVariant> {
    const variant = await ProductVariant.findById(variantId);
    if (!variant) throw new AppError("Variant not found", 404);

    const product = await Product.findById(variant.productId);
    if (!product) throw new AppError("Parent product not found", 404);
    if (product.sellerId.toString() !== sellerId)
      throw new AppError("Unauthorized", 403);

    if (data.isDefault) {
      await ProductVariant.updateMany(
        { productId: variant.productId },
        { isDefault: false },
      );
    }

    const updatedVariant = await ProductVariant.findByIdAndUpdate(
      variantId,
      data,
      { new: true },
    );

    await recalculateProductStock(product._id.toString());
    await productCacheService.invalidateProductCache(product._id.toString());

    return updatedVariant!;
  },

  /**
   * Delete a variant
   */
  async deleteVariant(variantId: string, sellerId: string): Promise<void> {
    const variant = await ProductVariant.findById(variantId);
    if (!variant) throw new AppError("Variant not found", 404);

    const product = await Product.findById(variant.productId);
    if (!product) throw new AppError("Parent product not found", 404);
    if (product.sellerId.toString() !== sellerId)
      throw new AppError("Unauthorized", 403);

    const variantCount = await ProductVariant.countDocuments({
      productId: variant.productId,
    });
    if (variantCount <= 1) {
      throw new AppError("Cannot delete the only variant of a product", 400);
    }

    await ProductVariant.findByIdAndDelete(variantId);

    await recalculateProductStock(product._id.toString());
    await productCacheService.invalidateProductCache(product._id.toString());
  },

  /**
   * Get all variants for a product
   */
  async getVariantsByProduct(productId: string): Promise<IProductVariant[]> {
    return ProductVariant.find({ productId }).sort({
      isDefault: -1,
      createdAt: 1,
    });
  },

  /**
   * Set a variant as default
   */
  async setDefaultVariant(
    variantId: string,
    productId: string,
    sellerId: string,
  ): Promise<void> {
    const product = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);
    if (product.sellerId.toString() !== sellerId)
      throw new AppError("Unauthorized", 403);

    await ProductVariant.updateMany({ productId }, { isDefault: false });
    const updated = await ProductVariant.findByIdAndUpdate(variantId, {
      isDefault: true,
    });

    if (!updated) throw new AppError("Variant not found", 404);
    await productCacheService.invalidateProductCache(productId);
  },
};

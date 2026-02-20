import Product from "../models/product.model";
import ProductVariant from "../models/variant.model";
import Category from "../models/category.model";
import { IProduct } from "../../interfaces";
import {
  IProductFilters,
  IPaginatedResult,
  IProductWithVariants,
  IStockUpdatePayload,
} from "../types/product.types";
import { generateUniqueSlug } from "../utils/slug.util";
import { productCacheService } from "./productCache.service";
import { recalculateProductStock } from "../utils/stock.util";
import AppError from "../../utils/AppError";
import { getRedisClient } from "../../config/redis";

const redis = getRedisClient();

/**
 * Product Service - Handles core product operations
 */
export const productService = {
  /**
   * Create a new product (starts as draft)
   */
  async createProduct(
    data: Partial<IProduct>,
    sellerId: string,
  ): Promise<IProduct> {
    const category = await Category.findOne({
      _id: data.categoryId,
      isActive: true,
    });
    if (!category) throw new AppError("Valid category is required", 400);

    const slug = await generateUniqueSlug(data.title!, Product);

    const existingSku = await Product.findOne({ sku: data.sku });
    if (existingSku) throw new AppError("SKU already exists", 409);

    if (data.salePrice && data.salePrice >= data.basePrice!) {
      throw new AppError("Sale price must be less than base price", 400);
    }

    const product = await Product.create({
      ...data,
      sellerId,
      slug,
      status: "draft",
      thumbnail: data.images ? data.images[0] : "placeholder.jpg",
    });

    return product;
  },

  /**
   * Update an existing product
   */
  async updateProduct(
    productId: string,
    data: Partial<IProduct>,
    sellerId: string,
  ): Promise<IProduct> {
    const product = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    if (product.sellerId.toString() !== sellerId.toString()) {
      throw new AppError("Unauthorized product edit", 403);
    }

    if (data.title && data.title !== product.title) {
      data.slug = await generateUniqueSlug(data.title, Product);
    }

    if (
      data.salePrice &&
      data.salePrice >= (data.basePrice || product.basePrice)
    ) {
      throw new AppError("Sale price must be less than base price", 400);
    }

    if (data.images && data.images.length > 0) {
      data.thumbnail = data.images[0];
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, data, {
      new: true,
    });
    await productCacheService.invalidateProductCache(productId);
    return updatedProduct!;
  },

  /**
   * Soft delete a product
   */
  async deleteProduct(productId: string, sellerId: string): Promise<void> {
    const product = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    if (product.sellerId.toString() !== sellerId.toString()) {
      throw new AppError("Unauthorized product deletion", 403);
    }

    await Product.findByIdAndUpdate(productId, { status: "banned" });
    await ProductVariant.updateMany({ productId }, { stock: 0 });

    await productCacheService.invalidateProductCache(productId);
  },

  /**
   * Get product by ID with variants and caching
   */
  async getProductById(
    productId: string,
    role?: string,
  ): Promise<IProductWithVariants> {
    const cached = await productCacheService.getProductCache(productId);
    if (cached) {
      if (role === "buyer" && ["draft", "banned"].includes(cached.status)) {
        throw new AppError("Product not found", 404);
      }
      return cached;
    }

    const product = await Product.findById(productId).lean();
    if (!product) throw new AppError("Product not found", 404);

    if (role === "buyer" && ["draft", "banned"].includes(product.status)) {
      throw new AppError("Product not found", 404);
    }

    const variants = await ProductVariant.find({ productId })
      .sort({ isDefault: -1, createdAt: 1 })
      .lean();

    const result = { ...product, variants } as IProductWithVariants;
    await productCacheService.setProductCache(productId, result);

    return result;
  },

  /**
   * Get products with advanced filtering and pagination
   */
  async getProducts(
    filters: IProductFilters,
  ): Promise<IPaginatedResult<IProduct>> {
    const {
      categoryId,
      sellerId,
      status,
      minPrice,
      maxPrice,
      brand,
      tags,
      inStock,
      search,
      sortBy,
      page = 1,
      limit = 20,
    } = filters;

    const query: any = {};

    if (categoryId) query.categoryId = categoryId;
    if (sellerId) query.sellerId = sellerId;
    if (status) query.status = status;
    else query.status = "active";

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.$or = [
        {
          basePrice: {
            ...(minPrice && { $gte: minPrice }),
            ...(maxPrice && { $lte: maxPrice }),
          },
        },
        {
          salePrice: {
            ...(minPrice && { $gte: minPrice }),
            ...(maxPrice && { $lte: maxPrice }),
          },
        },
      ];
    }

    if (brand) query.brand = brand;
    if (tags && tags.length > 0) query.tags = { $in: tags };
    if (inStock) query.totalStock = { $gt: 0 };

    if (search) {
      query.$text = { $search: search };
    }

    let sort: any = { createdAt: -1 };
    switch (sortBy) {
      case "price_asc":
        sort = { basePrice: 1 };
        break;
      case "price_desc":
        sort = { basePrice: -1 };
        break;
      case "rating":
        sort = { averageRating: -1 };
        break;
      case "bestseller":
        sort = { totalSales: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: data as IProduct[],
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  },

  /**
   * Get seller's own products
   */
  async getSellerProducts(
    sellerId: string,
    filters: IProductFilters,
  ): Promise<IPaginatedResult<IProduct>> {
    return this.getProducts({ ...filters, sellerId });
  },

  /**
   * Publish a draft product
   */
  async publishProduct(productId: string, sellerId: string): Promise<IProduct> {
    const product = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);
    if (product.sellerId.toString() !== sellerId)
      throw new AppError("Unauthorized", 403);

    const missingFields = [];
    if (!product.title) missingFields.push("title");
    if (!product.shortDescription) missingFields.push("shortDescription");
    if (!product.images || product.images.length === 0)
      missingFields.push("images");
    if (!product.basePrice) missingFields.push("basePrice");
    if (!product.categoryId) missingFields.push("categoryId");
    if (!product.sku) missingFields.push("sku");

    if (missingFields.length > 0) {
      throw new AppError(
        `Cannot publish incomplete product. Missing: ${missingFields.join(", ")}`,
        400,
      );
    }

    const updated = await Product.findByIdAndUpdate(
      productId,
      { status: "active" },
      { new: true },
    );
    await productCacheService.invalidateProductCache(productId);
    return updated!;
  },

  /**
   * Update stock level for product or variant
   */
  async updateStock(payload: IStockUpdatePayload): Promise<void> {
    const { productId, variantId, quantity, operation } = payload;

    if (variantId) {
      const update: any = {};
      if (operation === "increment") update.$inc = { stock: quantity };
      else if (operation === "decrement") update.$inc = { stock: -quantity };
      else update.stock = quantity;

      await ProductVariant.findByIdAndUpdate(variantId, update);
    } else {
      const update: any = {};
      if (operation === "increment") update.$inc = { totalStock: quantity };
      else if (operation === "decrement")
        update.$inc = { totalStock: -quantity };
      else update.totalStock = quantity;

      await Product.findByIdAndUpdate(productId, update);
    }

    const newTotalStock = await recalculateProductStock(productId);

    const product = await Product.findById(productId);
    if (product && newTotalStock <= product.lowStockThreshold) {
      console.warn(
        `LOW STOCK WARNING: Product ${product.title} (${productId}) total stock is ${newTotalStock}`,
      );
    }

    await productCacheService.invalidateProductCache(productId);
  },

  /**
   * Increment view count using Redis for performance
   */
  async incrementViewCount(productId: string): Promise<void> {
    const key = `views:${productId}`;
    const views = await redis.incr(key);

    if (views % 100 === 0) {
      await Product.findByIdAndUpdate(productId, { $inc: { viewCount: 100 } });
      await redis.set(key, 0); // Reset counter after flush
    }
  },

  /**
   * Update product rating and invalid cache
   */
  async updateProductRating(
    productId: string,
    newRating: number,
    totalReviews: number,
  ): Promise<void> {
    await Product.findByIdAndUpdate(productId, {
      averageRating: newRating,
      totalReviews: totalReviews,
    });
    await productCacheService.invalidateProductCache(productId);
  },
};

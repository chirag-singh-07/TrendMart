import Product from "../models/product.model";
import { IProduct } from "../../interfaces";
import { IProductFilters, IPaginatedResult } from "../types/product.types";
import { productCacheService } from "./productCache.service";

/**
 * Product Search Service - Specialized for discovery and recommendations
 */
export const productSearchService = {
  /**
   * Search products with relevance scoring
   */
  async searchProducts(
    query: string,
    filters: IProductFilters,
  ): Promise<IPaginatedResult<IProduct>> {
    const {
      categoryId,
      minPrice,
      maxPrice,
      brand,
      inStock,
      page = 1,
      limit = 20,
    } = filters;

    const mongoQuery: any = {
      status: "active",
      $text: { $search: query },
    };

    if (categoryId) mongoQuery.categoryId = categoryId;
    if (minPrice !== undefined || maxPrice !== undefined) {
      mongoQuery.$or = [
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
    if (brand) mongoQuery.brand = brand;
    if (inStock) mongoQuery.totalStock = { $gt: 0 };

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Product.find(mongoQuery, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(mongoQuery),
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
   * Get related products based on category and tags
   */
  async getRelatedProducts(
    productId: string,
    limit: number = 8,
  ): Promise<IProduct[]> {
    const product = await Product.findById(productId);
    if (!product) return [];

    return Product.find({
      _id: { $ne: productId },
      status: "active",
      $or: [
        { categoryId: product.categoryId },
        { tags: { $in: product.tags } },
      ],
    })
      .sort({ totalSales: -1, averageRating: -1 })
      .limit(limit)
      .lean() as unknown as IProduct[];
  },

  /**
   * Get featured products (cached)
   */
  async getFeaturedProducts(limit: number = 10): Promise<IProduct[]> {
    const cached =
      await productCacheService.getFeaturedCache("featured:products");
    if (cached) return cached;

    const products = await Product.find({ status: "active", isFeatured: true })
      .sort({ totalSales: -1, averageRating: -1 })
      .limit(limit)
      .lean();

    await productCacheService.setFeaturedCache("featured:products", products);
    return products as unknown as IProduct[];
  },

  /**
   * Get new arrivals (cached)
   */
  async getNewArrivals(limit: number = 10): Promise<IProduct[]> {
    const cached = await productCacheService.getFeaturedCache("new:arrivals");
    if (cached) return cached;

    const products = await Product.find({ status: "active" })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    await productCacheService.setFeaturedCache("new:arrivals", products);
    return products as unknown as IProduct[];
  },

  /**
   * Get best sellers (cached)
   */
  async getBestSellers(limit: number = 10): Promise<IProduct[]> {
    const cached = await productCacheService.getFeaturedCache("bestsellers");
    if (cached) return cached;

    const products = await Product.find({ status: "active" })
      .sort({ totalSales: -1 })
      .limit(limit)
      .lean();

    await productCacheService.setFeaturedCache("bestsellers", products);
    return products as unknown as IProduct[];
  },
};

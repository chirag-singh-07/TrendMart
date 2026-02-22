import mongoose from "mongoose";
import Review from "../../models/Review.model.js";
import { productService } from "../../product/services/product.service.js";
import { getRedisClient } from "../../config/redis.js";
import { IRatingSummary } from "../types/review.types.js";

/**
 * Service for recalculating product ratings based on approved reviews only
 */
export const ratingCalculatorService = {
  /**
   * Recalculates and persists the average rating for a product using ONLY approved reviews.
   * Triggers product record update and invalidates the rating summary cache.
   *
   * @param productId - The product whose rating needs recalculation
   */
  async recalculateProductRating(productId: string): Promise<void> {
    const result = await Review.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(productId),
          moderationStatus: "approved",
        },
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          sumRatings: { $sum: "$rating" },
        },
      },
    ]);

    const totalReviews = result[0]?.totalReviews ?? 0;
    const sumRatings = result[0]?.sumRatings ?? 0;
    const averageRating =
      totalReviews > 0 ? Math.round((sumRatings / totalReviews) * 10) / 10 : 0;

    await productService.updateProductRating(
      productId,
      averageRating,
      totalReviews,
    );

    // Invalidate rating summary cache
    const redis = getRedisClient();
    await redis.del(`cache:rating:summary:${productId}`);
  },

  /**
   * Returns a breakdown of review counts per star level (1–5) for approved reviews.
   *
   * @param productId - The product to aggregate
   * @returns Record mapping each star level to its review count
   */
  async getRatingBreakdown(
    productId: string,
  ): Promise<Record<1 | 2 | 3 | 4 | 5, number>> {
    const result = await Review.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(productId),
          moderationStatus: "approved",
        },
      },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const item of result) {
      breakdown[item._id] = item.count;
    }

    return breakdown as Record<1 | 2 | 3 | 4 | 5, number>;
  },

  /**
   * Calculates a Bayesian weighted rating for this product.
   * Prevents a product with 1 review rated 5★ from ranking higher
   * than a product with 1000 reviews rated 4.5★.
   *
   * Formula: (v / (v + m)) * R + (m / (v + m)) * C
   *   v = number of reviews for this product
   *   m = minimum reviews threshold (10)
   *   R = product's average rating
   *   C = global average rating across all approved reviews
   *
   * NOTE: This value is used for internal ranking only — never exposed in public API.
   *
   * @param productId - Product to compute Bayesian rating for
   * @returns Bayesian-adjusted rating score
   */
  async getWeightedRating(productId: string): Promise<number> {
    const MINIMUM_REVIEWS = 10;

    // Get product-specific stats
    const productStats = await Review.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(productId),
          moderationStatus: "approved",
        },
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          average: { $avg: "$rating" },
        },
      },
    ]);

    const v = productStats[0]?.count ?? 0;
    const R = productStats[0]?.average ?? 0;

    // Get global average (C)
    const globalStats = await Review.aggregate([
      { $match: { moderationStatus: "approved" } },
      {
        $group: {
          _id: null,
          globalAverage: { $avg: "$rating" },
        },
      },
    ]);

    const C = globalStats[0]?.globalAverage ?? 3; // default to 3 if no data

    const m = MINIMUM_REVIEWS;
    const bayesianRating = (v / (v + m)) * R + (m / (v + m)) * C;

    return Math.round(bayesianRating * 100) / 100;
  },
};

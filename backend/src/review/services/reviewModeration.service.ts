import mongoose from "mongoose";
import Review from "../../models/Review.model.js";
import { getRedisClient } from "../../config/redis.js";
import { ratingCalculatorService } from "./ratingCalculator.service.js";
import AppError from "../../utils/AppError.js";
import {
  IReviewFilters,
  IReviewWithUser,
  IPaginatedReviewResult,
} from "../types/review.types.js";

async function invalidateProductReviewCache(productId: string): Promise<void> {
  const redis = getRedisClient();
  let cursor = "0";
  const pattern = `cache:reviews:${productId}:*`;
  do {
    const [nextCursor, keys] = await redis.scan(
      cursor,
      "MATCH",
      pattern,
      "COUNT",
      100,
    );
    cursor = nextCursor;
    if (keys.length > 0) await redis.del(...keys);
  } while (cursor !== "0");
}

/**
 * Service for all admin-level review moderation operations
 */
export const reviewModerationService = {
  /**
   * Approves a review, making it visible to the public.
   * Triggers rating recalculation so the product's averageRating reflects the
   * newly approved review. Invalidates both the review page cache and rating
   * summary cache.
   *
   * @param reviewId - ID of the review to approve
   * @param adminId - ID of the admin performing the action
   * @returns The updated review document
   */
  async approveReview(reviewId: string, adminId: string) {
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError("Review not found", 404);

    review.moderationStatus = "approved";
    await review.save();

    await ratingCalculatorService.recalculateProductRating(
      String(review.productId),
    );
    await invalidateProductReviewCache(String(review.productId));

    const redis = getRedisClient();
    await redis.del(`cache:rating:summary:${review.productId}`);

    return review;
  },

  /**
   * Rejects a review, preventing it from being publicly visible.
   * Triggers rating recalculation and cache invalidation.
   *
   * @param reviewId - ID of the review to reject
   * @param adminId - ID of the admin performing the action
   * @param reason - Reason for rejection (stored in Redis log)
   * @returns The updated review document
   */
  async rejectReview(reviewId: string, adminId: string, reason?: string) {
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError("Review not found", 404);

    review.moderationStatus = "rejected";
    await review.save();

    // Log the rejection reason in Redis
    if (reason) {
      const redis = getRedisClient();
      await redis.set(
        `rejection:review:${reviewId}`,
        `[${adminId}] ${reason}`,
        "EX",
        90 * 24 * 3600,
      );
    }

    await ratingCalculatorService.recalculateProductRating(
      String(review.productId),
    );
    await invalidateProductReviewCache(String(review.productId));

    const redis = getRedisClient();
    await redis.del(`cache:rating:summary:${review.productId}`);

    return review;
  },

  /**
   * Manually flags a review for elevated moderation priority.
   * Flagged reviews appear above "pending" reviews in the moderation queue.
   *
   * @param reviewId - ID of the review to flag
   * @param adminId - ID of the admin performing the action
   * @returns The updated review document
   */
  async flagReview(reviewId: string, adminId: string) {
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError("Review not found", 404);

    review.moderationStatus = "flagged";
    await review.save();

    return review;
  },

  /**
   * Returns a paginated moderation queue for admin review.
   * Flagged reviews are sorted first (higher urgency), then pending.
   * Each review is populated with user details and product title.
   *
   * @param filters - Pagination options
   */
  async getModerationQueue(
    filters: IReviewFilters,
  ): Promise<IPaginatedReviewResult<IReviewWithUser>> {
    const { page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const query = { moderationStatus: { $in: ["pending", "flagged"] } };

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("userId", "fullName email avatar")
        .populate("productId", "title thumbnail")
        .sort({ reportCount: -1, createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
    ]);

    // Sort: flagged before pending within the results
    const sorted = (reviews as any[]).sort((a, b) => {
      if (a.moderationStatus === "flagged" && b.moderationStatus !== "flagged")
        return -1;
      if (a.moderationStatus !== "flagged" && b.moderationStatus === "flagged")
        return 1;
      return 0;
    });

    return {
      reviews: sorted as any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  },

  /**
   * Processes multiple reviews in parallel.
   * Returns a partial success report if any reviews fail.
   *
   * @param reviewIds - Array of review IDs to process
   * @param action - "approve" or "reject"
   * @param adminId - Admin performing the bulk action
   */
  async bulkModerate(
    reviewIds: string[],
    action: "approve" | "reject",
    adminId: string,
  ): Promise<{ success: string[]; failed: string[] }> {
    const results = await Promise.allSettled(
      reviewIds.map((id) =>
        action === "approve"
          ? this.approveReview(id, adminId)
          : this.rejectReview(id, adminId),
      ),
    );

    const succeeded: string[] = [];
    const failed: string[] = [];

    results.forEach((result, idx) => {
      if (result.status === "fulfilled") {
        succeeded.push(reviewIds[idx]);
      } else {
        failed.push(reviewIds[idx]);
      }
    });

    return { success: succeeded, failed };
  },

  /**
   * Returns a paginated list of reviews with at least one report.
   * Sorted by report count descending for prioritised review.
   *
   * @param filters - Pagination options
   */
  async getReportedReviews(
    filters: IReviewFilters,
  ): Promise<IPaginatedReviewResult<IReviewWithUser>> {
    const { page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const query = { reportCount: { $gt: 0 } };

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("userId", "fullName email avatar")
        .populate("productId", "title thumbnail")
        .sort({ reportCount: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
    ]);

    return {
      reviews: reviews as any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  },
};

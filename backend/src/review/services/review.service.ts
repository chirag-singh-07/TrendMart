import crypto from "crypto";
import mongoose from "mongoose";
import Review from "../../models/Review.model.js";
import { getRedisClient } from "../../config/redis.js";
import { reviewEligibilityService } from "./reviewEligibility.service.js";
import { ratingCalculatorService } from "./ratingCalculator.service.js";
import AppError from "../../utils/AppError.js";
import {
  ICreateReviewPayload,
  IUpdateReviewPayload,
  IReviewFilters,
  IRatingSummary,
  IReviewWithUser,
  IPaginatedReviewResult,
} from "../types/review.types.js";

const REPORT_THRESHOLD = 5;

function buildFiltersHash(filters: IReviewFilters): string {
  const relevant = {
    rating: filters.rating,
    isVerifiedPurchase: filters.isVerifiedPurchase,
    sortBy: filters.sortBy,
    fromDate: filters.fromDate,
    toDate: filters.toDate,
  };
  return crypto
    .createHash("md5")
    .update(JSON.stringify(relevant))
    .digest("hex")
    .slice(0, 8);
}

async function invalidateProductReviewCache(productId: string): Promise<void> {
  const redis = getRedisClient();
  // Use SCAN to delete all review cache keys for this product
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
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } while (cursor !== "0");
}

/**
 * Core review service — handles all review lifecycle operations
 */
export const reviewService = {
  /**
   * Creates a new review after verifying eligibility and purchase ownership.
   * All new reviews start in "pending" moderation status.
   * Triggers productrating recalculation and cache invalidation.
   *
   * @param userId - ID of the authenticated buyer
   * @param payload - Review content and purchase reference
   * @returns The newly created review document
   */
  async createReview(userId: string, payload: ICreateReviewPayload) {
    const { productId, orderId, ...reviewData } = payload;

    // Eligibility check (already reviewed + verified purchase)
    const eligibility = await reviewEligibilityService.checkEligibility(
      userId,
      productId,
    );
    if (!eligibility.isEligible) {
      const statusCode = eligibility.alreadyReviewed ? 400 : 403;
      throw new AppError(eligibility.reason!, statusCode);
    }

    // Order ownership + product match verification
    const isOwner = await reviewEligibilityService.verifyOrderOwnership(
      userId,
      orderId,
      productId,
    );
    if (!isOwner) {
      throw new AppError("Order does not match this product", 403);
    }

    const review = await Review.create({
      ...reviewData,
      productId: new mongoose.Types.ObjectId(productId),
      userId: new mongoose.Types.ObjectId(userId),
      isVerifiedPurchase: true,
      moderationStatus: "pending",
      helpfulVotes: 0,
      reportCount: 0,
    });

    await ratingCalculatorService.recalculateProductRating(productId);
    await invalidateProductReviewCache(productId);

    return review;
  },

  /**
   * Updates an existing review.
   * Verifies ownership and that the review is not in "rejected" status.
   * Resets moderationStatus to "pending" to require re-moderation.
   *
   * @param reviewId - The review to update
   * @param userId - Must match review.userId
   * @param payload - Fields to update
   * @returns The updated review document
   */
  async updateReview(
    reviewId: string,
    userId: string,
    payload: IUpdateReviewPayload,
  ) {
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError("Review not found", 404);

    if (String(review.userId) !== userId) {
      throw new AppError(
        "You do not have permission to modify this review",
        403,
      );
    }

    if (review.moderationStatus === "rejected") {
      throw new AppError("Rejected reviews cannot be edited", 400);
    }

    const updateFields: Record<string, any> = {
      ...payload,
      moderationStatus: "pending", // always re-moderate after edit
    };

    const updated = await Review.findByIdAndUpdate(reviewId, updateFields, {
      new: true,
    });

    await ratingCalculatorService.recalculateProductRating(
      String(review.productId),
    );
    await invalidateProductReviewCache(String(review.productId));

    return updated!;
  },

  /**
   * Deletes a review.
   * Buyers can only delete their own; admins can delete any.
   * Triggers rating recalculation.
   *
   * @param reviewId - The review to delete
   * @param userId - Requesting user's ID
   * @param role - "buyer" or "admin"
   */
  async deleteReview(
    reviewId: string,
    userId: string,
    role: string,
  ): Promise<void> {
    const review = await Review.findById(reviewId);
    if (!review) throw new AppError("Review not found", 404);

    if (role === "buyer" && String(review.userId) !== userId) {
      throw new AppError(
        "You do not have permission to modify this review",
        403,
      );
    }

    const productId = String(review.productId);
    await Review.findByIdAndDelete(reviewId);

    await ratingCalculatorService.recalculateProductRating(productId);
    await invalidateProductReviewCache(productId);
  },

  /**
   * Fetches a single review by ID with user details populated.
   *
   * @param reviewId - The review to retrieve
   * @returns Review with populated user data
   */
  async getReviewById(reviewId: string): Promise<IReviewWithUser> {
    const review = await Review.findById(reviewId)
      .populate("userId", "fullName avatar")
      .lean();

    if (!review) throw new AppError("Review not found", 404);

    return review as any;
  },

  /**
   * Fetches paginated, approved reviews for a product.
   * Supports rating filter, verified purchase filter, and multiple sort modes.
   * Results are cached in Redis per product/page/filter combination.
   *
   * @param productId - The product to fetch reviews for
   * @param filters - Sort, filter, and pagination options
   */
  async getProductReviews(
    productId: string,
    filters: IReviewFilters,
  ): Promise<IPaginatedReviewResult<IReviewWithUser>> {
    const {
      rating,
      isVerifiedPurchase,
      sortBy = "newest",
      page = 1,
      limit = 10,
    } = filters;
    const redis = getRedisClient();
    const filtersHash = buildFiltersHash(filters);
    const cacheKey = `cache:reviews:${productId}:${page}:${filtersHash}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const query: any = {
      productId: new mongoose.Types.ObjectId(productId),
      moderationStatus: "approved",
    };

    if (rating) query.rating = rating;
    if (isVerifiedPurchase !== undefined)
      query.isVerifiedPurchase = isVerifiedPurchase;

    const sortMap: Record<string, any> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest_rating: { rating: -1 },
      lowest_rating: { rating: 1 },
      most_helpful: { helpfulVotes: -1 },
    };

    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("userId", "fullName avatar")
        .sort(sortMap[sortBy])
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(query),
    ]);

    const result: IPaginatedReviewResult<IReviewWithUser> = {
      reviews: reviews as any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };

    await redis.set(cacheKey, JSON.stringify(result), "EX", 600); // 10 min
    return result;
  },

  /**
   * Fetches all reviews written by a specific user, regardless of moderation status.
   * Sorted by newest first.
   *
   * @param userId - Owner of the reviews
   * @param filters - Pagination options
   */
  async getUserReviews(
    userId: string,
    filters: IReviewFilters,
  ): Promise<IPaginatedReviewResult<any>> {
    const { page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const query = { userId: new mongoose.Types.ObjectId(userId) };

    const [reviews, total] = await Promise.all([
      Review.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Review.countDocuments(query),
    ]);

    return {
      reviews,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  },

  /**
   * Records a "helpful" vote from a user on a review.
   * Uses a Redis Set to ensure each user can only vote once per review.
   * Uses $inc for atomic increments without a full re-fetch.
   *
   * @param reviewId - The review being voted on
   * @param userId - The voter's user ID
   * @returns The updated review
   */
  async voteHelpful(reviewId: string, userId: string) {
    const redis = getRedisClient();
    const setKey = `votes:helpful:${reviewId}`;

    const alreadyVoted = await redis.sismember(setKey, userId);
    if (alreadyVoted) {
      throw new AppError("You have already voted this review as helpful", 400);
    }

    const review = await Review.findById(reviewId);
    if (!review) throw new AppError("Review not found", 404);

    await redis.sadd(setKey, userId);
    await redis.expire(setKey, 30 * 24 * 3600); // 30 days

    const updated = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpfulVotes: 1 } },
      { new: true },
    );

    return updated!;
  },

  /**
   * Records a report on a review from a user.
   * Uses a Redis key to prevent duplicate reports.
   * If the report threshold (5) is reached, sets moderationStatus to "flagged".
   *
   * @param reviewId - The review being reported
   * @param userId - The reporter's user ID
   * @param reason - The reason for the report
   */
  async reportReview(
    reviewId: string,
    userId: string,
    reason: string,
  ): Promise<void> {
    const redis = getRedisClient();
    const reportKey = `reports:${reviewId}:${userId}`;

    const alreadyReported = await redis.exists(reportKey);
    if (alreadyReported) {
      throw new AppError("You have already reported this review", 400);
    }

    const review = await Review.findById(reviewId);
    if (!review) throw new AppError("Review not found", 404);

    // Persist report flag permanently
    await redis.set(reportKey, reason);

    const newCount = review.reportCount + 1;
    const updatePayload: any = { $inc: { reportCount: 1 } };

    if (newCount >= REPORT_THRESHOLD) {
      updatePayload.$set = { moderationStatus: "flagged" };
    }

    await Review.findByIdAndUpdate(reviewId, updatePayload);

    if (newCount >= REPORT_THRESHOLD) {
      await invalidateProductReviewCache(String(review.productId));
    }
  },

  /**
   * Aggregates a rating summary for a product including breakdowns and verified counts.
   * Cached in Redis for 30 minutes.
   *
   * @param productId - The product to summarize
   * @returns IRatingSummary with breakdown and metadata
   */
  async getRatingSummary(productId: string): Promise<IRatingSummary> {
    const redis = getRedisClient();
    const cacheKey = `cache:rating:summary:${productId}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const matchStage = {
      $match: {
        productId: new mongoose.Types.ObjectId(productId),
        moderationStatus: "approved",
      },
    };

    const [aggregated, breakdown] = await Promise.all([
      Review.aggregate([
        matchStage,
        {
          $group: {
            _id: null,
            totalReviews: { $sum: 1 },
            averageRating: { $avg: "$rating" },
            verifiedPurchaseCount: {
              $sum: { $cond: ["$isVerifiedPurchase", 1, 0] },
            },
            withImagesCount: {
              $sum: {
                $cond: [
                  { $gt: [{ $size: { $ifNull: ["$images", []] } }, 0] },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
      Review.aggregate([
        matchStage,
        {
          $group: {
            _id: "$rating",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const ratingBreakdown: any = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    for (const item of breakdown) {
      ratingBreakdown[item._id] = item.count;
    }

    const summary: IRatingSummary = {
      productId,
      averageRating: aggregated[0]
        ? Math.round(aggregated[0].averageRating * 10) / 10
        : 0,
      totalReviews: aggregated[0]?.totalReviews ?? 0,
      ratingBreakdown,
      verifiedPurchaseCount: aggregated[0]?.verifiedPurchaseCount ?? 0,
      withImagesCount: aggregated[0]?.withImagesCount ?? 0,
    };

    await redis.set(cacheKey, JSON.stringify(summary), "EX", 1800); // 30 min
    return summary;
  },
};

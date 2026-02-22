import { Request, Response, NextFunction } from "express";
import { reviewService } from "../services/review.service.js";
import { reviewEligibilityService } from "../services/reviewEligibility.service.js";

const ok = (res: Response, message: string, data: any) =>
  res.status(200).json({ success: true, message, data });

/**
 * Buyer-facing and public review controller
 */
export const reviewController = {
  /**
   * GET /product/:productId — Public: approved reviews for a product
   */
  async getProductReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await reviewService.getProductReviews(
        req.params.productId as string,
        req.query as any,
      );
      ok(res, "Product reviews fetched", result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /product/:productId/summary — Public: rating summary + breakdown
   */
  async getRatingSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const summary = await reviewService.getRatingSummary(
        req.params.productId as string,
      );
      ok(res, "Rating summary fetched", { summary });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /:reviewId — Public: single review detail
   */
  async getReviewById(req: Request, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.getReviewById(
        req.params.reviewId as string,
      );
      ok(res, "Review fetched", { review });
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /me — Buyer: own reviews across all products
   */
  async getMyReviews(req: any, res: Response, next: NextFunction) {
    try {
      const result = await reviewService.getUserReviews(
        req.user.userId,
        req.query as any,
      );
      ok(res, "Your reviews fetched", result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /eligible — Buyer: products eligible for review
   */
  async getEligibleProducts(req: any, res: Response, next: NextFunction) {
    try {
      const productIds = await reviewEligibilityService.getEligibleProducts(
        req.user.userId,
      );
      ok(res, "Eligible products fetched", {
        productIds,
        count: productIds.length,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST / — Buyer: submit a new review
   */
  async createReview(req: any, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.createReview(
        req.user.userId,
        req.body,
      );
      res.status(201).json({
        success: true,
        message: "Review submitted and pending moderation",
        data: { review },
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /:reviewId — Buyer: edit own review
   */
  async updateReview(req: any, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.updateReview(
        req.params.reviewId as string,
        req.user.userId,
        req.body,
      );
      ok(res, "Review updated and pending re-moderation", { review });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /:reviewId — Buyer: delete own review
   */
  async deleteReview(req: any, res: Response, next: NextFunction) {
    try {
      await reviewService.deleteReview(
        req.params.reviewId as string,
        req.user.userId,
        "buyer",
      );
      ok(res, "Review deleted", null);
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /:reviewId/helpful — Buyer: vote review as helpful
   */
  async voteHelpful(req: any, res: Response, next: NextFunction) {
    try {
      const review = await reviewService.voteHelpful(
        req.params.reviewId as string,
        req.user.userId,
      );
      ok(res, "Marked as helpful", { review });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /:reviewId/report — Buyer: report a review
   */
  async reportReview(req: any, res: Response, next: NextFunction) {
    try {
      await reviewService.reportReview(
        req.params.reviewId as string,
        req.user.userId,
        req.body.reason,
      );
      ok(res, "Review reported", null);
    } catch (err) {
      next(err);
    }
  },
};

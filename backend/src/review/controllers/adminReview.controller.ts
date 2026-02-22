import { Request, Response, NextFunction } from "express";
import { reviewService } from "../services/review.service.js";
import { reviewModerationService } from "../services/reviewModeration.service.js";

const ok = (res: Response, message: string, data: any) =>
  res.status(200).json({ success: true, message, data });

/**
 * Admin-only review management controller
 */
export const adminReviewController = {
  /**
   * GET / — All reviews with optional filters
   */
  async getAllReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId, productId } = req.query as any;
      let result: any;

      if (userId) {
        result = await reviewService.getUserReviews(userId, req.query as any);
      } else if (productId) {
        result = await reviewService.getProductReviews(
          productId,
          req.query as any,
        );
      } else {
        // Return moderation queue as default admin view when no filter
        result = await reviewModerationService.getModerationQueue(
          req.query as any,
        );
      }

      ok(res, "Reviews fetched", result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /moderation-queue — Pending + flagged reviews (flagged first)
   */
  async getModerationQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await reviewModerationService.getModerationQueue(
        req.query as any,
      );
      ok(res, "Moderation queue fetched", result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /reported — Reviews with at least one report
   */
  async getReportedReviews(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await reviewModerationService.getReportedReviews(
        req.query as any,
      );
      ok(res, "Reported reviews fetched", result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /:reviewId/approve — Approve a review
   */
  async approveReview(req: any, res: Response, next: NextFunction) {
    try {
      const review = await reviewModerationService.approveReview(
        req.params.reviewId as string,
        req.user.userId,
      );
      ok(res, "Review approved", { review });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /:reviewId/reject — Reject a review
   */
  async rejectReview(req: any, res: Response, next: NextFunction) {
    try {
      const review = await reviewModerationService.rejectReview(
        req.params.reviewId as string,
        req.user.userId,
        req.body.reason,
      );
      ok(res, "Review rejected", { review });
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /:reviewId/flag — Manually flag a review
   */
  async flagReview(req: any, res: Response, next: NextFunction) {
    try {
      const review = await reviewModerationService.flagReview(
        req.params.reviewId as string,
        req.user.userId,
      );
      ok(res, "Review flagged for moderation", { review });
    } catch (err) {
      next(err);
    }
  },

  /**
   * POST /bulk-moderate — Approve or reject multiple reviews at once
   */
  async bulkModerate(req: any, res: Response, next: NextFunction) {
    try {
      const { reviewIds, action } = req.body;
      const result = await reviewModerationService.bulkModerate(
        reviewIds,
        action,
        req.user.userId,
      );
      ok(res, "Bulk moderation complete", { result });
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /:reviewId — Admin can delete any review
   */
  async deleteReview(req: any, res: Response, next: NextFunction) {
    try {
      await reviewService.deleteReview(
        req.params.reviewId as string,
        req.user.userId,
        "admin",
      );
      ok(res, "Review deleted", null);
    } catch (err) {
      next(err);
    }
  },
};

import { Request, Response, NextFunction } from "express";
import Review from "../../models/Review.model.js";
import AppError from "../../utils/AppError.js";

/**
 * Middleware to verify that the authenticated buyer owns the target review.
 * Attaches the review document to req.review to avoid a redundant DB fetch
 * in the controller.
 */
export const reviewOwner = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user?.userId;

    const review = await Review.findById(reviewId);
    if (!review) {
      return next(new AppError("Review not found", 404));
    }

    if (String(review.userId) !== String(userId)) {
      return next(
        new AppError("You do not have permission to modify this review", 403),
      );
    }

    req.review = review;
    next();
  } catch (err) {
    next(err);
  }
};

import { Router } from "express";
import { adminReviewController } from "../controllers/adminReview.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  reviewFiltersSchema,
  bulkModerateSchema,
} from "../validators/review.validator.js";

const router = Router();

router.use(authenticate, authorize("admin"));

router.get(
  "/",
  validate(reviewFiltersSchema),
  adminReviewController.getAllReviews,
);
router.get("/moderation-queue", adminReviewController.getModerationQueue);
router.get("/reported", adminReviewController.getReportedReviews);
router.patch("/:reviewId/approve", adminReviewController.approveReview);
router.patch("/:reviewId/reject", adminReviewController.rejectReview);
router.patch("/:reviewId/flag", adminReviewController.flagReview);
router.post(
  "/bulk-moderate",
  validate(bulkModerateSchema),
  adminReviewController.bulkModerate,
);
router.delete("/:reviewId", adminReviewController.deleteReview);

export default router;

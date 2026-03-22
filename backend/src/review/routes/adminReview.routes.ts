import { Router } from "express";
import { adminReviewController } from "../controllers/adminReview.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import {
  reviewFiltersSchema,
  bulkModerateSchema,
} from "../validators/review.validator.js";

const router = Router();

router.use(authenticate, authorize("admin", "super_admin", "moderator"));

router.get(
  "/",
  validateRequest(reviewFiltersSchema),
  adminReviewController.getAllReviews,
);
router.get("/moderation-queue", adminReviewController.getModerationQueue);
router.get("/reported", adminReviewController.getReportedReviews);
router.patch("/:reviewId/approve", adminReviewController.approveReview);
router.patch("/:reviewId/reject", adminReviewController.rejectReview);
router.patch("/:reviewId/flag", adminReviewController.flagReview);
router.post(
  "/bulk-moderate",
  validateRequest(bulkModerateSchema),
  adminReviewController.bulkModerate,
);
router.delete("/:reviewId", adminReviewController.deleteReview);

export default router;

import { Router } from "express";
import { reviewController } from "../controllers/review.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  createReviewSchema,
  updateReviewSchema,
  reviewFiltersSchema,
  reportReviewSchema,
} from "../validators/review.validator.js";

const router = Router();

// ── Public Routes ────────────────────────────────────────────────────────────
router.get(
  "/product/:productId",
  validate(reviewFiltersSchema),
  reviewController.getProductReviews,
);
router.get("/product/:productId/summary", reviewController.getRatingSummary);
router.get("/:reviewId", reviewController.getReviewById);

// ── Buyer Routes ─────────────────────────────────────────────────────────────
const buyerRouter = Router();
buyerRouter.use(authenticate, authorize("buyer"));

buyerRouter.get(
  "/me",
  validate(reviewFiltersSchema),
  reviewController.getMyReviews,
);
buyerRouter.get("/eligible", reviewController.getEligibleProducts);
buyerRouter.post(
  "/",
  validate(createReviewSchema),
  reviewController.createReview,
);
buyerRouter.patch(
  "/:reviewId",
  validate(updateReviewSchema),
  reviewController.updateReview,
);
buyerRouter.delete("/:reviewId", reviewController.deleteReview);
buyerRouter.post("/:reviewId/helpful", reviewController.voteHelpful);
buyerRouter.post(
  "/:reviewId/report",
  validate(reportReviewSchema),
  reviewController.reportReview,
);

// Merge both routers
router.use("/", buyerRouter);

export default router;

import { Router } from "express";
import { payoutController } from "../controllers/payout.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { payoutSchema } from "../validators/payment.validator.js";

const router = Router();

// Seller routes
router.get(
  "/pending",
  authenticate,
  authorize("seller"),
  payoutController.getPendingPayout,
);

router.get(
  "/history",
  authenticate,
  authorize("seller"),
  payoutController.getSellerPayouts,
);

// Admin routes
router.get(
  "/",
  authenticate,
  authorize("admin"),
  payoutController.getAllPayouts,
);

router.post(
  "/initiate",
  authenticate,
  authorize("admin"),
  validate(payoutSchema),
  payoutController.initiatePayout,
);

router.patch(
  "/:payoutId/process",
  authenticate,
  authorize("admin"),
  payoutController.processPayout,
);

router.patch(
  "/:payoutId/complete",
  authenticate,
  authorize("admin"),
  payoutController.completePayout,
);

router.patch(
  "/:payoutId/fail",
  authenticate,
  authorize("admin"),
  payoutController.failPayout,
);

export default router;

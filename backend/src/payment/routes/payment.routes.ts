import { Router } from "express";
import { paymentController } from "../controllers/payment.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  initiatePaymentSchema,
  confirmStripeSchema,
} from "../validators/payment.validator.js";

const router = Router();

// ── Buyer routes ──────────────────────────────────────────────────────────────
router.post(
  "/initiate",
  authenticate,
  authorize("buyer"),
  validate(initiatePaymentSchema),
  paymentController.initiatePayment,
);

router.post(
  "/stripe/confirm",
  authenticate,
  authorize("buyer"),
  validate(confirmStripeSchema),
  paymentController.confirmStripePayment,
);

router.get(
  "/order/:orderId",
  authenticate,
  authorize("buyer"),
  paymentController.getPaymentByOrder,
);

router.get(
  "/history",
  authenticate,
  authorize("buyer"),
  paymentController.getPaymentHistory,
);

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get(
  "/",
  authenticate,
  authorize("admin"),
  paymentController.getAllPayments,
);

router.post(
  "/cod/confirm/:orderId",
  authenticate,
  authorize("admin"),
  paymentController.confirmCODCollection,
);

export default router;

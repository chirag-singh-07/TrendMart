import { Router } from "express";
import { refundController } from "../controllers/refund.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import {
  processRefundSchema,
  partialRefundSchema,
} from "../validators/payment.validator.js";

const router = Router();

// Admin routes
router.post(
  "/process/:orderId",
  authenticate,
  authorize("admin"),
  validate(processRefundSchema),
  refundController.processRefund,
);

router.post(
  "/partial/:orderId",
  authenticate,
  authorize("admin"),
  validate(partialRefundSchema),
  refundController.processPartialRefund,
);

// Buyer: check refund status
router.get(
  "/status/:orderId",
  authenticate,
  authorize("buyer"),
  refundController.getRefundStatus,
);

export default router;

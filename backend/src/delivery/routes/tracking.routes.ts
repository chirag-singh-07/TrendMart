import { Router } from "express";
import { trackingController } from "../controllers/tracking.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { shipmentAccess } from "../middlewares/shipmentAccess.middleware.js";

const router = Router();

/**
 * Public Route - Track by number
 */
router.get("/:trackingNumber", trackingController.getTrackingInfo);

/**
 * Protected Routes
 */
router.use(authenticate);

router.get(
  "/:shipmentId/history",
  shipmentAccess,
  trackingController.getStatusHistory,
);
router.post(
  "/:shipmentId/attempt-failed",
  authorize("delivery", "admin"),
  shipmentAccess,
  trackingController.markAttemptFailed,
);

export default router;

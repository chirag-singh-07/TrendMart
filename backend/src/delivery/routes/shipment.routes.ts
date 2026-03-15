import { Router } from "express";
import { shipmentController } from "../controllers/shipment.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import {
  createShipmentSchema,
  updateStatusSchema,
  assignPartnerSchema,
} from "../validators/shipment.validator.js";
import { shipmentAccess } from "../middlewares/shipmentAccess.middleware.js";

const router = Router();

router.use(authenticate);

// Admin only routes
router.post(
  "/",
  authorize("admin"),
  validateRequest(createShipmentSchema),
  shipmentController.createShipment,
);
router.get("/", authorize("admin"), shipmentController.getAllShipments);
router.patch(
  "/:shipmentId/assign",
  authorize("admin"),
  validateRequest(assignPartnerSchema),
  shipmentController.assignPartner,
);
router.patch(
  "/:shipmentId/reassign",
  authorize("admin"),
  validateRequest(assignPartnerSchema),
  shipmentController.reassignPartner,
);
router.post(
  "/:shipmentId/cancel",
  authorize("admin"),
  shipmentController.cancelShipment,
);

// Shared routes
router.get(
  "/:shipmentId",
  shipmentAccess,
  shipmentController.getShipmentDetail,
);
router.patch(
  "/:shipmentId/status",
  authorize("admin", "seller", "delivery"),
  shipmentAccess,
  validateRequest(updateStatusSchema),
  shipmentController.updateStatus,
);
router.get("/order/:orderId", shipmentController.getShipmentByOrder);

export default router;

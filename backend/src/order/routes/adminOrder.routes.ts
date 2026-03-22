import { Router } from "express";
import { adminOrderController } from "../controllers/adminOrder.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import {
  orderFiltersSchema,
  updateStatusSchema,
  cancelOrderSchema,
} from "../validators/order.validator.js";

const router = Router();

router.use(authenticate);
router.use(authorize("admin", "super_admin", "moderator"));

router.get(
  "/",
  validateRequest(orderFiltersSchema),
  adminOrderController.getAllOrders,
);

router.get(
  "/refunds",
  validateRequest(orderFiltersSchema),
  adminOrderController.getRefunds,
);

router.get("/revenue", authorize("super_admin"), adminOrderController.getRevenueReport);

router.get("/:orderId", adminOrderController.getOrderDetail);

router.patch(
  "/:orderId/status",
  validateRequest(updateStatusSchema),
  adminOrderController.updateStatus,
);

router.post("/:orderId/refund/process", adminOrderController.processRefund);

router.post("/:orderId/refund/complete", adminOrderController.completeRefund);

router.post(
  "/:orderId/refund/reject",
  validateRequest(cancelOrderSchema), // Reuse cancelOrderSchema for reject reason
  adminOrderController.rejectRefund,
);

export default router;

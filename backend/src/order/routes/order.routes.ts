import { Router } from "express";
import { orderController } from "../controllers/order.controller.js";
import { orderItemController } from "../controllers/orderItem.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import {
  placeOrderSchema,
  cancelOrderSchema,
  refundRequestSchema,
  updateStatusSchema,
  orderFiltersSchema,
} from "../validators/order.validator.js";
import { orderOwnerMiddleware } from "../middlewares/orderOwner.middleware.js";
import { orderSellerMiddleware } from "../middlewares/orderSeller.middleware.js";

const router = Router();

// --- Buyer Routes (/api/orders) ---

router.post(
  "/",
  authenticate,
  authorize("buyer"),
  validateRequest(placeOrderSchema),
  orderController.placeOrder,
);

router.get(
  "/",
  authenticate,
  authorize("buyer"),
  validateRequest(orderFiltersSchema),
  orderController.getMyOrders,
);

router.get(
  "/:orderId",
  authenticate,
  authorize("buyer"),
  orderOwnerMiddleware,
  orderController.getOrderDetail,
);

router.get(
  "/:orderId/summary",
  authenticate,
  authorize("buyer"),
  orderOwnerMiddleware,
  orderController.getOrderSummary,
);

router.post(
  "/:orderId/cancel",
  authenticate,
  authorize("buyer"),
  orderOwnerMiddleware,
  validateRequest(cancelOrderSchema),
  orderController.cancelOrder,
);

router.post(
  "/:orderId/refund",
  authenticate,
  authorize("buyer"),
  orderOwnerMiddleware,
  validateRequest(refundRequestSchema),
  orderController.requestRefund,
);

// --- Seller Routes (/api/orders/seller) ---
// Note: We can mount this differently in server.ts but here we define the structure.
// If the user wants /api/seller/orders, we'll map a separate router in server.ts or prefix here.

export const buyerOrderRoutes = router;

// Dedicated Seller Router
const sellerRouter = Router();

sellerRouter.get(
  "/",
  authenticate,
  authorize("seller"),
  validateRequest(orderFiltersSchema),
  orderItemController.getSellerOrders,
);

sellerRouter.get(
  "/items",
  authenticate,
  authorize("seller"),
  validateRequest(orderFiltersSchema),
  orderItemController.getSellerItems,
);

sellerRouter.get(
  "/:orderId",
  authenticate,
  authorize("seller"),
  orderSellerMiddleware,
  orderItemController.getSellerOrderDetail,
);

sellerRouter.patch(
  "/:orderId/status",
  authenticate,
  authorize("seller"),
  orderSellerMiddleware,
  validateRequest(updateStatusSchema),
  orderItemController.updateStatus,
);

sellerRouter.get(
  "/earnings/:orderId",
  authenticate,
  authorize("seller"),
  orderSellerMiddleware,
  orderItemController.getEarnings,
);

export const sellerOrderRoutes = sellerRouter;

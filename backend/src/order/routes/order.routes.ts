import { Router } from "express";
import { orderController } from "../controllers/order.controller.js";
import { orderItemController } from "../controllers/orderItem.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
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
  validate(placeOrderSchema),
  orderController.placeOrder,
);

router.get(
  "/",
  authenticate,
  authorize("buyer"),
  validate(orderFiltersSchema),
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
  validate(cancelOrderSchema),
  orderController.cancelOrder,
);

router.post(
  "/:orderId/refund",
  authenticate,
  authorize("buyer"),
  orderOwnerMiddleware,
  validate(refundRequestSchema),
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
  validate(orderFiltersSchema),
  orderItemController.getSellerOrders,
);

sellerRouter.get(
  "/items",
  authenticate,
  authorize("seller"),
  validate(orderFiltersSchema),
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
  validate(updateStatusSchema),
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

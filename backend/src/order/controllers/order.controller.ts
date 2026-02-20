import { Request, Response, NextFunction } from "express";
import { orderService } from "../services/order.service.js";
import { refundService } from "../services/refund.service.js";

const ok = (res: Response, message: string, data?: any) =>
  res.status(200).json({ success: true, message, ...(data ? { data } : {}) });

/**
 * Order Controller - Handles buyer-facing order requests
 */
export const orderController = {
  /**
   * Place a new order from current cart
   */
  async placeOrder(req: any, res: Response, next: NextFunction) {
    try {
      const order = await orderService.placeOrder(req.user.userId, req.body);
      ok(res, "Order placed successfully", { order });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get list of own orders
   */
  async getMyOrders(req: any, res: Response, next: NextFunction) {
    try {
      const result = await orderService.getOrdersByUser(
        req.user.userId,
        req.query,
      );
      ok(res, "Orders fetched successfully", result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get specific order details
   */
  async getOrderDetail(req: any, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderById(
        req.params.orderId,
        req.user.userId,
        req.user.role,
      );
      ok(res, "Order details fetched", { order });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get order summary (lightweight)
   */
  async getOrderSummary(req: any, res: Response, next: NextFunction) {
    try {
      const summary = await orderService.getOrderSummary(req.params.orderId);
      ok(res, "Order summary fetched", { summary });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Cancel an order
   */
  async cancelOrder(req: any, res: Response, next: NextFunction) {
    try {
      const order = await orderService.cancelOrder(
        req.params.orderId,
        req.user.userId,
        req.user.role,
        req.body.reason,
      );
      ok(res, "Order cancelled successfully", { order });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Request a refund
   */
  async requestRefund(req: any, res: Response, next: NextFunction) {
    try {
      const order = await refundService.requestRefund(
        { ...req.body, orderId: req.params.orderId },
        req.user.userId,
      );
      ok(res, "Refund request submitted", { order });
    } catch (error) {
      next(error);
    }
  },
};

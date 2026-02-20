import { Response, NextFunction } from "express";
import { orderService } from "../services/order.service.js";
import { orderItemService } from "../services/orderItem.service.js";
import { orderStatusService } from "../services/orderStatus.service.js";
import { sellerBreakdownService } from "../services/sellerBreakdown.service.js";

const ok = (res: Response, message: string, data?: any) =>
  res.status(200).json({ success: true, message, ...(data ? { data } : {}) });

/**
 * Order Item Controller - Handles seller-facing order item management
 */
export const orderItemController = {
  /**
   * Get orders that contain the seller's items
   */
  async getSellerOrders(req: any, res: Response, next: NextFunction) {
    try {
      const result = await orderService.getOrdersBySeller(
        req.user.userId,
        req.query,
      );
      ok(res, "Seller orders fetched", result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get detailed order info (seller view)
   */
  async getSellerOrderDetail(req: any, res: Response, next: NextFunction) {
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
   * Update order status (only certain moves allowed for seller)
   */
  async updateStatus(req: any, res: Response, next: NextFunction) {
    try {
      const order = await orderStatusService.updateOrderStatus(
        req.params.orderId,
        req.body.status,
        req.user.role,
      );
      ok(res, "Order status updated", { order });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all order items sold by the seller
   */
  async getSellerItems(req: any, res: Response, next: NextFunction) {
    try {
      const result = await orderItemService.getItemsBySeller(
        req.user.userId,
        req.query,
      );
      ok(res, "Seller items fetched", result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get financial breakdown for a specific order
   */
  async getEarnings(req: any, res: Response, next: NextFunction) {
    try {
      const entry = await sellerBreakdownService.getSellerEarningsForOrder(
        req.params.orderId,
        req.user.userId,
      );
      ok(res, "Earnings breakdown fetched", { breakdown: entry });
    } catch (error) {
      next(error);
    }
  },
};

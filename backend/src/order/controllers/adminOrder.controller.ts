import { Response, NextFunction } from "express";
import { orderService } from "../services/order.service.js";
import { orderStatusService } from "../services/orderStatus.service.js";
import { refundService } from "../services/refund.service.js";
import { sellerBreakdownService } from "../services/sellerBreakdown.service.js";

const ok = (res: Response, message: string, data?: any) =>
  res.status(200).json({ success: true, message, ...(data ? { data } : {}) });

/**
 * Admin Order Controller - Specialized endpoints for logistics and finance team
 */
export const adminOrderController = {
  /**
   * List all orders in the system
   */
  async getAllOrders(req: any, res: Response, next: NextFunction) {
    try {
      const result = await orderService.getAllOrders(req.query);
      ok(res, "All orders fetched", result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get any order's full details
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
   * Force update an order's status
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
   * Refund: Move to processing
   */
  async processRefund(req: any, res: Response, next: NextFunction) {
    try {
      const order = await refundService.processRefund(
        req.params.orderId,
        req.user.userId,
      );
      ok(res, "Refund is now processing", { order });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Refund: Finalize and restore stock
   */
  async completeRefund(req: any, res: Response, next: NextFunction) {
    try {
      const order = await refundService.completeRefund(
        req.params.orderId,
        req.user.userId,
      );
      ok(res, "Refund completed and finalized", { order });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Refund: Decline the request
   */
  async rejectRefund(req: any, res: Response, next: NextFunction) {
    try {
      const order = await refundService.rejectRefund(
        req.params.orderId,
        req.user.userId,
        req.body.reason,
      );
      ok(res, "Refund request rejected", { order });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all active refund requests
   */
  async getRefunds(req: any, res: Response, next: NextFunction) {
    try {
      const result = await refundService.getRefundRequests(req.query);
      ok(res, "Refund requests fetched", result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Dashboard report for platform revenue
   */
  async getRevenueReport(req: any, res: Response, next: NextFunction) {
    try {
      const fromDate = req.query.fromDate
        ? new Date(req.query.fromDate)
        : new Date(Date.now() - 30 * 24 * 3600 * 1000);
      const toDate = req.query.toDate ? new Date(req.query.toDate) : new Date();

      const totalRevenue =
        await sellerBreakdownService.calculatePlatformRevenue(fromDate, toDate);
      ok(res, "Revenue report generated", {
        totalCommission: totalRevenue,
        currency: "INR",
        fromDate,
        toDate,
      });
    } catch (error) {
      next(error);
    }
  },
};

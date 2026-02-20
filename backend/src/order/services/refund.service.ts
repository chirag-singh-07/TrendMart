import {
  IRefundRequestPayload,
  IPaginatedResult,
} from "../types/order.types.js";
import Order from "../../models/Order.model.js";
import { OrderItem } from "../../models/OrderItem.model.js";
import { productService } from "../../product/services/product.service.js";
import AppError from "../../utils/AppError.js";

/**
 * Service for handling refund lifecycles
 */
export const refundService = {
  /**
   * Buyer requests a refund for an order or specific items
   */
  async requestRefund(
    payload: IRefundRequestPayload,
    userId: string,
  ): Promise<any> {
    const { orderId, reason, items } = payload;
    const order = await Order.findById(orderId);

    if (!order) throw new AppError("Order not found", 404);
    if (String(order.userId) !== userId)
      throw new AppError("Access denied", 403);

    const allowedStatus = ["delivered", "cancelled"];
    if (!allowedStatus.includes(order.orderStatus)) {
      throw new AppError(
        "Order must be delivered or cancelled to request a refund",
        400,
      );
    }

    if (order.refundStatus !== "none") {
      throw new AppError(
        "A refund has already been requested or processed for this order",
        400,
      );
    }

    order.refundStatus = "requested";
    order.cancellationReason = reason; // Reuse cancellationReason for refund notes

    // items is optional. If provided, we could track partially refunded items in future.
    // For now, we update the order's refund status.

    return await order.save();
  },

  /**
   * Admin moves refund to processing
   */
  async processRefund(orderId: string, adminId: string): Promise<any> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    if (order.refundStatus !== "requested") {
      throw new AppError("Refund request not found in requested state", 400);
    }

    order.refundStatus = "processing";
    return await order.save();
  },

  /**
   * Admin completes refund, restores stock and updates payment status
   */
  async completeRefund(orderId: string, adminId: string): Promise<any> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    if (order.refundStatus !== "processing") {
      throw new AppError(
        "Refund must be in processing state to be completed",
        400,
      );
    }

    // 1. Update statuses
    order.refundStatus = "completed";
    order.paymentStatus = "refunded";

    // 2. Restore stock
    const items = await OrderItem.find({ orderId: order._id });
    for (const item of items) {
      await productService.updateStock({
        productId: String(item.productId),
        variantId: item.variantId ? String(item.variantId) : undefined,
        quantity: item.quantity,
        operation: "increment",
      });
    }

    return await order.save();
  },

  /**
   * Admin rejects refund
   */
  async rejectRefund(
    orderId: string,
    adminId: string,
    reason: string,
  ): Promise<any> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    if (order.refundStatus === "completed" || order.refundStatus === "none") {
      throw new AppError(
        "Cannot reject a refund that is already completed or never requested",
        400,
      );
    }

    order.refundStatus = "rejected";
    order.cancellationReason = `Refund Rejected: ${reason}`;

    return await order.save();
  },

  /**
   * Retrieves pending refund requests for admin dashboard
   */
  async getRefundRequests(filters: any = {}): Promise<any> {
    const { page = 1, limit = 10 } = filters;
    const query = {
      refundStatus: { $in: ["requested", "processing"] },
    };

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: 1 }) // oldest first (FIFO)
        .skip(skip)
        .limit(limit)
        .populate("userId", "firstName lastName email"),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  },
};

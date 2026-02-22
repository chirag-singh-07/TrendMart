import mongoose from "mongoose";
import Payment from "../../models/Payment.model.js";
import Order from "../../models/Order.model.js";
import OrderItem from "../../models/OrderItem.model.js";
import AppError from "../../utils/AppError.js";
import { stripeService } from "./stripe.service.js";
import { walletService } from "./wallet.service.js";
import { productService } from "../../product/services/product.service.js";
import { IRefundPayload, IRefundResult } from "../types/payment.types.js";
import { RefundStatus } from "../../interfaces/index.js";

/**
 * Service for processing refunds across all payment methods.
 * Routes refunds to the correct channel (Stripe or wallet) based on
 * the original payment method and the admin's chosen refund method.
 */
export const refundService = {
  /**
   * Processes a full refund for an order.
   *
   * Step 1: Validates order refund eligibility
   * Step 2: Determines the target refund channel
   * Step 3: Executes the refund (Stripe or Wallet)
   * Step 4: Restores stock for all order items
   *
   * @param payload - orderId, reason, refundMethod
   * @param adminId - Admin initiating the refund
   * @returns IRefundResult with method used and amount refunded
   */
  async processRefund(
    payload: IRefundPayload,
    adminId: string,
  ): Promise<IRefundResult> {
    const { orderId, reason, refundMethod } = payload;

    const [order, payment] = await Promise.all([
      Order.findById(orderId),
      Payment.findOne({ orderId: new mongoose.Types.ObjectId(orderId) }),
    ]);

    if (!order) throw new AppError("Order not found", 404);
    if (!payment) throw new AppError("Payment record not found", 404);

    if (!["requested", "processing"].includes(order.refundStatus)) {
      throw new AppError("Order is not eligible for refund", 400);
    }
    if (payment.paymentStatus !== "paid") {
      throw new AppError("Cannot refund an unpaid order", 400);
    }

    const refundAmount = order.finalAmount - payment.refundedAmount;
    const userId = String(order.userId);

    // Determine the actual channel to use
    const useWallet =
      refundMethod === "wallet" ||
      payment.paymentMethod === "cash_on_delivery" ||
      payment.paymentMethod === "wallet";

    let result: IRefundResult;

    if (useWallet) {
      const updatedWallet = await walletService.creditWallet(
        userId,
        refundAmount,
        "refund",
        orderId,
        `Refund for order ${orderId}. Reason: ${reason}`,
      );

      result = {
        amountRefunded: refundAmount,
        refundMethod: "wallet",
        walletBalance: updatedWallet.balance,
        message: "Refund credited to wallet successfully",
      };
    } else {
      // Stripe refund
      if (
        !payment.gatewayPaymentId ||
        payment.gatewayPaymentId.startsWith("COD") ||
        payment.gatewayPaymentId.startsWith("WALLET")
      ) {
        throw new AppError(
          "Cannot process Stripe refund for this payment method",
          400,
        );
      }

      const stripeRefund = await stripeService.createRefund(
        payment.gatewayPaymentId,
        refundAmount,
        "requested_by_customer",
      );

      result = {
        refundId: stripeRefund.id,
        amountRefunded: refundAmount,
        refundMethod: "stripe",
        message: "Stripe refund initiated successfully",
      };
    }

    // Update payment document
    await Payment.findByIdAndUpdate(payment._id, {
      paymentStatus: "refunded",
      $inc: { refundedAmount: refundAmount },
    });

    // Update order statuses
    await Order.findByIdAndUpdate(orderId, {
      refundStatus: "completed",
      paymentStatus: "refunded",
    });

    // Restore stock for all items
    await this._restoreStock(orderId);

    return result;
  },

  /**
   * Processes a partial refund for specific order items only.
   * Calculates the refund amount from selected item IDs and routes appropriately.
   *
   * @param orderId - The order to partially refund
   * @param itemIds - Specific OrderItem IDs to refund
   * @param adminId - Admin initiating the refund
   * @returns IRefundResult with cumulative refunded amount
   */
  async processPartialRefund(
    orderId: string,
    itemIds: string[],
    adminId: string,
  ): Promise<IRefundResult> {
    const [order, payment] = await Promise.all([
      Order.findById(orderId),
      Payment.findOne({ orderId: new mongoose.Types.ObjectId(orderId) }),
    ]);

    if (!order) throw new AppError("Order not found", 404);
    if (!payment) throw new AppError("Payment record not found", 404);
    if (payment.paymentStatus !== "paid")
      throw new AppError("Cannot refund an unpaid order", 400);

    // Sum up items to refund
    const items = await OrderItem.find({
      _id: { $in: itemIds.map((id) => new mongoose.Types.ObjectId(id)) },
      orderId: new mongoose.Types.ObjectId(orderId),
    });

    if (items.length === 0)
      throw new AppError("No matching order items found", 404);

    const refundAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const userId = String(order.userId);

    const useWallet =
      payment.paymentMethod === "cash_on_delivery" ||
      payment.paymentMethod === "wallet";

    let result: IRefundResult;

    if (useWallet) {
      const updatedWallet = await walletService.creditWallet(
        userId,
        refundAmount,
        "refund",
        orderId,
        `Partial refund for order ${orderId} (${items.length} items)`,
      );
      result = {
        amountRefunded: refundAmount,
        refundMethod: "wallet",
        walletBalance: updatedWallet.balance,
        message: "Partial refund credited to wallet",
      };
    } else {
      const stripeRefund = await stripeService.createRefund(
        payment.gatewayPaymentId,
        refundAmount,
        "requested_by_customer",
      );
      result = {
        refundId: stripeRefund.id,
        amountRefunded: refundAmount,
        refundMethod: "stripe",
        message: "Partial Stripe refund initiated",
      };
    }

    const newRefundedAmount = payment.refundedAmount + refundAmount;
    const isFullyRefunded = newRefundedAmount >= order.finalAmount;

    await Payment.findByIdAndUpdate(payment._id, {
      paymentStatus: isFullyRefunded ? "refunded" : "partially_refunded",
      refundedAmount: newRefundedAmount,
    });

    await Order.findByIdAndUpdate(orderId, {
      refundStatus: isFullyRefunded ? "completed" : "processing",
      paymentStatus: isFullyRefunded ? "refunded" : "partially_refunded",
    });

    // Restore stock for refunded items only
    await Promise.all(
      items.map(async (item) => {
        await productService.updateStock({
          productId: String(item.productId),
          variantId: item.variantId ? String(item.variantId) : undefined,
          quantity: item.quantity,
          operation: "increment",
        });
      }),
    );

    return result;
  },

  /**
   * Handles COD order cancellation before delivery.
   * No refund is issued (cash was never collected).
   * Updates statuses and restores stock.
   *
   * @param orderId - The COD order to cancel
   * @param userId - Buyer requesting cancellation
   */
  async handleCODCancellation(orderId: string, userId: string): Promise<void> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    if (String(order.userId) !== userId)
      throw new AppError("Access denied", 403);
    if (order.orderStatus === "delivered")
      throw new AppError("Cannot cancel a delivered COD order", 400);

    await Promise.all([
      Payment.findOneAndUpdate(
        { orderId: new mongoose.Types.ObjectId(orderId) },
        { paymentStatus: "failed" },
      ),
      Order.findByIdAndUpdate(orderId, { orderStatus: "cancelled" }),
    ]);

    await this._restoreStock(orderId);
  },

  /**
   * Returns the current refund status and total refunded amount for an order.
   *
   * @param orderId - The order to check
   * @returns refundStatus and refundedAmount
   */
  async getRefundStatus(
    orderId: string,
  ): Promise<{ refundStatus: string; refundedAmount: number }> {
    const [order, payment] = await Promise.all([
      Order.findById(orderId).select("refundStatus"),
      Payment.findOne({ orderId: new mongoose.Types.ObjectId(orderId) }).select(
        "refundedAmount",
      ),
    ]);
    if (!order) throw new AppError("Order not found", 404);

    return {
      refundStatus: order.refundStatus,
      refundedAmount: payment?.refundedAmount ?? 0,
    };
  },

  /** @private Restore stock for all items in an order */
  async _restoreStock(orderId: string): Promise<void> {
    const items = await OrderItem.find({
      orderId: new mongoose.Types.ObjectId(orderId),
    });
    await Promise.all(
      items.map((item) =>
        productService.updateStock({
          productId: String(item.productId),
          variantId: item.variantId ? String(item.variantId) : undefined,
          quantity: item.quantity,
          operation: "increment",
        }),
      ),
    );
  },
};

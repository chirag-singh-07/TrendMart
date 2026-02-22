import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Payment from "../../models/Payment.model.js";
import Order from "../../models/Order.model.js";
import AppError from "../../utils/AppError.js";
import { ICODPaymentResult } from "../types/payment.types.js";
import { IPaymentDocument } from "../../models/Payment.model.js";

/**
 * Service for Cash on Delivery payment flows.
 * COD payments start in "pending" status and are only marked "paid"
 * when an admin or delivery partner confirms cash collection.
 */
export const codService = {
  /**
   * Creates a COD payment record and sets the order to "confirmed".
   * No money changes hands at this stage.
   *
   * @param userId - The authenticated buyer
   * @param orderId - The order to pay via COD
   * @returns ICODPaymentResult with the collectable amount
   */
  async initiateCOD(
    userId: string,
    orderId: string,
  ): Promise<ICODPaymentResult> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    if (String(order.userId) !== userId)
      throw new AppError("Access denied", 403);
    if (order.orderStatus !== "confirmed")
      throw new AppError(
        "Order must be confirmed before initiating payment",
        400,
      );
    if (order.paymentStatus !== "pending")
      throw new AppError("Order has already been paid", 400);

    const transactionId = `TXN-COD-${uuidv4().replace(/-/g, "").slice(0, 16).toUpperCase()}`;

    const payment = await Payment.create({
      orderId: new mongoose.Types.ObjectId(orderId),
      userId: new mongoose.Types.ObjectId(userId),
      paymentMethod: "cash_on_delivery",
      gatewayName: "manual",
      transactionId,
      gatewayPaymentId: `COD-${orderId}`,
      amount: order.finalAmount,
      currency: order.currency ?? "INR",
      paymentStatus: "pending",
    });

    await Order.findByIdAndUpdate(orderId, {
      orderStatus: "confirmed",
      paymentId: payment._id,
    });

    return {
      paymentId: String(payment._id),
      message: "COD order confirmed. Cash will be collected upon delivery.",
      collectableAmount: order.finalAmount,
    };
  },

  /**
   * Admin / delivery partner confirms that cash was collected on delivery.
   * Marks both the payment and the order as completed.
   *
   * @param orderId - The delivered order
   * @param adminId - Admin/delivery partner performing the confirmation
   * @returns Updated Payment document
   */
  async confirmCODCollection(
    orderId: string,
    adminId: string,
  ): Promise<IPaymentDocument> {
    const payment = await Payment.findOne({
      orderId: new mongoose.Types.ObjectId(orderId),
      paymentMethod: "cash_on_delivery",
    });

    if (!payment) throw new AppError("COD payment not found", 404);
    if (payment.paymentStatus === "paid")
      throw new AppError("COD payment already confirmed", 400);

    const now = new Date();
    payment.paymentStatus = "paid";
    payment.paidAt = now;
    await payment.save();

    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: "paid",
      orderStatus: "delivered",
    });

    return payment;
  },

  /**
   * Cancels a COD order before delivery.
   * Since no cash was collected, no refund is required.
   * Updates both the payment and the order to cancelled/failed states.
   *
   * @param orderId - The order to cancel
   * @param userId - The buyer requesting cancellation
   */
  async cancelCOD(orderId: string, userId: string): Promise<void> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    if (String(order.userId) !== userId)
      throw new AppError("Access denied", 403);
    if (order.orderStatus === "delivered")
      throw new AppError("Cannot cancel a delivered COD order", 400);

    await Payment.findOneAndUpdate(
      {
        orderId: new mongoose.Types.ObjectId(orderId),
        paymentMethod: "cash_on_delivery",
      },
      { paymentStatus: "failed" },
    );

    await Order.findByIdAndUpdate(orderId, { orderStatus: "cancelled" });
  },
};

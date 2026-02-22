import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";
import Payment from "../../models/Payment.model.js";
import Order from "../../models/Order.model.js";
import OrderItem from "../../models/OrderItem.model.js";
import AppError from "../../utils/AppError.js";
import { stripeService } from "./stripe.service.js";
import { walletService } from "./wallet.service.js";
import { idempotencyService } from "./idempotency.service.js";
import {
  IInitiatePaymentPayload,
  IPaymentFilters,
  IPaginatedPaymentResult,
} from "../types/payment.types.js";
import { IPaymentDocument } from "../../models/Payment.model.js";

/**
 * Core payment orchestrator. Routes incoming payments to the correct
 * sub-service (Stripe / COD / Wallet) and manages the payment lifecycle.
 */
export const paymentService = {
  /**
   * Initiates a payment for an order.
   *
   * Flow:
   * 1. Idempotency check — returns existing payment if already initiated
   * 2. Validates order ownership, confirmed status, and pending payment status
   * 3. Routes to the correct payment handler based on paymentMethod
   *
   * @param userId - Authenticated buyer's ID
   * @param payload - orderId, paymentMethod, currency
   * @returns Created Payment document (or Stripe intent data attached)
   */
  async initiatePayment(userId: string, payload: IInitiatePaymentPayload) {
    const { orderId, paymentMethod, currency = "INR" } = payload;

    // Step 1 — Idempotency check
    const idempKey = idempotencyService.buildPaymentKey(orderId, userId);
    const existingPaymentId = await idempotencyService.getKey(idempKey);
    if (existingPaymentId) {
      const existing = await Payment.findById(existingPaymentId).lean();
      if (existing) return existing;
    }

    // Step 2 — Validate order
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);
    if (String(order.userId) !== userId)
      throw new AppError("Access denied", 403);
    if (order.orderStatus !== "confirmed")
      throw new AppError("Order must be confirmed before payment", 400);
    if (order.paymentStatus !== "pending")
      throw new AppError("Order has already been paid", 400);

    const transactionId = `TXN-${uuidv4().replace(/-/g, "").slice(0, 16).toUpperCase()}`;

    // Step 3 — Route to payment method
    if (paymentMethod === "stripe") {
      // Create pending Payment doc first to get the _id for Stripe metadata
      const payment = await Payment.create({
        orderId: new mongoose.Types.ObjectId(orderId),
        userId: new mongoose.Types.ObjectId(userId),
        paymentMethod: "credit_card",
        gatewayName: "stripe",
        transactionId,
        gatewayPaymentId: "pending", // placeholder until Stripe responds
        amount: order.finalAmount,
        currency,
        paymentStatus: "pending",
      });

      const intent = await stripeService.createPaymentIntent(
        order.finalAmount,
        currency,
        { orderId, userId, paymentId: String(payment._id) },
      );

      // Attach Stripe PaymentIntent ID
      payment.gatewayPaymentId = intent.id;
      await payment.save();

      // Store idempotency key for 10 minutes
      await idempotencyService.setKey(idempKey, String(payment._id), 600);

      // Attach client secret for frontend — not stored in DB
      return {
        ...payment.toObject(),
        clientSecret: intent.client_secret,
        paymentIntentId: intent.id,
      };
    }

    if (paymentMethod === "wallet") {
      const sufficient = await walletService.validateSufficientBalance(
        userId,
        order.finalAmount,
      );
      if (!sufficient) {
        const balance = await walletService.getWalletBalance(userId);
        const shortfall = order.finalAmount - balance;
        throw new AppError(
          `Insufficient wallet balance. Add ₹${shortfall.toFixed(2)} more`,
          400,
        );
      }

      // Debit wallet
      await walletService.debitWallet(
        userId,
        order.finalAmount,
        "order_payment",
        orderId,
        `Payment for order ${orderId}`,
      );

      const payment = await Payment.create({
        orderId: new mongoose.Types.ObjectId(orderId),
        userId: new mongoose.Types.ObjectId(userId),
        paymentMethod: "wallet",
        gatewayName: "manual",
        transactionId,
        gatewayPaymentId: `WALLET-${orderId}`,
        amount: order.finalAmount,
        currency,
        paymentStatus: "paid",
        paidAt: new Date(),
      });

      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        paymentId: payment._id,
      });

      await idempotencyService.setKey(idempKey, String(payment._id), 600);
      return payment;
    }

    // COD is handled via separate endpoint but fall through gracefully
    throw new AppError(
      "Invalid payment method. Use stripe, cod, or wallet.",
      400,
    );
  },

  /**
   * Confirms a Stripe payment after the frontend completes the payment flow.
   * Retrieves PaymentIntent status from Stripe to verify success.
   *
   * @param paymentIntentId - Stripe PaymentIntent ID returned during initiation
   * @param userId - Authenticated buyer
   * @returns Updated Payment document
   */
  async confirmStripePayment(
    paymentIntentId: string,
    userId: string,
  ): Promise<IPaymentDocument> {
    const intent = await stripeService.confirmPaymentIntent(paymentIntentId);
    if (intent.status !== "succeeded")
      throw new AppError("Payment not completed", 400);

    const payment = await Payment.findOne({
      gatewayPaymentId: paymentIntentId,
    });
    if (!payment) throw new AppError("Payment record not found", 404);

    payment.paymentStatus = "paid";
    payment.paidAt = new Date();
    await payment.save();

    await Order.findByIdAndUpdate(payment.orderId, {
      paymentStatus: "paid",
      orderStatus: "confirmed",
      paymentId: payment._id,
    });

    const idempKey = idempotencyService.buildPaymentKey(
      String(payment.orderId),
      userId,
    );
    await idempotencyService.deleteKey(idempKey);

    return payment;
  },

  /**
   * Fetches the payment record tied to an order, verifying ownership.
   *
   * @param orderId - The order whose payment to fetch
   * @param userId - Must match payment.userId
   * @returns Payment document
   */
  async getPaymentByOrder(
    orderId: string,
    userId: string,
  ): Promise<IPaymentDocument> {
    const payment = await Payment.findOne({
      orderId: new mongoose.Types.ObjectId(orderId),
    });
    if (!payment) throw new AppError("Payment not found", 404);
    if (String(payment.userId) !== userId)
      throw new AppError("Access denied", 403);
    return payment;
  },

  /**
   * Fetches a single payment by its own ID.
   *
   * @param paymentId - Payment document ID
   * @returns Payment document
   */
  async getPaymentById(paymentId: string): Promise<IPaymentDocument> {
    const payment = await Payment.findById(paymentId);
    if (!payment) throw new AppError("Payment not found", 404);
    return payment;
  },

  /**
   * Returns paginated payment history for a specific buyer.
   *
   * @param userId - The buyer
   * @param filters - Status, method, date range, pagination
   */
  async getUserPayments(
    userId: string,
    filters: IPaymentFilters,
  ): Promise<IPaginatedPaymentResult<IPaymentDocument>> {
    const { paymentStatus, fromDate, toDate, page = 1, limit = 10 } = filters;
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = fromDate;
      if (toDate) query.createdAt.$lte = toDate;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Payment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(query),
    ]);

    return {
      data: data as any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  },

  /**
   * Admin-only: returns all payments across all users with optional filters.
   *
   * @param filters - Optional userId, orderId, status, method, date range, pagination
   */
  async getAllPayments(
    filters: IPaymentFilters,
  ): Promise<IPaginatedPaymentResult<IPaymentDocument>> {
    const {
      userId,
      orderId,
      paymentStatus,
      fromDate,
      toDate,
      page = 1,
      limit = 20,
    } = filters;
    const query: any = {};
    if (userId) query.userId = new mongoose.Types.ObjectId(userId);
    if (orderId) query.orderId = new mongoose.Types.ObjectId(orderId);
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = fromDate;
      if (toDate) query.createdAt.$lte = toDate;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Payment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Payment.countDocuments(query),
    ]);

    return {
      data: data as any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  },
};

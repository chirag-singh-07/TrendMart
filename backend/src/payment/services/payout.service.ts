import mongoose from "mongoose";
import SellerPayout from "../../models/SellerPayout.model.js";
import Order from "../../models/Order.model.js";
import OrderItem from "../../models/OrderItem.model.js";
import Seller from "../../models/Seller.model.js";
import AppError from "../../utils/AppError.js";
import { walletService } from "./wallet.service.js";
import {
  IPayoutPayload,
  IPaginatedPaymentResult,
} from "../types/payment.types.js";
import { ISellerPayout, PayoutMethod } from "../../interfaces/index.js";
import { ISellerPayoutDocument } from "../../models/SellerPayout.model.js";

/**
 * Service for managing seller payout lifecycle:
 * pending → processing → completed / failed
 */
export const payoutService = {
  /**
   * Calculates what is owed to a seller from all delivered orders
   * not yet included in an existing payout. Returns a preview — not saved.
   *
   * @param sellerId - The seller to calculate for
   * @returns Unsaved SellerPayout preview document
   */
  async calculatePendingPayout(
    sellerId: string,
  ): Promise<Partial<ISellerPayout>> {
    // Find all orders already processed in a payout
    const existingPayouts = await SellerPayout.find({
      sellerId: new mongoose.Types.ObjectId(sellerId),
      payoutStatus: { $in: ["completed", "processing", "pending"] },
    }).select("orderIds");

    const alreadyIncludedOrderIds = existingPayouts.flatMap((p) =>
      p.orderIds.map(String),
    );

    // Find delivered orders with this seller's items not yet paid out
    const orders = await Order.find({
      orderStatus: "delivered",
      _id: {
        $nin: alreadyIncludedOrderIds.map(
          (id) => new mongoose.Types.ObjectId(id),
        ),
      },
      "sellerBreakdown.sellerId": new mongoose.Types.ObjectId(sellerId),
    });

    let grossAmount = 0;
    let commissionAmount = 0;

    for (const order of orders) {
      const breakdown = order.sellerBreakdown.find(
        (b) => String(b.sellerId) === sellerId,
      );
      if (breakdown) {
        grossAmount += breakdown.sellerEarnings + breakdown.commissionAmount;
        commissionAmount += breakdown.commissionAmount;
      }
    }

    const netAmount = grossAmount - commissionAmount;

    return {
      sellerId: new mongoose.Types.ObjectId(sellerId),
      orderIds: orders.map((o) => o._id),
      grossAmount,
      commissionAmount,
      netAmount,
      payoutStatus: "pending",
    };
  },

  /**
   * Creates and saves a new payout record for a seller.
   * Verifies that all provided order IDs belong to the seller and are delivered.
   *
   * @param payload - sellerId, orderIds, payoutMethod, optional bankDetails
   * @param adminId - Admin initiating the payout
   * @returns Created SellerPayout document
   */
  async initiatePayout(
    payload: IPayoutPayload,
    adminId: string,
  ): Promise<ISellerPayoutDocument> {
    const { sellerId, orderIds, payoutMethod } = payload;

    const seller = await Seller.findById(sellerId);
    if (!seller) throw new AppError("Seller not found", 404);

    const orders = await Order.find({
      _id: { $in: orderIds.map((id) => new mongoose.Types.ObjectId(id)) },
      orderStatus: "delivered",
      "sellerBreakdown.sellerId": new mongoose.Types.ObjectId(sellerId),
    });

    if (orders.length !== orderIds.length) {
      throw new AppError(
        "Some orders are not delivered or do not belong to this seller",
        400,
      );
    }

    let grossAmount = 0;
    let commissionAmount = 0;

    for (const order of orders) {
      const breakdown = order.sellerBreakdown.find(
        (b) => String(b.sellerId) === sellerId,
      );
      if (breakdown) {
        grossAmount += breakdown.sellerEarnings + breakdown.commissionAmount;
        commissionAmount += breakdown.commissionAmount;
      }
    }

    const netAmount = grossAmount - commissionAmount;

    const payout = await SellerPayout.create({
      sellerId: new mongoose.Types.ObjectId(sellerId),
      orderIds: orderIds.map((id) => new mongoose.Types.ObjectId(id)),
      grossAmount,
      commissionAmount,
      netAmount,
      payoutStatus: "pending",
      payoutMethod,
    });

    await Seller.findByIdAndUpdate(sellerId, {
      $inc: { totalRevenue: netAmount },
    });

    return payout;
  },

  /**
   * Marks a payout as processing — indicates bank/UPI transfer is in progress.
   *
   * @param payoutId - The payout to advance
   * @param adminId - Admin performing the action
   * @returns Updated SellerPayout
   */
  async processPayout(
    payoutId: string,
    adminId: string,
  ): Promise<ISellerPayoutDocument> {
    const payout = await SellerPayout.findById(payoutId);
    if (!payout) throw new AppError("Payout not found", 404);
    if (payout.payoutStatus !== "pending")
      throw new AppError("Only pending payouts can be marked processing", 400);

    payout.payoutStatus = "processing";
    await payout.save();
    console.log(
      `[PAYOUT] Admin ${adminId} started processing payout ${payoutId}`,
    );
    return payout;
  },

  /**
   * Completes a payout after the bank/UPI transfer is confirmed.
   * Credits the seller's internal wallet with netAmount.
   *
   * @param payoutId - The payout to complete
   * @param transactionReference - External bank/UPI reference number
   * @param adminId - Admin completing the payout
   * @returns Updated SellerPayout
   */
  async completePayout(
    payoutId: string,
    transactionReference: string,
    adminId: string,
  ): Promise<ISellerPayoutDocument> {
    const payout = await SellerPayout.findById(payoutId);
    if (!payout) throw new AppError("Payout not found", 404);
    if (payout.payoutStatus !== "processing")
      throw new AppError("Only processing payouts can be completed", 400);

    payout.payoutStatus = "completed";
    payout.transactionReference = transactionReference;
    payout.processedAt = new Date();
    await payout.save();

    // Get userId for the seller
    const seller = await Seller.findById(payout.sellerId).select("userId");
    if (seller) {
      await walletService.creditWallet(
        String(seller.userId),
        payout.netAmount,
        "payout",
        payoutId,
        `Payout ${payoutId} — Ref: ${transactionReference}`,
      );
    }

    return payout;
  },

  /**
   * Marks a payout as failed and logs the reason.
   *
   * @param payoutId - The payout to fail
   * @param reason - Human-readable failure reason
   * @param adminId - Admin performing the action
   * @returns Updated SellerPayout
   */
  async failPayout(
    payoutId: string,
    reason: string,
    adminId: string,
  ): Promise<ISellerPayoutDocument> {
    const payout = await SellerPayout.findById(payoutId);
    if (!payout) throw new AppError("Payout not found", 404);

    payout.payoutStatus = "failed";
    await payout.save();
    console.log(
      `[PAYOUT] Admin ${adminId} failed payout ${payoutId}: ${reason}`,
    );
    return payout;
  },

  /**
   * Returns paginated payout history for a specific seller.
   *
   * @param sellerId - The seller
   * @param filters - Pagination options
   */
  async getSellerPayouts(
    sellerId: string,
    filters: { page?: number; limit?: number },
  ): Promise<IPaginatedPaymentResult<ISellerPayoutDocument>> {
    const { page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;
    const query = { sellerId: new mongoose.Types.ObjectId(sellerId) };

    const [data, total] = await Promise.all([
      SellerPayout.find(query).sort({ _id: -1 }).skip(skip).limit(limit).lean(),
      SellerPayout.countDocuments(query),
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
   * Admin-only: returns all payouts across all sellers with optional filters.
   *
   * @param filters - Optional status filter and pagination
   */
  async getAllPayouts(filters: {
    payoutStatus?: string;
    page?: number;
    limit?: number;
  }): Promise<IPaginatedPaymentResult<ISellerPayoutDocument>> {
    const { payoutStatus, page = 1, limit = 20 } = filters;
    const query: any = {};
    if (payoutStatus) query.payoutStatus = payoutStatus;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      SellerPayout.find(query).sort({ _id: -1 }).skip(skip).limit(limit).lean(),
      SellerPayout.countDocuments(query),
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

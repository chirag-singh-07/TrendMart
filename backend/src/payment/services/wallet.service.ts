import mongoose from "mongoose";
import Wallet, { IWallet } from "../models/wallet.model.js";
import WalletTransaction from "../models/walletTransaction.model.js";
import { stripeService } from "./stripe.service.js";
import { idempotencyService } from "./idempotency.service.js";
import AppError from "../../utils/AppError.js";
import {
  IWalletSummary,
  IWalletTopUpPayload,
  IStripePaymentIntent,
  IPaginatedPaymentResult,
} from "../types/payment.types.js";
import { IWalletTransaction } from "../models/walletTransaction.model.js";

const WALLET_MAX_BALANCE = Number(process.env.WALLET_MAX_BALANCE ?? 100000);

/**
 * Service for all wallet operations — balance reads, credits, debits, top-ups, and history.
 */
export const walletService = {
  /**
   * Retrieves an existing wallet for the user. If none exists, creates one lazily.
   *
   * @param userId - The user whose wallet to fetch or create
   * @returns The wallet document
   */
  async getOrCreateWallet(userId: string): Promise<IWallet> {
    const existing = await Wallet.findOne({
      userId: new mongoose.Types.ObjectId(userId),
    });
    if (existing) return existing;

    return Wallet.create({
      userId: new mongoose.Types.ObjectId(userId),
      balance: 0,
      currency: "INR",
      isActive: true,
    });
  },

  /**
   * Returns the current balance for a user's wallet.
   *
   * @param userId - The user to check
   * @returns Numeric balance in INR
   */
  async getWalletBalance(userId: string): Promise<number> {
    const wallet = await this.getOrCreateWallet(userId);
    return wallet.balance;
  },

  /**
   * Returns a summary including total credits, debits, and transaction count.
   *
   * @param userId - The wallet owner
   * @returns IWalletSummary with aggregated data
   */
  async getWalletSummary(userId: string): Promise<IWalletSummary> {
    const wallet = await this.getOrCreateWallet(userId);

    const result = await WalletTransaction.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    let totalCredited = 0;
    let totalDebited = 0;
    let transactionCount = 0;

    for (const r of result) {
      if (r._id === "credit") totalCredited = r.total;
      if (r._id === "debit") totalDebited = r.total;
      transactionCount += r.count;
    }

    return {
      balance: wallet.balance,
      currency: wallet.currency,
      totalCredited,
      totalDebited,
      transactionCount,
    };
  },

  /**
   * Credits the wallet atomically inside a MongoDB session.
   * Creates a WalletTransaction audit record in the same session.
   *
   * @param userId - Wallet owner
   * @param amount - Amount to credit in INR
   * @param source - Origin of the credit
   * @param referenceId - Optional order/payment/payout ID
   * @param description - Human-readable description
   * @returns Updated wallet document
   */
  async creditWallet(
    userId: string,
    amount: number,
    source: IWalletTransaction["source"],
    referenceId?: string,
    description?: string,
  ): Promise<IWallet> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const wallet = await Wallet.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      }).session(session);

      const walletDoc =
        wallet ??
        (
          await Wallet.create([{ userId, balance: 0, currency: "INR" }], {
            session,
          })
        )[0];
      const balanceBefore = walletDoc.balance;

      if (balanceBefore + amount > WALLET_MAX_BALANCE) {
        throw new AppError(
          `Wallet balance cannot exceed ${process.env.WALLET_MAX_BALANCE ?? "₹1,00,000"}`,
          400,
        );
      }

      const updated = await Wallet.findByIdAndUpdate(
        walletDoc._id,
        { $inc: { balance: amount } },
        { new: true, session },
      );

      await WalletTransaction.create(
        [
          {
            walletId: walletDoc._id,
            userId: new mongoose.Types.ObjectId(userId),
            type: "credit",
            amount,
            balanceBefore,
            balanceAfter: balanceBefore + amount,
            source,
            referenceId,
            referenceModel: undefined,
            description: description ?? `Credit via ${source}`,
            status: "completed",
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return updated!;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },

  /**
   * Debits the wallet atomically inside a MongoDB session.
   * Throws if balance is insufficient — wallet can NEVER go negative.
   *
   * @param userId - Wallet owner
   * @param amount - Amount to debit in INR
   * @param source - Reason for debit
   * @param referenceId - Optional order/payment ID
   * @param description - Human-readable description
   * @returns Updated wallet document
   */
  async debitWallet(
    userId: string,
    amount: number,
    source: IWalletTransaction["source"],
    referenceId?: string,
    description?: string,
  ): Promise<IWallet> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const wallet = await Wallet.findOne({
        userId: new mongoose.Types.ObjectId(userId),
      }).session(session);

      if (!wallet || wallet.balance < amount) {
        const shortfall = wallet ? amount - wallet.balance : amount;
        throw new AppError(
          `Insufficient wallet balance. Add ₹${shortfall.toFixed(2)} more`,
          400,
        );
      }

      const balanceBefore = wallet.balance;

      const updated = await Wallet.findByIdAndUpdate(
        wallet._id,
        { $inc: { balance: -amount } },
        { new: true, session },
      );

      await WalletTransaction.create(
        [
          {
            walletId: wallet._id,
            userId: new mongoose.Types.ObjectId(userId),
            type: "debit",
            amount,
            balanceBefore,
            balanceAfter: balanceBefore - amount,
            source,
            referenceId,
            description: description ?? `Debit via ${source}`,
            status: "completed",
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return updated!;
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },

  /**
   * Returns true if the user's wallet balance is at least the required amount.
   *
   * @param userId - Wallet owner
   * @param amount - Required amount
   */
  async validateSufficientBalance(
    userId: string,
    amount: number,
  ): Promise<boolean> {
    const balance = await this.getWalletBalance(userId);
    return balance >= amount;
  },

  /**
   * Returns paginated transaction history for a user sorted by newest first.
   *
   * @param userId - Wallet owner
   * @param filters - Optional type/source/date filters plus pagination
   */
  async getTransactionHistory(
    userId: string,
    filters: {
      type?: "credit" | "debit";
      source?: string;
      fromDate?: Date;
      toDate?: Date;
      page?: number;
      limit?: number;
    },
  ): Promise<IPaginatedPaymentResult<IWalletTransaction>> {
    const { type, source, fromDate, toDate, page = 1, limit = 10 } = filters;
    const query: any = { userId: new mongoose.Types.ObjectId(userId) };
    if (type) query.type = type;
    if (source) query.source = source;
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = fromDate;
      if (toDate) query.createdAt.$lte = toDate;
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      WalletTransaction.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      WalletTransaction.countDocuments(query),
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
   * Admin-only: manually credits any user's wallet with a logged audit trail.
   *
   * @param userId - Target user
   * @param amount - Amount to credit
   * @param description - Admin-provided description
   * @param adminId - ID of the admin performing the action (for audit trail)
   * @returns Updated wallet
   */
  async adminCreditWallet(
    userId: string,
    amount: number,
    description: string,
    adminId: string,
  ): Promise<IWallet> {
    return this.creditWallet(
      userId,
      amount,
      "admin_credit",
      undefined,
      `[Admin: ${adminId}] ${description}`,
    );
  },

  /**
   * Creates a Stripe PaymentIntent for a wallet top-up.
   * Does NOT credit the wallet yet — that happens after webhook confirmation.
   * Stores a pending top-up record in Redis with a 1-hour TTL.
   *
   * @param userId - The user topping up
   * @param payload - Top-up amount and currency
   * @returns Stripe client secret for frontend
   */
  async topUpWallet(
    userId: string,
    payload: IWalletTopUpPayload,
  ): Promise<IStripePaymentIntent> {
    const { amount, currency = "INR" } = payload;
    const minTopUp = Number(process.env.WALLET_MIN_TOPUP ?? 10);
    const maxTopUp = Number(process.env.WALLET_MAX_TOPUP ?? 100000);

    if (amount < minTopUp)
      throw new AppError(`Minimum top-up amount is ₹${minTopUp}`, 400);
    if (amount > maxTopUp)
      throw new AppError(
        `Maximum top-up amount is ₹${maxTopUp.toLocaleString("en-IN")}`,
        400,
      );

    const intent = await stripeService.createPaymentIntent(amount, currency, {
      orderId: "wallet_topup",
      userId,
    });

    // Store pending top-up in Redis for webhook to pick up
    const topUpKey = idempotencyService.buildTopUpKey(intent.id);
    await idempotencyService.setKey(
      topUpKey,
      JSON.stringify({ userId, amount, currency }),
      3600,
    );

    return {
      clientSecret: intent.client_secret!,
      paymentIntentId: intent.id,
      amount,
      currency,
    };
  },

  /**
   * Called from the Stripe webhook after a top-up PaymentIntent succeeds.
   * Credits the wallet and cleans up the Redis pending key.
   *
   * @param paymentIntentId - Stripe PaymentIntent ID that succeeded
   * @returns Updated wallet document
   */
  async confirmWalletTopUp(paymentIntentId: string): Promise<IWallet> {
    const topUpKey = idempotencyService.buildTopUpKey(paymentIntentId);
    const raw = await idempotencyService.getKey(topUpKey);
    if (!raw)
      throw new AppError("Top-up session not found or already processed", 400);

    const { userId, amount } = JSON.parse(raw) as {
      userId: string;
      amount: number;
      currency: string;
    };

    const wallet = await this.creditWallet(
      userId,
      amount,
      "topup",
      paymentIntentId,
      "Wallet top-up via Stripe",
    );

    await idempotencyService.deleteKey(topUpKey);
    return wallet;
  },
};

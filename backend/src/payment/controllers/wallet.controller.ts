import { Request, Response, NextFunction } from "express";
import { walletService } from "../services/wallet.service.js";

const ok = (res: Response, message: string, data: any) =>
  res.status(200).json({ success: true, message, data });

/**
 * Wallet controller — buyer/seller wallet endpoints and admin credit.
 */
export const walletController = {
  /** GET /wallet/ — Buyer/Seller: wallet summary */
  async getWalletSummary(req: any, res: Response, next: NextFunction) {
    try {
      const summary = await walletService.getWalletSummary(req.user.userId);
      ok(res, "Wallet summary fetched", { summary });
    } catch (err) {
      next(err);
    }
  },

  /** GET /wallet/transactions — Buyer/Seller: transaction history */
  async getTransactionHistory(req: any, res: Response, next: NextFunction) {
    try {
      const result = await walletService.getTransactionHistory(
        req.user.userId,
        req.query as any,
      );
      ok(res, "Transaction history fetched", result);
    } catch (err) {
      next(err);
    }
  },

  /** POST /wallet/topup — Buyer: initiate Stripe top-up */
  async topUpWallet(req: any, res: Response, next: NextFunction) {
    try {
      const intent = await walletService.topUpWallet(req.user.userId, req.body);
      ok(res, "Top-up initiated. Complete payment to credit wallet.", {
        ...intent,
      });
    } catch (err) {
      next(err);
    }
  },

  /** POST /wallet/topup/confirm — Buyer: confirm top-up (webhook alternative) */
  async confirmTopUp(req: any, res: Response, next: NextFunction) {
    try {
      const wallet = await walletService.confirmWalletTopUp(
        req.body.paymentIntentId,
      );
      ok(res, "Wallet top-up confirmed", {
        balance: wallet.balance,
        currency: wallet.currency,
      });
    } catch (err) {
      next(err);
    }
  },

  /** POST /wallet/admin/credit — Admin: manually credit any user's wallet */
  async adminCreditWallet(req: any, res: Response, next: NextFunction) {
    try {
      const { userId, amount, description } = req.body;
      const wallet = await walletService.adminCreditWallet(
        userId,
        amount,
        description,
        req.user.userId,
      );
      ok(res, "Wallet credited by admin", { balance: wallet.balance });
    } catch (err) {
      next(err);
    }
  },
};

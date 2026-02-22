import { Request, Response, NextFunction } from "express";
import { payoutService } from "../services/payout.service.js";

const ok = (res: Response, message: string, data: any) =>
  res.status(200).json({ success: true, message, data });

/**
 * Payout controller — seller-facing and admin payout management.
 */
export const payoutController = {
  /** GET /payouts/pending — Seller: preview of pending payout */
  async getPendingPayout(req: any, res: Response, next: NextFunction) {
    try {
      const preview = await payoutService.calculatePendingPayout(
        req.user.userId,
      );
      ok(res, "Pending payout preview calculated", { preview });
    } catch (err) {
      next(err);
    }
  },

  /** GET /payouts/history — Seller: own payout history */
  async getSellerPayouts(req: any, res: Response, next: NextFunction) {
    try {
      const result = await payoutService.getSellerPayouts(
        req.user.userId,
        req.query as any,
      );
      ok(res, "Payout history fetched", result);
    } catch (err) {
      next(err);
    }
  },

  /** GET /payouts/ — Admin: all payouts */
  async getAllPayouts(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await payoutService.getAllPayouts(req.query as any);
      ok(res, "All payouts fetched", result);
    } catch (err) {
      next(err);
    }
  },

  /** POST /payouts/initiate — Admin: create a payout */
  async initiatePayout(req: any, res: Response, next: NextFunction) {
    try {
      const payout = await payoutService.initiatePayout(
        req.body,
        req.user.userId,
      );
      res
        .status(201)
        .json({ success: true, message: "Payout initiated", data: { payout } });
    } catch (err) {
      next(err);
    }
  },

  /** PATCH /payouts/:payoutId/process — Admin: mark processing */
  async processPayout(req: any, res: Response, next: NextFunction) {
    try {
      const payout = await payoutService.processPayout(
        req.params.payoutId as string,
        req.user.userId,
      );
      ok(res, "Payout marked as processing", { payout });
    } catch (err) {
      next(err);
    }
  },

  /** PATCH /payouts/:payoutId/complete — Admin: complete payout */
  async completePayout(req: any, res: Response, next: NextFunction) {
    try {
      const payout = await payoutService.completePayout(
        req.params.payoutId as string,
        req.body.transactionReference,
        req.user.userId,
      );
      ok(res, "Payout completed", { payout });
    } catch (err) {
      next(err);
    }
  },

  /** PATCH /payouts/:payoutId/fail — Admin: fail payout */
  async failPayout(req: any, res: Response, next: NextFunction) {
    try {
      const payout = await payoutService.failPayout(
        req.params.payoutId as string,
        req.body.reason,
        req.user.userId,
      );
      ok(res, "Payout marked as failed", { payout });
    } catch (err) {
      next(err);
    }
  },
};

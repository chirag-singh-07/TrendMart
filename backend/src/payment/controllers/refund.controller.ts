import { Request, Response, NextFunction } from "express";
import { refundService } from "../services/refund.service.js";

const ok = (res: Response, message: string, data: any) =>
  res.status(200).json({ success: true, message, data });

export const refundController = {
  /** POST /refunds/process/:orderId — Admin: full refund */
  async processRefund(req: any, res: Response, next: NextFunction) {
    try {
      const result = await refundService.processRefund(
        { ...req.body, orderId: req.params.orderId as string },
        req.user.userId,
      );
      ok(res, "Refund processed", { result });
    } catch (err) {
      next(err);
    }
  },

  /** POST /refunds/partial/:orderId — Admin: partial refund */
  async processPartialRefund(req: any, res: Response, next: NextFunction) {
    try {
      const result = await refundService.processPartialRefund(
        req.params.orderId as string,
        req.body.itemIds,
        req.user.userId,
      );
      ok(res, "Partial refund processed", { result });
    } catch (err) {
      next(err);
    }
  },

  /** GET /refunds/status/:orderId — Buyer: check refund status */
  async getRefundStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const status = await refundService.getRefundStatus(
        req.params.orderId as string,
      );
      ok(res, "Refund status fetched", status);
    } catch (err) {
      next(err);
    }
  },
};

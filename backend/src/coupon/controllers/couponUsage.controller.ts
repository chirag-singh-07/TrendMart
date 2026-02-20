import { Request, Response, NextFunction } from "express";
import { couponUsageService } from "../services/couponUsage.service.js";

const ok = (res: Response, message: string, data?: any) =>
  res.status(200).json({ success: true, message, ...(data ? { data } : {}) });

/**
 * Coupon Usage Controller - Handles usage history and limits
 */
export const couponUsageController = {
  /**
   * Buyer: Get own usage history
   */
  async getMyHistory(req: any, res: Response, next: NextFunction) {
    try {
      const result = await couponUsageService.getUserCouponHistory(
        req.user.userId,
        req.query,
      );
      ok(res, "Your coupon history fetched", result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Buyer: Check remaining uses for a specific coupon
   */
  async getRemainingUsage(req: any, res: Response, next: NextFunction) {
    try {
      const remaining = await couponUsageService.getUserRemainingUsage(
        req.user.userId,
        req.params.couponId,
      );
      ok(res, "Remaining usage count fetched", { remaining });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Get usage history for a coupon
   */
  async getCouponUsage(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await couponUsageService.getCouponUsageHistory(
        req.params.couponId as string,
        req.query,
      );
      ok(res, "Coupon usage logs fetched", result);
    } catch (error) {
      next(error);
    }
  },
};

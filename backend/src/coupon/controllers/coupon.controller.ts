import { Request, Response, NextFunction } from "express";
import { couponService } from "../services/coupon.service.js";
import { couponValidationService } from "../services/couponValidation.service.js";

const ok = (res: Response, message: string, data?: any) =>
  res.status(200).json({ success: true, message, ...(data ? { data } : {}) });

/**
 * Coupon Controller - Handles standard and admin coupon operations
 */
export const couponController = {
  /**
   * Buyer: List active coupons
   */
  async getActiveCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const coupons = await couponService.getActiveCoupons();
      ok(res, "Active coupons fetched", { coupons });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Buyer: Dynamic validation check
   */
  async validate(req: any, res: Response, next: NextFunction) {
    try {
      const result = await couponValidationService.validateCoupon({
        ...req.body,
        userId: req.user.userId,
      });
      ok(res, result.message, result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Buyer: Real-time quick check
   */
  async quickCheck(req: any, res: Response, next: NextFunction) {
    try {
      const result = await couponValidationService.quickValidate(
        req.params.code,
        req.user.userId,
      );
      ok(res, result.message, result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Create coupon
   */
  async createCoupon(req: any, res: Response, next: NextFunction) {
    try {
      const coupon = await couponService.createCoupon(
        req.body,
        req.user.userId,
      );
      res
        .status(201)
        .json({ success: true, message: "Coupon created", data: { coupon } });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Update coupon
   */
  async updateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = await couponService.updateCoupon(
        req.params.couponId as string,
        req.body,
      );
      ok(res, "Coupon updated", { coupon });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Deactivate/Delete coupon
   */
  async deleteCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      await couponService.deleteCoupon(req.params.couponId as string);
      ok(res, "Coupon deactivated");
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: List all coupons
   */
  async getAllCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await couponService.getAllCoupons(req.query);
      ok(res, "All coupons fetched", result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Get single coupon
   */
  async getCouponById(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = await couponService.getCouponById(
        req.params.couponId as string,
      );
      ok(res, "Coupon detail fetched", { coupon });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Toggle state
   */
  async toggleCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const coupon = await couponService.toggleCoupon(
        req.params.couponId as string,
      );
      ok(res, `Coupon ${coupon.isActive ? "activated" : "deactivated"}`, {
        coupon,
      });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Admin: Stats
   */
  async getCouponStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await couponService.getCouponStats(
        req.params.couponId as string,
      );
      ok(res, "Coupon stats fetched", { stats });
    } catch (error) {
      next(error);
    }
  },
};

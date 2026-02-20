import { ICouponUsage } from "../../interfaces/index.js";
import Coupon from "../../models/Coupon.model.js";
import CouponUsage from "../../models/CouponUsage.model.js";
import { getRedisClient } from "../../config/redis.js";
import AppError from "../../utils/AppError.js";
import { IPaginatedResult } from "../types/coupon.types.js";

/**
 * Service for tracking coupon usage and history
 */
export const couponUsageService = {
  /**
   * Records a coupon redemption and increments usage count
   */
  async redeemCoupon(
    couponId: string,
    userId: string,
    orderId: string,
    discountApplied: number,
  ): Promise<any> {
    const usage = await CouponUsage.create({
      couponId,
      userId,
      orderId,
      discountApplied,
      usedAt: new Date(),
    });

    // Increment coupon.usedCount atomically
    await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: 1 } });

    // Invalidate coupon cache
    const redis = getRedisClient();
    const coupon = await Coupon.findById(couponId);
    if (coupon) {
      await redis.del(`cache:coupon:${coupon.code.toUpperCase()}`);
    }
    await redis.del(`cache:active:coupons`);
    await redis.del(`cache:coupon:used:${userId}:${couponId}`);

    return usage;
  },

  /**
   * Reverses a coupon usage (e.g. on order cancellation)
   */
  async reverseCoupon(
    couponId: string,
    userId: string,
    orderId: string,
  ): Promise<void> {
    const deleted = await CouponUsage.findOneAndDelete({ couponId, orderId });

    if (deleted) {
      // Decrement usedCount, but never allow it to go below 0
      const coupon = await Coupon.findById(couponId);
      if (coupon && coupon.usedCount > 0) {
        await Coupon.findByIdAndUpdate(couponId, { $inc: { usedCount: -1 } });
      }

      // Invalidate cache
      const redis = getRedisClient();
      if (coupon) {
        await redis.del(`cache:coupon:${coupon.code.toUpperCase()}`);
      }
      await redis.del(`cache:active:coupons`);
      await redis.del(`cache:coupon:used:${userId}:${couponId}`);
    }
  },

  /**
   * Fetches coupon usage history for a specific user
   */
  async getUserCouponHistory(userId: string, filters: any): Promise<any> {
    const { page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      CouponUsage.find({ userId })
        .populate("couponId")
        .sort({ usedAt: -1 })
        .skip(skip)
        .limit(limit),
      CouponUsage.countDocuments({ userId }),
    ]);

    return {
      success: true,
      message: "Usage history fetched",
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  },

  /**
   * Fetches usage history for a specific coupon (Admin only)
   */
  async getCouponUsageHistory(couponId: string, filters: any): Promise<any> {
    const { page = 1, limit = 10 } = filters;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      CouponUsage.find({ couponId })
        .populate("userId", "firstName lastName email")
        .sort({ usedAt: -1 })
        .skip(skip)
        .limit(limit),
      CouponUsage.countDocuments({ couponId }),
    ]);

    return {
      success: true,
      message: "Coupon usage logic fetched",
      data: {
        items,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    };
  },

  /**
   * Checks if a user has already used a specific coupon
   */
  async hasUserUsedCoupon(userId: string, couponId: string): Promise<boolean> {
    const redis = getRedisClient();
    const cacheKey = `cache:coupon:used:${userId}:${couponId}`;

    const cached = await redis.get(cacheKey);
    if (cached) return cached === "true";

    const usageCount = await CouponUsage.countDocuments({ userId, couponId });
    const used = usageCount > 0;

    await redis.set(cacheKey, String(used), "EX", 300); // 5 min
    return used;
  },

  /**
   * Returns remaining usage for a user on a specific coupon
   */
  async getUserRemainingUsage(
    userId: string,
    couponId: string,
  ): Promise<number | null> {
    const coupon = await Coupon.findById(couponId);
    if (!coupon || coupon.perUserLimit === undefined) return null;

    const usageCount = await CouponUsage.countDocuments({ userId, couponId });
    return Math.max(0, coupon.perUserLimit - usageCount);
  },
};

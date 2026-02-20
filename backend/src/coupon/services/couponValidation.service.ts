import Coupon from "../../models/Coupon.model.js";
import CouponUsage from "../../models/CouponUsage.model.js";
import {
  ICouponValidationPayload,
  ICouponValidationResult,
} from "../types/coupon.types.js";
import { discountService } from "./discount.service.js";
import { getRedisClient } from "../../config/redis.js";
import AppError from "../../utils/AppError.js";

/**
 * Service for isolated coupon validation logic
 */
export const couponValidationService = {
  /**
   * Validates a coupon against a user's cart and runs 8 ordered checks.
   *
   * @param {ICouponValidationPayload} payload - Code, userId, cart, subtotal
   * @returns {Promise<ICouponValidationResult>} Validation status and discount details
   */
  async validateCoupon(
    payload: ICouponValidationPayload,
  ): Promise<ICouponValidationResult> {
    const { code, userId, cartItems, subtotal } = payload;
    const now = new Date();

    // Check 1 — Existence
    const coupon: any = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) {
      return {
        isValid: false,
        discountAmount: 0,
        finalAmount: subtotal,
        message: "Coupon not found",
      };
    }

    // Check 2 — Active
    if (!coupon.isActive) {
      return {
        isValid: false,
        discountAmount: 0,
        finalAmount: subtotal,
        message: "Coupon is no longer active",
      };
    }

    // Check 3 — Date Range
    if (now < coupon.startDate) {
      return {
        isValid: false,
        discountAmount: 0,
        finalAmount: subtotal,
        message: "Coupon is not yet active",
      };
    }
    if (now > coupon.expiresAt) {
      return {
        isValid: false,
        discountAmount: 0,
        finalAmount: subtotal,
        message: "Coupon has expired",
      };
    }

    // Check 4 — Usage Limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return {
        isValid: false,
        discountAmount: 0,
        finalAmount: subtotal,
        message: "Coupon usage limit has been reached",
      };
    }

    // Check 5 — Per User Limit
    const userUsageCount = await CouponUsage.countDocuments({
      userId,
      couponId: coupon._id,
    });
    if (coupon.perUserLimit && userUsageCount >= coupon.perUserLimit) {
      return {
        isValid: false,
        discountAmount: 0,
        finalAmount: subtotal,
        message: "You have already used this coupon",
      };
    }

    // Check 6 — Minimum Order Amount (Initial check)
    if (coupon.minOrderAmount && subtotal < coupon.minOrderAmount) {
      return {
        isValid: false,
        discountAmount: 0,
        finalAmount: subtotal,
        message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}`,
      };
    }

    // Check 7 — Applicable Products/Categories
    let applicableItems: string[] = [];
    let applicableSubtotal = 0;

    const hasProductConstraint =
      coupon.applicableProducts && coupon.applicableProducts.length > 0;
    const hasCategoryConstraint =
      coupon.applicableCategories && coupon.applicableCategories.length > 0;

    if (hasProductConstraint || hasCategoryConstraint) {
      const qualifyingItems = cartItems.filter((item) => {
        let isMatch = false;

        if (
          hasProductConstraint &&
          coupon.applicableProducts.map(String).includes(String(item.productId))
        ) {
          isMatch = true;
        }

        if (
          hasCategoryConstraint &&
          coupon.applicableCategories
            .map(String)
            .includes(String(item.categoryId))
        ) {
          isMatch = true;
        }

        return isMatch;
      });

      if (qualifyingItems.length === 0) {
        return {
          isValid: false,
          discountAmount: 0,
          finalAmount: subtotal,
          message: "Coupon not applicable to items in cart",
        };
      }

      applicableItems = qualifyingItems.map((i) => i.productId);
      applicableSubtotal = qualifyingItems.reduce(
        (sum, i) => sum + i.totalPrice,
        0,
      );
    } else {
      // Applies to entire cart
      applicableItems = cartItems.map((i) => i.productId);
      applicableSubtotal = subtotal;
    }

    // Check 8 — Re-validate Min Amount After Filtering
    if (coupon.minOrderAmount && applicableSubtotal < coupon.minOrderAmount) {
      return {
        isValid: false,
        discountAmount: 0,
        finalAmount: subtotal,
        message: `Qualifying items in your cart do not meet the minimum amount of ₹${coupon.minOrderAmount}`,
      };
    }

    // All checks passed
    const discountAmount = discountService.calculateDiscount(
      coupon,
      applicableSubtotal,
    );
    // Note: tax and shipping are usually added later in Order phase, but for validation we show projected discount
    const finalAmount = Math.max(0, subtotal - discountAmount);

    return {
      isValid: true,
      coupon,
      discountAmount,
      finalAmount,
      message: "Coupon applied successfully",
      applicableItems,
    };
  },

  /**
   * Performs a lightweight validation check as user types
   */
  async quickValidate(
    code: string,
    userId: string,
  ): Promise<{ isValid: boolean; message: string }> {
    const redis = getRedisClient();
    const cacheKey = `cache:coupon:quick:${code.toUpperCase()}:${userId}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const coupon: any = await Coupon.findOne({ code: code.toUpperCase() });
    if (!coupon) return { isValid: false, message: "Invalid code" };

    if (!coupon.isActive) return { isValid: false, message: "Inactive" };

    const now = new Date();
    if (now < coupon.startDate || now > coupon.expiresAt)
      return { isValid: false, message: "Expired or not yet active" };

    const usageCount = await CouponUsage.countDocuments({
      userId,
      couponId: coupon._id,
    });
    if (coupon.perUserLimit && usageCount >= coupon.perUserLimit)
      return { isValid: false, message: "Limit reached" };

    const result = { isValid: true, message: "Valid" };
    await redis.set(cacheKey, JSON.stringify(result), "EX", 120); // 2 min

    return result;
  },
};

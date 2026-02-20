import { ICoupon, DiscountType } from "../../interfaces/index.js";
import { IDiscountBreakdown } from "../types/coupon.types.js";

/**
 * Service for handling discount calculations
 */
export const discountService = {
  /**
   * Calculates discount amount based on coupon type and applicable subtotal
   *
   * @param {ICoupon} coupon - The coupon object
   * @param {number} applicableSubtotal - Subtotal of items the coupon applies to
   * @returns {number} The calculated discount amount
   */
  calculateDiscount(coupon: ICoupon, applicableSubtotal: number): number {
    let discountAmount = 0;

    if (coupon.discountType === "flat") {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === "percentage") {
      discountAmount = applicableSubtotal * (coupon.discountValue / 100);

      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    }

    // Cap at applicableSubtotal (cannot discount more than subtotal)
    discountAmount = Math.min(discountAmount, applicableSubtotal);

    // Round to 2 decimal places
    return Math.round(discountAmount * 100) / 100;
  },

  /**
   * Calculates final amount after applying discount
   */
  calculateFinalAmount(
    subtotal: number,
    taxAmount: number,
    shippingFee: number,
    discountAmount: number,
  ): number {
    const finalAmount = subtotal + taxAmount + shippingFee - discountAmount;

    // Final amount must never be negative
    // Round to 2 decimal places
    return Math.round(Math.max(0, finalAmount) * 100) / 100;
  },

  /**
   * Returns a human-readable breakdown of the discount
   */
  getDiscountBreakdown(
    coupon: ICoupon,
    cartItems: any[],
    subtotal: number,
    applicableSubtotal: number,
    discountAmount: number,
  ): IDiscountBreakdown {
    return {
      couponCode: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      applicableSubtotal,
      discountAmount,
      maxDiscountCap: coupon.maxDiscount,
      savingsPercentage:
        subtotal > 0
          ? Math.round((discountAmount / subtotal) * 10000) / 100
          : 0,
    };
  },
};

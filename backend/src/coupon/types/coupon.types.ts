import { ICoupon, DiscountType } from "../../interfaces/index.js";

export interface ICouponValidationPayload {
  code: string;
  userId: string;
  cartItems: ICartItemForCoupon[];
  subtotal: number;
}

export interface ICartItemForCoupon {
  productId: string;
  categoryId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ICouponValidationResult {
  isValid: boolean;
  coupon?: ICoupon;
  discountAmount: number;
  finalAmount: number;
  message: string;
  applicableItems?: string[]; // productIds the coupon actually applies to
}

export interface ICouponApplyResult {
  coupon: ICoupon;
  discountAmount: number;
  finalAmount: number;
  applicableItems: string[];
}

export interface ICouponFilters {
  isActive?: boolean;
  discountType?: DiscountType;
  fromDate?: Date | string;
  toDate?: Date | string;
  search?: string; // search by code or description
  page?: number;
  limit?: number;
}

export interface ICouponUsageFilters {
  couponId?: string;
  userId?: string;
  fromDate?: Date | string;
  toDate?: Date | string;
  page?: number;
  limit?: number;
}

export interface ICouponStats {
  couponId: string;
  code: string;
  totalUsed: number;
  totalDiscountGiven: number;
  totalOrdersAffected: number;
  averageDiscountPerOrder: number;
  remainingUsage?: number | null; // null if unlimited
}

export interface IDiscountBreakdown {
  couponCode: string;
  discountType: DiscountType;
  discountValue: number;
  applicableSubtotal: number;
  discountAmount: number;
  maxDiscountCap?: number;
  savingsPercentage: number; // (discountAmount / subtotal) * 100
}

export interface IPaginatedResult<T> {
  success: boolean;
  message: string;
  data: {
    [key: string]: T[] | number | boolean;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

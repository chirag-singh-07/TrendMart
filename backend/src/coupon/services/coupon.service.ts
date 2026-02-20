import Coupon, { ICouponDocument } from "../../models/Coupon.model.js";
import CouponUsage from "../../models/CouponUsage.model.js";
import Order from "../../models/Order.model.js";
import Product from "../../product/models/product.model.js";
import Category from "../../product/models/category.model.js";
import { getRedisClient } from "../../config/redis.js";
import AppError from "../../utils/AppError.js";
import { ICouponFilters, ICouponStats } from "../types/coupon.types.js";

/**
 * Service for managing individual coupons
 */
export const couponService = {
  /**
   * Creates a new coupon in the system
   */
  async createCoupon(data: any, adminId: string): Promise<ICouponDocument> {
    const code = data.code.toUpperCase();

    // Uniqueness check
    const existing = await Coupon.findOne({ code });
    if (existing) throw new AppError("Coupon code already exists", 409);

    // Date validation
    if (new Date(data.startDate) >= new Date(data.expiresAt)) {
      throw new AppError("startDate must be before expiresAt", 400);
    }

    // Constraint validation
    if (data.applicableProducts) {
      const count = await Product.countDocuments({
        _id: { $in: data.applicableProducts },
      });
      if (count !== data.applicableProducts.length) {
        throw new AppError("One or more product IDs are invalid", 400);
      }
    }

    if (data.applicableCategories) {
      const count = await Category.countDocuments({
        _id: { $in: data.applicableCategories },
      });
      if (count !== data.applicableCategories.length) {
        throw new AppError("One or more category IDs are invalid", 400);
      }
    }

    const coupon = await Coupon.create({
      ...data,
      code,
      usedCount: 0,
    });

    // Invalidate list cache
    const redis = getRedisClient();
    await redis.del(`cache:active:coupons`);

    return coupon;
  },

  /**
   * Updates an existing coupon
   */
  async updateCoupon(couponId: string, data: any): Promise<ICouponDocument> {
    if (data.code)
      throw new AppError("Coupon code cannot be changed after creation", 400);

    const coupon = await Coupon.findById(couponId);
    if (!coupon) throw new AppError("Coupon not found", 404);

    if (data.usageLimit && data.usageLimit < coupon.usedCount) {
      throw new AppError(
        "Usage limit cannot be less than current usage count",
        400,
      );
    }

    if (data.startDate && data.expiresAt) {
      if (new Date(data.startDate) >= new Date(data.expiresAt)) {
        throw new AppError("startDate must be before expiresAt", 400);
      }
    }

    const updated = await Coupon.findByIdAndUpdate(couponId, data, {
      new: true,
    });

    // Invalidate cache
    const redis = getRedisClient();
    await redis.del(`cache:coupon:${coupon.code.toUpperCase()}`);
    await redis.del(`cache:active:coupons`);

    return updated!;
  },

  /**
   * Soft deletes a coupon by deactivating it
   */
  async deleteCoupon(couponId: string): Promise<void> {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) throw new AppError("Coupon not found", 404);

    // Check for active orders using the coupon
    const activeOrderCount = await Order.countDocuments({
      couponId,
      orderStatus: { $in: ["pending", "confirmed", "processing"] },
    });

    if (activeOrderCount > 0) {
      throw new AppError(
        "Cannot deactivate coupon with pending orders using it",
        400,
      );
    }

    coupon.isActive = false;
    await coupon.save();

    // Invalidate cache
    const redis = getRedisClient();
    await redis.del(`cache:coupon:${coupon.code.toUpperCase()}`);
    await redis.del(`cache:active:coupons`);
  },

  /**
   * Fetches a coupon by ID
   */
  async getCouponById(couponId: string): Promise<ICouponDocument> {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) throw new AppError("Coupon not found", 404);
    return coupon;
  },

  /**
   * Fetches a coupon by code with caching
   */
  async getCouponByCode(code: string): Promise<ICouponDocument> {
    const upperCode = code.toUpperCase();
    const redis = getRedisClient();
    const cacheKey = `cache:coupon:${upperCode}`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const coupon = await Coupon.findOne({ code: upperCode });
    if (!coupon) throw new AppError("Coupon not found", 404);

    await redis.set(cacheKey, JSON.stringify(coupon), "EX", 600); // 10 min
    return coupon;
  },

  /**
   * Lists all coupons for admin view
   */
  async getAllCoupons(filters: ICouponFilters): Promise<any> {
    const {
      isActive,
      discountType,
      fromDate,
      toDate,
      search,
      page = 1,
      limit = 10,
    } = filters;
    const query: any = {};

    if (isActive !== undefined) query.isActive = isActive;
    if (discountType) query.discountType = discountType;
    if (fromDate || toDate) {
      query.startDate = {};
      if (fromDate) query.startDate.$gte = new Date(fromDate);
      if (toDate) query.startDate.$lte = new Date(toDate);
    }
    if (search) {
      query.$or = [
        { code: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Coupon.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Coupon.countDocuments(query),
    ]);

    return {
      success: true,
      message: "Coupons fetched",
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
   * Public route to fetch active, non-expired coupons
   */
  async getActiveCoupons(): Promise<any[]> {
    const redis = getRedisClient();
    const cacheKey = `cache:active:coupons`;

    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const now = new Date();
    const coupons = await Coupon.find({
      isActive: true,
      startDate: { $lte: now },
      expiresAt: { $gt: now },
    })
      .select("-usageLimit -usedCount")
      .lean();

    await redis.set(cacheKey, JSON.stringify(coupons), "EX", 300); // 5 min
    return coupons;
  },

  /**
   * Toggles active/inactive state of a coupon
   */
  async toggleCoupon(couponId: string): Promise<ICouponDocument> {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) throw new AppError("Coupon not found", 404);

    coupon.isActive = !coupon.isActive;
    await coupon.save();

    // Invalidate cache
    const redis = getRedisClient();
    await redis.del(`cache:coupon:${coupon.code.toUpperCase()}`);
    await redis.del(`cache:active:coupons`);

    return coupon;
  },

  /**
   * Aggregate usage statistics for a coupon
   */
  async getCouponStats(couponId: string): Promise<ICouponStats> {
    const coupon = await Coupon.findById(couponId);
    if (!coupon) throw new AppError("Coupon not found", 404);

    const stats = await CouponUsage.aggregate([
      { $match: { couponId: coupon._id } },
      {
        $group: {
          _id: "$couponId",
          totalDiscountGiven: { $sum: "$discountApplied" },
          totalOrdersAffected: { $sum: 1 },
        },
      },
    ]);

    const result = stats[0] || {
      totalDiscountGiven: 0,
      totalOrdersAffected: 0,
    };

    return {
      couponId: String(coupon._id),
      code: coupon.code,
      totalUsed: coupon.usedCount,
      totalDiscountGiven: result.totalDiscountGiven,
      totalOrdersAffected: result.totalOrdersAffected,
      averageDiscountPerOrder:
        result.totalOrdersAffected > 0
          ? result.totalDiscountGiven / result.totalOrdersAffected
          : 0,
      remainingUsage: coupon.usageLimit
        ? coupon.usageLimit - coupon.usedCount
        : null,
    };
  },
};

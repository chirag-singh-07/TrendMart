import mongoose from "mongoose";
import Review from "../../models/Review.model.js";
import Order from "../../models/Order.model.js";
import { IEligibilityResult } from "../types/review.types.js";
import OrderItem from "../../models/OrderItem.model.js";

/**
 * Service for checking review eligibility based on verified purchase
 */
export const reviewEligibilityService = {
  /**
   * Runs 3 sequential eligibility checks:
   * 1. Already reviewed check
   * 2. Verified purchase check (delivered order)
   * 3. Returns eligible with orderId
   *
   * @param userId - ID of the requesting user
   * @param productId - ID of the product to review
   * @returns IEligibilityResult indicating whether the user may submit a review
   */
  async checkEligibility(
    userId: string,
    productId: string,
  ): Promise<IEligibilityResult> {
    // Check 1 — Already Reviewed
    const existingReview = await Review.findOne({
      userId: new mongoose.Types.ObjectId(userId),
      productId: new mongoose.Types.ObjectId(productId),
    });

    if (existingReview) {
      return {
        isEligible: false,
        alreadyReviewed: true,
        reason: "You have already reviewed this product",
      };
    }

    // Check 2 — Verified Purchase: find a delivered OrderItem for this product by this user
    const eligibleOrderItem = await OrderItem.aggregate([
      {
        $match: {
          productId: new mongoose.Types.ObjectId(productId),
        },
      },
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: "$order" },
      {
        $match: {
          "order.userId": new mongoose.Types.ObjectId(userId),
          "order.orderStatus": "delivered",
        },
      },
      { $limit: 1 },
      { $project: { orderId: 1 } },
    ]);

    if (!eligibleOrderItem || eligibleOrderItem.length === 0) {
      return {
        isEligible: false,
        reason: "You can only review products you have purchased and received",
      };
    }

    // Check 3 — Eligible
    return {
      isEligible: true,
      orderId: String(eligibleOrderItem[0].orderId),
    };
  },

  /**
   * Finds all products that a user has purchased and received but not yet reviewed.
   *
   * @param userId - ID of the user
   * @returns Array of productId strings the user is eligible to review
   */
  async getEligibleProducts(userId: string): Promise<string[]> {
    // Find all productIds from delivered orders
    const deliveredItems = await OrderItem.aggregate([
      {
        $lookup: {
          from: "orders",
          localField: "orderId",
          foreignField: "_id",
          as: "order",
        },
      },
      { $unwind: "$order" },
      {
        $match: {
          "order.userId": new mongoose.Types.ObjectId(userId),
          "order.orderStatus": "delivered",
        },
      },
      {
        $group: {
          _id: "$productId",
        },
      },
    ]);

    const deliveredProductIds = deliveredItems.map((i) => i._id);

    // Find products already reviewed by user
    const existingReviews = await Review.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).select("productId");

    const reviewedProductIds = existingReviews.map((r) => String(r.productId));

    // Return products not yet reviewed
    return deliveredProductIds
      .filter(
        (id: mongoose.Types.ObjectId) =>
          !reviewedProductIds.includes(String(id)),
      )
      .map(String);
  },

  /**
   * Verifies that a specific order:
   * 1. Belongs to the user
   * 2. Contains the specified product
   * 3. Is in "delivered" status
   *
   * Used as the final check before persisting a review.
   *
   * @param userId - ID of the buyer
   * @param orderId - ID of the order claimed in the payload
   * @param productId - ID of the product being reviewed
   * @returns boolean — true if all conditions are satisfied
   */
  async verifyOrderOwnership(
    userId: string,
    orderId: string,
    productId: string,
  ): Promise<boolean> {
    const order = await Order.findOne({
      _id: new mongoose.Types.ObjectId(orderId),
      userId: new mongoose.Types.ObjectId(userId),
      orderStatus: "delivered",
    });

    if (!order) return false;

    const orderItem = await OrderItem.findOne({
      orderId: new mongoose.Types.ObjectId(orderId),
      productId: new mongoose.Types.ObjectId(productId),
    });

    return !!orderItem;
  },
};

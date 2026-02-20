import { IOrderItem, ISellerBreakdown } from "../../interfaces/index.js";
import Seller from "../../models/Seller.model.js";
import Order from "../../models/Order.model.js";
import { calculateSellerShipping } from "../utils/shipping.util.js";
import AppError from "../../utils/AppError.js";

/**
 * Service for calculating seller-specific financial breakdowns for an order
 */
export const sellerBreakdownService = {
  /**
   * Calculates breakdown for each seller involved in an order
   *
   * @param {IOrderItem[]} orderItems - List of items in the order
   * @returns {Promise<ISellerBreakdown[]>} Array of breakdown objects
   */
  async calculate(orderItems: IOrderItem[]): Promise<ISellerBreakdown[]> {
    // Group items by sellerId
    const sellerGroups = new Map<string, IOrderItem[]>();
    for (const item of orderItems) {
      const sId = String(item.sellerId);
      if (!sellerGroups.has(sId)) sellerGroups.set(sId, []);
      sellerGroups.get(sId)!.push(item);
    }

    const breakdowns: ISellerBreakdown[] = [];

    // Process each seller
    for (const [sellerId, items] of sellerGroups.entries()) {
      const seller = await Seller.findOne({ userId: sellerId });
      if (!seller)
        throw new AppError(`Seller not found for ID: ${sellerId}`, 404);

      const commissionRate = seller.commissionRate || 0.1; // fallback to 10%

      const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
      const shippingFee = await calculateSellerShipping(items);

      const commissionAmount = subtotal * commissionRate;
      const sellerEarnings = subtotal - commissionAmount;

      breakdowns.push({
        sellerId: sellerId as any,
        subtotal,
        shippingFee,
        commissionAmount,
        sellerEarnings,
      });
    }

    return breakdowns;
  },

  /**
   * Retrieves breakdown for a specific seller from an existing order
   */
  async getSellerEarningsForOrder(
    orderId: string,
    sellerId: string,
  ): Promise<ISellerBreakdown> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    const entry = order.sellerBreakdown.find(
      (b: ISellerBreakdown) => String(b.sellerId) === sellerId,
    );

    if (!entry)
      throw new AppError("Breakdown for this seller not found in order", 404);

    return entry;
  },

  /**
   * Calculates total platform commission within a date range
   *
   * @param {Date} fromDate - Start of range
   * @param {Date} toDate - End of range
   * @returns {Promise<number>} Total commission amount
   */
  async calculatePlatformRevenue(
    fromDate: Date,
    toDate: Date,
  ): Promise<number> {
    const orders = await Order.find({
      createdAt: { $gte: fromDate, $lte: toDate },
      paymentStatus: "paid", // Real revenue is only from paid orders
    });

    return orders.reduce((sum, order) => {
      const commission = order.sellerBreakdown.reduce(
        (s, b) => s + b.commissionAmount,
        0,
      );
      return sum + commission;
    }, 0);
  },
};

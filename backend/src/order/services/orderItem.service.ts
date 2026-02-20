import { OrderItem } from "../../models/OrderItem.model.js";
import AppError from "../../utils/AppError.js";

/**
 * Service for managing individual items within orders
 */
export const orderItemService = {
  /**
   * Fetches all items belonging to a specific order
   */
  async getItemsByOrder(orderId: string): Promise<any[]> {
    return await OrderItem.find({ orderId })
      .populate("productId", "title thumbnail")
      .populate("variantId", "variantName");
  },

  /**
   * Fetches order items for a specific seller across all orders
   */
  async getItemsBySeller(sellerId: string, filters: any = {}): Promise<any> {
    const { fromDate, toDate, page = 1, limit = 10 } = filters;
    const query: any = { sellerId };

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      OrderItem.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("productId", "title categoryId")
        .populate("orderId", "orderNumber orderStatus"),
      OrderItem.countDocuments(query),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  },

  /**
   * Fetches a single order item by ID
   */
  async getItemById(itemId: string): Promise<any> {
    const item = await OrderItem.findById(itemId)
      .populate("productId")
      .populate("variantId")
      .populate("orderId", "orderNumber userId");

    if (!item) throw new AppError("Order item not found", 404);
    return item;
  },
};

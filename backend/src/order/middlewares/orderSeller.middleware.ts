import { Response, NextFunction } from "express";
import Order from "../../models/Order.model.js";
import AppError from "../../utils/AppError.js";

/**
 * Middleware to ensure the current seller is involved in the order they are trying to access
 */
export const orderSellerMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;

    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    const isAuthorizedSeller = order.sellerBreakdown.some(
      (breakdown: any) => String(breakdown.sellerId) === String(userId),
    );

    if (!isAuthorizedSeller) {
      throw new AppError(
        "Access denied. You do not have items in this order.",
        403,
      );
    }

    req.order = order;
    next();
  } catch (error) {
    next(error);
  }
};

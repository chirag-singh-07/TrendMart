import { Response, NextFunction } from "express";
import Order from "../../models/Order.model.js";
import AppError from "../../utils/AppError.js";

/**
 * Middleware to ensure the current buyer owns the order they are trying to access
 */
export const orderOwnerMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.userId;
    const role = req.user.role;

    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    // If role is buyer, must be the owner
    if (role === "buyer" && String(order.userId) !== String(userId)) {
      throw new AppError("Access denied. You do not own this order.", 403);
    }

    // Admins can pass through
    // Sellers have their own middleware for item-level access,
    // but if a seller is checking an order, they should pass if they are involved.
    if (role === "seller") {
      const isInvolved = order.sellerBreakdown.some(
        (b: any) => String(b.sellerId) === String(userId),
      );
      if (!isInvolved)
        throw new AppError(
          "Access denied. You are not a seller for this order.",
          403,
        );
    }

    req.order = order;
    next();
  } catch (error) {
    next(error);
  }
};

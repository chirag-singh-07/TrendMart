import { Response, NextFunction } from "express";
import Cart from "../../models/Cart.model";
import AppError from "../../utils/AppError";

/**
 * Middleware to verify that the cart being accessed belongs to the authenticated user.
 * Expects req.user to be populated by auth middleware.
 */
export const cartOwnerMiddleware = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user.userId;
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      throw new AppError("Cart not found", 404);
    }

    // Safety check - though userId is unique, we ensure logic consistency
    if (String(cart.userId) !== String(userId)) {
      throw new AppError("Access denied. You do not own this cart.", 403);
    }

    // Attach cart to request to avoid double lookup in controller
    req.cart = cart;
    next();
  } catch (error) {
    next(error);
  }
};

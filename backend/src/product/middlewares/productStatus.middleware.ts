import { Response, NextFunction } from "express";
import AppError from "../../utils/AppError";

/**
 * Middleware to block buyers/guests from viewing draft or banned products.
 */
export const checkProductStatus = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const product = req.product; // Assumes product is already attached to req

    if (!product) return next();

    const role = req.user?.role;
    const isOwner =
      req.user?.userId?.toString() === product.sellerId.toString();

    if (role === "admin" || isOwner) {
      return next();
    }

    if (["draft", "banned"].includes(product.status)) {
      return next(new AppError("Product not found", 404));
    }

    next();
  } catch (error) {
    next(error);
  }
};

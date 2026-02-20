import { Request, Response, NextFunction } from "express";
import Product from "../models/product.model";
import AppError from "../../utils/AppError";

/**
 * Middleware to verify if the authenticated user is the owner of the product.
 * Seller can only edit/delete their own products.
 */
export const isProductOwner = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = req.params.productId;
    const userId = req.user.userId;

    const product = await Product.findById(productId);

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    if (
      product.sellerId.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return next(
        new AppError("You do not have permission to modify this product", 403),
      );
    }

    req.product = product;
    next();
  } catch (error) {
    next(error);
  }
};

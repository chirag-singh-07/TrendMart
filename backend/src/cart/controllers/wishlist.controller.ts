import { Request, Response, NextFunction } from "express";
import { wishlistService } from "../services/wishlist.service.js";

const ok = (res: Response, message: string, data?: any, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...(data ? { data } : {}),
  });

/**
 * Wishlist Controller - Exposes wishlist functionality via HTTP
 */
export const wishlistController = {
  /**
   * Get current user's wishlist with product details
   */
  async getWishlist(req: any, res: Response, next: NextFunction) {
    try {
      const summary = await wishlistService.getWishlistWithProducts(
        req.user.userId,
      );
      ok(res, "Wishlist fetched successfully", summary);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add product to wishlist
   */
  async addToWishlist(req: any, res: Response, next: NextFunction) {
    try {
      const wishlist = await wishlistService.addToWishlist(
        req.user.userId,
        req.body.productId,
      );
      ok(res, "Product added to wishlist", { wishlist });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove product from wishlist
   */
  async removeFromWishlist(req: any, res: Response, next: NextFunction) {
    try {
      const wishlist = await wishlistService.removeFromWishlist(
        req.user.userId,
        req.params.productId,
      );
      ok(res, "Product removed from wishlist", { wishlist });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Clear entire wishlist
   */
  async clearWishlist(req: any, res: Response, next: NextFunction) {
    try {
      await wishlistService.clearWishlist(req.user.userId);
      ok(res, "Wishlist cleared successfully");
    } catch (error) {
      next(error);
    }
  },

  /**
   * Check if a specific product is wishlisted
   */
  async checkWishlist(req: any, res: Response, next: NextFunction) {
    try {
      const isInWishlist = await wishlistService.isInWishlist(
        req.user.userId,
        req.params.productId,
      );
      ok(res, "Wishlist status checked", { isInWishlist });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Move item from wishlist to cart
   */
  async moveToCart(req: any, res: Response, next: NextFunction) {
    try {
      const result = await wishlistService.moveToCart(
        req.user.userId,
        req.body.productId,
      );
      ok(res, "Product moved to cart successfully", result);
    } catch (error) {
      next(error);
    }
  },
};

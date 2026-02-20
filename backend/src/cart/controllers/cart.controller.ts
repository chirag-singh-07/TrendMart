import { Request, Response, NextFunction } from "express";
import { cartService } from "../services/cart.service.js";

/**
 * Standard success response helper
 */
const ok = (res: Response, message: string, data?: any, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...(data ? { data } : {}),
  });

/**
 * Cart Controller - Exposes cart functionality via HTTP
 */
export const cartController = {
  /**
   * Get current user's cart with full details
   */
  async getCart(req: any, res: Response, next: NextFunction) {
    try {
      const summary = await cartService.getCartWithDetails(req.user.userId);
      ok(res, "Cart fetched successfully", summary);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Add item to cart
   */
  async addToCart(req: any, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.addToCart(req.user.userId, req.body);
      ok(res, "Item added to cart successfully", { cart });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update quantity of an item
   */
  async updateCartItem(req: any, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.updateCartItem(req.user.userId, req.body);
      ok(res, "Cart updated successfully", { cart });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Remove item from cart
   */
  async removeFromCart(req: any, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.removeCartItem(req.user.userId, req.body);
      ok(res, "Item removed from cart", { cart });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Clear entire cart
   */
  async clearCart(req: any, res: Response, next: NextFunction) {
    try {
      await cartService.clearCart(req.user.userId);
      ok(res, "Cart cleared successfully");
    } catch (error) {
      next(error);
    }
  },

  /**
   * Validate cart state for checkout
   */
  async validateCart(req: any, res: Response, next: NextFunction) {
    try {
      const validation = await cartService.validateCartForCheckout(
        req.user.userId,
      );
      ok(res, "Cart validation completed", validation);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Sync prices to latest
   */
  async syncPrices(req: any, res: Response, next: NextFunction) {
    try {
      const cart = await cartService.syncCartPrices(req.user.userId);
      ok(res, "Cart prices synced successfully", { cart });
    } catch (error) {
      next(error);
    }
  },
};

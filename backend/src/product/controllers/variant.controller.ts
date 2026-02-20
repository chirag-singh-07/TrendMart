import { Request, Response, NextFunction } from "express";
import { variantService } from "../services/variant.service";

/**
 * Standard response shape.
 */
const ok = (res: Response, message: string, data?: any, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...(data ? { data } : {}),
  });

/**
 * Variant Controller
 */
export const variantController = {
  /**
   * Get all variants for a product (public)
   */
  async getVariants(req: Request, res: Response, next: NextFunction) {
    try {
      const variants = await variantService.getVariantsByProduct(
        req.params.productId as string,
      );
      ok(res, "Product variants fetched successfully", { variants });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create variant (seller)
   */
  async createVariant(req: any, res: Response, next: NextFunction) {
    try {
      const variant = await variantService.createVariant(
        req.params.productId as string,
        req.body,
        req.user.userId,
      );
      ok(res, "Variant created successfully", { variant }, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update variant (seller)
   */
  async updateVariant(req: any, res: Response, next: NextFunction) {
    try {
      const variant = await variantService.updateVariant(
        req.params.variantId as string,
        req.body,
        req.user.userId,
      );
      ok(res, "Variant updated successfully", { variant });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete variant (seller)
   */
  async deleteVariant(req: any, res: Response, next: NextFunction) {
    try {
      await variantService.deleteVariant(
        req.params.variantId as string,
        req.user.userId,
      );
      ok(res, "Variant deleted successfully");
    } catch (error) {
      next(error);
    }
  },

  /**
   * Set default variant (seller)
   */
  async setDefaultVariant(req: any, res: Response, next: NextFunction) {
    try {
      await variantService.setDefaultVariant(
        req.params.variantId as string,
        req.params.productId as string,
        req.user.userId,
      );
      ok(res, "Default variant set successfully");
    } catch (error) {
      next(error);
    }
  },
};

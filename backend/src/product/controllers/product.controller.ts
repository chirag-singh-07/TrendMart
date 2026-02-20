import { Request, Response, NextFunction } from "express";
import { productService } from "../services/product.service";
import { productSearchService } from "../services/productSearch.service";

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
 * Product Controller
 */
export const productController = {
  /**
   * Get products with filters (public)
   */
  async getProducts(req: any, res: Response, next: NextFunction) {
    try {
      const result = await productService.getProducts(req.query);
      ok(res, "Products fetched successfully", result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Full-text search products
   */
  async searchProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query.q as string;
      const result = await productSearchService.searchProducts(
        query,
        req.query,
      );
      ok(res, "Search results fetched successfully", result);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get product by ID (public)
   */
  async getProductById(req: any, res: Response, next: NextFunction) {
    try {
      const role = req.user?.role;
      const product = await productService.getProductById(
        req.params.productId,
        role,
      );

      // Background task: increment view count
      productService
        .incrementViewCount(req.params.productId)
        .catch(console.error);

      ok(res, "Product fetched successfully", { product });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get related products
   */
  async getRelatedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productSearchService.getRelatedProducts(
        req.params.productId as string,
      );
      ok(res, "Related products fetched successfully", { products });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get featured products
   */
  async getFeaturedProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productSearchService.getFeaturedProducts();
      ok(res, "Featured products fetched successfully", { products });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get new arrivals
   */
  async getNewArrivals(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productSearchService.getNewArrivals();
      ok(res, "New arrivals fetched successfully", { products });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get best sellers
   */
  async getBestSellers(req: Request, res: Response, next: NextFunction) {
    try {
      const products = await productSearchService.getBestSellers();
      ok(res, "Best sellers fetched successfully", { products });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create product (seller)
   */
  async createProduct(req: any, res: Response, next: NextFunction) {
    try {
      const product = await productService.createProduct(
        req.body,
        req.user.userId,
      );
      ok(res, "Product created successfully as draft", { product }, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update product (seller)
   */
  async updateProduct(req: any, res: Response, next: NextFunction) {
    try {
      const product = await productService.updateProduct(
        req.params.productId,
        req.body,
        req.user.userId,
      );
      ok(res, "Product updated successfully", { product });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Delete product (seller)
   */
  async deleteProduct(req: any, res: Response, next: NextFunction) {
    try {
      await productService.deleteProduct(req.params.productId, req.user.userId);
      ok(res, "Product soft-deleted successfully");
    } catch (error) {
      next(error);
    }
  },

  /**
   * Publish product (seller)
   */
  async publishProduct(req: any, res: Response, next: NextFunction) {
    try {
      const product = await productService.publishProduct(
        req.params.productId,
        req.user.userId,
      );
      ok(res, "Product published successfully", { product });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update stock (seller/admin)
   */
  async updateStock(req: any, res: Response, next: NextFunction) {
    try {
      await productService.updateStock({
        productId: req.params.productId,
        ...req.body,
      });
      ok(res, "Stock updated successfully");
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get seller's own products
   */
  async getSellerProducts(req: any, res: Response, next: NextFunction) {
    try {
      const result = await productService.getSellerProducts(
        req.user.userId,
        req.query,
      );
      ok(res, "Seller products fetched successfully", result);
    } catch (error) {
      next(error);
    }
  },
};

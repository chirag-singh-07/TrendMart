import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/category.service";

/**
 * Standard success response shape.
 */
const ok = (res: Response, message: string, data?: any, statusCode = 200) =>
  res.status(statusCode).json({
    success: true,
    message,
    ...(data ? { data } : {}),
  });

/**
 * Category Controller
 */
export const categoryController = {
  /**
   * Get full category tree (public)
   */
  async getCategoryTree(req: Request, res: Response, next: NextFunction) {
    try {
      const tree = await categoryService.getCategoryTree();
      ok(res, "Category tree fetched successfully", tree);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get all categories including inactive (admin)
   */
  async getAllCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await categoryService.getAllCategories(true);
      ok(res, "All categories fetched successfully", { categories });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Get single category by ID
   */
  async getCategoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.getCategoryById(
        req.params.categoryId as string,
      );
      ok(res, "Category fetched successfully", { category });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Create new category (admin)
   */
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.createCategory(req.body);
      ok(res, "Category created successfully", { category }, 201);
    } catch (error) {
      next(error);
    }
  },

  /**
   * Update category (admin)
   */
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await categoryService.updateCategory(
        req.params.categoryId as string,
        req.body,
      );
      ok(res, "Category updated successfully", { category });
    } catch (error) {
      next(error);
    }
  },

  /**
   * Soft delete category (admin)
   */
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.deleteCategory(req.params.categoryId as string);
      ok(res, "Category deleted successfully");
    } catch (error) {
      next(error);
    }
  },

  /**
   * Reorder categories (admin)
   */
  async reorderCategories(req: Request, res: Response, next: NextFunction) {
    try {
      await categoryService.reorderCategories(req.body.orderedIds);
      ok(res, "Categories reordered successfully");
    } catch (error) {
      next(error);
    }
  },
};

import Category from "../models/category.model";
import Product from "../models/product.model";
import { ICategory } from "../../interfaces";
import { ICategoryTree } from "../types/product.types";
import { generateSlug } from "../utils/slug.util";
import { productCacheService } from "./productCache.service";
import AppError from "../../utils/AppError";

/**
 * Category Service - Handles category management logic
 */
export const categoryService = {
  /**
   * Create a new category
   * @param data Category data
   * @returns Created category
   */
  async createCategory(data: Partial<ICategory>): Promise<ICategory> {
    const slug = generateSlug(data.name!);

    let level = 0;
    if (data.parentCategoryId) {
      const parent = await Category.findById(data.parentCategoryId);
      if (!parent) throw new AppError("Parent category not found", 404);
      level = parent.level + 1;
      if (level > 2)
        throw new AppError("Max 3 levels of categories allowed", 400);
    }

    const category = await Category.create({
      ...data,
      slug,
      level,
    });

    await productCacheService.invalidateCategoryTreeCache();
    return category;
  },

  /**
   * Update an existing category
   */
  async updateCategory(
    categoryId: string,
    data: Partial<ICategory>,
  ): Promise<ICategory> {
    const category = await Category.findById(categoryId);
    if (!category) throw new AppError("Category not found", 404);

    if (data.name) {
      data.slug = generateSlug(data.name);
    }

    if (data.parentCategoryId !== undefined) {
      if (data.parentCategoryId === null) {
        data.level = 0;
      } else {
        const parent = await Category.findById(data.parentCategoryId);
        if (!parent) throw new AppError("Parent category not found", 404);
        const level = parent.level + 1;
        if (level > 2)
          throw new AppError("Max 3 levels of categories allowed", 400);
        data.level = level;
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(categoryId, data, {
      new: true,
    });
    await productCacheService.invalidateCategoryTreeCache();
    return updatedCategory!;
  },

  /**
   * Soft delete a category
   */
  async deleteCategory(categoryId: string): Promise<void> {
    const hasChildren = await Category.findOne({
      parentCategoryId: categoryId,
      isActive: true,
    });
    if (hasChildren) throw new AppError("Remove subcategories first", 400);

    const hasProducts = await Product.findOne({
      categoryId,
      status: { $ne: "banned" },
    });
    if (hasProducts) throw new AppError("Category has active products", 400);

    await Category.findByIdAndUpdate(categoryId, { isActive: false });
    await productCacheService.invalidateCategoryTreeCache();
  },

  /**
   * Build and return category tree
   */
  async getCategoryTree(): Promise<ICategoryTree[]> {
    const cached = await productCacheService.getCategoryTreeCache();
    if (cached) return cached;

    const allCategories = await Category.find({ isActive: true })
      .sort({ displayOrder: 1 })
      .lean();

    const buildTree = (parentId: string | null = null): ICategoryTree[] => {
      return allCategories
        .filter(
          (cat) => String(cat.parentCategoryId || null) === String(parentId),
        )
        .map((cat) => ({
          ...cat,
          children: buildTree(String(cat._id)),
        })) as ICategoryTree[];
    };

    const tree = buildTree(null);
    await productCacheService.setCategoryTreeCache(tree);
    return tree;
  },

  /**
   * Get category by ID
   */
  async getCategoryById(categoryId: string): Promise<ICategory> {
    const category = await Category.findById(categoryId);
    if (!category) throw new AppError("Category not found", 404);
    return category;
  },

  /**
   * Get all categories
   */
  async getAllCategories(
    includeInactive: boolean = false,
  ): Promise<ICategory[]> {
    const filter = includeInactive ? {} : { isActive: true };
    return Category.find(filter).sort({ displayOrder: 1 });
  },

  /**
   * Reorder categories
   */
  async reorderCategories(orderedIds: string[]): Promise<void> {
    await Promise.all(
      orderedIds.map((id, index) =>
        Category.findByIdAndUpdate(id, { displayOrder: index }),
      ),
    );
    await productCacheService.invalidateCategoryTreeCache();
  },
};

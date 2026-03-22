import { Request, Response, NextFunction } from "express";
import Product from "../../product/models/product.model.js";
import Category from "../../product/models/category.model.js";

interface AuthRequest extends Request {
  admin?: any;
  adminId?: string;
}

// ── Get all products (admin view) ───────────────────────────────────────────
export const adminGetAllProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      categoryId,
      search,
      minPrice,
      maxPrice,
    } = req.query;

    const filter: any = {};
    if (status) filter.status = status;
    if (categoryId) filter.categoryId = categoryId;
    if (search) filter.$text = { $search: String(search) };
    if (minPrice || maxPrice) {
      filter.basePrice = {};
      if (minPrice) filter.basePrice.$gte = Number(minPrice);
      if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .populate("categoryId", "name slug")
        .populate("sellerId", "firstName lastName email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// ── Get product by ID ───────────────────────────────────────────────────────
export const adminGetProductById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate("categoryId", "name slug")
      .populate("sellerId", "firstName lastName email");

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// ── Update product status (admin override) ──────────────────────────────────
export const adminUpdateProductStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ["draft", "active", "out_of_stock", "banned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      message: "Product status updated",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete product (admin override) ─────────────────────────────────────────
export const adminDeleteProduct = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// ── Toggle product featured status ──────────────────────────────────────────
export const adminToggleFeatured = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    product.isFeatured = !product.isFeatured;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isFeatured ? "featured" : "unfeatured"} successfully`,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get dashboard stats ──────────────────────────────────────────────────────
export const adminGetDashboardStats = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const [totalProducts, activeProducts, outOfStockProducts, draftProducts, totalCategories] =
      await Promise.all([
        Product.countDocuments(),
        Product.countDocuments({ status: "active" }),
        Product.countDocuments({ status: "out_of_stock" }),
        Product.countDocuments({ status: "draft" }),
        Category.countDocuments(),
      ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        outOfStockProducts,
        draftProducts,
        totalCategories,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Admin CRUD for Categories ────────────────────────────────────────────────

export const adminGetAllCategories = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.find()
      .populate("parentCategoryId", "name slug")
      .sort({ displayOrder: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      categories,
      total: categories.length,
    });
  } catch (error) {
    next(error);
  }
};

export const adminCreateCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, slug, description, parentCategoryId, image, displayOrder, isActive } = req.body;

    if (!name || !slug) {
      return res.status(400).json({ success: false, message: "Name and slug are required" });
    }

    // Check for duplicates
    const existing = await Category.findOne({ $or: [{ name }, { slug }] });
    if (existing) {
      return res.status(409).json({ success: false, message: "Category with this name or slug already exists" });
    }

    const level = parentCategoryId ? 1 : 0;

    const category = await Category.create({
      name,
      slug,
      description,
      parentCategoryId: parentCategoryId || null,
      level,
      image,
      displayOrder: displayOrder || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const category = await Category.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Check if category has products
    const productCount = await Product.countDocuments({ categoryId: id });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${productCount} products assigned to it.`,
      });
    }

    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.status(200).json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    next(error);
  }
};

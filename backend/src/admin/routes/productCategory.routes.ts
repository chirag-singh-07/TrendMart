import { Router } from "express";
import {
  adminGetAllProducts,
  adminGetProductById,
  adminUpdateProductStatus,
  adminDeleteProduct,
  adminToggleFeatured,
  adminGetDashboardStats,
  adminGetAllCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from "../controllers/productCategoryController.js";
import { verifyAdminToken } from "../middlewares/adminAuth.middleware.js";

const router = Router();

// All routes require admin auth
router.use(verifyAdminToken);

// Dashboard
router.get("/stats", adminGetDashboardStats);

// Products
router.get("/products", adminGetAllProducts);
router.get("/products/:id", adminGetProductById);
router.patch("/products/:id/status", adminUpdateProductStatus);
router.patch("/products/:id/featured", adminToggleFeatured);
router.delete("/products/:id", adminDeleteProduct);

// Categories
router.get("/categories", adminGetAllCategories);
router.post("/categories", adminCreateCategory);
router.patch("/categories/:id", adminUpdateCategory);
router.delete("/categories/:id", adminDeleteCategory);

export default router;

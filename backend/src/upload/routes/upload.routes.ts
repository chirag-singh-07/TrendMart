import { Router } from "express";
import { uploadController } from "../controllers/upload.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import {
  uploadAvatar,
  uploadProductImage,
  uploadBannerImage,
  uploadShopImage,
  uploadReviewImages,
  uploadDocument,
  uploadCategoryImage,
  handleMulterError,
} from "../middlewares/multer.middleware.js";

const router = Router();

// Protect all routes
router.use(authenticate);

// --- Avatar ---
// All roles (buyer, seller, admin)
router.post(
  "/avatar",
  uploadAvatar,
  handleMulterError,
  uploadController.uploadAvatar,
);

// --- Product Images ---
// Seller, Admin only
router.post(
  "/product-images",
  authorize("seller", "admin", "super_admin", "moderator"),
  uploadProductImage,
  handleMulterError,
  uploadController.uploadProductImages,
);

// --- Banner ---
// Admin only
router.post(
  "/banner",
  authorize("admin", "super_admin", "moderator"),
  uploadBannerImage,
  handleMulterError,
  uploadController.uploadBanner,
);

// --- Shop Image ---
// Seller, Admin only
router.post(
  "/shop-image",
  authorize("seller", "admin"),
  uploadShopImage,
  handleMulterError,
  uploadController.uploadShopImage,
);

// --- Review Images ---
// Buyer only
router.post(
  "/review-images",
  authorize("buyer"),
  uploadReviewImages,
  handleMulterError,
  uploadController.uploadReviewImages,
);

// --- Documents ---
// Seller, Admin only
router.post(
  "/document",
  authorize("seller", "admin"),
  uploadDocument,
  handleMulterError,
  uploadController.uploadDocument,
);

// --- Category Image ---
// Admin only
router.post(
  "/category",
  authorize("admin", "super_admin", "moderator"),
  uploadCategoryImage,
  handleMulterError,
  uploadController.uploadCategoryImage,
);

// --- Delete File ---
// Admin only
router.delete("/file", authorize("admin", "super_admin", "moderator"), uploadController.deleteFile);

export default router;

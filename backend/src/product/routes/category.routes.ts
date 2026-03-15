import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import {
  createCategorySchema,
  updateCategorySchema,
  reorderCategoriesSchema,
} from "../validators/category.validator.js";

const router = Router();

// Public routes
router.get("/", categoryController.getCategoryTree);
router.get("/:categoryId", categoryController.getCategoryById);

// Admin routes
router.use(authenticate, authorize("admin" as any));

router.get("/all", categoryController.getAllCategories);
router.post(
  "/",
  validateRequest(createCategorySchema),
  categoryController.createCategory,
);
router.patch(
  "/reorder",
  validateRequest(reorderCategoriesSchema),
  categoryController.reorderCategories,
);
router.patch(
  "/:categoryId",
  validateRequest(updateCategorySchema),
  categoryController.updateCategory,
);
router.delete("/:categoryId", categoryController.deleteCategory);

export default router;

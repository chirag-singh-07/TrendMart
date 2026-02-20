import { Router } from "express";
import { categoryController } from "../controllers/category.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
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
  validate(createCategorySchema),
  categoryController.createCategory,
);
router.patch(
  "/reorder",
  validate(reorderCategoriesSchema),
  categoryController.reorderCategories,
);
router.patch(
  "/:categoryId",
  validate(updateCategorySchema),
  categoryController.updateCategory,
);
router.delete("/:categoryId", categoryController.deleteCategory);

export default router;

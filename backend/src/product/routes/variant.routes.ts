import { Router } from "express";
import { variantController } from "../controllers/variant.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { isProductOwner } from "../middlewares/productOwner.middleware.js";
import {
  createVariantSchema,
  updateVariantSchema,
} from "../validators/variant.validator.js";

// Note: These routes are merged into /api/products/:productId/variants
const router = Router({ mergeParams: true });

// Public
router.get("/", variantController.getVariants);

// Protected (Seller who owns the product)
router.post(
  "/",
  authenticate,
  authorize("seller" as any),
  isProductOwner,
  validate(createVariantSchema),
  variantController.createVariant,
);
router.patch(
  "/:variantId",
  authenticate,
  authorize("seller" as any),
  isProductOwner,
  validate(updateVariantSchema),
  variantController.updateVariant,
);
router.delete(
  "/:variantId",
  authenticate,
  authorize("seller" as any),
  isProductOwner,
  variantController.deleteVariant,
);
router.patch(
  "/:variantId/set-default",
  authenticate,
  authorize("seller" as any),
  isProductOwner,
  variantController.setDefaultVariant,
);

export default router;

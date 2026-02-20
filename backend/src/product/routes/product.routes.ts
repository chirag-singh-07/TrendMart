import { Router } from "express";
import { productController } from "../controllers/product.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { authorize } from "../../auth/middlewares/authorize.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
import { isProductOwner } from "../middlewares/productOwner.middleware.js";
import {
  createProductSchema,
  updateProductSchema,
  productFiltersSchema,
  stockUpdateSchema,
} from "../validators/product.validator.js";

const router = Router();

// Public routes
router.get("/", validate(productFiltersSchema), productController.getProducts);
router.get("/search", productController.searchProducts);
router.get("/featured", productController.getFeaturedProducts);
router.get("/new-arrivals", productController.getNewArrivals);
router.get("/bestsellers", productController.getBestSellers);
router.get("/:productId", productController.getProductById);
router.get("/:productId/related", productController.getRelatedProducts);

// Seller routes
router.post(
  "/",
  authenticate,
  authorize("seller" as any),
  validate(createProductSchema),
  productController.createProduct,
);
router.get(
  "/seller/my-products",
  authenticate,
  authorize("seller" as any),
  validate(productFiltersSchema),
  productController.getSellerProducts,
);

// Mutation routes (require ownership)
router.patch(
  "/:productId",
  authenticate,
  authorize("seller" as any),
  isProductOwner,
  validate(updateProductSchema),
  productController.updateProduct,
);
router.delete(
  "/:productId",
  authenticate,
  authorize("seller" as any),
  isProductOwner,
  productController.deleteProduct,
);
router.patch(
  "/:productId/publish",
  authenticate,
  authorize("seller" as any),
  isProductOwner,
  productController.publishProduct,
);

// Stock updates (Seller or Admin)
router.patch(
  "/:productId/stock",
  authenticate,
  authorize("seller" as any, "admin" as any),
  validate(stockUpdateSchema),
  productController.updateStock,
);

export default router;

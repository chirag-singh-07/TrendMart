import { Router } from "express";
import { cartController } from "../controllers/cart.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import {
  addToCartSchema,
  updateCartItemSchema,
  removeCartItemSchema,
} from "../validators/cart.validator.js";

const router = Router();

// All cart routes require authentication
router.use(authenticate);

router.get("/", cartController.getCart);
router.post("/items", validateRequest(addToCartSchema), cartController.addToCart);
router.patch(
  "/items",
  validateRequest(updateCartItemSchema),
  cartController.updateCartItem,
);
router.delete(
  "/items",
  validateRequest(removeCartItemSchema),
  cartController.removeFromCart,
);
router.delete("/", cartController.clearCart);
router.post("/validate", cartController.validateCart);
router.post("/sync-prices", cartController.syncPrices);

export default router;

import { Router } from "express";
import { wishlistController } from "../controllers/wishlist.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { validateRequest } from "../../middleware/validate.middleware.js";
import {
  addToWishlistSchema,
  moveToCartSchema,
  removeFromWishlistSchema,
} from "../validators/wishlist.validator.js";

const router = Router();

// All wishlist routes require authentication
router.use(authenticate);

router.get("/", wishlistController.getWishlist);
router.post(
  "/items",
  validateRequest(addToWishlistSchema),
  wishlistController.addToWishlist,
);
router.delete(
  "/items/:productId",
  validateRequest(removeFromWishlistSchema),
  wishlistController.removeFromWishlist,
);
router.delete("/", wishlistController.clearWishlist);
router.get(
  "/check/:productId",
  validateRequest(removeFromWishlistSchema),
  wishlistController.checkWishlist,
); // Reuse schema for productId param
router.post(
  "/move-to-cart",
  validateRequest(moveToCartSchema),
  wishlistController.moveToCart,
);

export default router;

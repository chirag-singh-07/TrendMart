import { Router } from "express";
import { wishlistController } from "../controllers/wishlist.controller.js";
import { authenticate } from "../../auth/middlewares/authenticate.middleware.js";
import { validate } from "../../middleware/validate.middleware.js";
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
  validate(addToWishlistSchema),
  wishlistController.addToWishlist,
);
router.delete(
  "/items/:productId",
  validate(removeFromWishlistSchema),
  wishlistController.removeFromWishlist,
);
router.delete("/", wishlistController.clearWishlist);
router.get(
  "/check/:productId",
  validate(removeFromWishlistSchema),
  wishlistController.checkWishlist,
); // Reuse schema for productId param
router.post(
  "/move-to-cart",
  validate(moveToCartSchema),
  wishlistController.moveToCart,
);

export default router;

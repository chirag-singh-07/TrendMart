import Wishlist, { IWishlistDocument } from "../../models/Wishlist.model.js";
import Product from "../../product/models/product.model.js";
import { cartService } from "./cart.service.js";
import AppError from "../../utils/AppError.js";
import { IWishlistWithProducts } from "../types/cart.types.js";
import { IProduct } from "../../interfaces/index.js";

/**
 * Wishlist Service - Logic for users' saved/favorite items
 */
export const wishlistService = {
  /**
   * find wishlist by userId or create empty if not found
   */
  async getOrCreateWishlist(userId: string): Promise<IWishlistDocument> {
    let wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        products: [],
      });
    }
    return wishlist;
  },

  /**
   * Add a product to user's wishlist
   */
  async addToWishlist(
    userId: string,
    productId: string,
  ): Promise<IWishlistDocument> {
    const product = await Product.findById(productId);
    if (!product || product.status === "banned") {
      throw new AppError("Product not found or unavailable", 404);
    }

    const wishlist = await this.getOrCreateWishlist(userId);

    // Idempotent add
    if (!wishlist.products.includes(productId as any)) {
      wishlist.products.push(productId as any);
      await wishlist.save();
    }

    return wishlist;
  },

  /**
   * Remove a product from wishlist
   */
  async removeFromWishlist(
    userId: string,
    productId: string,
  ): Promise<IWishlistDocument> {
    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) throw new AppError("Wishlist not found", 404);

    wishlist.products = wishlist.products.filter(
      (id: any) => String(id) !== productId,
    ) as any;

    await wishlist.save();
    return wishlist;
  },

  /**
   * Fetch wishlist with full product details, filtering out banned items
   */
  async getWishlistWithProducts(
    userId: string,
  ): Promise<IWishlistWithProducts> {
    const wishlist = await Wishlist.findOne({ userId }).populate<{
      products: IProduct[];
    }>({
      path: "products",
      select:
        "title thumbnail basePrice salePrice averageRating status totalStock slug",
    });

    if (!wishlist) {
      return {
        _id: "",
        userId,
        products: [],
        totalItems: 0,
        createdAt: new Date(),
      };
    }

    // Filter out banned products
    const activeProducts = wishlist.products.filter(
      (p: any) => p && p.status !== "banned",
    );

    return {
      _id: String(wishlist._id),
      userId: String(wishlist.userId),
      products: activeProducts,
      totalItems: activeProducts.length,
      createdAt: (wishlist as any).createdAt,
    };
  },

  /**
   * Helper to check if a product is already wishlisted
   */
  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlist = await Wishlist.findOne({
      userId,
      products: productId,
    });
    return !!wishlist;
  },

  /**
   * Atomic-like move from wishlist to cart
   */
  async moveToCart(
    userId: string,
    productId: string,
  ): Promise<{ cart: any; wishlist: any }> {
    // Attempt add to cart first
    const cart = await cartService.addToCart(userId, {
      productId,
      quantity: 1,
    });

    // If add to cart succeeds, remove from wishlist
    const wishlist = await this.removeFromWishlist(userId, productId);

    return { cart, wishlist };
  },

  /**
   * Wipe wishlist
   */
  async clearWishlist(userId: string): Promise<void> {
    const wishlist = await this.getOrCreateWishlist(userId);
    wishlist.products = [];
    await wishlist.save();
  },
};

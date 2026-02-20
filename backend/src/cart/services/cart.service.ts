import { ICart, ICartItem } from "../../interfaces/index.js";
import Cart, { ICartDocument } from "../../models/Cart.model.js";
import Product from "../../product/models/product.model.js";
import ProductVariant from "../../product/models/variant.model.js";
import {
  IAddToCartPayload,
  ICartItemDetail,
  ICartSummary,
  IRemoveCartItemPayload,
  IUpdateCartItemPayload,
} from "../types/cart.types.js";
import { cartPriceService } from "./cartPrice.service.js";
import AppError from "../../utils/AppError.js";

/**
 * Cart Service - Core business logic for shopping cart
 */
export const cartService = {
  /**
   * find cart by userId or create empty cart if not found
   */
  async getOrCreateCart(userId: string): Promise<ICartDocument> {
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [],
        totalItems: 0,
        totalAmount: 0,
      });
    }
    return cart;
  },

  /**
   * add product or variant to user's cart
   */
  async addToCart(
    userId: string,
    payload: IAddToCartPayload,
  ): Promise<ICartDocument> {
    const { productId, variantId, quantity } = payload;
    const cart = await this.getOrCreateCart(userId);

    const product = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);
    if (product.status !== "active")
      throw new AppError("Product is not available", 400);

    let priceSnapshot;
    let finalQuantity = quantity;

    if (variantId) {
      const variant = await ProductVariant.findById(variantId);
      if (!variant) throw new AppError("Variant not found", 404);
      if (String(variant.productId) !== productId) {
        throw new AppError("Invalid variant for this product", 400);
      }
      if (variant.stock < quantity) {
        throw new AppError(
          `Insufficient stock. Only ${variant.stock} items available`,
          400,
        );
      }
      priceSnapshot = cartPriceService.buildPriceSnapshot(product, variant);
    } else {
      if (product.totalStock < quantity) {
        throw new AppError(
          `Insufficient stock. Only ${product.totalStock} items available`,
          400,
        );
      }
      priceSnapshot = cartPriceService.buildPriceSnapshot(product);
    }

    // Check if item already exists
    const existingIndex = cart.items.findIndex(
      (item: ICartItem) =>
        String(item.productId) === productId &&
        String(item.variantId || "") === (variantId || ""),
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + quantity;
      // Cap at available stock
      const stockLimit = variantId
        ? (await ProductVariant.findById(variantId))?.stock || 0
        : product.totalStock;

      cart.items[existingIndex].quantity = Math.min(newQty, stockLimit);
      cart.items[existingIndex].priceSnapshot = priceSnapshot;
    } else {
      cart.items.push({
        productId: productId as any,
        variantId: variantId as any,
        quantity,
        priceSnapshot,
      });
    }

    cart.recalculateTotals();
    return await cart.save();
  },

  /**
   * Update quantity of an existing cart item
   */
  async updateCartItem(
    userId: string,
    payload: IUpdateCartItemPayload,
  ): Promise<ICartDocument> {
    const { productId, variantId, quantity } = payload;
    if (quantity <= 0)
      return await this.removeCartItem(userId, { productId, variantId });

    const cart = await Cart.findOne({ userId });
    if (!cart) throw new AppError("Cart not found", 404);

    const itemIndex = cart.items.findIndex(
      (item: ICartItem) =>
        String(item.productId) === productId &&
        String(item.variantId || "") === (variantId || ""),
    );

    if (itemIndex === -1) throw new AppError("Item not found in cart", 404);

    // Re-validate stock and refresh price
    const product = await Product.findById(productId);
    if (!product || product.status !== "active")
      throw new AppError("Product is no longer available", 400);

    if (variantId) {
      const variant = await ProductVariant.findById(variantId);
      if (!variant) throw new AppError("Variant not found", 404);
      if (variant.stock < quantity)
        throw new AppError(
          `Insufficient stock. Only ${variant.stock} available`,
          400,
        );
      cart.items[itemIndex].priceSnapshot = cartPriceService.buildPriceSnapshot(
        product,
        variant,
      );
    } else {
      if (product.totalStock < quantity)
        throw new AppError(
          `Insufficient stock. Only ${product.totalStock} available`,
          400,
        );
      cart.items[itemIndex].priceSnapshot =
        cartPriceService.buildPriceSnapshot(product);
    }

    cart.items[itemIndex].quantity = quantity;
    cart.recalculateTotals();
    return await cart.save();
  },

  /**
   * remove specific item from cart
   */
  async removeCartItem(
    userId: string,
    payload: IRemoveCartItemPayload,
  ): Promise<ICartDocument> {
    const { productId, variantId } = payload;
    const cart = await Cart.findOne({ userId });
    if (!cart) throw new AppError("Cart not found", 404);

    cart.items = cart.items.filter(
      (item: ICartItem) =>
        !(
          String(item.productId) === productId &&
          String(item.variantId || "") === (variantId || "")
        ),
    ) as any;

    cart.recalculateTotals();
    return await cart.save();
  },

  /**
   * Wipe all items from user's cart
   */
  async clearCart(userId: string): Promise<void> {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [];
    cart.totalItems = 0;
    cart.totalAmount = 0;
    await cart.save();
  },

  /**
   * Fetch cart with fully populated product/variant details
   */
  async getCartWithDetails(userId: string): Promise<ICartSummary> {
    const cart = await this.getOrCreateCart(userId);

    // We populate manually to have more control over the summary format
    const itemDetails: ICartItemDetail[] = await Promise.all(
      cart.items.map(async (item: ICartItem) => {
        const product = await Product.findById(item.productId);
        const variant = item.variantId
          ? await ProductVariant.findById(item.variantId)
          : null;

        const isAvailable = !!(
          product &&
          product.status === "active" &&
          (variant ? variant.stock > 0 : product.totalStock > 0)
        );

        const currentSnapshot = product
          ? cartPriceService.buildPriceSnapshot(product, variant as any)
          : item.priceSnapshot;

        const unitPrice = cartPriceService.getEffectivePrice(
          item.priceSnapshot,
        );

        return {
          productId: String(item.productId),
          variantId: item.variantId ? String(item.variantId) : undefined,
          title: product?.title || "Unknown Product",
          thumbnail: product?.thumbnail || "",
          variantName: variant?.variantName,
          quantity: item.quantity,
          unitPrice,
          totalPrice: unitPrice * item.quantity,
          priceSnapshot: item.priceSnapshot,
          stock: variant ? variant.stock : product?.totalStock || 0,
          isAvailable,
        };
      }),
    );

    return {
      totalItems: cart.totalItems,
      totalAmount: cart.totalAmount,
      currency: itemDetails[0]?.priceSnapshot.currency || "INR",
      items: itemDetails,
    };
  },

  /**
   * Business rule check before moving to Order phase
   */
  async validateCartForCheckout(
    userId: string,
  ): Promise<{ valid: boolean; issues: string[] }> {
    const summary = await this.getCartWithDetails(userId);
    const issues: string[] = [];

    if (summary.items.length === 0) {
      throw new AppError("Your cart is empty", 400);
    }

    for (const item of summary.items) {
      const product = await Product.findById(item.productId);
      if (!product || product.status !== "active") {
        issues.push(`Product "${item.title}" is no longer available.`);
        continue;
      }

      const variant = item.variantId
        ? await ProductVariant.findById(item.variantId)
        : null;
      const currentStock = variant ? variant.stock : product.totalStock;

      if (currentStock < item.quantity) {
        issues.push(
          `Insufficient stock for "${item.title}". Requested: ${item.quantity}, Available: ${currentStock}`,
        );
      }

      const currentPriceSnapshot = cartPriceService.buildPriceSnapshot(
        product,
        variant as any,
      );
      if (
        cartPriceService.isPriceChangedSignificantly(
          item.priceSnapshot,
          currentPriceSnapshot,
        )
      ) {
        issues.push(
          `Price for "${item.title}" has updated significantly since you added it.`,
        );
      }
    }

    return {
      valid: issues.length === 0,
      issues,
    };
  },

  /**
   * Refreshes all prices in the cart to current market prices
   */
  async syncCartPrices(userId: string): Promise<ICartDocument> {
    const cart = await this.getOrCreateCart(userId);

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (product) {
        const variant = item.variantId
          ? await ProductVariant.findById(item.variantId)
          : null;
        item.priceSnapshot = cartPriceService.buildPriceSnapshot(
          product,
          variant as any,
        );
      }
    }

    cart.recalculateTotals();
    return await cart.save();
  },
};

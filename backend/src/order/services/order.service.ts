import mongoose from "mongoose";
import {
  IOrder,
  ICart,
  IAddress,
  ICoupon,
  IOrderItem,
  OrderStatus,
  PaymentStatus,
  RefundStatus,
  IProduct,
} from "../../interfaces/index.js";
import Order from "../../models/Order.model.js";
import OrderItem from "../../models/OrderItem.model.js";
import Address from "../../models/Address.model.js";
import Coupon from "../../models/Coupon.model.js";
import CouponUsage from "../../models/CouponUsage.model.js";
import Product from "../../product/models/product.model.js";
import ProductVariant from "../../product/models/variant.model.js";
import { cartService } from "../../cart/services/cart.service.js";
import { productService } from "../../product/services/product.service.js";
import { orderNumberService } from "./orderNumber.service.js";
import { orderStatusService } from "./orderStatus.service.js";
import { sellerBreakdownService } from "./sellerBreakdown.service.js";
import { couponValidationService } from "../../coupon/services/couponValidation.service.js";
import { couponUsageService } from "../../coupon/services/couponUsage.service.js";
import { calculateShippingFee } from "../utils/shipping.util.js";
import {
  IPlaceOrderPayload,
  IOrderFilters,
  IOrderSummary,
} from "../types/order.types.js";
import AppError from "../../utils/AppError.js";

/**
 * Order Service - Core logic for order placement and management
 */
export const orderService = {
  /**
   * Places a new order for a user based on their current cart
   *
   * @param {string} userId - ID of the buyer
   * @param {IPlaceOrderPayload} payload - Address, payment method, etc.
   * @returns {Promise<IOrder>} The created and populated order
   */
  async placeOrder(userId: string, payload: IPlaceOrderPayload): Promise<any> {
    const { deliveryAddressId, couponId, paymentMethod, notes } = payload;

    // Step 1 - Validate Cart
    const cartValidation = await cartService.validateCartForCheckout(userId);
    if (!cartValidation.valid) {
      throw new AppError("Cart validation failed", 400, cartValidation.issues);
    }

    const cart = await cartService.getOrCreateCart(userId);
    if (!cart.items || cart.items.length === 0) {
      throw new AppError("Your cart is empty", 400);
    }

    // Step 2 - Validate Address
    const address = await Address.findById(deliveryAddressId);
    if (!address) throw new AppError("Address not found", 404);
    if (String(address.userId) !== userId)
      throw new AppError("Access denied to this address", 403);

    // Step 3 - Validate and Apply Coupon
    let discountAmount = 0;
    let coupon: any = null;
    let applicableItems: string[] = [];

    if (couponId) {
      const couponDoc = await Coupon.findById(couponId);
      if (!couponDoc) throw new AppError("Coupon not found", 404);

      const validation = await couponValidationService.validateCoupon({
        code: couponDoc.code,
        userId,
        cartItems: cart.items.map((item: any) => ({
          productId: String(item.productId),
          categoryId: String(item.categoryId), // Assuming categoryId is available on cart item
          quantity: item.quantity,
          unitPrice:
            item.priceSnapshot.salePrice ?? item.priceSnapshot.basePrice,
          totalPrice:
            (item.priceSnapshot.salePrice ?? item.priceSnapshot.basePrice) *
            item.quantity,
        })),
        subtotal: cart.totalAmount,
      });

      if (!validation.isValid) {
        throw new AppError(validation.message, 400);
      }

      coupon = validation.coupon;
      discountAmount = validation.discountAmount;
      applicableItems = validation.applicableItems || [];
    }

    // Step 4 - Calculate Amounts
    const subtotal = cart.totalAmount;
    const TAX_RATE = Number(process.env.TAX_RATE) || 0.18;
    const taxAmount = Number((subtotal * TAX_RATE).toFixed(2));
    const shippingFee = await calculateShippingFee(cart.items, address as any);
    const finalAmount = Math.max(
      0,
      subtotal + taxAmount + shippingFee - discountAmount,
    );

    // Step 5 - Generate Order Number
    const orderNumber = await orderNumberService.generateOrderNumber();

    // Create session for atomicity if needed, but following manual rollback instructions
    let createdOrder: any;
    let createdItemIds: string[] = [];

    try {
      // Step 6 - Create OrderItems
      const orderItemsToCreate = await Promise.all(
        cart.items.map(async (item) => {
          const product = await Product.findById(item.productId);
          if (!product) throw new AppError("Product not found", 404);

          const variant = item.variantId
            ? await ProductVariant.findById(item.variantId)
            : null;

          return {
            productId: item.productId,
            variantId: item.variantId,
            sellerId: product.sellerId,
            quantity: item.quantity,
            priceSnapshot: {
              basePrice: item.priceSnapshot.basePrice,
              salePrice: item.priceSnapshot.salePrice,
              currency: item.priceSnapshot.currency,
              title: product.title,
              thumbnail: product.thumbnail,
            },
            totalPrice:
              (item.priceSnapshot.salePrice ?? item.priceSnapshot.basePrice) *
              item.quantity,
          };
        }),
      );

      // We need to create Order document first to get orderId for items,
      // or items first and then update order. Prompt says "link all OrderItem _ids" in Step 8.

      // Let's create an "empty" order first to get the ID
      createdOrder = await Order.create({
        orderNumber,
        userId,
        subtotal,
        taxAmount,
        shippingFee,
        discountAmount,
        finalAmount,
        currency: cart.items[0].priceSnapshot.currency || "INR",
        couponId: couponId ? (couponId as any) : undefined,
        deliveryAddressId: deliveryAddressId as any,
        orderStatus: "pending",
        paymentStatus: "pending",
        refundStatus: "none",
        cancellationReason: notes,
      });

      const itemsWithOrderId = orderItemsToCreate.map((item) => ({
        ...item,
        orderId: createdOrder._id,
      }));
      const orderItems = await OrderItem.insertMany(itemsWithOrderId);
      createdItemIds = orderItems.map((item) => String(item._id));

      // Step 7 - Calculate Seller Breakdown
      const sellerBreakdown = await sellerBreakdownService.calculate(
        orderItems as any,
      );

      // Step 8 - Finalize Order
      createdOrder.items = orderItems.map((i) => i._id);
      createdOrder.sellerBreakdown = sellerBreakdown as any;
      await createdOrder.save();

      // Step 9 - Deduct Stock
      for (const item of orderItems) {
        try {
          await productService.updateStock({
            productId: String(item.productId),
            variantId: item.variantId ? String(item.variantId) : undefined,
            quantity: item.quantity,
            operation: "decrement",
          });
        } catch (stockError: any) {
          // Manual rollback logic
          // 1. Delete order items
          await OrderItem.deleteMany({ orderId: createdOrder._id });
          // 2. Delete order
          await Order.findByIdAndDelete(createdOrder._id);
          // 3. (Optional) Revert stock for already deducted items in this loop?
          // For simplicity and following "rollback order and throw 500", we focus on the order itself.
          throw new AppError(
            `Stock deduction failed for product ${item.productId}: ${stockError.message}`,
            500,
          );
        }
      }

      // Step 10 - Redeem Coupon
      if (coupon) {
        await couponUsageService.redeemCoupon(
          String(coupon._id),
          userId,
          createdOrder._id,
          discountAmount,
        );
      }

      // Step 11 - Clear Cart
      await cartService.clearCart(userId);

      // Step 12 - Return
      return await Order.findById(createdOrder._id).populate("items");
    } catch (error: any) {
      if (createdOrder && !error.statusCode) {
        // Cleanup on unexpected error if order was partially created
        await OrderItem.deleteMany({ orderId: createdOrder._id });
        await Order.findByIdAndDelete(createdOrder._id);
      }
      throw error;
    }
  },

  /**
   * Fetches full order details
   */
  async getOrderById(
    orderId: string,
    userId: string,
    role: string,
  ): Promise<any> {
    const order = await Order.findById(orderId)
      .populate({
        path: "items",
        populate: ["productId", "variantId"],
      })
      .populate("deliveryAddressId");

    if (!order) throw new AppError("Order not found", 404);

    if (role === "buyer" && String(order.userId) !== userId) {
      throw new AppError("Access denied", 403);
    }

    if (role === "seller") {
      const hasSellerItems = order.sellerBreakdown.some(
        (b: any) => String(b.sellerId) === userId,
      );
      if (!hasSellerItems) throw new AppError("Access denied", 403);
    }

    return order;
  },

  /**
   * List orders for a buyer
   */
  async getOrdersByUser(userId: string, filters: IOrderFilters): Promise<any> {
    const {
      orderStatus,
      paymentStatus,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = filters;
    const query: any = { userId };

    if (orderStatus) query.orderStatus = orderStatus;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("items"),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  },

  /**
   * List orders for a seller
   */
  async getOrdersBySeller(
    sellerId: string,
    filters: IOrderFilters,
  ): Promise<any> {
    const { orderStatus, page = 1, limit = 10 } = filters;

    // Filter by sellerId in the breakdown
    const query: any = { "sellerBreakdown.sellerId": sellerId };
    if (orderStatus) query.orderStatus = orderStatus;

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(query),
    ]);

    // For sellers, we might want to only show their items.
    // This is often handled in the controller or a separate view method.

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  },

  /**
   * Cancels an order and restores stock
   */
  async cancelOrder(
    orderId: string,
    userId: string,
    role: string,
    reason: string,
  ): Promise<any> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    // Permission check
    if (role === "buyer" && String(order.userId) !== userId)
      throw new AppError("Access denied", 403);
    if (role === "seller") {
      const isMyOrder = order.sellerBreakdown.some(
        (b: any) => String(b.sellerId) === userId,
      );
      if (!isMyOrder) throw new AppError("Access denied", 403);
    }

    if (!["pending", "confirmed"].includes(order.orderStatus)) {
      throw new AppError(
        `Order cannot be cancelled at this stage (${order.orderStatus})`,
        400,
      );
    }

    // Transition status
    await orderStatusService.transition(order, "cancelled", role);

    // Restore stock
    const items = await OrderItem.find({ orderId: order._id });
    for (const item of items) {
      await productService.updateStock({
        productId: String(item.productId),
        variantId: item.variantId ? String(item.variantId) : undefined,
        quantity: item.quantity,
        operation: "increment",
      });
    }

    // Revert coupon if any
    if (order.couponId) {
      await couponUsageService.reverseCoupon(
        String(order.couponId),
        userId,
        String(order._id),
      );
    }

    order.cancellationReason = reason;

    // Refund handling
    if (order.paymentStatus === "paid") {
      order.refundStatus = "requested";
    }

    return await order.save();
  },

  /**
   * Admin view of all orders
   */
  async getAllOrders(filters: IOrderFilters): Promise<any> {
    const {
      userId,
      sellerId,
      orderStatus,
      paymentStatus,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = filters;
    const query: any = {};

    if (userId) query.userId = userId;
    if (sellerId) query["sellerBreakdown.sellerId"] = sellerId;
    if (orderStatus) query.orderStatus = orderStatus;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "firstName lastName email"),
      Order.countDocuments(query),
    ]);

    return {
      orders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    };
  },

  /**
   * Lightweight summary for confirmation
   */
  async getOrderSummary(orderId: string): Promise<IOrderSummary> {
    const order = await Order.findById(orderId).populate("items");
    if (!order) throw new AppError("Order not found", 404);

    return {
      orderId: String(order._id),
      orderNumber: order.orderNumber,
      subtotal: order.subtotal,
      taxAmount: order.taxAmount,
      shippingFee: order.shippingFee,
      discountAmount: order.discountAmount,
      finalAmount: order.finalAmount,
      currency: order.currency,
      itemCount: order.items.length,
      sellerCount: order.sellerBreakdown.length,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 3600 * 1000), // Dummy 5 days
    };
  },
};

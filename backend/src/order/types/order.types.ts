import {
  IOrder,
  OrderStatus,
  PaymentStatus,
  RefundStatus,
} from "../../interfaces/index.js";

/**
 * Payload for placing a new order
 */
export interface IPlaceOrderPayload {
  deliveryAddressId: string;
  couponId?: string;
  paymentMethod: string; // passed to Payment service later
  notes?: string;
}

/**
 * Lightweight order summary for confirmation pages
 */
export interface IOrderSummary {
  orderId: string;
  orderNumber: string;
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  itemCount: number;
  sellerCount: number;
  estimatedDelivery?: Date;
}

/**
 * Filters for querying orders
 */
export interface IOrderFilters {
  userId?: string;
  sellerId?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: PaymentStatus;
  refundStatus?: RefundStatus;
  fromDate?: string | Date;
  toDate?: string | Date;
  page?: number;
  limit?: number;
}

/**
 * Defines a valid order status transition
 */
export interface IStatusTransition {
  from: OrderStatus;
  to: OrderStatus;
  allowedRoles: string[];
}

/**
 * Payload for requesting a refund
 */
export interface IRefundRequestPayload {
  orderId: string;
  reason: string;
  items?: string[]; // specific orderItem ids, empty = full order refund
}

/**
 * Summary of orders for a specific seller
 */
export interface ISellerOrderSummary {
  sellerId: string;
  orders: IOrder[];
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
}

/**
 * Standard paginated result wrapper
 */
export interface IPaginatedResult<T> {
  success: boolean;
  message: string;
  data: {
    [key: string]: T[] | number | boolean;
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

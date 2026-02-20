import { OrderStatus, IOrder } from "../../interfaces/index.js";
import { IStatusTransition } from "../types/order.types.js";
import Order from "../../models/Order.model.js";
import AppError from "../../utils/AppError.js";

const STATUS_TRANSITIONS: IStatusTransition[] = [
  { from: "pending", to: "confirmed", allowedRoles: ["admin", "seller"] },
  { from: "confirmed", to: "processing", allowedRoles: ["admin", "seller"] },
  { from: "processing", to: "shipped", allowedRoles: ["admin", "seller"] },
  { from: "shipped", to: "delivered", allowedRoles: ["admin"] },
  {
    from: "pending",
    to: "cancelled",
    allowedRoles: ["admin", "buyer", "seller"],
  },
  {
    from: "confirmed",
    to: "cancelled",
    allowedRoles: ["admin", "buyer", "seller"],
  },
  { from: "delivered", to: "returned", allowedRoles: ["admin", "buyer"] },
];

/**
 * Service for managing order status life-cycles and transitions
 */
export const orderStatusService = {
  /**
   * Transitions an order to a new status if the move is valid and the role is allowed
   *
   * @param {IOrder} order - The order document
   * @param {OrderStatus} newStatus - Target status
   * @param {string} role - Role of the user attempting the transition
   * @returns {Promise<IOrder>} Updated order document
   */
  async transition(
    order: any,
    newStatus: OrderStatus,
    role: string,
  ): Promise<any> {
    const currentStatus = order.orderStatus;

    // Find matching transition rule
    const validTransition = STATUS_TRANSITIONS.find(
      (t) => t.from === currentStatus && t.to === newStatus,
    );

    if (!validTransition) {
      throw new AppError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        400,
      );
    }

    if (!validTransition.allowedRoles.includes(role)) {
      throw new AppError(
        "You do not have permission to perform this status transition",
        403,
      );
    }

    order.orderStatus = newStatus;
    return await order.save();
  },

  /**
   * Returns list of possible statuses an order can move to from its current state
   */
  getAvailableTransitions(
    currentStatus: OrderStatus,
    role: string,
  ): OrderStatus[] {
    return STATUS_TRANSITIONS.filter(
      (t) => t.from === currentStatus && t.allowedRoles.includes(role),
    ).map((t) => t.to);
  },

  /**
   * High-level method to update an order's status by ID
   */
  async updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    role: string,
  ): Promise<any> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    return await this.transition(order, newStatus, role);
  },
};

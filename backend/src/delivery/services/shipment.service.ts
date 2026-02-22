import { v4 as uuidv4 } from "uuid";
import Shipment from "../../models/Shipment.model.js";
import Order from "../../models/Order.model.js";
import DeliveryPartner from "../../models/DeliveryPartner.model.js";
import { IShipment, ShipmentStatus } from "../../interfaces/index.js";
import {
  ICreateShipmentPayload,
  IShipmentFilters,
  IStatusHistoryEntry,
} from "../types/delivery.types.js";
import { assignmentService } from "./assignment.service.js";
import { etaService } from "./eta.service.js";
import AppError from "../../utils/AppError.js";
import { getRedisClient } from "../../config/redis.js";

const redis = getRedisClient();

/**
 * Shipment Service - Manages the complete lifecycle of a shipping package.
 */
export const shipmentService = {
  /**
   * Create a new shipment for an order.
   */
  async createShipment(
    payload: ICreateShipmentPayload,
    adminId: string,
  ): Promise<IShipment> {
    const order = await Order.findById(payload.orderId);
    if (!order) throw new AppError("Order not found", 404);

    if (!["confirmed", "processing"].includes(order.orderStatus)) {
      throw new AppError(
        "Order must be confirmed or processing to create shipment",
        400,
      );
    }

    const existing = await Shipment.findOne({
      orderId: payload.orderId,
      sellerId: payload.sellerId,
    });
    if (existing)
      throw new AppError("Shipment already exists for this order/seller", 409);

    const trackingNumber = `TRK-${uuidv4().split("-")[0].toUpperCase()}`;
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:3000";

    let deliveryPartnerId = payload.deliveryPartnerId;
    if (!deliveryPartnerId) {
      const assignment = await assignmentService.autoAssign(
        payload.orderId,
        payload.sellerId,
      );
      deliveryPartnerId = assignment.deliveryPartnerId;
    }

    const shipment = await Shipment.create({
      orderId: payload.orderId,
      sellerId: payload.sellerId,
      deliveryPartnerId,
      trackingNumber,
      trackingUrl: `${baseUrl}/track/${trackingNumber}`,
      shipmentStatus: "pending",
      statusHistory: [
        {
          status: "pending",
          timestamp: new Date(),
          note: "Shipment created and pending pickup",
          updatedBy: adminId,
        },
      ],
    });

    // Update partner
    await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, {
      $push: { assignedOrders: shipment._id },
    });

    return shipment;
  },

  /**
   * Update shipment status with transition validation.
   */
  async updateShipmentStatus(
    shipmentId: string,
    newStatus: ShipmentStatus,
    updatedBy: string,
    note?: string,
  ): Promise<IShipment> {
    const shipment: any = await Shipment.findById(shipmentId);
    if (!shipment) throw new AppError("Shipment not found", 404);

    const currentStatus = shipment.shipmentStatus;

    // Status transition validation
    const allowedTransitions: Record<string, string[]> = {
      pending: ["packed", "returned"],
      packed: ["picked_up", "returned"],
      picked_up: ["in_transit"],
      in_transit: ["out_for_delivery"],
      out_for_delivery: ["delivered", "failed_delivery"],
      failed_delivery: ["out_for_delivery", "returned"],
    };

    if (
      currentStatus !== newStatus &&
      (!allowedTransitions[currentStatus] ||
        !allowedTransitions[currentStatus].includes(newStatus))
    ) {
      throw new AppError(
        `Invalid status transition from ${currentStatus} to ${newStatus}`,
        400,
      );
    }

    shipment.shipmentStatus = newStatus;
    shipment.statusHistory.push({
      status: newStatus,
      timestamp: new Date(),
      note: note || `Status updated to ${newStatus}`,
      updatedBy,
    });

    // Handle timestamps
    if (newStatus === "picked_up") shipment.shippedAt = new Date();
    if (newStatus === "out_for_delivery")
      shipment.outForDeliveryAt = new Date();
    if (newStatus === "delivered") {
      shipment.deliveredAt = new Date();

      // Update Order
      await Order.findByIdAndUpdate(shipment.orderId, {
        orderStatus: "delivered",
      });

      // Update Partner
      if (shipment.deliveryPartnerId) {
        const partner = await DeliveryPartner.findById(
          shipment.deliveryPartnerId,
        );
        if (partner) {
          await DeliveryPartner.findByIdAndUpdate(shipment.deliveryPartnerId, {
            $pull: { assignedOrders: shipment._id },
            $set: {
              availabilityStatus:
                partner.assignedOrders.length <= 1
                  ? "available"
                  : partner.availabilityStatus,
            },
          });
        }
      }
    }

    await shipment.save();

    // Invalidate caches
    await redis.del(`cache:tracking:${shipment.trackingNumber}`);
    await etaService.recalculateETA(shipmentId);

    // Placeholder for status event
    console.log(`[EVENT] shipmentStatusUpdate: ${shipmentId} -> ${newStatus}`);

    return shipment;
  },

  /**
   * Assign a specific delivery partner to a shipment.
   */
  async assignDeliveryPartner(
    shipmentId: string,
    deliveryPartnerId: string,
    adminId: string,
  ): Promise<IShipment> {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) throw new AppError("Shipment not found", 404);

    const partner = await DeliveryPartner.findById(deliveryPartnerId);
    if (!partner || partner.availabilityStatus === "offline") {
      throw new AppError("Delivery partner is not available", 400);
    }

    shipment.deliveryPartnerId = partner._id;
    await shipment.save();

    await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, {
      $push: { assignedOrders: shipment._id },
      $set: {
        availabilityStatus:
          partner.assignedOrders.length >= 2 ? "busy" : "available",
      },
    });

    return shipment;
  },

  /**
   * Get shipment by Order ID.
   */
  async getShipmentByOrder(
    orderId: string,
    sellerId?: string,
  ): Promise<IShipment | null> {
    const query: any = { orderId };
    if (sellerId) query.sellerId = sellerId;
    return Shipment.findOne(query).populate("deliveryPartnerId");
  },

  /**
   * Get shipment by ID.
   */
  async getShipmentById(id: string): Promise<IShipment | null> {
    return Shipment.findById(id).populate("deliveryPartnerId");
  },

  /**
   * Get shipment by filter.
   */
  async getShipmentsByFilter(filters: IShipmentFilters): Promise<any> {
    const {
      sellerId,
      deliveryPartnerId,
      shipmentStatus,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
    } = filters;

    const query: any = {};
    if (sellerId) query.sellerId = sellerId;
    if (deliveryPartnerId) query.deliveryPartnerId = deliveryPartnerId;
    if (shipmentStatus) query.shipmentStatus = shipmentStatus;
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) query.createdAt.$lte = new Date(toDate);
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      Shipment.find(query)
        .populate("deliveryPartnerId")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Shipment.countDocuments(query),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  },

  /**
   * Cancel shipment before pickup.
   */
  async cancelShipment(
    shipmentId: string,
    reason: string,
    adminId: string,
  ): Promise<IShipment> {
    const shipment: any = await Shipment.findById(shipmentId);
    if (!shipment) throw new AppError("Shipment not found", 404);

    if (
      ["picked_up", "in_transit", "out_for_delivery", "delivered"].includes(
        shipment.shipmentStatus,
      )
    ) {
      throw new AppError(
        "Cannot cancel shipment after it has been picked up",
        400,
      );
    }

    shipment.shipmentStatus = "returned";
    shipment.statusHistory.push({
      status: "returned",
      timestamp: new Date(),
      note: `Cancelled by admin: ${reason}`,
      updatedBy: adminId,
    });

    if (shipment.deliveryPartnerId) {
      await DeliveryPartner.findByIdAndUpdate(shipment.deliveryPartnerId, {
        $pull: { assignedOrders: shipment._id },
      });
    }

    await shipment.save();
    return shipment;
  },
};

import Order from "../../models/Order.model.js";
import Address from "../../models/Address.model.js";
import Shipment from "../../models/Shipment.model.js";
import DeliveryPartner from "../../models/DeliveryPartner.model.js";
import { deliveryPartnerService } from "./deliveryPartner.service.js";
import { shipmentService } from "./shipment.service.js";
import { calculateDistance, sortByDistance } from "../utils/distance.util.js";
import { IAssignmentResult } from "../types/delivery.types.js";
import AppError from "../../utils/AppError.js";

/**
 * Assignment Service - Handles matching shipments to delivery partners.
 */
export const assignmentService = {
  /**
   * Automatically assign a partner based on distance.
   */
  async autoAssign(
    orderId: string,
    sellerId: string,
  ): Promise<IAssignmentResult> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    const deliveryAddress = await Address.findById(order.deliveryAddressId);
    if (!deliveryAddress || !deliveryAddress.latitude) {
      throw new AppError("No location coordinates on delivery address", 400);
    }

    const availablePartners =
      await deliveryPartnerService.getAvailablePartners();
    if (availablePartners.length === 0) {
      throw new AppError(
        "No delivery partners available. Please assign manually.",
        503,
      );
    }

    const sortedPartners = sortByDistance(
      availablePartners,
      deliveryAddress.latitude,
      deliveryAddress.longitude,
    );

    const pickedPartner = sortedPartners[0];
    const distanceKm = calculateDistance(
      deliveryAddress.latitude,
      deliveryAddress.longitude,
      pickedPartner.currentLocation!.latitude,
      pickedPartner.currentLocation!.longitude,
    );

    return {
      deliveryPartnerId: pickedPartner._id.toString(),
      deliveryPartnerName: pickedPartner.name,
      estimatedPickupTime: new Date(Date.now() + 15 * 60000), // 15 min buffer
      distanceKm: parseFloat(distanceKm.toFixed(2)),
    };
  },

  /**
   * Reassign a shipment to a new partner.
   */
  async reassignPartner(
    shipmentId: string,
    newPartnerId: string,
    adminId: string,
  ): Promise<any> {
    const shipment = await Shipment.findById(shipmentId);
    if (!shipment) throw new AppError("Shipment not found", 404);

    const oldPartnerId = shipment.deliveryPartnerId;

    // Release old partner
    if (oldPartnerId) {
      await DeliveryPartner.findByIdAndUpdate(oldPartnerId, {
        $pull: { assignedOrders: shipment._id },
        $set: { availabilityStatus: "available" },
      });
    }

    // Assign new partner
    const newPartner = await DeliveryPartner.findById(newPartnerId);
    if (!newPartner || newPartner.availabilityStatus === "offline") {
      throw new AppError("New delivery partner is not available", 400);
    }

    shipment.deliveryPartnerId = newPartner._id;
    await shipment.save();

    await DeliveryPartner.findByIdAndUpdate(newPartnerId, {
      $push: { assignedOrders: shipment._id },
      $set: {
        availabilityStatus:
          newPartner.assignedOrders.length >= 2 ? "busy" : "available",
      },
    });

    return shipment;
  },

  /**
   * Get assignment suggestions for an order.
   */
  async getAssignmentSuggestions(orderId: string): Promise<any[]> {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    const deliveryAddress = await Address.findById(order.deliveryAddressId);
    if (!deliveryAddress || !deliveryAddress.latitude) {
      return [];
    }

    const availablePartners =
      await deliveryPartnerService.getAvailablePartners();
    const sorted = sortByDistance(
      availablePartners,
      deliveryAddress.latitude,
      deliveryAddress.longitude,
    );

    return sorted.slice(0, 5).map((p) => ({
      _id: p._id,
      name: p.name,
      distance: calculateDistance(
        deliveryAddress.latitude!,
        deliveryAddress.longitude!,
        p.currentLocation!.latitude,
        p.currentLocation!.longitude,
      ).toFixed(2),
    }));
  },
};

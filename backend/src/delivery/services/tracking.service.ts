import { getRedisClient } from "../../config/redis.js";
import Shipment from "../../models/Shipment.model.js";
import DeliveryPartner from "../../models/DeliveryPartner.model.js";
import { ILiveLocation, ITrackingInfo } from "../types/delivery.types.js";
import AppError from "../../utils/AppError.js";

const redis = getRedisClient();

/**
 * Tracking Service - Handles live location and public status tracking.
 */
export const trackingService = {
  /**
   * Get full tracking info by tracking number (Public).
   */
  async getTrackingInfo(trackingNumber: string): Promise<ITrackingInfo> {
    const cacheKey = `cache:tracking:${trackingNumber}`;
    const cached = await redis.get(cacheKey);
    if (cached) return JSON.parse(cached);

    const shipment = await Shipment.findOne({ trackingNumber }).populate(
      "deliveryPartnerId",
    );
    if (!shipment) throw new AppError("Shipment not found", 404);

    let liveLocation: ILiveLocation | undefined;
    if (shipment.deliveryPartnerId) {
      const loc = await redis.get(`location:${shipment.deliveryPartnerId._id}`);
      if (loc) liveLocation = JSON.parse(loc);
    }

    const partner: any = shipment.deliveryPartnerId;

    const info: ITrackingInfo = {
      shipmentId: shipment._id.toString(),
      trackingNumber: shipment.trackingNumber,
      trackingUrl: shipment.trackingUrl || "",
      currentStatus: shipment.shipmentStatus,
      statusHistory: (shipment as any).statusHistory || [],
      shippedAt: shipment.shippedAt,
      outForDeliveryAt: shipment.outForDeliveryAt,
      deliveredAt: shipment.deliveredAt,
      liveLocation,
      deliveryPartner: partner
        ? {
            _id: partner._id,
            name: partner.name,
            phone: partner.phone.replace(/(\d{5})\d{5}/, "$1xxxxx"), // Mask phone
            vehicleType: partner.vehicleType,
            vehicleNumber: partner.vehicleNumber,
            availabilityStatus: partner.availabilityStatus,
          }
        : undefined,
    };

    await redis.set(cacheKey, JSON.stringify(info), "EX", 30);
    return info;
  },

  /**
   * Update live location from delivery partner app.
   */
  async updateLiveLocation(
    deliveryPartnerId: string,
    location: Omit<ILiveLocation, "updatedAt">,
  ): Promise<void> {
    const data: ILiveLocation = {
      ...location,
      deliveryPartnerId,
      updatedAt: new Date(),
    };

    await redis.set(
      `location:${deliveryPartnerId}`,
      JSON.stringify(data),
      "EX",
      300,
    );

    // Sync to MongoDB periodically (every 10 updates)
    const syncKey = `location:db:sync:${deliveryPartnerId}`;
    const count = await redis.incr(syncKey);
    await redis.expire(syncKey, 3600);

    if (count >= 10) {
      await DeliveryPartner.findByIdAndUpdate(deliveryPartnerId, {
        currentLocation: {
          latitude: location.latitude,
          longitude: location.longitude,
          updatedAt: new Date(),
        },
      });
      await redis.set(syncKey, "0");
    }

    // Placeholder for Socekt.io emit
    console.log(
      `[SOCKET EMIT] liveLocationUpdate for ${deliveryPartnerId}`,
      location,
    );
  },

  /**
   * Mark a delivery attempt as failed.
   */
  async markDeliveryAttemptFailed(
    shipmentId: string,
    reason: string,
    partnerId: string,
  ): Promise<any> {
    const shipment: any = await Shipment.findById(shipmentId);
    if (!shipment) throw new AppError("Shipment not found", 404);

    shipment.shipmentStatus = "failed_delivery";
    shipment.statusHistory.push({
      status: "failed_delivery",
      timestamp: new Date(),
      note: reason,
      updatedBy: partnerId,
    });

    shipment.failedAttempts = (shipment.failedAttempts || 0) + 1;

    if (shipment.failedAttempts >= 3) {
      shipment.shipmentStatus = "returned";
      shipment.statusHistory.push({
        status: "returned",
        timestamp: new Date(),
        note: "Automatic return after 3 failed attempts.",
        updatedBy: "system",
      });

      // Release partner
      await DeliveryPartner.findByIdAndUpdate(partnerId, {
        $pull: { assignedOrders: shipment._id },
      });
    }

    await shipment.save();
    return shipment;
  },
};

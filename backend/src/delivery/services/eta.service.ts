import { getRedisClient } from "../../config/redis.js";
import Shipment from "../../models/Shipment.model.js";
import Address from "../../models/Address.model.js";
import DeliveryPartner from "../../models/DeliveryPartner.model.js";
import {
  calculateDistance,
  estimateTravelTime,
} from "../utils/distance.util.js";
import { addMinutesToDate, formatETAMessage } from "../utils/eta.util.js";
import { IETAResult } from "../types/delivery.types.js";
import AppError from "../../utils/AppError.js";

const redis = getRedisClient();

/**
 * ETA Service - Calculates estimated delivery times.
 */
export const etaService = {
  /**
   * Calculate live ETA for a shipment.
   */
  async calculateETA(shipmentId: string): Promise<IETAResult> {
    const shipment = await Shipment.findById(shipmentId).populate("orderId");
    if (!shipment) throw new AppError("Shipment not found", 404);

    if (!shipment.deliveryPartnerId) {
      return {
        estimatedMinutes: 0,
        estimatedDelivery: new Date(),
        distanceKm: 0,
        message: "Waiting for partner assignment",
      };
    }

    const partner = await DeliveryPartner.findById(shipment.deliveryPartnerId);
    if (!partner || !partner.currentLocation) {
      throw new AppError(
        "Delivery partner information or location missing",
        400,
      );
    }

    const order: any = shipment.orderId;
    const deliveryAddress = await Address.findById(order.deliveryAddressId);
    if (
      !deliveryAddress ||
      !deliveryAddress.latitude ||
      !deliveryAddress.longitude
    ) {
      throw new AppError("Delivery address or coordinates missing", 400);
    }

    const distanceKm = calculateDistance(
      partner.currentLocation.latitude,
      partner.currentLocation.longitude,
      deliveryAddress.latitude,
      deliveryAddress.longitude,
    );

    let estimatedMinutes = estimateTravelTime(distanceKm, partner.vehicleType);

    // Add buffer for traffic and handovers
    estimatedMinutes += 10;

    const estimatedDelivery = addMinutesToDate(new Date(), estimatedMinutes);
    const result: IETAResult = {
      estimatedMinutes: Math.round(estimatedMinutes),
      estimatedDelivery,
      distanceKm: parseFloat(distanceKm.toFixed(2)),
      message: formatETAMessage(estimatedMinutes),
    };

    // Cache in Redis
    await redis.set(`eta:${shipmentId}`, JSON.stringify(result), "EX", 300);

    return result;
  },

  /**
   * Recalculate and invalidate cache.
   */
  async recalculateETA(shipmentId: string): Promise<void> {
    await redis.del(`eta:${shipmentId}`);
    await this.calculateETA(shipmentId);
  },

  /**
   * Get cached ETA.
   */
  async getStoredETA(shipmentId: string): Promise<IETAResult | null> {
    const cached = await redis.get(`eta:${shipmentId}`);
    if (cached) return JSON.parse(cached);

    try {
      return await this.calculateETA(shipmentId);
    } catch (err) {
      return null;
    }
  },
};

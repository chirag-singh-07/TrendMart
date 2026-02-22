import DeliveryPartner from "../../models/DeliveryPartner.model.js";
import {
  IDeliveryPartner,
  AvailabilityStatus,
} from "../../interfaces/index.js";
import { IDeliveryPartnerFilters } from "../types/delivery.types.js";
import { getRedisClient } from "../../config/redis.js";
import AppError from "../../utils/AppError.js";

const redis = getRedisClient();

/**
 * Delivery Partner Service - Manages delivery profiles and availability.
 */
export const deliveryPartnerService = {
  /**
   * Register a new delivery partner profile.
   */
  async registerDeliveryPartner(
    userId: string,
    data: any,
  ): Promise<IDeliveryPartner> {
    const existing = await DeliveryPartner.findOne({ userId });
    if (existing)
      throw new AppError("Delivery partner profile already exists", 400);

    const partner = await DeliveryPartner.create({
      ...data,
      userId,
      availabilityStatus: "offline",
      assignedOrders: [],
    });

    return partner;
  },

  /**
   * Update partner profile.
   */
  async updateProfile(
    userIdOrPartnerId: string,
    payload: any,
    isAdmin = false,
  ): Promise<IDeliveryPartner> {
    const query = isAdmin
      ? { _id: userIdOrPartnerId }
      : { userId: userIdOrPartnerId };

    const partner = await DeliveryPartner.findOneAndUpdate(
      query,
      { $set: payload },
      { new: true },
    );

    if (!partner) throw new AppError("Delivery partner not found", 404);
    return partner;
  },

  /**
   * Get partner by ID.
   */
  async getDeliveryPartnerById(id: string): Promise<IDeliveryPartner> {
    const partner = await DeliveryPartner.findById(id);
    if (!partner) throw new AppError("Delivery partner not found", 404);
    return partner;
  },

  /**
   * Get partner by linked User ID.
   */
  async getDeliveryPartnerByUserId(userId: string): Promise<IDeliveryPartner> {
    const partner = await DeliveryPartner.findOne({ userId });
    if (!partner) throw new AppError("Delivery partner profile not found", 404);
    return partner;
  },

  /**
   * Fetch all partners with filtering.
   */
  async getAllDeliveryPartners(filters: IDeliveryPartnerFilters): Promise<any> {
    const {
      availabilityStatus,
      vehicleType,
      city,
      page = 1,
      limit = 10,
    } = filters;

    const query: any = {};
    if (availabilityStatus) query.availabilityStatus = availabilityStatus;
    if (vehicleType) query.vehicleType = vehicleType;
    if (city) query["currentLocation.city"] = city;

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      DeliveryPartner.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      DeliveryPartner.countDocuments(query),
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
   * Update availability and cache in Redis.
   */
  async updateAvailability(
    userId: string,
    status: AvailabilityStatus,
  ): Promise<IDeliveryPartner> {
    const partner = await DeliveryPartner.findOne({ userId });
    if (!partner) throw new AppError("Delivery partner not found", 404);

    if (status === "available" && partner.assignedOrders.length >= 5) {
      throw new AppError(
        "Complete current deliveries before going available",
        400,
      );
    }

    partner.availabilityStatus = status;
    await partner.save();

    const redisKey = `delivery:available:${partner._id}`;
    if (status === "available") {
      await redis.set(redisKey, "1");
      await redis.del("delivery:available:partners"); // Invalidate list cache
    } else {
      await redis.del(redisKey);
      await redis.del("delivery:available:partners");
    }

    return partner;
  },

  /**
   * Get available partners (cached).
   */
  async getAvailablePartners(): Promise<IDeliveryPartner[]> {
    const cached = await redis.get("delivery:available:partners");
    if (cached) return JSON.parse(cached);

    const partners = await DeliveryPartner.find({
      availabilityStatus: "available",
      "currentLocation.latitude": { $exists: true },
    });

    await redis.set(
      "delivery:available:partners",
      JSON.stringify(partners),
      "EX",
      60,
    );
    return partners;
  },

  /**
   * Fetch partner statistics.
   */
  async getPartnerStats(id: string): Promise<any> {
    const partner = await DeliveryPartner.findById(id);
    if (!partner) throw new AppError("Delivery partner not found", 404);

    return {
      activeAssignments: partner.assignedOrders.length,
      availabilityStatus: partner.availabilityStatus,
      currentLocation: partner.currentLocation,
      vehicleType: partner.vehicleType,
    };
  },
};

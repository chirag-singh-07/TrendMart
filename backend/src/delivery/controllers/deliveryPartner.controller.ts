import { Response, NextFunction } from "express";
import { deliveryPartnerService } from "../services/deliveryPartner.service.js";
import Shipment from "../../models/Shipment.model.js";

const ok = (res: Response, message: string, data?: any) =>
  res.status(200).json({ success: true, message, data });

export const deliveryPartnerController = {
  async getOwnProfile(req: any, res: Response, next: NextFunction) {
    try {
      const partner = await deliveryPartnerService.getDeliveryPartnerByUserId(
        req.user.userId,
      );
      ok(res, "Profile fetched", partner);
    } catch (err) {
      next(err);
    }
  },

  async updateOwnProfile(req: any, res: Response, next: NextFunction) {
    try {
      const partner = await deliveryPartnerService.updateProfile(
        req.user.userId,
        req.body,
      );
      ok(res, "Profile updated", partner);
    } catch (err) {
      next(err);
    }
  },

  async updateAvailability(req: any, res: Response, next: NextFunction) {
    try {
      const partner = await deliveryPartnerService.updateAvailability(
        req.user.userId,
        req.body.availabilityStatus,
      );
      ok(res, `Status updated to ${req.body.availabilityStatus}`, partner);
    } catch (err) {
      next(err);
    }
  },

  async getOwnAssignments(req: any, res: Response, next: NextFunction) {
    try {
      const partner = await deliveryPartnerService.getDeliveryPartnerByUserId(
        req.user.userId,
      );
      const shipments = await Shipment.find({
        deliveryPartnerId: partner._id,
        shipmentStatus: {
          $in: [
            "pending",
            "packed",
            "picked_up",
            "in_transit",
            "out_for_delivery",
          ],
        },
      }).populate("orderId");
      ok(res, "Assigned shipments fetched", shipments);
    } catch (err) {
      next(err);
    }
  },

  async getOwnStats(req: any, res: Response, next: NextFunction) {
    try {
      const partner = await deliveryPartnerService.getDeliveryPartnerByUserId(
        req.user.userId,
      );
      const stats = await deliveryPartnerService.getPartnerStats(
        partner._id.toString(),
      );
      ok(res, "Stats fetched", stats);
    } catch (err) {
      next(err);
    }
  },

  async getAllPartners(req: any, res: Response, next: NextFunction) {
    try {
      const result = await deliveryPartnerService.getAllDeliveryPartners(
        req.query,
      );
      ok(res, "Partners fetched", result);
    } catch (err) {
      next(err);
    }
  },

  async getAvailablePartners(req: any, res: Response, next: NextFunction) {
    try {
      const partners = await deliveryPartnerService.getAvailablePartners();
      ok(res, "Available partners fetched", partners);
    } catch (err) {
      next(err);
    }
  },

  async getPartnerDetail(req: any, res: Response, next: NextFunction) {
    try {
      const partner = await deliveryPartnerService.getDeliveryPartnerById(
        req.params.partnerId,
      );
      ok(res, "Partner detail fetched", partner);
    } catch (err) {
      next(err);
    }
  },

  async updatePartnerAdmin(req: any, res: Response, next: NextFunction) {
    try {
      const partner = await deliveryPartnerService.updateProfile(
        req.params.partnerId,
        req.body,
        true,
      );
      ok(res, "Partner profile updated by admin", partner);
    } catch (err) {
      next(err);
    }
  },
};

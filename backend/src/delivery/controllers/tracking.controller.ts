import { Request, Response, NextFunction } from "express";
import { trackingService } from "../services/tracking.service.js";
import { deliveryPartnerService } from "../services/deliveryPartner.service.js";

const ok = (res: Response, message: string, data?: any) =>
  res.status(200).json({ success: true, message, data });

export const trackingController = {
  /**
   * Public tracking - no auth required.
   */
  async getTrackingInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const info = await trackingService.getTrackingInfo(
        req.params.trackingNumber as string,
      );
      ok(res, "Tracking info fetched", info);
    } catch (err) {
      next(err);
    }
  },

  async updateLiveLocation(req: any, res: Response, next: NextFunction) {
    try {
      const partner = await deliveryPartnerService.getDeliveryPartnerByUserId(
        req.user.userId,
      );
      await trackingService.updateLiveLocation(
        partner._id.toString(),
        req.body,
      );
      ok(res, "Location updated");
    } catch (err) {
      next(err);
    }
  },

  async getStatusHistory(req: any, res: Response, next: NextFunction) {
    try {
      ok(res, "Status history fetched", req.shipment.statusHistory);
    } catch (err) {
      next(err);
    }
  },

  async markAttemptFailed(req: any, res: Response, next: NextFunction) {
    try {
      const partner = await deliveryPartnerService.getDeliveryPartnerByUserId(
        req.user.userId,
      );
      const shipment = await trackingService.markDeliveryAttemptFailed(
        req.params.shipmentId,
        req.body.reason,
        partner._id.toString(),
      );
      ok(res, "Delivery attempt marked as failed", shipment);
    } catch (err) {
      next(err);
    }
  },
};

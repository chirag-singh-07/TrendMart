import { Request, Response, NextFunction } from "express";
import { shipmentService } from "../services/shipment.service.js";
import { assignmentService } from "../services/assignment.service.js";

const ok = (res: Response, message: string, data?: any) =>
  res.status(200).json({ success: true, message, data });

export const shipmentController = {
  async createShipment(req: any, res: Response, next: NextFunction) {
    try {
      const shipment = await shipmentService.createShipment(
        req.body,
        req.user.userId,
      );
      res
        .status(201)
        .json({ success: true, message: "Shipment created", data: shipment });
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: any, res: Response, next: NextFunction) {
    try {
      const shipment = await shipmentService.updateShipmentStatus(
        req.params.shipmentId,
        req.body.status,
        req.user.userId,
        req.body.note,
      );
      ok(res, `Status updated to ${req.body.status}`, shipment);
    } catch (err) {
      next(err);
    }
  },

  async assignPartner(req: any, res: Response, next: NextFunction) {
    try {
      const shipment = await shipmentService.assignDeliveryPartner(
        req.params.shipmentId,
        req.body.deliveryPartnerId,
        req.user.userId,
      );
      ok(res, "Delivery partner assigned", shipment);
    } catch (err) {
      next(err);
    }
  },

  async reassignPartner(req: any, res: Response, next: NextFunction) {
    try {
      const shipment = await assignmentService.reassignPartner(
        req.params.shipmentId,
        req.body.deliveryPartnerId,
        req.user.userId,
      );
      ok(res, "Delivery partner reassigned", shipment);
    } catch (err) {
      next(err);
    }
  },

  async cancelShipment(req: any, res: Response, next: NextFunction) {
    try {
      const shipment = await shipmentService.cancelShipment(
        req.params.shipmentId,
        req.body.reason,
        req.user.userId,
      );
      ok(res, "Shipment cancelled", shipment);
    } catch (err) {
      next(err);
    }
  },

  async getAllShipments(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await shipmentService.getShipmentsByFilter(
        req.query as any,
      );
      ok(res, "Shipments fetched", result);
    } catch (err) {
      next(err);
    }
  },

  async getShipmentDetail(req: any, res: Response, next: NextFunction) {
    try {
      ok(res, "Shipment detail fetched", req.shipment);
    } catch (err) {
      next(err);
    }
  },

  async getShipmentByOrder(req: any, res: Response, next: NextFunction) {
    try {
      const shipment = await shipmentService.getShipmentByOrder(
        req.params.orderId,
      );
      ok(res, "Shipment fetched", shipment);
    } catch (err) {
      next(err);
    }
  },
};

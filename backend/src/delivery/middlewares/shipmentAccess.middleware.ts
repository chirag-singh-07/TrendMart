import { Response, NextFunction } from "express";
import Shipment from "../../models/Shipment.model.js";
import DeliveryPartner from "../../models/DeliveryPartner.model.js";
import AppError from "../../utils/AppError.js";

/**
 * Middleware to verify shipment access based on role.
 */
export const shipmentAccess = async (
  req: any,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const { shipmentId } = req.params;
    const shipment = await Shipment.findById(shipmentId).populate("orderId");

    if (!shipment) {
      return next(new AppError("Shipment not found", 404));
    }

    const { role, userId } = req.user;

    // Admin has full access
    if (role === "admin") {
      req.shipment = shipment;
      return next();
    }

    // Buyer access check
    if (role === "buyer") {
      const order: any = shipment.orderId;
      if (order.userId.toString() !== userId) {
        return next(new AppError("Access denied", 403));
      }
    }

    // Seller access check
    if (role === "seller") {
      if (shipment.sellerId.toString() !== req.user.sellerId) {
        return next(new AppError("Access denied", 403));
      }
    }

    // Delivery partner access check
    if (role === "delivery") {
      const partner = await DeliveryPartner.findOne({ userId });
      if (
        !partner ||
        shipment.deliveryPartnerId?.toString() !== partner._id.toString()
      ) {
        return next(new AppError("Access denied", 403));
      }
    }

    req.shipment = shipment;
    next();
  } catch (error) {
    next(error);
  }
};

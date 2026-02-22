import { Response, NextFunction } from "express";
import Address from "../../models/Address.model.js";
import AppError from "../../utils/AppError.js";

/**
 * Middleware to verify address ownership.
 */
export const addressOwner = async (
  req: any,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const { addressId } = req.params;
    if (!addressId) return next();

    const address = await Address.findById(addressId);
    if (!address) {
      return next(new AppError("Address not found", 404));
    }

    if (
      req.user.role !== "admin" &&
      address.userId.toString() !== req.user.userId
    ) {
      return next(
        new AppError("Access denied. You do not own this address.", 403),
      );
    }

    req.address = address;
    next();
  } catch (error) {
    next(error);
  }
};

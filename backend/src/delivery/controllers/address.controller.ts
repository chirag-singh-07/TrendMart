import { Response, NextFunction } from "express";
import { addressService } from "../services/address.service.js";

const ok = (res: Response, message: string, data?: any) =>
  res.status(200).json({ success: true, message, data });

export const addressController = {
  async createAddress(req: any, res: Response, next: NextFunction) {
    try {
      const address = await addressService.createAddress(
        req.user.userId,
        req.body,
      );
      res
        .status(201)
        .json({ success: true, message: "Address created", data: address });
    } catch (err) {
      next(err);
    }
  },

  async updateAddress(req: any, res: Response, next: NextFunction) {
    try {
      const address = await addressService.updateAddress(
        req.params.addressId,
        req.user.userId,
        req.body,
      );
      ok(res, "Address updated", address);
    } catch (err) {
      next(err);
    }
  },

  async deleteAddress(req: any, res: Response, next: NextFunction) {
    try {
      await addressService.deleteAddress(req.params.addressId, req.user.userId);
      ok(res, "Address deleted");
    } catch (err) {
      next(err);
    }
  },

  async getUserAddresses(req: any, res: Response, next: NextFunction) {
    try {
      const addresses = await addressService.getUserAddresses(req.user.userId);
      ok(res, "Addresses fetched", addresses);
    } catch (err) {
      next(err);
    }
  },

  async getAddressById(req: any, res: Response, next: NextFunction) {
    try {
      const address = await addressService.getAddressById(
        req.params.addressId,
        req.user.userId,
      );
      ok(res, "Address fetched", address);
    } catch (err) {
      next(err);
    }
  },

  async setDefaultAddress(req: any, res: Response, next: NextFunction) {
    try {
      const address = await addressService.setDefaultAddress(
        req.params.addressId,
        req.user.userId,
      );
      ok(res, "Default address set", address);
    } catch (err) {
      next(err);
    }
  },
};

import Address from "../../models/Address.model.js";
import { IAddress } from "../../interfaces/index.js";
import { ICreateAddressPayload } from "../types/delivery.types.js";
import AppError from "../../utils/AppError.js";

/**
 * Address Service - Handles user shipping address management.
 */
export const addressService = {
  /**
   * Create a new shipping address.
   */
  async createAddress(
    userId: string,
    payload: ICreateAddressPayload,
  ): Promise<IAddress> {
    const addressCount = await Address.countDocuments({ userId });

    if (addressCount >= 10) {
      throw new AppError("Maximum 10 addresses allowed", 400);
    }

    let isDefault = payload.isDefault || addressCount === 0;

    if (isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const address = await Address.create({
      ...payload,
      userId,
      isDefault,
    });

    return address;
  },

  /**
   * Update an existing address.
   */
  async updateAddress(
    addressId: string,
    userId: string,
    payload: Partial<ICreateAddressPayload>,
  ): Promise<IAddress> {
    const address = await Address.findById(addressId);

    if (!address) throw new AppError("Address not found", 404);
    if (address.userId.toString() !== userId)
      throw new AppError("Access denied", 403);

    if (payload.isDefault) {
      await Address.updateMany({ userId }, { isDefault: false });
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      addressId,
      { ...payload },
      { new: true },
    );

    return updatedAddress!;
  },

  /**
   * Delete a shipping address.
   */
  async deleteAddress(addressId: string, userId: string): Promise<void> {
    const address = await Address.findById(addressId);

    if (!address) throw new AppError("Address not found", 404);
    if (address.userId.toString() !== userId)
      throw new AppError("Access denied", 403);

    const wasDefault = address.isDefault;
    await Address.findByIdAndDelete(addressId);

    if (wasDefault) {
      const nextAddress = await Address.findOne({ userId }).sort({
        createdAt: -1,
      });
      if (nextAddress) {
        nextAddress.isDefault = true;
        await nextAddress.save();
      }
    }
  },

  /**
   * Get address by ID with ownership check.
   */
  async getAddressById(addressId: string, userId: string): Promise<IAddress> {
    const address = await Address.findById(addressId);

    if (!address) throw new AppError("Address not found", 404);
    if (userId !== "admin" && address.userId.toString() !== userId) {
      throw new AppError("Access denied", 403);
    }

    return address;
  },

  /**
   * Get all addresses for a user.
   */
  async getUserAddresses(userId: string): Promise<IAddress[]> {
    return Address.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
  },

  /**
   * Set an address as default.
   */
  async setDefaultAddress(
    addressId: string,
    userId: string,
  ): Promise<IAddress> {
    const address = await Address.findById(addressId);

    if (!address) throw new AppError("Address not found", 404);
    if (address.userId.toString() !== userId)
      throw new AppError("Access denied", 403);

    await Address.updateMany({ userId }, { isDefault: false });

    address.isDefault = true;
    await address.save();

    return address;
  },

  /**
   * Quick ownership check.
   */
  async validateAddressOwnership(
    addressId: string,
    userId: string,
  ): Promise<boolean> {
    const address = await Address.findOne({ _id: addressId, userId });
    return !!address;
  },
};

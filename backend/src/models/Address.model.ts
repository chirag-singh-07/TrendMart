import mongoose, { Schema, model, Document } from "mongoose";
import { IAddress } from "../interfaces";

// ==================== Address Model ====================

export interface IAddressDocument extends IAddress, Document {}

const AddressSchema = new Schema<IAddressDocument>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  fullName: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  addressLine1: { type: String, required: true, trim: true },
  addressLine2: { type: String, trim: true },
  landmark: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true, default: "India" },
  latitude: { type: Number },
  longitude: { type: Number },
  isDefault: { type: Boolean, default: false },
});

// fetch all addresses for a user
AddressSchema.index({ userId: 1 });

// quickly get the user's default address
AddressSchema.index({ userId: 1, isDefault: 1 });

const Address =
  mongoose.models.Address || model<IAddressDocument>("Address", AddressSchema);

export default Address;

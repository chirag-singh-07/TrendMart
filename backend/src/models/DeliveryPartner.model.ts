import mongoose, { Schema, model, Document } from "mongoose";
import {
  IDeliveryPartner,
  VehicleType,
  AvailabilityStatus,
} from "../interfaces";

// ==================== DeliveryPartner Model ====================

export interface IDeliveryPartnerDocument extends IDeliveryPartner, Document {}

const DeliveryPartnerLocationSchema = new Schema(
  {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    updatedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const DeliveryPartnerSchema = new Schema<IDeliveryPartnerDocument>({
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  vehicleType: {
    type: String,
    enum: ["bike", "scooter", "car", "van", "truck"] satisfies VehicleType[],
    required: true,
  },
  vehicleNumber: { type: String, required: true, unique: true },
  currentLocation: {
    type: DeliveryPartnerLocationSchema,
  },
  availabilityStatus: {
    type: String,
    enum: ["available", "busy", "offline"] satisfies AvailabilityStatus[],
    default: "offline",
  },
  assignedOrders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

// dispatch system — find available partners
DeliveryPartnerSchema.index({ availabilityStatus: 1 });

// geo lookup for nearest partner (2dsphere on currentLocation coordinates)
DeliveryPartnerSchema.index({
  "currentLocation.latitude": 1,
  "currentLocation.longitude": 1,
});

const DeliveryPartner =
  mongoose.models.DeliveryPartner ||
  model<IDeliveryPartnerDocument>("DeliveryPartner", DeliveryPartnerSchema);

export default DeliveryPartner;

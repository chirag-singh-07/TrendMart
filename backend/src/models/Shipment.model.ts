import mongoose, { Schema, model, Document } from "mongoose";
import { IShipment, ShipmentStatus } from "../interfaces";

// ==================== Shipment Model ====================

export interface IShipmentDocument extends IShipment, Document {}

const ShipmentSchema = new Schema<IShipmentDocument>({
  orderId: {
    type: Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  sellerId: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
  deliveryPartnerId: {
    type: Schema.Types.ObjectId,
    ref: "DeliveryPartner",
  },
  trackingNumber: { type: String, required: true, unique: true },
  trackingUrl: { type: String },
  shipmentStatus: {
    type: String,
    enum: [
      "pending",
      "packed",
      "picked_up",
      "in_transit",
      "out_for_delivery",
      "delivered",
      "failed_delivery",
      "returned",
    ] satisfies ShipmentStatus[],
    default: "pending",
  },
  shippedAt: { type: Date },
  outForDeliveryAt: { type: Date },
  deliveredAt: { type: Date },
  deliveryNotes: { type: String, trim: true },
});

// fetch shipment for an order
ShipmentSchema.index({ orderId: 1 });

// seller's shipments dashboard
ShipmentSchema.index({ sellerId: 1 });

// delivery partner's active shipments
ShipmentSchema.index({ deliveryPartnerId: 1, shipmentStatus: 1 });

// tracking by tracking number (customer-facing)
ShipmentSchema.index({ trackingNumber: 1 });

const Shipment =
  mongoose.models.Shipment ||
  model<IShipmentDocument>("Shipment", ShipmentSchema);

export default Shipment;

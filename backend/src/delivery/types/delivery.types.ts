import mongoose from "mongoose";
import {
  ShipmentStatus,
  VehicleType,
  AvailabilityStatus,
} from "../../interfaces/index.js";

export interface ICreateAddressPayload {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault?: boolean;
}

export interface ICreateShipmentPayload {
  orderId: string;
  sellerId: string;
  deliveryPartnerId?: string; // optional — can auto-assign
}

export interface IAssignmentResult {
  deliveryPartnerId: string;
  deliveryPartnerName: string;
  estimatedPickupTime: Date;
  distanceKm: number;
}

export interface ILiveLocation {
  deliveryPartnerId: string;
  latitude: number;
  longitude: number;
  updatedAt: Date;
  accuracy?: number;
}

export interface ITrackingInfo {
  shipmentId: string;
  trackingNumber: string;
  trackingUrl: string;
  currentStatus: ShipmentStatus;
  statusHistory: IStatusHistoryEntry[];
  deliveryPartner?: IDeliveryPartnerPublic;
  liveLocation?: ILiveLocation;
  estimatedDelivery?: Date;
  shippedAt?: Date;
  outForDeliveryAt?: Date;
  deliveredAt?: Date;
}

export interface IStatusHistoryEntry {
  status: ShipmentStatus;
  timestamp: Date;
  note?: string;
  updatedBy: string; // userId of who changed status
}

export interface IDeliveryPartnerPublic {
  _id: string;
  name: string;
  phone: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  currentLocation?: ILiveLocation;
  availabilityStatus: AvailabilityStatus;
}

export interface IShipmentFilters {
  sellerId?: string;
  deliveryPartnerId?: string;
  shipmentStatus?: ShipmentStatus;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

export interface IDeliveryPartnerFilters {
  availabilityStatus?: AvailabilityStatus;
  vehicleType?: VehicleType;
  city?: string;
  page?: number;
  limit?: number;
}

export interface IETAResult {
  estimatedMinutes: number;
  estimatedDelivery: Date;
  distanceKm: number;
  message: string; // e.g. "Estimated delivery in 45 minutes"
}

import { z } from "zod";

const mongoId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createShipmentSchema = z.object({
  body: z.object({
    orderId: mongoId,
    sellerId: mongoId,
    deliveryPartnerId: mongoId.optional(),
  }),
});

export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "pending",
      "packed",
      "picked_up",
      "in_transit",
      "out_for_delivery",
      "delivered",
      "failed_delivery",
      "returned",
    ]),
    note: z.string().max(300, "Note cannot exceed 300 characters").optional(),
  }),
});

export const assignPartnerSchema = z.object({
  body: z.object({
    deliveryPartnerId: mongoId,
  }),
});

import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    vehicleType: z.enum(["bike", "scooter", "car", "van", "truck"]).optional(),
    vehicleNumber: z.string().min(4).max(15).optional(),
    availabilityStatus: z.enum(["available", "busy", "offline"]).optional(),
  }),
});

export const updateAvailabilitySchema = z.object({
  body: z.object({
    availabilityStatus: z.enum(["available", "busy", "offline"]),
  }),
});

export const locationUpdateSchema = z.object({
  body: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    accuracy: z.number().optional(),
  }),
});

import { z } from "zod";

export const createAddressSchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Please provide a valid Indian mobile number"),
    addressLine1: z
      .string()
      .min(5, "Address Line 1 must be at least 5 characters")
      .max(200),
    addressLine2: z.string().max(200).optional(),
    landmark: z.string().max(100).optional(),
    city: z.string().min(2, "City name must be at least 2 characters").max(100),
    state: z
      .string()
      .min(2, "State name must be at least 2 characters")
      .max(100),
    postalCode: z
      .string()
      .regex(/^\d{6}$/, "Please provide a valid 6-digit PIN code"),
    country: z.string().default("India"),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    isDefault: z.boolean().default(false),
  }),
});

export const updateAddressSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(100).optional(),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/)
      .optional(),
    addressLine1: z.string().min(5).max(200).optional(),
    addressLine2: z.string().max(200).optional(),
    landmark: z.string().max(100).optional(),
    city: z.string().min(2).max(100).optional(),
    state: z.string().min(2).max(100).optional(),
    postalCode: z
      .string()
      .regex(/^\d{6}$/)
      .optional(),
    country: z.string().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    isDefault: z.boolean().optional(),
  }),
});

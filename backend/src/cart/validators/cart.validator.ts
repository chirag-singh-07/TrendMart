import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const addToCartSchema = z.object({
  body: z.object({
    productId: mongoIdSchema,
    variantId: mongoIdSchema.optional(),
    quantity: z.number().min(1).max(100),
  }),
});

export const updateCartItemSchema = z.object({
  body: z.object({
    productId: mongoIdSchema,
    variantId: mongoIdSchema.optional(),
    quantity: z.number().min(0).max(100),
  }),
});

export const removeCartItemSchema = z.object({
  body: z.object({
    productId: mongoIdSchema,
    variantId: mongoIdSchema.optional(),
  }),
});

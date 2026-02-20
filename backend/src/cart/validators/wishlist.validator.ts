import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const addToWishlistSchema = z.object({
  body: z.object({
    productId: mongoIdSchema,
  }),
});

export const moveToCartSchema = z.object({
  body: z.object({
    productId: mongoIdSchema,
  }),
});

export const removeFromWishlistSchema = z.object({
  params: z.object({
    productId: mongoIdSchema,
  }),
});

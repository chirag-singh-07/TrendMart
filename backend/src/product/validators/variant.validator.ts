import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createVariantSchema = z.object({
  params: z.object({
    productId: mongoIdSchema,
  }),
  body: z.object({
    variantName: z.string().min(2).max(100),
    attributes: z
      .array(
        z.object({
          name: z.string(),
          value: z.string(),
        }),
      )
      .min(1),
    sku: z.string().min(3).max(50),
    price: z.number().positive(),
    stock: z.number().min(0).default(0),
    image: z.string().url().optional(),
    isDefault: z.boolean().default(false),
  }),
});

export const updateVariantSchema = z.object({
  params: z.object({
    variantId: mongoIdSchema,
  }),
  body: z.object({
    variantName: z.string().min(2).max(100).optional(),
    attributes: z
      .array(
        z.object({
          name: z.string(),
          value: z.string(),
        }),
      )
      .min(1)
      .optional(),
    sku: z.string().min(3).max(50).optional(),
    price: z.number().positive().optional(),
    stock: z.number().min(0).optional(),
    image: z.string().url().optional(),
    isDefault: z.boolean().optional(),
  }),
});

import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    parentCategoryId: mongoIdSchema.optional().nullable(),
    displayOrder: z.number().optional().default(0),
    image: z.string().url().optional(),
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({
    categoryId: mongoIdSchema,
  }),
  body: z.object({
    name: z.string().min(2).max(100).optional(),
    description: z.string().max(500).optional(),
    parentCategoryId: mongoIdSchema.optional().nullable(),
    displayOrder: z.number().optional(),
    image: z.string().url().optional(),
    isActive: z.boolean().optional(),
  }),
});

export const getCategorySchema = z.object({
  params: z.object({
    categoryId: mongoIdSchema,
  }),
});

export const reorderCategoriesSchema = z.object({
  body: z.object({
    orderedIds: z.array(mongoIdSchema),
  }),
});

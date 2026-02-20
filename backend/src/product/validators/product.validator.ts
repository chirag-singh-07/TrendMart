import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createProductSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200),
    shortDescription: z.string().min(10).max(500),
    fullDescription: z.string().min(20),
    brand: z.string().optional(),
    categoryId: mongoIdSchema,
    basePrice: z.number().positive(),
    salePrice: z.number().positive().optional(),
    currency: z.string().default("INR"),
    totalStock: z.number().min(0).default(0),
    lowStockThreshold: z.number().min(0).default(10),
    sku: z.string().min(3).max(50),
    barcode: z.string().optional(),
    tags: z.array(z.string()).max(10).optional(),
    weight: z.number().positive().optional(),
    dimensions: z
      .object({
        length: z.number().positive(),
        width: z.number().positive(),
        height: z.number().positive(),
      })
      .optional(),
    shippingClass: z.string().optional(),
    seo: z
      .object({
        metaTitle: z.string().max(60).optional(),
        metaDescription: z.string().max(160).optional(),
        keywords: z.array(z.string()).optional(),
      })
      .optional(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    productId: mongoIdSchema,
  }),
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    shortDescription: z.string().min(10).max(500).optional(),
    fullDescription: z.string().min(20).optional(),
    brand: z.string().optional(),
    categoryId: mongoIdSchema.optional(),
    basePrice: z.number().positive().optional(),
    salePrice: z.number().positive().optional(),
    currency: z.string().optional(),
    totalStock: z.number().min(0).optional(),
    lowStockThreshold: z.number().min(0).optional(),
    sku: z.string().min(3).max(50).optional(),
    barcode: z.string().optional(),
    tags: z.array(z.string()).max(10).optional(),
    images: z.array(z.string()).optional(),
    weight: z.number().positive().optional(),
    dimensions: z
      .object({
        length: z.number().positive(),
        width: z.number().positive(),
        height: z.number().positive(),
      })
      .optional(),
    shippingClass: z.string().optional(),
    seo: z
      .object({
        metaTitle: z.string().max(60).optional(),
        metaDescription: z.string().max(160).optional(),
        keywords: z.array(z.string()).optional(),
      })
      .optional(),
  }),
});

export const productFiltersSchema = z.object({
  query: z.object({
    categoryId: mongoIdSchema.optional(),
    sellerId: mongoIdSchema.optional(),
    status: z.enum(["draft", "active", "out_of_stock", "banned"]).optional(),
    minPrice: z.preprocess((val) => Number(val), z.number()).optional(),
    maxPrice: z.preprocess((val) => Number(val), z.number()).optional(),
    brand: z.string().optional(),
    tags: z
      .union([z.string(), z.array(z.string())])
      .transform((val) => (Array.isArray(val) ? val : [val]))
      .optional(),
    inStock: z.preprocess((val) => val === "true", z.boolean()).optional(),
    search: z.string().optional(),
    sortBy: z
      .enum(["price_asc", "price_desc", "newest", "rating", "bestseller"])
      .optional(),
    page: z
      .preprocess((val) => Number(val), z.number().min(1))
      .optional()
      .default(1),
    limit: z
      .preprocess((val) => Number(val), z.number().min(1).max(100))
      .optional()
      .default(20),
  }),
});

export const stockUpdateSchema = z.object({
  params: z.object({
    productId: mongoIdSchema,
  }),
  body: z.object({
    variantId: mongoIdSchema.optional(),
    quantity: z.number(),
    operation: z.enum(["increment", "decrement", "set"]),
  }),
});

import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createReviewSchema = z.object({
  body: z.object({
    productId: mongoIdSchema,
    orderId: mongoIdSchema,
    rating: z.number().int().min(1).max(5),
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title can be at most 100 characters"),
    comment: z
      .string()
      .min(10, "Comment must be at least 10 characters")
      .max(2000, "Comment can be at most 2000 characters"),
    images: z
      .array(z.string().url("Each image must be a valid URL"))
      .max(5, "Maximum 5 images allowed per review")
      .optional(),
  }),
});

export const updateReviewSchema = z.object({
  body: z.object({
    rating: z.number().int().min(1).max(5).optional(),
    title: z.string().min(5).max(100).optional(),
    comment: z.string().min(10).max(2000).optional(),
    images: z
      .array(z.string().url())
      .max(5, "Maximum 5 images allowed per review")
      .optional(),
  }),
});

export const reviewFiltersSchema = z.object({
  query: z.object({
    productId: mongoIdSchema.optional(),
    userId: mongoIdSchema.optional(),
    rating: z
      .string()
      .transform(Number)
      .pipe(z.number().int().min(1).max(5))
      .optional(),
    isVerifiedPurchase: z
      .string()
      .transform((val) => val === "true")
      .optional(),
    moderationStatus: z
      .enum(["pending", "approved", "rejected", "flagged"])
      .optional(),
    sortBy: z
      .enum([
        "newest",
        "oldest",
        "highest_rating",
        "lowest_rating",
        "most_helpful",
      ])
      .optional(),
    fromDate: z.string().datetime().optional(),
    toDate: z.string().datetime().optional(),
    page: z
      .string()
      .transform(Number)
      .pipe(z.number().min(1))
      .default(1 as any),
    limit: z
      .string()
      .transform(Number)
      .pipe(z.number().min(1).max(50))
      .default(10 as any),
  }),
});

export const reportReviewSchema = z.object({
  body: z.object({
    reason: z
      .string()
      .min(5, "Reason must be at least 5 characters")
      .max(300, "Reason can be at most 300 characters"),
  }),
});

export const bulkModerateSchema = z.object({
  body: z.object({
    reviewIds: z
      .array(mongoIdSchema)
      .min(1, "At least one review ID required")
      .max(50, "Maximum 50 reviews at a time"),
    action: z.enum(["approve", "reject"]),
  }),
});

import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const createCouponSchema = z.object({
  body: z
    .object({
      code: z
        .string()
        .min(3)
        .max(20)
        .transform((val) => val.toUpperCase()),
      description: z.string().max(200).optional(),
      discountType: z.enum(["percentage", "flat"]),
      discountValue: z.number().positive(),
      minOrderAmount: z.number().min(0).optional(),
      maxDiscount: z.number().positive().optional(),
      usageLimit: z.number().positive().int().optional(),
      perUserLimit: z.number().positive().int().default(1),
      applicableProducts: z.array(mongoIdSchema).optional(),
      applicableCategories: z.array(mongoIdSchema).optional(),
      startDate: z.string().datetime().or(z.date()),
      expiresAt: z.string().datetime().or(z.date()),
      isActive: z.boolean().default(true),
    })
    .refine((data) => new Date(data.startDate) < new Date(data.expiresAt), {
      message: "startDate must be before expiresAt",
      path: ["startDate"],
    })
    .refine(
      (data) => {
        if (data.discountType === "percentage") {
          return data.discountValue <= 100;
        }
        return true;
      },
      {
        message: "discountValue cannot exceed 100 for percentage discounts",
        path: ["discountValue"],
      },
    )
    .refine(
      (data) => {
        if (data.discountType === "flat" && data.maxDiscount) {
          return false;
        }
        return true;
      },
      {
        message: "maxDiscount only applies to percentage discounts",
        path: ["maxDiscount"],
      },
    ),
});

export const updateCouponSchema = z.object({
  body: z
    .object({
      description: z.string().max(200).optional(),
      discountType: z.enum(["percentage", "flat"]).optional(),
      discountValue: z.number().positive().optional(),
      minOrderAmount: z.number().min(0).optional(),
      maxDiscount: z.number().positive().optional(),
      usageLimit: z.number().positive().int().optional(),
      perUserLimit: z.number().positive().int().optional(),
      applicableProducts: z.array(mongoIdSchema).optional(),
      applicableCategories: z.array(mongoIdSchema).optional(),
      startDate: z.string().datetime().or(z.date()).optional(),
      expiresAt: z.string().datetime().or(z.date()).optional(),
      isActive: z.boolean().optional(),
    })
    .refine(
      (data) => {
        if (data.startDate && data.expiresAt) {
          return new Date(data.startDate) < new Date(data.expiresAt);
        }
        return true;
      },
      {
        message: "startDate must be before expiresAt",
        path: ["startDate"],
      },
    )
    .refine(
      (data) => {
        if (data.discountType === "percentage" && data.discountValue) {
          return data.discountValue <= 100;
        }
        return true;
      },
      {
        message: "discountValue cannot exceed 100 for percentage discounts",
        path: ["discountValue"],
      },
    )
    .refine(
      (data) => {
        if (data.discountType === "flat" && data.maxDiscount) {
          return false;
        }
        return true;
      },
      {
        message: "maxDiscount only applies to percentage discounts",
        path: ["maxDiscount"],
      },
    ),
});

export const validateCouponSchema = z.object({
  body: z.object({
    code: z.string().min(1),
    cartItems: z.array(
      z.object({
        productId: mongoIdSchema,
        categoryId: mongoIdSchema,
        quantity: z.number().positive(),
        unitPrice: z.number().positive(),
        totalPrice: z.number().positive(),
      }),
    ),
    subtotal: z.number().positive(),
  }),
});

export const couponFiltersSchema = z.object({
  query: z.object({
    isActive: z
      .string()
      .transform((val) => val === "true")
      .optional(),
    discountType: z.enum(["percentage", "flat"]).optional(),
    fromDate: z.string().datetime().optional(),
    toDate: z.string().datetime().optional(),
    search: z.string().optional(),
    page: z
      .string()
      .transform(Number)
      .pipe(z.number().min(1))
      .default(1 as any),
    limit: z
      .string()
      .transform(Number)
      .pipe(z.number().min(1).max(100))
      .default(10 as any),
  }),
});

export const usageFiltersSchema = z.object({
  query: z.object({
    couponId: mongoIdSchema.optional(),
    userId: mongoIdSchema.optional(),
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
      .pipe(z.number().min(1).max(100))
      .default(10 as any),
  }),
});

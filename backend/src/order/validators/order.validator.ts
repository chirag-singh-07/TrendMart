import { z } from "zod";

const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

/**
 * Validator for placing a new order
 */
export const placeOrderSchema = z.object({
  body: z.object({
    deliveryAddressId: mongoIdSchema,
    couponId: mongoIdSchema.optional(),
    paymentMethod: z.string().min(1, "Payment method is required"),
    notes: z.string().max(300, "Notes cannot exceed 300 characters").optional(),
  }),
});

/**
 * Validator for filtering orders
 */
export const orderFiltersSchema = z.object({
  query: z.object({
    orderStatus: z
      .enum([
        "pending",
        "confirmed",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
      ])
      .optional(),
    paymentStatus: z
      .enum(["pending", "paid", "failed", "refunded", "partially_refunded"])
      .optional(),
    refundStatus: z
      .enum(["none", "requested", "processing", "completed", "rejected"])
      .optional(),
    fromDate: z
      .string()
      .datetime()
      .optional()
      .or(
        z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
      ),
    toDate: z
      .string()
      .datetime()
      .optional()
      .or(
        z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
      ),
    page: z.string().transform(Number).pipe(z.number().min(1)).default(1),
    limit: z
      .string()
      .transform(Number)
      .pipe(z.number().min(1).max(50))
      .default(10),
  }),
});

/**
 * Validator for cancelling an order
 */
export const cancelOrderSchema = z.object({
  body: z.object({
    reason: z
      .string()
      .min(5, "Reason must be at least 5 characters")
      .max(300, "Reason cannot exceed 300 characters"),
  }),
});

/**
 * Validator for refund requests
 */
export const refundRequestSchema = z.object({
  body: z.object({
    reason: z
      .string()
      .min(10, "Reason must be at least 10 characters")
      .max(500, "Reason cannot exceed 500 characters"),
    items: z.array(mongoIdSchema).optional(),
  }),
});

/**
 * Validator for status updates
 */
export const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum([
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "returned",
    ]),
  }),
});

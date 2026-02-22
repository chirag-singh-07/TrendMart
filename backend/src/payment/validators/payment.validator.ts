import { z } from "zod";

const mongoId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const initiatePaymentSchema = z.object({
  body: z.object({
    orderId: mongoId,
    paymentMethod: z.enum(["stripe", "cod", "wallet"]),
    currency: z.string().optional().default("INR"),
  }),
});

export const confirmStripeSchema = z.object({
  body: z.object({
    paymentIntentId: z.string().min(1, "paymentIntentId is required"),
  }),
});

export const processRefundSchema = z.object({
  body: z.object({
    orderId: mongoId,
    reason: z.string().min(5, "Reason must be at least 5 characters").max(300),
    refundMethod: z.enum(["original_method", "wallet"]),
  }),
});

export const partialRefundSchema = z.object({
  body: z.object({
    itemIds: z.array(mongoId).min(1, "At least one item ID is required"),
    reason: z.string().min(5).max(300),
  }),
});

export const payoutSchema = z.object({
  body: z.object({
    sellerId: mongoId,
    orderIds: z.array(mongoId).min(1, "At least one order ID required"),
    payoutMethod: z.enum(["bank_transfer", "upi", "wallet"]),
    bankDetails: z
      .object({
        accountNumber: z.string(),
        ifscCode: z.string(),
        accountHolderName: z.string(),
        bankName: z.string(),
      })
      .optional(),
  }),
});

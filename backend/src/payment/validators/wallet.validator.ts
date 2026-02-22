import { z } from "zod";

const mongoId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const topUpSchema = z.object({
  body: z.object({
    amount: z
      .number()
      .min(10, "Minimum top-up amount is ₹10")
      .max(100000, "Maximum top-up amount is ₹1,00,000"),
    currency: z.string().optional().default("INR"),
  }),
});

export const adminCreditSchema = z.object({
  body: z.object({
    userId: mongoId,
    amount: z.number().positive("Amount must be positive"),
    description: z
      .string()
      .min(5, "Description must be at least 5 characters")
      .max(200),
  }),
});

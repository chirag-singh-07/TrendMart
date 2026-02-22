import { z } from "zod";

// ==================== Register ====================

export const registerSchema = z.object({
  body: z.object({
    firstName: z
      .string({ error: "First name is required" })
      .trim()
      .min(2, "First name must be at least 2 characters")
      .max(50, "First name must be at most 50 characters"),
    lastName: z
      .string({ error: "Last name is required" })
      .trim()
      .min(2, "Last name must be at least 2 characters")
      .max(50, "Last name must be at most 50 characters"),
    email: z
      .string({ error: "Email is required" })
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),
    password: z
      .string({ error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters") // bcrypt limit
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
    phone: z
      .string()
      .trim()
      .regex(/^\+?[1-9]\d{7,14}$/, "Please provide a valid phone number")
      .optional(),
    role: z.enum(["buyer", "seller"], {
      message: "Role must be either 'buyer' or 'seller'",
    }),
  }),
});

// ==================== Verify Email ====================

export const verifyEmailSchema = z.object({
  body: z.object({
    userId: z
      .string({ error: "User ID is required" })
      .min(1, "User ID cannot be empty"),
    otp: z
      .string({ error: "OTP is required" })
      .length(6, "OTP must be exactly 6 digits")
      .regex(/^\d+$/, "OTP must contain only digits"),
  }),
});

// ==================== Login ====================

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ error: "Email is required" })
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),
    password: z
      .string({ error: "Password is required" })
      .min(1, "Password cannot be empty"),
  }),
});

// ==================== Forgot Password ====================

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ error: "Email is required" })
      .trim()
      .toLowerCase()
      .email("Please provide a valid email address"),
  }),
});

// ==================== Reset Password ====================

export const resetPasswordSchema = z.object({
  body: z.object({
    userId: z
      .string({ error: "User ID is required" })
      .min(1, "User ID cannot be empty"),
    otp: z
      .string({ error: "OTP is required" })
      .length(6, "OTP must be exactly 6 digits")
      .regex(/^\d+$/, "OTP must contain only digits"),
    newPassword: z
      .string({ error: "New password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
  }),
});

// ==================== Change Password ====================

export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z
      .string({ error: "Current password is required" })
      .min(1, "Current password cannot be empty"),
    newPassword: z
      .string({ message: "New password is required" })
      .min(8, "Password must be at least 8 characters")
      .max(72, "Password must be at most 72 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      ),
  }),
});

// ==================== Resend OTP ====================

export const resendOtpSchema = z.object({
  body: z.object({
    userId: z
      .string({ error: "User ID is required" })
      .min(1, "User ID cannot be empty"),
    type: z.enum(["verify", "reset"], {
      message: "OTP type must be either 'verify' or 'reset'",
    }),
  }),
});

// ==================== Inferred types ====================

export type RegisterInput = z.infer<typeof registerSchema>["body"];
export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];
export type ResendOtpInput = z.infer<typeof resendOtpSchema>["body"];

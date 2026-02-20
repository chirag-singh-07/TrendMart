import nodemailer from "nodemailer";
import { AppError } from "../../utils/AppError.js";

// ── Transporter ───────────────────────────────────────────────────────────────

/**
 * Creates and returns a nodemailer transporter.
 * In development the transporter uses SMTP config from env vars.
 * You can also swap this for a service like SendGrid/Resend by updating
 * the transport options here without changing any call-site code.
 */
const createTransporter = () => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);

  if (!user || !pass) {
    throw new AppError(
      "Email service is not configured. Set SMTP_USER and SMTP_PASS in .env",
      500,
    );
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587
    auth: { user, pass },
  });
};

// ── Shared send helper ────────────────────────────────────────────────────────

interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Sends an email via nodemailer.
 * Wraps nodemailer in a unified interface — swap transporter without touching callers.
 */
const sendMail = async (options: MailOptions): Promise<void> => {
  const transporter = createTransporter();
  await transporter.sendMail({
    from: `"EcoomApp" <${process.env.SMTP_USER}>`,
    ...options,
  });
};

// ── Email templates ───────────────────────────────────────────────────────────

/**
 * Sends an email verification OTP to the user.
 * @param to - Recipient email address.
 * @param otp - The 6-digit OTP.
 * @param firstName - Used to personalise the greeting.
 */
export const sendVerificationEmail = async (
  to: string,
  otp: string,
  firstName: string,
): Promise<void> => {
  await sendMail({
    to,
    subject: "Verify your EcoomApp account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 24px; border: 1px solid #e8e8e8; border-radius: 8px;">
        <h2 style="color: #111;">Hi ${firstName} 👋</h2>
        <p style="color: #444; font-size: 16px;">
          Thanks for signing up. Use the OTP below to verify your email address.
          <strong>It expires in 10 minutes.</strong>
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #4f46e5;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 13px;">
          If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
    `,
  });
};

/**
 * Sends a password reset OTP to the user.
 * @param to - Recipient email address.
 * @param otp - The 6-digit OTP.
 * @param firstName - Used to personalise the greeting.
 */
export const sendPasswordResetEmail = async (
  to: string,
  otp: string,
  firstName: string,
): Promise<void> => {
  await sendMail({
    to,
    subject: "Reset your EcoomApp password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: auto; padding: 24px; border: 1px solid #e8e8e8; border-radius: 8px;">
        <h2 style="color: #111;">Hi ${firstName},</h2>
        <p style="color: #444; font-size: 16px;">
          We received a request to reset your password. Use the OTP below.
          <strong>It expires in 10 minutes.</strong>
        </p>
        <div style="text-align: center; margin: 32px 0;">
          <span style="font-size: 40px; font-weight: bold; letter-spacing: 10px; color: #dc2626;">${otp}</span>
        </div>
        <p style="color: #888; font-size: 13px;">
          If you didn't request this, you can safely ignore this email.
          Your password will not change.
        </p>
      </div>
    `,
  });
};

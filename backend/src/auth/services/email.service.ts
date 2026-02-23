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
    subject: "Verify your TrendMart account",
    html: `
      <div style="background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; border: 1px solid #eeeeee;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; color: #000000;">TrendMart</h1>
        </div>
        
        <div style="max-width: 480px; margin: auto;">
          <h2 style="color: #000000; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Confirm your email address</h2>
          <p style="color: #666666; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
            Hello ${firstName},<br><br>
            To complete your registration and start shopping the latest trends, please use the verification code below. This code will expire in <strong>10 minutes</strong>.
          </p>
          
          <div style="background-color: #000000; padding: 32px; text-align: center; border-radius: 4px; margin-bottom: 32px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ffffff;">${otp}</span>
          </div>
          
          <p style="color: #999999; font-size: 12px; line-height: 1.5; text-align: center;">
            If you did not request this code, please ignore this email or contact support if you have concerns.
          </p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 40px 0;">
        
        <div style="text-align: center; color: #bbbbbb; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">
          © ${new Date().getFullYear()} TrendMart Inc.
        </div>
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
    subject: "Reset your TrendMart password",
    html: `
      <div style="background-color: #ffffff; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 40px 20px; border: 1px solid #eeeeee;">
        <div style="text-align: center; margin-bottom: 40px;">
          <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px; text-transform: uppercase; color: #000000;">TrendMart</h1>
        </div>
        
        <div style="max-width: 480px; margin: auto;">
          <h2 style="color: #000000; font-size: 20px; font-weight: 600; margin-bottom: 16px;">Password Reset Request</h2>
          <p style="color: #666666; font-size: 15px; line-height: 1.6; margin-bottom: 32px;">
            Hello ${firstName},<br><br>
            We received a request to reset your password. Use the secure code below to proceed. This code is valid for <strong>10 minutes</strong>.
          </p>
          
          <div style="background-color: #000000; padding: 32px; text-align: center; border-radius: 4px; margin-bottom: 32px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #ffffff;">${otp}</span>
          </div>
          
          <p style="color: #999999; font-size: 12px; line-height: 1.5; text-align: center;">
            If you did not request a password reset, you can safely ignore this email. Your account remains secure.
          </p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 40px 0;">
        
        <div style="text-align: center; color: #bbbbbb; font-size: 11px; letter-spacing: 1px; text-transform: uppercase;">
          © ${new Date().getFullYear()} TrendMart Inc.
        </div>
      </div>
    `,
  });
};

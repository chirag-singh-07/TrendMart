import rateLimit from "express-rate-limit";

// ── Login Rate Limiter ────────────────────────────────────────────────────────
// 5 attempts per 15 minutes per IP — prevents brute-force attacks

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    status: 429,
    success: false,
    message:
      "Too many login attempts from this IP. Please try again after 15 minutes.",
  },
  skipSuccessfulRequests: false,
});

// ── OTP Rate Limiter ──────────────────────────────────────────────────────────
// 3 requests per 10 minutes per IP — prevents OTP spray/flood attacks

export const otpRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3,
  message: {
    status: 429,
    success: false,
    message:
      "Too many OTP requests from this IP. Please try again after 10 minutes.",
  },
});

// ── General Auth Rate Limiter ──────────────────────────────────────────────────
// 30 requests per minute per IP — light guard on all auth routes

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: {
    status: 429,
    success: false,
    message: "Too many requests. Please slow down.",
  },
});

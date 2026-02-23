import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import {
  loginRateLimiter,
  otpRateLimiter,
  authRateLimiter,
} from "../middlewares/rateLimiter.middleware.js";

const router = Router();

// Apply a light rate limiter across all auth routes
router.use(authRateLimiter);

// ==================== Public routes ====================

/**
 * POST /auth/register
 * Register a new buyer or seller account.
 */
router.post("/register", authController.register);

/**
 * POST /auth/verify-email
 * Verify email using a 6-digit OTP.
 */
router.post("/verify-email", otpRateLimiter, authController.verifyEmail);

/**
 * POST /auth/login
 * Log in with email + password. Returns access token + sets refresh cookie.
 */
router.post("/login", loginRateLimiter, authController.login);

/**
 * POST /auth/refresh
 * Use the httpOnly refresh token cookie to get a new access token.
 */
router.post("/refresh", authController.refresh);

/**
 * POST /auth/forgot-password
 * Initiate password reset — sends OTP to registered email.
 */
router.post("/forgot-password", otpRateLimiter, authController.forgotPassword);

/**
 * POST /auth/reset-password
 * Reset password using the OTP received via email.
 */
router.post("/reset-password", authController.resetPassword);

/**
 * POST /auth/resend-otp
 * Resend verification or reset OTP (subject to cooldown enforcement).
 */
router.post("/resend-otp", otpRateLimiter, authController.resendOtp);

// ==================== Authenticated routes ====================

/**
 * POST /auth/logout
 * Log out current device session (requires valid access token).
 */
router.post("/logout", authenticate, authController.logout);

/**
 * POST /auth/logout-all
 * Log out from all devices and invalidate all refresh tokens.
 */
router.post("/logout-all", authenticate, authController.logoutAll);

/**
 * POST /auth/change-password
 * Change password while authenticated (invalidates other sessions).
 */
router.post("/change-password", authenticate, authController.changePassword);

/**
 * PATCH /auth/update-profile
 * Update current user profile.
 */
router.patch("/update-profile", authenticate, authController.updateProfile);

/**
 * GET /auth/me
 * Get current user profile (requires valid access token).
 */
router.get("/me", authenticate, authController.getMe);

export default router;

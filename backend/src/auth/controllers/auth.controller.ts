import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import * as authService from "../services/auth.service.js";
import {
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  REFRESH_COOKIE_NAME,
} from "../utils/cookie.util.js";
import {
  registerSchema,
  verifyEmailSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  resendOtpSchema,
} from "../validators/auth.validator.js";
import { AppError } from "../utils/AppError.js";
import type { AuthenticatedRequest } from "../types/auth.types.js";

// ── Shared helpers ────────────────────────────────────────────────────────────

/** Parse and validate a request against a Zod schema. Throws AppError(422) on failure. */
const validate = <T>(schema: ZodSchema<T>, req: Request): T => {
  const result = schema.safeParse({
    body: req.body,
    params: req.params,
    query: req.query,
  });
  if (!result.success) {
    const errors = result.error.errors.map((e) => ({
      field: e.path.slice(1).join("."), // drop the leading "body" segment
      message: e.message,
    }));
    throw Object.assign(new AppError("Validation failed.", 422), { errors });
  }
  return result.data;
};

/** Standard success response shape. */
const ok = (res: Response, message: string, data?: object, statusCode = 200) =>
  res
    .status(statusCode)
    .json({ success: true, message, ...(data ? { data } : {}) });

// ── Centralized error handler (used by each controller method) ───────────────

const handleError = (err: unknown, next: NextFunction) => next(err);

// ==================== Register ====================

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { body } = validate(registerSchema, req);
    const result = await authService.register(body);
    ok(
      res,
      "Account created successfully. Please check your email for the verification OTP.",
      result,
      201,
    );
  } catch (err) {
    handleError(err, next);
  }
};

// ==================== Verify Email ====================

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { body } = validate(verifyEmailSchema, req);
    await authService.verifyEmail(body.userId, body.otp);
    ok(res, "Email verified successfully. You can now log in.");
  } catch (err) {
    handleError(err, next);
  }
};

// ==================== Login ====================

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { body } = validate(loginSchema, req);
    const result = await authService.login(body);

    setRefreshTokenCookie(res, result.refreshToken);

    ok(res, "Login successful.", {
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (err) {
    handleError(err, next);
  }
};

// ==================== Refresh Token ====================

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const incomingRefreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as
      | string
      | undefined;

    if (!incomingRefreshToken) {
      throw new AppError("Refresh token not found. Please log in again.", 401);
    }

    const result = await authService.refreshTokens(incomingRefreshToken);

    setRefreshTokenCookie(res, result.refreshToken);

    ok(res, "Token refreshed successfully.", {
      accessToken: result.accessToken,
    });
  } catch (err) {
    handleError(err, next);
  }
};

// ==================== Logout ====================

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authedReq = req as AuthenticatedRequest;
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as
      | string
      | undefined;

    if (!refreshToken) {
      throw new AppError("Refresh token not found.", 400);
    }

    await authService.logout(
      authedReq.user.userId,
      authedReq.token,
      refreshToken,
    );

    clearRefreshTokenCookie(res);
    ok(res, "Logged out successfully.");
  } catch (err) {
    handleError(err, next);
  }
};

// ==================== Logout All Devices ====================

export const logoutAll = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authedReq = req as AuthenticatedRequest;
    await authService.logoutAllDevices(authedReq.user.userId, authedReq.token);
    clearRefreshTokenCookie(res);
    ok(res, "Logged out from all devices successfully.");
  } catch (err) {
    handleError(err, next);
  }
};

// ==================== Forgot Password ====================

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { body } = validate(forgotPasswordSchema, req);
    await authService.forgotPassword(body.email);
    // Always return 200 — prevent user enumeration
    ok(
      res,
      "If an account exists for this email, a password reset OTP has been sent.",
    );
  } catch (err) {
    handleError(err, next);
  }
};

// ==================== Reset Password ====================

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { body } = validate(resetPasswordSchema, req);
    await authService.resetPassword(body);
    ok(
      res,
      "Password reset successfully. Please log in with your new password.",
    );
  } catch (err) {
    handleError(err, next);
  }
};

// ==================== Change Password ====================

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { body } = validate(changePasswordSchema, req);
    const authedReq = req as AuthenticatedRequest;
    const refreshToken = req.cookies?.[REFRESH_COOKIE_NAME] as
      | string
      | undefined;

    const result = await authService.changePassword(
      authedReq.user.userId,
      refreshToken ?? "",
      body,
    );

    // Rotate the cookie with the new refresh token
    setRefreshTokenCookie(res, result.newRefreshToken);

    ok(
      res,
      "Password changed successfully. Other sessions have been invalidated.",
    );
  } catch (err) {
    handleError(err, next);
  }
};

// ==================== Resend OTP ====================

export const resendOtp = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { body } = validate(resendOtpSchema, req);
    await authService.resendOtp(body);
    ok(res, "A new OTP has been sent to your registered email address.");
  } catch (err) {
    handleError(err, next);
  }
};

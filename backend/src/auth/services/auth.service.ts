import mongoose from "mongoose";
import User from "../../models/User.model.js";
import { AppError } from "../utils/AppError.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  getRemainingTTL,
} from "./token.service.js";
import {
  createOtp,
  validateOtp,
  canResendOtp,
  deleteOtp,
} from "./otp.service.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "./email.service.js";
import { getRedisClient } from "../../config/redis.js";
import type {
  RegisterInput,
  LoginInput,
  ResetPasswordInput,
  ChangePasswordInput,
  ResendOtpInput,
} from "../validators/auth.validator.js";

// ── Redis blacklist key ───────────────────────────────────────────────────────

const blacklistKey = (token: string) => `blacklist:${token}`;

// ==================== Register ====================

/**
 * Registers a new user.
 * - Checks for duplicate email/phone
 * - Hashes password with bcrypt (12 rounds)
 * - Sends a 6-digit email verification OTP (Redis, 10min TTL)
 * @returns The new user's _id as a string (needed for the verify-email step)
 */
export const register = async (
  input: RegisterInput,
): Promise<{ userId: string }> => {
  const { firstName, lastName, email, password, phone, role } = input;

  // Check duplicate email
  const existingByEmail = await User.findOne({ email }).lean();
  if (existingByEmail) {
    throw new AppError("An account with this email already exists.", 409);
  }

  // Check duplicate phone if provided
  if (phone) {
    const existingByPhone = await User.findOne({ phone }).lean();
    if (existingByPhone) {
      throw new AppError(
        "An account with this phone number already exists.",
        409,
      );
    }
  }

  const passwordHash = await hashPassword(password);

  // Roles require a Role document — use a placeholder ObjectId for now.
  // In production wire this up to the actual Role collection lookup.
  const placeholderRoleId = new mongoose.Types.ObjectId();

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: passwordHash,
    phone: phone ?? "",
    role,
    roleId: placeholderRoleId,
    isEmailVerified: false,
    isPhoneVerified: false,
    isBlocked: false,
    loginProvider: "local",
    failedLoginAttempts: 0,
    accountStatus: "active",
  });

  // Generate and send verification OTP
  const otp = await createOtp("verify", user._id.toString());

  try {
    await sendVerificationEmail(email, otp, firstName);
  } catch (mailErr) {
    // Don't block registration if email fails — log and continue
    console.error("[auth.service] Failed to send verification email:", mailErr);
  }

  return { userId: user._id.toString() };
};

// ==================== Verify Email ====================

/**
 * Verifies the user's email using a one-time OTP stored in Redis.
 * Marks isEmailVerified: true on success.
 */
export const verifyEmail = async (
  userId: string,
  otp: string,
): Promise<void> => {
  const isValid = await validateOtp("verify", userId, otp);
  if (!isValid) {
    throw new AppError(
      "Invalid or expired OTP. Please request a new one.",
      400,
    );
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);
  if (user.isEmailVerified) {
    throw new AppError("Email is already verified.", 400);
  }

  user.isEmailVerified = true;
  await user.save();
};

// ==================== Login ====================

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

/**
 * Authenticates a user with email + password.
 * Pre-checks: email verified, account active, not banned.
 * On success: issues access + refresh tokens. Stores refresh token on user doc.
 */
export const login = async (input: LoginInput): Promise<LoginResult> => {
  const { email, password } = input;

  // Use a generic error for wrong credentials — never expose which field is wrong
  const GENERIC_AUTH_ERROR = new AppError("Invalid email or password.", 401);

  const user = await User.findOne({ email });
  if (!user) {
    console.warn(`[auth.service] Login failed — email not found: ${email}`);
    throw GENERIC_AUTH_ERROR;
  }

  // Check account status before verifying password (avoids timing leak)
  if (user.accountStatus === "deleted") {
    throw new AppError("This account no longer exists.", 403);
  }

  if (user.isBlocked) {
    throw new AppError(
      `Your account has been suspended. Reason: ${user.blockReason || "Contact support."}`,
      403,
    );
  }

  if (user.accountStatus === "suspended") {
    throw new AppError(
      "Your account has been suspended. Please contact support.",
      403,
    );
  }

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
    await user.save();
    console.warn(
      `[auth.service] Failed login attempt for ${email} — attempt #${user.failedLoginAttempts}`,
    );
    throw GENERIC_AUTH_ERROR;
  }

  if (!user.isEmailVerified) {
    throw new AppError(
      "Please verify your email before logging in. Check your inbox for the OTP.",
      403,
    );
  }

  // Reset failed attempts on successful login
  user.failedLoginAttempts = 0;
  user.lastLoginAt = new Date();

  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role as "buyer" | "seller" | "admin",
    email: user.email,
  });

  const refreshToken = signRefreshToken({
    userId: user._id.toString(),
    tokenVersion: 1, // increment via separate version field if needed
  });

  // Store refresh token in user document (supports multi-device login)
  // Cap to last 10 devices to prevent unbounded growth
  const MAX_SESSIONS = 10;
  user.refreshTokens = [
    ...(user.refreshTokens || []).slice(-MAX_SESSIONS + 1),
    refreshToken,
  ];

  await user.save();

  return {
    accessToken,
    refreshToken,
    user: {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
  };
};

// ==================== Refresh Token ====================

interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

/**
 * Rotates the refresh token.
 * - Verifies the incoming refresh token
 * - Confirms it exists in the user's refreshTokens array
 * - Issues a new access token and new refresh token
 * - Removes the old refresh token and stores the new one (rotation)
 */
export const refreshTokens = async (
  incomingRefreshToken: string,
): Promise<RefreshResult> => {
  const payload = verifyRefreshToken(incomingRefreshToken);

  const user = await User.findById(payload.userId);
  if (!user) throw new AppError("User not found.", 401);

  // Verify this token actually belongs to this user (prevents token reuse after logout)
  if (!user.refreshTokens?.includes(incomingRefreshToken)) {
    // Possible token reuse attack — invalidate all sessions
    user.refreshTokens = [];
    await user.save();
    throw new AppError(
      "Refresh token has already been used or revoked. Please log in again.",
      401,
    );
  }

  const newAccessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role as "buyer" | "seller" | "admin",
    email: user.email,
  });

  const newRefreshToken = signRefreshToken({
    userId: user._id.toString(),
    tokenVersion: 1,
  });

  // Rotate: remove old, add new
  user.refreshTokens = [
    ...user.refreshTokens.filter((t: string) => t !== incomingRefreshToken),
    newRefreshToken,
  ];
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// ==================== Logout ====================

/**
 * Logs out a single device session.
 * - Removes the refresh token from the user's array
 * - Blacklists the access token in Redis for its remaining TTL
 */
export const logout = async (
  userId: string,
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  const redis = getRedisClient();

  // Blacklist access token in Redis
  const ttl = getRemainingTTL(accessToken);
  if (ttl > 0) {
    await redis.set(blacklistKey(accessToken), "1", "EX", ttl);
  }

  // Remove refresh token from user document
  await User.findByIdAndUpdate(userId, {
    $pull: { refreshTokens: refreshToken },
  });
};

// ==================== Logout All Devices ====================

/**
 * Logs out all active sessions.
 * - Clears the entire refreshTokens array on the user document
 * - Blacklists the current access token in Redis
 */
export const logoutAllDevices = async (
  userId: string,
  accessToken: string,
): Promise<void> => {
  const redis = getRedisClient();

  const ttl = getRemainingTTL(accessToken);
  if (ttl > 0) {
    await redis.set(blacklistKey(accessToken), "1", "EX", ttl);
  }

  await User.findByIdAndUpdate(userId, { refreshTokens: [] });
};

// ==================== Forgot Password ====================

/**
 * Initiates a password reset flow.
 * Generates a 6-digit OTP stored in Redis under "otp:reset:<userId>".
 * Always returns successfully even if email is not found (prevents enumeration).
 */
export const forgotPassword = async (email: string): Promise<void> => {
  const user = await User.findOne({ email }).select("_id firstName email");

  // Silent return on unknown email — security: prevents user enumeration
  if (!user) {
    console.info(
      `[auth.service] Forgot password requested for unknown email: ${email}`,
    );
    return;
  }

  const otp = await createOtp("reset", user._id.toString());

  try {
    await sendPasswordResetEmail(email, otp, user.firstName);
  } catch (mailErr) {
    console.error(
      "[auth.service] Failed to send password reset email:",
      mailErr,
    );
  }
};

// ==================== Reset Password ====================

/**
 * Resets a user's password after OTP verification.
 * - Validates OTP from Redis
 * - Hashes and sets new password
 * - Clears all refresh tokens (logs out all devices)
 */
export const resetPassword = async (
  input: ResetPasswordInput,
): Promise<void> => {
  const { userId, otp, newPassword } = input;

  const isValid = await validateOtp("reset", userId, otp);
  if (!isValid) {
    throw new AppError(
      "Invalid or expired OTP. Please request a new one.",
      400,
    );
  }

  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);

  user.password = await hashPassword(newPassword);
  user.refreshTokens = []; // invalidate all existing sessions
  await user.save();
};

// ==================== Change Password ====================

/**
 * Changes password for an authenticated user.
 * - Verifies current password
 * - Hashes and updates to new password
 * - Invalidates all other sessions (keeps current refresh token)
 */
export const changePassword = async (
  userId: string,
  currentRefreshToken: string,
  input: ChangePasswordInput,
): Promise<{ newRefreshToken: string }> => {
  const { currentPassword, newPassword } = input;

  const user = await User.findById(userId);
  if (!user) throw new AppError("User not found.", 404);

  const isMatch = await comparePassword(currentPassword, user.password);
  if (!isMatch) {
    throw new AppError("Current password is incorrect.", 400);
  }

  user.password = await hashPassword(newPassword);

  // Issue a new refresh token for the current session, invalidate all others
  const newRefreshToken = signRefreshToken({ userId, tokenVersion: 1 });
  user.refreshTokens = [newRefreshToken];
  user.passwordChangedAt = new Date();

  await user.save();

  return { newRefreshToken };
};

// ==================== Resend OTP ====================

/**
 * Resends an OTP if the cooldown has expired (< 8 minutes remaining on old OTP).
 * Rejects if a recent OTP still has more than 8 minutes left.
 */
export const resendOtp = async (input: ResendOtpInput): Promise<void> => {
  const { userId, type } = input;

  const allowed = await canResendOtp(type, userId);
  if (!allowed) {
    throw new AppError(
      "Please wait before requesting a new OTP. Your current OTP is still valid.",
      429,
    );
  }

  const user = await User.findById(userId).select("firstName email");
  if (!user) throw new AppError("User not found.", 404);

  // Delete any existing OTP before issuing a new one
  await deleteOtp(type, userId);
  const otp = await createOtp(type, userId);

  try {
    if (type === "verify") {
      await sendVerificationEmail(user.email, otp, user.firstName);
    } else {
      await sendPasswordResetEmail(user.email, otp, user.firstName);
    }
  } catch (mailErr) {
    console.error("[auth.service] Failed to resend OTP email:", mailErr);
  }
};

import { getRedisClient } from "../../config/redis.js";
import { OtpType } from "../types/auth.types.js";

// OTP expires in 10 minutes = 600 seconds
const OTP_TTL_SECONDS = 600;

// "Cool-down" — reject resend if OTP has more than 8 minutes left
const OTP_RESEND_COOLDOWN_SECONDS = 480;

/**
 * Generates a cryptographically random 6-digit OTP.
 */
const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Builds the Redis key for a given OTP type and userId.
 * Pattern: "otp:verify:<userId>" | "otp:reset:<userId>"
 */
const buildOtpKey = (type: OtpType, userId: string): string =>
  `otp:${type}:${userId}`;

/**
 * Generates, stores, and returns a new OTP for a user.
 * Stored in Redis with a 10-minute TTL.
 * @param type - "verify" for email verification, "reset" for password reset.
 * @param userId - The user's _id as a string.
 * @returns The generated 6-digit OTP string.
 */
export const createOtp = async (
  type: OtpType,
  userId: string,
): Promise<string> => {
  const redis = getRedisClient();
  const otp = generateOtp();
  const key = buildOtpKey(type, userId);
  await redis.set(key, otp, "EX", OTP_TTL_SECONDS);
  return otp;
};

/**
 * Validates the OTP for a user.
 * Returns `true` if valid and deletes the key from Redis.
 * Returns `false` if invalid or expired.
 * @param type - OTP type.
 * @param userId - The user's _id as a string.
 * @param otp - The OTP to validate.
 */
export const validateOtp = async (
  type: OtpType,
  userId: string,
  otp: string,
): Promise<boolean> => {
  const redis = getRedisClient();
  const key = buildOtpKey(type, userId);
  const stored = await redis.get(key);

  if (!stored || stored !== otp) return false;

  // OTP is valid — delete immediately (one-time use)
  await redis.del(key);
  return true;
};

/**
 * Deletes an OTP from Redis (e.g. on user delete or forced invalidation).
 * @param type - OTP type.
 * @param userId - The user's _id as a string.
 */
export const deleteOtp = async (
  type: OtpType,
  userId: string,
): Promise<void> => {
  const redis = getRedisClient();
  await redis.del(buildOtpKey(type, userId));
};

/**
 * Checks whether a resend request is allowed.
 * Returns `true` (allow) if OTP has less than 8 minutes remaining or doesn't exist.
 * Returns `false` (reject) if the OTP was recently generated (>8min TTL left).
 * @param type - OTP type.
 * @param userId - The user's _id as a string.
 */
export const canResendOtp = async (
  type: OtpType,
  userId: string,
): Promise<boolean> => {
  const redis = getRedisClient();
  const key = buildOtpKey(type, userId);
  const ttl = await redis.ttl(key); // -2 = key doesn't exist, -1 = no expiry, >=0 = seconds left

  // If OTP key doesn't exist or has less than the cooldown threshold remaining, allow resend
  return ttl < OTP_RESEND_COOLDOWN_SECONDS;
};

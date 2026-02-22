import jwt from "jsonwebtoken";
import { AppError } from "../../utils/AppError.js";
import { ITokenPayload, RefreshTokenPayload } from "../types/auth.types.js";

// ── Environment variable helpers ─────────────────────────────────────────────

const getAccessSecret = (): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret)
    throw new Error("JWT_ACCESS_SECRET is not defined in environment");
  return secret;
};

const getRefreshSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret)
    throw new Error("JWT_REFRESH_SECRET is not defined in environment");
  return secret;
};

// ── Access Token ─────────────────────────────────────────────────────────────

/**
 * Signs a short-lived access token (15 minutes).
 * Payload: { userId, role, email, deviceId? }
 */
export const signAccessToken = (payload: ITokenPayload): string => {
  return jwt.sign(payload, getAccessSecret(), {
    expiresIn: "15m",
    issuer: "ecoom-api",
    audience: "ecoom-client",
  });
};

/**
 * Verifies and decodes an access token.
 * Throws AppError(401) on invalid/expired tokens.
 */
export const verifyAccessToken = (token: string): ITokenPayload => {
  try {
    return jwt.verify(token, getAccessSecret(), {
      issuer: "ecoom-api",
      audience: "ecoom-client",
    }) as ITokenPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new AppError("Access token has expired. Please log in again.", 401);
    }
    throw new AppError("Invalid access token.", 401);
  }
};

/**
 * Decodes an access token WITHOUT verifying the signature.
 * Only used to extract the expiry time for Redis TTL on logout.
 */
export const decodeAccessToken = (token: string): ITokenPayload | null => {
  try {
    return jwt.decode(token) as ITokenPayload;
  } catch {
    return null;
  }
};

// ── Refresh Token ────────────────────────────────────────────────────────────

/**
 * Signs a long-lived refresh token (7 days).
 * Payload: { userId, tokenVersion, deviceId? }
 */
export const signRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, getRefreshSecret(), {
    expiresIn: "7d",
    issuer: "ecoom-api",
  });
};

/**
 * Verifies and decodes a refresh token.
 * Throws AppError(401) on invalid/expired tokens.
 */
export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
  try {
    return jwt.verify(token, getRefreshSecret(), {
      issuer: "ecoom-api",
    }) as RefreshTokenPayload;
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      throw new AppError(
        "Refresh token has expired. Please log in again.",
        401,
      );
    }
    throw new AppError("Invalid refresh token.", 401);
  }
};

/**
 * Utility: get remaining TTL of a JWT in seconds.
 * Used to set Redis blacklist TTL precisely.
 * Returns 0 if already expired.
 */
export const getRemainingTTL = (token: string): number => {
  try {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (!decoded?.exp) return 0;
    const remaining = decoded.exp - Math.floor(Date.now() / 1000);
    return Math.max(0, remaining);
  } catch {
    return 0;
  }
};

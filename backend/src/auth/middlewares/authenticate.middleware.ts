import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/token.service.js";
import { getRedisClient } from "../../config/redis.js";
import { AppError } from "../../utils/AppError.js";
import type { AuthenticatedRequest } from "../types/auth.types.js";

/**
 * authenticate middleware
 *
 * - Extracts Bearer token from the Authorization header
 * - Verifies the JWT signature (throws 401 on failure)
 * - Checks Redis token blacklist (for logged-out tokens)
 * - Attaches decoded payload to `req.user` and raw token to `req.token`
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(
        "Authentication required. Please provide a Bearer token.",
        401,
      );
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new AppError("Malformed Authorization header.", 401);
    }

    // Verify signature and decode payload
    const payload = verifyAccessToken(token);

    // Check if this token has been blacklisted (i.e. user already logged out)
    const redis = getRedisClient();
    const blacklisted = await redis.get(`blacklist:${token}`);
    if (blacklisted) {
      throw new AppError(
        "This session has been revoked. Please log in again.",
        401,
      );
    }

    // Attach to request for downstream use
    (req as AuthenticatedRequest).user = payload;
    (req as AuthenticatedRequest).token = token;

    next();
  } catch (err) {
    next(err);
  }
};

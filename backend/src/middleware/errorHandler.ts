import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError.js";
import { ZodError } from "zod";

/**
 * Centralized Express error handler.
 * Must be registered LAST in the middleware chain: app.use(errorHandler)
 *
 * Handles:
 *  - AppError instances (operational errors with a status code)
 *  - ZodError (validation failures)
 *  - Mongoose CastError (invalid ObjectId)
 *  - Mongoose duplicate key error (code 11000)
 *  - Generic unhandled errors (500)
 */
export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
): void => {
  // ── Operational errors (thrown intentionally via AppError) ────────────────
  if (err instanceof AppError) {
    if (err.statusCode === 401) {
      console.warn(`[errorHandler] Operational 401: ${err.message}`, {
          path: req.path,
          method: req.method,
      });
    }
    const body: Record<string, unknown> = {
      success: false,
      message: err.message,
    };

    // Include field-level errors if attached (e.g. from Zod validation)
    if ("errors" in err && Array.isArray((err as any).errors)) {
      body.errors = (err as any).errors;
    }

    res.status(err.statusCode).json(body);
    return;
  }

  // ── Mongoose bad ObjectId ─────────────────────────────────────────────────
  if (
    err instanceof Error &&
    err.name === "CastError" &&
    (err as any).kind === "ObjectId"
  ) {
    res.status(400).json({ success: false, message: "Invalid ID format." });
    return;
  }

  // ── Mongoose duplicate key (e.g. unique email/phone) ─────────────────────
  if (err instanceof Error && "code" in err && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyPattern || {})[0] ?? "field";
    res.status(409).json({
      success: false,
      message: `The ${field} you entered is already in use.`,
    });
    return;
  }

  // ── JWT errors (should normally be caught in token.service, but just in case)
  if (err instanceof Error && err.name === "JsonWebTokenError") {
    res.status(401).json({ success: false, message: "Invalid token." });
    return;
  }

  if (err instanceof Error && err.name === "TokenExpiredError") {
    res.status(401).json({ success: false, message: "Token has expired." });
    return;
  }

  // ── Unknown / programming errors ──────────────────────────────────────────
  console.error("💥 Unhandled error:", err);

  res.status(500).json({
    success: false,
    message:
      process.env.NODE_ENV === "production"
        ? "An unexpected error occurred. Please try again later."
        : err instanceof Error
          ? err.message
          : "Internal server error",
  });
};

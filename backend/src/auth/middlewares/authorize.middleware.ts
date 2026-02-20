import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError.js";
import type { AuthenticatedRequest, Role } from "../types/auth.types.js";

/**
 * authorize(...roles) — Role-based access control middleware.
 *
 * Must be used AFTER authenticate middleware (requires req.user).
 * Returns 403 if the authenticated user's role is not in the allowed list.
 *
 * @example
 * router.get("/admin/dashboard", authenticate, authorize("admin"), handler)
 * router.get("/seller/products", authenticate, authorize("admin", "seller"), handler)
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      next(new AppError("Authentication required.", 401));
      return;
    }

    if (!allowedRoles.includes(user.role as Role)) {
      next(
        new AppError(
          `Access denied. This resource requires one of: [${allowedRoles.join(", ")}]`,
          403,
        ),
      );
      return;
    }

    next();
  };
};

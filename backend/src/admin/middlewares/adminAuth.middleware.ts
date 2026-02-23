import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  admin?: any;
  adminId?: string;
}

interface JwtPayload {
  adminId: string;
  email: string;
  role: string;
}

/**
 * Verify Admin Token Middleware
 * Validates JWT token and extracts admin information
 */
export const verifyAdminToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No authentication token provided",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as JwtPayload;

    // Attach admin info to request
    req.adminId = decoded.adminId;
    req.admin = decoded;

    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/**
 * Verify Super Admin Role
 * Ensures only super admins can access certain endpoints
 */
export const verifySuperAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.admin?.role !== "super_admin") {
    return res.status(403).json({
      success: false,
      message: "Only Super Admins can access this resource",
    });
  }
  next();
};

/**
 * Verify Permission
 * Checks if admin has specific permission
 */
export const verifyPermission =
  (permissions: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    // Super admin has all permissions
    if (req.admin?.role === "super_admin") {
      return next();
    }

    // Check if admin has at least one of the required permissions
    const hasPermission = permissions.some((perm) =>
      req.admin?.permissions?.includes(perm)
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };

/**
 * Verify Admin Role
 * Ensures admin has one of the specified roles
 */
export const verifyAdminRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!roles.includes(req.admin?.role)) {
      return res.status(403).json({
        success: false,
        message: "Your role does not have access to this resource",
      });
    }
    next();
  };
};

/**
 * Optional Admin Auth
 * Does not require authentication but attaches admin info if token is provided
 */
export const optionalAdminAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as JwtPayload;
      req.adminId = decoded.adminId;
      req.admin = decoded;
    }
  } catch (error) {
    // Ignore auth errors for optional auth
  }

  next();
};

export default {
  verifyAdminToken,
  verifySuperAdmin,
  verifyPermission,
  verifyAdminRole,
  optionalAdminAuth,
};

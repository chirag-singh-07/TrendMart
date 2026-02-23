import { Router, Request, Response, NextFunction } from "express";
import * as adminController from "../controllers/adminController";
import { verifyAdminToken } from "../middlewares/adminAuth.middleware";
import { validateRequest } from "../../middleware/validate.middleware";
import { z } from "zod";

interface AuthRequest extends Request {
  admin?: any;
  adminId?: string;
}

const router = Router();

/**
 * Validation Schemas
 */

const createAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["super_admin", "admin", "moderator"]),
    permissions: z.array(z.string()).optional(),
  }),
});

const updateAdminSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    email: z.string().email().optional(),
    role: z.enum(["super_admin", "admin", "moderator"]).optional(),
    status: z.enum(["active", "inactive"]).optional(),
  }),
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
  }),
});

const permissionsSchema = z.object({
  body: z.object({
    permissions: z.array(z.string()).min(1, "At least one permission is required"),
  }),
});

const statusSchema = z.object({
  body: z.object({
    status: z.enum(["active", "inactive"]),
  }),
});

/**
 * Public Routes
 */

// Admin login
router.post(
  "/login",
  validateRequest(loginSchema),
  adminController.adminLogin
);

/**
 * Protected Routes (Require Admin Authentication)
 */

// Create new admin (Super Admin only)
router.post(
  "/create-user",
  verifyAdminToken,
  validateRequest(createAdminSchema),
  adminController.createAdminUser
);

// Get all admins
router.get("/users", verifyAdminToken, adminController.getAllAdmins);

// Get single admin by ID
router.get("/user/:id", verifyAdminToken, adminController.getAdminById);

// Update admin user
router.patch(
  "/update-user/:id",
  verifyAdminToken,
  validateRequest(updateAdminSchema),
  adminController.updateAdminUser
);

// Delete admin user
router.delete("/delete-user/:id", verifyAdminToken, adminController.deleteAdminUser);

// Change password (self)
router.post(
  "/change-password",
  verifyAdminToken,
  validateRequest(changePasswordSchema),
  adminController.changePassword
);

// Reset password (Super Admin only)
router.post(
  "/reset-password/:id",
  verifyAdminToken,
  validateRequest(
    z.object({
      body: z.object({
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
      }),
    })
  ),
  adminController.resetPassword
);

// Update permissions
router.patch(
  "/permissions/:id",
  verifyAdminToken,
  validateRequest(permissionsSchema),
  adminController.updatePermissions
);

// Change admin status
router.patch(
  "/status/:id",
  verifyAdminToken,
  validateRequest(statusSchema),
  adminController.changeAdminStatus
);

export default router;

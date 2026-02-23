import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin, { IAdmin } from "../../models/Admin.model.js";

interface AuthRequest extends Request {
  admin?: IAdmin;
  adminId?: string;
}

/**
 * Admin Controller - Handles all admin-related operations
 */

// Create new admin user
export const createAdminUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password, role, permissions } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(409).json({
        success: false,
        message: "Admin with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin
    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
      role,
      permissions: permissions || [],
      status: "active",
    });

    res.status(201).json({
      success: true,
      message: "Admin user created successfully",
      admin: admin.toJSON(),
    });
  } catch (error: any) {
    next(error);
  }
};

// Get all admin users
export const getAllAdmins = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { role, status } = req.query;

    let query: any = {};
    if (role) query.role = role;
    if (status) query.status = status;

    const admins = await Admin.find(query).select("-password");

    res.status(200).json({
      success: true,
      admins,
      total: admins.length,
    });
  } catch (error: any) {
    next(error);
  }
};

// Get single admin by ID
export const getAdminById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    const admin = await Admin.findById(id).select("-password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error: any) {
    next(error);
  }
};

// Update admin user
export const updateAdminUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { name, email, role, status } = req.body;

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== admin.email) {
      const existingAdmin = await Admin.findOne({ email });
      if (existingAdmin) {
        return res.status(409).json({
          success: false,
          message: "Email is already in use",
        });
      }
    }

    // Update fields
    if (name) admin.name = name;
    if (email) admin.email = email;
    if (role) admin.role = role;
    if (status) admin.status = status;

    await admin.save();

    res.status(200).json({
      success: true,
      message: "Admin user updated successfully",
      admin: admin.toJSON(),
    });
  } catch (error: any) {
    next(error);
  }
};

// Delete admin user
export const deleteAdminUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (req.adminId === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own admin account",
      });
    }

    const admin = await Admin.findByIdAndDelete(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin user not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin user deleted successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

// Admin login
export const adminLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Find admin
    const admin = await Admin.findOne({ email }).select("+password");

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if account is locked
    if (admin.isLocked()) {
      return res.status(403).json({
        success: false,
        message: "Account is locked due to multiple failed login attempts",
      });
    }

    // Check if status is active
    if (admin.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "This admin account is inactive",
      });
    }

    // Match password
    const isPasswordCorrect = await admin.matchPassword(password);

    if (!isPasswordCorrect) {
      await admin.incLoginAttempts();
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Reset login attempts on successful login
    await admin.resetLoginAttempts();

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
        role: admin.role,
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "24h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: admin.toJSON(),
    });
  } catch (error: any) {
    next(error);
  }
};

// Change password
export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new password",
      });
    }

    const admin = await Admin.findById(req.adminId).select("+password");

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Verify current password
    const isPasswordCorrect = await admin.matchPassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    admin.password = await bcrypt.hash(newPassword, 10);
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

// Reset password (by super admin)
export const resetPassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide new password",
      });
    }

    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    // Hash new password
    admin.password = await bcrypt.hash(newPassword, 10);
    admin.loginAttempts = 0;
    admin.lockoutUntil = undefined;
    await admin.save();

    res.status(200).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error: any) {
    next(error);
  }
};

// Update permissions
export const updatePermissions = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { permissions } = req.body;

    if (!Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "Permissions must be an array",
      });
    }

    const admin = await Admin.findByIdAndUpdate(
      id,
      { permissions },
      { new: true, runValidators: true }
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Permissions updated successfully",
      admin,
    });
  } catch (error: any) {
    next(error);
  }
};

// Change admin status
export const changeAdminStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const admin = await Admin.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Admin status updated successfully",
      admin,
    });
  } catch (error: any) {
    next(error);
  }
};

export default {
  createAdminUser,
  getAllAdmins,
  getAdminById,
  updateAdminUser,
  deleteAdminUser,
  adminLogin,
  changePassword,
  resetPassword,
  updatePermissions,
  changeAdminStatus,
};

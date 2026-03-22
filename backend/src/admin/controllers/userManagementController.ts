import { Request, Response, NextFunction } from "express";
import User from "../../models/User.model.js";

interface AuthRequest extends Request {
  admin?: any;
  adminId?: string;
}

// ── Get all website users (admin view) ──────────────────────────────────────
export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { page = 1, limit = 20, role, status, search } = req.query;

    const filter: any = {};
    if (role) filter.role = role;
    if (status) filter.accountStatus = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -refreshTokens")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      users,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    next(error);
  }
};

// ── Update user account status ───────────────────────────────────────────────
export const updateUserStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const { status, isBlocked, blockReason } = req.body;

    const updates: any = {};
    if (status) updates.accountStatus = status;
    if (isBlocked !== undefined) updates.isBlocked = isBlocked;
    if (blockReason !== undefined) updates.blockReason = blockReason;

    const user = await User.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User account updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete user (soft/hard) ──────────────────────────────────────────────────
export const deleteUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    // We'll do a soft delete for now by suspending
    const user = await User.findByIdAndUpdate(id, { accountStatus: "deleted" });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User marked as deleted" });
  } catch (error) {
    next(error);
  }
};

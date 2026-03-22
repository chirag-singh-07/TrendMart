import { Request, Response, NextFunction } from "express";
import Banner from "../../models/Banner.model.js";

interface AuthRequest extends Request {
  admin?: any;
  adminId?: string;
}

// ── Get all banners (admin) ─────────────────────────────────────────────────
export const getAllBanners = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { appTarget, isActive } = req.query;

    const filter: any = {};
    if (appTarget) filter.appTarget = appTarget;
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const banners = await Banner.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      banners,
      total: banners.length,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get banner by ID ────────────────────────────────────────────────────────
export const getBannerById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

// ── Create banner ───────────────────────────────────────────────────────────
export const createBanner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, image, redirectUrl, targetAudience, appTarget, startDate, endDate, isActive } = req.body;

    if (!title || !image || !appTarget || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, image, appTarget, startDate and endDate",
      });
    }

    const banner = await Banner.create({
      title,
      image,
      redirectUrl,
      targetAudience: targetAudience || "all",
      appTarget,
      startDate,
      endDate,
      isActive: isActive !== undefined ? isActive : true,
    });

    res.status(201).json({
      success: true,
      message: "Banner created successfully",
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// ── Update banner ───────────────────────────────────────────────────────────
export const updateBanner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const banner = await Banner.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// ── Toggle banner active status ─────────────────────────────────────────────
export const toggleBannerStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.status(200).json({
      success: true,
      message: `Banner ${banner.isActive ? "activated" : "deactivated"} successfully`,
      banner,
    });
  } catch (error) {
    next(error);
  }
};

// ── Delete banner ───────────────────────────────────────────────────────────
export const deleteBanner = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByIdAndDelete(id);

    if (!banner) {
      return res.status(404).json({ success: false, message: "Banner not found" });
    }

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

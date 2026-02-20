import { Request, Response, NextFunction } from "express";
import { uploadService } from "../services/upload.service.js";
import { AppError } from "../../auth/utils/AppError.js";

/**
 * Standard success response helper
 */
const ok = (res: Response, message: string, data?: any) =>
  res.status(200).json({ success: true, message, ...(data ? { data } : {}) });

/**
 * Upload Controller - Handlers for different upload types
 */
export class UploadController {
  // --- Avatar ---
  uploadAvatar = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw new AppError("No file uploaded", 400);
      const result = await uploadService.processSingleFile(req.file, "avatars");
      ok(res, "Avatar uploaded successfully", result);
    } catch (err) {
      next(err);
    }
  };

  // --- Product Images ---
  uploadProductImages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0)
        throw new AppError("No files uploaded", 400);

      const images = await uploadService.processMultipleFiles(
        files,
        "products",
      );
      const thumbnail = await uploadService.generateThumbnail(files[0]);

      ok(res, "Product images uploaded successfully", { images, thumbnail });
    } catch (err) {
      next(err);
    }
  };

  // --- Banner ---
  uploadBanner = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw new AppError("No file uploaded", 400);
      const result = await uploadService.processSingleFile(req.file, "banners");
      ok(res, "Banner uploaded successfully", result);
    } catch (err) {
      next(err);
    }
  };

  // --- Shop Image ---
  uploadShopImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw new AppError("No file uploaded", 400);
      const result = await uploadService.processSingleFile(req.file, "shops");
      ok(res, "Shop image uploaded successfully", result);
    } catch (err) {
      next(err);
    }
  };

  // --- Review Images ---
  uploadReviewImages = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0)
        throw new AppError("No files uploaded", 400);

      const results = await uploadService.processMultipleFiles(
        files,
        "reviews",
      );
      ok(res, "Review images uploaded successfully", results);
    } catch (err) {
      next(err);
    }
  };

  // --- Document ---
  uploadDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) throw new AppError("No file uploaded", 400);
      const result = await uploadService.processSingleFile(
        req.file,
        "documents",
      );
      ok(res, "Document uploaded successfully", result);
    } catch (err) {
      next(err);
    }
  };

  // --- Delete File ---
  deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { filePath } = req.body;
      if (!filePath) throw new AppError("File path is required", 400);

      await uploadService.deleteFile(filePath);
      ok(res, "File deleted successfully");
    } catch (err) {
      next(err);
    }
  };
}

export const uploadController = new UploadController();

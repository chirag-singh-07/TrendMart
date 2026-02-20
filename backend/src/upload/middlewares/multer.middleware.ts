import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import { uploadConfig } from "../config/upload.config.js";
import { FolderKey } from "../types/upload.types.js";
import { AppError } from "../../utils/AppError.js";

// Use memoryStorage as we process images through Sharp before saving
const storage = multer.memoryStorage();

/**
 * Creates a configured multer middleware
 */
const createMulterMiddleware = (folder: FolderKey, maxCount: number) => {
  const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback,
  ) => {
    const isDocument = folder === "documents";
    const allowedTypes = isDocument
      ? [...uploadConfig.allowedMimeTypes, "application/pdf"]
      : uploadConfig.allowedMimeTypes;

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new AppError(
          isDocument
            ? "Invalid file type. Only JPEG, PNG, WebP, and PDF allowed for documents."
            : "Invalid file type. Only JPEG, PNG, WebP allowed.",
          400,
        ) as any,
      );
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: uploadConfig.maxFileSizeMB * 1024 * 1024,
    },
  });
};

// Named middlewares
export const uploadAvatar = createMulterMiddleware("avatars", 1).single(
  "avatar",
);
export const uploadProductImage = createMulterMiddleware("products", 5).array(
  "images",
  5,
);
export const uploadBannerImage = createMulterMiddleware("banners", 1).single(
  "image",
);
export const uploadShopImage = createMulterMiddleware("shops", 1).single(
  "image",
);
export const uploadReviewImages = createMulterMiddleware("reviews", 3).array(
  "images",
  3,
);
export const uploadDocument = createMulterMiddleware("documents", 1).single(
  "document",
);

/**
 * Handles Multer errors and returns consistent error responses
 */
export const handleMulterError = (err: any, req: any, res: any, next: any) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return next(
        new AppError(
          `File too large. Max size is ${uploadConfig.maxFileSizeMB}MB`,
          400,
        ),
      );
    }
    return next(new AppError(err.message, 400));
  }
  next(err);
};

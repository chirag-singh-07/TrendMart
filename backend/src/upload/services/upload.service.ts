import fs from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import sharp from "sharp";
import { uploadConfig } from "../config/upload.config.js";
import { IUploadedFile, FolderKey } from "../types/upload.types.js";
import {
  generateUUIDFilename,
  getFileExtension,
  getFileSizeKB,
  buildFileUrl,
} from "../utils/fileHelper.util.js";

/**
 * Service for handling file uploads and image processing
 */
export class UploadService {
  /**
   * Processes a single file: optimizes images using Sharp or saves documents as-is.
   *
   * @param file - The file object from Multer (memoryStorage)
   * @param folder - The target folder key from config
   * @returns Metadata of the uploaded and processed file
   */
  async processSingleFile(
    file: Express.Multer.File,
    folder: FolderKey,
  ): Promise<IUploadedFile> {
    const folderConfig = uploadConfig.folders[folder];
    const isDocument = folder === "documents";
    const extension = isDocument ? getFileExtension(file.mimetype) : "webp";
    const filename = generateUUIDFilename(extension);
    const relativePath = path.join(folderConfig.path, filename);
    const absolutePath = path.join(process.cwd(), relativePath);

    let finalBuffer: Buffer;
    let width: number | undefined;
    let height: number | undefined;

    if (!isDocument) {
      // Process Image with Sharp
      const sharpInstance = sharp(file.buffer);

      if (folderConfig.width && folderConfig.height) {
        sharpInstance.resize({
          width: folderConfig.width,
          height: folderConfig.height,
          fit: folderConfig.fit || "inside",
        });
      }

      sharpInstance
        .webp({ quality: folderConfig.quality || 80 })
        .withMetadata(); // Preserve EXIF

      const result = await sharpInstance.toBuffer({ resolveWithObject: true });
      finalBuffer = result.data;
      width = result.info.width;
      height = result.info.height;
    } else {
      // Save Document as-is
      finalBuffer = file.buffer;
    }

    // Save to Disk
    await fs.writeFile(absolutePath, finalBuffer);

    return {
      originalName: file.originalname,
      filename,
      folder,
      path: relativePath.replace(/\\/g, "/"),
      url: buildFileUrl(folder, filename),
      mimetype: isDocument ? file.mimetype : "image/webp",
      sizeKB: getFileSizeKB(finalBuffer),
      width,
      height,
    };
  }

  /**
   * Processes multiple files concurrently.
   *
   * @param files - Array of file objects from Multer
   * @param folder - The target folder key from config
   * @returns Array of metadata for all processed files
   */
  async processMultipleFiles(
    files: Express.Multer.File[],
    folder: FolderKey,
  ): Promise<IUploadedFile[]> {
    return Promise.all(
      files.map((file) => this.processSingleFile(file, folder)),
    );
  }

  /**
   * Deletes a file from the server.
   *
   * @param filePath - The relative path of the file to delete (e.g. "uploads/products/uuid.webp")
   */
  async deleteFile(filePath: string): Promise<void> {
    const absolutePath = path.join(process.cwd(), filePath);
    if (existsSync(absolutePath)) {
      await fs.unlink(absolutePath);
    } else {
      console.warn(`[UploadService] File not found for deletion: ${filePath}`);
    }
  }

  /**
   * Processes a file specifically into the "thumbnails" folder.
   *
   * @param file - The file object from Multer
   * @returns Metadata of the generated thumbnail
   */
  async generateThumbnail(file: Express.Multer.File): Promise<IUploadedFile> {
    return this.processSingleFile(file, "thumbnails");
  }
}

export const uploadService = new UploadService();

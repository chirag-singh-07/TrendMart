import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { FolderKey } from "../types/upload.types.js";

/**
 * Returns "<uuid>.<ext>" e.g. "a1b2c3.webp"
 */
export const generateUUIDFilename = (extension: string): string => {
  return `${uuidv4()}.${extension}`;
};

/**
 * Maps mimetype to extension
 */
export const getFileExtension = (mimetype: string): string => {
  const map: Record<string, string> = {
    "image/jpeg": "webp", // We convert all images to webp
    "image/png": "webp",
    "image/webp": "webp",
    "application/pdf": "pdf",
  };
  return map[mimetype] || mimetype.split("/")[1];
};

/**
 * Returns Math.round(buffer.length / 1024)
 */
export const getFileSizeKB = (buffer: Buffer): number => {
  return Math.round(buffer.length / 1024);
};

/**
 * Ensures directory exists
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Returns "/uploads/<folder>/<filename>"
 */
export const buildFileUrl = (folder: FolderKey, filename: string): string => {
  return `/uploads/${folder}/${filename}`;
};

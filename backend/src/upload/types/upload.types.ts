export type FolderKey =
  | "avatars"
  | "products"
  | "thumbnails"
  | "banners"
  | "shops"
  | "reviews"
  | "documents";

export interface IUploadedFile {
  originalName: string;
  filename: string; // UUID-based e.g. "a1b2c3d4-uuid.webp"
  folder: FolderKey;
  path: string; // relative e.g. "uploads/products/uuid.webp"
  url: string; // public URL e.g. "/uploads/products/uuid.webp"
  mimetype: string;
  sizeKB: number; // size AFTER sharp optimization
  width?: number;
  height?: number;
}

export interface IUploadResult {
  success: boolean;
  files: IUploadedFile[];
}

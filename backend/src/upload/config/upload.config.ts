export const uploadConfig = {
  baseUploadDir: "uploads",
  maxFileSizeMB: 5,
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  folders: {
    avatars: {
      path: "uploads/avatars",
      width: 200,
      height: 200,
      quality: 80,
      fit: "cover" as const,
    },
    products: {
      path: "uploads/products",
      width: 800,
      height: 800,
      quality: 85,
      fit: "inside" as const,
    },
    thumbnails: {
      path: "uploads/thumbnails",
      width: 300,
      height: 300,
      quality: 80,
      fit: "inside" as const,
    },
    banners: {
      path: "uploads/banners",
      width: 1200,
      height: 400,
      quality: 90,
      fit: "cover" as const,
    },
    shops: {
      path: "uploads/shops",
      width: 600,
      height: 600,
      quality: 85,
      fit: "cover" as const,
    },
    reviews: {
      path: "uploads/reviews",
      width: 600,
      height: 600,
      quality: 80,
      fit: "inside" as const,
    },
    documents: {
      path: "uploads/documents",
      width: null,
      height: null,
      quality: null,
      fit: null,
    },
  },
};

export type FolderKey = keyof typeof uploadConfig.folders;

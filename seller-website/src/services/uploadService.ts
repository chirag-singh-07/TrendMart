import api from "../lib/api";

export const uploadService = {
  uploadProductImages: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await api.post("/upload/product-images", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  deleteFile: async (filePath: string) => {
    const response = await api.delete("/upload/file", { data: { filePath } });
    return response.data;
  },
};

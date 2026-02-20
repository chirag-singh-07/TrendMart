# 📁 Robust File Upload & Image Optimization System

A production-ready file upload solution for the E-Commerce backend using **Multer** for handling multipart/form-data and **Sharp** for high-performance image processing.

---

## 🚀 Features

- **Auto-Optimization**: Automatically converts all images to `.webp` format for superior compression.
- **Dynamic Resizing**: Resizes images based on their context (avatars, products, banners, etc.) as defined in the config.
- **Memory Efficient**: Uses memory storage during upload — files are processed in-buffer via Sharp and only saved to disk once optimized.
- **UUID Filenames**: Prevents filename collisions and obscures original filenames for security.
- **Safe Directory Management**: Automatically creates the required directory structure on server startup.
- **Static Serving**: Uploaded files are served via `/uploads` with high performance.
- **Security**:
  - Role-based access control (RBAC) on all upload routes.
  - Strict mimetype validation.
  - Configurable file size limits (default 5MB).
  - EXIF metadata preservation.

---

## 🛠️ Folder Structure

```text
src/upload/
├── config/             # Centralized configuration (dimensions, quality, paths)
├── controllers/        # Route handlers for different upload types
├── middlewares/        # Multer configuration and file filtering
├── routes/             # RBAC protected API endpoints
├── services/           # Business logic (Sharp processing, file deletion)
├── types/              # TypeScript interfaces and types
└── utils/              # Filename and directory helpers
```

---

## ⚙️ Configuration (`upload.config.ts`)

| Folder | Dimensions | Quality | Fit Strategy |
| :--- | :--- | :--- | :--- |
| **Avatars** | 200x200 | 80% | `cover` |
| **Products** | 800x800 | 85% | `inside` |
| **Thumbnails** | 300x300 | 80% | `inside` |
| **Banners** | 1200x400 | 90% | `cover` |
| **Shops** | 600x600 | 85% | `cover` |
| **Reviews** | 600x600 | 80% | `inside` |
| **Documents** | N/A (Original) | N/A | Saved as-is (PDF/Images) |

---

## 🛣️ API Endpoints

All endpoints require a `Bearer <accessToken>` and follow the standard response envelope.

| Method | Endpoint | Allowed Roles | Middleware | Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/upload/avatar` | All | `single("avatar")` | Upload & crop user profile picture |
| `POST` | `/api/upload/product-images`| Seller, Admin | `array("images", 5)` | Upload up to 5 images + auto-gen thumbnail |
| `POST` | `/api/upload/banner` | Admin | `single("image")` | Upload high-quality store banners |
| `POST` | `/api/upload/shop-image` | Seller, Admin | `single("image")` | Upload shop logos or display images |
| `POST` | `/api/upload/review-images` | Buyer | `array("images", 3)` | Upload photos for product reviews |
| `POST` | `/api/upload/document` | Seller, Admin | `single("document")` | Save verification PDFs or images as-is |
| `DELETE`| `/api/upload/file` | Admin | N/A | Delete a file via relative path |

---

## 📤 Request Examples

### Single Image (Avatar)
**Header**: `Content-Type: multipart/form-data`
**Body**: `avatar: <file_binary>`

### Multiple Images (Products)
**Header**: `Content-Type: multipart/form-data`
**Body**:
- `images: <file_1>`
- `images: <file_2>`

---

## 📥 Response Example (Success)

```json
{
  "success": true,
  "message": "Product images uploaded successfully",
  "data": {
    "images": [
      {
        "originalName": "camera.jpg",
        "filename": "f47ac10b-58cc-4372-a567-0e02b2c3d479.webp",
        "folder": "products",
        "path": "uploads/products/f47ac10b-58cc-4372-a567-0e02b2c3d479.webp",
        "url": "/uploads/products/f47ac10b-58cc-4372-a567-0e02b2c3d479.webp",
        "mimetype": "image/webp",
        "sizeKB: 142,
        "width": 800,
        "height": 533
      }
    ],
    "thumbnail": {
      "originalName": "camera.jpg",
      "filename": "3d9c2e1f-...",
      "folder": "thumbnails",
      "url": "/uploads/thumbnails/3d9c2e1f-...",
      "sizeKB": 45
    }
  }
}
```

---

## 🧩 Usage in Frontend

You can access images directly via your server URL:
`http://localhost:5000/uploads/products/<filename>.webp`

To delete a file (Admin only):
`DELETE /api/upload/file` with body `{ "filePath": "uploads/products/..." }`

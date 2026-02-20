import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import path from "path";

import { validateEnv } from "./config/env.validator.js";
import connectDB from "./config/database.js";
import authRouter from "./auth/routes/auth.routes.js";
import uploadRouter from "./upload/routes/upload.routes.js";
import categoryRouter from "./product/routes/category.routes.js";
import productRouter from "./product/routes/product.routes.js";
import variantRouter from "./product/routes/variant.routes.js";
import cartRouter from "./cart/routes/cart.routes.js";
import wishlistRouter from "./cart/routes/wishlist.routes.js";
import {
  buyerOrderRoutes,
  sellerOrderRoutes,
} from "./order/routes/order.routes.js";
import adminOrderRouter from "./order/routes/adminOrder.routes.js";
import {
  couponRoutes,
  adminCouponRoutes,
} from "./coupon/routes/coupon.routes.js";
import couponUsageRouter from "./coupon/routes/couponUsage.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { uploadConfig } from "./upload/config/upload.config.js";
import { ensureDirectoryExists } from "./upload/utils/fileHelper.util.js";

// Validate all required env vars before starting
validateEnv();
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000";

// ── Global middleware ─────────────────────────────────────────────────────────

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true, // required for cookies to work cross-origin
  }),
);

app.use(express.json({ limit: "10kb" })); // prevent large payload attacks
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // parse httpOnly cookies (refresh token)

// Serve static files from uploads folder
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ── Routes ───────────────────────────────────────────────────────────────────

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "API Running 🚀" });
});

app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/products", productRouter);
app.use("/api/products/:productId/variants", variantRouter);
app.use("/api/cart", cartRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/orders", buyerOrderRoutes);
app.use("/api/seller/orders", sellerOrderRoutes);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/coupons", couponRoutes);
app.use("/api/coupons/me", couponUsageRouter);
app.use("/api/admin/coupons", adminCouponRoutes);

// ── 404 handler ───────────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "The requested endpoint does not exist.",
  });
});

// ── Centralized error handler (MUST be last) ──────────────────────────────────

app.use(errorHandler);

// ── Bootstrap ─────────────────────────────────────────────────────────────────

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://${BACKEND_URL}:${PORT}`);
    console.log(`📌 Auth endpoints: http://${BACKEND_URL}:${PORT}/api/auth`);
    console.log(
      `📌 Upload endpoints: http://${BACKEND_URL}:${PORT}/api/upload`,
    );
    console.log(
      `📌 Category endpoints: http://${BACKEND_URL}:${PORT}/api/categories`,
    );
    console.log(
      `📌 Product endpoints: http://${BACKEND_URL}:${PORT}/api/products`,
    );
    console.log(
      `📌 Variant endpoints: http://${BACKEND_URL}:${PORT}/api/products/:productId/variants`,
    );
    console.log(`📌 Cart endpoints: http://${BACKEND_URL}:${PORT}/api/cart`);
    console.log(
      `📌 Wishlist endpoints: http://${BACKEND_URL}:${PORT}/api/wishlist`,
    );
    console.log(`📌 Order endpoints: http://${BACKEND_URL}:${PORT}/api/orders`);
    console.log(
      `📌 Seller Order endpoints: http://${BACKEND_URL}:${PORT}/api/seller/orders`,
    );
    console.log(
      `📌 Admin Order endpoints: http://${BACKEND_URL}:${PORT}/api/admin/orders`,
    );
    console.log(
      `📌 Coupon endpoints: http://${BACKEND_URL}:${PORT}/api/coupons`,
    );
    console.log(
      `📌 Coupon Usage endpoints: http://${BACKEND_URL}:${PORT}/api/coupons/me`,
    );
    console.log(
      `📌 Admin Coupon endpoints: http://${BACKEND_URL}:${PORT}/api/admin/coupons`,
    );

    // Initialize upload directories
    Object.values(uploadConfig.folders).forEach((folder) => {
      ensureDirectoryExists(path.join(process.cwd(), folder.path));
    });
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

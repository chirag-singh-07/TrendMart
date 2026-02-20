import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

import path from "path";
import { validateEnv } from "./config/env.validator.js";
import connectDB from "./config/database.js";
import authRouter from "./auth/routes/auth.routes.js";
import uploadRouter from "./upload/routes/upload.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { uploadConfig } from "./upload/config/upload.config.js";
import { ensureDirectoryExists } from "./upload/utils/fileHelper.util.js";

// Validate all required env vars before starting
validateEnv();

const app = express();
const PORT = process.env.PORT || 5000;

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
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📌 Auth endpoints: http://localhost:${PORT}/api/auth`);
    console.log(`📌 Upload endpoints: http://localhost:${PORT}/api/upload`);

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

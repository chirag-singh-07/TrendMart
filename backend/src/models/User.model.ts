import mongoose from "mongoose";
import { IUser } from "../interfaces";

const userSchema = new mongoose.Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true, index: true },
    avatar: { type: String },
    role: {
      type: String,
      required: true,
      enum: [
        "admin",
        "seller",
        "buyer",
        "delivery",
        "distributor",
        "developer",
      ],
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
    blockReason: { type: String },
    loginProvider: {
      type: String,
      required: true,
      enum: ["local", "google", "apple"],
    },
    lastLoginAt: { type: Date },
    passwordChangedAt: { type: Date },
    failedLoginAttempts: { type: Number, default: 0 },
    accountStatus: {
      type: String,
      required: true,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    metadata: {
      deviceInfo: { type: String },
      ipHistory: [{ type: String }],
    },
    // ── Auth fields ──────────────────────────────────────────────────────────
    refreshTokens: {
      type: [String],
      default: [],
      select: false, // never returned in queries by default
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

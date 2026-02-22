import express from "express";
import mongoose from "mongoose";

export type Role =
  | "buyer"
  | "seller"
  | "admin"
  | "delivery"
  | "distributor"
  | "developer";

export interface ITokenPayload {
  userId: string;
  role: Role;
  email: string;
  deviceId?: string; // made optional to allow login without explicit device tracking
}

export interface IRefreshTokenEntry {
  token: string;
  deviceId: string;
  createdAt: Date;
  expiresAt: Date;
}

export interface IDeviceInfo {
  deviceId: string; // UUID v4 generated on first login
  deviceName: string; // e.g. "Chrome on Windows"
  browser: string;
  os: string;
  ip: string;
  lastActiveAt: Date;
}

export interface ILoginActivityEntry {
  userId: mongoose.Types.ObjectId;
  role: Role;
  ip: string;
  deviceId: string;
  deviceName: string;
  browser: string;
  os: string;
  status: "success" | "failed";
  failureReason?: string;
  createdAt: Date;
}

export interface AppRequest extends express.Request {
  user?: ITokenPayload;
  deviceInfo?: IDeviceInfo;
}

export interface AccessTokenPayload {
  userId: string;
  role: Role;
  email: string;
  deviceId: string;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
  deviceId?: string;
}

export interface DecodedToken {
  userId: string;
  role: Role;
  email: string;
  deviceId: string;
  iat: number;
  exp: number;
}

export interface DecodedRefreshToken {
  userId: string;
  tokenVersion: number;
  iat: number;
  exp: number;
}

export interface TokenVerificationResult {
  isValid: boolean;
  userId?: string;
  role?: Role;
  email?: string;
  deviceId?: string;
  error?: string;
}

export interface TokenGenerationResult {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiry: Date;
  refreshTokenExpiry: Date;
}

export type OtpType = "verify" | "reset";

export interface AuthenticatedRequest extends express.Request {
  user?: ITokenPayload;
  deviceInfo?: IDeviceInfo;
}

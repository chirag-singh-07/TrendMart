import mongoose from "mongoose";

import { IRefreshToken } from "../interfaces";

const refreshTokenSchema = new mongoose.Schema<IRefreshToken>({
    tokenHash: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deviceInfo: { type: String, required: true },
    ipAddress: { type: String, required: true },
    isRevoked: { type: Boolean, default: false },
    revokedAt: { type: Date },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });

const RefreshToken = mongoose.models.RefreshToken || mongoose.model<IRefreshToken>("RefreshToken", refreshTokenSchema);

export default RefreshToken;
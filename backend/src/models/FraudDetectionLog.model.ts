import mongoose, { Schema, model, Document } from "mongoose";
import { IFraudDetectionLog, FraudReviewStatus } from "../interfaces";

// ==================== FraudDetectionLog Model ====================

export interface IFraudDetectionLogDocument
  extends IFraudDetectionLog, Document {}

const FraudDetectionLogSchema = new Schema<IFraudDetectionLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100, // 0-100, higher = riskier
    },
    flaggedReason: {
      type: [String],
      required: true, // multiple reasons can trigger
    },
    autoBlocked: { type: Boolean, required: true, default: false },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User", // admin who reviewed
    },
    reviewStatus: {
      type: String,
      enum: [
        "pending",
        "cleared",
        "confirmed_fraud",
      ] satisfies FraudReviewStatus[],
      default: "pending",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// admin review queue — unreviewed high-risk cases
FraudDetectionLogSchema.index({ reviewStatus: 1, riskScore: -1 });

// all fraud logs for a user
FraudDetectionLogSchema.index({ userId: 1 });

// fraud logs linked to a specific order
FraudDetectionLogSchema.index({ orderId: 1 });

const FraudDetectionLog =
  mongoose.models.FraudDetectionLog ||
  model<IFraudDetectionLogDocument>(
    "FraudDetectionLog",
    FraudDetectionLogSchema,
  );

export default FraudDetectionLog;

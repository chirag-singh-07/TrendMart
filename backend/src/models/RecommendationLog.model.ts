import mongoose, { Schema, model, Document } from "mongoose";
import { IRecommendationLog } from "../interfaces";

// ==================== RecommendationLog Model ====================

export interface IRecommendationLogDocument
  extends IRecommendationLog, Document {}

const RecommendationLogSchema = new Schema<IRecommendationLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recommendedProducts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    algorithmVersion: { type: String, required: true }, // e.g. "v1.2.0"
    clickThroughRate: { type: Number }, // updated after user interaction
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// fetch recommendation history for a user
RecommendationLogSchema.index({ userId: 1, createdAt: -1 });

// ML model evaluation — performance per algorithm version
RecommendationLogSchema.index({ algorithmVersion: 1 });

const RecommendationLog =
  mongoose.models.RecommendationLog ||
  model<IRecommendationLogDocument>(
    "RecommendationLog",
    RecommendationLogSchema,
  );

export default RecommendationLog;

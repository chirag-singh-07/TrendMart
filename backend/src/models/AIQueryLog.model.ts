import mongoose, { Schema, model, Document } from "mongoose";
import { IAIQueryLog, AIModel } from "../interfaces";

// ==================== AIQueryLog Model ====================

export interface IAIQueryLogDocument extends IAIQueryLog, Document {}

const AIQueryLogSchema = new Schema<IAIQueryLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // optional for unauthenticated queries
    },
    query: { type: String, required: true },
    response: { type: String, required: true },
    tokensUsed: { type: Number, required: true },
    modelUsed: {
      type: String,
      enum: [
        "gpt-4o",
        "gpt-4-turbo",
        "claude-3-5-sonnet",
        "gemini-1.5-pro",
      ] satisfies AIModel[],
      required: true,
    },
    responseTime: { type: Number, required: true }, // in milliseconds
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// cost tracking per user
AIQueryLogSchema.index({ userId: 1, createdAt: -1 });

// cost analysis per model
AIQueryLogSchema.index({ modelUsed: 1 });

// TTL — auto-delete logs older than 180 days
AIQueryLogSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 180 },
);

const AIQueryLog =
  mongoose.models.AIQueryLog ||
  model<IAIQueryLogDocument>("AIQueryLog", AIQueryLogSchema);

export default AIQueryLog;

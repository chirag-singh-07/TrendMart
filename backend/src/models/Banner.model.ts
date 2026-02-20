import mongoose, { Schema, model, Document } from "mongoose";
import { IBanner, TargetAudience, AppTarget } from "../interfaces";

// ==================== Banner Model ====================

export interface IBannerDocument extends IBanner, Document {}

const BannerSchema = new Schema<IBannerDocument>({
  title: { type: String, required: true, trim: true },
  image: { type: String, required: true },
  redirectUrl: { type: String },
  targetAudience: {
    type: String,
    enum: [
      "all",
      "buyers",
      "sellers",
      "new_users",
      "premium",
    ] satisfies TargetAudience[],
    default: "all",
  },
  appTarget: {
    type: String,
    enum: ["home", "category", "product", "checkout"] satisfies AppTarget[],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
});

// fetch active banners for a specific screen
BannerSchema.index({ appTarget: 1, isActive: 1, startDate: 1, endDate: 1 });

// audience targeting
BannerSchema.index({ targetAudience: 1 });

const Banner =
  mongoose.models.Banner || model<IBannerDocument>("Banner", BannerSchema);

export default Banner;

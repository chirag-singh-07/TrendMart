import mongoose, { Schema, model, Document } from "mongoose";
import {
  IReview,
  ModerationStatus,
} from "../interfaces";

// ==================== Review Model ====================

export interface IReviewDocument extends IReview, Document {}

const ReviewSchema = new Schema<IReviewDocument>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    images: [
      {
        type: String,
      },
    ],
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
    reportCount: {
      type: Number,
      default: 0,
    },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected", "flagged"] satisfies ModerationStatus[],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// one review per user per product
ReviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

// fetch all reviews for a product sorted by newest
ReviewSchema.index({ productId: 1, createdAt: -1 });

// admin moderation queue
ReviewSchema.index({ moderationStatus: 1 });

const Review = mongoose.models.Review || model<IReviewDocument>("Review", ReviewSchema);

export default Review;
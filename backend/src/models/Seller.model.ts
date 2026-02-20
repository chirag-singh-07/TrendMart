import mongoose from "mongoose";
import { ISeller, VerificationStatus } from "../interfaces";

const sellerSchema = new mongoose.Schema<ISeller>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // one seller profile per user
    },
    shopName: { type: String, required: true },
    shopSlug: { type: String, required: true, unique: true },
    shopLogo: { type: String },
    bannerImage: { type: String },
    description: { type: String, required: true },
    businessEmail: { type: String, required: true },
    businessAddress: { type: String, required: true },
    businessPhone: { type: String, required: true },
    gstNumber: { type: String },
    commissionRate: { type: Number, default: 0.05 }, // 5% default
    totalRevenue: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"] satisfies VerificationStatus[],
      default: "pending",
    },
    verificationDocuments: {
      businessLicense: { type: String },
      taxId: { type: String },
      otherDocuments: [{ type: String }],
    },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      other: { type: String },
    },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// fast lookup by seller's userId
sellerSchema.index({ userId: 1 });

// shop discovery by slug
sellerSchema.index({ shopSlug: 1 });

// admin panel — filter by verification status
sellerSchema.index({ verificationStatus: 1 });

const Seller =
  mongoose.models.Seller || mongoose.model<ISeller>("Seller", sellerSchema);

export default Seller;

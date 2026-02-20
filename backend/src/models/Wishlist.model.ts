import mongoose, { Schema, model, Document } from "mongoose";
import { IWishlist } from "../interfaces";

export interface IWishlistDocument extends IWishlist, Document {}

const WishlistSchema = new Schema<IWishlistDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,           // one wishlist per user
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// quickly fetch a user's wishlist
WishlistSchema.index({ userId: 1 });

// check if a specific product is in a user's wishlist
WishlistSchema.index({ userId: 1, products: 1 });

const Wishlist = mongoose.models.Wishlist || model<IWishlistDocument>("Wishlist", WishlistSchema);

export default Wishlist;
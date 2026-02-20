import mongoose from "mongoose";
import { ICategory } from "../../interfaces";

const CategorySchema = new mongoose.Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    parentCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null, // null = root category
    },
    level: { type: Number, default: 0 }, // 0 = root, 1 = sub, 2 = sub-sub
    image: { type: String },
    isActive: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }, // interface only has createdAt
);

// fetch active root categories for navbar
CategorySchema.index({ parentCategoryId: 1, isActive: 1 });

// category tree traversal
CategorySchema.index({ level: 1 });

const Category =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;

import { IReview, ModerationStatus } from "../../interfaces/index.js";

export interface ICreateReviewPayload {
  productId: string;
  orderId: string; // required to verify purchase
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  comment: string;
  images?: string[]; // uploaded via existing upload system
}

export interface IUpdateReviewPayload {
  rating?: 1 | 2 | 3 | 4 | 5;
  title?: string;
  comment?: string;
  images?: string[];
}

export interface IReviewFilters {
  productId?: string;
  userId?: string;
  rating?: number;
  isVerifiedPurchase?: boolean;
  moderationStatus?: ModerationStatus;
  fromDate?: Date;
  toDate?: Date;
  sortBy?:
    | "newest"
    | "oldest"
    | "highest_rating"
    | "lowest_rating"
    | "most_helpful";
  page?: number;
  limit?: number;
}

export interface IRatingSummary {
  productId: string;
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  verifiedPurchaseCount: number;
  withImagesCount: number;
}

export interface IReviewWithUser extends IReview {
  user: {
    _id: string;
    fullName: string;
    avatar?: string;
  };
}

export interface IEligibilityResult {
  isEligible: boolean;
  reason?: string;
  orderId?: string;
  alreadyReviewed?: boolean;
}

export interface IPaginatedReviewResult<T> {
  reviews: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

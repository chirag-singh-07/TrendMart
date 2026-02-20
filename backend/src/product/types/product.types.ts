import {
  ICategory,
  IProduct,
  IProductVariant,
  ProductStatus,
} from "../../interfaces";

export interface IProductFilters {
  categoryId?: string;
  sellerId?: string;
  status?: ProductStatus;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  tags?: string[];
  inStock?: boolean;
  search?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "rating" | "bestseller";
  page?: number;
  limit?: number;
}

export interface IPaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface IProductWithVariants extends IProduct {
  variants: IProductVariant[];
}

export interface ICategoryTree extends ICategory {
  children: ICategoryTree[];
}

export interface IStockUpdatePayload {
  productId: string;
  variantId?: string;
  quantity: number;
  operation: "increment" | "decrement" | "set";
}

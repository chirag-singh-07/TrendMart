import { ICartItem, ICartItemPriceSnapshot, IProduct } from "../../interfaces";

export interface IAddToCartPayload {
  productId: string;
  variantId?: string;
  quantity: number;
}

export interface IUpdateCartItemPayload {
  productId: string;
  variantId?: string;
  quantity: number; // new quantity (not delta)
}

export interface IRemoveCartItemPayload {
  productId: string;
  variantId?: string;
}

export interface ICartSummary {
  totalItems: number;
  totalAmount: number;
  currency: string;
  items: ICartItemDetail[];
}

export interface ICartItemDetail {
  productId: string;
  variantId?: string;
  title: string;
  thumbnail: string;
  variantName?: string;
  quantity: number;
  unitPrice: number; // salePrice ?? basePrice
  totalPrice: number; // unitPrice * quantity
  priceSnapshot: ICartItemPriceSnapshot;
  stock: number; // current stock for validation
  isAvailable: boolean; // false if product banned/deleted or out of stock
}

export interface IWishlistWithProducts {
  _id: string;
  userId: string;
  products: IProduct[];
  totalItems: number;
  createdAt: Date;
}

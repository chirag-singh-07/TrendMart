import {
  PaymentMethod,
  GatewayName,
  PaymentStatus,
} from "../../interfaces/index.js";
import { PayoutMethod, PayoutStatus } from "../../interfaces/index.js";

export type SupportedPaymentMethod = "stripe" | "cod" | "wallet";

export interface IInitiatePaymentPayload {
  orderId: string;
  paymentMethod: SupportedPaymentMethod;
  currency?: string; // default "INR"
}

export interface IStripePaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface ICODPaymentResult {
  paymentId: string;
  message: string;
  collectableAmount: number;
}

export interface IWalletPaymentResult {
  paymentId: string;
  walletBalance: number;
  amountDeducted: number;
}

export interface IRefundPayload {
  orderId: string;
  reason: string;
  refundMethod: "original_method" | "wallet";
}

export interface IRefundResult {
  refundId?: string; // Stripe refund ID if applicable
  amountRefunded: number;
  refundMethod: "stripe" | "wallet" | "none";
  walletBalance?: number; // new balance if refunded to wallet
  message: string;
}

export interface IWalletTopUpPayload {
  amount: number;
  currency?: string;
}

export interface IPayoutPayload {
  sellerId: string;
  orderIds: string[];
  payoutMethod: PayoutMethod;
  bankDetails?: IBankDetails;
}

export interface IBankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankName: string;
}

export interface IWalletSummary {
  balance: number;
  currency: string;
  totalCredited: number;
  totalDebited: number;
  transactionCount: number;
}

export interface IPaymentFilters {
  userId?: string;
  orderId?: string;
  paymentStatus?: PaymentStatus;
  paymentMethod?: SupportedPaymentMethod;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

export interface IPaginatedPaymentResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

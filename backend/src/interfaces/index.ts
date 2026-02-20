import mongoose, { Double } from "mongoose";

// ==================== Role ====================

export interface IRole {
  name: string;
  description?: string;
  permissions: string[];
  isSystemRole: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== User ====================

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  avatar?: string;
  role: "admin" | "seller" | "buyer" | "delivery" | "distributor" | "developer";
  roleId: mongoose.Types.ObjectId;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isBlocked: boolean;
  blockReason?: string;
  loginProvider: "local" | "google" | "apple";
  lastLoginAt?: Date;
  passwordChangedAt?: Date;
  failedLoginAttempts: number;
  accountStatus: "active" | "suspended" | "deleted";
  metadata?: {
    deviceInfo?: string;
    ipHistory?: string[];
  };
  refreshTokens: string[]; // stored hashed refresh tokens for multi-device support
  createdAt: Date;
  updatedAt: Date;
}

// ==================== RefreshToken ====================

export interface IRefreshToken {
  tokenHash: string;
  userId: mongoose.Types.ObjectId;
  deviceInfo: string;
  ipAddress: string;
  isRevoked: boolean;
  revokedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== Seller ====================

export type VerificationStatus = "pending" | "approved" | "rejected";

export interface ISeller {
  userId: mongoose.Types.ObjectId;
  shopName: string;
  shopSlug: string;
  shopLogo?: string;
  bannerImage?: string;
  description: string;
  businessEmail: string;
  businessAddress: string;
  businessPhone: string; // string to handle +91, leading zeros etc.
  gstNumber?: string;
  commissionRate: number; // store as decimal e.g. 0.05 = 5%
  totalRevenue: number;
  totalOrders: number;
  totalRatings: number;
  averageRating: number;
  verificationStatus: VerificationStatus;
  verificationDocuments: {
    businessLicense?: string;
    taxId?: string;
    otherDocuments?: string[];
  };
  socialLinks: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    other?: string;
  };
  isActive: boolean;
  isVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

// ==================== Category ====================

export interface ICategory {
  _id: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  parentCategoryId?: mongoose.Types.ObjectId; // null for root categories
  level: number; // 0 = root, 1 = sub, 2 = sub-sub
  image?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: Date;
}

// ==================== Product ====================

export type ProductStatus = "draft" | "active" | "out_of_stock" | "banned";

export interface IProductDimensions {
  length: number;
  width: number;
  height: number;
}

export interface IProductSEO {
  metaTitle?: string;
  metaDescription?: string;
  keywords: string[];
}

export interface IProduct {
  _id: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  brand?: string;
  categoryId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  basePrice: number;
  salePrice?: number;
  currency: string; // e.g. "INR", "USD"
  totalStock: number;
  lowStockThreshold: number;
  sku: string;
  barcode?: string;
  tags: string[];
  images: string[];
  thumbnail: string;
  weight?: number; // in kg
  dimensions?: IProductDimensions;
  isFeatured: boolean;
  shippingClass?: string;
  averageRating: number;
  totalReviews: number;
  totalSales: number;
  viewCount: number;
  status: ProductStatus;
  seo?: IProductSEO;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== ProductVariant ====================

export interface IVariantAttribute {
  name: string; // e.g. "color", "size"
  value: string; // e.g. "red", "XL"
}

export interface IProductVariant {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  variantName: string; // e.g. "Red / XL"
  attributes: IVariantAttribute[];
  sku: string;
  price: number;
  stock: number;
  image?: string;
  isDefault: boolean;
  createdAt: Date;
}

// ==================== Cart ====================

export interface ICartItemPriceSnapshot {
  basePrice: number;
  salePrice?: number;
  currency: string;
}

export interface ICartItem {
  productId: mongoose.Types.ObjectId;
  variantId?: mongoose.Types.ObjectId;
  quantity: number;
  priceSnapshot: ICartItemPriceSnapshot;
}

export interface ICart {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalItems: number;
  totalAmount: number;
  updatedAt: Date;
}

// ==================== Wishlist ====================

export interface IWishlist {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  products: mongoose.Types.ObjectId[];
  createdAt: Date;
}

// ==================== Review ====================

export type ModerationStatus = "pending" | "approved" | "rejected" | "flagged";

export interface IReview {
  _id: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: 1 | 2 | 3 | 4 | 5; // literal type — only valid ratings allowed
  title: string;
  comment: string;
  images?: string[];
  isVerifiedPurchase: boolean;
  helpfulVotes: number;
  reportCount: number;
  moderationStatus: ModerationStatus;
  createdAt: Date;
}

// ==================== Order ====================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type RefundStatus =
  | "none"
  | "requested"
  | "processing"
  | "completed"
  | "rejected";

export interface ISellerBreakdown {
  sellerId: mongoose.Types.ObjectId;
  subtotal: number;
  shippingFee: number;
  commissionAmount: number;
  sellerEarnings: number;
}

export interface IOrder {
  _id: mongoose.Types.ObjectId;
  orderNumber: string; // human-readable e.g. "ORD-20240101-00123"
  userId: mongoose.Types.ObjectId;
  sellerBreakdown: ISellerBreakdown[];
  items: mongoose.Types.ObjectId[]; // refs to OrderItem
  subtotal: number;
  taxAmount: number;
  shippingFee: number;
  discountAmount: number;
  finalAmount: number;
  currency: string;
  couponId?: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  deliveryAddressId: mongoose.Types.ObjectId;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  cancellationReason?: string;
  refundStatus: RefundStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ==================== OrderItem ====================

export interface IOrderItemPriceSnapshot {
  basePrice: number;
  salePrice?: number;
  currency: string;
  title: string; // product title at time of purchase
  thumbnail: string; // product image at time of purchase
}

export interface IOrderItem {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  variantId?: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  quantity: number;
  priceSnapshot: IOrderItemPriceSnapshot;
  totalPrice: number;
}

// ==================== Payment ====================

export type PaymentMethod =
  | "credit_card"
  | "debit_card"
  | "upi"
  | "net_banking"
  | "wallet"
  | "cash_on_delivery";

export type GatewayName = "razorpay" | "stripe" | "paypal" | "manual";

export interface IPayment {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  paymentMethod: PaymentMethod;
  gatewayName: GatewayName;
  transactionId: string; // internal transaction ID
  gatewayPaymentId: string; // ID returned by payment gateway
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  failureReason?: string;
  refundedAmount: number; // 0 by default
  paidAt?: Date;
  createdAt: Date;
}

// ==================== SellerPayout ====================

export type PayoutStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "on_hold";

export type PayoutMethod = "bank_transfer" | "upi" | "wallet";

export interface ISellerPayout {
  _id: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  orderIds: mongoose.Types.ObjectId[];
  grossAmount: number;
  commissionAmount: number;
  netAmount: number; // grossAmount - commissionAmount
  payoutStatus: PayoutStatus;
  payoutMethod: PayoutMethod;
  transactionReference?: string; // bank/UPI ref number after processing
  processedAt?: Date;
}

// ==================== Address ====================

export interface IAddress {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

// ==================== Shipment ====================

export type ShipmentStatus =
  | "pending"
  | "packed"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed_delivery"
  | "returned";

export interface IShipment {
  _id: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
  deliveryPartnerId?: mongoose.Types.ObjectId;
  trackingNumber: string;
  trackingUrl?: string;
  shipmentStatus: ShipmentStatus;
  shippedAt?: Date;
  outForDeliveryAt?: Date;
  deliveredAt?: Date;
  deliveryNotes?: string;
}

// ==================== DeliveryPartner ====================

export type VehicleType = "bike" | "scooter" | "car" | "van" | "truck";

export type AvailabilityStatus = "available" | "busy" | "offline";

export interface IDeliveryPartnerLocation {
  latitude: number;
  longitude: number;
  updatedAt: Date;
}

export interface IDeliveryPartner {
  _id: mongoose.Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  vehicleType: VehicleType;
  vehicleNumber: string;
  currentLocation?: IDeliveryPartnerLocation;
  availabilityStatus: AvailabilityStatus;
  assignedOrders: mongoose.Types.ObjectId[];
}

// ==================== Coupon ====================

export type DiscountType = "percentage" | "flat";

export interface ICoupon {
  _id: mongoose.Types.ObjectId;
  code: string; // e.g. "SAVE20"
  description?: string;
  discountType: DiscountType;
  discountValue: number; // e.g. 20 = 20% or ₹20 flat
  minOrderAmount?: number;
  maxDiscount?: number; // cap for percentage discounts
  usageLimit?: number; // total uses allowed across all users
  perUserLimit?: number; // max uses per individual user
  applicableProducts?: mongoose.Types.ObjectId[];
  applicableCategories?: mongoose.Types.ObjectId[];
  startDate: Date;
  expiresAt: Date;
  usedCount: number;
  isActive: boolean;
}

// ==================== CouponUsage ====================

export interface ICouponUsage {
  _id: mongoose.Types.ObjectId;
  couponId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  discountApplied: number;
  usedAt: Date;
}

// ==================== UserActivity ====================

export type ActivityActionType =
  | "view"
  | "add_to_cart"
  | "purchase"
  | "wishlist"
  | "remove_from_cart";

export type DeviceType = "mobile" | "tablet" | "desktop";

export interface IUserActivity {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // optional for guest sessions
  productId: mongoose.Types.ObjectId;
  actionType: ActivityActionType;
  sessionId: string;
  device: DeviceType;
  createdAt: Date;
}

// ==================== RecommendationLog ====================

export interface IRecommendationLog {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  recommendedProducts: mongoose.Types.ObjectId[];
  algorithmVersion: string; // e.g. "v1.2.0" for tracking model changes
  clickThroughRate?: number; // updated after user interaction
  createdAt: Date;
}

// ==================== AIQueryLog ====================

export type AIModel =
  | "gpt-4o"
  | "gpt-4-turbo"
  | "claude-3-5-sonnet"
  | "gemini-1.5-pro";

export interface IAIQueryLog {
  _id: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId; // optional for unauthenticated queries
  query: string;
  response: string;
  tokensUsed: number;
  modelUsed: AIModel;
  responseTime: number; // in milliseconds
  createdAt: Date;
}

// ==================== FraudDetectionLog ====================

export type FraudReviewStatus = "pending" | "cleared" | "confirmed_fraud";

export interface IFraudDetectionLog {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
  riskScore: number; // 0–100, higher = riskier
  flaggedReason: string[]; // array — multiple reasons can trigger fraud
  autoBlocked: boolean;
  reviewedBy?: mongoose.Types.ObjectId; // admin userId who reviewed
  reviewStatus: FraudReviewStatus;
  createdAt: Date;
}

// ==================== Notification ====================

export type NotificationType =
  | "order"
  | "promo"
  | "system"
  | "review"
  | "payout";

export interface INotification {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: NotificationType;
  redirectUrl?: string;
  isRead: boolean;
  sentAt: Date;
}

// ==================== Banner ====================

export type TargetAudience =
  | "all"
  | "buyers"
  | "sellers"
  | "new_users"
  | "premium";

export type AppTarget = "home" | "category" | "product" | "checkout";

export interface IBanner {
  _id: mongoose.Types.ObjectId;
  title: string;
  image: string;
  redirectUrl?: string;
  targetAudience: TargetAudience;
  appTarget: AppTarget; // which screen/page to show banner on
  startDate: Date;
  endDate: Date;
  isActive: boolean;
}

// ==================== AppConfig ====================

export interface IFeatureFlags {
  [key: string]: boolean; // e.g. { enableAISearch: true, showBanners: false }
}

export interface IAppConfig {
  _id: mongoose.Types.ObjectId;
  appName: string;
  version: string; // e.g. "2.4.1"
  maintenanceMode: boolean;
  forceUpdate: boolean;
  minSupportedVersion: string; // e.g. "2.0.0" — older versions are blocked
  featureFlags: IFeatureFlags;
  updatedAt: Date;
}

// ==================== AuditLog ====================

export type ActorRole = "admin" | "seller" | "buyer" | "system";

export type AuditActionType =
  | "create"
  | "update"
  | "delete"
  | "login"
  | "logout"
  | "ban"
  | "approve"
  | "reject";

export interface IAuditLog {
  _id: mongoose.Types.ObjectId;
  actorId: mongoose.Types.ObjectId; // who performed the action
  actorRole: ActorRole;
  actionType: AuditActionType;
  targetModel: string; // e.g. "Product", "User", "Order"
  targetId: mongoose.Types.ObjectId; // ID of the affected document
  previousData?: Record<string, unknown>; // state before the change
  newData?: Record<string, unknown>; // state after the change
  ipAddress: string;
  createdAt: Date;
}

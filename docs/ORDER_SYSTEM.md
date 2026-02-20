# Order System Documentation

## 1. Overview
The Order System manages the transition from a user's intent to purchase (Cart) to a fulfilled transaction. It acts as the central coordinator between:
- **Cart System**: High-level validation and item gathering.
- **Product System**: Real-time stock management and price verification.
- **Coupon System**: Discount calculation and usage tracking.
- **Delivery System**: Address verification and shipping fee calculation.
- **Payment System**: (Integrated via status updates) Handling financial verification.

## 2. Data Models

### Order
Main document representing a customer transaction.
| Field | Type | Description |
|---|---|---|
| orderNumber | String | Unique ORD-YYYYMMDD-XXXXX identifier |
| userId | ObjectId | The buyer |
| items | Array\<ObjectId\> | References to OrderItems |
| sellerBreakdown | Array | Per-seller financial details |
| finalAmount | Number | Final payable amount (subtotal + tax + shipping - discount) |
| orderStatus | Enum | pending, confirmed, processing, shipped, delivered, cancelled, returned |

### OrderItem
Immutable snapshot of a product/variant at the time of purchase.
| Field | Type | Description |
|---|---|---|
| productId | ObjectId | Reference to Product |
| variantId | ObjectId | Optional reference to Variant |
| quantity | Number | Quantity purchased |
| priceSnapshot | Object | title, thumbnail, and prices at purchase time |
| totalPrice | Number | quantity * effective price |

## 3. Order Placement Flow
Ordering follows a strict 12-step transactional workflow:
1. **Validate Cart**: Checks item availability, status, and price fluctuations (>10%).
2. **Validate Address**: Ensures the address exists and belongs to the buyer.
3. **Apply Coupon**: Validates code, expiration, usage limits, and calculates discount.
4. **Calculate Amounts**: Computes subtotal, tax (18%), and dynamic shipping fees.
5. **Generate Order Number**: Atomic generation via Redis `INCR`.
6. **Create OrderItems**: Snapshots metadata (titles/images) for history.
7. **Calculate Seller Breakdown**: Computes commission and earnings for each seller.
8. **Create Order**: Saves the primary order document.
9. **Deduct Stock**: Decrements inventory count across products and variants.
10. **Redeem Coupon**: Records `CouponUsage` and increments `usedCount`.
11. **Clear Cart**: Empties the user's shopping cart.
12. **Return**: Provides the populated order object to the client.

### Rollback Strategy
If stock deduction fails for any item (e.g., race condition), the system manually deletes the created Order and OrderItems to prevent orphaned data, then throws a 500 error.

## 4. Order Status Flow
Status transitions are restricted by roles:

| From | To | Allowed Roles |
|---|---|---|
| pending | confirmed | admin, seller |
| confirmed | processing | admin, seller |
| processing | shipped | admin, seller |
| shipped | delivered | admin |
| pending | cancelled | admin, buyer, seller |
| confirmed | cancelled | admin, buyer, seller |
| delivered | returned | admin, buyer |

## 5. Seller Breakdown
Each order calculates a breakdown per seller to facilitate payouts:
- **Subtotal**: Sum of `totalPrice` for that seller's items.
- **Commission**: `subtotal * commissionRate` (defined on Seller profile).
- **Seller Earnings**: `subtotal - commissionAmount`.

## 6. Refund System
- **Eligibility**: Order status must be `delivered` or `cancelled`.
- **Status Lifecycle**: `none` → `requested` → `processing` → `completed` OR `rejected`.
- **Stock Restoration**: When an admin marks a refund as `completed`, the system automatically increments stock levels back for every item in that order.

## 7. Shipping Fee Logic
Calculated dynamically at checkout:
- **Base Fee**: 40 INR.
- **Free Shipping**: Applied if subtotal exceeds 499 INR.
- **Heavy Surcharge**: +60 INR per item with `shippingClass: "heavy"`.
- **Cap**: Maximum total shipping fee is 200 INR.

## 8. API Reference

### Buyer Routes
| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/api/orders` | JWT | buyer | Place order from cart |
| GET | `/api/orders` | JWT | buyer | List own orders |
| GET | `/api/orders/:id` | JWT | buyer | Order details (owner only) |
| POST | `/api/orders/:id/cancel` | JWT | buyer | Cancel pending order |
| POST | `/api/orders/:id/refund` | JWT | buyer | Request refund |

### Seller Routes
| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/seller/orders` | JWT | seller | Orders containing seller items |
| PATCH | `/api/seller/orders/:id/status` | JWT | seller | Update status (Confirm/Ship) |
| GET | `/api/seller/orders/items` | JWT | seller | List all sold items |
| GET | `/api/seller/orders/earnings/:id` | JWT | seller | View commission breakdown |

### Admin Routes
| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/admin/orders` | JWT | admin | Full order registry |
| PATCH | `/api/admin/orders/:id/status` | JWT | admin | Override any status |
| POST | `/api/admin/orders/:id/refund/complete` | JWT | admin | Finalize refund & return stock |
| GET | `/api/admin/orders/revenue` | JWT | admin | Platform earnings report |

## 9. Error Reference
| Code | Message | Scenario |
|---|---|---|
| 400 | Cart validation failed | Item out of stock or price changed significantly. |
| 400 | Coupon is not valid | Code expired, inactive, or limit reached. |
| 403 | Access denied | User attempting to view someone else's order. |
| 400 | Order cannot be cancelled... | Attempting to cancel an order that is already 'shipped'. |

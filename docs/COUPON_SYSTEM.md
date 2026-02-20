# Coupon System Documentation

## 1. Overview

The Coupon System is a robust promotional engine that allows administrators to create and manage discounts. It integrates with:

- **Cart System**: Validates coupons against current cart items and subtotals.
- **Order System**: Applies discounts during checkout and tracks usage history.
- **User System**: Enforces per-user usage limits and tracks individual reward history.

## 2. Data Models

### Coupon

The primary configuration for a discount.

| Field | Type | Description |
| :--- | :--- | :--- |
| `code` | String | Unique, uppercase identifier (e.g., "SUMMER20") |
| `discountType` | Enum | "percentage" or "flat" |
| `discountValue` | Number | Amount (e.g., 20) |
| `minOrderAmount` | Number | Optional minimum subtotal required |
| `usageLimit` | Number | Total global uses allowed |
| `perUserLimit` | Number | Max uses per individual user |
| `applicableProducts` | Array | Restricted to specific product IDs |
| `applicableCategories` | Array | Restricted to specific category IDs |
| `startDate/expiresAt` | Date | Active time window |

### CouponUsage

The audit log for every time a coupon is successfully used.

| Field | Type | Description |
| :--- | :--- | :--- |
| `couponId` | ObjectId | Reference to Coupon |
| `userId` | ObjectId | The user who redeemed it |
| `orderId` | ObjectId | The resulting order |
| `discountApplied` | Number | Actual amount saved in that transaction |
| `usedAt` | Date | Timestamp of redemption |

## 3. Coupon Types

### Flat Discount

Reduces the subtotal by a fixed amount (e.g., ₹100 off).

- **Example**: Subtotal ₹500 - Flat ₹100 = ₹400.
- **Logic**: Capped at the subtotal (cannot result in a negative price).

### Percentage Discount

Reduces the subtotal by a percentage (e.g., 20% off).

- **Example**: Subtotal ₹500 - 20% = ₹400.
- **Logic**: Can be capped using `maxDiscount` (e.g., 20% off up to ₹50).

### Scope

- **Sitewide**: When `applicableProducts` and `applicableCategories` are both empty.
- **Targeted**: Applies only to items matching the specified product or category IDs.

## 4. Validation Flow

The system executes 8 checks in strict sequence:

1. **Existence**: Checks if the uppercase code exists in the database.
2. **Active**: Verifies `isActive` is true.
3. **Date Range**: Ensures the current time is between `startDate` and `expiresAt`.
4. **Usage Limit**: Compares `usedCount` with `usageLimit`.
5. **Per User Limit**: Counts existing `CouponUsage` for the current user.
6. **Min Order Amount**: Initial check against total subtotal.
7. **Applicable Items Filtering**: Filters cart to items matching constraints. If no items qualify, validation fails.
8. **Filtered Min Amount**: Re-checks `minOrderAmount` against the subtotal of qualifying items only.

## 5. Discount Calculation

### Flat Discount Formula

`discount = min(coupon.discountValue, applicableSubtotal)`

### Percentage Discount Formula

`baseDiscount = (applicableSubtotal * coupon.discountValue) / 100`

`discount = min(baseDiscount, coupon.maxDiscount || Infinity, applicableSubtotal)`

### Final Amount

`finalAmount = max(0, subtotal + tax + shipping - discount)`

## 6. Usage Tracking

- **Redemption**: Handled via `redeemCoupon` which creates a `CouponUsage` record and uses MongoDB `$inc` to atomically increment the `usedCount`.
- **Reversal**: If an order is cancelled, `reverseCoupon` deletes the usage record and decrements the `usedCount` (using `$inc: -1`), ensuring it never slips below 0.
- **Locking**: Checks use Redis caching to prevent double-spending during rapid checkout attempts.

## 7. Caching Strategy

| Key Pattern | TTL | Invalidation Trigger |
| :--- | :--- | :--- |
| `cache:coupon:<code>` | 10 min | Update, Toggle, Delete, Redeem |
| `cache:active:coupons` | 5 min | Create, Update, Toggle, Delete |
| `cache:coupon:quick:<CODE>:<UID>` | 2 min | User-level interaction change |
| `cache:coupon:used:<UID>:<CID>` | 5 min | New redemption or reversal |

## 8. API Reference

### Public Routes

| Method | Route | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/coupons/active` | Public | - | List active coupons for buyers |
| POST | `/api/coupons/validate` | JWT | buyer | Full validation & discount check |
| GET | `/api/coupons/quick-check/:code`| JWT | buyer | Real-time existence check |

### User Routes

| Method | Route | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/coupons/me/history` | JWT | buyer | View own redemption history |
| GET | `/api/coupons/me/remaining/:id` | JWT | buyer | Check remaining uses for a code |

### Admin Routes

| Method | Route | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/api/admin/coupons` | JWT | admin | List all coupons (filtered) |
| POST | `/api/admin/coupons` | JWT | admin | Create new coupon |
| PATCH | `/api/admin/coupons/:id` | JWT | admin | Update coupon (except code) |
| DELETE| `/api/admin/coupons/:id` | JWT | admin | Soft delete (deactivate) |
| GET | `/api/admin/coupons/:id/stats`| JWT | admin | Usage and revenue stats |
| GET | `/api/admin/coupons/:id/usage`| JWT | admin | Full usage log per order |

## 9. Role-Based Access

- **Buyers**: Can list active coupons, validate codes against their cart, and view their own history.
- **Admins**: Full CRUD access. Can override status, view global stats, and monitor usage across all users.

## 10. Error Reference

| Status Code | Error Message | Occurs When |
| :--- | :--- | :--- |
| 404 | Coupon not found | The provided code does not exist. |
| 409 | Coupon code already exists | Attempting to create a duplicate code. |
| 400 | Coupon has expired | Current date is past `expiresAt`. |
| 400 | Minimum order amount not met | Filtered subtotal is below `minOrderAmount`. |
| 400 | Usage limit reached | Global or per-user limit has been exceeded. |
| 400 | Coupon not applicable | No items in cart match the product/category constraints. |
| 400 | maxDiscount only applies to %| Attempting to set maxDiscount on a flat coupon. |
| 400 | startDate must be before expiresAt | Invalid date range provided. |

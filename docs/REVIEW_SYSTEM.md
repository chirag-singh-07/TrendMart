# Review System Documentation

## 1. Overview

The Review System enables buyers to share verified, post-purchase feedback on products. Every review is tied to a real, delivered order — preventing fake reviews. Reviews go through a moderation lifecycle before becoming publicly visible. The system integrates tightly with three core systems:

- **Order System**: Verifies that a buyer has received the product before allowing a review.
- **Product System**: Keeps `averageRating` and `totalReviews` on the Product document updated in real-time as reviews are approved or removed.
- **User System**: Identifies the reviewer and enforces one-review-per-product-per-user constraint.

---

## 2. Data Models

### Review

| Field | Type | Description |
| :--- | :--- | :--- |
| `productId` | ObjectId | Reference to the reviewed Product |
| `userId` | ObjectId | Reference to the reviewer (User) |
| `rating` | Number (1–5) | Star rating |
| `title` | String (max 100) | Short summary of the experience |
| `comment` | String (max 2000) | Full review body |
| `images` | String[] | Up to 5 uploaded image URLs |
| `isVerifiedPurchase` | Boolean | True only when verified via the Order system |
| `helpfulVotes` | Number | Total helpful votes received |
| `reportCount` | Number | Number of times this review has been reported |
| `moderationStatus` | Enum | "pending", "approved", "rejected", or "flagged" |
| `createdAt` | Date | Immutable creation timestamp |

**Indexes:**

- `{ productId, userId }` — unique compound index (one review per user per product)
- `{ productId, createdAt }` — for efficient paginated queries per product
- `{ moderationStatus }` — for fast moderation queue retrieval

---

## 3. Review Eligibility

### Verified Purchase Requirement

Only buyers who have **received** a delivered order containing the product may leave a review. The system checks against `OrderItem` and `Order` documents to confirm delivery.

### One Review Per Product Per User

The `{ productId, userId }` unique index at the database level combined with an application-level pre-flight check prevents duplicate reviews.

### Eligibility Check Flow (3 checks in order)

```
Check 1: Already Reviewed?
  └─ Query Review for { userId, productId }
  └─ If found → isEligible: false ("You have already reviewed this product")

Check 2: Verified Purchase?
  └─ JOIN OrderItem + Order for { productId, order.userId, order.orderStatus: "delivered" }
  └─ If none found → isEligible: false ("You can only review products you have purchased and received")

Check 3: Pass
  └─ isEligible: true, orderId: <matched order>
```

A separate `verifyOrderOwnership` check then cross-references the `orderId` from the buyer's payload to ensure it is not spoofed.

---

## 4. Review Lifecycle

### Status Flow

```
submit
  └─► pending
        ├─► approved   (visible to public, counts toward rating)
        ├─► rejected   (hidden, cannot be edited by buyer)
        └─► flagged    (elevated in moderation queue, urgent review)

edit (by buyer)
  └─► any status → pending  (always re-moderated after edit)

5 reports received (auto)
  └─► any status → flagged  (automatic — no admin action needed)
```

### Status Meanings

| Status | Public Visible | Counts in Rating | Buyer Can Edit |
| :--- | :--- | :--- | :--- |
| `pending` | No | No | Yes |
| `approved` | Yes | Yes | Yes (resets to pending) |
| `rejected` | No | No | No |
| `flagged` | No | No | Yes (resets to pending) |

### Auto-Flagging on Report Threshold

When `reportCount` reaches **5**, the system automatically sets `moderationStatus: "flagged"` via `$set` in the same update operation as the `$inc` on `reportCount`. No admin action is required to initiate elevated review.

---

## 5. Rating Calculation

### How averageRating is Recalculated

Every create, update, delete, approve, and reject triggers `ratingCalculatorService.recalculateProductRating(productId)`. This runs a MongoDB aggregation that:

1. Filters `Review` documents for `{ productId, moderationStatus: "approved" }`.
2. Groups to compute `count` (totalReviews) and `sum` / `count` (averageRating).
3. Rounds `averageRating` to 1 decimal place.
4. If `totalReviews === 0`, sets averageRating to `0`.
5. Calls `productService.updateProductRating(productId, averageRating, totalReviews)`.

### Why Only Approved Reviews Count

Pending, rejected, and flagged reviews are excluded from the product's public rating. This prevents unmoderated or abusive content from distorting product scores.

### Bayesian Weighted Rating

Used internally for featured/bestseller ranking. **Never exposed in the public API.**

**Formula:**

```
weightedRating = (v / (v + m)) * R + (m / (v + m)) * C

Where:
  v = number of approved reviews for this product
  m = 10  (minimum review threshold constant)
  R = product's average rating
  C = global average rating across all approved reviews in the database
```

**Why this matters:** A product with 1 review rated 5★ would otherwise outrank a product with 500 reviews rated 4.5★. The Bayesian average corrects for this by pulling low-volume products toward the global mean.

### When Recalculation is Triggered

| Action | Recalculation |
| :--- | :--- |
| Review created | Yes |
| Review updated | Yes |
| Review deleted | Yes |
| Review approved | Yes |
| Review rejected | Yes |
| Review flagged | No (rating not affected) |

---

## 6. Moderation System

### Moderation Queue Priority

The queue is sorted as: **flagged first**, then **pending**, ordered by `reportCount desc` then `createdAt asc` (oldest first). Each entry is populated with:

- User: `fullName`, `email`, `avatar`
- Product: `title`, `thumbnail`

### Bulk Moderation

`POST /api/admin/reviews/bulk-moderate` accepts up to 50 review IDs and an action (`"approve"` or `"reject"`). All reviews are processed in parallel using `Promise.allSettled`. A partial success report is returned:

```json
{
  "result": {
    "success": ["id1", "id2"],
    "failed": ["id3"]
  }
}
```

### Auto-Flag on Report Threshold

When `reportCount >= 5`, the system automatically flags the review without admin intervention. This surfaces the review in the moderation queue for priority review.

### Admin Actions Available

| Action | Endpoint | Effect |
| :--- | :--- | :--- |
| Approve | `PATCH /:id/approve` | Sets status to `approved`, triggers rating recalculation |
| Reject | `PATCH /:id/reject` | Sets status to `rejected`, removes from public, triggers recalculation |
| Flag | `PATCH /:id/flag` | Sets status to `flagged`, elevates in moderation queue |
| Bulk Action | `POST /bulk-moderate` | Approve or reject up to 50 at once |
| Delete | `DELETE /:id` | Permanently removes, triggers recalculation |

---

## 7. Helpful Votes & Reporting

### Helpful Voting

- Each user may only vote **once** per review.
- Deduplication is enforced via a Redis Set: `votes:helpful:<reviewId>` (TTL: 30 days).
- `SISMEMBER` checks before allowing a vote; `SADD` records the vote.
- `helpfulVotes` is incremented atomically with `$inc` — no full document re-save.
- **Cache is NOT invalidated** on a helpful vote (the increment is applied directly to the DB).

### Reporting a Review

- Each user may report a given review **only once**.
- Deduplication is enforced via a permanent Redis key: `reports:<reviewId>:<userId>`.
- `EXISTS` checks before allowing a report; `SET` records the report with the reason.
- `reportCount` is incremented atomically with `$inc`.
- If `reportCount >= 5` after incrementing, `moderationStatus` is automatically set to `"flagged"` in the same DB operation.

---

## 8. Caching Strategy

### Cache Keys and TTLs

| Key Pattern | Type | TTL | Purpose |
| :--- | :--- | :--- | :--- |
| `cache:reviews:<productId>:<page>:<hash>` | String (JSON) | 10 min | Paginated review pages per product |
| `cache:rating:summary:<productId>` | String (JSON) | 30 min | Aggregated rating summary |
| `votes:helpful:<reviewId>` | Redis Set | 30 days | User IDs that have voted helpful |
| `reports:<reviewId>:<userId>` | String (report reason) | Permanent | Deduplication of user reports |

The `<hash>` in the review cache key is an 8-character MD5 hash of the active filters (rating, isVerifiedPurchase, sortBy, fromDate, toDate). This allows per-filter granularity without exposing filter values in keys.

### Invalidation Rules

| Trigger | Keys Invalidated |
| :--- | :--- |
| Review created / updated / deleted | All `cache:reviews:<productId>:*` keys |
| Review approved / rejected | All `cache:reviews:<productId>:*` + `cache:rating:summary:<productId>` |
| Rating recalculated | `cache:rating:summary:<productId>` |
| Helpful vote | None (direct `$inc`, no cache flush) |
| Report (5th report, auto-flag) | All `cache:reviews:<productId>:*` |

Cache invalidation for review pages uses Redis `SCAN` with a glob pattern to delete all page variants for a product without requiring prior knowledge of which pages are cached.

---

## 9. API Reference

### Public Routes (`/api/reviews`)

| Method | Route | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/product/:productId` | Public | - | Paginated approved reviews for a product |
| GET | `/product/:productId/summary` | Public | - | Rating summary and breakdown |
| GET | `/:reviewId` | Public | - | Single review with user details |

### Buyer Routes (`/api/reviews`)

| Method | Route | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/me` | JWT | buyer | Get own reviews across all products |
| GET | `/eligible` | JWT | buyer | List of products user can still review |
| POST | `/` | JWT | buyer | Submit a new review |
| PATCH | `/:reviewId` | JWT | buyer | Edit own review (resets to pending) |
| DELETE | `/:reviewId` | JWT | buyer | Delete own review |
| POST | `/:reviewId/helpful` | JWT | buyer | Vote review as helpful (once) |
| POST | `/:reviewId/report` | JWT | buyer | Report a review (once) |

### Admin Routes (`/api/admin/reviews`)

| Method | Route | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/` | JWT | admin | All reviews with optional user/product filters |
| GET | `/moderation-queue` | JWT | admin | Pending + flagged reviews (flagged first) |
| GET | `/reported` | JWT | admin | Reviews with at least 1 report |
| PATCH | `/:reviewId/approve` | JWT | admin | Approve a review |
| PATCH | `/:reviewId/reject` | JWT | admin | Reject a review |
| PATCH | `/:reviewId/flag` | JWT | admin | Manually flag a review |
| POST | `/bulk-moderate` | JWT | admin | Bulk approve or reject (up to 50) |
| DELETE | `/:reviewId` | JWT | admin | Permanently delete any review |

---

## 10. Role-Based Access

### Buyers Can

- Submit one review per product they have received.
- Edit their pending or approved reviews (re-submitted to moderation).
- Delete their own reviews.
- Vote any review as helpful (once per review).
- Report any review (once per review).
- View their own review history (all statuses).
- View products they are eligible to review.

### Admins Can

- View all reviews regardless of moderation status.
- Approve, reject, or flag any review.
- Bulk moderate up to 50 reviews in one request.
- Delete any review permanently.
- View the moderation queue (pending + flagged, sorted by urgency).
- View reported reviews sorted by report count.

### Public (Unauthenticated) Can See

- Only `approved` reviews for any product.
- Rating summary and breakdown for any product.
- Individual review detail (as long as the review exists — any status).

---

## 11. Error Reference

| Status Code | Error Message | When It Occurs |
| :--- | :--- | :--- |
| 404 | Review not found | `reviewId` does not match any document |
| 400 | You have already reviewed this product | Duplicate review attempt |
| 403 | You can only review products you have purchased and received | No delivered order found for product |
| 403 | Order does not match this product | Payload `orderId` does not contain `productId` |
| 400 | Rejected reviews cannot be edited | Buyer attempts to edit a rejected review |
| 400 | You have already voted this review as helpful | Duplicate helpful vote attempt |
| 400 | You have already reported this review | Duplicate report attempt |
| 403 | You do not have permission to modify this review | Buyer tries to edit/delete another user's review |
| 400 | Rating must be between 1 and 5 | Zod validation failure on `rating` field |
| 400 | Maximum 5 images allowed per review | `images` array length exceeds 5 |
| 400 | Validation failed | Any Zod schema validation error |

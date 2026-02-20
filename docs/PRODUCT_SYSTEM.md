# Product System Documentation

## 1. Overview

The Product System is a robust backend module built with Node.js, Express, TypeScript, and MongoDB. It handles category trees, complex product listings, and variants with synchronized stock management. High performance is achieved through Redis caching and optimized MongoDB indexing.

## 2. Data Models

### Category Model

| Field | Type | Description |
|---|---|---|
| name | String | Unique name of the category |
| slug | String | URL-friendly unique identifier |
| description | String | Optional description |
| parentCategoryId | ObjectId | Reference to parent category (null for root) |
| level | Number | Depth (0-2) |
| displayOrder | Number | Sequence for sorting |
| isActive | Boolean | Soft delete flag |

### Product Model

| Field | Type | Description |
|---|---|---|
| title | String | Product name |
| slug | String | URL-friendly unique identifier |
| basePrice | Number | Original price |
| salePrice | Number | Discounted price |
| categoryId | ObjectId | Reference to Category |
| sellerId | ObjectId | Reference to User (Seller) |
| totalStock | Number | Aggregate stock from variants |
| status | Enum | draft, active, out_of_stock, banned |

### Variant Model

| Field | Type | Description |
|---|---|---|
| productId | ObjectId | Reference to Product |
| variantName | String | e.g., "Red / XL" |
| attributes | Array | { name, value } pairs |
| price | Number | Variant-specific price |
| stock | Number | Variant stock level |
| isDefault | Boolean | Primary variant flag |

## 3. Category System

- **slugs**: Automatically generated using `slugify`.
- **Level**: Supports up to 3 levels (root, sub, sub-sub).
- **Soft Delete**: Setting `isActive: false` prevents category from being fetched while preserving history.
- **Cache**: Full category tree is cached in Redis for 1 hour.

## 4. Product Lifecycle

- **Draft**: Initial state upon creation.
- **Publish Rules**: Requires title, description, images, price, stock, and category.
- **Auto Stock Status**: Transitions to `out_of_stock` when `totalStock` reaches 0, and back to `active` when replenished.

## 5. Variant System

- **Attributes**: Flexible key-value pairs for color, size, material, etc.
- **Default Variant**: One variant marked as primary for listing display.
- **Stock Calculation**: Product `totalStock` is automatically recalculated whenever a variant's stock changes.

## 6. Search & Filtering

- **Full-Text Search**: Powered by MongoDB `$text` index on title and description.
- **Filters**:
  - `categoryId`: Filter by specific category.
  - `minPrice`/`maxPrice`: Range filter on base or sale price.
  - `inStock`: Boolean filter for availability.
  - `brand`/`tags`: String-based filtering.
- **Sort Options**: `price_asc`, `price_desc`, `newest`, `rating`, `bestseller`.

## 7. Caching Strategy

| Key Pattern | TTL | Invalidation Trigger |
|---|---|---|
| `cache:product:<id>` | 30m | Update/Delete/Stock change |
| `cache:category:tree` | 1h | Any category mutation |
| `cache:featured:products` | 15m | Any relevant product update |
| `cache:new:arrivals` | 15m | New product creation |
| `cache:bestsellers` | 15m | Sale operation (external) |

## 8. API Reference

### Categories

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/categories` | Public | - | Get full tree |
| GET | `/api/categories/all` | Auth | Admin | Get all incl. inactive |
| POST | `/api/categories` | Auth | Admin | Create category |
| PATCH | `/api/categories/:id` | Auth | Admin | Update category |
| DELETE| `/api/categories/:id` | Auth | Admin | Soft delete |

### Products

| Method | Route | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/api/products` | Public | - | List with filters |
| GET | `/api/products/search` | Public | - | Text search |
| GET | `/api/products/:id` | Public | - | Detail with variants |
| POST | `/api/products` | Auth | Seller | Create (draft) |
| PATCH | `/api/products/:id` | Auth | Seller | Update (owns) |
| DELETE| `/api/products/:id` | Auth | Seller | Soft delete |
| PATCH | `/api/products/:id/publish` | Auth | Seller| Go live |

## 9. Role-Based Access

- **Buyers**: Can only view `active` products and category trees.
- **Sellers**: Can manage their own products and variants. Cannot touch categories.
- **Admins**: Can manage all categories and ban any product.

## 10. Error Reference

- **404 Not Found**: Product/Category doesn't exist or is inactive for buyers.
- **409 Conflict**: Duplicate SKU or Slug (slug is auto-resolved).
- **400 Bad Request**: Sale price invalid, incomplete publication, or exceeding category depth.
- **403 Forbidden**: Ownership mismatch or role insufficiency.

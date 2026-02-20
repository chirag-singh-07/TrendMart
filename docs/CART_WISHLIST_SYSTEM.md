# Cart & Wishlist System Documentation

## 1. Overview

The Cart & Wishlist system provides a robust foundation for e-commerce shopping workflows. 

- **Cart System**: Manages temporary items representing a user's intent to purchase. It includes price snapshotting to handle price fluctuations and strict stock validation.
- **Wishlist System**: Allows users to save products for later. It acts as an idempotent "favorite" list and provides a seamless "Move to Cart" workflow.
- **Integration**: The system integrates with the Product and Order layers. Cart validation is a mandatory step before order creation to ensure data integrity (current status, stock, and significant price changes).

## 2. Data Models

### Cart

| Field | Type | Description |
|---|---|---|
| userId | ObjectId | Owner of the cart (One cart per user) |
| items | Array\<CartItem\> | List of products/variants in the cart |
| totalItems | Number | Sum of all item quantities |
| totalAmount | Number | Sum of (unitPrice * quantity) |

### CartItem

| Field | Type | Description |
|---|---|---|
| productId | ObjectId | Reference to the Product |
| variantId | ObjectId | Reference to specific ProductVariant (optional) |
| quantity | Number | Number of units (min: 1) |
| priceSnapshot | Object | Price data at the time of adding to cart |

### CartItemPriceSnapshot

| Field | Type | Description |
|---|---|---|
| basePrice | Number | Original product/variant price |
| salePrice | Number | Discounted price (if any) |
| currency | String | Currency code (e.g., INR) |

### Wishlist

| Field | Type | Description |
|---|---|---|
| userId | ObjectId | Owner of the wishlist |
| products | Array\<ObjectId\> | References to Products |

## 3. Cart System

### getOrCreateCart

Every authenticated user is guaranteed to have exactly one cart document. If a cart doesn't exist when requested, it is created automatically.

### Price Snapshots

When an item is added to the cart, a "Snapshot" of its current price is taken. This protects the shopper from silent price increases during their session and allows the system to notify them if a significant change occurs before checkout.

### Calculations

- **totalItems**: Calculated as the sum of all `item.quantity` values.
- **totalAmount**: Calculated as `sum(effectivePrice * quantity)`. The effective price is `salePrice` if it exists, otherwise `basePrice`.
- Logic is encapsulated in `cartCalculator.util.ts` and automated via Mongoose `pre('save')` hooks.

### Validation Flow

Before an order can be placed, the `validateCartForCheckout` service:
1. Verifies the product is still "active".
2. Checks current stock against requested quantity.
3. Compares the snapshot price with the current price.

### Price Sync

While snapshots are used for detection, the `syncCartPrices` endpoint allows the frontend to refresh all cart items to current market prices, ensuring the user sees the most up-to-date totals.

## 4. Wishlist System

### Idempotent Adding

Adding a product to a wishlist is idempotent. If the product already exists in the user's list, the request succeeds without creating a duplicate or throwing an error.

### Atomic-like "Move to Cart"

The `moveToCart` workflow first adds the item to the shopping cart. Only if the addition is successful (meaning stock and status are valid) is the item removed from the wishlist. If adding to the cart fails, the item remains in the wishlist.

### Banned Product Filtration

When fetching the wishlist, products with a status of `banned` are automatically filtered out of the response to maintain a clean shopping experience.

## 5. Price Snapshot Strategy

### Rationale

Prices are snapshotted to:
1. Prevent "bait and switch" scenarios where a price changes between adding to cart and checking out.
2. Provide a better UX by highlighting price drops or increases explicitly.

### Detection

A price is considered to have **changed significantly** if the effective price fluctuates by more than **10%** from the original snapshot.

### When to Sync

Syncing should ideally happen:
1. When the user visits the Cart page.
2. Automatically before navigation to the Checkout screen.

## 6. API Reference

### Cart API (`/api/cart`)
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | Buyer | Get cart summary and populated item details |
| POST | `/items` | Buyer | Add a product/variant to the cart |
| PATCH | `/items` | Buyer | Update item quantity (0 removes item) |
| DELETE | `/items` | Buyer | Remove specific item from cart |
| DELETE | `/` | Buyer | Clear entire cart |
| POST | `/validate` | Buyer | Perform stock and price validation |
| POST | `/sync-prices`| Buyer | Update all snapshots to current prices |

### Wishlist API (`/api/wishlist`)
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | `/` | Buyer | Get wishlist with product details |
| POST | `/items` | Buyer | Add product to wishlist |
| DELETE | `/items/:id` | Buyer | Remove product from wishlist |
| DELETE | `/` | Buyer | Clear entire wishlist |
| GET | `/check/:id` | Buyer | Check if a product is in wishlist |
| POST | `/move-to-cart`| Buyer | Move item from wishlist to cart |

## 7. Validation Rules

### Zod Schemas
| Schema | Field | Rules |
|---|---|---|
| AddToCart | productId | Required, valid MongoID |
| AddToCart | variantId | Optional, valid MongoID |
| AddToCart | quantity | Min: 1, Max: 100 |
| UpdateCart | quantity | Min: 0 (0 triggers remove), Max: 100 |
| Wishlist | productId | Required, valid MongoID |

### Logical Validation
- **Status Check**: Only products with `status: "active"` can be added to Cart/Wishlist.
- **Stock Check**: `quantity` must be less than or equal to `product.totalStock` or `variant.stock`.
- **Ownership**: Middlewares ensure users can only modify their own Cart/Wishlist.

## 8. Error Reference
| Status | Error Message | Scenario |
|---|---|---|
| 404 | Product not found | Product ID does not exist in DB |
| 400 | Product is not available | Product status is "draft", "banned", etc. |
| 400 | Insufficient stock | Requested quantity exceeds current stock |
| 404 | Item not found in cart | Attempting to update/remove a non-existent item |
| 403 | Access denied | Attempting to access another user's cart |
| 400 | Your cart is empty | Attempting to validate/checkout an empty cart |

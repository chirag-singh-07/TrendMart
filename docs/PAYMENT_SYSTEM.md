# Payment System Documentation

## 1. Overview

The TrendMart Payment System is a production-ready financial engine built with Node.js, TypeScript, and MongoDB. It supports three primary payment channels:

- **Stripe**: For credit/debit cards and UPI (via PaymentIntents).
- **Cash on Delivery (COD)**: Manual collection flow with admin confirmation.
- **Wallet**: An internal virtual currency system for faster checkouts and refunds.

The system is tightly integrated with the **Order**, **Refund**, and **Seller Payout** modules to provide a seamless end-to-end transaction lifecycle.

## 2. Data Models

### Payment (`Payment`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `orderId` | ObjectId | Reference to the Order being paid. |
| `userId` | ObjectId | The buyer making the payment. |
| `paymentMethod` | Enum | `credit_card`, `debit_card`, `upi`, `net_banking`, `wallet`, `cash_on_delivery`. |
| `gatewayName` | Enum | `stripe`, `manual`. |
| `transactionId` | String | Internal unique transaction tracker. |
| `gatewayPaymentId` | String | External ID (e.g., Stripe PaymentIntent ID). |
| `amount` | Number | Total amount in INR. |
| `paymentStatus` | Enum | `pending`, `paid`, `failed`, `refunded`, `partially_refunded`. |
| `paidAt` | Date | Timestamp of successful payment confirmation. |

### Wallet (`Wallet`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | ObjectId | Owner of the wallet. |
| `balance` | Number | Current available funds (INR). |
| `isActive` | Boolean | Whether the wallet is usable. |

### Wallet Transaction (`WalletTransaction`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `walletId` | ObjectId | Reference to the parent wallet. |
| `type` | Enum | `credit` or `debit`. |
| `amount` | Number | Amount moved. |
| `source` | Enum | `refund`, `cashback`, `topup`, `order_payment`, `payout`, `admin_credit`. |
| `referenceId` | String | Link to Order, Payment, or Payout ID. |

### Seller Payout (`SellerPayout`)

| Field | Type | Description |
| :--- | :--- | :--- |
| `sellerId` | ObjectId | Seller receiving the funds. |
| `netAmount` | Number | Total earned minus platform commission. |
| `payoutStatus` | Enum | `pending`, `processing`, `completed`, `failed`. |

## 3. Payment Methods

### Stripe Flow

1. **Initiation**: Buyer calls `/api/payments/initiate`. Service creates a `pending` Payment record and a Stripe `PaymentIntent`.
2. **Client Side**: Frontend uses the `clientSecret` to collect card details.
3. **Verification**: After payment, the frontend calls `/api/payments/confirm` OR the backend receives a `payment_intent.succeeded` webhook.
4. **Update**: Order status is set to `confirmed` and payment status to `paid`.

### COD Flow

1. **Initiation**: Payment is created with status `pending`. Order is marked `confirmed`.
2. **Delivery**: Upon delivery, the agent collects cash.
3. **Confirmation**: Admin calls `/api/payments/cod/confirm/:orderId` to mark payment as `paid`.

### Wallet Flow

1. **Balance Check**: Service verifies `balance >= order.finalAmount`.
2. **Deduction**: Atomic debit from user's wallet.
3. **Completion**: Payment marked `paid` and Order marked `confirmed` instantly.

## 4. Wallet System

- **Lazy Creation**: Wallets are automatically created on first use (e.g., first credit or balance check).
- **Atomicity**: All balance changes use **MongoDB Sessions**. A balance update and transaction record are either both committed or both aborted.
- **Top-up**: Users can add money via Stripe. Funds are credited only after the `payment_intent.succeeded` webhook for the top-up intent is received.
- **Transactional Integrity**: Wallet balance can **NEVER** go below zero.

## 5. Refund System

- **Routing Logic**:
  - Stripe payments → Refunded to original card (partial supported).
  - COD payments → Refunded to **User Wallet** (original method not possible).
  - Wallet payments → Refunded to **User Wallet**.
- **Partial Refunds**: Admins can select specific `itemIds` to refund. The system calculates the sum and manages the partial state.
- **Stock Restoration**: Every refund automatically increments the product/variant stock back.

## 6. Seller Payout System

- **Earnings Calculation**: Based on `sellerBreakdown` in delivered orders.
- **Commission**: Platform fees are automatically deducted during the payout initiation.
- **Settlement**: When a payout is "Completed", the net amount is credited to the seller's internal wallet.

## 7. Stripe Integration

- **Webhooks**: Handles `payment_intent.succeeded`, `payment_intent.payment_failed`, and `charge.refund.updated`.
- **Signature Verification**: Uses Stripe's `constructEvent` with a raw body buffer for security.
- **Smallest Units**: All amounts are converted to **Paise** (INR * 100) before being sent to Stripe.

## 8. Idempotency

- **Prevention**: Uses Redis keys (`idempotency:payment:<orderId>:<userId>`) to prevent multiple payment records for the same order within a 10-minute window.
- **Stripe Safety**: Ensures that if a user clicks "Pay" twice, only one Stripe Intent is ever created.

## 9. API Reference

| Method | Route | Auth | Role | Description |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/api/payments/initiate` | JWT | Buyer | Initiate payment for an order |
| POST | `/api/payments/stripe/confirm` | JWT | Buyer | Manual confirm after Stripe flow |
| GET | `/api/wallet/` | JWT | Buyer/Seller | Get wallet balance and summary |
| POST | `/api/wallet/topup` | JWT | Buyer | Add money to wallet via Stripe |
| POST | `/api/payouts/initiate` | JWT | Admin | Create payout for a seller |
| POST | `/api/refunds/process/:orderId` | JWT | Admin | Full refund to card/wallet |
| POST | `/api/webhook/stripe` | None | Public | Stripe webhook listener |

## 10. Role-Based Access

- **Buyer**: Can pay for orders, view own payment/wallet history, and top-up.
- **Seller**: Can view own payout history and wallet balance.
- **Admin**: Can view all payments, process refunds, initiate payouts, and confirm COD collections.

## 11. Environment Variables

- `STRIPE_SECRET_KEY`: Stripe private API key.
- `STRIPE_WEBHOOK_SECRET`: Secret for verifying Stripe events.
- `WALLET_MAX_BALANCE`: Max allowed internal balance (Default: 1,00,000).
- `REDIS_URL`: Connection string for idempotency storage.

## 12. Error Reference

| Status | Message | Context |
| :--- | :--- | :--- |
| 400 | "Insufficient wallet balance" | Wallet payment attempted with low funds. |
| 400 | "Payment already initiated for this order" | Triggered by idempotency check. |
| 400 | "Invalid webhook signature" | Signature mismatch in Stripe webhook. |
| 403 | "Access denied" | Attempting to access/pay someone else's order. |
| 404 | "Payment record not found" | Querying a non-existent transaction. |

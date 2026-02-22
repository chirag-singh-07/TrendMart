import Stripe from "stripe";
import AppError from "../../utils/AppError.js";
import { toPaise } from "../utils/currency.util.js";

const getStripe = (): Stripe => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new AppError("Stripe secret key is not configured", 500);
  return new Stripe(key, { apiVersion: "2026-01-28.clover" });
};

/**
 * Centralised Stripe SDK wrapper. ALL Stripe API calls in the codebase must
 * go through this service — no other module should import the Stripe SDK directly.
 */
export const stripeService = {
  /**
   * Creates a Stripe PaymentIntent for a given order amount.
   * Converts INR rupees to paise before sending to Stripe.
   *
   * @param amount - Amount in INR (will be converted to paise internally)
   * @param currency - ISO currency code (default "INR")
   * @param metadata - { orderId, userId, paymentId } for webhook reconciliation
   * @returns Full Stripe PaymentIntent object (includes clientSecret)
   */
  async createPaymentIntent(
    amount: number,
    currency: string,
    metadata: { orderId: string; userId: string; paymentId?: string },
  ): Promise<Stripe.PaymentIntent> {
    const stripe = getStripe();
    return stripe.paymentIntents.create({
      amount: toPaise(amount),
      currency: currency.toLowerCase(),
      metadata,
      automatic_payment_methods: { enabled: true },
    });
  },

  /**
   * Retrieves an existing PaymentIntent to check its current status.
   * Used to verify payment after the frontend completes the flow.
   *
   * @param paymentIntentId - Stripe's PaymentIntent ID (pi_xxx)
   * @returns The current PaymentIntent object
   */
  async confirmPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    const stripe = getStripe();
    return stripe.paymentIntents.retrieve(paymentIntentId);
  },

  /**
   * Issues a full or partial refund via Stripe for a captured PaymentIntent.
   *
   * @param paymentIntentId - The PaymentIntent that was charged
   * @param amount - Optional partial refund amount in INR; omit for full refund
   * @param reason - Stripe refund reason
   * @returns Stripe Refund object
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: Stripe.RefundCreateParams.Reason,
  ): Promise<Stripe.Refund> {
    const stripe = getStripe();
    const params: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
      reason: reason ?? "requested_by_customer",
    };
    if (amount !== undefined) {
      params.amount = toPaise(amount);
    }
    return stripe.refunds.create(params);
  },

  /**
   * Verifies the Stripe webhook signature and parses the event payload.
   * Stripe requires the raw body Buffer — never the parsed JSON.
   *
   * @param payload - Raw request body buffer
   * @param signature - Value of the "stripe-signature" header
   * @returns Verified Stripe Event object
   * @throws AppError 400 if signature is invalid
   */
  createWebhookEvent(payload: Buffer, signature: string): Stripe.Event {
    const stripe = getStripe();
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!secret)
      throw new AppError("Stripe webhook secret is not configured", 500);
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (err: any) {
      throw new AppError(`Invalid webhook signature: ${err.message}`, 400);
    }
  },

  /**
   * Retrieves a PaymentIntent by ID directly from Stripe.
   * Used by the webhook handler for data reconciliation.
   *
   * @param paymentIntentId - Stripe PaymentIntent ID
   * @returns Full PaymentIntent object
   */
  async retrievePaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    const stripe = getStripe();
    return stripe.paymentIntents.retrieve(paymentIntentId);
  },

  /**
   * Cancels a Stripe PaymentIntent that has not yet been captured.
   * Called when an order is cancelled before the buyer completes payment.
   *
   * @param paymentIntentId - The PaymentIntent to cancel
   * @returns Updated (cancelled) PaymentIntent object
   */
  async cancelPaymentIntent(
    paymentIntentId: string,
  ): Promise<Stripe.PaymentIntent> {
    const stripe = getStripe();
    return stripe.paymentIntents.cancel(paymentIntentId);
  },
};

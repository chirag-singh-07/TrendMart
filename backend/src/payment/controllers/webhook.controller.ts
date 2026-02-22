import { Request, Response, NextFunction } from "express";
import Payment from "../../models/Payment.model.js";
import Order from "../../models/Order.model.js";
import { stripeService } from "../services/stripe.service.js";
import { paymentService } from "../services/payment.service.js";
import { walletService } from "../services/wallet.service.js";
import { idempotencyService } from "../services/idempotency.service.js";

/**
 * Stripe webhook handler controller.
 *
 * IMPORTANT: Always returns 200 to Stripe immediately.
 * Processing failures should be logged — NEVER throw errors that cause Stripe retries.
 */
export const webhookController = {
  /**
   * Handle incoming verified Stripe webhook events.
   * Event is already parsed and verified by stripeWebhook.middleware.ts.
   */
  async handleStripeWebhook(req: any, res: Response, next: NextFunction) {
    // Always respond 200 to Stripe IMMEDIATELY
    res.status(200).json({ received: true });

    const event = req.stripeEvent;
    if (!event) return;

    console.log(`[WEBHOOK] Received Stripe event: ${event.type} (${event.id})`);

    try {
      switch (event.type) {
        case "payment_intent.succeeded": {
          const intent = event.data.object as any;
          const paymentIntentId = intent.id;

          console.log(`[WEBHOOK] PaymentIntent succeeded: ${paymentIntentId}`);

          // Check if this is a wallet top-up
          const topUpKey = idempotencyService.buildTopUpKey(paymentIntentId);
          const topUpData = await idempotencyService.getKey(topUpKey);

          if (topUpData) {
            // It's a wallet top-up
            try {
              await walletService.confirmWalletTopUp(paymentIntentId);
              console.log(
                `[WEBHOOK] Wallet top-up confirmed for ${paymentIntentId}`,
              );
            } catch (err: any) {
              console.error(`[WEBHOOK] Wallet top-up failed: ${err.message}`);
            }
          } else {
            // Regular order payment
            try {
              const payment = await Payment.findOne({
                gatewayPaymentId: paymentIntentId,
              });
              if (payment && payment.paymentStatus === "pending") {
                payment.paymentStatus = "paid";
                payment.paidAt = new Date();
                await payment.save();

                await Order.findByIdAndUpdate(payment.orderId, {
                  paymentStatus: "paid",
                  orderStatus: "confirmed",
                  paymentId: payment._id,
                });
                console.log(
                  `[WEBHOOK] Order payment confirmed for ${paymentIntentId}`,
                );
              }
            } catch (err: any) {
              console.error(
                `[WEBHOOK] Order payment confirmation failed: ${err.message}`,
              );
            }
          }
          break;
        }

        case "payment_intent.payment_failed": {
          const intent = event.data.object as any;
          console.log(`[WEBHOOK] PaymentIntent failed: ${intent.id}`);
          try {
            const payment = await Payment.findOne({
              gatewayPaymentId: intent.id,
            });
            if (payment) {
              payment.paymentStatus = "failed";
              payment.failureReason =
                intent.last_payment_error?.message ?? "Payment failed";
              await payment.save();

              await Order.findByIdAndUpdate(payment.orderId, {
                paymentStatus: "failed",
              });
            }
          } catch (err: any) {
            console.error(
              `[WEBHOOK] Failed payment handling error: ${err.message}`,
            );
          }
          break;
        }

        case "charge.refund.updated": {
          const charge = event.data.object as any;
          console.log(
            `[WEBHOOK] Charge refund updated for charge: ${charge.id}`,
          );
          try {
            if (charge.payment_intent) {
              await Payment.findOneAndUpdate(
                { gatewayPaymentId: charge.payment_intent },
                { refundedAmount: charge.amount_refunded / 100 },
              );
            }
          } catch (err: any) {
            console.error(`[WEBHOOK] Refund update error: ${err.message}`);
          }
          break;
        }

        case "payment_intent.canceled": {
          const intent = event.data.object as any;
          console.log(`[WEBHOOK] PaymentIntent canceled: ${intent.id}`);
          try {
            const payment = await Payment.findOne({
              gatewayPaymentId: intent.id,
            });
            if (payment) {
              payment.paymentStatus = "failed";
              payment.failureReason = "PaymentIntent canceled";
              await payment.save();

              await Order.findByIdAndUpdate(payment.orderId, {
                paymentStatus: "failed",
              });
            }
          } catch (err: any) {
            console.error(
              `[WEBHOOK] Cancellation handling error: ${err.message}`,
            );
          }
          break;
        }

        default:
          console.log(`[WEBHOOK] Unhandled event type: ${event.type}`);
      }
    } catch (err: any) {
      // Log but never throw — Stripe already got 200
      console.error(
        `[WEBHOOK] Unhandled error processing event ${event.type}: ${err.message}`,
      );
    }
  },
};

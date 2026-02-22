import { Router, raw } from "express";
import { webhookController } from "../controllers/webhook.controller.js";
import { stripeWebhookMiddleware } from "../middlewares/stripeWebhook.middleware.js";

const router = Router();

/**
 * /api/webhook/stripe
 *
 * CRITICAL: express.raw() must be used here — NOT express.json().
 * Stripe signature verification requires the raw body buffer.
 * The global express.json() middleware is NOT applied to this route
 * because it is mounted before the global middleware in server.ts.
 */
router.post(
  "/stripe",
  raw({ type: "application/json" }),
  stripeWebhookMiddleware,
  webhookController.handleStripeWebhook,
);

export default router;

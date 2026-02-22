import { Request, Response, NextFunction } from "express";
import { stripeService } from "../services/stripe.service.js";
import AppError from "../../utils/AppError.js";

/**
 * Stripe webhook middleware.
 *
 * IMPORTANT: This must be applied BEFORE express.json() on this route only.
 * Stripe requires the raw Buffer body for signature verification.
 * express.raw() is applied at the route level in webhook.routes.ts.
 */
export const stripeWebhookMiddleware = (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return next(new AppError("Missing Stripe signature header", 400));
  }

  try {
    const event = stripeService.createWebhookEvent(
      req.body as Buffer,
      signature,
    );
    req.stripeEvent = event;
    next();
  } catch (err: any) {
    next(err);
  }
};

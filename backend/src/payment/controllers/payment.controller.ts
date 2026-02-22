import { Request, Response, NextFunction } from "express";
import { paymentService } from "../services/payment.service.js";
import { codService } from "../services/cod.service.js";

const ok = (res: Response, message: string, data: any, status = 200) =>
  res.status(status).json({ success: true, message, data });

/**
 * Payment controller — buyer-facing and admin payment endpoints.
 */
export const paymentController = {
  /** POST /payments/initiate — Buyer: initiate a payment */
  async initiatePayment(req: any, res: Response, next: NextFunction) {
    try {
      const result = await paymentService.initiatePayment(
        req.user.userId,
        req.body,
      );
      ok(res, "Payment initiated", result, 201);
    } catch (err) {
      next(err);
    }
  },

  /** POST /payments/stripe/confirm — Buyer: confirm after Stripe frontend flow */
  async confirmStripePayment(req: any, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.confirmStripePayment(
        req.body.paymentIntentId,
        req.user.userId,
      );
      ok(res, "Payment confirmed", { payment });
    } catch (err) {
      next(err);
    }
  },

  /** GET /payments/order/:orderId — Buyer: get payment for an order */
  async getPaymentByOrder(req: any, res: Response, next: NextFunction) {
    try {
      const payment = await paymentService.getPaymentByOrder(
        req.params.orderId as string,
        req.user.userId,
      );
      ok(res, "Payment fetched", { payment });
    } catch (err) {
      next(err);
    }
  },

  /** GET /payments/history — Buyer: own payment history */
  async getPaymentHistory(req: any, res: Response, next: NextFunction) {
    try {
      const result = await paymentService.getUserPayments(
        req.user.userId,
        req.query as any,
      );
      ok(res, "Payment history fetched", result);
    } catch (err) {
      next(err);
    }
  },

  /** GET /payments/ — Admin: all payments */
  async getAllPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await paymentService.getAllPayments(req.query as any);
      ok(res, "All payments fetched", result);
    } catch (err) {
      next(err);
    }
  },

  /** POST /payments/cod/confirm/:orderId — Admin: confirm COD cash collection */
  async confirmCODCollection(req: any, res: Response, next: NextFunction) {
    try {
      const payment = await codService.confirmCODCollection(
        req.params.orderId as string,
        req.user.userId,
      );
      ok(res, "COD collection confirmed", { payment });
    } catch (err) {
      next(err);
    }
  },
};

import { Request, Response, NextFunction } from "express";
import Payment from "../../models/Payment.model.js";
import AppError from "../../utils/AppError.js";

/**
 * Middleware to verify that the authenticated user is the owner of a payment.
 * Attaches the payment to req.payment for the downstream controller.
 */
export const paymentAccess = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paymentId = req.params.paymentId ?? req.body.paymentId;

    if (!paymentId) return next();

    const payment = await Payment.findById(paymentId);
    if (!payment) return next(new AppError("Payment not found", 404));

    if (
      req.user?.role !== "admin" &&
      String(payment.userId) !== req.user?.userId
    ) {
      return next(new AppError("Access denied", 403));
    }

    req.payment = payment;
    next();
  } catch (err) {
    next(err);
  }
};

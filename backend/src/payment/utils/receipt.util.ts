import { IPayment } from "../../interfaces/index.js";
import { roundAmount, formatCurrency } from "./currency.util.js";

export interface IPaymentReceipt {
  receiptNumber: string;
  orderId: string;
  paymentId: string;
  transactionId: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  gateway: string;
  status: string;
  paidAt: string;
  generatedAt: string;
}

/**
 * Generates a structured receipt data object from a payment document.
 * Suitable for PDF generation or email confirmation.
 *
 * @param payment - The Payment document to generate receipt for
 * @returns IPaymentReceipt structured receipt data
 */
export const generateReceiptData = (payment: IPayment): IPaymentReceipt => {
  return {
    receiptNumber: `RCP-${String(payment._id).slice(-8).toUpperCase()}`,
    orderId: String(payment.orderId),
    paymentId: String(payment._id),
    transactionId: payment.transactionId,
    amount: formatCurrency(roundAmount(payment.amount), payment.currency),
    currency: payment.currency,
    paymentMethod: payment.paymentMethod,
    gateway: payment.gatewayName,
    status: payment.paymentStatus,
    paidAt: payment.paidAt ? payment.paidAt.toISOString() : "Not completed",
    generatedAt: new Date().toISOString(),
  };
};

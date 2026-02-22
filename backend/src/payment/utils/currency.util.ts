/**
 * Converts INR rupees to paise for Stripe API calls.
 * Stripe requires smallest currency unit.
 * @example toPaise(499.00) → 49900
 */
export const toPaise = (amount: number): number => Math.round(amount * 100);

/**
 * Converts Stripe paise amount back to INR rupees.
 * @example fromPaise(49900) → 499.00
 */
export const fromPaise = (paise: number): number => paise / 100;

/**
 * Formats a numeric amount with the correct currency symbol.
 * @example formatCurrency(499, "INR") → "₹499.00"
 */
export const formatCurrency = (amount: number, currency: string): string => {
  const symbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
    GBP: "£",
  };
  const symbol = symbols[currency.toUpperCase()] ?? currency;
  return `${symbol}${amount.toFixed(2)}`;
};

/**
 * Rounds a number to exactly 2 decimal places consistently.
 * @example roundAmount(49.999) → 50.00
 */
export const roundAmount = (amount: number): number =>
  Math.round(amount * 100) / 100;

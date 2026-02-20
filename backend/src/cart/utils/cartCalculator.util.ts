import { ICartItem } from "../../interfaces";

/**
 * Cart Calculator Utility - Handles mathematical logic for cart totals
 */
export const cartCalculator = {
  /**
   * Sum of all item quantities
   */
  calculateTotalItems(items: ICartItem[]): number {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Sum of (effectivePrice * quantity) for each item
   */
  calculateTotalAmount(items: ICartItem[]): number {
    const total = items.reduce((sum, item) => {
      return sum + this.calculateItemTotal(item);
    }, 0);
    return this.formatAmount(total);
  },

  /**
   * (salePrice ?? basePrice) * quantity for a single item
   */
  calculateItemTotal(item: ICartItem): number {
    const { basePrice, salePrice } = item.priceSnapshot;
    const effectivePrice = salePrice ?? basePrice;
    return effectivePrice * item.quantity;
  },

  /**
   * Ensures consistent 2 decimal rounding throughout
   */
  formatAmount(amount: number): number {
    return Math.round(amount * 100) / 100;
  },
};

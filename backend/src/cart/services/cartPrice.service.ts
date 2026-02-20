import {
  ICartItemPriceSnapshot,
  IProduct,
  IProductVariant,
} from "../../interfaces";

/**
 * Cart Price Service - Logic for price snapshots and comparisons
 */
export const cartPriceService = {
  /**
   * Generates a price snapshot based on current product or variant price
   */
  buildPriceSnapshot(
    product: IProduct,
    variant?: IProductVariant,
  ): ICartItemPriceSnapshot {
    if (variant) {
      return {
        basePrice: variant.price,
        salePrice: undefined, // variant price is fixed to price property
        currency: product.currency,
      };
    }

    return {
      basePrice: product.basePrice,
      salePrice: product.salePrice,
      currency: product.currency,
    };
  },

  /**
   * Returns salePrice if it exists, else basePrice
   */
  getEffectivePrice(snapshot: ICartItemPriceSnapshot): number {
    return snapshot.salePrice ?? snapshot.basePrice;
  },

  /**
   * Compares effective prices between two snapshots
   */
  hasPriceChanged(
    oldSnapshot: ICartItemPriceSnapshot,
    newSnapshot: ICartItemPriceSnapshot,
  ): boolean {
    return (
      this.getEffectivePrice(oldSnapshot) !==
      this.getEffectivePrice(newSnapshot)
    );
  },

  /**
   * Checks if price changed by more than 10%
   */
  isPriceChangedSignificantly(
    oldSnapshot: ICartItemPriceSnapshot,
    newSnapshot: ICartItemPriceSnapshot,
  ): boolean {
    const oldPrice = this.getEffectivePrice(oldSnapshot);
    const newPrice = this.getEffectivePrice(newSnapshot);

    if (oldPrice === 0) return newPrice > 0;

    const diffPercent = Math.abs((newPrice - oldPrice) / oldPrice);
    return diffPercent > 0.1; // 10%
  },
};

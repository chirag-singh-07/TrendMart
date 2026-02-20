import {
  ICartItem,
  IOrderItem,
  IAddress,
  IProduct,
} from "../../interfaces/index.js";
import Product from "../../product/models/product.model.js";

/**
 * Calculates shipping fee for a set of items and a delivery address.
 */
export const calculateShippingFee = async (
  items: (ICartItem | IOrderItem | any)[],
  address?: IAddress,
): Promise<number> => {
  // 1. Calculate subtotal for free shipping check
  // Note: For items in cart/order, we use the snapshotted price or effective price
  let subtotal = 0;
  let heavyItemCount = 0;

  for (const item of items) {
    const qty = item.quantity;

    // Determine unit price
    let unitPrice = 0;
    if (item.priceSnapshot) {
      unitPrice = item.priceSnapshot.salePrice ?? item.priceSnapshot.basePrice;
    } else if (item.totalPrice) {
      unitPrice = item.totalPrice / qty;
    }

    subtotal += unitPrice * qty;

    // Check for heavy items
    // If it's a cart item, we might need to fetch the product to check shippingClass
    // If it's an order item, it might be in the snapshot? (IOrderItemPriceSnapshot doesn't have shippingClass)
    // The prompt says "if item has shippingClass 'heavy'".
    // I'll fetch the product if not fully populated.
    let product;
    if (
      item.productId &&
      typeof item.productId === "object" &&
      (item.productId as any).shippingClass
    ) {
      product = item.productId;
    } else {
      product = await Product.findById(item.productId).select("shippingClass");
    }

    if (product?.shippingClass === "heavy") {
      heavyItemCount++;
    }
  }

  // Logic:
  // - base fee: 40
  // - if subtotal > 499: 0
  // - heavy surcharge: 60 per item
  // - cap: 200

  if (subtotal > 499) return 0;

  let fee = 40 + heavyItemCount * 60;

  return Math.min(fee, 200);
};

/**
 * Scoped version for a single seller's items within an order
 */
export const calculateSellerShipping = async (
  items: IOrderItem[],
): Promise<number> => {
  return await calculateShippingFee(items);
};

import Product from "../models/product.model";
import ProductVariant from "../models/variant.model";

/**
 * Aggregate sum of all variant stocks and update product totalStock
 * @param productId Product ID
 * @returns new total stock
 */
export const recalculateProductStock = async (
  productId: string,
): Promise<number> => {
  const variants = await ProductVariant.find({ productId });

  if (variants.length === 0) {
    const product = await Product.findById(productId);
    return product?.totalStock || 0;
  }

  const totalStock = variants.reduce((sum, variant) => sum + variant.stock, 0);

  await Product.findByIdAndUpdate(productId, { totalStock });

  await autoUpdateProductStatus(productId, totalStock);

  return totalStock;
};

/**
 * Check if stock is below or equal to threshold
 */
export const isLowStock = (totalStock: number, threshold: number): boolean => {
  return totalStock <= threshold;
};

/**
 * Check if product is out of stock
 */
export const isOutOfStock = (totalStock: number): boolean => {
  return totalStock === 0;
};

/**
 * Auto update product status based on stock level
 */
export const autoUpdateProductStatus = async (
  productId: string,
  totalStock: number,
): Promise<void> => {
  const product = await Product.findById(productId);
  if (!product) return;

  let newStatus = product.status;

  if (totalStock === 0 && product.status === "active") {
    newStatus = "out_of_stock";
  } else if (totalStock > 0 && product.status === "out_of_stock") {
    newStatus = "active";
  }

  if (newStatus !== product.status) {
    await Product.findByIdAndUpdate(productId, { status: newStatus });
  }
};

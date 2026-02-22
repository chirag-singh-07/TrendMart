import React from "react";
import { Star } from "lucide-react";
import type { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="group relative bg-white border border-[#e0e0e0] overflow-hidden hover:border-black transition-all">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f5f5f5]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold px-2 py-1 tracking-tighter">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-bold text-black text-sm truncate uppercase tracking-tight">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating) ? "black" : "none"}
                className={
                  i < Math.floor(product.rating)
                    ? "text-black"
                    : "text-[#e0e0e0]"
                }
              />
            ))}
          </div>
          <span className="text-[10px] text-[#9e9e9e] font-medium">
            ({product.reviewCount})
          </span>
        </div>

        {/* Pricing */}
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-black">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-[#9e9e9e] line-through">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="w-full mt-2 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest border border-black hover:bg-white hover:text-black transition-all">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

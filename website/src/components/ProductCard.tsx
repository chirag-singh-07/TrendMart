import React from "react";
import { Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Product } from "../data/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick add logic
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Wishlist logic
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col gap-4 w-full max-w-[280px] mx-auto transition-all duration-500 hover:-translate-y-1 block"
    >
      {/* Image Section */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-[#F7F7F7] ring-1 ring-black/5 transition-all duration-500 group-hover:ring-black/10 group-hover:shadow-2xl group-hover:shadow-black/10">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.2,1,0.3,1)] group-hover:scale-110"
        />

        {/* Floating Actions */}
        <div className="absolute top-4 right-4 z-10 translate-x-4 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleWishlist}
            className="h-10 w-10 rounded-full bg-white/90 backdrop-blur-md shadow-lg text-foreground hover:bg-white hover:text-primary border-none"
          >
            <Heart size={18} />
          </Button>
        </div>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-4 bottom-4 z-10 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            onClick={handleQuickAdd}
            className="w-full h-12 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest shadow-2xl hover:bg-primary hover:text-white transition-all border-none"
          >
            Quick Add
          </Button>
        </div>

        {/* Discount Badge */}
        {product.discount > 0 && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-black text-white text-[9px] font-black px-2.5 py-1 rounded-full uppercase border-none hover:bg-black">
              {product.discount}% OFF
            </Badge>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="flex flex-col gap-1.5 px-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.15em]">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <Star size={10} fill="currentColor" className="text-black" />
            <span className="text-[10px] font-black">{product.rating}</span>
          </div>
        </div>

        <h3 className="text-sm font-bold text-foreground leading-tight tracking-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        <div className="flex items-baseline gap-2 mt-0.5">
          <span className="text-lg font-black text-foreground tracking-tighter">
            ₹{product.price.toLocaleString()}
          </span>
          {product.originalPrice > product.price && (
            <span className="text-xs text-muted-foreground line-through opacity-50 font-medium">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

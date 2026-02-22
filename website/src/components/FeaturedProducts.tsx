import React from "react";
import ProductCard from "./ProductCard";
import { products } from "../data/products";

const FeaturedProducts: React.FC = () => {
  // Take first 8 products for homepage
  const featured = products.slice(0, 8);

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="flex items-center justify-between mb-10 border-b border-black pb-4">
        <h2 className="text-3xl font-black text-black tracking-tighter uppercase">
          Featured Products
        </h2>
        <button className="text-xs font-bold uppercase tracking-widest hover:opacity-60 transition-opacity">
          View All Products →
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;

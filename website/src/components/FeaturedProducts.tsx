import React from "react";
import ProductCard from "./ProductCard";
import { products } from "../data/products";
import { Button } from "@/components/ui/button";

const FeaturedProducts: React.FC = () => {
  // Take first 8 products for homepage
  const featured = products.slice(0, 8);

  return (
    <section className="container mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 px-2">
        <div className="space-y-2">
          <span className="text-primary text-xs font-black uppercase tracking-[0.4em]">
            Curated Selection
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter uppercase whitespace-nowrap">
            Featured <span className="text-primary italic">Products</span>
          </h2>
        </div>
        <Button className="px-8 py-6 bg-muted text-foreground rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-foreground hover:text-background transition-all border-none">
          View All Products
        </Button>
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

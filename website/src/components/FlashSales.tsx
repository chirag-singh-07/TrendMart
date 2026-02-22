import React from "react";
import ProductCard from "./ProductCard";
import { products } from "../data/products";
import { Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

const FlashSales: React.FC = () => {
  // Get products with discount > 40%
  const flashProducts = products.filter((p) => p.discount >= 40).slice(0, 6);

  return (
    <section className="py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b pb-8 border-black/5">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-black text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl">
              <Timer size={32} />
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
                Flash <span className="text-primary">Sales</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <p className="text-muted-foreground text-[10px] font-black tracking-[0.2em] uppercase">
                  Ends in 04h 23m 12s
                </p>
              </div>
            </div>
          </div>
          <Button className="px-10 h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-primary transition-all border-none">
            View All Offers
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {flashProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FlashSales;

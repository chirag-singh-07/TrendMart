import React from "react";

const brands = [
  "APPLE",
  "NIKE",
  "ADIDAS",
  "SONY",
  "SAMSUNG",
  "ROLEX",
  "ZARA",
  "GUCCI",
];

const BrandShowcase: React.FC = () => {
  return (
    <section className="py-24 border-y border-border/40 overflow-hidden bg-background">
      <div className="container mx-auto px-4 mb-16">
        <h2 className="text-center text-xs font-black tracking-[0.4em] uppercase text-muted-foreground/60">
          Our Premium Partners
        </h2>
      </div>
      <div className="flex items-center gap-24 animate-in fade-in duration-1000">
        <div className="flex gap-24 items-center justify-around min-w-full animate-scroll">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-4xl md:text-6xl font-black text-foreground/10 hover:text-primary transition-colors cursor-default tracking-tighter"
            >
              {brand}
            </span>
          ))}
        </div>
        <div className="flex gap-24 items-center justify-around min-w-full animate-scroll">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-4xl md:text-6xl font-black text-foreground/10 hover:text-primary transition-colors cursor-default tracking-tighter"
            >
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandShowcase;

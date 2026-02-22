import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PromoBanner: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="relative h-[400px] md:h-[500px] rounded-[3rem] overflow-hidden group">
          <img
            src="https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop"
            alt="Promotion"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center px-12 md:px-24">
            <div className="max-w-xl space-y-8">
              <Badge className="px-4 py-1 bg-primary text-white text-[10px] font-black tracking-[0.3em] rounded-full uppercase border-none hover:bg-primary">
                Limited Edition
              </Badge>
              <h2 className="text-4xl md:text-7xl font-black text-white leading-none tracking-tighter">
                ELEVATE YOUR <br />{" "}
                <span className="text-primary italic">LIFESTYLE.</span>
              </h2>
              <p className="text-white/60 text-lg font-medium max-w-sm">
                Discover our curated collection of luxury essentials designed
                for the modern individual.
              </p>
              <Button className="px-12 py-8 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-2xl border-none">
                Explore Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;

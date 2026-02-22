import React from "react";
import {
  Laptop,
  Shirt,
  Home,
  Trophy,
  Book,
  Sparkles,
  Gamepad2,
  ShoppingBasket,
} from "lucide-react";

const categories = [
  { name: "Electronics", icon: Laptop },
  { name: "Fashion", icon: Shirt },
  { name: "Home & Living", icon: Home },
  { name: "Sports", icon: Trophy },
  { name: "Books", icon: Book },
  { name: "Beauty", icon: Sparkles },
  { name: "Toys", icon: Gamepad2 },
  { name: "Grocery", icon: ShoppingBasket },
];

const CategoryRow: React.FC = () => {
  return (
    <div className="w-full bg-background border-b border-border/40 py-10">
      <div className="container mx-auto px-4 overflow-x-auto scrollbar-hide">
        <div className="flex justify-between md:justify-center items-center gap-10 md:gap-20 min-w-max px-4">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group flex flex-col items-center gap-4 cursor-pointer"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center bg-card rounded-[2.5rem] shadow-premium hover:shadow-premium-hover border border-border/50 group-hover:border-primary/30 group-hover:-translate-y-2 transition-all duration-500">
                <cat.icon
                  size={36}
                  className="text-foreground group-hover:text-primary transition-colors"
                />
              </div>
              <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-all">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryRow;

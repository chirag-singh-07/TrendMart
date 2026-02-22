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
    <div className="w-full bg-white border-b border-[#e0e0e0]">
      <div className="container mx-auto px-4 py-6 overflow-x-auto">
        <div className="flex justify-between md:justify-center items-center gap-8 md:gap-16 min-w-max">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="group flex flex-col items-center gap-2 cursor-pointer"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center bg-black rounded-full border-2 border-transparent transition-all group-hover:ring-2 group-hover:ring-black group-hover:ring-offset-2">
                <cat.icon size={28} className="text-white" />
              </div>
              <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black group-hover:opacity-60 transition-opacity">
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

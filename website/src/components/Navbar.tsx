import React, { useState } from "react";
import { Search, Heart, ShoppingCart, User, Menu, X } from "lucide-react";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-[#e0e0e0]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <a
            href="/"
            className="text-2xl font-bold tracking-tighter text-black"
          >
            SHOPX
          </a>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-grow max-w-2xl items-center relative">
          <input
            type="text"
            placeholder="Search for products, brands and more"
            className="w-full h-10 px-4 border border-[#e0e0e0] focus:border-black outline-none transition-colors"
          />
          <button className="h-10 px-6 bg-black text-white font-medium hover:bg-[#333333] transition-colors ml-[-1px]">
            Search
          </button>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-6">
            <button className="flex items-center gap-1 hover:text-[#9e9e9e] transition-colors">
              <Heart size={20} />
              <span className="text-sm font-medium">Wishlist</span>
            </button>
            <button className="flex items-center gap-1 hover:text-[#9e9e9e] transition-colors">
              <User size={20} />
              <span className="text-sm font-medium">Account</span>
            </button>
          </div>
          <button className="relative flex items-center gap-1 hover:text-[#9e9e9e] transition-colors">
            <ShoppingCart size={20} />
            <span className="hidden lg:inline text-sm font-medium">Cart</span>
            <span className="absolute -top-1 -right-1 lg:right-auto lg:left-3 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center border border-white">
              2
            </span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-1"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar (always visible on mobile) */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center relative">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full h-9 px-3 text-sm border border-[#e0e0e0] outline-none"
          />
          <button className="absolute right-0 h-9 px-3 bg-black text-white">
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-[#e0e0e0] py-4 px-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          <button className="flex items-center gap-3 py-2 text-black font-medium border-b border-[#f5f5f5]">
            <Heart size={20} />
            Wishlist
          </button>
          <button className="flex items-center gap-3 py-2 text-black font-medium border-b border-[#f5f5f5]">
            <User size={20} />
            Account
          </button>
          <div className="pt-2 text-xs text-[#9e9e9e] uppercase font-bold tracking-widest">
            Categories
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <a href="#" className="py-2">
              Electronics
            </a>
            <a href="#" className="py-2">
              Fashion
            </a>
            <a href="#" className="py-2">
              Home
            </a>
            <a href="#" className="py-2">
              Sports
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

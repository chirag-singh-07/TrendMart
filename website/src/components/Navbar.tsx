import React from "react";
import { Link } from "react-router-dom";
import { Search, Heart, ShoppingCart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-border/40 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between gap-8">
        {/* Left: Logo */}
        <div className="flex-shrink-0">
          <Link
            to="/"
            className="text-3xl font-black tracking-tighter text-foreground group"
          >
            TREND
            <span className="text-primary group-hover:text-foreground transition-colors">
              MART
            </span>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-grow max-w-2xl items-center relative group">
          <div className="absolute left-4 z-10 text-muted-foreground group-focus-within:text-foreground transition-colors pointer-events-none">
            <Search size={18} />
          </div>
          <Input
            placeholder="Search for products, brands and more..."
            className="h-12 pl-12 pr-28 rounded-2xl bg-muted/50 border-none focus-visible:ring-primary/20 focus-visible:bg-white transition-all outline-none text-sm"
          />
          <Button
            size="sm"
            className="absolute right-1.5 h-9 px-6 bg-foreground text-background rounded-xl font-semibold text-xs hover:bg-foreground/90 transition-all border-none"
          >
            Search
          </Button>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-lg"
              className="rounded-xl text-muted-foreground hover:text-foreground relative group"
            >
              <Heart size={22} />
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                Wishlist
              </div>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-muted-foreground hover:text-foreground relative group h-10 w-10 flex items-center justify-center"
              asChild
            >
              <Link to="/login">
                <User size={22} />
                <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                  Account
                </div>
              </Link>
            </Button>
          </div>
          <Button
            size="icon-lg"
            className="relative rounded-xl bg-foreground text-background hover:scale-105 transition-all shadow-md"
          >
            <ShoppingCart size={22} />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-background">
              2
            </span>
          </Button>

          {/* Mobile Menu Toggle */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden rounded-xl hover:bg-muted"
              >
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="glass backdrop-blur-xl">
              <SheetHeader>
                <SheetTitle className="text-left font-black tracking-tighter text-2xl">
                  TRENDMART
                </SheetTitle>
              </SheetHeader>
              <div className="mt-8 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="secondary"
                    className="flex flex-col items-center gap-2 h-auto p-4 rounded-2xl bg-muted hover:bg-muted/80"
                  >
                    <Heart size={24} className="text-foreground" />
                    <span className="text-xs font-semibold">Wishlist</span>
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex flex-col items-center gap-2 h-auto p-4 rounded-2xl bg-muted hover:bg-muted/80"
                    asChild
                  >
                    <Link to="/login">
                      <User size={24} className="text-foreground" />
                      <span className="text-xs font-semibold">Account</span>
                    </Link>
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="text-[10px] text-muted-foreground uppercase font-black tracking-widest pl-2">
                    Popular Categories
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {["Electronics", "Fashion", "Home", "Sports"].map((cat) => (
                      <a
                        key={cat}
                        href="#"
                        className="py-3 px-4 rounded-xl bg-muted/50 text-sm font-medium hover:bg-primary hover:text-white transition-all text-center"
                      >
                        {cat}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar (always visible on mobile) */}
      <div className="md:hidden px-4 pb-4">
        <div className="flex items-center relative">
          <Search
            className="absolute left-3 z-10 text-muted-foreground"
            size={16}
          />
          <Input
            placeholder="Search products..."
            className="w-full h-11 pl-10 pr-4 text-sm rounded-xl bg-muted border-none outline-none focus-visible:ring-primary/20 transition-all"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

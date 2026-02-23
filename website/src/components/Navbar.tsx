import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Heart,
  ShoppingCart,
  Menu,
  LogOut,
  Package,
  UserCircle,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/store/authStore";
import { API_BASE_URL } from "@/lib/axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout(navigate);
  };

  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-zinc-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-6">
        {/* Left: Logo */}
        <div className="shrink-0">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-black uppercase italic flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-lg transition-transform group-hover:rotate-12">
              T
            </div>
            TrendMart
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex grow max-w-xl items-center relative group">
          <Search
            className="absolute left-4 z-10 text-zinc-400 group-focus-within:text-black transition-colors"
            size={16}
          />
          <Input
            placeholder="DISCOVER THE COLLECTION..."
            className="h-10 pl-11 pr-4 rounded-xl bg-zinc-50 border-zinc-100 focus-visible:ring-black/5 focus-visible:bg-white focus-visible:border-zinc-200 transition-all text-[10px] font-bold uppercase tracking-widest placeholder:text-zinc-400"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-xl text-zinc-400 hover:text-black hover:bg-zinc-50 transition-all"
            >
              <Heart size={20} />
            </Button>

            <div className="h-4 w-px bg-zinc-100 mx-2" />

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="rounded-xl px-2 gap-2 hover:bg-zinc-50 transition-all group h-10"
                  >
                    <Avatar className="h-8 w-8 border border-zinc-200 group-hover:border-zinc-400 transition-colors">
                      <AvatarImage
                        src={
                          user?.avatar
                            ? `${API_BASE_URL}${user.avatar}`
                            : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&h=100&auto=format&fit=crop"
                        }
                        alt={user?.firstName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-zinc-100 text-[10px] font-black">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600 group-hover:text-black transition-colors">
                      {user?.firstName}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl p-2 border-zinc-100 shadow-xl bg-white"
                >
                  <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest opacity-40 px-3 py-2">
                    Profile Portal
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-zinc-50" />
                  <DropdownMenuItem
                    onClick={() => navigate("/profile")}
                    className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-zinc-50 transition-all group"
                  >
                    <UserCircle
                      size={16}
                      className="mr-3 text-zinc-400 group-hover:text-black transition-colors"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Profile
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-zinc-50 transition-all group">
                    <Package
                      size={16}
                      className="mr-3 text-zinc-400 group-hover:text-black transition-colors"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Order History
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-zinc-50 transition-all group">
                    <Settings
                      size={16}
                      className="mr-3 text-zinc-400 group-hover:text-black transition-colors"
                    />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      Settings
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-zinc-50" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="rounded-xl px-3 py-2.5 cursor-pointer hover:bg-red-50 transition-all group text-red-600"
                  >
                    <LogOut
                      size={16}
                      className="mr-3 opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Terminate Session
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  className="rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50"
                  asChild
                >
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button
                  className="rounded-xl bg-black text-white px-5 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-lg hover:shadow-black/10"
                  asChild
                >
                  <Link to="/register">Register</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="h-4 w-px bg-zinc-100 mx-1 hidden lg:block" />

          <Button
            size="icon"
            className="relative rounded-xl bg-black text-white hover:bg-zinc-800 transition-all shadow-lg hover:shadow-black/20"
          >
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-white text-black text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-zinc-100">
              0
            </span>
          </Button>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden rounded-xl bg-zinc-50 border border-zinc-100"
              >
                <Menu size={20} />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] rounded-l-3xl p-6 border-zinc-100 bg-white shadow-2xl overflow-y-auto"
            >
              <SheetHeader className="mb-8">
                <SheetTitle className="text-left font-black tracking-tighter text-2xl uppercase italic flex items-center gap-2">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-lg">
                    T
                  </div>
                  TrendMart
                </SheetTitle>
              </SheetHeader>

              <div className="space-y-8">
                {isAuthenticated ? (
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-100 space-y-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12 rounded-xl border border-zinc-200">
                        <AvatarImage
                          src={user?.avatar || "https://github.com/shadcn.png"}
                          alt={user?.firstName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-white text-xs font-black">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-[12px] font-black uppercase tracking-widest leading-none">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-[9px] font-bold text-zinc-400 mt-1 uppercase tracking-widest">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        className="h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border-zinc-200"
                        onClick={handleLogout}
                      >
                        Log Out
                      </Button>
                      <Button
                        className="h-10 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest border-none"
                        onClick={() => navigate("/profile")}
                      >
                        Profile
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-12 rounded-xl text-[10px] font-black uppercase tracking-widest border-zinc-200"
                      asChild
                    >
                      <Link to="/login">Sign In</Link>
                    </Button>
                    <Button
                      className="h-12 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest border-none shadow-xl"
                      asChild
                    >
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="text-[10px] text-zinc-400 uppercase font-black tracking-[0.3em] pl-2 border-l-2 border-black">
                    Categories
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {[
                      "Electronics",
                      "Apparel",
                      "Home Office",
                      "Aesthetics",
                      "Footwear",
                    ].map((cat) => (
                      <Link
                        key={cat}
                        to={`/category/${cat.toLowerCase()}`}
                        className="py-3 px-4 rounded-xl bg-zinc-50 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all border border-zinc-100"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="pt-8 border-t border-zinc-100">
                  <p className="text-center text-[8px] font-black uppercase tracking-[0.4em] opacity-20">
                    © 2026 TrendMart Minimalist Collective
                  </p>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mobile Search Bar - Simplified */}
      <div className="lg:hidden px-4 pb-4">
        <div className="flex items-center relative group">
          <Search
            className="absolute left-4 z-10 text-zinc-400 group-focus-within:text-black transition-colors"
            size={14}
          />
          <Input
            placeholder="DISCOVER..."
            className="w-full h-10 pl-11 pr-4 text-[10px] font-bold uppercase tracking-widest rounded-xl bg-zinc-50 border-zinc-100 outline-none focus-visible:ring-black/5 focus-visible:bg-white transition-all shadow-sm"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

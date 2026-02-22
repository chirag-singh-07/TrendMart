import { Link } from "react-router-dom";
import {
  Search,
  Bell,
  MessageSquare,
  User,
  LogOut,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px]">
              <div className="flex flex-col gap-4 mt-8">
                <Button variant="ghost" className="justify-start">
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start">
                  Products
                </Button>
                <Button variant="ghost" className="justify-start">
                  Orders
                </Button>
                <Button variant="ghost" className="justify-start">
                  Analytics
                </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="text-xl font-bold tracking-tighter">
            Trend<span className="text-gray-500">Mart</span>{" "}
            <span className="text-black ml-1 uppercase text-xs tracking-widest bg-black text-white px-2 py-0.5 rounded">
              Sellers
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-black transition-colors" />
          <Input
            placeholder="Search products, orders..."
            className="pl-10 h-10 border-gray-200 rounded-xl focus-visible:ring-black/5"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-black rounded-full border-2 border-white" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-500 hover:text-black hover:bg-gray-100 rounded-xl"
          >
            <MessageSquare className="h-5 w-5" />
          </Button>

          <div className="h-6 w-[1px] bg-gray-200 mx-2" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-10 px-2 hover:bg-gray-100 rounded-xl gap-2"
              >
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>TM</AvatarFallback>
                </Avatar>
                <div className="hidden lg:block text-left">
                  <p className="text-xs font-bold leading-none">Chirag Singh</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    Elite Seller
                  </p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 rounded-xl shadow-xl border-gray-100"
            >
              <DropdownMenuLabel className="font-bold">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer gap-2 py-2.5">
                <User size={16} /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer gap-2 py-2.5">
                <Settings size={16} /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                asChild
                className="cursor-pointer gap-2 text-red-600 py-2.5"
              >
                <Link to="/login">
                  <LogOut size={16} /> Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

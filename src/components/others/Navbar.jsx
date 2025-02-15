import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { navLinks } from "@/utils";
import { Archive, Heart, Loader2, LogOut, Menu, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import SearchBar from "./SearchBar";
import Sidebar from "./Sidebar";
import { Sheet, SheetTrigger } from "../ui/sheet";
import { useState } from "react";
import CartDrawer from "./CartDrawer";
import { useAuthStore } from "@/store/authStore";

const Navbar = () => {
  // const isLoggind = true;
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleOpenSideBar = () => {
    setOpen(!open);
  };

  const handleLogout = async () => {
    await logout(navigate);
  };

  return (
    <>
      <nav className="container   md:mx-auto flex items-center justify-between md:px-6 px-1 py-4">
        <div className="flex items-center">
          <Link to={"/"}>
            <span className="text-2xl font-bold">TrendMart</span>
          </Link>
        </div>
        {isAuthenticated && (
          <div className=" hidden md:flex items-center gap-6 font-semibold sm:space-x-4">
            {navLinks.map((link, index) => (
              <Link key={index} to={link.path} className="mr-4">
                {link.name}
                {link.icon && <span className="ml-2">{link.icon}</span>}
              </Link>
            ))}
          </div>
        )}
        <div className="flex items-center">
          {isAuthenticated ? (
            <div className="flex gap-4 items-center">
              {/* <Search className="size-7" /> */}
              <div className="overflow-hidden cursor-pointer">
                <SearchBar />
              </div>
              <CartDrawer />
              <DropdownMenu className="w-96">
                <DropdownMenuTrigger asChild>
                  <Avatar className="cursor-pointer size-8 rounded-full">
                    <AvatarImage src={user.profilePic} alt="user profile" />
                    <AvatarFallback className="bg-black text-white px-2 py-1">
                      {user.fullName?.slice(0, 2).toUpperCase() || "NA"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="p-2 w-48">
                  <DropdownMenuLabel className="p-2 font-bold">
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-4">
                    <Link
                      to="/profile"
                      className="w-full  ml-2 flex text-lg gap-2"
                    >
                      <User className="" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to="/wishlist"
                      className="w-full  ml-2 flex text-lg gap-2"
                    >
                      <Heart /> Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link
                      to="/orders"
                      className="w-full  ml-2  flex text-lg gap-2"
                    >
                      <Archive /> Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Button
                      className="bg-red-600 w-full cursor-pointer flex text-lg gap-2"
                      onClick={handleLogout}
                    >
                      <LogOut />{" "}
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Logout"
                      )}
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex items-center gap-4 md:hidden">
                <Sheet open={open} onOpenChange={handleOpenSideBar}>
                  <SheetTrigger asChild>
                    <Menu
                      className="size-7 cursor-pointer"
                      onClick={handleOpenSideBar}
                    />
                  </SheetTrigger>
                  {/* <SheetContent> */}
                  <Sidebar />
                  {/* </SheetContent> */}
                </Sheet>
              </div>
            </div>
          ) : (
            <Link to={"/login"}>
              <Button className=" w-full text-white font-bold py-2 px-4 rounded">
                Login
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;

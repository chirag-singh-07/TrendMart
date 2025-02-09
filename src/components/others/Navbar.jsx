import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { navLinks } from "@/utils";
import { CircleUser, Menu, Search, ShoppingBag } from "lucide-react";

const Navbar = () => {
  const isLoggind = true;
  return (
    <>
      <nav className="container mx-auto flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
          <Link to={"/"}>
            <span className="text-2xl font-bold">TrendMart</span>
          </Link>
        </div>
        <div className=" hidden md:flex items-center gap-6 font-semibold">
          {navLinks.map((link, index) => (
            <Link key={index} to={link.path} className="mr-4">
              {link.name}
              {link.icon && <span className="ml-2">{link.icon}</span>}
            </Link>
          ))}
        </div>
        <div className="flex items-center">
          {isLoggind ? (
            <div className="flex gap-4">
              <Link to={"/search"}>
                <Search />
              </Link>
              <Link to={"/profile"}>
                <CircleUser />
              </Link>
              <Link to={"/cart"}>
                <span>
                  <ShoppingBag />
                </span>
              </Link>
              <div className="flex items-center gap-4 md:hidden">
                <span>
                  {/* later this click to open the side bar of other links and logout buuton  */}
                  <Menu />
                </span>
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

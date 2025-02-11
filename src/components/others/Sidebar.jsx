import { LogOut, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { navLinks } from "@/utils";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const Sidebar = () => {
  return (
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="text-lg font-bold text-left">
          TrendMart
        </SheetTitle>
        <Separator />
      </SheetHeader>
      <div className="flex mt-10 flex-col text-left gap-6 font-semibold sm:space-x-4">
        {navLinks.map((link, index) => (
          <Link key={index} to={link.path} className="mr-4">
            {link.name}
            {link.icon && <span className="ml-2">{link.icon}</span>}
          </Link>
        ))}
      </div>
      <Separator className='mb-4 mt-4' />
      <Button
        className="bg-red-600 w-full cursor-pointer flex text-lg gap-2"
        onClick={() => console.log("Logout")}
      >
        <LogOut /> Logout
      </Button>
    </SheetContent>
  );
};

export default Sidebar;

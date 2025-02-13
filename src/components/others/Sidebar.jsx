import { LogOut } from "lucide-react";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";
import { Separator } from "../ui/separator";
import { navLinks } from "@/utils";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

const Sidebar = () => {
  return (
    // <Sheet className="w-64 h-full fixed top-0 left-0 bg-white shadow-lg">
    <SheetContent>
      <SheetHeader>
        <SheetTitle className="text-lg font-bold text-left">
          TrendMart
        </SheetTitle>
        <SheetDescription className="text-left text-gray-500 tracking-tighter text-sm">
          offering a seamless shopping experience.
        </SheetDescription>
        <Separator />
      </SheetHeader>
      <div className="flex mt-10 flex-col items-start gap-6 font-semibold sm:space-x-4">
        {navLinks.map((link, index) => (
          <Link key={index} to={link.path} className="text-left">
            {link.lebel}
          </Link>
        ))}
      </div>
      <Separator className="mb-4 mt-4" />
      <Button
        className="bg-red-600 w-full cursor-pointer flex text-lg gap-2"
        onClick={() => console.log("Logout")}
      >
        <LogOut /> Logout
      </Button>
    </SheetContent>
    // </Sheet>
  );
};

export default Sidebar;

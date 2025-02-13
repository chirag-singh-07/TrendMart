import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ShoppingBag } from "lucide-react";
import CartItems from "./CartItems";
import EmptyCartPlaceholder from "./EmptyCartPlaceholder";
import { CartProductForTesting } from "@/constants";

const CartDrawer = () => {
  return (
    <Sheet className="md:w-2/4 overflow-hidden">
      <SheetTrigger className="relative">
        <ShoppingBag />
        {CartProductForTesting.length > 0 && (
          <span className="absolute -top-2 -right-2 text-xs text-white bg-red-500 rounded-full px-1">
            {CartProductForTesting.length}
          </span>
        )}
      </SheetTrigger>
      <SheetContent className="flex flex-col h-full">
        <SheetHeader>
          <SheetTitle className="text-xl">Your Cart</SheetTitle>
          <Separator />
          <SheetDescription>
            offering a seamless shopping experience.
          </SheetDescription>
        </SheetHeader>

        {/* Cart Items Section */}
        <div className="flex-grow overflow-y-auto ">
          {CartProductForTesting.length > 0 ? <CartItems /> : <EmptyCartPlaceholder />}
        </div>

        {/* Fixed Checkout Button */}
        <div>
          {CartProductForTesting.length > 0 && (
            <>
              <Button className="w-full">Proceed to Checkout</Button>
              <p className="text-sm tracking-tighter text-gray-500 mt-1">
                Shipping, taxes, and discount codes calaulated at checkout.
              </p>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;

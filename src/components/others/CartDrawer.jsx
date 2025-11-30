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
import { useCartStore } from "@/store/cartStore";
import { useEffect } from "react";

const CartDrawer = () => {
  const { cart, fetchCartItems } = useCartStore();

  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);
  console.log("cart", cart);

  return (
    <Sheet className="md:w-2/4 overflow-hidden">
      <SheetTrigger className="relative">
        <ShoppingBag />
        {cart?.length > 0 && (
          <span className="absolute -top-2 -right-2 text-xs text-white bg-red-500 rounded-full px-1">
            {cart?.length}
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
        {/* show the total price */}
        {cart?.length > 0 ? (
          <div className="flex flex-col">
            {/* Subtotal Calculation */}
            <p className="text-sm text-gray-600 font-semibold tracking-tighter flex items-center justify-between">
              Subtotal :
              <span>
                $
                {cart.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                )}
              </span>
            </p>

            {/* Fixed Shipping Cost */}
            <p className="text-sm text-gray-600 font-semibold tracking-tighter flex items-center justify-between">
              Shipping :<span>$10.00</span>
            </p>

            <Separator className="bg-black h-0.5 mb-2 mt-2" />

            {/* Correct Total Calculation (Adding Shipping Only Once) */}
            <p className="text-lg font-semibold tracking-tighter flex items-center justify-between">
              Total :
              <span>
                $
                {cart?.reduce(
                  (acc, item) => acc + item.price * item.quantity,
                  0
                ) + 10}
              </span>
            </p>

            <Separator className="bg-black h-0.5 mb-2 mt-2" />
          </div>
        ) : null}

        {/* Cart Items Section */}
        <div className="flex-grow overflow-y-auto ">
          {cart?.length > 0 ? <CartItems /> : <EmptyCartPlaceholder />}
        </div>

        {/* Fixed Checkout Button */}
        <div>
          {cart.length > 0 && (
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

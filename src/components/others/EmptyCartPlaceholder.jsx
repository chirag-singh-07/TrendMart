import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";

const EmptyCartPlaceholder = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <ShoppingCart size={80} className=" animate-bounce" />
      <h3 className="text-xl font-bold ">Your cart is empty</h3>
      <p className="text-xm tracking-tighter text-gray-500">
        No items in your cart yet. Start shopping now!
      </p>
      <Link to="/collections">
        <Button className="w-full">Shop Now</Button>
      </Link>
    </div>
  );
};

export default EmptyCartPlaceholder;

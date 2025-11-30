import { useCartStore } from "@/store/cartStore";
import { Trash2 } from "lucide-react";
import { useEffect } from "react";

const CartItems = () => {
  const { cart, fetchCartItems, removeFromCart, updateCartItemQuantity } =
    useCartStore();
  useEffect(() => {
    fetchCartItems();
  }, [fetchCartItems]);

  const handleRemoveItem = (getItemId) => {
    removeFromCart(getItemId);
    console.log("id", getItemId);
  };

  return (
    <div>
      {cart?.map((product, index) => (
        <div
          key={index}
          className="flex  items-start justify-between py-4 border-b"
        >
          <div className="flex items-start">
            <img
              src={product.image}
              alt={product.title}
              className="md:size-20 size-10 object-cover mr-4 rounded"
            />
            <div className="">
              <h3 className="md:text-lg text-sm">{product.title}</h3>
              <p className="text-gray-500 text-sm">
                {product.brand} | {product.category}
              </p>
              <div className="flex items-center mt-2">
                <button className="border rounded px-2 text-xl font-medium">
                  {" "}
                  -{" "}
                </button>
                <span className=" mx-1 md:mx-4">{product.quantity}</span>
                <button className="border rounded px-2  text-xl font-medium">
                  {" "}
                  +{" "}
                </button>
              </div>
            </div>
          </div>
          <div>
            <p className="md:text-xl text-sm font-semibold">
              $
              {product.salePrice
                ? product.salePrice.toLocaleString()
                : product.price.toLocaleString()}
            </p>
            <button onClick={() => handleRemoveItem(product.productId)}>
              <Trash2 className="size-6 mt-7" color="red" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItems;

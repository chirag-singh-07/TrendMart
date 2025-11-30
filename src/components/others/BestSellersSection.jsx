import ProductCard from "../common/ProductCard";
import { ShoppingCart, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const BestSellersSection = ({ bestProducts }) => {
  const navigate = useNavigate();
  const handleProductDetails = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <section className="w-full py-16 bg-black text-white flex items-center justify-center">
      <div className="container px-6 md:px-12">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            🔥 Best Sellers
          </h2>
          <p className="text-gray-400 mt-3">
            Shop our most loved products, picked by you!
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {bestProducts.length > 0 ? (
            bestProducts.map((product, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative p-5 bg-gray-900 rounded-2xl shadow-lg"
              >
                <ProductCard
                  product={product}
                  className="h-full w-full"
                  handleProductDetails={handleProductDetails}
                />

                {/* Best Seller Badge */}
                <div className="absolute top-3 right-3 bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold">
                  Best Seller
                </div>

                {/* Add to Cart Button */}
                {/* <Button className="w-full mt-4 flex items-center gap-2 bg-white text-black hover:bg-gray-200">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </Button> */}
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400">
              No best sellers found.
            </div>
          )}
        </div>

        {/* Explore More Button */}
        <div className="text-center mt-12">
          <Button className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition">
            Explore More
          </Button>
        </div>
      </div>
    </section>
  );
};

export default BestSellersSection;

import { useNavigate } from "react-router-dom";
import ProductCard from "../common/ProductCard";

const TrendingProductsSection = ({ trendingProducts }) => {
  const navigate = useNavigate();
  const handleProductDetails = (id) => {
    navigate(`/product/${id}`);
  };
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-4">
          Trending Products
        </h2>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Check out our latest trending products.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.length > 0 ? (
            trendingProducts.map((item, i) => (
              // <ProductCard key={i} product={product} />
              <ProductCard
                key={i}
                product={item}
                handleProductDetails={handleProductDetails}
              />
            ))
          ) : (
            <div className="text-center">No new arrivals found.</div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TrendingProductsSection;

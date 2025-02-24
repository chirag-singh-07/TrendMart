// import { product } from "@/constants/filters";
import ProductCard from "../common/ProductCard";

const NewArrivals = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          New Arrivals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item, i) => (
            // <ProductCard key={i} product={product} />
            <ProductCard key={i}  />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;

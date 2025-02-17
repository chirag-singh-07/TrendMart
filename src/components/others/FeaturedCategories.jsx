import { Link } from "react-router-dom";

const FeaturedCategories = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 items-center justify-center flex">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Featured Categories
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {["Women's Fashion", "Men's Clothing", "Accessories", "Footwear"].map(
            (category) => (
              <Link
                key={category}
                href="#"
                className="group relative overflow-hidden rounded-lg shadow-lg"
              >
                <img
                  alt={category}
                  className="object-cover w-full h-60 transition-transform group-hover:scale-105"
                  height="240"
                  //   src="/placeholder.svg?height=240&width=360"
                  src="https://placehold.co/240x360"
                  width="360"
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 transition-opacity group-hover:bg-opacity-75" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-2xl font-bold text-white">{category}</h3>
                </div>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;

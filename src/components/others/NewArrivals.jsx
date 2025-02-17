import { Button } from "../ui/button";

const NewArrivals = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          New Arrivals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="group relative overflow-hidden rounded-lg shadow-lg"
            >
              <img
                alt={`Product ${item}`}
                className="object-cover w-full h-60"
                height="240"
                src="https://placehold.co/240x360"
                width="360"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">Product Name</h3>
                <p className="text-gray-600">$99.99</p>
                <Button className="w-full mt-4">Add to Cart</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;

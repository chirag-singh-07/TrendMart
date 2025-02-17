import { Link } from "react-router-dom";

const SpecialOffers = () => {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
          Special Offers
        </h2>
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <img
            alt="Special Offer"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
            height="310"
            // src="/placeholder.svg?height=310&width=550"
            src="https://placehold.co/310x550"
            width="550"
          />
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Summer Sale
              </h3>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get up to 50% off on selected items. Limited time offer, don't
                miss out!
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-black px-8 text-sm font-medium text-white shadow transition-colors hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="container px-4 md:px-6 mt-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Summer Sale
              </h3>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get up to 50% off on selected items. Limited time offer, don't
                miss out!
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-black px-8 text-sm font-medium text-white shadow transition-colors hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Shop Now
              </Link>
            </div>
          </div>
          <img
            alt="Special Offer"
            className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
            height="310"
            // src="/placeholder.svg?height=310&width=550"
            src="https://placehold.co/310x550"
            width="550"
          />
        </div>
      </div> */}
    </section>
  );
};

export default SpecialOffers;

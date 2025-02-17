import { Link } from "react-router-dom";
// import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";

const HeroSection = () => {
//   const images = [
//     "https://placehold.co/1920x1080",
//     "https://placehold.co/1920x1080",
//     "https://placehold.co/1920x1080",
//     "https://placehold.co/1920x1080",
//   ];
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Summer Collection 2025
              </h1>
              <p className="max-w-[600px] text-gray-300 md:text-xl">
                Discover our latest arrivals and elevate your style this summer.
                Shop now and get 20% off your first purchase.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md bg-white px-8 text-sm font-medium text-black shadow transition-colors hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
              >
                Shop Now
              </Link>
              <Link
                href="#"
                className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 text-black"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative mx-auto">
            {/* <Swiper
              spaceBetween={10} // space between slides
              slidesPerView={1} // show 1 slide at a time
              loop={true} // loop through images
              autoplay={{ delay: 5000 }} // auto slide every 5 seconds
              effect="fade" // fade effect
              className="rounded-xl"
            >
              {images.map((src, index) => (
                <SwiperSlide key={index}>
                  <img
                    alt={`Hero Image ${index + 1}`}
                    className="w-full h-auto object-cover object-center rounded-xl"
                    src={src}
                  />
                </SwiperSlide>
              ))}
            </Swiper> */}
            <img
              alt="Hero Image"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="550"
              src="https://placehold.co/1920x1080"
              width="550"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

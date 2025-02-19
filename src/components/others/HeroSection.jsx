// import { imagesSider } from "@/constants";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "swiper/css";
import "swiper/css/effect-fade";
import { seasonalData } from "@/constants/seasonalData";

const getCurrentSeason = () => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
};

const HeroSection = () => {
  const season = getCurrentSeason();
  const { title, description, images } = seasonalData[season];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-black text-white flex items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <h1 className="text-3xl font-bold sm:text-5xl xl:text-6xl/none">
              {title}
            </h1>
            <p className="max-w-[600px] text-gray-300 md:text-xl">
              {description}
            </p>
            <div className="flex gap-2">
              <Link
                href="#"
                className="bg-white text-black px-8 py-2 rounded-md"
              >
                Shop Now
              </Link>
              <Link
                href="#"
                className="border border-white px-8 py-2 rounded-md"
              >
                Learn More
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center overflow-hidden w-full aspect-video">
            <AnimatePresence initial={false} custom={direction}>
              <motion.img
                key={currentIndex}
                src={images[currentIndex]}
                alt="Seasonal Collection"
                className="absolute w-full h-full object-cover rounded-xl"
                initial={{ x: "100%", opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: "-100%", opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

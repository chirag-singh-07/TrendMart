import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    title: "SUMMER CLEARANCE",
    subtext: "HUGE DISCOUNTS ON PREMIUM ELECTRONICS",
    buttonText: "SHOP ELECTRONICS",
  },
  {
    id: 2,
    title: "NEW ARRIVALS 2024",
    subtext: "MINIMALIST FASHION FOR THE MODERN WORLD",
    buttonText: "EXPLORE COLLECTION",
  },
  {
    id: 3,
    title: "HOME ESSENTIALS",
    subtext: "ELEVATE YOUR SPACE WITH MONOCHROME STYLES",
    buttonText: "SHOP HOME",
  },
];

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <div className="relative w-full h-[300px] md:h-[450px] bg-black overflow-hidden group">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <div
            key={slide.id}
            className="min-w-full h-full flex flex-col items-center justify-center text-center px-4"
          >
            <h1 className="text-4xl md:text-7xl font-black text-white mb-4 tracking-tighter">
              {slide.title}
            </h1>
            <p className="text-sm md:text-xl text-[#9e9e9e] mb-8 tracking-[0.2em]">
              {slide.subtext}
            </p>
            <button className="px-8 py-3 border-2 border-white text-white hover:bg-white hover:text-black transition-all font-bold tracking-widest text-sm">
              {slide.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* Slide Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 p-2 text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronLeft size={32} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/30 p-2 text-white transition-all opacity-0 group-hover:opacity-100"
      >
        <ChevronRight size={32} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              currentSlide === index ? "bg-white scale-125" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;

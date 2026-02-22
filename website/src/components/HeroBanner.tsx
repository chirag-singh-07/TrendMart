import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const slides = [
  {
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop",
    title: "PREMIUM COLLECTION",
    subtitle: "UP TO 40% OFF",
    buttonText: "SHOP NOW",
  },
  {
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
    title: "MODERN ESSENTIALS",
    subtitle: "NEW ARRIVALS 2024",
    buttonText: "EXPLORE",
  },
  {
    image:
      "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop",
    title: "LUXURY STYLE",
    subtitle: "EXCLUSIVE OFFERS",
    buttonText: "GET ACCESS",
  },
];

const HeroBanner: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] bg-foreground overflow-hidden group">
      {/* Slides Container */}
      <div
        className="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="min-w-full h-full relative overflow-hidden"
          >
            {/* Image with subtle zoom */}
            <div className="absolute inset-0 scale-105 group-hover:scale-100 transition-transform duration-[2000ms]">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover opacity-60"
              />
            </div>

            {/* Premium Overlay Decoration */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/80 to-transparent flex items-center px-8 md:px-24">
              <div
                className={`max-w-xl space-y-4 md:space-y-6 transform transition-all duration-1000 ${
                  currentSlide === index
                    ? "translate-x-0 opacity-100"
                    : "-translate-x-20 opacity-0"
                }`}
              >
                <span className="inline-block text-primary font-black tracking-[0.4em] text-xs md:text-sm animate-in slide-in-from-left duration-700">
                  {slide.subtitle}
                </span>
                <h2 className="text-4xl md:text-7xl font-black text-white leading-none tracking-tighter">
                  {slide.title.split(" ").map((word, i) => (
                    <span
                      key={i}
                      className="block last:text-primary last:italic"
                    >
                      {word}
                    </span>
                  ))}
                </h2>
                <div className="pt-4 md:pt-8 flex gap-4">
                  <Button
                    size="lg"
                    className="px-8 md:px-12 py-6 md:py-8 bg-background text-foreground rounded-2xl hover:bg-primary hover:text-white transition-all font-bold tracking-widest text-xs md:text-sm shadow-xl hover:scale-105 active:scale-95 border-none"
                  >
                    {slide.buttonText}
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="px-8 md:px-12 py-6 md:py-8 border-2 border-white/20 text-white rounded-2xl hover:bg-white/10 transition-all font-bold tracking-widest text-xs md:text-sm"
                  >
                    LEARN MORE
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <Button
          onClick={prevSlide}
          size="icon-lg"
          className="rounded-full glass text-foreground w-12 h-12 md:w-16 md:h-16 flex items-center justify-center pointer-events-auto hover:bg-primary hover:text-white transition-all hover:scale-110 border-none"
        >
          <ChevronLeft size={32} />
        </Button>
        <Button
          onClick={nextSlide}
          size="icon-lg"
          className="rounded-full glass text-foreground w-12 h-12 md:w-16 md:h-16 flex items-center justify-center pointer-events-auto hover:bg-primary hover:text-white transition-all hover:scale-110 border-none"
        >
          <ChevronRight size={32} />
        </Button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-500 rounded-full h-1.5 ${
              currentSlide === index
                ? "w-12 bg-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                : "w-3 bg-white/30 hover:bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroBanner;

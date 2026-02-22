import React from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import CategoryRow from "../components/CategoryRow";
import FeaturedProducts from "../components/FeaturedProducts";
import FlashSales from "../components/FlashSales";
import PromoBanner from "../components/PromoBanner";
import BrandShowcase from "../components/BrandShowcase";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-grow">
        <HeroBanner />
        <CategoryRow />
        <FlashSales />
        <PromoBanner />
        <FeaturedProducts />
        <BrandShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

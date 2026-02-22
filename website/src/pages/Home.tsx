import React from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import CategoryRow from "../components/CategoryRow";
import FeaturedProducts from "../components/FeaturedProducts";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />
      <main className="flex-grow">
        <HeroBanner />
        <CategoryRow />
        <FeaturedProducts />
      </main>
      <Footer />
    </div>
  );
};

export default Home;

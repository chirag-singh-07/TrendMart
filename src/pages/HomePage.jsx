import BestSellersSection from "@/components/others/BestSellersSection";
import FeaturedBrands from "@/components/others/FeaturedBrands";
import FeaturedCategories from "@/components/others/FeaturedCategories";
import HeroSection from "@/components/others/HeroSection";
import NewArrivals from "@/components/others/NewArrivals";
import NewsletterSection from "@/components/others/NewsletterSection";
import PartnerSection from "@/components/others/PanterSection";
import SpecialOffers from "@/components/others/SpecialOffers";
import TrendingProductsSection from "@/components/others/TrendingProductsSection";
import { useProductStore } from "@/store/productStore";
import { useEffect } from "react";

const HomePage = () => {
  const {
    fetchFeatureProducts,
    featureProducts,
    TrendingProducts,
    fetchTrendingProducts,
    fetchBestSellerProducts,
    BestSellerProducts,
  } = useProductStore();

  useEffect(() => {
    fetchFeatureProducts();
    fetchTrendingProducts();
    fetchBestSellerProducts();
  }, []);
  // console.log("BestSellerProducts", BestSellerProducts);
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 justify-center items-center">
        <HeroSection />
        <FeaturedCategories />
        <NewArrivals featureProducts={featureProducts} />
        <FeaturedBrands/>
        <SpecialOffers />
        <TrendingProductsSection trendingProducts={TrendingProducts} />
        <PartnerSection />
        <BestSellersSection bestProducts={BestSellerProducts} />
        <NewsletterSection />
      </main>
    </div>
  );
};

export default HomePage;

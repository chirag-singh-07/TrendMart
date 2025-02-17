import FeaturedCategories from "@/components/others/FeaturedCategories";
import HeroSection from "@/components/others/HeroSection";
import NewArrivals from "@/components/others/NewArrivals";
import NewsletterSection from "@/components/others/NewsletterSection";
import SpecialOffers from "@/components/others/SpecialOffers";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 justify-center items-center">
        <HeroSection />
        <FeaturedCategories />
        <NewArrivals />
        <SpecialOffers />
        <NewsletterSection />
      </main>
    </div>
  );
};

export default HomePage;

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { StatsSection } from "@/components/dashboard/StatsSection";
import { OrdersTable } from "@/components/dashboard/OrdersTable";
import { PerformanceOverview } from "@/components/dashboard/PerformanceOverview";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { SellerTier } from "@/components/dashboard/SellerTier";
import { TopSellingProducts } from "@/components/dashboard/TopSellingProducts";
import { InventoryStatus } from "@/components/dashboard/InventoryStatus";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pb-20">
        <HeroSection />

        <div className="container mx-auto px-4 space-y-20 mt-[-60px] relative z-20">
          <SellerTier />

          <StatsSection />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <OrdersTable />
            </div>
            <div className="lg:col-span-1">
              <PerformanceOverview />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TopSellingProducts />
            <InventoryStatus />
          </div>

          <QuickActions />
        </div>
      </main>
      <Footer />
    </div>
  );
}

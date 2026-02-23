import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Package,
  CreditCard,
  MapPin,
  Shield,
  Clock,
  ChevronRight,
  Settings,
  Eye,
  Download,
  RotateCcw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Orders: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<
    "all" | "pending" | "shipped" | "delivered" | "cancelled"
  >("all");

  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";

  // Mock orders data
  const allOrders = [
    {
      id: "#ORD001",
      date: "2024-02-15",
      status: "delivered",
      items: 3,
      total: 4599.50,
      estimatedDelivery: "2024-02-18",
    },
    {
      id: "#ORD002",
      date: "2024-02-10",
      status: "shipped",
      items: 1,
      total: 1299.00,
      estimatedDelivery: "2024-02-22",
    },
    {
      id: "#ORD003",
      date: "2024-02-05",
      status: "pending",
      items: 2,
      total: 2899.75,
      estimatedDelivery: "2024-02-20",
    },
    {
      id: "#ORD004",
      date: "2024-01-28",
      status: "delivered",
      items: 5,
      total: 7450.25,
      estimatedDelivery: "2024-02-02",
    },
    {
      id: "#ORD005",
      date: "2024-01-20",
      status: "cancelled",
      items: 1,
      total: 899.00,
      estimatedDelivery: "2024-01-25",
    },
  ];

  const filteredOrders =
    selectedTab === "all"
      ? allOrders
      : allOrders.filter((order) => order.status === selectedTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-zinc-50 text-zinc-700 border-zinc-200";
    }
  };

  const navigationItems = [
    { icon: User, label: "Personal Details" },
    { icon: Package, label: "Track Orders", active: true },
    { icon: CreditCard, label: "Payments" },
    { icon: MapPin, label: "Addresses" },
    { icon: Shield, label: "Security" },
    { icon: Settings, label: "Preferences" },
  ];

  const handleNavigate = (label: string) => {
    const routes: Record<string, string> = {
      "Personal Details": "/profile",
      "Track Orders": "/orders",
      Payments: "/payments",
      Addresses: "/addresses",
      Security: "/security",
      Preferences: "/preferences",
    };
    navigate(routes[label] || "/profile");
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar: Navigation */}
          <aside className="w-full lg:w-1/3 xl:w-1/4 space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
                Premium Member // Since 2024
              </p>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigate(item.label)}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                    item.active
                      ? "bg-black text-white shadow-xl"
                      : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-black hover:translate-x-1"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon
                      size={18}
                      className={
                        item.active ? "text-white" : "group-hover:text-black"
                      }
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {item.label}
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className={
                      item.active
                        ? "text-white/50"
                        : "opacity-0 group-hover:opacity-50"
                    }
                  />
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Content: Orders */}
          <div className="flex-1 space-y-8">
            <div className="bg-zinc-50/50 rounded-[40px] border border-zinc-100 p-8 lg:p-12">
              <div className="mb-10">
                <div className="space-y-2 mb-8">
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic underline decoration-1 underline-offset-8">
                    Order Tracking
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    View and manage your orders
                  </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      "all",
                      "pending",
                      "shipped",
                      "delivered",
                      "cancelled",
                    ] as const
                  ).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        selectedTab === tab
                          ? "bg-black text-white"
                          : "bg-white border border-zinc-200 text-zinc-600 hover:border-black hover:text-black"
                      }`}
                    >
                      {tab === "all" ? "All Orders" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              <div className="space-y-4">
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-2xl border border-zinc-100 p-6 hover:border-black/20 hover:shadow-lg transition-all group"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="space-y-3 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-black uppercase tracking-tighter">
                              {order.id}
                            </h3>
                            <Badge
                              variant="outline"
                              className={`rounded-full text-[8px] font-black uppercase tracking-widest border ${getStatusColor(
                                order.status,
                              )}`}
                            >
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-[10px]">
                            <div>
                              <p className="font-black text-zinc-400 uppercase tracking-wider opacity-60">
                                Order Date
                              </p>
                              <p className="font-bold italic">{order.date}</p>
                            </div>
                            <div>
                              <p className="font-black text-zinc-400 uppercase tracking-wider opacity-60">
                                Items
                              </p>
                              <p className="font-bold italic">
                                {order.items} products
                              </p>
                            </div>
                            <div>
                              <p className="font-black text-zinc-400 uppercase tracking-wider opacity-60">
                                Est. Delivery
                              </p>
                              <p className="font-bold italic">
                                {order.estimatedDelivery}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-col md:items-end gap-4">
                          <div className="text-right">
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider opacity-60">
                              Total
                            </p>
                            <p className="text-2xl font-black tracking-tighter">
                              ₹{order.total.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 rounded-xl text-[8px] font-black uppercase tracking-widest h-9 px-3"
                            >
                              <Eye size={14} />
                              View
                            </Button>
                            {order.status === "delivered" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 rounded-xl text-[8px] font-black uppercase tracking-widest h-9 px-3"
                              >
                                <Download size={14} />
                                Invoice
                              </Button>
                            )}
                            {order.status === "shipped" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 rounded-xl text-[8px] font-black uppercase tracking-widest h-9 px-3"
                              >
                                <Clock size={14} />
                                Track
                              </Button>
                            )}
                            {order.status === "pending" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 rounded-xl text-[8px] font-black uppercase tracking-widest h-9 px-3"
                              >
                                <RotateCcw size={14} />
                                Cancel
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl border-2 border-dashed border-zinc-200 p-12 text-center">
                    <Package
                      size={48}
                      className="mx-auto mb-4 text-zinc-300"
                    />
                    <p className="text-zinc-400 font-bold uppercase tracking-wider">
                      No orders in this category
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-black text-white p-6 rounded-[40px] space-y-3 shadow-2xl shadow-black/20">
                <Package size={24} className="opacity-80" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Total Orders
                  </p>
                  <p className="text-3xl font-black tracking-tighter">
                    {allOrders.length}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-[40px] space-y-3">
                <Clock size={24} className="text-zinc-400" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    In Transit
                  </p>
                  <p className="text-3xl font-black tracking-tighter">
                    {allOrders.filter((o) => o.status === "shipped").length}
                  </p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-[40px] space-y-3">
                <CreditCard size={24} className="text-zinc-400" />
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    Total Spent
                  </p>
                  <p className="text-3xl font-black tracking-tighter">
                    ₹{allOrders
                      .reduce((sum, order) => sum + order.total, 0)
                      .toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Orders;

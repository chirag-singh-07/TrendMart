import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  Layers,
  Image,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { productService } from "../services/productService";
import { categoryService } from "../services/categoryService";
import { offerService } from "../services/offerService";

interface DashboardStats {
  totalProducts: number;
  activeProducts: number;
  outOfStockProducts: number;
  draftProducts: number;
  totalCategories: number;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [bannerCount, setBannerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [s, banners] = await Promise.allSettled([
        productService.getDashboardStats(),
        offerService.getAll(),
      ]);

      if (s.status === "fulfilled") setStats(s.value);
      if (banners.status === "fulfilled") setBannerCount(banners.value.length);
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Products",
      value: stats?.totalProducts ?? "—",
      change: `${stats?.activeProducts ?? 0} active`,
      icon: Package,
      color: "bg-blue-50",
      borderColor: "border-blue-200",
      link: "/products",
    },
    {
      title: "Categories",
      value: stats?.totalCategories ?? "—",
      change: "organized",
      icon: Layers,
      color: "bg-purple-50",
      borderColor: "border-purple-200",
      link: "/categories",
    },
    {
      title: "Offer Banners",
      value: bannerCount,
      change: "promotional",
      icon: Image,
      color: "bg-green-50",
      borderColor: "border-green-200",
      link: "/banners",
    },
    {
      title: "Out of Stock",
      value: stats?.outOfStockProducts ?? "—",
      change: "needs attention",
      icon: AlertCircle,
      color: "bg-red-50",
      borderColor: "border-red-200",
      link: "/products",
    },
  ];

  const quickActions = [
    { label: "Manage Products", icon: Package, path: "/products", desc: "View, update status, feature, delete" },
    { label: "Categories", icon: Layers, path: "/categories", desc: "Add, edit, delete categories" },
    { label: "Offer Banners", icon: Image, path: "/banners", desc: "Create promotional banners" },
    { label: "Orders", icon: ShoppingCart, path: "/orders", desc: "Review and manage orders" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Dashboard</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Welcome back, Admin! Here's your platform overview.
          </p>
        </div>
        <button
          onClick={fetchStats}
          className="p-3 border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          title="Refresh Stats"
        >
          <RefreshCw size={18} className={loading ? "animate-spin text-zinc-400" : "text-zinc-600"} />
        </button>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-zinc-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => navigate(card.link)}
                className={`${card.color} border ${card.borderColor} rounded-2xl p-6 space-y-4 text-left hover:shadow-md hover:-translate-y-0.5 transition-all group`}
              >
                <div className="flex items-center justify-between">
                  <Icon size={24} className="text-zinc-600" />
                  <ArrowUpRight size={16} className="text-zinc-400 group-hover:text-zinc-700 transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest opacity-70">{card.title}</p>
                  <p className="text-3xl font-black tracking-tighter mt-2">{card.value}</p>
                  <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-widest">{card.change}</p>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Product Status Breakdown */}
      {stats && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6">
          <div className="mb-4">
            <h2 className="text-xl font-black uppercase italic tracking-tighter">Product Status Breakdown</h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Inventory health overview</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Active", value: stats.activeProducts, color: "bg-green-500", total: stats.totalProducts },
              { label: "Draft", value: stats.draftProducts, color: "bg-zinc-400", total: stats.totalProducts },
              { label: "Out of Stock", value: stats.outOfStockProducts, color: "bg-red-500", total: stats.totalProducts },
              { label: "Total", value: stats.totalProducts, color: "bg-blue-500", total: stats.totalProducts },
            ].map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{item.label}</p>
                  <p className="text-[11px] font-black">{item.value}</p>
                </div>
                <div className="h-2 bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-[9px] text-zinc-400">
                  {item.total > 0 ? ((item.value / item.total) * 100).toFixed(1) : 0}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-black uppercase italic tracking-tighter">Quick Actions</h2>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Jump to key management areas</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="p-5 border border-zinc-200 rounded-2xl hover:border-black hover:shadow-md transition-all text-left group space-y-3"
              >
                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                  <Icon size={18} />
                </div>
                <div>
                  <p className="text-[11px] font-black uppercase tracking-tight">{action.label}</p>
                  <p className="text-[9px] text-zinc-400 mt-1">{action.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Admin Info */}
      <div className="bg-zinc-900 text-white rounded-2xl p-6 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">System Status</p>
          <p className="font-black text-[13px] uppercase">All Systems Operational</p>
          <p className="text-[9px] text-zinc-500">Backend API · MongoDB · Admin Panel</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">Live</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

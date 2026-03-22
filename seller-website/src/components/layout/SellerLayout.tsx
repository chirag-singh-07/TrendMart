import React, { type ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  BarChart3,
  Package,
  ShoppingCart,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  MessageSquare,
  DollarSign,
  Star,
  Store,
} from "lucide-react";
import { authService } from "@/services/authService";

interface SellerLayoutProps {
  children: ReactNode;
}

const SellerLayout: React.FC<SellerLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sellerData, setSellerData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("seller_data");
    if (stored) setSellerData(JSON.parse(stored));
  }, []);

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: Package, label: "My Products", path: "/products" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: DollarSign, label: "Earnings", path: "/earnings" },
    { icon: Star, label: "Reviews", path: "/reviews" },
    { icon: Store, label: "Shop Profile", path: "/profile" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = "/login";
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    // On mobile, close sidebar after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-72" : "w-20"
        } bg-black text-white transition-all duration-500 ease-in-out flex flex-col overflow-hidden relative z-50`}
      >
        {/* Branding */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-3 animate-in fade-in duration-500">
               <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-black font-black text-xl shadow-lg shadow-white/5">
                T
              </div>
              <div className="flex flex-col">
                <span className="font-black uppercase italic text-sm tracking-tighter leading-none">
                  Trend<span className="text-zinc-500">Mart</span>
                </span>
                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-zinc-500 mt-1">
                  Merchants
                </span>
              </div>
            </div>
          )}
          {!sidebarOpen && (
             <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-black font-black text-xl mx-auto">
                T
             </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all duration-300 group ${
                  isActive
                    ? "bg-white text-black shadow-2xl shadow-white/10"
                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={22} className={isActive ? "text-black" : "group-hover:scale-110 transition-transform"} />
                {sidebarOpen && (
                  <span className="font-black text-[10px] uppercase tracking-[0.2em] whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Footer in Sidebar */}
        <div className="p-6 border-t border-white/5 bg-zinc-950/50">
           {sidebarOpen ? (
              <div className="flex items-center gap-4 mb-6 px-2">
                 <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-white text-lg">
                    {sellerData?.firstName?.[0] || "S"}
                 </div>
                 <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-black uppercase tracking-tight truncate">{sellerData?.firstName} {sellerData?.lastName}</span>
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest truncate">{sellerData?.role || "Merchant"}</span>
                 </div>
              </div>
           ) : (
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center font-black text-white text-lg mx-auto mb-6">
                 {sellerData?.firstName?.[0] || "S"}
              </div>
           )}

          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[20px] text-red-500 hover:bg-red-500/10 transition-all ${!sidebarOpen && "justify-center"}`}
          >
            <LogOut size={22} />
            {sidebarOpen && (
              <span className="font-black text-[10px] uppercase tracking-[0.2em]">
                Terminate Session
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Dynamic Header */}
        <header className="h-24 bg-white border-b border-zinc-100 px-10 flex items-center justify-between sticky top-0 z-40 shadow-sm shadow-black/[0.02]">
           <div className="flex items-center gap-8 flex-1">
             <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 hover:bg-zinc-50 rounded-2xl transition-all text-zinc-400 hover:text-black border border-transparent hover:border-zinc-100"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={24} />}
              </button>

              <div className="max-w-xl w-full hidden md:block">
                <div className="relative group">
                   <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors" />
                   <input 
                      type="text" 
                      placeholder="Search Intelligence..." 
                      className="w-full h-14 pl-14 pr-6 rounded-2xl bg-zinc-50/50 border border-zinc-100 focus:outline-none focus:bg-white focus:border-black text-[11px] font-bold uppercase tracking-widest placeholder:text-zinc-300 transition-all"
                   />
                </div>
              </div>
           </div>

           <div className="flex items-center gap-4">
              <button className="p-4 hover:bg-zinc-50 rounded-2xl transition-all text-zinc-400 hover:text-black relative group">
                 <Bell size={22} />
                 <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-black rounded-full border-2 border-white ring-4 ring-transparent group-hover:ring-black/5 transition-all" />
              </button>
              <button className="p-4 hover:bg-zinc-50 rounded-2xl transition-all text-zinc-400 hover:text-black">
                 <MessageSquare size={22} />
              </button>

              <div className="h-10 w-px bg-zinc-100 mx-4" />

              <Link to="/profile" className="flex items-center gap-4 hover:opacity-80 transition-opacity p-1">
                 <div className="hidden lg:block text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-900 leading-none mb-1">
                       {sellerData?.firstName} {sellerData?.lastName}
                    </p>
                    <p className="text-[8px] font-black uppercase text-zinc-400 tracking-[0.2em]">
                       {sellerData?.role === "seller" ? "Merchant Account" : "Elite Partner"}
                    </p>
                 </div>
                 <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center font-black text-white text-lg shadow-xl shadow-black/10">
                    {sellerData?.firstName?.[0] || "S"}
                 </div>
              </Link>
           </div>
        </header>

        {/* Scrolling Content View */}
        <main className="flex-1 overflow-y-auto bg-[#fafafa] scroll-smooth">
          <div className="p-10 max-w-[1600px] mx-auto">
             {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;

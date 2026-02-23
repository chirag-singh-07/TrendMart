import React, { type ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart3,
  Users,
  Package,
  ShoppingCart,
  Grid,
  ImagePlus,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  SearchIcon,
} from "lucide-react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuItems = [
    { icon: BarChart3, label: "Dashboard", path: "/" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: Package, label: "Products", path: "/products" },
    { icon: ShoppingCart, label: "Orders", path: "/orders" },
    { icon: Grid, label: "Categories", path: "/categories" },
    { icon: ImagePlus, label: "Banners", path: "/banners" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/login";
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-black text-white transition-all duration-300 flex flex-col overflow-y-auto`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black text-lg">
                T
              </div>
              <span className="font-black uppercase italic text-sm tracking-tighter">
                TrendMart
              </span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-zinc-900 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigate(item.path)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && (
                  <span className="font-black text-[10px] uppercase tracking-widest">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-all"
          >
            <LogOut size={20} />
            {sidebarOpen && (
              <span className="font-black text-[10px] uppercase tracking-widest">
                Logout
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-zinc-200 px-8 py-4 flex items-center justify-between">
          <div className="flex-1 flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <SearchIcon
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
                />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full h-10 pl-11 pr-4 rounded-xl bg-zinc-100 border border-zinc-200 focus:outline-none focus:border-black focus:bg-white text-[10px] font-bold uppercase tracking-widest placeholder:text-zinc-400"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 hover:bg-zinc-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-zinc-200">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Admin User
                </p>
                <p className="text-[9px] text-zinc-500">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-zinc-200 rounded-lg flex items-center justify-center font-black">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

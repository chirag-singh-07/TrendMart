import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  User,
  Package,
  CreditCard,
  MapPin,
  Shield,
  ChevronRight,
  Settings,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Clock,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Security: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";

  // Mock security data
  const lastLoginData = [
    {
      device: "Chrome on Windows",
      location: "Mumbai, India",
      ip: "203.0.113.45",
      time: "Today at 2:30 PM",
      current: true,
    },
    {
      device: "Safari on iPhone",
      location: "Mumbai, India",
      ip: "203.0.113.46",
      time: "Yesterday at 10:15 AM",
      current: false,
    },
    {
      device: "Chrome on Mac",
      location: "Bangalore, India",
      ip: "203.0.113.47",
      time: "3 days ago at 5:45 PM",
      current: false,
    },
  ];

  const securityFeatures = [
    {
      name: "Two-Factor Authentication",
      status: "enabled",
      description: "Adds an extra layer of security to your account",
      icon: CheckCircle,
    },
    {
      name: "Phone Verification",
      status: "verified",
      description: `${user?.phone || "Not provided"} is verified`,
      icon: CheckCircle,
    },
    {
      name: "Email Verification",
      status: "verified",
      description: `${user?.email} is verified`,
      icon: CheckCircle,
    },
  ];

  const navigationItems = [
    { icon: User, label: "Personal Details" },
    { icon: Package, label: "Track Orders" },
    { icon: CreditCard, label: "Payments" },
    { icon: MapPin, label: "Addresses" },
    { icon: Shield, label: "Security", active: true },
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

          {/* Right Content: Security */}
          <div className="flex-1 space-y-8">
            {/* Security Overview */}
            <div className="bg-zinc-50/50 rounded-[40px] border border-zinc-100 p-8 lg:p-12">
              <div className="space-y-2 mb-8">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic underline decoration-1 underline-offset-8">
                  Account Security
                </h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Keep your account safe and secure
                </p>
              </div>

              {/* Security Features */}
              <div className="space-y-4 mb-12">
                {securityFeatures.map((feature) => (
                  <div
                    key={feature.name}
                    className="bg-white rounded-2xl border border-zinc-100 p-6 flex items-center justify-between hover:border-black/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <feature.icon
                        size={24}
                        className={
                          feature.status === "verified"
                            ? "text-green-600"
                            : "text-blue-600"
                        }
                      />
                      <div>
                        <p className="font-black text-[11px] uppercase tracking-widest">
                          {feature.name}
                        </p>
                        <p className="text-[9px] text-zinc-500 mt-1">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest px-3 py-1.5 bg-green-50 text-green-700 rounded-full border border-green-200">
                      {feature.status === "verified"
                        ? "Verified"
                        : "Enabled"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Change Password Section */}
              <div className="bg-white rounded-2xl border border-zinc-100 p-8 space-y-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Lock size={24} className="text-zinc-600" />
                    <div>
                      <h3 className="font-black text-[11px] uppercase tracking-widest">
                        Change Password
                      </h3>
                      <p className="text-[9px] text-zinc-500 mt-1">
                        Last changed 45 days ago
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setChangingPassword(!changingPassword)}
                    variant="outline"
                    className="rounded-xl text-[9px] font-black uppercase tracking-widest"
                  >
                    {changingPassword ? "Cancel" : "Change"}
                  </Button>
                </div>

                {changingPassword && (
                  <div className="space-y-4 pt-4 border-t border-zinc-200">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider opacity-40">
                        Current Password
                      </Label>
                      <div className="relative">
                        <input
                          type={showPasswords.current ? "text" : "password"}
                          placeholder="Enter current password"
                          className="h-12 w-full px-4 pr-12 rounded-xl border border-zinc-200 focus:outline-none focus:border-black"
                        />
                        <button
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              current: !showPasswords.current,
                            })
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                        >
                          {showPasswords.current ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider opacity-40">
                        New Password
                      </Label>
                      <div className="relative">
                        <input
                          type={showPasswords.new ? "text" : "password"}
                          placeholder="Enter new password"
                          className="h-12 w-full px-4 pr-12 rounded-xl border border-zinc-200 focus:outline-none focus:border-black"
                        />
                        <button
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              new: !showPasswords.new,
                            })
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                        >
                          {showPasswords.new ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider opacity-40">
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <input
                          type={showPasswords.confirm ? "text" : "password"}
                          placeholder="Confirm new password"
                          className="h-12 w-full px-4 pr-12 rounded-xl border border-zinc-200 focus:outline-none focus:border-black"
                        />
                        <button
                          onClick={() =>
                            setShowPasswords({
                              ...showPasswords,
                              confirm: !showPasswords.confirm,
                            })
                          }
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                        >
                          {showPasswords.confirm ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button className="w-full bg-black text-white hover:bg-zinc-800 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest">
                      Update Password
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-zinc-50/50 rounded-[40px] border border-zinc-100 p-8 lg:p-12">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic underline decoration-1 underline-offset-8">
                    Active Sessions
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Manage your active login sessions
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="rounded-2xl border-red-200 text-red-600 hover:bg-red-50 font-black text-[10px] uppercase tracking-widest"
                >
                  <LogOut size={16} className="mr-2" />
                  Logout All
                </Button>
              </div>

              <div className="space-y-4">
                {lastLoginData.map((login, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-zinc-100 p-6 hover:border-black/10 transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-black text-[11px] uppercase tracking-widest">
                            {login.device}
                          </p>
                          {login.current && (
                            <span className="text-[8px] font-black bg-blue-100 text-blue-700 px-2 py-1 rounded-full uppercase tracking-widest">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-2">
                          {login.location} • {login.ip}
                        </p>
                      </div>
                      {!login.current && (
                        <button className="text-red-600 hover:text-red-700 font-bold text-[9px] uppercase">
                          Logout
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-zinc-400">
                      <Clock size={14} />
                      {login.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Security;

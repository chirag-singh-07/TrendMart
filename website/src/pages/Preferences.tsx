import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  User,
  Package,
  CreditCard,
  MapPin,
  Shield,
  ChevronRight,
  Settings,
  Bell,
  Mail,
  Smartphone,
  Eye,
  Lock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PreferenceItem {
  id: string;
  name: string;
  enabled: boolean;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

const Preferences: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [preferences, setPreferences] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    productRecommendations: true,
    newArrivals: false,
    saleNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    profileVisibility: "public",
    dataCollection: true,
    thirdPartySharing: false,
  });

//   const userInitials = user
//     ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
//     : "U";

  const navigationItems = [
    { icon: User, label: "Personal Details" },
    { icon: Package, label: "Track Orders" },
    { icon: CreditCard, label: "Payments" },
    { icon: MapPin, label: "Addresses" },
    { icon: Shield, label: "Security" },
    { icon: Settings, label: "Preferences", active: true },
  ];

  const notificationPreferences: PreferenceItem[] = [
    {
      id: "orderUpdates",
      name: "Order & Delivery Updates",
      enabled: preferences.orderUpdates,
      icon: Package,
    },
    {
      id: "promotions",
      name: "Promotional Offers",
      enabled: preferences.promotions,
      icon: Bell,
    },
    {
      id: "newsletter",
      name: "Newsletter",
      enabled: preferences.newsletter,
      icon: Mail,
    },
    {
      id: "productRecommendations",
      name: "Product Recommendations",
      enabled: preferences.productRecommendations,
      icon: Eye,
    },
    {
      id: "newArrivals",
      name: "New Arrivals Notification",
      enabled: preferences.newArrivals,
      icon: Package,
    },
    {
      id: "saleNotifications",
      name: "Sale & Flash Deal Alerts",
      enabled: preferences.saleNotifications,
      icon: Bell,
    },
  ];

  const privacyPreferences: PreferenceItem[] = [
    {
      id: "dataCollection",
      name: "Allow Data Collection for Analytics",
      enabled: preferences.dataCollection,
      icon: Eye,
    },
    {
      id: "thirdPartySharing",
      name: "Allow Third-Party Data Sharing",
      enabled: preferences.thirdPartySharing,
      icon: Lock,
    },
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

  const togglePreference = (key: string) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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

          {/* Right Content: Preferences */}
          <div className="flex-1 space-y-8">
            {/* Notification Preferences */}
            <div className="bg-zinc-50/50 rounded-[40px] border border-zinc-100 p-8 lg:p-12">
              <div className="space-y-2 mb-8">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic underline decoration-1 underline-offset-8">
                  Notification Preferences
                </h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Choose how you want to receive updates
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {notificationPreferences.map((pref) => (
                  <div
                    key={pref.id}
                    className="bg-white rounded-2xl border border-zinc-100 p-5 flex items-center justify-between hover:border-black/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <pref.icon size={20} className="text-zinc-400 group-hover:text-black transition-colors" />
                      <p className="font-black text-[10px] uppercase tracking-widest">
                        {pref.name}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer" htmlFor={pref.id}>
                      <input
                        type="checkbox"
                        checked={pref.enabled}
                        onChange={() => togglePreference(pref.id)}
                        className="sr-only peer"
                        name={pref.id}
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Notification Channels */}
              <div className="border-t border-zinc-200 pt-8">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6">
                  Notification Channels
                </h3>

                <div className="space-y-3">
                  <div className="bg-white rounded-2xl border border-zinc-100 p-5 flex items-center justify-between hover:border-black/10 transition-all">
                    <div className="flex items-center gap-4">
                      <Mail size={20} className="text-zinc-400" />
                      <div>
                        <p className="font-black text-[10px] uppercase tracking-widest">
                          Email Notifications
                        </p>
                        <p className="text-[9px] text-zinc-500 mt-1">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>

                  <div className="bg-white rounded-2xl border border-zinc-100 p-5 flex items-center justify-between hover:border-black/10 transition-all">
                    <div className="flex items-center gap-4">
                      <Smartphone size={20} className="text-zinc-400" />
                      <div>
                        <p className="font-black text-[10px] uppercase tracking-widest">
                          SMS Notifications
                        </p>
                        <p className="text-[9px] text-zinc-500 mt-1">
                          {preferences.smsNotifications ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.smsNotifications}
                        onChange={() => togglePreference("smsNotifications")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>

                  <div className="bg-white rounded-2xl border border-zinc-100 p-5 flex items-center justify-between hover:border-black/10 transition-all">
                    <div className="flex items-center gap-4">
                      <Bell size={20} className="text-zinc-400" />
                      <div>
                        <p className="font-black text-[10px] uppercase tracking-widest">
                          Push Notifications
                        </p>
                        <p className="text-[9px] text-zinc-500 mt-1">
                          {preferences.pushNotifications ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.pushNotifications}
                        onChange={() => togglePreference("pushNotifications")}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy & Data */}
            <div className="bg-zinc-50/50 rounded-[40px] border border-zinc-100 p-8 lg:p-12">
              <div className="space-y-2 mb-8">
                <h2 className="text-4xl font-black tracking-tighter uppercase italic underline decoration-1 underline-offset-8">
                  Privacy & Data
                </h2>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Control how your data is used
                </p>
              </div>

              <div className="space-y-3 mb-8">
                {privacyPreferences.map((pref) => (
                  <div
                    key={pref.id}
                    className="bg-white rounded-2xl border border-zinc-100 p-5 flex items-center justify-between hover:border-black/10 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <pref.icon size={20} className="text-zinc-400 group-hover:text-black transition-colors" />
                      <p className="font-black text-[10px] uppercase tracking-widest">
                        {pref.name}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pref.enabled}
                        onChange={() => togglePreference(pref.id)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                    </label>
                  </div>
                ))}
              </div>

              {/* Profile Visibility */}
              <div className="border-t border-zinc-200 pt-8">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-6">
                  Profile Visibility
                </h3>

                <div className="space-y-3">
                  {[
                    { value: "public", label: "Public", description: "Visible to all users" },
                    { value: "friends", label: "Friends Only", description: "Visible to friends only" },
                    { value: "private", label: "Private", description: "Only you can see" },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className="bg-white rounded-2xl border border-zinc-100 p-5 flex items-center cursor-pointer hover:border-black/10 transition-all group"
                    >
                      <input
                        type="radio"
                        name="visibility"
                        value={option.value}
                        checked={preferences.profileVisibility === option.value}
                        onChange={(e) =>
                          setPreferences({
                            ...preferences,
                            profileVisibility: e.target.value,
                          })
                        }
                        className="w-5 h-5 cursor-pointer accent-black"
                      />
                      <div className="ml-4 flex-1">
                        <p className="font-black text-[10px] uppercase tracking-widest">
                          {option.label}
                        </p>
                        <p className="text-[9px] text-zinc-500 mt-1">
                          {option.description}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Save Changes */}
            <div className="flex gap-4">
              <Button className="flex-1 bg-black text-white hover:bg-zinc-800 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-black/20">
                Save Preferences
              </Button>
              <Button
                variant="outline"
                className="flex-1 h-14 rounded-2xl border-zinc-200 font-black text-[10px] uppercase tracking-widest hover:bg-zinc-50"
              >
                Reset to Default
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Preferences;

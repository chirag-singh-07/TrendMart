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
  Plus,
  Edit2,
  Trash2,
  MapPinCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Addresses: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";

  // Mock addresses
  const addresses = [
    {
      id: "addr_1",
      type: "home",
      label: "Home",
      name: user?.firstName + " " + user?.lastName,
      phone: user?.phone || "+91 9876 5432 10",
      addressLine1: "123 Main Street",
      addressLine2: "Apartment 4B",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400001",
      country: "India",
      isDefault: true,
    },
    {
      id: "addr_2",
      type: "work",
      label: "Work",
      name: user?.firstName + " " + user?.lastName,
      phone: user?.phone || "+91 9876 5432 10",
      addressLine1: "Tech Park Building",
      addressLine2: "Suite 500",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
      isDefault: false,
    },
    {
      id: "addr_3",
      type: "other",
      label: "Other",
      name: user?.firstName + " " + user?.lastName,
      phone: user?.phone || "+91 9876 5432 10",
      addressLine1: "456 Service Road",
      addressLine2: "Near Central Park",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India",
      isDefault: false,
    },
  ];

  const navigationItems = [
    { icon: User, label: "Personal Details" },
    { icon: Package, label: "Track Orders" },
    { icon: CreditCard, label: "Payments" },
    { icon: MapPin, label: "Addresses", active: true },
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

  const getAddressTypeIcon = (type: string) => {
    switch (type) {
      case "home":
        return "🏠";
      case "work":
        return "💼";
      default:
        return "📍";
    }
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

          {/* Right Content: Addresses */}
          <div className="flex-1 space-y-8">
            <div className="bg-zinc-50/50 rounded-[40px] border border-zinc-100 p-8 lg:p-12">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic underline decoration-1 underline-offset-8">
                    Delivery Addresses
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Manage your delivery locations
                  </p>
                </div>
                <Button
                  onClick={() => setIsAddingAddress(!isAddingAddress)}
                  className="rounded-2xl bg-black text-white hover:bg-zinc-800 transition-all font-black text-[10px] uppercase tracking-widest px-6"
                >
                  <Plus size={16} className="mr-2" />
                  Add Address
                </Button>
              </div>

              {/* Add New Address Form */}
              {isAddingAddress && (
                <div className="bg-white rounded-2xl border border-zinc-100 p-8 mb-8 space-y-6">
                  <h3 className="text-xl font-black uppercase italic tracking-tighter">
                    Add New Address
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider opacity-40">
                        Full Name
                      </Label>
                      <Input
                        placeholder="Enter your name"
                        className="h-12 rounded-xl border-zinc-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider opacity-40">
                        Phone Number
                      </Label>
                      <Input
                        placeholder="Enter phone number"
                        className="h-12 rounded-xl border-zinc-200"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider opacity-40">
                        Address Line 1
                      </Label>
                      <Input
                        placeholder="House No, Building Name"
                        className="h-12 rounded-xl border-zinc-200"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider opacity-40">
                        Address Line 2 (Optional)
                      </Label>
                      <Input
                        placeholder="Road name, Area, Colony"
                        className="h-12 rounded-xl border-zinc-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider opacity-40">
                        City
                      </Label>
                      <Input
                        placeholder="City"
                        className="h-12 rounded-xl border-zinc-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider opacity-40">
                        State
                      </Label>
                      <Input
                        placeholder="State"
                        className="h-12 rounded-xl border-zinc-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider opacity-40">
                        Pincode
                      </Label>
                      <Input
                        placeholder="Pincode"
                        className="h-12 rounded-xl border-zinc-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-wider opacity-40">
                        Address Type
                      </Label>
                      <select className="h-12 rounded-xl border border-zinc-200 px-4 w-full font-bold text-sm">
                        <option>Home</option>
                        <option>Work</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t border-zinc-200">
                    <Button className="flex-1 bg-black text-white hover:bg-zinc-800 h-12 rounded-xl font-black text-[10px] uppercase tracking-widest">
                      Save Address
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingAddress(false)}
                      className="flex-1 h-12 rounded-xl border-zinc-200 font-black text-[10px] uppercase tracking-widest"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {/* Addresses List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddress(address.id)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedAddress === address.id
                        ? "border-black bg-white shadow-lg"
                        : "border-zinc-200 bg-white hover:border-zinc-400"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">
                          {getAddressTypeIcon(address.type)}
                        </span>
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest italic">
                            {address.label}
                          </p>
                          {address.isDefault && (
                            <span className="text-[8px] font-black bg-black text-white px-2 py-1 rounded-full uppercase tracking-widest">
                              Default
                            </span>
                          )}
                        </div>
                      </div>
                      <MapPinCheck size={20} className="text-zinc-400" />
                    </div>

                    <div className="space-y-3 text-[10px] mb-6">
                      <div>
                        <p className="font-bold uppercase tracking-widest text-zinc-600">
                          {address.name}
                        </p>
                        <p className="text-zinc-500 mt-1">
                          {address.phone}
                        </p>
                      </div>
                      <div className="text-zinc-600 leading-relaxed">
                        <p className="font-bold">{address.addressLine1}</p>
                        {address.addressLine2 && (
                          <p>{address.addressLine2}</p>
                        )}
                        <p>
                          {address.city}, {address.state} {address.pincode}
                        </p>
                        <p>{address.country}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-zinc-100">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-zinc-50 rounded-lg transition-colors text-[9px] font-bold uppercase">
                        <Edit2 size={14} />
                        Edit
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-red-50 rounded-lg transition-colors text-red-600 text-[9px] font-bold uppercase">
                        <Trash2 size={14} />
                        Delete
                      </button>
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

export default Addresses;

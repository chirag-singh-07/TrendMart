import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { API_BASE_URL } from "@/lib/axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Shield,
  Clock,
  CreditCard,
  Package,
  Settings,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const Profile: React.FC = () => {
  const {
    user,
    updateProfile,
    updateAvatar,
    isLoading: storeLoading,
  } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone || "",
      });
    }
  }, [user]);

  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("File size must be less than 2MB");
      }
      try {
        await updateAvatar(file);
        toast.success("Avatar updated successfully");
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to upload avatar");
      }
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Sidebar: Profile Overview */}
          <aside className="w-full lg:w-1/3 xl:w-1/4 space-y-8">
            <div className="relative group/avatar">
              <Avatar className="w-40 h-40 rounded-3xl border-2 border-zinc-100 shadow-2xl transition-transform duration-500 group-hover/avatar:scale-[1.02]">
                <AvatarImage
                  src={user?.avatar ? `${API_BASE_URL}${user.avatar}` : ""}
                  alt={user?.firstName}
                  className="object-cover"
                />
                <AvatarFallback className="text-4xl font-black bg-zinc-50">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <button
                onClick={handleAvatarClick}
                disabled={storeLoading}
                className="absolute bottom-4 right-4 bg-black text-white p-3 rounded-2xl shadow-xl hover:scale-110 transition-all border border-white/20 disabled:opacity-50 disabled:scale-100"
              >
                {storeLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <Camera size={20} />
                )}
              </button>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-zinc-400 text-[10px] font-black uppercase tracking-[0.3em]">
                Premium Member // Since 2024
              </p>
            </div>

            <nav className="space-y-2">
              {[
                { icon: User, label: "Personal Details", active: true },
                { icon: Package, label: "Track Orders", active: false },
                { icon: CreditCard, label: "Payments", active: false },
                { icon: MapPin, label: "Addresses", active: false },
                { icon: Shield, label: "Security", active: false },
                { icon: Settings, label: "Preferences", active: false },
              ].map((item) => (
                <button
                  key={item.label}
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

          {/* Right Content: Profile Form */}
          <div className="flex-1 space-y-12">
            <div className="bg-zinc-50/50 rounded-[40px] border border-zinc-100 p-8 lg:p-12">
              <div className="flex items-center justify-between mb-12">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic underline decoration-1 underline-offset-8">
                    Information Hub
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Update your digital identity and preferences
                  </p>
                </div>
                {!isEditing && (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="rounded-2xl bg-black text-white hover:bg-zinc-800 transition-all font-black text-[10px] uppercase tracking-widest px-6"
                  >
                    Modify Access
                  </Button>
                )}
              </div>

              <form onSubmit={handleUpdateProfile} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-wider opacity-40 italic">
                      System Identity: First Name
                    </Label>
                    <div className="relative group">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors"
                        size={16}
                      />
                      <Input
                        disabled={!isEditing}
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="h-14 pl-12 rounded-2xl border-zinc-200 focus-visible:ring-black bg-white/50 text-xs font-bold uppercase tracking-widest"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-wider opacity-40 italic">
                      System Identity: Last Name
                    </Label>
                    <div className="relative group">
                      <User
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors"
                        size={16}
                      />
                      <Input
                        disabled={!isEditing}
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="h-14 pl-12 rounded-2xl border-zinc-200 focus-visible:ring-black bg-white/50 text-xs font-bold uppercase tracking-widest"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-wider opacity-40 italic">
                      Access Point: Email Address
                    </Label>
                    <div className="relative group">
                      <Mail
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors"
                        size={16}
                      />
                      <Input
                        disabled={true}
                        value={user?.email}
                        className="h-14 pl-12 rounded-2xl border-zinc-200 focus-visible:ring-black bg-zinc-100/50 text-xs font-bold uppercase tracking-widest cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-wider opacity-40 italic">
                      Mobile Uplink: Phone Number
                    </Label>
                    <div className="relative group">
                      <Phone
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-colors"
                        size={16}
                      />
                      <Input
                        disabled={!isEditing}
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="h-14 pl-12 rounded-2xl border-zinc-200 focus-visible:ring-black bg-white/50 text-xs font-bold tracking-widest"
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex items-center gap-4 pt-4 border-t border-zinc-200 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 h-14 rounded-2xl bg-black text-white hover:bg-zinc-800 transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-black/20"
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Commit Changes"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="h-14 px-8 rounded-2xl border-zinc-200 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all"
                    >
                      Abort
                    </Button>
                  </div>
                )}
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-zinc-50 border border-zinc-100 p-8 rounded-[40px] space-y-6">
                <div className="flex items-center gap-4 text-black">
                  <Clock size={24} />
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">
                    Recent Activity
                  </h3>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      action: "Login Protocol",
                      date: "2 minutes ago",
                      status: "Success",
                    },
                    {
                      action: "Order Ref #4920",
                      date: "yesterday",
                      status: "Delivered",
                    },
                    {
                      action: "Password Rotation",
                      date: "3 days ago",
                      status: "Verified",
                    },
                  ].map((act, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 bg-white rounded-2xl border border-zinc-100 transition-all hover:border-black/10"
                    >
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest">
                          {act.action}
                        </p>
                        <p className="text-[8px] font-bold text-zinc-300 uppercase mt-1">
                          {act.date}
                        </p>
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-zinc-50 rounded-full border border-zinc-100">
                        {act.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-black text-white p-8 rounded-[40px] space-y-6 shadow-2xl shadow-black/30 group">
                <div className="flex items-center gap-4 text-white">
                  <CreditCard
                    size={24}
                    className="group-hover:rotate-12 transition-transform duration-500"
                  />
                  <h3 className="text-xl font-black uppercase tracking-tighter italic">
                    Wallet Balance
                  </h3>
                </div>
                <div className="space-y-2">
                  <p className="text-5xl font-black tracking-tighter tabular-nums underline decoration-white/20 underline-offset-12">
                    ₹ 12,450.00
                  </p>
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 pt-4 italic">
                    Available for immediate deployment
                  </p>
                </div>
                <Button className="w-full bg-white text-black hover:bg-zinc-200 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                  Withdraw Funds
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Profile;

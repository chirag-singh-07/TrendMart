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
  Wallet,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Payments: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);

  const userInitials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "U";

  // Mock payment methods
  const paymentMethods = [
    {
      id: "card_1",
      type: "credit_card",
      brand: "Visa",
      last4: "4242",
      expiryMonth: 12,
      expiryYear: 2026,
      isDefault: true,
      holderName: user?.firstName + " " + user?.lastName,
    },
    {
      id: "card_2",
      type: "debit_card",
      brand: "Mastercard",
      last4: "5555",
      expiryMonth: 6,
      expiryYear: 2025,
      isDefault: false,
      holderName: user?.firstName + " " + user?.lastName,
    },
  ];

  // Mock wallet data
  const walletData = {
    balance: 12450.5,
    currency: "INR",
    lastAdded: "2024-02-10",
    addedAmount: 5000,
  };

  // Mock transactions
  const transactions = [
    {
      id: "txn_001",
      type: "credit",
      amount: 5000,
      date: "2024-02-10",
      description: "Wallet top-up",
      status: "completed",
      method: "Credit Card",
    },
    {
      id: "txn_002",
      type: "debit",
      amount: 1899.5,
      date: "2024-02-08",
      description: "Order #ORD001",
      status: "completed",
      method: "Wallet",
    },
    {
      id: "txn_003",
      type: "credit",
      amount: 200,
      date: "2024-02-05",
      description: "Refund for Order #ORD002",
      status: "completed",
      method: "Credit Card",
    },
    {
      id: "txn_004",
      type: "debit",
      amount: 2999.75,
      date: "2024-02-03",
      description: "Order #ORD003",
      status: "completed",
      method: "Wallet",
    },
  ];

  const navigationItems = [
    { icon: User, label: "Personal Details" },
    { icon: Package, label: "Track Orders" },
    { icon: CreditCard, label: "Payments", active: true },
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

          {/* Right Content: Payments */}
          <div className="flex-1 space-y-8">
            {/* Wallet Card */}
            <div className="bg-black text-white rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-black/30 space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                    Wallet Balance
                  </p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-5xl font-black tracking-tighter tabular-nums">
                      {showBalance
                        ? `₹${walletData.balance.toFixed(2)}`
                        : "₹••••••"}
                    </p>
                    <button
                      onClick={() => setShowBalance(!showBalance)}
                      className="opacity-60 hover:opacity-100 transition-opacity"
                    >
                      {showBalance ? (
                        <Eye size={20} />
                      ) : (
                        <EyeOff size={20} />
                      )}
                    </button>
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 italic">
                    Last added {walletData.lastAdded} • +₹{walletData.addedAmount.toFixed(0)}
                  </p>
                </div>
                <Wallet
                  size={48}
                  className="opacity-20"
                />
              </div>

              <Button className="w-full bg-white text-black hover:bg-zinc-200 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all">
                <Plus size={18} className="mr-2" />
                Add Money to Wallet
              </Button>
            </div>

            {/* Payment Methods */}
            <div className="bg-zinc-50/50 rounded-[40px] border border-zinc-100 p-8 lg:p-12">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic underline decoration-1 underline-offset-8">
                    Payment Methods
                  </h2>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                    Manage your cards and wallets
                  </p>
                </div>
                <Button className="rounded-2xl bg-black text-white hover:bg-zinc-800 transition-all font-black text-[10px] uppercase tracking-widest px-6">
                  <Plus size={16} className="mr-2" />
                  Add Card
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                      selectedPayment === method.id
                        ? "border-black bg-white shadow-lg"
                        : "border-zinc-200 bg-white hover:border-zinc-400"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-wider opacity-60 mb-1">
                          {method.type === "credit_card"
                            ? "Credit Card"
                            : "Debit Card"}
                        </p>
                        <p className="text-xl font-black italic">
                          {method.brand}
                        </p>
                      </div>
                      {method.isDefault && (
                        <span className="text-[8px] font-black bg-black text-white px-3 py-1 rounded-full uppercase tracking-widest">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="text-3xl font-black tracking-widest mb-4 font-mono">
                      •••• •••• •••• {method.last4}
                    </p>

                    <div className="flex items-center justify-between text-[10px]">
                      <p className="font-bold uppercase tracking-widest opacity-60">
                        {method.expiryMonth.toString().padStart(2, "0")}/
                        {method.expiryYear.toString().slice(-2)}
                      </p>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
                          <Edit2 size={14} />
                        </button>
                        <button className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Transaction History */}
              <div className="space-y-4">
                <h3 className="text-2xl font-black uppercase italic tracking-tighter">
                  Transaction History
                </h3>

                <div className="space-y-3">
                  {transactions.map((transaction, idx) => (
                    <div
                      key={transaction.id}
                      className="bg-white rounded-2xl border border-zinc-100 p-4 hover:border-black/20 hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${
                              transaction.type === "credit"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-[10px] uppercase tracking-widest">
                              {transaction.description}
                            </p>
                            <p className="text-[9px] text-zinc-400 uppercase tracking-wider mt-1">
                              {transaction.date} • {transaction.method}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-black text-lg tracking-tighter ${
                              transaction.type === "credit"
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {transaction.type === "credit" ? "+" : "-"}₹
                            {transaction.amount.toFixed(2)}
                          </p>
                          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 block mt-1">
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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

export default Payments;

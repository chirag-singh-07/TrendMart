import React, { useState } from "react";
import {
  Save,
  Bell,
  Lock,
  Globe,
  CreditCard,
  Mail,
  AlertCircle,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

interface SettingsState {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  timezone: string;
  smtpHost: string;
  smtpPort: string;
  smtpEmail: string;
  smtpPassword: string;
  enableNotifications: boolean;
  enableTwoFactor: boolean;
  paymentGateway: string;
  apiKey: string;
  maintenanceMode: boolean;
}

const AdminSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("general");
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState<SettingsState>({
    storeName: "Your Store Name",
    storeEmail: "admin@store.com",
    storePhone: "+91 9876543210",
    storeAddress: "123 Business St, Mumbai, India",
    currency: "INR",
    timezone: "Asia/Kolkata",
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpEmail: "your-email@gmail.com",
    smtpPassword: "****",
    enableNotifications: true,
    enableTwoFactor: true,
    paymentGateway: "razorpay",
    apiKey: "****",
    maintenanceMode: false,
  });

  const handleChange = (
    field: keyof SettingsState,
    value: string | boolean
  ) => {
    setSettings({ ...settings, [field]: value });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">
          Settings
        </h1>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
          Configure store settings and preferences
        </p>
      </div>

      {/* Save Confirmation */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
          <Check size={20} className="text-green-600" />
          <p className="text-[10px] font-black uppercase tracking-widest text-green-700">
            Settings saved successfully
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="flex flex-wrap border-b border-zinc-200">
          {[
            { id: "general", label: "General", icon: Globe },
            { id: "email", label: "Email", icon: Mail },
            { id: "payment", label: "Payment", icon: CreditCard },
            { id: "security", label: "Security", icon: Lock },
            { id: "notifications", label: "Notifications", icon: Bell },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 md:flex-none md:px-6 py-4 text-[9px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 justify-center md:justify-start ${
                activeTab === id
                  ? "border-black text-black"
                  : "border-transparent text-zinc-600 hover:text-black"
              }`}
            >
              <Icon size={16} />
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-6">
          {/* General Settings */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                    Store Name
                  </label>
                  <input
                    type="text"
                    value={settings.storeName}
                    onChange={(e) => handleChange("storeName", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleChange("currency", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleChange("timezone", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    <option value="Europe/London">Europe/London (GMT)</option>
                    <option value="Asia/Singapore">Asia/Singapore (SGT)</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                    Store Phone
                  </label>
                  <input
                    type="tel"
                    value={settings.storePhone}
                    onChange={(e) => handleChange("storePhone", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                  Store Email
                </label>
                <input
                  type="email"
                  value={settings.storeEmail}
                  onChange={(e) => handleChange("storeEmail", e.target.value)}
                  className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                  Store Address
                </label>
                <textarea
                  value={settings.storeAddress}
                  onChange={(e) =>
                    handleChange("storeAddress", e.target.value)
                  }
                  className="w-full h-24 px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} className="text-yellow-600" />
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-yellow-900">
                      Maintenance Mode
                    </p>
                    <p className="text-[8px] text-yellow-800 mt-1">
                      Enable to take your store offline temporarily
                    </p>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) =>
                      handleChange("maintenanceMode", e.target.checked)
                    }
                    className="w-5 h-5 rounded accent-black"
                  />
                </label>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeTab === "email" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.smtpHost}
                    onChange={(e) => handleChange("smtpHost", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                      SMTP Port
                    </label>
                    <input
                      type="text"
                      value={settings.smtpPort}
                      onChange={(e) => handleChange("smtpPort", e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                      SMTP Email
                    </label>
                    <input
                      type="email"
                      value={settings.smtpEmail}
                      onChange={(e) => handleChange("smtpEmail", e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                    SMTP Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={settings.smtpPassword}
                      onChange={(e) =>
                        handleChange("smtpPassword", e.target.value)
                      }
                      className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold pr-12"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <button className="px-6 py-2 rounded-xl bg-zinc-100 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors">
                Test Email Configuration
              </button>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                  Payment Gateway
                </label>
                <select
                  value={settings.paymentGateway}
                  onChange={(e) =>
                    handleChange("paymentGateway", e.target.value)
                  }
                  className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold"
                >
                  <option value="razorpay">Razorpay</option>
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                  <option value="cashfree">Cashfree</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                  API Key
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={settings.apiKey}
                    onChange={(e) => handleChange("apiKey", e.target.value)}
                    className="w-full h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold pr-12"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-blue-900">
                  Payment Gateway Status
                </p>
                <p className="text-[10px] text-blue-800 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Connected & Active
                </p>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Two-Factor Authentication
                  </p>
                  <p className="text-[9px] text-zinc-600 mt-1">
                    Require 2FA for admin login
                  </p>
                </div>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableTwoFactor}
                    onChange={(e) =>
                      handleChange("enableTwoFactor", e.target.checked)
                    }
                    className="w-5 h-5 rounded accent-black"
                  />
                </label>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest mb-3">
                  Admin Access Logs
                </p>
                <div className="space-y-2">
                  {[
                    {
                      date: "Today, 10:30 AM",
                      ip: "192.168.1.1",
                      action: "Login",
                    },
                    {
                      date: "Today, 9:15 AM",
                      ip: "192.168.1.2",
                      action: "Settings Update",
                    },
                    {
                      date: "Yesterday, 5:45 PM",
                      ip: "192.168.1.1",
                      action: "Logout",
                    },
                  ].map((log, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-[9px] py-2 border-b border-zinc-200 last:border-b-0"
                    >
                      <div>
                        <p className="font-bold">{log.action}</p>
                        <p className="text-zinc-500">{log.date}</p>
                      </div>
                      <p className="text-zinc-600 font-bold">{log.ip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === "notifications" && (
            <div className="space-y-4">
              {[
                {
                  title: "Email Notifications",
                  description: "Receive email alerts for important events",
                  key: "enableNotifications",
                },
                {
                  title: "Order Updates",
                  description: "Get notified on new orders and updates",
                  key: "notifications",
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-4 bg-zinc-50 border border-zinc-200 rounded-xl"
                >
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest">
                      {item.title}
                    </p>
                    <p className="text-[9px] text-zinc-600 mt-1">
                      {item.description}
                    </p>
                  </div>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={true}
                      className="w-5 h-5 rounded accent-black"
                    />
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full md:w-auto px-8 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
      >
        <Save size={18} />
        Save Changes
      </button>
    </div>
  );
};

export default AdminSettings;

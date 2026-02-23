import React, { useState } from "react";
import { Lock, Mail } from "lucide-react";

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate login
    setTimeout(() => {
      localStorage.setItem("adminToken", "admin-token-fake");
      setLoading(false);
      onLogin();
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-black font-black text-2xl">
              T
            </div>
            <span className="text-3xl font-black uppercase italic tracking-tighter">
              TrendMart
            </span>
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400">
            Admin Control Panel
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6 bg-zinc-900/50 backdrop-blur-lg border border-zinc-800 rounded-3xl p-8">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-6 text-zinc-400">
              Authenticate Access
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider opacity-60">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@trendmart.com"
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-900/50 border border-zinc-700 focus:outline-none focus:border-white text-[10px] font-bold uppercase tracking-widest placeholder:text-zinc-600"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-wider opacity-60">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-900/50 border border-zinc-700 focus:outline-none focus:border-white text-[10px] font-bold uppercase tracking-widest placeholder:text-zinc-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-white text-black rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl shadow-white/10"
          >
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>

          <p className="text-[8px] text-zinc-500 text-center uppercase tracking-wider">
            Demo: Use any email/password to login
          </p>
        </form>

        {/* Footer */}
        <p className="text-center text-[9px] text-zinc-600 uppercase tracking-widest">
          TrendMart Admin Panel © 2024
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;

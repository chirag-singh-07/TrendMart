import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/authStore";
import { toast } from "sonner";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    try {
      await login(email, password, navigate);
      toast.success("Welcome back!");
    } catch (err: any) {
      if (err.response?.status === 422 && err.response.data.errors) {
        const fieldErrors: Record<string, string> = {};
        err.response.data.errors.forEach((e: any) => {
          fieldErrors[e.field] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        setGeneralError(
          err.response?.data?.message ||
            "Invalid credentials. Please try again.",
        );
        toast.error("Login failed");
      }
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans text-black">
      {/* Left Side: Editorial Style */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black text-white p-20 flex-col justify-between">
        <div className="relative z-10">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-black text-lg">
              T
            </div>
            TrendMart
          </Link>
        </div>

        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] block opacity-50">
              Identity // Access
            </span>
            <h2 className="text-7xl font-bold tracking-tight leading-none uppercase italic">
              Digital <br />
              <span className="not-italic">Signature</span>
            </h2>
          </div>
          <p className="text-white/40 text-lg max-w-sm font-medium leading-relaxed">
            Welcome to the curated experience. Access your profile to manage
            your collections and orders.
          </p>
        </div>

        <div className="relative z-10 flex items-center justify-between text-[9px] uppercase font-black tracking-[0.4em] opacity-30">
          <span>Authentication Portal</span>
          <span>© 2026 TrendMart</span>
        </div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-[420px] space-y-10">
          <div className="lg:hidden mb-12">
            <Link
              to="/"
              className="text-2xl font-black tracking-tighter uppercase italic flex items-center gap-2 text-black"
            >
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-lg">
                T
              </div>
              TrendMart
            </Link>
          </div>

          <div className="space-y-4 text-center lg:text-left">
            <h2 className="text-4xl font-bold tracking-tighter uppercase italic">
              Sign{" "}
              <span className="underline decoration-1 underline-offset-8">
                In
              </span>
            </h2>
            <p className="text-black/50 text-[10px] font-black uppercase tracking-widest">
              Entry to the minimalist collective
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {generalError && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="text-red-600 w-5 h-5 flex-shrink-0" />
                <p className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
                  {generalError}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60"
              >
                Email Address
              </Label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors"
                  size={16}
                />
                <Input
                  id="email"
                  type="email"
                  placeholder="EX: USER@TRENDMART.COM"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-12 h-14 rounded-xl border-[#e0e0e0] focus-visible:ring-black focus-visible:border-black transition-all bg-white text-xs font-bold uppercase tracking-wider ${errors.email ? "border-red-600 focus-visible:ring-red-600" : ""}`}
                  required
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-bold text-red-600/70 mt-1 uppercase tracking-widest">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60"
                >
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-[9px] font-black uppercase tracking-widest underline decoration-black/20 underline-offset-4 hover:decoration-black transition-all"
                >
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors"
                  size={16}
                />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-12 pr-12 h-14 rounded-xl border-[#e0e0e0] focus-visible:ring-black focus-visible:border-black transition-all bg-white text-xs font-bold ${errors.password ? "border-red-600 focus-visible:ring-red-600" : ""}`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-black/20 hover:text-black transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] font-bold text-red-600/70 mt-1 uppercase tracking-widest">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-xl bg-black text-white hover:bg-zinc-800 transition-all font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 border-none"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  SIGN IN <ArrowRight size={14} />
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-[10px] font-bold uppercase tracking-widest pt-4 opacity-60">
            No account?{" "}
            <Link
              to="/register"
              className="text-black font-black border-b border-black/20 hover:border-black transition-colors pb-0.5 ml-1"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

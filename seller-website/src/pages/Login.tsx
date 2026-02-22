import { Link } from "react-router-dom";
import { Mail, Lock, ArrowRight, Github, Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
  return (
    <div className="min-h-screen w-full flex bg-white font-['Inter']">
      {/* Left Side: Branding & Narrative */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden flex-col justify-between p-16">
        {/* Abstract design elements */}
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-white/5 rounded-full blur-[150px] animate-pulse" />

        <div className="relative z-10">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter text-white italic"
          >
            Trend<span className="text-gray-500">Mart</span>{" "}
            <span className="bg-white text-black px-2 py-0.5 rounded text-[10px] uppercase tracking-widest not-italic align-middle ml-2">
              Sellers
            </span>
          </Link>
        </div>

        <div className="relative z-10 space-y-8 max-w-lg">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter leading-[0.9] text-white italic">
              Empowering <br />
              <span className="text-gray-500 not-italic">
                Digital Pioneers.
              </span>
            </h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">
              Log in to the world's most advanced seller portal and manage your
              global commerce operations.
            </p>
          </div>

          <div className="pt-10 border-t border-white/10 flex items-center gap-6">
            <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-black bg-zinc-800"
                />
              ))}
            </div>
            <p className="text-xs font-black uppercase tracking-widest text-white/40">
              Joined by 50,000+ elite sellers
            </p>
          </div>
        </div>

        <div className="relative z-10 text-white/20 text-[10px] uppercase font-black tracking-[0.5em]">
          TrendMart © 2026 Archive
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-12">
          {/* Mobile Header */}
          <div className="lg:hidden flex flex-col items-center gap-6 mb-12">
            <div className="text-xl font-bold tracking-tighter">
              Trend<span className="text-gray-500">Mart</span>{" "}
              <span className="text-black bg-gray-100 px-2 py-0.5 rounded text-[10px] uppercase tracking-widest font-black">
                Sellers
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tighter uppercase italic">
              Seller Login
            </h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Enter your credentials to continue
            </p>
          </div>

          <form className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400"
                >
                  Merchant Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-black transition-colors" />
                  <Input
                    id="email"
                    placeholder="name@company.com"
                    className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus-visible:ring-black/5 focus-visible:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label
                    htmlFor="password"
                    className="text-[10px] font-black uppercase tracking-widest text-gray-400"
                  >
                    Access Key
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-[10px] font-black uppercase tracking-widest text-black hover:underline underline-offset-4"
                  >
                    Lost Key?
                  </Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-black transition-colors" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus-visible:ring-black/5 focus-visible:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 px-1">
              <Checkbox
                id="remember"
                className="rounded-md border-gray-200 data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <label
                htmlFor="remember"
                className="text-[10px] font-black uppercase tracking-widest text-gray-400 cursor-pointer select-none"
              >
                Maintain active session
              </label>
            </div>

            <Button className="w-full h-16 rounded-2xl bg-black text-white hover:bg-black/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all font-black text-xs uppercase tracking-[0.2em] group flex items-center justify-center gap-2">
              Authenticate
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-100"></span>
            </div>
            <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em]">
              <span className="bg-white px-4 text-gray-300 italic">
                Partnerships
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-14 rounded-2xl border-gray-100 hover:bg-gray-50 text-[10px] font-black uppercase tracking-widest gap-2"
            >
              <Github size={18} /> Github
            </Button>
            <Button
              variant="outline"
              className="h-14 rounded-2xl border-gray-100 hover:bg-gray-50 text-[10px] font-black uppercase tracking-widest gap-2"
            >
              <Chrome size={18} /> Google
            </Button>
          </div>

          <p className="text-center text-[11px] font-black uppercase tracking-widest text-gray-400">
            Authorized merchant only.{" "}
            <Link
              to="/register"
              className="text-black hover:underline underline-offset-4 decoration-2"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

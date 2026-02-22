import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function Register() {
  return (
    <div className="min-h-screen w-full flex bg-white font-['Inter']">
      {/* Left Side: Branding & Narrative */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden flex-col justify-between p-16">
        {/* Abstract design elements */}
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[100px]" />

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

        <div className="relative z-10 space-y-8 max-w-lg text-right self-end">
          <div className="space-y-4">
            <h1 className="text-6xl font-black tracking-tighter leading-[0.9] text-white italic">
              Scale Your <br />
              <span className="text-gray-500 not-italic">Vision Globally.</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed">
              Join the elite circle of merchants defining the next era of
              commerce. High-performance tools await.
            </p>
          </div>

          <div className="pt-10 border-t border-white/10 flex flex-col items-end gap-5">
            <div className="flex items-center gap-3 bg-white/5 px-6 py-4 rounded-3xl border border-white/10">
              <ShieldCheck className="text-green-500" size={24} />
              <div className="text-left">
                <p className="text-xs font-black uppercase tracking-widest text-white">
                  Verified Platform
                </p>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                  Enterprise grade security
                </p>
              </div>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">
              Limited Membership Availability
            </p>
          </div>
        </div>

        <div className="relative z-10 text-white/20 text-[10px] uppercase font-black tracking-[0.5em]">
          TrendMart Merchants Association
        </div>
      </div>

      {/* Right Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#fafafa] lg:bg-white">
        <div className="w-full max-w-xl space-y-12">
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[9px] font-black uppercase tracking-widest mb-4">
              Tier 01 Application
            </div>
            <h2 className="text-5xl font-black tracking-tighter uppercase italic">
              Merchant Registration
            </h2>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
              Connect your business to our network
            </p>
          </div>

          <form className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="fullname"
                  className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400"
                >
                  Merchant Name
                </Label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-black transition-colors" />
                  <Input
                    id="fullname"
                    placeholder="John Doe"
                    className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus-visible:ring-black/5 focus-visible:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="company"
                  className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400"
                >
                  Business Entity
                </Label>
                <div className="relative group">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-black transition-colors" />
                  <Input
                    id="company"
                    placeholder="Luxe Global Ltd."
                    className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus-visible:ring-black/5 focus-visible:bg-white transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400"
                >
                  Corporate Email
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-300 group-focus-within:text-black transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="operations@company.com"
                    className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus-visible:ring-black/5 focus-visible:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase tracking-widest ml-1 text-gray-400"
                >
                  Access Key
                </Label>
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

            <div className="flex items-start space-x-3 px-1">
              <Checkbox
                id="terms"
                className="mt-1 rounded-md border-gray-200 data-[state=checked]:bg-black data-[state=checked]:border-black"
              />
              <div className="space-y-1">
                <label
                  htmlFor="terms"
                  className="text-[10px] font-black uppercase tracking-widest text-black cursor-pointer select-none"
                >
                  Agreement to Merchant Protocols
                </label>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  By applying, you commit to our sustainability and quality
                  standards.
                </p>
              </div>
            </div>

            <Button className="w-full h-16 rounded-2xl bg-black text-white hover:bg-black/90 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all font-black text-xs uppercase tracking-[0.2em] group flex items-center justify-center gap-2">
              Submit Application
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Button>
          </form>

          <p className="text-center text-[11px] font-black uppercase tracking-widest text-gray-400">
            Already registered?{" "}
            <Link
              to="/login"
              className="text-black hover:underline underline-offset-4 decoration-2"
            >
              Secure Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

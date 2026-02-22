import React from "react";
import { Link } from "react-router-dom";
import {
  MoveLeft,
  User,
  Mail,
  Lock,
  CheckCircle2,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-[#fdfdfd]">
      {/* Left Side: Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
        <div className="w-full max-w-md">
          {/* Logo / Back Link (Only visible on mobile) */}
          <div className="lg:hidden mb-12 flex flex-col items-center">
            <Link
              to="/"
              className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <MoveLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span className="text-xs font-bold uppercase tracking-widest">
                Store
              </span>
            </Link>
            <h1 className="text-3xl font-bold tracking-tighter text-foreground uppercase italic leading-none">
              Trend<span className="text-primary italic">Mart</span>
            </h1>
          </div>

          <Link
            to="/"
            className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12 absolute top-12 left-12"
          >
            <MoveLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="text-xs font-bold uppercase tracking-widest">
              Back to Gallery
            </span>
          </Link>

          {/* Register Content */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-foreground uppercase italic leading-none">
                Sign <span className="text-primary">Up</span>
              </h2>
              <p className="text-muted-foreground text-[10px] font-black mt-4 uppercase tracking-[0.3em] opacity-60">
                Create an account to start shopping.
              </p>
            </div>

            <form className="space-y-8">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-3">
                  <Label
                    htmlFor="firstName"
                    className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-muted-foreground"
                  >
                    First Name
                  </Label>
                  <div className="relative group">
                    <User
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-all duration-300"
                      size={18}
                    />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      className="pl-14 h-16 rounded-[1.25rem] bg-muted/20 border-2 border-transparent focus-visible:bg-white focus-visible:border-primary/20 focus-visible:ring-0 transition-all duration-500 font-medium text-sm shadow-sm"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label
                    htmlFor="lastName"
                    className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-muted-foreground"
                  >
                    Last Name
                  </Label>
                  <div className="relative group">
                    <User
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-all duration-300"
                      size={18}
                    />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      className="pl-14 h-16 rounded-[1.25rem] bg-muted/20 border-2 border-transparent focus-visible:bg-white focus-visible:border-primary/20 focus-visible:ring-0 transition-all duration-500 font-medium text-sm shadow-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="email"
                  className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-muted-foreground"
                >
                  Email Address
                </Label>
                <div className="relative group">
                  <Mail
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-all duration-300"
                    size={18}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-14 h-16 rounded-[1.25rem] bg-muted/20 border-2 border-transparent focus-visible:bg-white focus-visible:border-primary/20 focus-visible:ring-0 transition-all duration-500 font-medium text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label
                  htmlFor="password"
                  className="text-[10px] font-black uppercase tracking-[0.2em] ml-1 text-muted-foreground"
                >
                  Password
                </Label>
                <div className="relative group">
                  <Lock
                    className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-all duration-300"
                    size={18}
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-14 h-16 rounded-[1.25rem] bg-muted/20 border-2 border-transparent focus-visible:bg-white focus-visible:border-primary/20 focus-visible:ring-0 transition-all duration-500 font-medium text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="flex items-start gap-4 px-1 pt-2">
                <CheckCircle2
                  size={18}
                  className="text-primary mt-0.5 shrink-0"
                />
                <p className="text-[10px] text-muted-foreground font-black uppercase leading-relaxed tracking-wider opacity-60">
                  I agree to the{" "}
                  <Link to="/terms" className="text-foreground hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-foreground hover:underline"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </div>

              <Button className="w-full h-16 rounded-[1.5rem] bg-black text-white hover:bg-primary shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary),0.4)] transition-all duration-500 font-black text-xs uppercase tracking-[0.25em] group flex items-center justify-center gap-3 border-none relative overflow-hidden">
                <span className="relative z-10">Create Account</span>
                <ArrowRight
                  size={20}
                  className="relative z-10 transition-transform group-hover:translate-x-1"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </form>

            <p className="text-center text-muted-foreground text-[11px] font-bold uppercase tracking-widest pt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary hover:text-foreground transition-colors font-black border-b-2 border-primary/20 hover:border-primary pb-1"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Immersive Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0A0A0A]">
        {/* Dynamic Gradient Orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-primary/15 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[100px]" />

        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Visual Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-20 text-right items-end">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tighter text-white uppercase italic leading-none group flex items-center gap-2 flex-row-reverse"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center italic text-black font-black text-lg">
              T
            </div>
            Trend<span className="text-primary italic">Mart</span>
          </Link>

          <div className="space-y-12 max-w-lg">
            <div className="space-y-4">
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] block">
                Exclusive Invitation
              </span>
              <h2 className="text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.05] uppercase">
                Define the <br />
                <span className="text-primary italic">Standard.</span>
              </h2>
            </div>

            <p className="text-white/50 text-xl font-medium leading-relaxed">
              Step into a realm where style meets substance. Unlock a curated
              world of high-fashion and elite membership perks.
            </p>

            <div className="flex flex-col items-end gap-5 pt-10 border-t border-white/10">
              <div className="flex items-center gap-4 bg-white/[0.03] border border-white/[0.08] backdrop-blur-md p-4 rounded-2xl w-full justify-end">
                <div className="text-right">
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em]">
                    Tier 01 Status
                  </p>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-1 italic">
                    Instant VIP Recognition
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Star size={20} fill="currentColor" />
                </div>
              </div>
              <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.4em]">
                Limited Membership Access
              </p>
            </div>
          </div>

          <div className="text-white/20 text-[9px] uppercase font-black tracking-[0.4em] flex gap-8">
            <span className="hover:text-white/40 cursor-pointer transition-colors">
              Brussels
            </span>
            <span className="hover:text-white/40 cursor-pointer transition-colors">
              Milan
            </span>
            <span className="hover:text-white/40 cursor-pointer transition-colors">
              Paris
            </span>
          </div>
        </div>

        {/* Decorative Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-transparent to-transparent" />
      </div>
    </div>
  );
};

export default Register;

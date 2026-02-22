import React from "react";
import { Link } from "react-router-dom";
import { MoveLeft, Github, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Login: React.FC = () => {
  return (
    <div className="min-h-screen w-full flex bg-[#fdfdfd]">
      {/* Left Side: Immersive Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#0A0A0A]">
        {/* Dynamic Gradient Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[0%] right-[-10%] w-[60%] h-[60%] bg-primary/5 rounded-full blur-[100px]" />

        {/* Grainy Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

        {/* Visual Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-20">
          <Link
            to="/"
            className="text-2xl font-bold tracking-tighter text-white uppercase italic leading-none group flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center italic text-black font-black text-lg">
              T
            </div>
            Trend<span className="text-primary italic">Mart</span>
          </Link>

          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.5em] block mb-2">
                Editorial Issue N° 01
              </span>
              <h2 className="text-6xl xl:text-7xl font-bold text-white tracking-tight leading-[1.05] uppercase italic">
                A Vision of <br />
                <span className="text-primary not-italic">Refined</span> <br />
                Aesthetics.
              </h2>
            </div>

            <p className="text-white/50 text-xl max-w-sm font-medium leading-relaxed">
              Curated for the modern minimalist. Your journey into the
              extraordinary begins here.
            </p>

            <div className="pt-10">
              <div className="inline-flex items-center gap-6 p-4 rounded-3xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full border-2 border-[#0A0A0A] bg-zinc-800 flex items-center justify-center overflow-hidden"
                    >
                      <div className="w-full h-full bg-gradient-to-br from-zinc-700 to-zinc-900" />
                    </div>
                  ))}
                </div>
                <div className="pr-4">
                  <p className="text-white text-[10px] font-black uppercase tracking-widest leading-none">
                    50K+ Global Members
                  </p>
                  <p className="text-white/40 text-[9px] font-bold uppercase tracking-wider mt-1.5">
                    Verified High-Tier Accounts
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-white/20 text-[9px] uppercase font-black tracking-[0.4em]">
            <span>Signature Archive</span>
            <div className="flex gap-4">
              <span className="hover:text-white/40 cursor-pointer transition-colors">
                Instagram
              </span>
              <span className="hover:text-white/40 cursor-pointer transition-colors">
                Vogue
              </span>
            </div>
          </div>
        </div>

        {/* Decorative Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/40" />
      </div>

      {/* Right Side: Login Form */}
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
            className="hidden lg:flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-12 absolute top-12 right-12"
          >
            <MoveLeft
              size={16}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="text-xs font-bold uppercase tracking-widest">
              Return to Home
            </span>
          </Link>

          {/* Login Content */}
          <div className="space-y-12">
            <div>
              <h2 className="text-4xl font-bold tracking-tight text-foreground uppercase italic leading-none">
                Sign <span className="text-primary">In</span>
              </h2>
              <p className="text-muted-foreground text-xs font-semibold mt-3 uppercase tracking-widest opacity-70">
                Welcome back. Please enter your details.
              </p>
            </div>

            <form className="space-y-8">
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
                    placeholder="Enter your email"
                    className="pl-14 h-16 rounded-[1.25rem] bg-muted/20 border-2 border-transparent focus-visible:bg-white focus-visible:border-primary/20 focus-visible:ring-0 transition-all duration-500 font-medium text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <Label
                    htmlFor="password"
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-foreground transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
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

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded-md border-2 border-muted text-primary focus:ring-primary/20 transition-all cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground cursor-pointer select-none"
                  >
                    Remember me
                  </label>
                </div>
              </div>

              <Button className="w-full h-16 rounded-[1.5rem] bg-black text-white hover:bg-primary shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_50px_-12px_rgba(var(--primary),0.4)] transition-all duration-500 font-black text-xs uppercase tracking-[0.25em] group flex items-center justify-center gap-3 border-none relative overflow-hidden">
                <span className="relative z-10">Sign In</span>
                <ArrowRight
                  size={18}
                  className="relative z-10 transition-transform group-hover:translate-x-1"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/5 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Button>
            </form>

            <div className="relative pt-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/[0.06]"></span>
              </div>
              <div className="relative flex justify-center text-[9px] uppercase font-black tracking-[0.3em]">
                <span className="bg-[#fdfdfd] px-6 text-muted-foreground opacity-50">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <Button
                variant="outline"
                className="h-16 rounded-[1.25rem] bg-white border-2 border-black/[0.03] hover:border-black/5 hover:bg-muted/30 transition-all duration-300 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-sm group"
              >
                <svg
                  className="w-4 h-4 transition-transform group-hover:scale-110"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="currentColor"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="currentColor"
                    opacity="0.8"
                  />
                </svg>
                Google
              </Button>
              <Button
                variant="outline"
                className="h-16 rounded-[1.25rem] bg-white border-2 border-black/[0.03] hover:border-black/5 hover:bg-muted/30 transition-all duration-300 font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-sm group"
              >
                <Github
                  size={18}
                  className="transition-transform group-hover:scale-110"
                />
                Github
              </Button>
            </div>

            <p className="text-center text-muted-foreground text-[11px] font-bold uppercase tracking-widest pt-6">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-primary hover:text-foreground transition-colors font-black border-b-2 border-primary/20 hover:border-primary pb-1"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

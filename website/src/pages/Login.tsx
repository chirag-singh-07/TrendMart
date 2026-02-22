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
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        {/* Animated Background Pattern/Glow */}
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-primary/20 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-primary/10 rounded-full blur-[120px]" />

        {/* Visual Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16">
          <Link
            to="/"
            className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none group"
          >
            Trend<span className="text-primary italic">Mart</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-6xl font-bold text-white tracking-tighter leading-tight uppercase">
              The Standard of <br />
              <span className="text-primary italic">Premium Fashion</span>
            </h2>
            <p className="text-white/60 text-lg max-w-md font-medium leading-relaxed">
              Join our exclusive community of trendsetters and experience the
              future of digital commerce.
            </p>
            <div className="flex items-center gap-4 pt-4 border-t border-white/10">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full border-2 border-black bg-muted/20"
                  />
                ))}
              </div>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                Trusted by 50k+ global members
              </p>
            </div>
          </div>

          <div className="text-white/20 text-[10px] uppercase font-black tracking-[0.5em]">
            © 2026 TrendMart Signature Collection
          </div>
        </div>

        {/* Decorative Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
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
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground uppercase italic">
                Sign In
              </h2>
              <p className="text-muted-foreground text-sm font-medium mt-2">
                Welcome to the inner circle.
              </p>
            </div>

            <form className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[10px] font-bold uppercase tracking-widest ml-1"
                >
                  Identity
                </Label>
                <div className="relative group">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <Label
                    htmlFor="password"
                    className="text-[10px] font-bold uppercase tracking-widest"
                  >
                    Key
                  </Label>
                  <Link
                    to="/forgot-password"
                    title="Forgot Password"
                    className="text-[10px] font-bold uppercase tracking-widest text-primary hover:underline"
                  >
                    Recover
                  </Link>
                </div>
                <div className="relative group">
                  <Lock
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                    size={18}
                  />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium text-sm"
                  />
                </div>
              </div>

              <Button className="w-full h-14 rounded-2xl bg-black text-white hover:bg-primary shadow-xl transition-all font-bold text-xs uppercase tracking-[0.2em] group flex items-center justify-center gap-2 border-none pt-1">
                Authenticate
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-black/5"></span>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest">
                <span className="bg-[#fdfdfd] px-4 text-muted-foreground">
                  Social Access
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-14 rounded-2xl bg-muted/20 border-black/5 hover:bg-muted/30 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                className="h-14 rounded-2xl bg-muted/20 border-black/5 hover:bg-muted/30 transition-all font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <Github size={18} />
                Github
              </Button>
            </div>

            <p className="text-center text-muted-foreground text-sm font-medium pt-4">
              New here?{" "}
              <Link
                to="/register"
                className="text-primary font-bold hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

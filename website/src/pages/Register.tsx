import React from "react";
import { Link } from "react-router-dom";
import {
  MoveLeft,
  User,
  Mail,
  Lock,
  CheckCircle2,
  ArrowRight,
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
          <div className="space-y-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground uppercase italic leading-none">
                Create Account
              </h2>
              <p className="text-muted-foreground text-sm font-medium mt-3 uppercase tracking-widest text-[10px]">
                Step into the future of lifestyle.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="text-[10px] font-bold uppercase tracking-widest ml-1"
                  >
                    First Name
                  </Label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="John"
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="lastName"
                    className="text-[10px] font-bold uppercase tracking-widest ml-1"
                  >
                    Last Name
                  </Label>
                  <div className="relative group">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
                      size={18}
                    />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      className="pl-12 h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all font-medium text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-[10px] font-bold uppercase tracking-widest ml-1"
                >
                  Email
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
                <Label
                  htmlFor="password"
                  className="text-[10px] font-bold uppercase tracking-widest ml-1"
                >
                  Secret Key
                </Label>
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

              <div className="flex items-start gap-3 px-1">
                <CheckCircle2
                  size={16}
                  className="text-primary mt-0.5 shrink-0"
                />
                <p className="text-[10px] text-muted-foreground font-semibold uppercase leading-relaxed tracking-wider">
                  I agree to the{" "}
                  <Link to="/terms" className="text-foreground hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-foreground hover:underline"
                  >
                    Privacy
                  </Link>
                  .
                </p>
              </div>

              <Button className="w-full h-16 rounded-[1.75rem] bg-black text-white hover:bg-primary shadow-2xl transition-all font-bold text-xs uppercase tracking-[0.2em] group flex items-center justify-center gap-2 border-none pt-1">
                Establish Identity
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Button>
            </form>

            <p className="text-center text-muted-foreground text-sm font-medium">
              Member already?{" "}
              <Link
                to="/login"
                className="text-primary font-bold hover:underline"
              >
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Immersive Visual (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-black">
        {/* Animated Background Pattern/Glow */}
        <div className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-primary/25 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[100px]" />

        {/* Visual Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between p-16 text-right items-end">
          <Link
            to="/"
            className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none group"
          >
            Trend<span className="text-primary italic">Mart</span>
          </Link>

          <div className="space-y-6 max-w-lg">
            <h2 className="text-6xl font-bold text-white tracking-tighter leading-tight uppercase">
              Join the <br />
              <span className="text-primary italic">Movement</span>
            </h2>
            <p className="text-white/60 text-lg font-medium leading-relaxed">
              Unlock exclusive early access, personalized recommendations, and
              premium global shipping.
            </p>
            <div className="flex flex-col items-end gap-3 pt-6 border-t border-white/10">
              <span className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                Membership Benefit #01
              </span>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest italic">
                Direct Priority Access to Limited Drops
              </p>
            </div>
          </div>

          <div className="text-white/20 text-[10px] uppercase font-black tracking-[0.5em]">
            Elite Tier Access Restricted
          </div>
        </div>

        {/* Decorative Overlay */}
        <div className="absolute inset-0 bg-gradient-to-l from-black/80 via-black/20 to-transparent" />
      </div>
    </div>
  );
};

export default Register;

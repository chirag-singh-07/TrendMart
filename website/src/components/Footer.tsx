import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-foreground text-background pt-24 pb-12 overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 mb-24 px-4">
          <div className="lg:col-span-2 space-y-8">
            <h2 className="text-4xl font-black tracking-tighter">
              TREND<span className="text-primary">MART</span>
            </h2>
            <p className="text-muted-foreground max-w-sm text-lg font-medium leading-relaxed">
              Redefining the modern retail experience with premium quality and
              unmatched style.
            </p>
            <div className="flex gap-4">
              <Input
                type="email"
                placeholder="Join our newsletter"
                className="bg-background/10 border-none rounded-2xl px-6 py-4 h-14 flex-grow outline-none focus-visible:ring-2 focus-visible:ring-primary/50 transition-all text-sm font-semibold"
              />
              <Button className="bg-primary hover:bg-primary/90 text-white rounded-2xl px-8 h-14 font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-primary/20 border-none">
                Join
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">
              Company
            </h3>
            <ul className="flex flex-col gap-4 text-sm font-semibold text-muted-foreground/80">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  TrendMart Stories
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">
              Support
            </h3>
            <ul className="flex flex-col gap-4 text-sm font-semibold text-muted-foreground/80">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Payments
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Cancellation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Returns
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary">
              Legal
            </h3>
            <ul className="flex flex-col gap-4 text-sm font-semibold text-muted-foreground/80">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Terms of Use
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Security
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] text-muted-foreground/60 font-black tracking-[0.2em] uppercase px-4 text-center">
          <div className="flex gap-12">
            <span>© 2024 TRENDMART STORE. ALL RIGHTS RESERVED.</span>
          </div>
          <div className="flex gap-12 items-center">
            <span className="cursor-pointer hover:text-primary">Twitter</span>
            <span className="cursor-pointer hover:text-primary">Instagram</span>
            <span className="cursor-pointer hover:text-primary">Discord</span>
            <div className="w-px h-4 bg-background/10 mx-4 hidden md:block" />
            <span className="cursor-pointer hover:text-primary">India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

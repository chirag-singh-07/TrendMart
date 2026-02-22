import { CheckCircle2, Crown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function SellerTier() {
  return (
    <Card className="border-none shadow-2xl bg-black text-white rounded-[2.5rem] overflow-hidden relative group">
      {/* Decorative pulse glow */}
      <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[100px] animate-pulse" />

      <CardContent className="p-10 relative z-10">
        <div className="flex flex-col md:flex-row gap-10">
          <div className="flex-1 space-y-8">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20">
                <Crown size={14} className="text-amber-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  Elite Tier Seller
                </span>
              </div>
              <h3 className="text-4xl font-black tracking-tighter italic">
                Mastering the <br />{" "}
                <span className="text-white/40">Marketplace.</span>
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                <span className="text-white/60">Revenue Milestone</span>
                <span>$45,231 / $50,000</span>
              </div>
              <Progress value={90} className="h-2 bg-white/10" />
              <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest leading-none">
                $4,769 remaining to reach Crown Status
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Priority Support
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-green-500" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">
                  Lower Commissions
                </span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-[220px] bg-white/5 rounded-3xl p-8 border border-white/10 flex flex-col items-center justify-center gap-6 text-center">
            <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-black shadow-xl shadow-black/50 overflow-hidden">
              <Crown size={32} fill="black" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-black uppercase tracking-widest">
                Next Achievement
              </p>
              <p className="text-lg font-black italic">Crown Badge</p>
            </div>
            <button className="w-full h-12 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-colors">
              Claim Reward
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

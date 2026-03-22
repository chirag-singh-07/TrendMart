import React, { useState, useEffect } from "react";
import SellerLayout from "@/components/layout/SellerLayout";
import { Store, Mail, MapPin, Phone, Globe, Camera, ShieldCheck, CheckCircle2, Edit3, Save, Calendar, Zap, Trash2, Lock, Loader2, Info, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// Removed Textarea as it might not be in the UI components yet, using standard textarea


export default function Profile() {
  const [sellerData, setSellerData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("seller_data");
    if (stored) setSellerData(JSON.parse(stored));
  }, []);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Mock update
    setTimeout(() => {
        setLoading(false);
        alert("Merchant Profile Assets Synchronized Successfully.");
    }, 1500);
  };

  return (
    <SellerLayout>
      <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in duration-1000">
        {/* Profile Header & Branding */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-10 border-b border-zinc-100">
           <div className="flex items-center gap-10 group">
              <div className="relative group/avatar cursor-pointer">
                 <div className="w-40 h-40 rounded-[45px] bg-black flex items-center justify-center font-black text-white text-6xl shadow-2xl shadow-black/20 group-hover/avatar:scale-105 transition-all duration-500 overflow-hidden">
                    {sellerData?.firstName?.[0] || "S"}
                 </div>
                 <div className="absolute inset-0 bg-black/40 rounded-[45px] flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-all">
                    <Camera size={32} className="text-white animate-pulse" />
                 </div>
                 <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-2xl border-4 border-white flex items-center justify-center text-white shadow-xl">
                    <ShieldCheck size={20} />
                 </div>
              </div>
              <div className="space-y-3">
                 <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    <Store size={12} className="text-black" />
                    Verified Merchant Entity
                 </div>
                 <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none truncate">
                    {sellerData?.firstName} {sellerData?.lastName}
                 </h1>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-black" />
                    Global Merchant Reach: Tier 1 Elite
                 </p>
              </div>
           </div>
           
           <div className="flex items-center gap-3">
              <button className="h-14 px-8 bg-zinc-100 border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-3">
                 <Zap size={18} /> Upgrade Tier
              </button>
              <button className="h-14 px-8 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all flex items-center gap-3 shadow-2xl shadow-black/20 group">
                 <Save size={18} className="group-hover:scale-110 transition-transform" /> {loading ? <Loader2 size={18} className="animate-spin" /> : "Sync Changes"}
              </button>
           </div>
        </div>

        {/* Global Operational Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
           {/* Primary Identity Segment */}
           <div className="lg:col-span-8 space-y-12">
              <form onSubmit={handleUpdate} className="space-y-12 bg-white rounded-[60px] border border-zinc-100 p-12 shadow-sm relative overflow-hidden">
                 <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-zinc-50 rounded-full blur-[80px]" />
                 
                 <div className="relative z-10 space-y-10">
                    <div className="flex items-center justify-between">
                       <h3 className="text-2xl font-black uppercase tracking-tighter italic">Entity Identity</h3>
                       <div className="p-3 bg-zinc-50 rounded-2xl text-zinc-400">
                          <Edit3 size={20} />
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">Merchant Nominee</Label>
                          <div className="relative group">
                             <Store size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-all" />
                             <Input 
                                disabled
                                defaultValue={sellerData?.firstName + " " + sellerData?.lastName}
                                className="h-16 pl-14 pr-6 rounded-2xl bg-zinc-50/50 border border-zinc-100 focus:outline-none focus:bg-white focus:border-black text-[11px] font-black uppercase tracking-widest transition-all"
                             />
                          </div>
                          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest pl-1">Authenticated legal identifier</p>
                       </div>
                       
                       <div className="space-y-3">
                          <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">Corporate Reach</Label>
                          <div className="relative group">
                             <Globe size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300 group-focus-within:text-black transition-all" />
                             <Input 
                                defaultValue="Global Presence (Tier 1)"
                                className="h-16 pl-14 pr-6 rounded-2xl bg-zinc-50/50 border border-zinc-100 focus:outline-none focus:bg-white focus:border-black text-[11px] font-black uppercase tracking-widest transition-all"
                             />
                          </div>
                          <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest pl-1">Visibility across all marketplaces</p>
                       </div>
                    </div>

                    <div className="space-y-3">
                       <Label className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 ml-1">Brand Narrative (Public Profile)</Label>
                       <textarea 
                          defaultValue="Leading the future of commerce with premium quality assets and enterprise-grade reliability."
                          className="w-full min-h-[160px] p-6 rounded-[35px] bg-zinc-50/50 border border-zinc-100 text-[12px] font-medium text-zinc-600 leading-relaxed focus:bg-white focus:border-black transition-all resize-none outline-none"
                       />
                       <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest pl-1 italic flex items-center gap-2">
                          <Info size={12} /> This content is visible to 2.4M global checkouts
                       </p>
                    </div>

                    <div className="pt-8 border-t border-zinc-50 flex items-center justify-between">
                       <div className="flex items-center gap-3 bg-zinc-50 px-5 py-2.5 rounded-full border border-zinc-100">
                          <CheckCircle2 size={14} className="text-green-500" />
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Merchant Sync Enabled</span>
                       </div>
                       <button className="h-14 px-8 bg-zinc-50 border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-black transition-all">Reset Identity State</button>
                    </div>
                 </div>
              </form>

              {/* Security & Access Protocols */}
              <div className="bg-white rounded-[60px] border border-zinc-100 p-12 shadow-sm space-y-10 group overflow-hidden relative">
                 <div className="flex items-center gap-6 mb-4">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center border border-red-100 group-hover:bg-red-500 group-hover:text-white transition-all duration-500">
                       <Lock size={32} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black uppercase tracking-tighter italic">Access Restrictions</h3>
                       <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-1">Advanced identity management and protection</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    <div className="p-8 rounded-[35px] bg-zinc-50 border border-zinc-50 hover:bg-white hover:border-zinc-200 transition-all group/card">
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Two-Factor Authentication</p>
                       <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                             <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900">Protocol Active</span>
                          </div>
                          <button className="text-[9px] font-black uppercase tracking-widest text-black underline underline-offset-4 decoration-2 decoration-black/10">Modify Access Key</button>
                       </div>
                    </div>
                    
                    <div className="p-8 rounded-[35px] bg-zinc-50 border border-zinc-50 hover:bg-white hover:border-zinc-200 transition-all group/card">
                       <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2">Session Expiry Registry</p>
                       <div className="flex items-center justify-between">
                          <span className="text-[11px] font-black uppercase tracking-widest text-zinc-900">Last Synced: 2h Ago</span>
                          <button className="text-[9px] font-black uppercase tracking-widest text-red-500 underline underline-offset-4 decoration-2 decoration-red-500/10 hover:text-red-700">Purge Other Devices</button>
                       </div>
                    </div>
                 </div>
                 
                 <div className="absolute right-[-5%] bottom-[-5%] w-40 h-40 bg-zinc-50 rounded-full blur-[70px] group-hover:bg-white transition-all duration-700" />
              </div>
           </div>

           {/* Secondary Asset Segment (Contact & Reach) */}
           <div className="lg:col-span-4 space-y-12">
              <div className="bg-black text-white rounded-[55px] p-12 shadow-2xl shadow-black/30 space-y-10 relative overflow-hidden group">
                 <h3 className="text-xl font-black uppercase tracking-tighter italic relative z-10">Contact Matrix</h3>
                 
                 <div className="space-y-10 relative z-10">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5 text-zinc-400">
                          <Mail size={22} />
                       </div>
                       <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">Corporate Registry</p>
                          <p className="text-sm font-bold truncate">{sellerData?.email}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5 text-zinc-400">
                          <Phone size={22} />
                       </div>
                       <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">Merchant Hotline</p>
                          <p className="text-sm font-bold">+91 9910FX 2026</p>
                       </div>
                    </div>

                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/5 text-zinc-400">
                          <MapPin size={22} />
                       </div>
                       <div>
                          <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-1">Physical HQ</p>
                          <p className="text-sm font-bold">New Delhi, NCR Platform</p>
                       </div>
                    </div>
                 </div>
                 
                 <button className="w-full h-16 bg-white text-black rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all relative z-10 group-hover:scale-105 duration-300">
                    Validate Connectivity
                 </button>

                 <div className="absolute right-[-10%] top-[-10%] w-40 h-40 bg-zinc-800 rounded-full blur-[70px] animate-pulse" />
              </div>

              {/* System Statistics Asset */}
              <div className="bg-zinc-50 rounded-[55px] border border-zinc-100 p-12 space-y-10">
                 <h3 className="text-xl font-black uppercase tracking-tighter italic text-zinc-900">Tenure Analytics</h3>
                 
                 <div className="space-y-10">
                    <div className="flex justify-between items-center group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white border border-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-black transition-colors">
                             <Calendar size={18} />
                          </div>
                          <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 leading-none mb-1">Onboarding Date</p>
                             <p className="text-xs font-bold uppercase tracking-widest">March 22, 2026</p>
                          </div>
                       </div>
                       <ChevronRight size={14} className="text-zinc-300" />
                    </div>

                    <div className="flex justify-between items-center group cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white border border-zinc-100 rounded-xl flex items-center justify-center text-zinc-400 group-hover:text-black transition-colors">
                             <Store size={18} />
                          </div>
                          <div>
                             <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 leading-none mb-1">Total Assets Listed</p>
                             <p className="text-xs font-bold uppercase tracking-widest">42 Premium SKU</p>
                          </div>
                       </div>
                       <ChevronRight size={14} className="text-zinc-300" />
                    </div>
                 </div>
                 
                 <div className="pt-10 border-t border-zinc-200">
                    <button className="w-full h-14 bg-red-50 text-red-500 border border-red-50 rounded-2xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-3 group">
                       <Trash2 size={16} className="group-hover:scale-110 transition-transform" /> Decommission Merchant Account
                    </button>
                    <p className="text-[8px] font-black text-center uppercase tracking-widest text-zinc-300 mt-4 leading-relaxed">
                       Subject to TrendMart Merchant Protection Protocol V4.2
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </SellerLayout>
  );
}

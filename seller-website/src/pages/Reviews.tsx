import { useState } from "react";
import SellerLayout from "@/components/layout/SellerLayout";
import { 
  Star, 
  MessageSquare, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ThumbsUp, 
  ThumbsDown,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Reviews() {
  const [filterRating, setFilterRating] = useState("All Ratings");

  const reviews = [
    { 
      id: "REV-101", 
      user: "Amit Sharma", 
      rating: 5, 
      comment: "Absolutely incredible quality. The leather is premium and the fit is perfect.", 
      product: "Classic Leather Sneaker", 
      date: "Just Now", 
      status: "Verified Buyer" 
    },
    { 
      id: "REV-102", 
      user: "Priya Patel", 
      rating: 4, 
      comment: "Good product, but delivery took a bit longer than expected. Still worth the wait.", 
      product: "Minimalist Quartz Watch", 
      date: "2h Ago", 
      status: "Verified Buyer" 
    },
    { 
      id: "REV-103", 
      user: "Rahul Verma", 
      rating: 3, 
      comment: "The sound quality is great but the earpads are a bit firm. Hope they soften up.", 
      product: "Noise Cancelling Headphones", 
      date: "5h Ago", 
      status: "Verified Buyer" 
    },
    { 
      id: "REV-104", 
      user: "Ananya Iyer", 
      rating: 5, 
      comment: "Perfect fit! I love the color and the fabric feels premium. Highly recommended.", 
      product: "Slim Fit Cotton Chino", 
      date: "1d Ago", 
      status: "Verified Buyer" 
    },
  ];

  return (
    <SellerLayout>
      <div className="space-y-12 animate-in fade-in duration-1000">
        {/* Feedback Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500">
               <CheckCircle2 size={12} className="text-black" />
               Customer Voice Analytics
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              Reputation Matrix
            </h1>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Verified feedback stream and sentiment tracking</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="h-14 px-8 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all flex items-center gap-3 shadow-2xl shadow-black/20">
                <Star size={18} className="text-amber-500 fill-amber-500" />
                Review Summary Export
             </button>
          </div>
        </div>

        {/* Global Reputation Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: "Global Rating", value: "4.8", icon: Star, color: "text-amber-500" },
             { label: "Total Feedback", value: "1.2K", icon: MessageSquare, color: "text-blue-500" },
             { label: "Positive Sentiment", value: "92%", icon: ThumbsUp, color: "text-green-500" },
           ].map((stat, i) => (
             <div key={i} className="p-8 bg-white rounded-[35px] border border-zinc-100 shadow-sm hover:shadow-xl transition-all flex items-center gap-6 group">
                <div className={`w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center ${stat.color} group-hover:bg-zinc-900 group-hover:text-white transition-all`}>
                   <stat.icon size={22} className={stat.label === "Global Rating" ? "fill-amber-500" : ""} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                   <h2 className="text-2xl font-black italic tracking-tight">{stat.value}</h2>
                </div>
             </div>
           ))}
        </div>

        {/* Search & Rating Filter Bar */}
        <div className="bg-white rounded-[40px] border border-zinc-100 p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
           <div className="flex flex-wrap gap-2 flex-1">
              {["All Ratings", "5 Stars", "4 Stars", "3 Stars", "1-2 Stars"].map((rate) => (
                 <button 
                    key={rate}
                    onClick={() => setFilterRating(rate)}
                    className={`h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     filterRating === rate 
                       ? "bg-black text-white shadow-xl shadow-black/10" 
                       : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-black"
                    }`}
                 >
                    {rate}
                 </button>
              ))}
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-[350px]">
              <div className="flex-1 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                 <input 
                    type="text" 
                    placeholder="Search Feedback Content" 
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-50 border border-zinc-50 focus:outline-none focus:bg-white focus:border-zinc-200 text-[10px] font-black uppercase tracking-widest transition-all"
                 />
              </div>
              <button className="h-12 w-12 bg-zinc-50 border border-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-black hover:text-white transition-all cursor-pointer">
                 <Filter size={18} />
              </button>
           </div>
        </div>

        {/* Feedback Matrix Stream */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {reviews.map((rev, i) => (
             <div key={i} className="bg-white rounded-[45px] border border-zinc-100 p-10 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between">
                <div className="space-y-6">
                   <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center font-black text-black group-hover:bg-zinc-900 group-hover:text-white transition-all">
                            {rev.user[0]}
                         </div>
                         <div className="space-y-1">
                            <h4 className="text-[12px] font-black uppercase tracking-tight text-zinc-900 group-hover:underline underline-offset-4 decoration-2 decoration-black/20">{rev.user}</h4>
                            <div className="flex items-center gap-2">
                               <div className="flex gap-0.5">
                                  {[...Array(5)].map((_, idx) => (
                                     <Star key={idx} size={10} className={idx < rev.rating ? "text-amber-500 fill-amber-500" : "text-zinc-200"} />
                                  ))}
                               </div>
                               <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest border-l border-zinc-200 pl-2 ml-1">{rev.status}</span>
                            </div>
                         </div>
                      </div>
                      <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-tighter italic">{rev.date}</span>
                   </div>
                   
                   <p className="text-[14px] font-medium text-zinc-600 italic leading-relaxed pt-2">
                      "{rev.comment}"
                   </p>

                   <div className="pt-6 border-t border-zinc-50 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400">
                            <MessageSquare size={14} />
                         </div>
                         <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Linked Item: <span className="text-zinc-900">{rev.product}</span></p>
                      </div>
                      <div className="flex items-center gap-2">
                         <button className="h-10 px-6 bg-zinc-50 border border-zinc-100 rounded-xl text-[9px] font-black uppercase hover:bg-black hover:text-white transition-all">Public Reply</button>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <button className="h-10 w-10 flex items-center justify-center bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-400 hover:bg-white hover:text-black hover:border-black transition-all">
                                  <MoreHorizontal size={18} />
                               </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-zinc-50 shadow-2xl">
                               <DropdownMenuItem className="p-3 rounded-xl gap-3 text-[10px] font-black uppercase tracking-widest">
                                  <ShieldCheck size={16} className="text-blue-500" /> Verify Identity
                               </DropdownMenuItem>
                               <DropdownMenuItem className="p-3 rounded-xl gap-3 text-[10px] font-black uppercase tracking-widest">
                                  <ThumbsUp size={16} className="text-green-500" /> High-Density Filter
                               </DropdownMenuItem>
                               <DropdownMenuItem className="p-3 rounded-xl gap-3 text-[10px] font-black uppercase tracking-widest text-red-500 focus:bg-red-50">
                                  <ThumbsDown size={16} /> Flag Anomaly
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                      </div>
                   </div>
                </div>
             </div>
           ))}
        </div>

        {/* Global Performance Monitoring Stats (Footer of Page) */}
        <div className="p-10 bg-black text-white rounded-[55px] shadow-2xl shadow-black/20 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
           <div className="relative z-10 flex items-center gap-8">
              <div className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20">
                 <ShieldCheck size={36} className="text-green-500" />
              </div>
              <div className="space-y-1">
                 <h2 className="text-3xl font-black italic tracking-tighter leading-none">Reputation Safe-Guard</h2>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Global merchant rating verification active</p>
              </div>
           </div>
           
           <div className="relative z-10 flex items-center gap-4">
              <button className="h-14 px-8 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-3">
                 <ArrowRight size={18} /> Review Guidelines
              </button>
              <button className="h-14 px-8 bg-zinc-800 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-700 transition-all">
                 System Console
              </button>
           </div>
           
           <div className="absolute right-[-10%] bottom-[-10%] w-64 h-64 bg-white/5 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
        </div>
      </div>
    </SellerLayout>
  );
}

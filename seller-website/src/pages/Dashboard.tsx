import { useEffect, useState } from "react";
import SellerLayout from "@/components/layout/SellerLayout";
import { 
  TrendingUp, 
  ShoppingCart, 
  Package, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  Download,
  Filter,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Clock,
  ChevronRight
} from "lucide-react";



export default function Dashboard() {
  const [sellerData, setSellerData] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("seller_data");
    if (stored) setSellerData(JSON.parse(stored));
  }, []);

  const stats = [
    { 
      label: "Total Revenue", 
      value: "₹1,42,390", 
      change: "+12.5%", 
      isUp: true, 
      icon: DollarSign, 
      color: "bg-black",
      textColor: "text-white"
    },
    { 
      label: "Gross Sales", 
      value: "842", 
      change: "+24% ", 
      isUp: true, 
      icon: ShoppingCart, 
      color: "bg-zinc-100",
      textColor: "text-zinc-900"
    },
    { 
      label: "My Inventory", 
      value: "156", 
      change: "-2% ", 
      isUp: false, 
      icon: Package, 
      color: "bg-zinc-100",
      textColor: "text-zinc-900"
    },
    { 
      label: "Customer Rating", 
      value: "4.8", 
      change: "+0.1 ", 
      isUp: true, 
      icon: Users, 
      color: "bg-zinc-100",
      textColor: "text-zinc-900"
    },
  ];

  return (
    <SellerLayout>
      <div className="space-y-12 animate-in fade-in duration-1000">
        {/* Header Greeting */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              Business Intelligence
            </h1>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              Real-time performance analytics for {sellerData?.firstName || "Merchant"}
            </p>
          </div>
          <div className="flex items-center gap-4">
             <button className="h-14 px-8 bg-zinc-100 border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-3">
                <Calendar size={18} />
                Select Period
             </button>
             <button className="h-14 px-8 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all flex items-center gap-3 shadow-2xl shadow-black/20">
                <Download size={18} />
                Generate Report
             </button>
          </div>
        </div>

        {/* Major KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {stats.map((stat, i) => (
              <div key={i} className={`p-10 rounded-[45px] border border-zinc-100 shadow-sm hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between h-72 ${stat.color} ${stat.textColor} group relative overflow-hidden`}>
                 <div className="flex justify-between items-start relative z-10">
                    <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${stat.textColor === "text-white" ? "opacity-40" : "text-zinc-400"}`}>
                       {stat.label}
                    </p>
                    <div className={`p-3 rounded-2xl ${stat.textColor === "text-white" ? "bg-white/10" : "bg-white shadow-sm border border-zinc-100"}`}>
                       <stat.icon size={22} />
                    </div>
                 </div>
                 
                 <div className="relative z-10">
                    <h2 className="text-5xl font-black tracking-tighter italic mb-4 leading-none">{stat.value}</h2>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                       <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${stat.isUp ? "text-green-500" : "text-red-500"} ${stat.textColor === "text-white" ? "bg-white/10" : "bg-zinc-50"}`}>
                          {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.change}
                       </span>
                       <span className={stat.textColor === "text-white" ? "opacity-30" : "text-zinc-400"}>vs Last Mo.</span>
                    </div>
                 </div>

                 {/* Abstract visual */}
                 <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700" />
              </div>
           ))}
        </div>

        {/* Primary Analytical Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Global Sales Volume Chart Placeholer */}
           <div className="lg:col-span-2 bg-white rounded-[55px] border border-zinc-100 p-12 shadow-sm flex flex-col h-[600px]">
              <div className="flex items-center justify-between mb-16">
                 <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Global Sales Volume</h3>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">Active checkouts across all regions</p>
                 </div>
                 <div className="flex items-center gap-2 bg-zinc-50 p-2 rounded-2xl">
                    <button className="px-5 py-2.5 bg-white text-[9px] font-black uppercase rounded-xl shadow-sm text-black">Weekly</button>
                    <button className="px-5 py-2.5 text-zinc-400 text-[9px] font-black uppercase rounded-xl hover:text-black">Monthly</button>
                 </div>
              </div>
              
              <div className="flex-1 flex items-end justify-between gap-4 px-2">
                 {[40, 60, 30, 80, 50, 90, 70, 45, 65, 85, 55, 100].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                       <div className="w-full relative h-[400px] flex items-end">
                          <div 
                             className="w-full rounded-2xl transition-all duration-700 bg-zinc-100 group-hover:bg-black group-hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.2)]" 
                             style={{ height: `${h}%` }}
                          />
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 pointer-events-none">
                             <div className="bg-black text-white text-[9px] font-black px-3 py-2 rounded-xl border border-white/10 shadow-2xl whitespace-nowrap">
                                ₹{h * 200}
                             </div>
                             <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-black mx-auto" />
                          </div>
                       </div>
                       <span className="text-[9px] font-black text-zinc-400 uppercase group-hover:text-black transition-colors tracking-tighter italic">
                          W {i + 1}
                       </span>
                    </div>
                 ))}
              </div>
           </div>

           {/* Operational Efficiency (Process Status) */}
           <div className="bg-white rounded-[55px] border border-zinc-100 p-12 shadow-sm flex flex-col h-[600px]">
              <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-12">Fulfillment Cycle</h3>
              
              <div className="space-y-10 flex-1 overflow-y-auto pr-2 scrollbar-hide">
                 {[
                   { label: "New Order Processing", status: "Active", time: "12m Ago", color: "text-blue-500", icon: Clock },
                   { label: "Inventory Synchronization", status: "Success", time: "1h Ago", color: "text-green-500", icon: CheckCircle2 },
                   { label: "Warehouse Dispatch", status: "Queued", time: "2h Ago", color: "text-zinc-400", icon: Briefcase },
                   { label: "Quality Assurance Scan", status: "In-Progress", time: "30m Ago", color: "text-amber-500", icon: TrendingUp },
                   { label: "Payout Verification", status: "Verified", time: "5h Ago", color: "text-green-500", icon: DollarSign },
                 ].map((op, i) => (
                    <div key={i} className="group cursor-pointer">
                       <div className="flex items-center gap-6 p-6 rounded-[35px] border border-zinc-50 hover:border-black hover:bg-white hover:shadow-2xl hover:shadow-black/5 transition-all duration-300">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center bg-zinc-50 group-hover:bg-zinc-900 group-hover:text-white transition-all ${op.color}`}>
                             <op.icon size={22} />
                          </div>
                          <div className="flex-1 space-y-1">
                             <h4 className="text-[11px] font-black uppercase tracking-widest">{op.label}</h4>
                             <div className="flex items-center gap-3">
                                <span className={`text-[9px] font-bold uppercase ${op.color}`}>{op.status}</span>
                                <span className="text-[9px] text-zinc-300 font-bold uppercase tracking-widest">{op.time}</span>
                             </div>
                          </div>
                          <ChevronRight size={18} className="text-zinc-200 group-hover:text-black transition-colors" />
                       </div>
                    </div>
                 ))}
              </div>

              <button className="w-full h-16 bg-zinc-50 border border-zinc-100 rounded-3xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-500 mt-10">
                 System Console Details
              </button>
           </div>
        </div>

        {/* Global Transaction Archive Table */}
        <div className="bg-white rounded-[60px] border border-zinc-100 overflow-hidden shadow-sm">
           <div className="p-12 border-b border-zinc-50 flex items-center justify-between">
              <div>
                 <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Global Archive</h3>
                 <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-2">Historical transaction ledger for current cycle</p>
              </div>
              <div className="flex items-center gap-3">
                 <button className="p-4 bg-zinc-50 rounded-2xl border border-zinc-100 hover:bg-white hover:border-black transition-all">
                    <Filter size={20} />
                 </button>
                 <button className="h-14 px-8 bg-zinc-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl transition-all">
                    Search Registry
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-[#fcfcfc] border-b border-zinc-50">
                    <tr>
                       <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Order Ref</th>
                       <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Merchant Client</th>
                       <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Gross Vol</th>
                       <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Status Protocol</th>
                       <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Timestamp</th>
                       <th className="px-12 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-50">
                    {[
                      { id: "#ORD-9912", user: "Vikram Malhotra", total: "₹12,400", status: "Dispatched", date: "Just Now", color: "bg-blue-500" },
                      { id: "#ORD-8823", user: "Zoya Khan", total: "₹4,200", status: "Delivered", date: "1h Ago", color: "bg-green-500" },
                      { id: "#ORD-7734", user: "Rohan Gupta", total: "₹8,900", status: "Processing", date: "3h Ago", color: "bg-amber-500" },
                      { id: "#ORD-6645", user: "Sara Ali", total: "₹21,000", status: "Returned", date: "5h Ago", color: "bg-red-500" },
                      { id: "#ORD-5556", user: "Aryan Singh", total: "₹3,150", status: "Dispatched", date: "6h Ago", color: "bg-blue-500" },
                    ].map((row, i) => (
                      <tr key={i} className="group hover:bg-[#fafafa] transition-all duration-300">
                         <td className="px-12 py-10">
                            <span className="text-[12px] font-black italic tracking-tighter uppercase text-zinc-900 group-hover:underline underline-offset-4 decoration-2 decoration-black/20">
                               {row.id}
                            </span>
                         </td>
                         <td className="px-12 py-10">
                            <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center font-black text-zinc-900 group-hover:bg-white transition-all">
                                  {row.user[0]}
                               </div>
                               <span className="text-[11px] font-black uppercase tracking-tight text-zinc-900">{row.user}</span>
                            </div>
                         </td>
                         <td className="px-12 py-10">
                            <span className="text-[12px] font-bold text-zinc-600 group-hover:text-black transition-colors">{row.total}</span>
                         </td>
                         <td className="px-12 py-10">
                            <div className="flex items-center gap-3">
                               <div className={`w-2.5 h-2.5 rounded-full ${row.color} shadow-lg shadow-${row.color.split('-')[1]}-500/20`} />
                               <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">{row.status}</span>
                            </div>
                         </td>
                         <td className="px-12 py-10">
                            <span className="text-[10px] font-bold text-zinc-400 border border-zinc-100 bg-zinc-50 px-3 py-1.5 rounded-full uppercase tracking-tighter group-hover:bg-white transition-colors">
                               {row.date}
                            </span>
                         </td>
                         <td className="px-12 py-10 text-right">
                            <button className="p-3 hover:bg-black hover:text-white rounded-2xl transition-all border border-transparent hover:shadow-2xl hover:scale-110 active:scale-95 duration-300 text-zinc-400">
                               <ChevronRight size={20} />
                            </button>
                         </td>
                      </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="p-10 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
              <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Page 01 of 24 — Showing latest 05 entries</p>
              <div className="flex items-center gap-2">
                 <button className="h-10 px-6 bg-white border border-zinc-200 rounded-xl text-[9px] font-black uppercase hover:bg-zinc-100 transition-all opacity-50 cursor-not-allowed">Previous Page</button>
                 <button className="h-10 px-6 bg-white border border-zinc-200 rounded-xl text-[9px] font-black uppercase hover:bg-zinc-100 hover:border-black transition-all shadow-sm">Next Protocol</button>
              </div>
           </div>
        </div>
      </div>
    </SellerLayout>
  );
}

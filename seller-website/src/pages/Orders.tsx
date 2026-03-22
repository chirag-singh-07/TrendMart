import { useState } from "react";
import SellerLayout from "@/components/layout/SellerLayout";
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Truck, 
  CheckCircle2, 
  XCircle, 
  Clock,
  ExternalLink,
  PackageCheck,
  CalendarDays,
  MoreVertical,
  ArrowRight
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function Orders() {
  const [filterStatus, setFilterStatus] = useState("All Orders");

  const orders = [
    { 
      id: "ORD-9912", 
      customer: "Vikram Malhotra", 
      email: "vikram@example.com", 
      total: "₹12,400", 
      items: 3, 
      status: "Dispatched", 
      date: "Just Now", 
      method: "Priority Shipping",
      color: "blue"
    },
    { 
      id: "ORD-8823", 
      customer: "Zoya Khan", 
      email: "zoya@example.com", 
      total: "₹4,200", 
      items: 1, 
      status: "Delivered", 
      date: "1h Ago", 
      method: "Standard Delivery",
      color: "green"
    },
    { 
      id: "ORD-7734", 
      customer: "Rohan Gupta", 
      email: "rohan@example.com", 
      total: "₹8,900", 
      items: 2, 
      status: "Processing", 
      date: "3h Ago", 
      method: "Express Shipping",
      color: "amber"
    },
    { 
      id: "ORD-6645", 
      customer: "Sara Ali", 
      email: "sara@example.com", 
      total: "₹21,000", 
      items: 5, 
      status: "Cancelled", 
      date: "5h Ago", 
      method: "Priority Shipping",
      color: "red"
    },
  ];

  const statCards = [
    { label: "Incoming Stream", value: "24", icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Dispatch Pending", value: "08", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Global Completed", value: "156", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    { label: "Return Rate", value: "1.2%", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
  ];

  return (
    <SellerLayout>
      <div className="space-y-12 animate-in fade-in duration-1000">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500">
               <PackageCheck size={12} className="text-black" />
               Merchant Fulfillment
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              Transaction Archive
            </h1>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
               Real-time checkout monitoring and lifecycle tracking
            </p>
          </div>
          <div className="flex items-center gap-4">
             <button className="h-14 px-8 bg-zinc-100 border border-zinc-200 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-3">
                <CalendarDays size={18} />
                Export Manifest
             </button>
             <button className="h-14 px-10 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 hover:shadow-2xl hover:shadow-black/20 transition-all">
                Registry Search
             </button>
          </div>
        </div>

        {/* Orders Stream Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {statCards.map((stat, i) => (
             <div key={i} className="p-10 bg-white rounded-[45px] border border-zinc-100 shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden relative">
                <div className="flex justify-between items-start mb-8">
                   <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:bg-zinc-900 group-hover:text-white transition-all`}>
                      <stat.icon size={24} />
                   </div>
                   <ArrowRight size={18} className="text-zinc-200 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                </div>
                <div>
                   <h2 className="text-4xl font-black tracking-tighter italic mb-1 leading-none">{stat.value}</h2>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{stat.label}</p>
                </div>
             </div>
           ))}
        </div>

        {/* Global Filter Bar */}
        <div className="bg-white rounded-[40px] border border-zinc-100 p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
           <div className="flex flex-wrap gap-2 flex-1">
              {["All Orders", "Processing", "Dispatched", "Delivered", "Cancelled"].map((status) => (
                 <button 
                   key={status}
                   onClick={() => setFilterStatus(status)}
                   className={`h-11 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     filterStatus === status 
                       ? "bg-black text-white shadow-xl shadow-black/10" 
                       : "bg-zinc-50 text-zinc-400 hover:bg-zinc-100 hover:text-black"
                   }`}
                 >
                    {status}
                 </button>
              ))}
           </div>
           
           <div className="flex items-center gap-3 w-full md:w-[350px]">
              <div className="flex-1 relative">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={16} />
                 <input 
                    type="text" 
                    placeholder="Ref ID / Customer" 
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-50 border border-zinc-50 focus:outline-none focus:bg-white focus:border-zinc-200 text-[10px] font-black uppercase tracking-widest transition-all"
                 />
              </div>
              <button className="h-12 w-12 bg-zinc-50 border border-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 hover:bg-black hover:text-white transition-all cursor-pointer">
                 <Filter size={18} />
              </button>
           </div>
        </div>

        {/* Global Transaction Archive */}
        <div className="bg-white rounded-[55px] border border-zinc-100 overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-[#fcfcfc] border-b border-zinc-50">
                    <tr>
                       <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Merchant Reference</th>
                       <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Client Profile</th>
                       <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Execution Status</th>
                       <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Gross Amount</th>
                       <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Dispatch Log</th>
                       <th className="px-10 py-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Ops</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-50">
                    {orders.map((order, i) => (
                       <tr key={i} className="group hover:bg-[#fafafa] transition-all duration-300">
                          <td className="px-10 py-10">
                             <div className="space-y-1">
                                <span className="text-[12px] font-black italic tracking-tighter uppercase text-zinc-900 group-hover:underline decoration-2 decoration-black/20 underline-offset-4">
                                   {order.id}
                                </span>
                                <div className="flex items-center gap-2 text-[9px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                                   <ShoppingCart size={10} /> {order.items} Items
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-10">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-100 flex items-center justify-center font-black text-black group-hover:bg-white border border-transparent group-hover:border-zinc-100 transition-all">
                                   {order.customer[0]}
                                </div>
                                <div className="space-y-0.5">
                                   <p className="text-[11px] font-black uppercase tracking-tight text-zinc-900">{order.customer}</p>
                                   <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{order.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-10">
                             <div className="inline-flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full bg-${order.color}-500 shadow-xl shadow-${order.color}-500/30 group-hover:scale-125 transition-transform duration-500`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">{order.status}</span>
                             </div>
                          </td>
                          <td className="px-10 py-10">
                             <span className="text-[13px] font-black italic tracking-tighter text-zinc-900">{order.total}</span>
                          </td>
                          <td className="px-10 py-10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                             <div className="flex items-center gap-2">
                                <Truck size={12} className="text-zinc-300" />
                                {order.method}
                             </div>
                             <div className="mt-1 flex items-center gap-2 text-[9px] text-zinc-300">
                                <ExternalLink size={10} /> Track 29910FX
                             </div>
                          </td>
                          <td className="px-10 py-10 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button className="h-11 px-6 bg-zinc-50 border border-zinc-100 rounded-xl text-[9px] font-black uppercase hover:bg-black hover:text-white hover:border-black transition-all">View Dossier</button>
                                <DropdownMenu>
                                   <DropdownMenuTrigger asChild>
                                      <button className="h-11 w-11 flex items-center justify-center bg-zinc-50 border border-zinc-100 rounded-xl text-zinc-400 hover:text-black hover:border-black hover:bg-white transition-all">
                                         <MoreVertical size={18} />
                                      </button>
                                   </DropdownMenuTrigger>
                                   <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-zinc-50 shadow-2xl">
                                      <DropdownMenuItem className="p-3 rounded-xl gap-3 text-[10px] font-black uppercase tracking-widest">
                                         <Truck size={16} className="text-blue-500" /> Update Transit Log
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="p-3 rounded-xl gap-3 text-[10px] font-black uppercase tracking-widest">
                                         <CheckCircle2 size={16} className="text-green-500" /> Finalize Transaction
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="p-3 rounded-xl gap-3 text-[10px] font-black uppercase tracking-widest text-red-500 focus:bg-red-50">
                                         <XCircle size={16} /> Mark as Anomaly
                                      </DropdownMenuItem>
                                   </DropdownMenuContent>
                                </DropdownMenu>
                             </div>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           <div className="p-10 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Auto-Scaling Live Feed</span>
                 <div className="flex gap-1">
                    {[1, 2, 3].map(d => <div key={d} className="w-1.5 h-1.5 rounded-full bg-green-500" />)}
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="h-10 px-6 bg-white border border-zinc-200 rounded-xl text-[9px] font-black uppercase hover:border-black transition-all">Previous Sync</button>
                 <button className="h-10 px-6 bg-white border border-zinc-200 rounded-xl text-[9px] font-black uppercase hover:border-black transition-all">Next Sync</button>
              </div>
           </div>
        </div>
      </div>
    </SellerLayout>
  );
}

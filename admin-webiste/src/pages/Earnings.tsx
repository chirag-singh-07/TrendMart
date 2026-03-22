import React, { useState, useEffect } from "react";
import {
  DollarSign,
  TrendingUp,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Loader2,
  Calendar,
} from "lucide-react";
import { adminOrderService } from "../services/adminOrderService";

const Earnings: React.FC = () => {
  const [revenue, setRevenue] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRevenue = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminOrderService.getRevenue();
      setRevenue(data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Only Super Admins can access this financial report.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  if (loading && !revenue) {
     return (
       <div className="flex flex-col items-center justify-center py-40">
          <Loader2 size={40} className="animate-spin text-zinc-200" />
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mt-6">Crunching financial data...</p>
       </div>
     );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-zinc-200 shadow-sm mx-4">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-[30px] flex items-center justify-center mb-6">
          <DollarSign size={40} />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tighter italic mb-2 text-zinc-900">Access Restricted</h2>
        <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest text-center px-10">{error}</p>
        <button 
          onClick={fetchRevenue}
          className="mt-8 px-8 py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all"
        >
           Try Re-Authentication
        </button>
      </div>
    );
  }

  // Formatting helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateStr: string) => {
     const date = new Date(dateStr);
     return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic text-zinc-900">Earnings & Revenue</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live platform commission and financial insights
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchRevenue}
            className="px-5 py-3 border border-zinc-200 bg-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Data
          </button>
          <button className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 shadow-xl shadow-black/10">
            <Download size={18} /> Export Sheet
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-black text-white rounded-[45px] p-12 relative overflow-hidden group shadow-2xl shadow-black/20">
          <div className="relative z-10">
            <p className="text-[11px] font-black uppercase tracking-[0.2em] opacity-50 mb-6">Net Platform Commission</p>
            <h2 className="text-6xl font-black tracking-tighter italic mb-6">
              {formatCurrency(revenue?.totalCommission)}
            </h2>
            <div className="flex items-center gap-3 text-[11px] font-bold">
              <span className="text-green-400 flex items-center gap-1.5 bg-green-400/10 px-3 py-1.5 rounded-full">
                <ArrowUpRight size={14} /> +100%
              </span>
              <span className="opacity-40 uppercase tracking-wider">Historical Total</span>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 p-12 opacity-[0.05] group-hover:scale-110 group-hover:opacity-[0.08] transition-all duration-700">
            <DollarSign size={240} />
          </div>
        </div>

        <div className="bg-white rounded-[45px] border border-zinc-200 p-12 flex flex-col justify-between hover:border-black transition-colors duration-500 shadow-sm group">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 group-hover:text-zinc-600 transition-colors">Paid Transactions</p>
            <h2 className="text-5xl font-black tracking-tighter italic text-zinc-900">{revenue?.totalOrders || 0}</h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold mt-8">
            <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
               <TrendingUp size={18} />
            </div>
            <span className="text-zinc-500 uppercase">Successful Checkouts</span>
          </div>
        </div>

        <div className="bg-white rounded-[45px] border border-zinc-200 p-12 flex flex-col justify-between hover:border-black transition-colors duration-500 shadow-sm group">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-6 group-hover:text-zinc-600 transition-colors">Average Order Worth</p>
            <h2 className="text-5xl font-black tracking-tighter italic text-zinc-900">{formatCurrency(revenue?.averageOrderValue)}</h2>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold mt-8">
            <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center text-zinc-400 group-hover:bg-zinc-900 group-hover:text-white transition-all">
               <ArrowUpRight size={18} />
            </div>
            <span className="text-zinc-500 uppercase">Gross Ticket Size</span>
          </div>
        </div>
      </div>

      {/* Revenue Graph */}
      <div className="bg-white rounded-[50px] border border-zinc-200 p-12 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
             <h3 className="text-2xl font-black uppercase tracking-tighter italic text-zinc-900">Revenue Performance</h3>
             <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">Daily platform commission metrics</p>
          </div>
          <div className="flex items-center gap-3 bg-zinc-50 p-2 rounded-2xl border border-zinc-100">
             <button className="px-6 py-2.5 bg-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-sm">Daily</button>
             <button className="px-6 py-2.5 text-zinc-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-black">Weekly</button>
             <button className="px-6 py-2.5 text-zinc-400 rounded-xl text-[9px] font-black uppercase tracking-widest hover:text-black">Monthly</button>
          </div>
        </div>

        {/* Dynamic Chart */}
        <div className="h-80 flex items-end justify-between gap-3 px-2 mb-10 overflow-hidden">
           {revenue?.dailyBreakdown?.length > 0 ? (
             revenue.dailyBreakdown.map((item: any, i: number) => {
               const max = Math.max(...revenue.dailyBreakdown.map((d: any) => d.amount), 1);
               const height = (item.amount / max) * 100;
               return (
                 <div key={i} className="flex-1 group relative h-full flex items-end">
                    <div 
                      className="w-full rounded-t-2xl transition-all duration-700 bg-zinc-100 group-hover:bg-black group-hover:shadow-[0_0_30px_rgba(0,0,0,0.1)]"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    />
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black text-white text-[9px] font-black py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 z-10 whitespace-nowrap shadow-xl">
                       {formatCurrency(item.amount)}
                    </div>
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[8px] font-black text-zinc-400 uppercase tracking-tighter text-center whitespace-nowrap group-hover:text-black transition-colors">
                       {formatDate(item.date)}
                    </div>
                 </div>
               );
             })
           ) : (
             <div className="w-full flex flex-col items-center justify-center gap-4 text-zinc-300">
                <Calendar size={60} strokeWidth={1} />
                <p className="text-[10px] font-black uppercase tracking-widest">Awaiting sales data...</p>
             </div>
           )}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-white rounded-[50px] border border-zinc-200 overflow-hidden shadow-sm">
         <div className="p-10 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/20">
            <div>
               <h3 className="text-xl font-black uppercase tracking-tighter italic text-zinc-900">Recent Profit Entries</h3>
               <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Direct attribution from successful orders</p>
            </div>
            <button className="p-4 bg-white border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-colors shadow-sm">
               <Filter size={20} className="text-zinc-600" />
            </button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead className="bg-zinc-50/50">
                  <tr>
                     <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center w-10 border-r border-zinc-100">#</th>
                     <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Order Ref</th>
                     <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Transaction Value</th>
                     <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Timestamp</th>
                     <th className="p-8 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Net Profit</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-50">
                  {revenue?.recentTransactions?.length > 0 ? (
                    revenue.recentTransactions.map((txn: any, i: number) => (
                      <tr key={i} className="hover:bg-zinc-50/80 transition-all group">
                         <td className="p-8 text-[11px] font-black text-zinc-300 text-center border-r border-zinc-50 group-hover:text-black transition-colors">{i + 1}</td>
                         <td className="p-8">
                            <div className="flex items-center gap-3">
                               <div className="w-2 h-2 rounded-full bg-green-500" />
                               <span className="text-[12px] font-black italic tracking-tighter uppercase text-zinc-900">#{txn.id}</span>
                            </div>
                         </td>
                         <td className="p-8 text-[12px] font-bold text-zinc-600">{formatCurrency(txn.amount)}</td>
                         <td className="p-8 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            {new Date(txn.date).toLocaleString("en-US", { 
                               month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" 
                            })}
                         </td>
                         <td className="p-8 text-right">
                            <span className="text-[15px] font-black text-zinc-900 bg-zinc-50 px-5 py-2 rounded-2xl border border-zinc-100 group-hover:bg-black group-hover:text-white transition-all duration-300">
                               +{formatCurrency(txn.commission)}
                            </span>
                         </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                       <td colSpan={5} className="p-20 text-center">
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">No recent transactions recorded</p>
                       </td>
                    </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
};

export default Earnings;

import { useState } from "react";
import SellerLayout from "@/components/layout/SellerLayout";
import { 
  TrendingUp, 
  Calendar, 
  Download, 
  CornerUpRight,
  ShieldCheck,
  CreditCard,
  History,
  ChevronRight,
  DollarSign
} from "lucide-react";

export default function Earnings() {
  const [balance] = useState("₹4,52,390");

  const transactions = [
    { id: "TXN-88219", type: "Settlement", amount: "₹12,400", status: "Success", date: "Just Now", color: "green" },
    { id: "TXN-77318", type: "Processing Fee", amount: "-₹320", status: "Deducted", date: "2h Ago", color: "red" },
    { id: "TXN-66417", type: "Ad Campaign", amount: "-₹1,500", status: "Deducted", date: "5h Ago", color: "red" },
    { id: "TXN-55516", type: "Withdrawal", amount: "-₹45,000", status: "Completed", date: "1d Ago", color: "zinc" },
    { id: "TXN-44615", type: "Sale Credit", amount: "₹8,900", status: "Success", date: "1d Ago", color: "green" },
    { id: "TXN-33714", type: "Sale Credit", amount: "₹21,000", status: "Success", date: "2d Ago", color: "green" },
  ];

  return (
    <SellerLayout>
      <div className="space-y-12 animate-in fade-in duration-1000">
        {/* Financial Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-widest border border-black shadow-lg shadow-black/10">
               <ShieldCheck size={12} className="text-green-500" />
               Merchant Treasury Verified
            </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              Financial Asset Monitor
            </h1>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Real-time capital clearing and payout lifecycle</p>
          </div>
          <div className="flex items-center gap-4">
             <button className="h-14 px-8 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all flex items-center gap-3 shadow-2xl shadow-black/20 group">
                <CornerUpRight size={18} className="group-hover:translate-y-[-2px] group-hover:translate-x-[2px] transition-transform" />
                Initiate Withdrawal
             </button>
          </div>
        </div>

        {/* Global Capital Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
           {/* Primary Wallet Control */}
           <div className="lg:col-span-2 bg-black text-white rounded-[55px] p-12 shadow-2xl shadow-black/20 flex flex-col justify-between h-[500px] relative overflow-hidden group">
              <div className="relative z-10 flex justify-between items-start">
                 <div className="space-y-3">
                    <p className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Available Principal</p>
                    <h2 className="text-7xl font-black italic tracking-tighter leading-none group-hover:scale-105 transition-transform duration-700">{balance}</h2>
                 </div>
                 <div className="w-16 h-10 bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                    <CreditCard size={24} className="text-white/40" />
                 </div>
              </div>

              <div className="relative z-10 grid grid-cols-3 gap-8 pt-12 border-t border-white/10">
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Net 30 Profit</p>
                    <p className="text-2xl font-black italic tracking-tight">+₹1.2L</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Platform Comms</p>
                    <p className="text-2xl font-black italic tracking-tight">₹4,200</p>
                 </div>
                 <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-2">Pending Clear</p>
                    <p className="text-2xl font-black italic tracking-tight">₹18,500</p>
                 </div>
              </div>

              {/* Background Accents */}
              <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-zinc-800 rounded-full blur-[100px] animate-pulse" />
              <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-white/5 rounded-full blur-[120px]" />
           </div>

           {/* Performance Milestone */}
           <div className="bg-white rounded-[55px] border border-zinc-100 p-12 shadow-sm flex flex-col justify-between h-[500px]">
              <div className="space-y-12">
                 <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic">Growth Metrics</h3>
                    <div className="p-3 bg-zinc-50 rounded-2xl">
                       <TrendingUp size={22} className="text-green-500" />
                    </div>
                 </div>
                 
                 <div className="space-y-8">
                    <div className="space-y-4">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-zinc-400">Monthly Target</span>
                          <span className="text-black italic">₹5,00,000</span>
                       </div>
                       <div className="h-4 bg-zinc-50 rounded-full overflow-hidden border border-zinc-100 flex items-center p-1">
                          <div className="h-full bg-black rounded-full transition-all duration-1000" style={{ width: '84%' }} />
                       </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                       <div className="p-6 bg-zinc-50 rounded-[30px] border border-zinc-50">
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Total Cleared</p>
                          <p className="text-xl font-black italic tracking-tight mt-1">₹3.8L</p>
                       </div>
                       <div className="p-6 bg-green-50 rounded-[30px] border border-green-100">
                          <p className="text-[9px] font-black uppercase tracking-widest text-green-600">ROI Accuracy</p>
                          <p className="text-xl font-black italic tracking-tight mt-1">98.4%</p>
                       </div>
                    </div>
                 </div>
              </div>

              <button className="w-full h-16 bg-zinc-950 text-white rounded-3xl text-[10px] font-black uppercase tracking-widest hover:shadow-2xl transition-all">
                 Review Capital Forecast
              </button>
           </div>
        </div>

        {/* Financial Registry & Transaction History */}
        <div className="bg-white rounded-[60px] border border-zinc-100 overflow-hidden shadow-sm">
           <div className="p-10 border-b border-zinc-50 flex items-center justify-between">
              <div className="flex items-center gap-6">
                 <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-400">
                    <History size={24} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter italic leading-none">Global Registry</h3>
                    <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest mt-2">Authenticated transaction history for period 2026</p>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <button className="h-12 px-6 bg-zinc-50 border border-zinc-100 rounded-xl hover:bg-white hover:border-black transition-all">
                    <Download size={18} />
                 </button>
                 <button className="h-12 px-8 bg-zinc-950 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:shadow-xl transition-all">
                    Search Archive
                 </button>
              </div>
           </div>

           <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-[#fcfcfc] border-b border-zinc-50">
                    <tr>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Reference ID</th>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Asset Type</th>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Gross Volume</th>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Protocol Status</th>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Timestamp</th>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 text-right">Verification</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-50">
                    {transactions.map((txn, i) => (
                       <tr key={i} className="group hover:bg-[#fafafa] transition-all duration-300">
                          <td className="px-10 py-8">
                             <span className="text-[11px] font-black italic tracking-tight text-zinc-900 group-hover:underline underline-offset-4 decoration-black/20 decoration-2">
                                {txn.id}
                             </span>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center font-black text-zinc-400 group-hover:bg-white transition-all">
                                   {txn.type[0]}
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">{txn.type}</span>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <span className={`text-[12px] font-black italic tracking-tighter ${txn.amount.startsWith('-') ? 'text-red-500' : 'text-zinc-900 group-hover:text-green-600 transition-colors'}`}>
                                {txn.amount}
                             </span>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full bg-${txn.color}-500 shadow-lg shadow-${txn.color}-500/20 group-hover:scale-150 transition-transform`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">{txn.status}</span>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-[10px] font-bold text-zinc-400 border-zinc-100 uppercase tracking-tighter">
                             {txn.date}
                          </td>
                          <td className="px-10 py-8 text-right">
                             <button className="p-3 hover:bg-white hover:text-black rounded-xl transition-all border border-zinc-100/0 hover:border-zinc-200 text-zinc-300">
                                <ChevronRight size={18} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="p-10 bg-zinc-50/50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="flex items-center gap-2 px-3 py-1 bg-white border border-zinc-100 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Fulfillment Sync Active</span>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="h-10 px-6 bg-white border border-zinc-200 rounded-xl text-[9px] font-black uppercase hover:border-black transition-all">Load More Records</button>
                 <button className="h-10 px-10 bg-black text-white rounded-xl text-[9px] font-black uppercase hover:shadow-xl transition-all">Audit Logs</button>
              </div>
           </div>
        </div>
      </div>
    </SellerLayout>
  );
}

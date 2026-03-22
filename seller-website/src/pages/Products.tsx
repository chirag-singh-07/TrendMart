import { useState } from "react";
import SellerLayout from "@/components/layout/SellerLayout";
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit3, 
  Trash2, 
  ArrowUpRight,
  Archive,
  Zap,
  Tag
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");

  const products = [
    { 
      id: "PRD-001", 
      name: "Classic Leather Sneaker", 
      category: "Footwear", 
      price: "₹4,999", 
      stock: 45, 
      sales: 124, 
      status: "Active", 
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop"
    },
    { 
      id: "PRD-002", 
      name: "Minimalist Quartz Watch", 
      category: "Accessories", 
      price: "₹8,400", 
      stock: 12, 
      sales: 56, 
      status: "Low Stock", 
      rating: 4.5,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2099&auto=format&fit=crop"
    },
    { 
      id: "PRD-003", 
      name: "Noise Cancelling Headphones", 
      category: "Electronics", 
      price: "₹18,200", 
      stock: 89, 
      sales: 231, 
      status: "Active", 
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop"
    },
    { 
      id: "PRD-004", 
      name: "Slim Fit Cotton Chino", 
      category: "Apparel", 
      price: "₹2,150", 
      stock: 0, 
      sales: 312, 
      status: "Out of Stock", 
      rating: 4.2,
      image: "https://images.unsplash.com/photo-1475178626620-a4d074967452?q=80&w=1972&auto=format&fit=crop"
    },
  ];

  return (
    <SellerLayout>
      <div className="space-y-12 animate-in fade-in duration-1000">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-100 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                <Tag size={12} className="text-black" />
                Inventory Control
             </div>
            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
              Merchant Listings
            </h1>
            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
              Scale your catalog across the global network
            </p>
          </div>
          <div className="flex items-center gap-4">
             <button className="h-14 px-8 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-900 transition-all flex items-center gap-3 shadow-2xl shadow-black/20">
                <Plus size={18} />
                Add New Product
             </button>
          </div>
        </div>

        {/* Global Inventory Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: "Active Listings", value: "142", icon: Zap, color: "text-green-500" },
             { label: "Stock Value", value: "₹45.2L", icon: Package, color: "text-blue-500" },
             { label: "Archived Items", value: "12", icon: Archive, color: "text-zinc-400" },
           ].map((stat, i) => (
             <div key={i} className="p-8 bg-white rounded-[35px] border border-zinc-100 shadow-sm hover:shadow-xl transition-all flex items-center gap-6 group">
                <div className={`w-14 h-14 rounded-2xl bg-zinc-50 flex items-center justify-center ${stat.color} group-hover:bg-zinc-900 transition-all`}>
                   <stat.icon size={22} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">{stat.label}</p>
                   <h2 className="text-2xl font-black italic tracking-tight">{stat.value}</h2>
                </div>
             </div>
           ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-[35px] border border-zinc-100 p-6 flex flex-col md:flex-row items-center gap-6 shadow-sm">
           <div className="flex-1 relative w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
              <input 
                 type="text" 
                 placeholder="Search SKU, Name, Category..." 
                 className="w-full h-14 pl-14 pr-6 rounded-2xl bg-zinc-50/50 border border-zinc-50 focus:outline-none focus:bg-white focus:border-black text-[11px] font-black uppercase tracking-widest transition-all"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-3 w-full md:w-auto">
              <button className="h-14 px-6 md:px-8 bg-white border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-zinc-50 transition-all">
                 <Filter size={18} /> Filters
              </button>
              <button className="h-14 px-6 md:px-8 bg-white border border-zinc-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-50 transition-all">
                 Export List
              </button>
           </div>
        </div>

        {/* Product Matrix Table */}
        <div className="bg-white rounded-[45px] border border-zinc-100 overflow-hidden shadow-sm">
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead className="bg-[#fcfcfc] border-b border-zinc-50">
                    <tr>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">Identity</th>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">Class</th>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">Gross Price</th>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">Units Avail</th>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">Sales Vol</th>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">Status</th>
                       <th className="px-10 py-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-zinc-50">
                    {products.map((prd, i) => (
                       <tr key={i} className="group hover:bg-[#fafafa] transition-all duration-300">
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-5">
                                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-50 border border-zinc-100 shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform">
                                   <img src={prd.image} alt={prd.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="space-y-1">
                                   <p className="text-[11px] font-black uppercase tracking-tight text-zinc-900 leading-tight">
                                      {prd.name}
                                   </p>
                                   <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest italic">{prd.id}</p>
                                </div>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100 group-hover:bg-white transition-all">
                                {prd.category}
                             </span>
                          </td>
                          <td className="px-10 py-8">
                             <span className="text-[11px] font-black italic tracking-tighter text-zinc-900">{prd.price}</span>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${prd.stock > 10 ? 'bg-green-500' : prd.stock > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                <span className="text-[11px] font-black text-zinc-600">{prd.stock} Units</span>
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-2 group/sales">
                                <span className="text-[11px] font-black text-zinc-900">{prd.sales}</span>
                                <ArrowUpRight size={12} className="text-green-500 opacity-0 group-hover/sales:opacity-100 transition-all translate-y-1 group-hover/sales:translate-y-0" />
                             </div>
                          </td>
                          <td className="px-10 py-8">
                             <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${prd.status === 'Active' ? 'bg-green-500' : 'bg-zinc-400'}`} />
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-900">{prd.status}</span>
                             </div>
                          </td>
                          <td className="px-10 py-8 text-right">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                   <button className="p-3 hover:bg-black hover:text-white rounded-2xl transition-all text-zinc-400">
                                      <MoreHorizontal size={20} />
                                   </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl p-2 border-zinc-100 animate-in zoom-in-95 duration-200">
                                   <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-400 px-4 py-3">Management</DropdownMenuLabel>
                                   <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3 text-[10px] font-black uppercase tracking-widest">
                                      <Eye size={16} /> Preview Listing
                                   </DropdownMenuItem>
                                   <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3 text-[10px] font-black uppercase tracking-widest text-blue-600 focus:bg-blue-50">
                                      <Edit3 size={16} /> Modify Content
                                   </DropdownMenuItem>
                                   <DropdownMenuSeparator className="bg-zinc-50 mx-2" />
                                   <DropdownMenuItem className="p-3 rounded-xl cursor-pointer gap-3 text-[10px] font-black uppercase tracking-widest text-red-600 focus:bg-red-50">
                                      <Trash2 size={16} /> Archive Product
                                   </DropdownMenuItem>
                                </DropdownMenuContent>
                             </DropdownMenu>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
           
           <div className="p-10 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between">
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest italic">Inventory Matrix Version 2.0.4</p>
              <div className="flex items-center gap-3">
                 <button className="h-12 px-6 bg-white border border-zinc-200 rounded-xl text-[10px] font-black uppercase hover:border-black transition-all shadow-sm">Identity Scan</button>
                 <button className="h-12 px-6 bg-zinc-900 text-white rounded-xl text-[10px] font-black uppercase hover:shadow-xl transition-all">Reload Matrix</button>
              </div>
           </div>
        </div>
      </div>
    </SellerLayout>
  );
}

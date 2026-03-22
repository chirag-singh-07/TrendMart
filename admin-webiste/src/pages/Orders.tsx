import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Clock,
  Truck,
  Package,
  XCircle,
  Undo2,
  Receipt,
} from "lucide-react";
import { adminOrderService, type Order } from "../services/adminOrderService";

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const params: any = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus !== "all") params.status = filterStatus;

      const data = await adminOrderService.getAll(params);
      setOrders(data.orders);
    } catch {
      setError("Failed to fetch order history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchOrders();
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await adminOrderService.updateStatus(id, status);
      showToast(`Order marked as ${status}`);
      if (selectedOrder?._id === id) {
        const updated = await adminOrderService.getById(id);
        setSelectedOrder(updated);
      }
      fetchOrders();
    } catch (err: any) {
      showToast(err.response?.data?.message || "Status update failed", "error");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock size={16} />;
      case "confirmed": return <CheckCircle size={16} />;
      case "processing": return <Package size={16} />;
      case "shipped": return <Truck size={16} />;
      case "delivered": return <CheckCircle size={16} />;
      case "cancelled": return <XCircle size={16} />;
      case "returned": return <Undo2 size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending": return "bg-orange-50 text-orange-600 border-orange-100";
      case "confirmed": return "bg-blue-50 text-blue-600 border-blue-100";
      case "processing": return "bg-zinc-100 text-black border-zinc-200";
      case "shipped": return "bg-black text-white border-black shadow-lg shadow-black/10";
      case "delivered": return "bg-green-50 text-green-600 border-green-100";
      case "cancelled": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-zinc-50 text-zinc-400 border-zinc-100";
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg font-bold text-[11px] uppercase tracking-widest ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.type === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Orders Logistics</h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Track and process shipments efficiently
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={fetchOrders}
            className="px-5 py-3 border border-zinc-200 rounded-xl text-[10px] font-black uppercase hover:bg-zinc-50 transition-all flex items-center gap-2"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Sync Orders
          </button>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 flex flex-col md:flex-row gap-4 shadow-sm shadow-zinc-100">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, User ID..."
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[11px] font-bold uppercase tracking-widest placeholder:text-zinc-400"
          />
        </form>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-12 px-6 rounded-2xl bg-zinc-50 border border-zinc-200 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:border-black"
        >
          <option value="all">Every State</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">In Logistics</option>
          <option value="shipped">On Road</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Modern Table Layout */}
      <div className="bg-white rounded-[40px] border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-50/50 border-b border-zinc-100">
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Official #Order</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Financials</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500">Current Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-zinc-500 text-right">Process</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr><td colSpan={4} className="p-20 text-center"><Loader2 size={40} className="animate-spin text-zinc-200 mx-auto" /></td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={4} className="p-20 text-center"><ShoppingBag size={48} className="text-zinc-100 mx-auto mb-4" /><p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Logistics idle - Incoming 0</p></td></tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="group hover:bg-zinc-50 transition-all cursor-pointer" onClick={() => setSelectedOrder(order)}>
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 bg-zinc-100 group-hover:bg-zinc-900 group-hover:text-white transition-colors`}>
                             <ShoppingBag size={18} />
                          </div>
                          <div>
                             <p className="text-[14px] font-black uppercase tracking-tighter leading-none italic">#{order.orderNumber}</p>
                             <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest mt-1.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                       <p className="text-[13px] font-black text-black">₹{order.totalAmount.toLocaleString()}</p>
                       <p className="text-[9px] font-bold text-zinc-400 uppercase mt-1 tracking-widest flex items-center gap-1.5">
                          <CheckCircle size={10} className={order.paymentStatus === 'paid' ? 'text-green-500' : 'text-orange-500'} />
                          {order.paymentStatus}
                       </p>
                    </td>
                    <td className="p-6">
                       <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${getStatusClass(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          {order.orderStatus}
                       </span>
                    </td>
                    <td className="p-6 text-right">
                       <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => setSelectedOrder(order)}
                            className="w-11 h-11 bg-zinc-50 text-zinc-600 rounded-xl flex items-center justify-center hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
                          >
                             <Eye size={18} />
                          </button>
                          <div className="relative group/actions">
                             <button className="h-11 px-4 bg-zinc-50 border border-zinc-100 text-[9px] font-black uppercase rounded-xl hover:bg-black hover:text-white transition-all">
                                Update
                             </button>
                             <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-2xl shadow-2xl border border-zinc-100 p-2 hidden group-hover/actions:block z-50">
                                {["confirmed", "processing", "shipped", "delivered", "cancelled"].map(st => (
                                   <button 
                                     key={st}
                                     disabled={order.orderStatus === st}
                                     onClick={() => handleStatusUpdate(order._id, st)}
                                     className="w-full text-left p-3 text-[10px] font-black uppercase hover:bg-black hover:text-white rounded-xl disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-zinc-300"
                                   >
                                      Mark {st}
                                   </button>
                                ))}
                             </div>
                          </div>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4">
           <div className="bg-white rounded-[40px] w-full max-w-4xl shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col">
              <div className="p-10 border-b border-zinc-100 flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-[40px]">
                 <div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic italic">Order Info</h2>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">Order Ref: #{selectedOrder.orderNumber}</p>
                 </div>
                 <button onClick={() => setSelectedOrder(null)} className="p-4 bg-zinc-50 rounded-2xl hover:bg-black hover:text-white transition-all">
                    <XCircle size={24} />
                 </button>
              </div>

              <div className="p-10 grid grid-cols-1 md:grid-cols-2 gap-10">
                 {/* Items */}
                 <div className="space-y-6">
                    <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400">Order Manifest</h3>
                    <div className="space-y-4">
                       {selectedOrder.items.map((item: any, idx: number) => (
                         <div key={idx} className="flex gap-4 p-4 bg-zinc-50 border border-zinc-100 rounded-3xl group transition-all hover:bg-white hover:border-black">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center border border-zinc-100 font-bold overflow-hidden">
                               {item.productId?.images?.[0] ? <img src={item.productId.images[0]} alt="" className="w-full h-full object-cover" /> : <Package size={24} className="text-zinc-200" />}
                            </div>
                            <div className="flex-1">
                               <p className="text-[12px] font-black uppercase tracking-tighter">{item.name || 'Product Item'}</p>
                               <p className="text-[10px] font-bold text-zinc-400 mt-1 uppercase">Price: ₹{item.price} × Qty {item.quantity}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-[12px] font-black">₹{item.price * item.quantity}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Customer & Shipping */}
                 <div className="space-y-10">
                    <div>
                       <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-zinc-400 mb-4">Logistics Timeline</h3>
                       <div className="space-y-1 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-100">
                          {["pending", "confirmed", "processing", "shipped", "delivered"].map((st, i) => {
                             const isPast = ["pending", "confirmed", "processing", "shipped", "delivered"].indexOf(selectedOrder.orderStatus) >= i;
                             return (
                               <div key={st} className="flex items-center gap-5 relative group">
                                  <div className={`w-6 h-6 rounded-full border-4 border-white shadow-md z-10 transition-all ${isPast ? 'bg-black scale-110' : 'bg-zinc-100'}`} />
                                  <span className={`text-[10px] font-black uppercase tracking-widest ${isPast ? 'text-black' : 'text-zinc-300'}`}>{st}</span>
                               </div>
                             );
                          })}
                       </div>
                    </div>

                    <div className="bg-zinc-50 rounded-[35px] p-8 border border-zinc-100 space-y-6">
                       <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 flex items-center gap-2"><Receipt size={14} /> Shipping Information</p>
                          <p className="text-[12px] font-bold leading-relaxed">
                             {selectedOrder.shippingAddress?.fullName}<br />
                             {selectedOrder.shippingAddress?.addressLine1}<br />
                             {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} - {selectedOrder.shippingAddress?.pincode}
                          </p>
                       </div>
                       <div className="pt-6 border-t border-zinc-200">
                          <div className="flex justify-between items-center mb-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Total Net</span>
                             <span className="text-2xl font-black italic">₹{selectedOrder.totalAmount.toLocaleString()}</span>
                          </div>
                          <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${selectedOrder.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                             {selectedOrder.paymentStatus} Payment
                          </span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Orders;

import React, { useState } from "react";
import {
  Package,
  Search,
  Filter,
  Download,
  Eye,
  Check,
  Clock,
  Truck,
  MapPin,
  User,
  ShoppingCart,
} from "lucide-react";

interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
  };
  items: number;
  amount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "completed" | "failed";
  date: string;
  deliveryAddress: string;
}

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");

  const orders: Order[] = [
    {
      id: "ORD001",
      customer: { name: "John Doe", email: "john@example.com" },
      items: 3,
      amount: 4599,
      status: "delivered",
      paymentStatus: "completed",
      date: "2024-02-15",
      deliveryAddress: "123 Main St, Mumbai",
    },
    {
      id: "ORD002",
      customer: { name: "Jane Smith", email: "jane@example.com" },
      items: 2,
      amount: 7998,
      status: "shipped",
      paymentStatus: "completed",
      date: "2024-02-20",
      deliveryAddress: "456 Oak Ave, Delhi",
    },
    {
      id: "ORD003",
      customer: { name: "Mike Johnson", email: "mike@example.com" },
      items: 1,
      amount: 2499,
      status: "processing",
      paymentStatus: "completed",
      date: "2024-02-21",
      deliveryAddress: "789 Pine Rd, Bangalore",
    },
    {
      id: "ORD004",
      customer: { name: "Sarah Williams", email: "sarah@example.com" },
      items: 4,
      amount: 9899,
      status: "pending",
      paymentStatus: "pending",
      date: "2024-02-22",
      deliveryAddress: "321 Elm St, Hyderabad",
    },
    {
      id: "ORD005",
      customer: { name: "Robert Brown", email: "robert@example.com" },
      items: 2,
      amount: 5998,
      status: "cancelled",
      paymentStatus: "failed",
      date: "2024-02-10",
      deliveryAddress: "654 Maple Dr, Pune",
    },
  ];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || order.status === filterStatus;
    const matchesPayment =
      filterPayment === "all" || order.paymentStatus === filterPayment;
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getPaymentColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={16} />;
      case "processing":
        return <ShoppingCart size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "delivered":
        return <Check size={16} />;
      case "cancelled":
        return <Package size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">
            Orders Management
          </h1>
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
            Track, manage, and fulfill customer orders
          </p>
        </div>
        <button className="px-6 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center gap-2 w-fit">
          <Download size={18} />
          Export Orders
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 mb-2">
            Total Orders
          </p>
          <p className="text-3xl font-black">{orders.length}</p>
          <p className="text-[9px] text-zinc-500 mt-2">+2 this week</p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-orange-600 mb-2">
            Pending
          </p>
          <p className="text-3xl font-black text-orange-600">
            {orders.filter((o) => o.status === "pending").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-purple-600 mb-2">
            In Transit
          </p>
          <p className="text-3xl font-black text-purple-600">
            {orders.filter((o) => o.status === "shipped").length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-zinc-200 p-4">
          <p className="text-[9px] font-black uppercase tracking-widest text-green-600 mb-2">
            Delivered
          </p>
          <p className="text-3xl font-black text-green-600">
            {orders.filter((o) => o.status === "delivered").length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
              Search Orders
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by order ID or customer name..."
                className="w-full h-11 pl-12 pr-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black focus:bg-white text-[10px] font-bold"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                Order Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold uppercase"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-2 block">
                Payment
              </label>
              <select
                value={filterPayment}
                onChange={(e) => setFilterPayment(e.target.value)}
                className="h-11 px-4 rounded-xl bg-zinc-50 border border-zinc-200 focus:outline-none focus:border-black text-[10px] font-bold uppercase"
              >
                <option value="all">All Payments</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Order ID
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Customer
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Delivery
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Items
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Amount
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Payment
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Date
                </th>
                <th className="text-left py-4 px-6 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                  >
                    <td className="py-4 px-6 font-black text-[10px] uppercase tracking-tighter">
                      {order.id}
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-black text-[10px] uppercase tracking-widest">
                          {order.customer.name}
                        </p>
                        <p className="text-[9px] text-zinc-500">
                          {order.customer.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-2">
                        <MapPin size={14} className="text-zinc-400 mt-0.5" />
                        <p className="text-[9px] text-zinc-600">
                          {order.deliveryAddress}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-bold text-[10px]">
                      {order.items}
                    </td>
                    <td className="py-4 px-6 font-black text-[10px]">
                      ₹{order.amount}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full inline-flex items-center gap-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getPaymentColor(
                          order.paymentStatus
                        )}`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[9px] text-zinc-600">
                      {formatDate(order.date)}
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-2 hover:bg-zinc-100 rounded-lg transition-colors">
                        <Eye size={16} className="text-zinc-600" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center">
                    <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-widest">
                      No orders found
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Info */}
      <div className="flex items-center justify-between text-[10px]">
        <p className="font-bold text-zinc-600 uppercase tracking-widest">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 font-black uppercase text-[9px]">
            Previous
          </button>
          <button className="w-10 h-10 rounded-lg bg-black text-white font-black text-[9px] flex items-center justify-center">
            1
          </button>
          <button className="px-4 py-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 font-black uppercase text-[9px]">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Orders;

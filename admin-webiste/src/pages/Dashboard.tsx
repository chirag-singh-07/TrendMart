import React from "react";
import {
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const Dashboard: React.FC = () => {
  const stats = [
    {
      title: "Total Revenue",
      value: "₹45,23,900",
      change: "+12.5%",
      isPositive: true,
      icon: DollarSign,
      color: "bg-blue-50",
      borderColor: "border-blue-200",
    },
    {
      title: "Total Orders",
      value: "2,543",
      change: "+8.2%",
      isPositive: true,
      icon: ShoppingCart,
      color: "bg-green-50",
      borderColor: "border-green-200",
    },
    {
      title: "Active Users",
      value: "8,234",
      change: "+5.1%",
      isPositive: true,
      icon: Users,
      color: "bg-purple-50",
      borderColor: "border-purple-200",
    },
    {
      title: "Total Products",
      value: "542",
      change: "-2.3%",
      isPositive: false,
      icon: Package,
      color: "bg-orange-50",
      borderColor: "border-orange-200",
    },
  ];

  const recentOrders = [
    {
      id: "#ORD001",
      customer: "John Doe",
      amount: "₹5,299",
      status: "Delivered",
      date: "Today",
    },
    {
      id: "#ORD002",
      customer: "Jane Smith",
      amount: "₹3,899",
      status: "Shipped",
      date: "Today",
    },
    {
      id: "#ORD003",
      customer: "Mike Johnson",
      amount: "₹8,499",
      status: "Pending",
      date: "Yesterday",
    },
    {
      id: "#ORD004",
      customer: "Sarah Williams",
      amount: "₹2,599",
      status: "Cancelled",
      date: "2 days ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered":
        return "bg-green-100 text-green-700";
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tighter uppercase italic">
          Dashboard
        </h1>
        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-2">
          Welcome back! Here's your business overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.title}
              className={`${stat.color} border ${stat.borderColor} rounded-2xl p-6 space-y-4`}
            >
              <div className="flex items-center justify-between">
                <IconComponent size={24} className="text-zinc-600" />
                <div
                  className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-widest ${
                    stat.isPositive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {stat.isPositive ? (
                    <ArrowUpRight size={16} />
                  ) : (
                    <ArrowDownRight size={16} />
                  )}
                  {stat.change}
                </div>
              </div>

              <div>
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest opacity-70">
                  {stat.title}
                </p>
                <p className="text-3xl font-black tracking-tighter mt-2">
                  {stat.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              Revenue Trend
            </h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
              Last 7 days performance
            </p>
          </div>

          <div className="h-64 bg-zinc-50 rounded-xl border border-dashed border-zinc-200 flex flex-col items-center justify-center text-zinc-400 space-y-2">
            <TrendingUp size={32} />
            <p className="text-[10px] font-bold uppercase tracking-widest">
              Chart Placeholder
            </p>
            <p className="text-[9px] text-zinc-500">
              Integrate with a charting library
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
          <h2 className="text-xl font-black uppercase italic tracking-tighter">
            Quick Stats
          </h2>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                Conversion Rate
              </span>
              <span className="text-lg font-black">3.2%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                Avg Order Value
              </span>
              <span className="text-lg font-black">₹1,780</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                Return Rate
              </span>
              <span className="text-lg font-black">2.1%</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                Customers
              </span>
              <span className="text-lg font-black">1,234</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black uppercase italic tracking-tighter">
              Recent Orders
            </h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">
              Latest transactions
            </p>
          </div>
          <button className="px-6 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Order ID
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Customer
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Amount
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Status
                </th>
                <th className="text-left py-3 px-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors"
                >
                  <td className="py-4 px-4 font-black text-[10px] uppercase tracking-widest">
                    {order.id}
                  </td>
                  <td className="py-4 px-4 text-[10px] font-bold">{order.customer}</td>
                  <td className="py-4 px-4 font-bold text-[10px]">
                    {order.amount}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[10px] text-zinc-500">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 flex items-start gap-4">
        <AlertCircle size={24} className="text-yellow-700 flex-shrink-0 mt-1" />
        <div>
          <h3 className="font-black text-[11px] uppercase tracking-widest text-yellow-900">
            Low Stock Alert
          </h3>
          <p className="text-[10px] text-yellow-800 mt-2">
            5 products are running low on inventory. Visit the products page to restock.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

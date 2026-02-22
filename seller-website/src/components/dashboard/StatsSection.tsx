import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingBag,
  Package,
  Activity,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  isUp: boolean;
  icon: React.ReactNode;
}

function StatCard({ title, value, change, isUp, icon }: StatCardProps) {
  return (
    <Card className="border-gray-100 shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden group">
      <CardContent className="p-8">
        <div className="flex justify-between items-start mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-colors duration-300">
            {icon}
          </div>
          <div
            className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${isUp ? "text-green-600" : "text-red-500"}`}
          >
            {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {change}
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-4xl font-black tracking-tight">{value}</p>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsSection() {
  const stats = [
    {
      title: "Total Sales",
      value: "$45,231",
      change: "12%",
      isUp: true,
      icon: <DollarSign size={22} />,
    },
    {
      title: "Total Orders",
      value: "1,205",
      change: "8%",
      isUp: true,
      icon: <ShoppingBag size={22} />,
    },
    {
      title: "Products Listed",
      value: "842",
      change: "2%",
      isUp: false,
      icon: <Package size={22} />,
    },
    {
      title: "Revenue This Month",
      value: "$12,402",
      change: "15%",
      isUp: true,
      icon: <Activity size={22} />,
    },
  ];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

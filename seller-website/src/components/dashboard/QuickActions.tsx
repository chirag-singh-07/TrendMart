import {
  PlusCircle,
  Package,
  ShoppingCart,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

function ActionCard({ title, description, icon }: ActionCardProps) {
  return (
    <Card className="border-gray-100 shadow-sm hover:border-black transition-all cursor-pointer rounded-3xl group">
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300 transform group-hover:-translate-y-1">
            {icon}
          </div>
          <ArrowRight
            className="text-gray-200 group-hover:text-black transition-colors"
            size={20}
          />
        </div>
        <div className="mt-8 space-y-2">
          <h3 className="text-lg font-bold tracking-tight uppercase italic">
            {title}
          </h3>
          <p className="text-sm text-gray-500 font-medium leading-snug">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActions() {
  const actions = [
    {
      title: "Add Product",
      description: "Create a new product listing",
      icon: <PlusCircle size={24} />,
    },
    {
      title: "Manage Inventory",
      description: "Update stock and variants",
      icon: <Package size={24} />,
    },
    {
      title: "View Orders",
      description: "Track fulfillment & shipments",
      icon: <ShoppingCart size={24} />,
    },
    {
      title: "Marketing Tools",
      description: "Run campaigns & discounts",
      icon: <Megaphone size={24} />,
    },
  ];

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center space-y-2">
          <h2 className="text-3xl font-black tracking-tighter uppercase">
            Quick Actions
          </h2>
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest leading-none">
            Optimize your store operations
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {actions.map((action, index) => (
            <ActionCard key={index} {...action} />
          ))}
        </div>
      </div>
    </section>
  );
}

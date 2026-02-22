import { AlertTriangle, ArrowRight, Package } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export function InventoryStatus() {
  const items = [
    { name: "Leather Aviator Jacket", stock: 12, total: 100, status: "Low" },
    { name: "Silk Midnight Scarf", stock: 5, total: 50, status: "Critical" },
    { name: "Woolen Overcoat", stock: 48, total: 100, status: "Healthy" },
    { name: "Denim Rogue Jeans", stock: 2, total: 40, status: "Critical" },
  ];

  return (
    <Card className="border-gray-100 shadow-sm rounded-3xl overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between px-8 py-8 border-b border-gray-50">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight uppercase italic">
            Inventory Alert
          </CardTitle>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">
            Stock health monitor
          </p>
        </div>
        <Package className="text-gray-200" size={20} />
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-8">
          {items.map((item, i) => (
            <div key={i} className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold truncate max-w-[180px]">
                  {item.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black">
                    {item.stock}{" "}
                    <span className="text-gray-300">/ {item.total}</span>
                  </span>
                  {item.status !== "Healthy" && (
                    <AlertTriangle
                      size={12}
                      className={
                        item.status === "Critical"
                          ? "text-red-500"
                          : "text-amber-500"
                      }
                    />
                  )}
                </div>
              </div>
              <Progress
                value={(item.stock / item.total) * 100}
                className="h-1.5"
                // No complex conditional coloring on progress bar yet, keeping it simple as per Black/White theme
              />
              <div className="flex justify-between items-center">
                <Badge
                  variant="outline"
                  className={`text-[8px] font-black uppercase tracking-widest border-none px-0 ${
                    item.status === "Critical"
                      ? "text-red-500"
                      : item.status === "Healthy"
                        ? "text-green-500"
                        : "text-amber-500"
                  }`}
                >
                  {item.status} Stock
                </Badge>
                {item.status !== "Healthy" && (
                  <button className="text-[9px] font-black uppercase tracking-widest text-black hover:underline underline-offset-4">
                    Restock Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-gray-50">
          <button className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] group">
            <span>Manage All Inventory</span>
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

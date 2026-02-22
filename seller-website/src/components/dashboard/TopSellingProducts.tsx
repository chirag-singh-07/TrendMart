import { ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function TopSellingProducts() {
  const products = [
    {
      name: "Classic Noir Jacket",
      price: "$299.00",
      sales: 142,
      revenue: "$42,458",
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop",
      growth: "+15%",
    },
    {
      name: "Minimalist Cashmere Scarf",
      price: "$120.00",
      sales: 98,
      revenue: "$11,760",
      image:
        "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=100&h=100&fit=crop",
      growth: "+8%",
    },
    {
      name: "Elite Rogue Boots",
      price: "$450.00",
      sales: 64,
      revenue: "$28,800",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100&h=100&fit=crop",
      growth: "+22%",
    },
  ];

  return (
    <Card className="border-gray-100 shadow-sm rounded-3xl overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between px-8 py-8 border-b border-gray-50">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight uppercase italic">
            Top Products
          </CardTitle>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">
            Best performing items
          </p>
        </div>
        <ArrowUpRight className="text-gray-200" size={20} />
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-50">
          {products.map((product, i) => (
            <div
              key={i}
              className="px-8 py-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 overflow-hidden border border-gray-100 shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover grayscale opacity-80"
                  />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black tracking-tight">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                    {product.price}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-2">
                <div className="space-y-0.5">
                  <p className="text-sm font-black">{product.revenue}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none">
                    {product.sales} Sales
                  </p>
                </div>
                <Badge className="bg-green-50 text-green-600 border-none text-[8px] font-black tracking-widest rounded-full h-5 px-2">
                  {product.growth}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <div className="p-6 border-t border-gray-50 text-center">
          <button className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black">
            Full Catalog Analysis
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

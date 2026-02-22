import { BarChart, AreaChart, Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function PerformanceOverview() {
  return (
    <Card className="border-gray-100 shadow-sm rounded-3xl overflow-hidden h-full">
      <CardHeader className="flex flex-row items-center justify-between px-8 py-8 border-b border-gray-50">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold tracking-tight uppercase italic">
            Sales Overview
          </CardTitle>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-none">
            Monthly performance analytics
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 border rounded-lg"
          >
            <Filter size={14} className="text-gray-500" />
          </Button>
          <div className="flex bg-gray-50 rounded-lg p-1 gap-1">
            <Button
              variant="ghost"
              className="h-7 text-[9px] font-black uppercase tracking-widest px-3 bg-white shadow-sm border-none"
            >
              Week
            </Button>
            <Button
              variant="ghost"
              className="h-7 text-[9px] font-black uppercase tracking-widest px-3 text-gray-400 border-none"
            >
              Month
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <div className="aspect-[16/9] w-full bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 relative overflow-hidden group">
          <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform duration-500">
            <BarChart size={24} />
          </div>
          <div className="text-center space-y-1">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-500">
              Analytics Engine
            </p>
            <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
              Chart integration pending
            </p>
          </div>

          {/* Mock Chart Lines */}
          <div className="absolute inset-x-8 bottom-8 flex items-end gap-2 h-2/3 opacity-30">
            {[40, 70, 45, 90, 65, 80, 50, 85, 40].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-black rounded-t-lg transition-all duration-1000"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-black rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Conversion Rate
              </span>
            </div>
            <p className="text-2xl font-black">3.24%</p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                Sessions
              </span>
            </div>
            <p className="text-2xl font-black">12.5k</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

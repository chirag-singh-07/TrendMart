import { Plus, BarChart3, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 space-y-10 animate-in fade-in slide-in-from-left duration-700">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black text-white border border-black text-[10px] font-black uppercase tracking-[0.2em]">
              Edition 2026
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9]">
              Define Your <br />
              <span className="text-gray-300 italic">Commerce.</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-lg font-medium leading-relaxed pt-4">
              The professional environment for elite sellers to manage products,
              track global orders, and scale at lightspeed.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button className="h-14 px-8 rounded-2xl bg-black text-white hover:bg-black/90 shadow-xl shadow-black/10 text-sm font-bold uppercase tracking-widest gap-2">
              <Plus size={18} /> Add New Product
            </Button>
            <Button
              variant="outline"
              className="h-14 px-8 rounded-2xl border-gray-200 hover:bg-gray-50 text-sm font-bold uppercase tracking-widest gap-2"
            >
              <BarChart3 size={18} /> View Analytics
            </Button>
          </div>
        </div>

        <div className="flex-1 w-full lg:max-w-xl animate-in fade-in slide-in-from-right duration-700">
          <div className="relative aspect-[4/3] bg-gray-50 rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden group">
            {/* Simple Dashboard Mockup Interface */}
            <div className="absolute inset-8 bg-white rounded-3xl shadow-lg p-6 border border-gray-100 flex flex-col gap-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="h-4 w-24 bg-gray-100 rounded" />
                  <div className="h-8 w-32 bg-black rounded" />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                  <ArrowUpRight className="text-gray-400" size={20} />
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                  <div className="h-6 w-16 bg-gray-800 rounded mt-2" />
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="h-3 w-12 bg-gray-200 rounded" />
                  <div className="h-6 w-16 bg-gray-800 rounded mt-2" />
                </div>
              </div>
              <div className="h-12 w-full bg-gray-50 rounded-2xl" />
            </div>

            {/* Dynamic Elements */}
            <div className="absolute top-20 right-4 w-32 h-32 bg-gray-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-4 w-24 h-24 bg-gray-200/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

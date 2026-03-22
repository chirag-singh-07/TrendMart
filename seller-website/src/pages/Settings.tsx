import SellerLayout from "@/components/layout/SellerLayout";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Globe, 
  Shield, 
  Smartphone, 
  Mail, 
  ChevronRight,
  Monitor,
  Zap
} from "lucide-react";

export default function Settings() {
  const settingGroups = [
    {
      title: "System Synchronization",
      description: "Manage global merchant connectivity and automated data feeds",
      items: [
        { icon: Globe, label: "Merchant Visibility", detail: "Global Registry", status: "Active" },
        { icon: Bell, label: "Notification Gateway", detail: "Priority Real-time", status: "Configured" },
        { icon: Zap, label: "Performance Feed", detail: "Websocket v4.0", status: "Enabled" }
      ]
    },
    {
      title: "Security Protocols",
      description: "Advanced identity protection and access management",
      items: [
        { icon: Lock, label: "Multi-Factor Authentication", detail: "Email & App Keys", status: "Verified" },
        { icon: Shield, label: "Privacy Shields", detail: "GDPR Compliant", status: "Enforced" },
        { icon: Smartphone, label: "Device Registry", detail: "02 Authenticated", status: "Secure" }
      ]
    },
    {
       title: "Operational Preferences",
       description: "Customize your merchant dashboard and workspace environment",
       items: [
         { icon: Monitor, label: "Interface Mode", detail: "Classic Dark/Light", status: "Auto" },
         { icon: Mail, label: "Email Reports", detail: "Daily Recap Logs", status: "Scheduled" }
       ]
    }
  ];

  return (
    <SellerLayout>
      <div className="max-w-[1000px] mx-auto space-y-12 animate-in fade-in duration-1000">
        <div className="space-y-4 pb-12 border-b border-zinc-100">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-zinc-100 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">
             <SettingsIcon size={14} className="text-black" />
             System Configuration Matrix
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic leading-none">
            Environment Settings
          </h1>
          <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
            Manage your workspace configuration and systemic preferences across the merchant ecosystem.
          </p>
        </div>

        <div className="space-y-16">
           {settingGroups.map((group, idx) => (
             <section key={idx} className="space-y-8 animate-in fade-in-0 duration-700 delay-100">
                <div className="space-y-2">
                   <h3 className="text-2xl font-black uppercase tracking-tighter italic">{group.title}</h3>
                   <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{group.description}</p>
                </div>
                
                <div className="space-y-4">
                   {group.items.map((item, i) => (
                     <div key={i} className="group cursor-pointer">
                        <div className="p-8 bg-white border border-zinc-50 hover:border-black rounded-[35px] shadow-sm hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 flex items-center justify-between">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-zinc-50 rounded-2xl flex items-center justify-center text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white transition-all">
                                 <item.icon size={24} />
                              </div>
                              <div className="space-y-1">
                                 <h4 className="text-[11px] font-black uppercase tracking-widest leading-none mb-1">{item.label}</h4>
                                 <p className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest">{item.detail}</p>
                              </div>
                           </div>
                           
                           <div className="flex items-center gap-8">
                              <div className="hidden sm:flex items-center gap-2 px-4 py-1.5 bg-zinc-50 border border-zinc-100 rounded-full">
                                 <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                                 <span className="text-[9px] font-black uppercase text-zinc-400">{item.status}</span>
                              </div>
                              <ChevronRight size={18} className="text-zinc-200 group-hover:text-black transition-colors translate-x-0 group-hover:translate-x-1" />
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
             </section>
           ))}
        </div>

        <div className="p-12 bg-black text-white rounded-[55px] flex flex-col items-center text-center space-y-8 shadow-2xl shadow-black/30 relative overflow-hidden group">
           <div className="space-y-2 relative z-10">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">Need Advanced System Modifications?</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">Merchant support hotline active 24/7 across all regions</p>
           </div>
           
           <button className="h-14 px-10 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all relative z-10 group-hover:scale-105 duration-300">
              Reach System Admin
           </button>
           
           <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-zinc-800 rounded-full blur-[100px] group-hover:scale-120 transition-all duration-1000" />
           <div className="absolute bottom-[-10%] left-[-10%] w-48 h-48 bg-white/5 rounded-full blur-[80px]" />
        </div>
      </div>
    </SellerLayout>
  );
}

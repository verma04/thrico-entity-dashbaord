"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Cake, Gift, Calendar, Sparkles, Zap, ShieldCheck, Activity, Share2, LayoutGrid, ArrowRight, Star } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI, EcosystemCard, EcosystemStatusIndicator } from "@/components/layout/ecosystem/ecosystem-analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CelebrationsPage() {
  const router = useRouter();

  const kpis = [
    { title: "Upcoming Cycle", value: "8", trend: 10, icon: Calendar, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Monthly Aggregate", value: "24", trend: 5, icon: Sparkles, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Major Milestones", value: "5", trend: 0, icon: Star, color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Sentiment Yield", value: "98%", trend: 2, icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <EcosystemWrapper anonymized-1="celebrations-intelligence">
      <EcosystemHeader
        title="Momentum Intelligence"
        badgeText="Global Registry"
        description="Monitor community milestone instantiation velocity, celebration protocols, and architectural recognition expansion across the global registry."
        icon={Sparkles}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <EcosystemStatusIndicator status="active" label="Reality Core: Operational" />
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span>Verified Recognition Node</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-600 gap-3 hover:bg-slate-50 transition-all shadow-sm">
                 <Activity className="h-4 w-4 text-emerald-500" />
                 Engagement Stream
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {kpis.map((kpi, i) => (
             <EcosystemKPI key={i} {...kpi} trendLabel="Registry" />
           ))}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           {/* Anniversaries */}
           <EcosystemCard 
             title="Registry Milestones" 
             description="Temporal dedication instantiation cycles" 
             icon={Gift} 
             decorationIcon={Sparkles}
             className="cursor-pointer hover:border-indigo-500/50 transition-colors"
             onClick={() => router.push("/celebrations/anniversaries")}
           >
              <div className="space-y-6">
                 <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-inner group-hover:bg-indigo-50/50 transition-all duration-500">
                    <p className="text-sm font-black text-slate-900 leading-relaxed uppercase tracking-tighter mb-4">
                       Celebrate team members' foundational nodes and years of architectural dedication to the registry.
                    </p>
                    <div className="flex items-center gap-3">
                       <div className="h-8 px-3 flex items-center bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          <Calendar className="h-3 w-3 mr-2 text-indigo-500" />
                          Upcoming Lifecycle
                       </div>
                    </div>
                 </div>
                 <Button 
                   className="w-full h-12 rounded-2xl bg-slate-900 border-slate-800 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 group"
                   onClick={() => router.push("/celebrations/anniversaries")}
                 >
                    Access Anniversaries
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                 </Button>
              </div>
           </EcosystemCard>

           {/* Birthdays */}
           <EcosystemCard 
             title="Birth Protocols" 
             description="Node instantiation anniversary overview" 
             icon={Cake} 
             decorationIcon={Sparkles}
             decorationColor="text-rose-500"
             className="cursor-pointer hover:border-rose-500/50 transition-colors"
             onClick={() => router.push("/celebrations/birthdays")}
           >
              <div className="space-y-6">
                 <div className="p-8 rounded-[2.5rem] bg-slate-50 border border-slate-100 shadow-inner group-hover:bg-rose-50/50 transition-all duration-500">
                    <p className="text-sm font-black text-slate-900 leading-relaxed uppercase tracking-tighter mb-4">
                       Automate recognition for global node instantiation cycles. Never miss a foundational birth event.
                    </p>
                    <div className="flex items-center gap-3">
                       <div className="h-8 px-3 flex items-center bg-white border border-slate-200 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                          <Calendar className="h-3 w-3 mr-2 text-rose-500" />
                          Real-time Registry
                       </div>
                    </div>
                 </div>
                 <Button 
                   className="w-full h-12 rounded-2xl bg-slate-900 border-slate-800 font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 group"
                   onClick={() => router.push("/celebrations/birthdays")}
                 >
                    Access Birthdays
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                 </Button>
              </div>
           </EcosystemCard>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

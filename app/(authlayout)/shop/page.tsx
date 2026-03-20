"use client";

import React from "react";
import Link from "next/link";
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Plus,
  ArrowRight,
  Eye,
  Image as ImageIcon,
  Layers,
  AlertCircle,
  Zap,
  ShieldCheck,
  Activity,
  Sparkles,
  LayoutGrid,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI, EcosystemCard, EcosystemStatusIndicator } from "@/components/layout/ecosystem/ecosystem-analytics";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ShopDashboardPage() {
  const kpis = [
    { title: "Propagation Count", value: "1,234", trend: 12, icon: Eye, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Aggregate Products", value: "156", trend: -2, icon: Package, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Active Banners", value: "5", trend: 0, icon: ImageIcon, color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Registry Tiers", value: "8", trend: 0, icon: Layers, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  const quickActions = [
    { label: "Manage Banners", href: "/shop/banners" },
    { label: "Manage Categories", href: "#" },
    { label: "Product Tags", href: "#" },
    { label: "Collections", href: "#" },
    { label: "SEO Settings", href: "#" },
  ];

  return (
    <EcosystemWrapper anonymized-1="shop-intelligence">
      <EcosystemHeader
        title="Commerce Intelligence"
        badgeText="Catalog Registry"
        description="Monitor product instantiation velocity, engagement protocols, and architectural commerce expansion across the global shop registry."
        icon={ShoppingBag}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <EcosystemStatusIndicator status="active" label="Commerce Stream: Operational" />
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                 <span>Verified Shop Node</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Link href="/shop/all">
                 <Button variant="outline" className="h-10 px-4 rounded-xl border-slate-200 font-black text-[10px] uppercase tracking-widest text-slate-600 gap-3 hover:bg-slate-50 transition-all shadow-sm">
                    <ShoppingBag className="h-4 w-4 text-indigo-500" />
                    Registry
                 </Button>
              </Link>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <Link href="/shop/all?action=create">
                 <Button className="h-10 px-6 rounded-xl bg-slate-900 border-slate-800 font-black text-[10px] uppercase tracking-widest gap-2 shadow-xl hover:bg-black transition-all active:scale-95 group">
                    <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                    Provision Product
                 </Button>
              </Link>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {kpis.map((kpi, i) => (
             <EcosystemKPI key={i} {...kpi} trendLabel="Yield" />
           ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           {/* Chart Section */}
           <div className="lg:col-span-8">
              <EcosystemCard 
                title="Catalog Engagement" 
                description="Temporal product instantiation & engagement telemetry" 
                icon={TrendingUp}
                decorationIcon={Zap}
                className="min-h-[400px] flex items-center justify-center text-center"
              >
                 <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 shadow-inner group-hover:scale-110 transition-transform duration-700">
                       <Activity className="h-10 w-10 animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase mb-2">Engagment Matrix Pending</h3>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-relaxed">
                          High-frequency consumer telemetry is currently being aggregated. Visual matrices will manifest as ingestion cycles complete.
                       </p>
                    </div>
                 </div>
              </EcosystemCard>
           </div>

           {/* Alerts & Quick Actions */}
           <div className="lg:col-span-4 space-y-8">
              <EcosystemCard 
                title="Node Alert" 
                description="Inventory anomaly detection" 
                icon={AlertCircle}
                decorationIcon={Package}
                className="min-h-fit border-rose-100/50 bg-rose-50/10"
              >
                 <div className="p-6 rounded-[2rem] bg-white border border-rose-100 shadow-xl shadow-rose-200/20 relative overflow-hidden group/alert">
                    <p className="text-sm font-black text-slate-900 leading-tight uppercase tracking-tighter mb-4">
                       12 Registry items are currently below the required stock protocol.
                    </p>
                    <Link href="/shop/all?filter=low-stock">
                       <Button variant="outline" className="w-full h-11 rounded-xl border-rose-200 font-black text-[9px] uppercase tracking-widest text-rose-600 hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                          View Anomalies
                       </Button>
                    </Link>
                 </div>
              </EcosystemCard>

              <EcosystemCard 
                title="Quick Protocols" 
                description="Registry management shortcuts" 
                icon={Zap}
                decorationIcon={LayoutGrid}
                className="min-h-fit"
              >
                 <div className="grid grid-cols-1 gap-3">
                    {quickActions.map((action, i) => (
                      <Link key={i} href={action.href}>
                         <div className="group/btn flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-indigo-200 hover:shadow-lg transition-all duration-300">
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest group-hover/btn:text-indigo-600">
                               {action.label}
                            </span>
                            <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover/btn:text-indigo-600 group-hover/btn:translate-x-1 transition-all" />
                         </div>
                      </Link>
                    ))}
                 </div>
              </EcosystemCard>
           </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

"use client";

import React from "react";
import { Video, Plus, Loader2, Heart, Eye, Users, TrendingUp, Zap, ShieldCheck, Activity, Share2, Sparkles, LayoutGrid, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetMomentDashboardKPIs } from "@/graphql/actions/moments";
import { TimeRange } from "@/graphql/actions/dashboard";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI, EcosystemCard, EcosystemStatusIndicator } from "@/components/layout/ecosystem/ecosystem-analytics";
import { cn } from "@/lib/utils";

export default function MomentsDashboardPage() {
  const { data: statsData, loading: statsLoading, refetch } = useGetMomentDashboardKPIs(TimeRange.LAST_30_DAYS);
  const stats = statsData?.getMomentAnalytics;

  const kpis = [
    { title: "Aggregate Moments", value: stats?.totalMoments ?? 0, icon: Video, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Propagation Count", value: stats?.totalViews?.toLocaleString() ?? 0, icon: Eye, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Sentiment Yield", value: ((stats?.totalReactions ?? 0) + (stats?.totalComments ?? 0)).toLocaleString(), icon: Heart, color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Active Creators", value: stats?.activeCreators ?? 0, icon: Users, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Moment Analytics"
        badgeText="Moments"
        description="Monitor video performance, engagement trends, and content growth across the platform."
        icon={Video}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-6">
            <EcosystemStatusIndicator status="active" label="Reality Stream: Active" />
            <div className="h-4 w-px bg-slate-200" />
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Verified Node</span>
            </div>
          </div>

            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-10 w-10 text-slate-400 hover:text-indigo-600 rounded-lg transition-all bg-white border-slate-200"
                onClick={() => refetch()}
              >
                <RotateCcw className={cn("h-4 w-4", statsLoading && "animate-spin")} />
              </Button>
              <div className="h-4 w-px bg-slate-200 mx-1" />
              <Link href="/moments/create">
                <Button className="h-10 px-6 rounded-lg bg-slate-900 border-none font-bold text-xs uppercase tracking-wide gap-2 shadow-sm hover:bg-black transition-all active:scale-95 group">
                   <Plus className="h-4 w-4" />
                   Create Moment
                </Button>
              </Link>
            </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8 lg:p-10">
        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {kpis.map((kpi, i) => (
             <EcosystemKPI key={i} {...kpi} trendLabel="Growth" />
           ))}
        </div>

        {/* Status Placeholder / Future Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-12">
               <EcosystemCard 
                title="Historical Manifest" 
                description="Temporal video propagation & engagement telemetry" 
                icon={TrendingUp}
                decorationIcon={Zap}
                className="min-h-[400px] flex items-center justify-center text-center"
              >
                 <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 shadow-sm">
                       <Activity className="h-8 w-8 animate-pulse" />
                    </div>
                    <div>
                       <h3 className="text-lg font-bold text-slate-900 tracking-tight uppercase mb-1">Analytics Pending</h3>
                       <p className="text-xs font-medium text-slate-400 uppercase tracking-wider leading-relaxed">
                          We are currently processing video telemetry. Insights will be available once ingestion is complete.
                       </p>
                    </div>
                    <Button variant="outline" className="h-9 px-6 rounded-lg border-slate-200 font-bold text-xs uppercase tracking-wide text-slate-500 hover:bg-slate-50">
                       Contact Support
                    </Button>
                 </div>
              </EcosystemCard>
           </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

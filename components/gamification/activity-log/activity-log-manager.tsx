"use client";

import React, { useState } from "react";
import { useGetGamificationActivityLog } from "@/graphql/actions";
import { ActivityLogTable } from "./activity-log-table";
import { Button } from "@/components/ui/button";
import { History, ChevronLeft, ChevronRight, LayoutGrid, RotateCcw, ShieldCheck, Activity } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function ActivityLogManager() {
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { data, loading, error, refetch } = useGetGamificationActivityLog({
    variables: {
      input: {
        limit,
        offset,
      },
    },
    fetchPolicy: "network-only",
  });

  const logs = data?.getGamificationActivityLog || [];

  const handleNext = () => {
    if (logs.length === limit) {
      setOffset((prev) => prev + limit);
    }
  };

  const handlePrev = () => {
    setOffset((prev) => Math.max(0, prev - limit));
  };

  if (error) {
    return (
      <EcosystemWrapper anonymized-1="activity-log-fault">
        <EcosystemHeader
          title="Temporal Disturbance"
          badgeText="System Error"
          description="Failed to synchronize with the activity manifest. Ensure invariant server connectivity."
          icon={History}
        />
        <EcosystemContainer>
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-6">
             <div className="h-20 w-20 rounded-[2rem] bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <ShieldCheck className="h-10 w-10 opacity-20" />
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black italic text-slate-900 tracking-tight uppercase">Manifest Lockout</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose max-w-md">
                   {error.message}
                </p>
             </div>
             <Button onClick={() => refetch()} variant="outline" className="rounded-xl font-black h-11 px-8 border-slate-200">
                Attempt Resync
             </Button>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper anonymized-1="temporal-ledger">
      <EcosystemHeader
        title="Archival Ledger"
        badgeText="Gamification Activity"
        description="Auditable stream of all point emissions, badge instantiations, and prestige shifts across the community."
        icon={History}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Telemetry Stream Stable
                 </span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <LayoutGrid className="h-3.5 w-3.5 text-indigo-500" />
                 <span>Manifest Page {Math.floor(offset / limit) + 1}</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/60 mr-2">
                 <Button
                   variant="ghost"
                   size="icon"
                   className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-400 disabled:opacity-30"
                   onClick={handlePrev}
                   disabled={offset === 0 || loading}
                 >
                   <ChevronLeft className="h-4 w-4" />
                 </Button>
                 <div className="h-8 min-w-[32px] flex items-center justify-center font-black text-slate-900 text-[10px] uppercase">
                    {Math.floor(offset / limit) + 1}
                 </div>
                 <Button
                   variant="ghost"
                   size="icon"
                   className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm transition-all text-slate-400 disabled:opacity-30"
                   onClick={handleNext}
                   disabled={logs.length < limit || loading}
                 >
                   <ChevronRight className="h-4 w-4" />
                 </Button>
              </div>
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all"
              >
                <RotateCcw className={cn("h-4 w-4", loading && "animate-spin")} />
                Refresh
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8 lg:p-12">
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-1">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                 <Activity className="h-5 w-5" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Emission Stream</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Foundational activity manifest</p>
              </div>
           </div>

           <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
             <ActivityLogTable logs={logs} isLoading={loading} />
           </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

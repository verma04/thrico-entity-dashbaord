"use client";

import React, { useState } from "react";
import { useGetLeaderboard } from "@/graphql/actions";
import { LeaderboardTable } from "./leaderboard-table";
import { Trophy, Users, Star, LayoutGrid, ShieldCheck, Activity, RotateCcw, TrendingUp, Sparkles } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function LeaderboardManager() {
  const [pagination] = useState({ limit: 20, offset: 0 });
  const { data, loading, refetch } = useGetLeaderboard({
    variables: { pagination },
    notifyOnNetworkStatusChange: true,
  });

  const leaderboard = data?.getLeaderboard;
  const entries = leaderboard?.entries || [];

  return (
    <EcosystemWrapper anonymized-1="prestige-leaderboard">
      <EcosystemHeader
        title="Prestige Manifest"
        badgeText="Community Rankings"
        description="A real-time ledger of elite contributors and legacy-tier entities currently dominating the ecosystem."
        icon={Trophy}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Real-time Tracking Active
                 </span>
              </div>
              <div className="h-4 w-px bg-slate-200" />
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                 <Users className="h-3.5 w-3.5 text-indigo-500" />
                 <span>{leaderboard?.totalUsers || 0} Entities Indexed</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => refetch()}
                className="h-10 px-4 rounded-xl border-slate-200 font-bold text-slate-600 gap-2 hover:bg-slate-50 transition-all"
              >
                <RotateCcw className={cn("h-4 w-4", loading && "animate-spin")} />
                Sync Manifest
              </Button>
           </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-10 p-8">
        {/* Prestige Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-10 rounded-[3rem] bg-indigo-600 shadow-2xl shadow-indigo-200 group hover:translate-y-[-4px] transition-all duration-500 overflow-hidden relative border-none">
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                 <Trophy className="h-32 w-32 text-white" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                    <Sparkles className="h-5 w-5 text-indigo-200" />
                    <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">Global Participants</p>
                 </div>
                 <h3 className="text-5xl font-black text-white tracking-tighter">
                    {leaderboard?.totalUsers?.toLocaleString() || 0}
                 </h3>
                 <div className="mt-8 p-3 rounded-2xl bg-white/10 border border-white/10 inline-flex items-center gap-2 text-[10px] font-bold text-white uppercase tracking-tighter">
                    Legacy Tier Coverage: 100%
                 </div>
              </div>
           </div>

           <div className="p-10 rounded-[3rem] bg-slate-900 shadow-2xl shadow-slate-900/10 group hover:translate-y-[-4px] transition-all duration-500 overflow-hidden relative border border-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                 <Star className="h-32 w-32 text-amber-500" />
              </div>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-4">
                    <TrendingUp className="h-5 w-5 text-emerald-400" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Standing</p>
                 </div>
                 <h3 className="text-5xl font-black text-white tracking-tighter">GLOBAL</h3>
                 <div className="mt-8 p-3 rounded-2xl bg-white/5 border border-white/10 inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                    Ranking Invariant: Point Accumulation
                 </div>
              </div>
           </div>
        </div>

        {/* Manifest Table */}
        <div className="space-y-6">
           <div className="flex items-center gap-3 px-1">
              <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                 <Activity className="h-5 w-5" />
              </div>
              <div>
                 <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">Recognition Array</h3>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">High-prestige entity stack</p>
              </div>
           </div>

           <div className="rounded-[2.5rem] border border-slate-100 bg-white shadow-xl shadow-slate-200/50 overflow-hidden">
             <LeaderboardTable entries={entries} isLoading={loading} />
           </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

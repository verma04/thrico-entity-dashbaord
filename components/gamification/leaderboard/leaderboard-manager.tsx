"use client";

import React, { useState } from "react";
import { useGetLeaderboard } from "@/graphql/actions";
import { LeaderboardTable } from "./leaderboard-table";
import {
  Trophy,
  Users,
  TrendingUp,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
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
    <EcosystemWrapper>
      <EcosystemHeader
        title="Leaderboard"
        badgeText="Competition"
        description="Monitor the highest engaging members across the platform. Rankings are calculated based on total points lifecycle."
        icon={Trophy}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
              Verified Node
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 h-9 rounded-lg bg-zinc-50 border border-zinc-200">
              <Users className="h-3.5 w-3.5 text-zinc-500" />
              <span className="text-[10px] font-bold text-zinc-900 uppercase tracking-widest">
                {leaderboard?.totalUsers?.toLocaleString() ?? 0} Members
              </span>
            </div>

            <div className="h-4 w-px bg-zinc-200 mx-1" />

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 text-zinc-400 hover:text-indigo-600 rounded-lg transition-all"
              onClick={() => refetch()}
            >
              <RotateCcw className={cn(loading && "animate-spin")} size={14} />
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                Global Participants
              </span>
              <span className="text-2xl font-black text-foreground tracking-tight leading-none mt-1">
                {leaderboard?.totalUsers?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card shadow-sm">
            <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                Ranking Protocol
              </span>
              <span className="text-[13px] font-bold text-zinc-700 leading-tight mt-1">
                Cumulative Point Aggregation (Lifecycle)
              </span>
            </div>
          </div>
        </div>

        <div className="px-6">
          <LeaderboardTable entries={entries} isLoading={loading} />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

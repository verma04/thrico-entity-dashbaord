"use client";

import React, { useState } from "react";
import { useGetLeaderboard } from "@/graphql/actions";
import { LeaderboardTable } from "./leaderboard-table";
import { Trophy, Users, TrendingUp, RotateCcw } from "lucide-react";
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
        badgeText="Gamification"
        description="View the top-ranked community members based on total points earned."
        icon={Trophy}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-muted-foreground">
              Live rankings
            </span>
          </div>
          <EcosystemActionBar.Separator />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>
              {leaderboard?.totalUsers?.toLocaleString() ?? 0} members indexed
            </span>
          </div>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RotateCcw
              className={cn("h-3.5 w-3.5", loading && "animate-spin")}
            />
            Refresh
          </Button>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-4 p-5 rounded-lg border border-border bg-card">
            <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Total Participants
              </p>
              <p className="text-2xl font-bold text-foreground tracking-tight">
                {leaderboard?.totalUsers?.toLocaleString() ?? 0}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-5 rounded-lg border border-border bg-card">
            <div className="h-10 w-10 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                Ranking Basis
              </p>
              <p className="text-sm font-semibold text-foreground">
                Total Points Accumulated
              </p>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-foreground">Rankings</h2>

          <LeaderboardTable entries={entries} isLoading={loading} />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

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

  const [search, setSearch] = useState("");

  const leaderboard = data?.getLeaderboard;
  const entries = leaderboard?.entries || [];

  const filteredEntries = React.useMemo(() => {
    if (!search) return entries;
    return entries.filter((e: any) => {
      const name = `${e.user.firstName} ${e.user.lastName}`.toLowerCase();
      return name.includes(search.toLowerCase());
    });
  }, [entries, search]);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Leaderboard"
        badgeText="Competition"
        description="Monitor the highest engaging members across the platform. Rankings are calculated based on total points lifecycle."
        icon={Trophy}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Leaderboard" },
        ]}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0 space-y-6">
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-indigo-50">
              <Users className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">
                Global Participants
              </span>
              <span className="text-xl font-bold text-foreground tracking-tight">
                {leaderboard?.totalUsers?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-amber-50">
              <TrendingUp className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground">
                Ranking Protocol
              </span>
              <span className="text-lg font-bold text-foreground tracking-tight">
                Cumulative Point Aggregation (Lifecycle)
              </span>
            </div>
          </div>
        </div>

        <div className="px-6">
          <EcosystemActionBar shadow="sm" className="">
            <EcosystemActionBar.Item grow className="max-w-sm">
              <EcosystemActionBar.Search
                value={search}
                onChange={setSearch}
                placeholder="Search members..."
              />
            </EcosystemActionBar.Item>
          </EcosystemActionBar>
          <LeaderboardTable entries={filteredEntries} isLoading={loading} />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

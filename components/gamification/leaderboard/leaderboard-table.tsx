"use client";

import React from "react";
import {
  AdminTable,
  AdminTableItem,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";
import { cn } from "@/lib/utils";
import { Trophy, Medal, Award, TrendingUp, Coins } from "lucide-react";
import { LeaderboardEntry } from "@/graphql/actions";
import { BadgeIcon } from "@/components/gamification/badges/badge-icon";
import Link from "next/link";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

export function LeaderboardTable({
  entries,
  isLoading,
}: LeaderboardTableProps) {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="h-6 w-6 rounded-md bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 shadow-sm">
            <Trophy className="h-3.5 w-3.5" />
          </div>
        );
      case 2:
        return (
          <div className="h-6 w-6 rounded-md bg-slate-500/10 border border-slate-500/20 flex items-center justify-center text-slate-600 shadow-sm">
            <Medal className="h-3.5 w-3.5" />
          </div>
        );
      case 3:
        return (
          <div className="h-6 w-6 rounded-md bg-amber-700/10 border border-amber-700/20 flex items-center justify-center text-amber-800 shadow-sm">
            <Medal className="h-3.5 w-3.5" />
          </div>
        );
      default:
        return (
          <span className="text-[11px] font-bold text-muted-foreground w-6 text-center font-mono">
            #{rank}
          </span>
        );
    }
  };

  const columns = [
    {
      key: "rank",
      header: "Rank",
      headerClassName: "w-[60px] text-center",
      className: "text-center",
      cell: (entry: LeaderboardEntry) => (
        <div className="flex justify-center">{getRankIcon(entry.rank)}</div>
      ),
    },
    {
      key: "user",
      header: "Member",
      cell: (entry: LeaderboardEntry) => {
        const user = entry?.user;
        return (
          <Link href={`/members/${user?.id}`}>
            <AdminTableItem
              avatar={user?.avatar}
              title={`${user?.firstName || ""} ${user?.lastName || ""}`}
              fallbackText={user?.firstName?.substring(0, 2)}
            />
          </Link>
        );
      },
    },
    {
      key: "currentRank",
      header: "Tier Progression",
      cell: (entry: LeaderboardEntry) => (
        <div className="flex items-center gap-2">
          <div
            className="h-6 w-6 rounded-md flex items-center justify-center border overflow-hidden shrink-0"
            style={{
              backgroundColor: `${entry?.currentRank?.color}12`,
              borderColor: `${entry?.currentRank?.color}25`,
            }}
          >
            <BadgeIcon icon={entry?.currentRank?.icon} className="h-full w-full text-xs" imageClassName="rounded-md" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-[11px] font-bold tracking-tight uppercase"
              style={{ color: entry?.currentRank?.color }}
            >
              {entry?.currentRank?.name}
            </span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />
              <span className="text-[9px] text-muted-foreground font-semibold uppercase tracking-tighter">
                Active Tier
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "badges",
      header: "Badges",
      cell: (entry: LeaderboardEntry) => (
        <AdminTableMetric
          icon={Award}
          value={entry?.badgesCount || 0}
          variant="indigo"
        />
      ),
    },
    {
      key: "points",
      header: "Points",
      cell: (entry: LeaderboardEntry) => (
        <AdminTableMetric
          value={entry?.totalPoints?.toLocaleString() || "0"}
          unit="PTS"
          variant="mono"
        />
      ),
    },
    {
      key: "wallet",
      header: "Entity Wallet",
      cell: (entry: LeaderboardEntry) => {
        const wallet = entry?.entityCurrencyWallet;
        return (
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-1 font-mono text-[12px] font-semibold text-amber-600 dark:text-amber-500">
              <Coins className="h-3 w-3" />
              {wallet?.balance?.toLocaleString() ?? 0}
            </div>
            <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              <span className="text-emerald-600">
                +{wallet?.totalEarned?.toLocaleString() ?? 0}
              </span>
              <span className="text-rose-600">
                -{wallet?.totalSpent?.toLocaleString() ?? 0}
              </span>
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={entries || []}
      loading={isLoading}
      keyExtractor={(entry) => `${entry.user.id}-${entry.rank}`}
      size="sm"
    />
  );
}

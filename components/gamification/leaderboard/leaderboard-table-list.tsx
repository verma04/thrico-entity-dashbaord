"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  Coins,
  MoreHorizontal,
  ExternalLink,
  Copy,
} from "lucide-react";
import { LeaderboardEntry } from "@/graphql/actions";
import { BadgeIcon } from "@/components/gamification/badges/badge-icon";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  AdminTable,
  AdminTableColumn,
  AdminTableItem,
  AdminTableMetric,
} from "@/components/shared/admin-table/admin-table";

// ─────────────────────────────────────────────────────────────────────────────
// Column definitions
// ─────────────────────────────────────────────────────────────────────────────

export const getLeaderboardTableColumns = (): AdminTableColumn<LeaderboardEntry>[] => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="h-6 w-6 rounded-md bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-2xs">
            <Trophy className="h-3.5 w-3.5" />
          </div>
        );
      case 2:
        return (
          <div className="h-6 w-6 rounded-md bg-slate-500/10 border border-slate-500/25 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-2xs">
            <Medal className="h-3.5 w-3.5" />
          </div>
        );
      case 3:
        return (
          <div className="h-6 w-6 rounded-md bg-amber-700/10 border border-amber-700/25 flex items-center justify-center text-amber-800 dark:text-amber-500 shadow-2xs">
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

  return [
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
        const avatarSrc = user?.avatar?.startsWith("http")
          ? user.avatar
          : user?.avatar
            ? `https://cdn.thrico.network/${user.avatar}`
            : "";

        return (
          <UserProfileHoverCard user={user as any}>
            <Link href={`/members/${user?.id}`} className="block">
              <AdminTableItem
                avatar={avatarSrc}
                title={`${user?.firstName || ""} ${user?.lastName || ""}`}
                subtitle={(user as any)?.email || "Community Member"}
                fallbackText={user?.firstName?.substring(0, 2) || "U"}
              />
            </Link>
          </UserProfileHoverCard>
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
              backgroundColor: `${entry?.currentRank?.color || "#6366f1"}12`,
              borderColor: `${entry?.currentRank?.color || "#6366f1"}25`,
            }}
          >
            <BadgeIcon
              icon={entry?.currentRank?.icon}
              className="h-full w-full text-xs flex items-center justify-center"
              imageClassName="rounded-md"
            />
          </div>
          <div className="flex flex-col">
            <span
              className="text-[11px] font-bold tracking-tight uppercase"
              style={{ color: entry?.currentRank?.color || "#6366f1" }}
            >
              {entry?.currentRank?.name || "Unranked"}
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
    {
      key: "actions",
      header: "Action",
      headerClassName: "w-10 text-right",
      className: "text-right",
      isFixedRight: true,
      cell: (entry: LeaderboardEntry) => {
        const user = entry.user;
        return (
          <div className="flex justify-end items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                  <span className="sr-only">Open actions</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-2 py-1 truncate">
                  {user?.firstName} {user?.lastName}
                </DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/members/${user?.id}`}
                    className="text-xs font-medium cursor-pointer gap-2 py-1.5"
                  >
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                    View Member Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(user?.id);
                    toast.success("Member ID copied to clipboard");
                  }}
                  className="text-xs font-medium cursor-pointer gap-2 py-1.5"
                >
                  <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  Copy Member ID
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};

// ─────────────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────────────

export interface LeaderboardTableListProps {
  entries: LeaderboardEntry[];
  visibleColumns?: Record<string, boolean>;
  offset?: number;
}

export function LeaderboardTableList({
  entries,
  visibleColumns,
  offset = 0,
}: LeaderboardTableListProps) {
  const baseColumns = React.useMemo(() => getLeaderboardTableColumns(), []);

  const activeColumns = React.useMemo(() => {
    if (!visibleColumns) return baseColumns;
    return baseColumns.filter((col) => visibleColumns[col.key] !== false);
  }, [baseColumns, visibleColumns]);

  return (
    <div className="space-y-3">
      <AdminTable<LeaderboardEntry>
        columns={activeColumns}
        data={entries}
        keyExtractor={(e) => `${e.user.id}-${e.rank}`}
        emptyTitle="No leaderboard rankings found"
        emptyDescription="Rankings are computed dynamically as members perform point-earning actions across your ecosystem."
        pageSize={100}
        baseIndex={offset}
      />
    </div>
  );
}

export default LeaderboardTableList;

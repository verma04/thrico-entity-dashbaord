"use client";

import React from "react";
import { AdminTable } from "@/components/shared/admin-table/admin-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LeaderboardEntry } from "@/graphql/actions";
import { Medal, Award, TrendingUp, Coins } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { BadgeIcon } from "@/components/gamification/badges/badge-icon";

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
          <div className="relative flex items-center justify-center h-10 w-10">
            <div className="absolute inset-0 bg-yellow-400/20 blur-lg rounded-full animate-pulse" />
            <Medal className="h-7 w-7 text-yellow-500 relative z-10 drop-shadow-[0_2px_4px_rgba(234,179,8,0.4)]" />
          </div>
        );
      case 2:
        return (
          <Medal className="h-7 w-7 text-slate-400 drop-shadow-[0_2px_4px_rgba(148,163,184,0.4)]" />
        );
      case 3:
        return (
          <Medal className="h-7 w-7 text-amber-600 drop-shadow-[0_2px_4px_rgba(180,83,9,0.4)]" />
        );
      default:
        return (
          <span className="text-sm font-black text-muted-foreground/60 w-10 text-center font-mono">
            #{rank}
          </span>
        );
    }
  };

  const columns = [
    {
      key: "rank",
      header: "Rank",
      headerClassName: "w-[80px] text-center",
      cell: (entry: LeaderboardEntry) => (
        <div className="flex justify-center">{getRankIcon(entry.rank)}</div>
      ),
    },
    {
      key: "user",
      header: "Member Entity",
      cell: (entry: LeaderboardEntry) => {
        const user = entry?.user;
        return (
          <Link
            href={`/members/${user?.id}`}
            className="flex items-center gap-3 group"
          >
            <Avatar className="h-10 w-10 border border-border shadow-sm group-hover:border-primary/50 transition-all">
              <AvatarImage
                src={`https://cdn.thrico.network/${user?.avatar}`}
                alt={user?.firstName}
                className="object-cover"
              />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold uppercase">
                {user?.firstName?.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-foreground text-sm truncate group-hover:text-primary transition-colors">
                {user?.firstName} {user?.lastName}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-none">
                Global Identity
              </span>
            </div>
          </Link>
        );
      },
    },
    {
      key: "currentRank",
      header: "Tier Progression",
      cell: (entry: LeaderboardEntry) => (
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-xl flex items-center justify-center shadow-sm border overflow-hidden"
            style={{
              backgroundColor: `${entry?.currentRank?.color}12`,
              borderColor: `${entry?.currentRank?.color}25`,
            }}
          >
            <BadgeIcon icon={entry?.currentRank?.icon} className="h-full w-full text-lg" imageClassName="rounded-xl" />
          </div>
          <div className="flex flex-col">
            <span
              className="text-[12px] font-black tracking-tight uppercase"
              style={{ color: entry?.currentRank?.color }}
            >
              {entry?.currentRank?.name}
            </span>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-2.5 w-2.5 text-emerald-500" />
              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-tighter">
                Elite Circuit
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
        <div className="flex items-center gap-2">
          <div className="h-6 px-2 rounded-full bg-indigo-50 border border-indigo-100 flex items-center gap-1.5 shadow-sm">
            <Award className="h-3 w-3 text-indigo-600" />
            <span className="text-[11px] font-bold text-indigo-700 font-mono">
              {entry?.badgesCount}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: "points",
      header: "Gamification Points",
      cell: (entry: LeaderboardEntry) => (
        <div className="flex flex-col items-start ml-4">
          <span className="font-mono text-[14px] font-black text-foreground tracking-tight">
            {entry?.totalPoints.toLocaleString()}
          </span>
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
            Points
          </span>
        </div>
      ),
    },
    {
      key: "wallet",
      header: "Entity Wallet",
      cell: (entry: LeaderboardEntry) => {
        const wallet = entry?.entityCurrencyWallet;
        return (
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 font-mono text-[13px] font-medium text-amber-600">
              <Coins className="h-3.5 w-3.5" />
              {wallet?.balance?.toLocaleString() ?? 0}
            </div>
            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
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
      rowClassName={(entry) =>
        cn(
          entry.rank === 1 && "bg-yellow-500/[0.03]",
          entry.rank === 2 && "bg-slate-500/[0.02]",
          entry.rank === 3 && "bg-amber-700/[0.02]",
        )
      }
    />
  );
}

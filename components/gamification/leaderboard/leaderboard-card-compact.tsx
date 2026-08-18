"use client";

import React from "react";
import Link from "next/link";
import {
  Trophy,
  Medal,
  Award,
  Coins,
  TrendingUp,
  MoreHorizontal,
  ExternalLink,
  Copy,
} from "lucide-react";
import { LeaderboardEntry } from "@/graphql/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { BadgeIcon } from "@/components/gamification/badges/badge-icon";
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
import { cn } from "@/lib/utils";

interface LeaderboardCardCompactProps {
  entry: LeaderboardEntry;
}

export function LeaderboardCardCompact({ entry }: LeaderboardCardCompactProps) {
  const user = entry.user;
  const rank = entry.rank;
  const currentRank = entry.currentRank;
  const wallet = entry.entityCurrencyWallet;

  const getRankBadge = () => {
    switch (rank) {
      case 1:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 shadow-2xs">
            <Trophy className="h-3 w-3" />
            #1
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-400/15 text-slate-600 dark:text-slate-300 border border-slate-400/30 shadow-2xs">
            <Medal className="h-3 w-3" />
            #2
          </span>
        );
      case 3:
        return (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-700/15 text-amber-800 dark:text-amber-500 border border-amber-700/30 shadow-2xs">
            <Medal className="h-3 w-3" />
            #3
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold font-mono bg-muted text-muted-foreground border border-border">
            #{rank}
          </span>
        );
    }
  };

  const getBarColor = () => {
    if (rank === 1) return "#f59e0b";
    if (rank === 2) return "#94a3b8";
    if (rank === 3) return "#b45309";
    return currentRank?.color || "#6366f1";
  };

  const avatarSrc = user?.avatar?.startsWith("http")
    ? user.avatar
    : user?.avatar
      ? `https://cdn.thrico.network/${user.avatar}`
      : "";

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group">
      {/* Top rank accent bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: getBarColor() }}
      />

      {/* ── Card Header ─────────────────────────────────────────────────── */}
      <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {getRankBadge()}

          {currentRank && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border"
              style={{
                color: currentRank.color || "#6366f1",
                borderColor: `${currentRank.color || "#6366f1"}30`,
                backgroundColor: `${currentRank.color || "#6366f1"}10`,
              }}
            >
              {currentRank.name}
            </span>
          )}
        </div>

        <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-muted/80 rounded-md transition-colors"
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-44 rounded-lg shadow-md border-border p-1"
            >
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
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Member info with hover card */}
          <div className="flex items-center gap-2.5 pt-0.5">
            <UserProfileHoverCard user={user as any}>
              <div className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer">
                <Avatar className="h-9 w-9 border border-border shadow-2xs shrink-0">
                  <AvatarImage
                    src={avatarSrc}
                    alt={`${user?.firstName || ""} ${user?.lastName || ""}`}
                  />
                  <AvatarFallback className="text-xs font-semibold bg-muted text-foreground">
                    {user?.firstName?.substring(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col min-w-0 flex-1">
                  <h3
                    className="text-xs sm:text-sm font-semibold text-foreground leading-snug truncate hover:text-primary transition-colors"
                    title={`${user?.firstName || ""} ${user?.lastName || ""}`}
                  >
                    {user?.firstName} {user?.lastName}
                  </h3>
                  <span className="text-[11px] text-muted-foreground truncate">
                    {(user as any)?.email || "Community Member"}
                  </span>
                </div>
              </div>
            </UserProfileHoverCard>
          </div>

          {/* Key Metrics: Points & Badges */}
          <div className="flex items-center justify-between pt-1 border-t border-border/30 text-[10px]">
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-3 w-3 text-emerald-500 shrink-0" />
              <span className="font-bold text-foreground font-mono text-xs">
                {entry.totalPoints?.toLocaleString() ?? 0}
              </span>
              <span className="text-[9px] text-muted-foreground font-semibold uppercase">
                PTS
              </span>
            </div>

            <div className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded text-[10px]">
              <Award className="h-3 w-3" />
              <span>{entry.badgesCount || 0} Badges</span>
            </div>
          </div>
        </div>

        {/* ── Card Footer: Wallet Breakdown ─────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px]">
          <div className="flex items-center gap-1 font-mono font-semibold text-amber-600 dark:text-amber-500">
            <Coins className="h-3 w-3 shrink-0" />
            <span>{wallet?.balance?.toLocaleString() ?? 0}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-mono font-semibold">
            <span className="text-emerald-600 dark:text-emerald-400">
              +{wallet?.totalEarned?.toLocaleString() ?? 0}
            </span>
            <span className="text-rose-600 dark:text-rose-400">
              -{wallet?.totalSpent?.toLocaleString() ?? 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaderboardCardCompact;

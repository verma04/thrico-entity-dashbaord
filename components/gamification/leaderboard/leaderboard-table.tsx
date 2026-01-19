"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { LeaderboardEntry } from "@/graphql/actions";
import { Medal, Award, Star } from "lucide-react";
import Link from "next/link";

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  isLoading?: boolean;
}

export function LeaderboardTable({
  entries,
  isLoading,
}: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Medal className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return (
          <span className="text-lg font-bold text-muted-foreground w-6 text-center">
            {rank}
          </span>
        );
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-yellow-500/5 border-yellow-500/10";
      case 2:
        return "bg-gray-500/5 border-gray-500/10";
      case 3:
        return "bg-amber-500/5 border-amber-500/10";
      default:
        return "";
    }
  };

  return (
    <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
            <TableHead className="w-[80px] text-center">Rank</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Current Rank</TableHead>
            <TableHead className="text-right">Badges</TableHead>
            <TableHead className="text-right">Total Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-32 text-center text-muted-foreground"
              >
                No entries found in this leaderboard.
              </TableCell>
            </TableRow>
          ) : (
            entries.map((entry) => (
              <TableRow
                key={entry?.user.id}
                className={`group transition-colors h-20 ${getRankBg(
                  entry?.rank,
                )}`}
              >
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    {getRankIcon(entry?.rank)}
                  </div>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/members/${entry?.user.id}`}
                    className="flex items-center gap-3 hover:underline underline-offset-4 decoration-primary/30"
                  >
                    <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                      <AvatarImage
                        src={`https://cdn.thrico.network/${entry?.user.avatar}`}
                        alt={entry?.user.firstName}
                      />
                      <AvatarFallback className="bg-primary/5 text-primary text-xs">
                        {entry?.user.firstName.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-semibold text-foreground">
                      {entry?.user.firstName} {entry?.user.lastName}
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm border transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `${entry?.currentRank?.color}15`,
                        borderColor: `${entry?.currentRank?.color}30`,
                      }}
                    >
                      <span
                        className="text-xl"
                        role="img"
                        aria-label={entry?.currentRank?.name}
                      >
                        {entry?.currentRank?.icon || "⭐"}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-bold tracking-tight uppercase"
                        style={{ color: entry?.currentRank?.color }}
                      >
                        {entry?.currentRank?.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest leading-none">
                        Tier Status
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono text-muted-foreground">
                  <div className="flex items-center justify-end gap-1.5">
                    <Award className="h-4 w-4 text-purple-500" />
                    {entry?.badgesCount}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="secondary"
                    className="font-mono text-sm bg-primary/5 text-primary border-primary/10"
                  >
                    {entry?.totalPoints.toLocaleString()} pts
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

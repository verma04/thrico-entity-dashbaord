"use client";

import React from "react";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { LeaderboardEntry } from "@/graphql/actions";
import { LeaderboardCardCompact } from "./leaderboard-card-compact";

interface LeaderboardGridProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardGrid({ entries }: LeaderboardGridProps) {
  if (!entries || entries.length === 0) {
    return (
      <Card className="border border-dashed border-border/70 shadow-none bg-muted/20">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
            <Trophy className="h-6 w-6" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            No leaderboard rankings found
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            Rankings are computed dynamically as members perform point-earning actions across your ecosystem.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
      {entries.map((entry) => (
        <LeaderboardCardCompact
          key={`${entry.user.id}-${entry.rank}`}
          entry={entry}
        />
      ))}
    </div>
  );
}

export default LeaderboardGrid;

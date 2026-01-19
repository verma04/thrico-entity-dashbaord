"use client";

import React from "react";
import { LeaderboardManager } from "@/components/gamification/leaderboard/leaderboard-manager";
import { Trophy } from "lucide-react";

export default function LeaderboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
          <Trophy className="h-6 w-6 text-yellow-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            Recognizing our top contributors and community leaders.
          </p>
        </div>
      </div>

      <LeaderboardManager />
    </div>
  );
}

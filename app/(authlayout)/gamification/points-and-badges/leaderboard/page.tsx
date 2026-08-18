"use client";

import React, { Suspense } from "react";
import { LeaderboardManager } from "@/components/gamification/leaderboard/leaderboard-manager";

export default function LeaderboardPage() {
  return (
    <Suspense fallback={null}>
      <LeaderboardManager />
    </Suspense>
  );
}

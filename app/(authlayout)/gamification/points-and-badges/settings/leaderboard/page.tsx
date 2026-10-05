"use client";

import React, { Suspense } from "react";
import { EnterpriseLeaderboardHub } from "@/components/gamification/leaderboard/enterprise";

export default function EnterpriseLeaderboardsSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <span>Loading Enterprise Leaderboards Hub…</span>
          </div>
        </div>
      }
    >
      <EnterpriseLeaderboardHub />
    </Suspense>
  );
}


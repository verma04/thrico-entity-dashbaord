"use client";

import React, { Suspense } from "react";
import { EnterpriseLeaderboardHub } from "@/components/gamification/leaderboard/enterprise";

export default function EnterpriseLeaderboardsSettingsPage() {
  return (
    <Suspense fallback={null}>
      <EnterpriseLeaderboardHub />
    </Suspense>
  );
}

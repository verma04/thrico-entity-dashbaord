"use client";

import React, { Suspense } from "react";
import { MatchWinManager } from "@/components/rewards/match-win/match-win-manager";

export default function MatchWinPage() {
  return (
    <Suspense fallback={null}>
      <MatchWinManager />
    </Suspense>
  );
}

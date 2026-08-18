"use client";

import React, { Suspense } from "react";
import { RanksManager } from "@/components/gamification/ranks/ranks-manager";

export default function RanksPage() {
  return (
    <Suspense fallback={null}>
      <RanksManager />
    </Suspense>
  );
}

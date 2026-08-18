"use client";

import React, { Suspense } from "react";
import { PointsManager } from "@/components/gamification/points-manager/points-manager";

export default function PointsPage() {
  return (
    <Suspense fallback={null}>
      <PointsManager />
    </Suspense>
  );
}

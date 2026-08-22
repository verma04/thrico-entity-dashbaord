"use client";

import React, { Suspense } from "react";
import { ScratchCardManager } from "@/components/rewards/scratch-card/scratch-card-manager";

export default function ScratchCardPage() {
  return (
    <Suspense fallback={null}>
      <ScratchCardManager />
    </Suspense>
  );
}

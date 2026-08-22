"use client";

import React, { Suspense } from "react";
import { SpinWheelManager } from "@/components/rewards/spin-wheel/spin-wheel-manager";

export default function SpinWheelPage() {
  return (
    <Suspense fallback={null}>
      <SpinWheelManager />
    </Suspense>
  );
}

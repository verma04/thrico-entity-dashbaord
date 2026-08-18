"use client";

import React, { Suspense } from "react";
import { BadgesManager } from "@/components/gamification/badges/badges-manager";

export default function BadgesPage() {
  return (
    <Suspense fallback={null}>
      <BadgesManager />
    </Suspense>
  );
}

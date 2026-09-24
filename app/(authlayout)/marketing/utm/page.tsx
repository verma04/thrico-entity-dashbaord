"use client";

import React, { Suspense } from "react";
import { UtmManagerDashboard } from "@/components/marketing/utm/utm-manager-dashboard";

export default function UtmMarketingPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
            <span>Loading UTM Attribution Hub…</span>
          </div>
        </div>
      }
    >
      <UtmManagerDashboard />
    </Suspense>
  );
}

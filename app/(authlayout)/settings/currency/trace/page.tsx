"use client";

import { QuickAuditTrace } from "@/components/settings/currency/quick-audit-trace";
import { List } from "lucide-react";

export default function QuickTracePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <List className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Quick Trace</h1>
          <p className="text-sm text-muted-foreground">
            Real-time feed of recent currency movements and conversions.
          </p>
        </div>
      </div>
      <div className="max-w-4xl">
        <QuickAuditTrace />
      </div>
    </div>
  );
}

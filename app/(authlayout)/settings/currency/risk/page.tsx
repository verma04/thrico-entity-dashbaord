"use client";

import { RiskManagement } from "@/components/settings/currency/risk-management";
import { ShieldAlert } from "lucide-react";

export default function RiskPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ShieldAlert className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Anti-Abuse Guardrails
          </h1>
          <p className="text-sm text-muted-foreground">
            Set daily, monthly, and global caps on TC generation and movement.
          </p>
        </div>
      </div>
      <RiskManagement />
    </div>
  );
}

"use client";

import { RedemptionLogic } from "@/components/settings/currency/redemption-logic";
import { ScrollText } from "lucide-react";

export default function RedemptionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
          <ScrollText className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Redemption Logic
          </h1>
          <p className="text-sm text-muted-foreground">
            Define checkout spending rules and the 70/30 local earning policy.
          </p>
        </div>
      </div>
      <RedemptionLogic />
    </div>
  );
}

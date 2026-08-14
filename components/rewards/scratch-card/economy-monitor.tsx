import React from "react";
import { Shield, Sparkles, TrendingUp } from "lucide-react";
import {
  PolarisSidebarCard,
  PolarisSummaryRow,
} from "@/components/gamification/shared/polaris-form-ui";

interface EconomyMonitorProps {
  avgPayout: number;
  currencyName?: string;
}

export function EconomyMonitor({
  avgPayout,
  currencyName = "Points",
}: EconomyMonitorProps) {
  return (
    <PolarisSidebarCard
      title="Scratch Economy Monitor"
      badge="Health Check"
      icon={Shield}
    >
      <div className="space-y-4">
        <PolarisSummaryRow
          label="Estimated Avg. Payout"
          value={`${avgPayout.toFixed(1)} ${currencyName}`}
          isLast
        />

        <div className="p-4 rounded-xl border bg-zinc-50/50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-700 space-y-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#008060]">
              Game Cost Model
            </span>
            <Sparkles className="h-3.5 w-3.5 text-[#008060]" />
          </div>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            Scratch cards are currently free for qualified community members. Monitor average payout values to manage token inflation across daily claim volume.
          </p>
        </div>
      </div>
    </PolarisSidebarCard>
  );
}

import React from "react";
import { Shield, TrendingUp, AlertTriangle, Info, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PolarisSidebarCard,
  PolarisSummaryRow,
} from "@/components/gamification/shared/polaris-form-ui";

export function EconomyMonitor({
  avgPayout,
  profitMargin,
  isHealthy,
  currencyName = "Points",
}: {
  avgPayout: number;
  profitMargin: number;
  isHealthy: boolean;
  currencyName?: string;
}) {
  return (
    <PolarisSidebarCard
      title="Game Economy Monitor"
      badge={isHealthy ? "Healthy Margin" : "Attention"}
      icon={Shield}
    >
      <div className="space-y-4">
        <div className="space-y-2">
          <PolarisSummaryRow
            label="Avg. Payout / Spin"
            value={`${avgPayout.toFixed(1)} ${currencyName}`}
          />
          <PolarisSummaryRow
            label="Target Margin"
            value="20% – 40%"
            isLast
          />
        </div>

        {/* Profit Margin Gauge Card */}
        <div
          className={cn(
            "p-4 rounded-xl border transition-all",
            isHealthy
              ? "bg-[#008060]/[0.03] border-[#008060]/20 dark:bg-[#008060]/10"
              : "bg-rose-50/60 border-rose-200 dark:bg-rose-500/10 dark:border-rose-500/20",
          )}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                isHealthy ? "text-[#008060]" : "text-rose-600 dark:text-rose-400",
              )}
            >
              Simulated House Margin
            </span>
            {isHealthy ? (
              <CheckCircle2 className="h-4 w-4 text-[#008060]" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={cn(
                "text-2xl font-black font-mono tracking-tight",
                isHealthy
                  ? "text-[#008060]"
                  : "text-rose-700 dark:text-rose-400",
              )}
            >
              {profitMargin.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                isHealthy ? "bg-[#008060]" : "bg-rose-500",
              )}
              style={{ width: `${Math.min(Math.max(profitMargin, 0), 100)}%` }}
            />
          </div>
        </div>

        {!isHealthy && (
          <div className="flex gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200/80 dark:border-rose-500/20 items-start">
            <Info className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-rose-700 dark:text-rose-300 leading-relaxed">
              {profitMargin < 20
                ? "Margin is below target. Increase spin cost or lower segment point values to prevent point depletion."
                : "Margin is very high. Players may feel the game is unrewarding; consider increasing payout values."}
            </p>
          </div>
        )}
      </div>
    </PolarisSidebarCard>
  );
}

import React from "react";
import { Shield, TrendingUp, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function EconomyMonitor({
  avgPayout,
  profitMargin,
  isHealthy,
}: {
  avgPayout: number;
  profitMargin: number;
  isHealthy: boolean;
}) {
  return (
    <div className="rounded-[24px] border border-border bg-card p-5 max-w-[340px] mx-auto shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="h-8 w-8 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
          <Shield className="h-4 w-4 text-orange-600" />
        </div>
        <div>
          <h4 className="text-sm font-bold text-foreground leading-none">
            Economy Monitor
          </h4>
          <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">
            Health Check
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
          <span className="text-xs font-semibold text-muted-foreground">
            Avg. Payout
          </span>
          <span className="text-sm font-bold font-mono text-foreground">
            {avgPayout.toFixed(1)} <span className="text-[10px]">TC</span>
          </span>
        </div>

        <div
          className={cn(
            "p-4 rounded-2xl border transition-colors",
            isHealthy
              ? "bg-emerald-50/50 border-emerald-200"
              : "bg-rose-50/50 border-rose-200",
          )}
        >
          <div className="flex items-center justify-between mb-1">
            <p
              className={cn(
                "text-xs font-bold uppercase tracking-wider",
                isHealthy ? "text-emerald-600" : "text-rose-600",
              )}
            >
              Profit Margin
            </p>
            {isHealthy ? (
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            )}
          </div>
          <div className="flex items-baseline gap-2">
            <p
              className={cn(
                "text-3xl font-black font-mono tracking-tighter",
                isHealthy ? "text-emerald-700" : "text-rose-700",
              )}
            >
              {profitMargin.toFixed(1)}%
            </p>
          </div>
          <p
            className={cn(
              "text-[10px] font-bold mt-1 uppercase tracking-wider",
              isHealthy ? "text-emerald-600/70" : "text-rose-600/70",
            )}
          >
            Target: 20–40%
          </p>
        </div>

        {!isHealthy && (
          <div className="flex gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 items-start">
            <Info className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-rose-700 leading-relaxed">
              {profitMargin < 20
                ? "Margin too low. Increase spin cost or adjust probabilities to lower overall value."
                : "Margin too high. Game may feel unrewarding; consider better payouts."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

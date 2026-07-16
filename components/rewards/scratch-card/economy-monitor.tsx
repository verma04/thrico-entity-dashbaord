import React from "react";
import { Shield, Sparkles } from "lucide-react";

interface EconomyMonitorProps {
  avgPayout: number;
}

export function EconomyMonitor({ avgPayout }: EconomyMonitorProps) {
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

      <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
        <span className="text-xs font-semibold text-muted-foreground">
          Avg. Payout
        </span>
        <span className="text-sm font-bold font-mono text-foreground">
          {avgPayout.toFixed(1)} <span className="text-[10px]">TC</span>
        </span>
      </div>

      <div className="mt-4 p-4 rounded-2xl border bg-indigo-50/50 border-indigo-200">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Economy Status
          </p>
          <Sparkles className="h-4 w-4 text-indigo-500" />
        </div>
        <p className="text-xs font-medium text-indigo-700 leading-relaxed">
          Scratch cards are currently free for users. Monitor average payout to
          manage economy inflation.
        </p>
      </div>
    </div>
  );
}

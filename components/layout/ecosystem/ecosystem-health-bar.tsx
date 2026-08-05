import React from "react";
import { cn } from "@/lib/utils";

export interface EcosystemHealthBarProps {
  label: string;
  burned: number;
  rewarded: number;
  colorScheme?: "indigo" | "sky" | "lime" | "rose" | "purple" | "orange" | "amber";
  loading?: boolean;
}

const colorStyles = {
  indigo: "bg-indigo-500",
  sky: "bg-sky-500",
  lime: "bg-emerald-500",
  rose: "bg-rose-500",
  purple: "bg-purple-500",
  orange: "bg-orange-500",
  amber: "bg-amber-500",
};

export function EcosystemHealthBar({
  label,
  burned,
  rewarded,
  colorScheme = "indigo",
  loading = false,
}: EcosystemHealthBarProps) {
  const margin = burned > 0 ? ((burned - rewarded) / burned) * 100 : 0;
  const isHealthy = margin >= 20 && margin <= 40;
  const barColor = colorStyles[colorScheme];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span
          className={cn(
            "font-bold font-mono",
            isHealthy
              ? "text-emerald-600 dark:text-emerald-400"
              : loading
              ? "text-muted-foreground"
              : "text-rose-600 dark:text-rose-400"
          )}
        >
          {loading ? "—" : `${margin.toFixed(1)}% margin`}
        </span>
      </div>
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        {!loading && burned > 0 && (
          <div
            className={cn("h-full rounded-full transition-all", barColor)}
            style={{ width: `${Math.min(margin, 100)}%` }}
          />
        )}
      </div>
    </div>
  );
}

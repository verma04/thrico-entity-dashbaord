import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Module Performance Card
// ---------------------------------------------------------------------------
// Map color class to border/bg accent
const colorToBorderMap: Record<string, { border: string; bg: string }> = {
  "text-blue-600": { border: "border-l-blue-500", bg: "bg-blue-500/8" },
  "text-orange-600": { border: "border-l-orange-500", bg: "bg-orange-500/8" },
  "text-emerald-600": {
    border: "border-l-emerald-500",
    bg: "bg-emerald-500/8",
  },
  "text-purple-600": { border: "border-l-purple-500", bg: "bg-purple-500/8" },
  "text-violet-600": { border: "border-l-violet-500", bg: "bg-violet-500/8" },
  "text-yellow-600": { border: "border-l-yellow-500", bg: "bg-yellow-500/8" },
  "text-amber-600": { border: "border-l-amber-500", bg: "bg-amber-500/8" },
  "text-pink-600": { border: "border-l-pink-500", bg: "bg-pink-500/8" },
  "text-cyan-600": { border: "border-l-cyan-500", bg: "bg-cyan-500/8" },
  "text-teal-600": { border: "border-l-teal-500", bg: "bg-teal-500/8" },
  "text-indigo-600": { border: "border-l-indigo-500", bg: "bg-indigo-500/8" },
  "text-red-600": { border: "border-l-red-500", bg: "bg-red-500/8" },
  "text-rose-600": { border: "border-l-rose-500", bg: "bg-rose-500/8" },
  "text-slate-600": { border: "border-l-slate-500", bg: "bg-slate-500/8" },
};

export const ModulePerformanceCard = ({
  title,
  stats,
  icon: Icon,
  color = "text-primary",
}: {
  title: string;
  stats?: string[];
  icon: LucideIcon;
  color?: string;
}) => {
  const accent = colorToBorderMap[color] ?? {
    border: "border-l-primary",
    bg: "bg-primary/5",
  };
  return (
    <div
      className={cn(
        "rounded-xl border border-l-[3px] border-border/50 bg-card p-3.5 shadow-sm transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-md hover:border-border/80 flex items-center gap-3",
        accent.border,
      )}
    >
      <div
        className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105",
          accent.bg,
        )}
      >
        <Icon className={cn("h-4 w-4", color)} />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.16em] leading-none mb-1.5 truncate">
          {title}
        </h4>
        <div className="flex flex-col gap-0.5">
          {stats && stats.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 min-w-0">
              {stats.map((stat, i) => {
                const match = stat
                  .trim()
                  .match(
                    /^([+\-~]?[$€£¥₹]?[\d,]+(?:\.\d+)?[kKmMbB%]?|xxx)\s*(.*)$/i,
                  );
                if (match && match[1]) {
                  return (
                    <React.Fragment key={i}>
                      <span className="inline-flex items-baseline gap-1 shrink-0">
                        <span className="text-[13px] font-bold text-foreground tracking-tight tabular-nums leading-none group-hover:underline">
                          {match[1]}
                        </span>
                        {match[2] && (
                          <span className="text-[10px] font-normal text-muted-foreground leading-none">
                            {match[2]}
                          </span>
                        )}
                      </span>
                      {i < stats.length - 1 && (
                        <span className="text-muted-foreground/30 text-[10px] font-light select-none">
                          |
                        </span>
                      )}
                    </React.Fragment>
                  );
                }
                return (
                  <React.Fragment key={i}>
                    <span className="text-[11px] font-medium text-muted-foreground/90 truncate leading-none">
                      {stat}
                    </span>
                    {i < stats.length - 1 && (
                      <span className="text-muted-foreground/30 text-[10px] font-light select-none">
                        |
                      </span>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          ) : (
            <span className="text-[13px] font-bold text-foreground tracking-tight tabular-nums leading-none">
              0
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

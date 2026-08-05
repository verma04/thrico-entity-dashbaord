import React from "react";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export interface EcosystemTodayCardProps {
  title: string;
  icon: LucideIcon;
  colorScheme?: "indigo" | "sky" | "lime" | "rose" | "purple" | "orange" | "slate";
  plays: number;
  tcBurned: number;
  tcRewarded: number;
  href: string;
  loading?: boolean;
}

const colorStyles = {
  indigo: {
    bg: "bg-card border-border/50",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  sky: {
    bg: "bg-card border-border/50",
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  lime: {
    bg: "bg-card border-border/50",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  rose: {
    bg: "bg-card border-border/50",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  purple: {
    bg: "bg-card border-border/50",
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  orange: {
    bg: "bg-card border-border/50",
    iconBg: "bg-orange-100 dark:bg-orange-900/40",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  slate: {
    bg: "bg-card border-border/50",
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
};

export function EcosystemTodayCard({
  title,
  icon: Icon,
  colorScheme = "indigo",
  plays,
  tcBurned,
  tcRewarded,
  href,
  loading = false,
}: EcosystemTodayCardProps) {
  const margin = tcBurned > 0 ? ((tcBurned - tcRewarded) / tcBurned) * 100 : 0;
  const isHealthy = margin >= 20 && margin <= 40;
  const colors = colorStyles[colorScheme];

  return (
    <div className={cn("rounded-xl border overflow-hidden", colors.bg)}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "h-8 w-8 rounded-lg flex items-center justify-center shrink-0",
              colors.iconBg
            )}
          >
            <Icon className={cn("h-4 w-4", colors.iconColor)} />
          </div>
          <p className="text-sm font-semibold text-foreground">{title}</p>
        </div>
        <Link href={href}>
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 h-7 text-xs text-muted-foreground"
          >
            Configure <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
      <div className="p-5 space-y-3">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Plays", value: plays, mono: false },
                {
                  label: "TC Burned",
                  value: tcBurned.toLocaleString(),
                  mono: true,
                },
                {
                  label: "TC Rewarded",
                  value: tcRewarded.toLocaleString(),
                  mono: true,
                },
              ].map((row) => (
                <div
                  key={row.label}
                  className="p-3 rounded-lg bg-muted/30 text-center"
                >
                  <p
                    className={cn(
                      "text-base font-bold text-foreground",
                      row.mono && "font-mono"
                    )}
                  >
                    {row.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {row.label}
                  </p>
                </div>
              ))}
            </div>

            <div
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-lg border text-xs font-medium",
                isHealthy
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
                  : "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-400"
              )}
            >
              <span>Margin</span>
              <span className="font-bold font-mono">{margin.toFixed(1)}%</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

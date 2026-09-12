"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalytics360CohortRetention,
  Analytics360CohortRetention,
} from "@/graphql/analytics/analytics360";
import {
  Grid3X3,
  Calendar,
  Users,
  TrendingUp,
  Info,
  RefreshCw,
} from "lucide-react";

interface Customer360CohortsTabProps {
  initialCohortData?: Analytics360CohortRetention;
}

export function Customer360CohortsTab({
  initialCohortData,
}: Customer360CohortsTabProps) {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [cohortCount, setCohortCount] = useState<number>(6);

  const { data, loading, error, refetch } = useAnalytics360CohortRetention({
    period,
    cohortCount,
  });

  const cohortResponse = data?.getAnalytics360CohortRetention || initialCohortData;
  const cohorts = cohortResponse?.cohorts || [];

  // Determine max periods across cohorts
  const maxPeriods = Math.max(
    0,
    ...cohorts.map((c) => c.retentionPeriods?.length || 0)
  );

  const getHeatmapColor = (percent: number) => {
    if (percent >= 80) return "bg-emerald-600 text-white dark:bg-emerald-500 font-semibold";
    if (percent >= 60) return "bg-emerald-500/80 text-white dark:bg-emerald-500/80 font-semibold";
    if (percent >= 40) return "bg-emerald-500/50 text-emerald-950 dark:bg-emerald-500/40 dark:text-emerald-100 font-medium";
    if (percent >= 20) return "bg-emerald-500/25 text-emerald-900 dark:bg-emerald-500/20 dark:text-emerald-200 font-medium";
    if (percent > 0) return "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300";
    return "bg-muted/40 text-muted-foreground/60";
  };

  return (
    <div className="space-y-6">
      {/* Retention Controls & Matrix Card */}
      <Card className="border-border/80 bg-card">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-primary" />
                <CardTitle className="text-sm font-semibold">
                  Cohort Retention Matrix
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Member retention rate computed over consecutive {period}s
              </CardDescription>
            </div>

            <div className="flex items-center gap-2">
              {/* Period Switcher */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                <Button
                  variant={period === "week" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPeriod("week")}
                  className="h-7 text-xs px-2.5"
                >
                  Weekly
                </Button>
                <Button
                  variant={period === "month" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPeriod("month")}
                  className="h-7 text-xs px-2.5"
                >
                  Monthly
                </Button>
              </div>

              {/* Cohort count select */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                {[6, 8, 12].map((cnt) => (
                  <Button
                    key={cnt}
                    variant={cohortCount === cnt ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCohortCount(cnt)}
                    className="h-7 text-xs px-2"
                  >
                    {cnt}
                  </Button>
                ))}
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => refetch()}
                disabled={loading}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {loading && !cohortResponse ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error && cohorts.length === 0 ? (
            <div className="py-12 text-center text-sm text-destructive">
              Failed to load cohort retention: {error.message}
            </div>
          ) : cohorts.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No cohort retention activity recorded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border/80 text-muted-foreground font-mono">
                    <th className="pb-3 pr-4 font-semibold">Cohort</th>
                    <th className="pb-3 px-3 font-semibold text-right">Size</th>
                    {Array.from({ length: maxPeriods }).map((_, idx) => (
                      <th
                        key={idx}
                        className="pb-3 px-2 font-semibold text-center min-w-[72px]"
                      >
                        {period === "week" ? `W+${idx}` : `M+${idx}`}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {cohorts.map((cohort, cIdx) => (
                    <tr
                      key={cIdx}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-2.5 pr-4 font-mono font-medium text-foreground">
                        {cohort.cohortPeriod}
                      </td>
                      <td className="py-2.5 px-3 font-mono font-semibold text-right text-foreground">
                        {cohort.cohortSize.toLocaleString()}
                      </td>

                      {Array.from({ length: maxPeriods }).map((_, pIdx) => {
                        const periodData = cohort.retentionPeriods?.find(
                          (rp) => rp.periodIndex === pIdx
                        );

                        if (!periodData) {
                          return (
                            <td
                              key={pIdx}
                              className="py-2.5 px-2 text-center text-muted-foreground/30"
                            >
                              -
                            </td>
                          );
                        }

                        const percent = periodData.retentionPercent;
                        const colorClass = getHeatmapColor(percent);

                        return (
                          <td key={pIdx} className="py-2.5 px-1.5 text-center">
                            <div
                              className={`rounded-lg py-1.5 px-1 font-mono text-[11px] transition-transform hover:scale-105 cursor-default ${colorClass}`}
                              title={`${periodData.retainedCount} retained (${percent}%)`}
                            >
                              {percent}%
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Retention Insights Footer */}
          <div className="mt-6 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Info className="w-3.5 h-3.5 text-primary" />
              <span>
                Calculated dynamically via ClickHouse retention engine based on user activity events.
              </span>
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center gap-1.5 font-mono text-[11px]">
              <span className="text-muted-foreground mr-1">Retention:</span>
              <span className="px-1.5 py-0.5 rounded bg-muted/40 text-muted-foreground">
                0%
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-800 dark:text-emerald-300">
                &gt;0%
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/25 text-emerald-900 dark:text-emerald-200">
                &ge;20%
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-500/50 text-emerald-950 dark:text-emerald-100">
                &ge;40%
              </span>
              <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white">
                &ge;80%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

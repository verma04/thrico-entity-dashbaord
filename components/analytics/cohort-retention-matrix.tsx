"use client";

import React, { useState } from "react";
import { useCohortRetention } from "@/graphql/analytics/cohortRetention";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Grid3X3, Users, Calendar } from "lucide-react";

interface CohortRetentionMatrixProps {
  className?: string;
}

export function CohortRetentionMatrix({ className }: CohortRetentionMatrixProps) {
  const [period, setPeriod] = useState<"week" | "month">("week");
  const { data, loading, error } = useCohortRetention({ period, cohortCount: 6 });

  if (loading) {
    return (
      <Card className={`p-6 space-y-4 ${className || ""}`}>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </Card>
    );
  }

  if (error || !data?.getCohortRetention) {
    return (
      <Card className={`p-6 border-dashed text-center text-muted-foreground text-sm ${className || ""}`}>
        {error ? `Failed to load cohort retention: ${error.message}` : "No cohort retention data available."}
      </Card>
    );
  }

  const { cohorts } = data.getCohortRetention;

  const getHeatmapColor = (percent: number) => {
    if (percent >= 80) return "bg-emerald-600 text-white dark:bg-emerald-500";
    if (percent >= 60) return "bg-emerald-500/80 text-white dark:bg-emerald-500/70";
    if (percent >= 40) return "bg-emerald-500/40 text-emerald-950 dark:bg-emerald-500/30 dark:text-emerald-200";
    if (percent >= 20) return "bg-emerald-500/20 text-emerald-900 dark:bg-emerald-500/15 dark:text-emerald-300";
    if (percent > 0) return "bg-emerald-500/10 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-400";
    return "bg-muted/30 text-muted-foreground";
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Grid3X3 className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold">Cohort Retention Matrix</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Weekly and monthly retention cohorts computed via ClickHouse
            </CardDescription>
          </div>

          <div className="flex items-center gap-1.5 bg-muted p-1 rounded-lg">
            <Button
              variant={period === "week" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setPeriod("week")}
            >
              Weekly
            </Button>
            <Button
              variant={period === "month" ? "default" : "ghost"}
              size="sm"
              className="h-7 text-xs px-2.5"
              onClick={() => setPeriod("month")}
            >
              Monthly
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b text-muted-foreground">
                <th className="py-2.5 px-3 font-semibold">Cohort</th>
                <th className="py-2.5 px-3 font-semibold text-center">Users</th>
                <th className="py-2.5 px-3 font-semibold text-center">Period 0</th>
                <th className="py-2.5 px-3 font-semibold text-center">+1 {period}</th>
                <th className="py-2.5 px-3 font-semibold text-center">+2 {period}s</th>
                <th className="py-2.5 px-3 font-semibold text-center">+3 {period}s</th>
                <th className="py-2.5 px-3 font-semibold text-center">+4 {period}s</th>
                <th className="py-2.5 px-3 font-semibold text-center">+5 {period}s</th>
              </tr>
            </thead>
            <tbody>
              {cohorts.map((cohort, cIdx) => (
                <tr key={cIdx} className="border-b border-border/40 hover:bg-muted/20 transition-colors">
                  <td className="py-2.5 px-3 font-medium whitespace-nowrap">
                    {cohort.cohortPeriod}
                  </td>
                  <td className="py-2.5 px-3 text-center font-bold text-foreground">
                    {cohort.cohortSize}
                  </td>
                  {Array.from({ length: 6 }).map((_, pIdx) => {
                    const ret = cohort.retentionPeriods.find((r) => r.periodIndex === pIdx);
                    if (!ret && pIdx > cohort.retentionPeriods.length - 1) {
                      return <td key={pIdx} className="py-2 px-2 text-center text-muted-foreground/30">—</td>;
                    }
                    const percent = ret?.retentionPercent ?? 0;
                    return (
                      <td key={pIdx} className="py-1.5 px-1.5 text-center">
                        <div
                          className={`py-1 px-1.5 rounded-md font-semibold text-[11px] transition-transform hover:scale-105 ${getHeatmapColor(
                            percent
                          )}`}
                          title={`${ret?.retainedCount ?? 0} members retained (${percent}%)`}
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
      </CardContent>
    </Card>
  );
}

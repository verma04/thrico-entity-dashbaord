"use client";

import React from "react";
import { useSessionAnalytics, SessionAnalyticsVariables } from "@/graphql/analytics/sessionAnalytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Smartphone, Globe, Compass, Monitor, Clock, Eye } from "lucide-react";

interface SessionAnalyticsCardProps {
  variables?: SessionAnalyticsVariables;
  className?: string;
}

export function SessionAnalyticsCard({ variables, className }: SessionAnalyticsCardProps) {
  const { data, loading, error } = useSessionAnalytics(variables);

  if (loading) {
    return (
      <Card className={`p-6 space-y-4 ${className || ""}`}>
        <Skeleton className="h-6 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
      </Card>
    );
  }

  if (error || !data?.getSessionAnalytics) {
    return (
      <Card className={`p-6 border-dashed text-center text-muted-foreground text-sm ${className || ""}`}>
        {error ? `Failed to load session analytics: ${error.message}` : "No session analytics data available."}
      </Card>
    );
  }

  const { totalSessions, totalPageViews, avgSessionDurationSeconds, devices, browsers, sources } =
    data.getSessionAnalytics;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Monitor className="h-4 w-4 text-primary" />
              <CardTitle className="text-base font-bold">Sessions & Platform Analytics</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Device OS, browser, and traffic sources breakdown
            </CardDescription>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Eye className="h-3.5 w-3.5 text-primary" />
              <span>
                <strong className="text-foreground">{totalPageViews?.toLocaleString() || 0}</strong> Views
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground border-l pl-3">
              <Clock className="h-3.5 w-3.5 text-emerald-500" />
              <span>
                Avg <strong className="text-foreground">{formatDuration(avgSessionDurationSeconds || 0)}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground border-l pl-3">
              <span>
                <strong className="text-foreground">{totalSessions?.toLocaleString() || 0}</strong> Sessions
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Devices Breakdown */}
          <div className="space-y-3 p-3.5 rounded-xl border bg-muted/20">
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-blue-500" /> Operating System
            </h4>
            <div className="space-y-2">
              {(devices || []).map((dev, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize text-muted-foreground">{dev.deviceOs || "Unknown"}</span>
                    <span className="font-medium text-foreground">
                      {dev.sessions} ({dev.percentage}%)
                    </span>
                  </div>
                  <Progress value={dev.percentage} className="h-1.5 bg-muted" />
                </div>
              ))}
            </div>
          </div>

          {/* Browsers Breakdown */}
          <div className="space-y-3 p-3.5 rounded-xl border bg-muted/20">
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-emerald-500" /> Browsers
            </h4>
            <div className="space-y-2">
              {(browsers || []).map((b, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize text-muted-foreground">{b.browser || "Unknown"}</span>
                    <span className="font-medium text-foreground">
                      {b.sessions} ({b.percentage}%)
                    </span>
                  </div>
                  <Progress value={b.percentage} className="h-1.5 bg-muted" />
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources Breakdown */}
          <div className="space-y-3 p-3.5 rounded-xl border bg-muted/20">
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-violet-500" /> Traffic Sources
            </h4>
            <div className="space-y-2">
              {(sources || []).map((s, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="capitalize text-muted-foreground">{s.source || "Direct"}</span>
                    <span className="font-medium text-foreground">
                      {s.sessions} ({s.percentage}%)
                    </span>
                  </div>
                  <Progress value={s.percentage} className="h-1.5 bg-muted" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

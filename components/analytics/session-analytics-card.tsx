"use client";

import React from "react";
import { useSessionAnalytics, SessionAnalyticsVariables } from "@/graphql/analytics/sessionAnalytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Smartphone,
  Globe,
  Compass,
  Monitor,
  Clock,
  Eye,
  Users,
  MapPin,
  Laptop,
  FileText,
} from "lucide-react";

interface SessionAnalyticsCardProps {
  variables?: SessionAnalyticsVariables;
  className?: string;
  title?: string;
  description?: string;
}

export function SessionAnalyticsCard({
  variables,
  className,
  title = "Web & Session Intelligence",
  description = "Entity-wide traffic attribution, device distribution, geographic reach, and page performance",
}: SessionAnalyticsCardProps) {
  const { data, loading, error } = useSessionAnalytics(variables);

  if (loading) {
    return (
      <Card className={`p-6 space-y-4 ${className || ""}`}>
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
          <Skeleton className="h-36 w-full rounded-xl" />
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

  const sessionData = data.getSessionAnalytics;
  const totalSessions = sessionData?.totalSessions ?? 0;
  const totalPageViews = sessionData?.totalPageViews ?? 0;
  const totalUsers = sessionData?.totalUsers;
  const activeUsersNow = sessionData?.activeUsersNow;
  const avgSessionDurationSeconds = sessionData?.avgSessionDurationSeconds;

  // Ensure all arrays are safe against GraphQL null values
  const devices = Array.isArray(sessionData?.devices) ? sessionData.devices : [];
  const browsers = Array.isArray(sessionData?.browsers) ? sessionData.browsers : [];
  const sources = Array.isArray(sessionData?.sources) ? sessionData.sources : [];
  const deviceCategories = Array.isArray(sessionData?.deviceCategories) ? sessionData.deviceCategories : [];
  const countries = Array.isArray(sessionData?.countries) ? sessionData.countries : [];
  const topPages = Array.isArray(sessionData?.topPages) ? sessionData.topPages : [];

  const formatDuration = (seconds?: number) => {
    if (!seconds || seconds <= 0) return "0s";
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                <Globe className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-bold">{title}</CardTitle>
              {typeof activeUsersNow === "number" && activeUsersNow > 0 ? (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] gap-1 px-2 py-0.5 ml-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                  </span>
                  {activeUsersNow} Active Now
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[10px] text-muted-foreground ml-1">
                  Live Analytics
                </Badge>
              )}
            </div>
            <CardDescription className="text-xs">{description}</CardDescription>
          </div>

          {/* Metric Badges */}
          <div className="flex items-center gap-3 sm:gap-4 text-xs flex-wrap">
            {typeof totalUsers === "number" && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Users className="h-3.5 w-3.5 text-indigo-500" />
                <span>
                  <strong className="text-foreground">{totalUsers.toLocaleString()}</strong> Visitors
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5 text-muted-foreground border-l pl-3 sm:pl-4">
              <Eye className="h-3.5 w-3.5 text-blue-500" />
              <span>
                <strong className="text-foreground">{totalPageViews?.toLocaleString() || 0}</strong> Views
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground border-l pl-3 sm:pl-4">
              <span>
                <strong className="text-foreground">{totalSessions?.toLocaleString() || 0}</strong> Sessions
              </span>
            </div>
            {avgSessionDurationSeconds !== undefined && avgSessionDurationSeconds !== null && (
              <div className="flex items-center gap-1.5 text-muted-foreground border-l pl-3 sm:pl-4">
                <Clock className="h-3.5 w-3.5 text-emerald-500" />
                <span>
                  Avg <strong className="text-foreground">{formatDuration(avgSessionDurationSeconds)}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* ── Breakdowns Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Traffic Sources Breakdown */}
          <div className="space-y-3 p-3.5 rounded-xl border bg-muted/20">
            <h4 className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-violet-500" /> Acquisition Sources
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">{sources.length} sources</span>
            </h4>
            <div className="space-y-2">
              {sources.length > 0 ? (
                sources.map((s, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize text-muted-foreground truncate max-w-[140px]" title={s.source}>
                        {s.source || "Direct"}
                      </span>
                      <span className="font-medium text-foreground">
                        {s.sessions} ({s.percentage}%)
                      </span>
                    </div>
                    <Progress value={s.percentage} className="h-1.5 bg-muted" />
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground py-2 text-center">No source attribution data yet</p>
              )}
            </div>
          </div>

          {/* Operating Systems Breakdown */}
          <div className="space-y-3 p-3.5 rounded-xl border bg-muted/20">
            <h4 className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Smartphone className="h-3.5 w-3.5 text-blue-500" /> Operating Systems
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">{devices.length} systems</span>
            </h4>
            <div className="space-y-2">
              {devices.length > 0 ? (
                devices.map((dev, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize text-muted-foreground">{dev.deviceOs || "Unknown"}</span>
                      <span className="font-medium text-foreground">
                        {dev.sessions} ({dev.percentage}%)
                      </span>
                    </div>
                    <Progress value={dev.percentage} className="h-1.5 bg-muted" />
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground py-2 text-center">No OS data recorded</p>
              )}
            </div>
          </div>

          {/* Browsers Breakdown */}
          <div className="space-y-3 p-3.5 rounded-xl border bg-muted/20">
            <h4 className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Monitor className="h-3.5 w-3.5 text-emerald-500" /> Browsers
              </span>
              <span className="text-[10px] text-muted-foreground font-normal">{browsers.length} browsers</span>
            </h4>
            <div className="space-y-2">
              {browsers.length > 0 ? (
                browsers.map((b, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize text-muted-foreground">{b.browser || "Unknown"}</span>
                      <span className="font-medium text-foreground">
                        {b.sessions} ({b.percentage}%)
                      </span>
                    </div>
                    <Progress value={b.percentage} className="h-1.5 bg-muted" />
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground py-2 text-center">No browser data recorded</p>
              )}
            </div>
          </div>

          {/* Device Categories (if available) */}
          {deviceCategories.length > 0 && (
            <div className="space-y-3 p-3.5 rounded-xl border bg-muted/20">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <Laptop className="h-3.5 w-3.5 text-amber-500" /> Device Categories
              </h4>
              <div className="space-y-2">
                {deviceCategories.map((c, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize text-muted-foreground">{c.category || "Other"}</span>
                      <span className="font-medium text-foreground">
                        {c.sessions} ({c.percentage}%)
                      </span>
                    </div>
                    <Progress value={c.percentage} className="h-1.5 bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Geographic Countries (if available) */}
          {countries.length > 0 && (
            <div className="space-y-3 p-3.5 rounded-xl border bg-muted/20">
              <h4 className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-rose-500" /> Top Countries
                </span>
                <span className="text-[10px] text-muted-foreground font-normal">{countries.length} locations</span>
              </h4>
              <div className="space-y-2">
                {countries.slice(0, 5).map((c, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize text-muted-foreground truncate max-w-[140px]">
                        {c.country || "Unknown"}
                      </span>
                      <span className="font-medium text-foreground">
                        {c.sessions} ({c.percentage}%)
                      </span>
                    </div>
                    <Progress value={c.percentage} className="h-1.5 bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Top Visited Pages (if available) ── */}
        {topPages.length > 0 && (
          <div className="p-4 rounded-xl border bg-muted/10 space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-primary" /> Most Viewed Pages Across Entity
              </h4>
              <span className="text-[11px] text-muted-foreground font-normal">
                {topPages.length} paths recorded
              </span>
            </div>
            <div className="divide-y text-xs">
              {topPages.slice(0, 8).map((page, idx) => (
                <div key={idx} className="py-2 flex items-center justify-between gap-3 hover:bg-muted/20 px-2 rounded-lg transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate text-foreground">{page.pageTitle || page.pageUrl}</p>
                    <p className="font-mono text-[10px] text-muted-foreground truncate">{page.pageUrl}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] shrink-0 font-bold">
                    {page.views.toLocaleString()} views ({page.percentage}%)
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

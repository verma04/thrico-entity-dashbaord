"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Analytics360SessionStats,
  Analytics360TopPage,
} from "@/graphql/analytics/analytics360";
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  Compass,
  Radio,
  FileText,
  Share2,
  ExternalLink,
  Laptop,
  Layers,
} from "lucide-react";

interface Customer360SessionsTabProps {
  sessions?: Analytics360SessionStats;
  loading?: boolean;
}

export function Customer360SessionsTab({
  sessions,
  loading,
}: Customer360SessionsTabProps) {
  if (loading && !sessions) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="p-4 space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <Skeleton className="h-48 w-full" />
          </Card>
          <Card className="p-6">
            <Skeleton className="h-48 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  const headlineStats = [
    {
      title: "Total Sessions",
      value: (sessions?.totalSessions ?? 0).toLocaleString(),
      icon: Compass,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      title: "Page Views",
      value: (sessions?.totalPageViews ?? 0).toLocaleString(),
      icon: FileText,
      color: "text-indigo-600 dark:text-indigo-400",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Total Visitors",
      value: (sessions?.totalUsers ?? 0).toLocaleString(),
      icon: Laptop,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      title: "Active Users Now",
      value: (sessions?.activeUsersNow ?? 0).toLocaleString(),
      icon: Radio,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10",
      isLive: true,
    },
  ];

  const devices = sessions?.devices || [];
  const browsers = sessions?.browsers || [];
  const sources = sessions?.sources || [];
  const deviceCategories = sessions?.deviceCategories || [];
  const countries = sessions?.countries || [];
  const topPages = sessions?.topPages || [];

  return (
    <div className="space-y-6">
      {/* 1. Headline Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {headlineStats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card
              key={idx}
              className="p-4 border-border/80 bg-card hover:shadow-sm transition-all relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </span>
                <div
                  className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color} relative`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {stat.isLive && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  )}
                </div>
              </div>
              <div className="mt-2.5 flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-foreground font-mono">
                  {stat.value}
                </span>
                {stat.isLive && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                  >
                    LIVE
                  </Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 2. Breakdowns: Devices, Browsers, Sources, Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Device OS */}
        <Card className="border-border/80 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
              <Monitor className="w-3.5 h-3.5 text-primary" />
              Operating System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {devices.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No OS data recorded
              </p>
            ) : (
              devices.slice(0, 5).map((d, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{d.deviceOs}</span>
                    <span className="font-mono text-muted-foreground">
                      {d.sessions} ({d.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${Math.min(100, d.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Browsers */}
        <Card className="border-border/80 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
              <Globe className="w-3.5 h-3.5 text-primary" />
              Browsers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {browsers.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No browser data recorded
              </p>
            ) : (
              browsers.slice(0, 5).map((b, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground">{b.browser}</span>
                    <span className="font-mono text-muted-foreground">
                      {b.sessions} ({b.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${Math.min(100, b.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="border-border/80 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
              <Share2 className="w-3.5 h-3.5 text-primary" />
              Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sources.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No source data recorded
              </p>
            ) : (
              sources.slice(0, 5).map((s, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-foreground truncate max-w-[130px]">
                      {s.source}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {s.sessions} ({s.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full"
                      style={{ width: `${Math.min(100, s.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Device Categories */}
        <Card className="border-border/80 bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wider text-muted-foreground">
              <Smartphone className="w-3.5 h-3.5 text-primary" />
              Device Types
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {deviceCategories.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No device categories recorded
              </p>
            ) : (
              deviceCategories.slice(0, 5).map((cat, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize text-foreground">
                      {cat.category}
                    </span>
                    <span className="font-mono text-muted-foreground">
                      {cat.sessions} ({cat.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{ width: `${Math.min(100, cat.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* 3. Countries & Top Visited Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Countries (1 col) */}
        <Card className="border-border/80 bg-card flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary" />
              Geographic Distribution
            </CardTitle>
            <CardDescription className="text-xs">
              Sessions by country
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-3">
            {countries.length === 0 ? (
              <p className="text-xs text-muted-foreground py-6 text-center">
                No country geolocation data available
              </p>
            ) : (
              countries.slice(0, 7).map((c, i) => (
                <div key={i} className="space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {c.countryCode && (
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] px-1 py-0"
                        >
                          {c.countryCode}
                        </Badge>
                      )}
                      <span className="font-medium text-foreground">{c.country}</span>
                    </div>
                    <span className="font-mono text-muted-foreground">
                      {c.sessions} ({c.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary/80 rounded-full"
                      style={{ width: `${Math.min(100, c.percentage)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Top Pages (2 cols) */}
        <Card className="lg:col-span-2 border-border/80 bg-card flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              Top Visited Pages & Content
            </CardTitle>
            <CardDescription className="text-xs">
              Highest-traffic destinations ranked by pageviews
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            {topPages.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground text-xs">
                <Layers className="w-8 h-8 opacity-30 mx-auto mb-2" />
                No page navigation records found.
              </div>
            ) : (
              <div className="divide-y divide-border/60">
                {topPages.slice(0, 10).map((page, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 hover:bg-muted/30 transition-colors flex items-center justify-between gap-4 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-mono text-muted-foreground w-4 text-right">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground truncate">
                          {page.pageTitle || page.pageUrl}
                        </p>
                        <p className="text-[11px] font-mono text-muted-foreground truncate">
                          {page.pageUrl}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <div className="text-right">
                        <span className="font-mono font-semibold text-foreground">
                          {page.views.toLocaleString()}
                        </span>
                        <span className="block text-[10px] text-muted-foreground">
                          views
                        </span>
                      </div>

                      <div className="w-16 hidden sm:block">
                        <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-muted-foreground">
                          <span>{page.percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${Math.min(100, page.percentage)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

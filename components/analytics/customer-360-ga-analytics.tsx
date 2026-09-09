"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Customer360GaAnalyticsData } from "@/graphql/analytics/customer360";
import {
  Globe,
  Monitor,
  Smartphone,
  Compass,
  ExternalLink,
  MapPin,
  Eye,
  MousePointerClick,
  Radio,
} from "lucide-react";

interface Customer360GaAnalyticsSectionProps {
  gaAnalytics?: Customer360GaAnalyticsData;
}

export function Customer360GaAnalyticsSection({ gaAnalytics }: Customer360GaAnalyticsSectionProps) {
  // If no web analytics recorded in DB for this member yet
  if (!gaAnalytics || (gaAnalytics.totalSessions === 0 && gaAnalytics.totalPageViews === 0)) {
    return (
      <Card className="border-dashed bg-muted/20">
        <CardContent className="p-6 text-center text-muted-foreground text-xs">
          No web or browser sessions recorded in ClickHouse for this member yet.
        </CardContent>
      </Card>
    );
  }

  const totalSessions = gaAnalytics.totalSessions ?? 0;
  const totalPageViews = gaAnalytics.totalPageViews ?? 0;
  const isCurrentlyOnline = gaAnalytics.isCurrentlyOnline ?? false;
  const firstTouch = gaAnalytics.firstTouch;
  const geoLocation = gaAnalytics.geoLocation;

  const devices = Array.isArray(gaAnalytics.devices) ? gaAnalytics.devices : [];
  const browsers = Array.isArray(gaAnalytics.browsers) ? gaAnalytics.browsers : [];
  const operatingSystems = Array.isArray(gaAnalytics.operatingSystems) ? gaAnalytics.operatingSystems : [];
  const topPages = Array.isArray(gaAnalytics.topPages) ? gaAnalytics.topPages : [];

  return (
    <div className="space-y-4">
      {/* ── Top Metric Header ── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600">
                <Globe className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  Web & App Analytics (GA4 Intelligence)
                  {isCurrentlyOnline ? (
                    <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] gap-1 px-2 py-0.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                      </span>
                      Active Now
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      Offline
                    </Badge>
                  )}
                </CardTitle>
                <CardDescription className="text-xs">
                  Real-time session, traffic acquisition, device, and pageview data
                </CardDescription>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MousePointerClick className="h-3.5 w-3.5 text-primary" />
                <span>
                  <strong className="text-foreground">{totalSessions.toLocaleString()}</strong> Sessions
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground border-l pl-4">
                <Eye className="h-3.5 w-3.5 text-blue-500" />
                <span>
                  <strong className="text-foreground">{totalPageViews.toLocaleString()}</strong> Pageviews
                </span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Traffic Acquisition */}
            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2.5">
              <h4 className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <Compass className="h-3.5 w-3.5 text-violet-500" /> Acquisition & Attribution
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Channel:</span>
                  <Badge variant="secondary" className="font-semibold text-[11px]">
                    {firstTouch?.channel || "Direct"}
                  </Badge>
                </div>
                {firstTouch?.source && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Source / Medium:</span>
                    <span className="font-medium text-foreground">
                      {firstTouch.source} / {firstTouch.medium || "(none)"}
                    </span>
                  </div>
                )}
                {firstTouch?.campaign && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Campaign:</span>
                    <span className="font-medium text-foreground">{firstTouch.campaign}</span>
                  </div>
                )}
                {firstTouch?.landingPage && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Landing Page:</span>
                    <span className="font-mono text-[11px] truncate max-w-[140px]" title={firstTouch.landingPage}>
                      {firstTouch.landingPage}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Platform & Environment */}
            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2.5">
              <h4 className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <Monitor className="h-3.5 w-3.5 text-blue-500" /> Technology & Devices
              </h4>
              <div className="space-y-2">
                {devices.length > 0 ? (
                  devices.map((d, i) => (
                    <div key={i} className="space-y-1 text-xs">
                      <div className="flex justify-between text-muted-foreground">
                        <span>{d.name}</span>
                        <span className="font-medium text-foreground">{d.percentage}%</span>
                      </div>
                      <Progress value={d.percentage} className="h-1.5" />
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">No device data</p>
                )}

                {browsers.length > 0 && (
                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground flex-wrap">
                    <span>Browsers:</span>
                    {browsers.map((b, i) => (
                      <Badge key={i} variant="outline" className="text-[10px] py-0 px-1.5">
                        {b.name} ({b.percentage}%)
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Location */}
            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2.5">
              <h4 className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" /> Geography & Demographics
              </h4>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Country:</span>
                  <span className="font-medium text-foreground">
                    {geoLocation?.country || "Not recorded"}
                  </span>
                </div>
                {geoLocation?.city && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">City / Region:</span>
                    <span className="font-medium text-foreground">
                      {geoLocation.city}{geoLocation.region ? `, ${geoLocation.region}` : ""}
                    </span>
                  </div>
                )}
                {geoLocation?.timezone && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Timezone:</span>
                    <span className="font-medium text-foreground">{geoLocation.timezone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Top Pages Visited */}
          {topPages && topPages.length > 0 && (
            <div className="p-3.5 rounded-xl border bg-muted/10 space-y-2">
              <h4 className="text-xs font-semibold text-foreground flex items-center justify-between">
                <span>Top Visited Pages</span>
                <span className="text-[11px] text-muted-foreground font-normal">
                  {topPages.length} paths recorded
                </span>
              </h4>
              <div className="divide-y text-xs">
                {topPages.map((p, idx) => (
                  <div key={idx} className="py-1.5 flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-foreground">{p.pageTitle || p.pageUrl}</p>
                      <p className="font-mono text-[10px] text-muted-foreground truncate">{p.pageUrl}</p>
                    </div>
                    <Badge variant="secondary" className="text-[10px] shrink-0 font-bold">
                      {p.viewsCount} views
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

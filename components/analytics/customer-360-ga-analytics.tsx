"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Customer360GaAnalyticsData } from "@/graphql/analytics/customer360";
import {
  Globe,
  Monitor,
  Smartphone,
  Compass,
  MapPin,
  Eye,
  MousePointerClick,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Customer360GaAnalyticsSectionProps {
  gaAnalytics?: Customer360GaAnalyticsData;
}

export function Customer360GaAnalyticsSection({ gaAnalytics }: Customer360GaAnalyticsSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  if (!gaAnalytics || (gaAnalytics.totalSessions === 0 && gaAnalytics.totalPageViews === 0)) {
    return (
      <Card className="border-dashed border-border/60 bg-muted/10">
        <CardContent className="p-3 text-center text-muted-foreground text-[11px]">
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
  const topPages = Array.isArray(gaAnalytics.topPages) ? gaAnalytics.topPages : [];

  return (
    <Card className="border border-border/60 shadow-xs overflow-hidden">
      {/* ── Compact Header ── */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/30 select-none transition-colors border-b border-border/40"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
            <Globe className="h-3.5 w-3.5" />
          </div>
          <h4 className="text-xs font-bold text-foreground">
            Web & App Analytics (GA4 Intelligence)
          </h4>

          {isCurrentlyOnline ? (
            <Badge className="bg-emerald-500 text-white text-[9px] gap-1 px-1.5 py-0 h-4.5 font-semibold">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
              </span>
              Active Now
            </Badge>
          ) : (
            <Badge variant="outline" className="text-[9px] h-4.5 text-muted-foreground px-1.5">
              Offline
            </Badge>
          )}

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground ml-1">
            <span className="inline-flex items-center gap-1">
              <MousePointerClick className="h-3 w-3 text-primary" />
              <strong className="text-foreground">{totalSessions.toLocaleString()}</strong> sessions
            </span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <Eye className="h-3 w-3 text-blue-500" />
              <strong className="text-foreground">{totalPageViews.toLocaleString()}</strong> views
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            {isExpanded ? "Collapse" : "Expand GA4"}
          </span>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md">
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <CardContent className="p-3 sm:p-4 space-y-3 animate-in fade-in-50 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
            {/* 1. Traffic Acquisition */}
            <div className="p-2.5 rounded-lg border border-border/50 bg-card/60 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Compass className="h-3 w-3 text-violet-500" /> Acquisition & Attribution
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground text-[11px]">Channel:</span>
                  <Badge variant="secondary" className="font-semibold text-[10px] h-4 px-1.5">
                    {firstTouch?.channel || "Direct"}
                  </Badge>
                </div>
                {firstTouch?.source && (
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground text-[11px]">Source / Medium:</span>
                    <span className="font-medium text-[11px] text-foreground truncate max-w-[130px]">
                      {firstTouch.source} / {firstTouch.medium || "(none)"}
                    </span>
                  </div>
                )}
                {firstTouch?.campaign && (
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground text-[11px]">Campaign:</span>
                    <span className="font-medium text-[11px] text-foreground truncate max-w-[130px]">
                      {firstTouch.campaign}
                    </span>
                  </div>
                )}
                {firstTouch?.landingPage && (
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground text-[11px]">Landing Page:</span>
                    <span className="font-mono text-[10px] truncate max-w-[130px] text-muted-foreground" title={firstTouch.landingPage}>
                      {firstTouch.landingPage}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Platform & Environment */}
            <div className="p-2.5 rounded-lg border border-border/50 bg-card/60 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Monitor className="h-3 w-3 text-blue-500" /> Technology & Devices
              </span>
              <div className="space-y-1.5">
                {devices.length > 0 ? (
                  devices.map((d, i) => (
                    <div key={i} className="space-y-0.5 text-xs">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>{d.name}</span>
                        <span className="font-bold tabular-nums text-foreground">{d.percentage}%</span>
                      </div>
                      <Progress value={d.percentage} className="h-1" />
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-muted-foreground">No device data</p>
                )}

                {browsers.length > 0 && (
                  <div className="pt-1 flex items-center gap-1 text-[10px] text-muted-foreground flex-wrap">
                    <span>Browsers:</span>
                    {browsers.map((b, i) => (
                      <Badge key={i} variant="outline" className="text-[9px] py-0 px-1 h-3.5 border-border/50">
                        {b.name} ({b.percentage}%)
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. Location & Demographics */}
            <div className="p-2.5 rounded-lg border border-border/50 bg-card/60 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3 text-emerald-500" /> Geography & Demographics
              </span>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center py-0.5">
                  <span className="text-muted-foreground text-[11px]">Country:</span>
                  <span className="font-medium text-[11px] text-foreground">
                    {geoLocation?.country || "Not recorded"}
                  </span>
                </div>
                {geoLocation?.city && (
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground text-[11px]">City / Region:</span>
                    <span className="font-medium text-[11px] text-foreground">
                      {geoLocation.city}{geoLocation.region ? `, ${geoLocation.region}` : ""}
                    </span>
                  </div>
                )}
                {geoLocation?.timezone && (
                  <div className="flex justify-between items-center py-0.5">
                    <span className="text-muted-foreground text-[11px]">Timezone:</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{geoLocation.timezone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 4. Top Visited Pages (Compact Table Design) */}
          {topPages && topPages.length > 0 && (
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <div className="p-2 px-3 bg-muted/20 border-b border-border/40 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Top Visited Pages
                </span>
                <span className="text-[10px] text-muted-foreground">
                  {topPages.length} paths recorded
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/40 text-[10px] uppercase text-muted-foreground font-semibold bg-muted/10">
                      <th className="py-1.5 px-3">Page / Path</th>
                      <th className="py-1.5 px-3 text-right">Views</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {topPages.map((p, idx) => (
                      <tr key={idx} className="hover:bg-muted/30 transition-colors">
                        <td className="py-1.5 px-3">
                          <p className="font-medium text-[11px] text-foreground truncate max-w-md">
                            {p.pageTitle || p.pageUrl}
                          </p>
                          {p.pageTitle && (
                            <p className="font-mono text-[9px] text-muted-foreground truncate max-w-md">
                              {p.pageUrl}
                            </p>
                          )}
                        </td>
                        <td className="py-1.5 px-3 text-right">
                          <Badge variant="secondary" className="text-[10px] font-bold tabular-nums h-4 px-1.5">
                            {p.viewsCount} views
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

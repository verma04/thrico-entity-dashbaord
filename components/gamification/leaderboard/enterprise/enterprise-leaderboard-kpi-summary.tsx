"use client";

import React from "react";
import {
  Trophy,
  ShieldCheck,
  Globe,
  Gauge,
  TrendingUp,
  Radio,
  Server,
  Code2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  EnterpriseLeaderboardConfig,
  EnterpriseClient,
} from "@/graphql/actions/enterprise-leaderboard";

interface EnterpriseLeaderboardKpiSummaryProps {
  leaderboards: EnterpriseLeaderboardConfig[];
  client: EnterpriseClient | null;
  loading?: boolean;
  onNavigateTab?: (tab: string) => void;
}

export function EnterpriseLeaderboardKpiSummary({
  leaderboards,
  client,
  loading = false,
  onNavigateTab,
}: EnterpriseLeaderboardKpiSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs rounded-[8px]"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24 rounded-[3px]" />
                <Skeleton className="h-7 w-7 rounded-[4px]" />
              </div>
              <Skeleton className="h-6 w-28 rounded-[3px]" />
              <Skeleton className="h-2.5 w-3/4 rounded-[3px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const activeLeaderboards = leaderboards.filter((l) => l.status === "ACTIVE").length;
  const isClientActive = !!client?.isActive;
  const domainCount = client?.allowedDomains?.length || 0;
  const rateLimit = client?.rateLimitPerMinute || 3000;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total Configured Leaderboards */}
      <Card
        onClick={() => onNavigateTab?.("leaderboards")}
        className="border-border/60 bg-card shadow-2xs hover:border-amber-300 dark:hover:border-amber-700/60 transition-all cursor-pointer group"
      >
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
              Leaderboards
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-100 dark:border-amber-900/40 shadow-xs">
              <Trophy className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground tracking-tight">
                {leaderboards.length}
              </span>
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300 rounded-[3px]"
              >
                {activeLeaderboards} Active
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-amber-500 shrink-0" />
              <span>Headless & embed ranking instances</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Headless Client Authentication */}
      <Card
        onClick={() => onNavigateTab?.("credentials")}
        className="border-border/60 bg-card shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-all cursor-pointer group"
      >
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
              Client Authentication
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40 shadow-xs">
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2 min-w-0">
              <span
                className={`text-base font-bold tracking-tight truncate ${
                  isClientActive
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-rose-600 dark:text-rose-400"
                }`}
              >
                {isClientActive ? "Live & Provisioned" : "Client Suspended"}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1 font-mono">
              <Server className="h-3 w-3 text-emerald-500 shrink-0" />
              <span className="truncate">
                {client?.clientId ? `key: ${client.clientId.slice(0, 16)}…` : "Credentials ready"}
              </span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. CORS & Allowed Domains */}
      <Card
        onClick={() => onNavigateTab?.("domains")}
        className="border-border/60 bg-card shadow-2xs hover:border-blue-300 dark:hover:border-blue-700/60 transition-all cursor-pointer group"
      >
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
              Allowed Domains (CORS)
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 shadow-xs">
              <Globe className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                {domainCount}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                Origins approved
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <Radio className="h-3 w-3 text-blue-500 shrink-0" />
              <span>Cross-origin web embed access</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Throughput Rate Limit */}
      <Card
        onClick={() => onNavigateTab?.("embed")}
        className="border-border/60 bg-card shadow-2xs hover:border-purple-300 dark:hover:border-purple-700/60 transition-all cursor-pointer group"
      >
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
              Throughput Rate Limit
            </span>
            <div className="h-7 w-7 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/40 shadow-xs">
              <Gauge className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">
                {rateLimit.toLocaleString()}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                req / min
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <Code2 className="h-3 w-3 text-purple-500 shrink-0" />
              <span>Redis pipeline & CDN cached</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EnterpriseLeaderboardKpiSummary;

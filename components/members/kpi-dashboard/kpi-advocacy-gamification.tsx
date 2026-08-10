"use client";

import React from "react";
import {
  Heart,
  Star,
  Zap,
  Trophy,
  Crown,
} from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

const kpis = [
  {
    title: "Advocacy Index",
    key: "communityAdvocacyIndex" as const,
    icon: Heart,
    tooltip: "Composite score (0–100): 0.4 × Referral + 0.35 × Reshare + 0.25 × Review",
    colorScheme: "rose" as const,
  },
  {
    title: "Superfan %",
    key: "superfanRatio" as const,
    icon: Star,
    suffix: "%",
    tooltip: "(Top 10% engagement for 3+ months ÷ Active Members) × 100",
    colorScheme: "orange" as const,
  },
  {
    title: "Points Issued",
    key: "gamificationPointsEarned" as const,
    icon: Zap,
    tooltip: "SUM(points_awarded WHERE awarded_at IN period)",
    colorScheme: "indigo" as const,
    href: "/gamification/points-and-badges/points",
  },
  {
    title: "Badges Earned",
    key: "badgesEarned" as const,
    icon: Trophy,
    tooltip: "COUNT(badge_awards WHERE awarded_at IN period)",
    colorScheme: "purple" as const,
  },
  {
    title: "Leaderboard Players",
    key: "leaderboardParticipants" as const,
    icon: Crown,
    tooltip: "COUNT(DISTINCT member_id WHERE appeared_on_leaderboard = true)",
    colorScheme: "sky" as const,
    href: "/gamification/leaderboard",
  },
];

interface KPIAdvocacyGamificationProps {
  loading: boolean;
  data: Record<string, StatValue | undefined>;
}

export function KPIAdvocacyGamification({ loading, data }: KPIAdvocacyGamificationProps) {
  // Special rendering for advocacy index gauge
  const advocacyMetric = data["communityAdvocacyIndex"];
  const advocacyValue = Number(advocacyMetric?.value ?? 0);

  return (
    <div className="space-y-4">
      {/* Advocacy Index Gauge */}
      <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
            <Heart className="h-3 w-3 text-white" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] leading-none">
              Composite Score
            </p>
            <p className="text-sm font-semibold text-foreground leading-tight">
              Advocacy Index
            </p>
          </div>
          <span className="ml-auto text-2xl font-extrabold text-foreground tabular-nums">
            {loading ? "..." : advocacyValue}
            <span className="text-xs text-muted-foreground font-medium ml-0.5">/100</span>
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 transition-all duration-700 ease-out"
            style={{ width: `${Math.min(advocacyValue, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">Low</span>
          <span className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">High</span>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.slice(1).map((kpi) => {
          const metric = data[kpi.key];
          return (
            <EcosystemKPI
              key={kpi.key}
              title={kpi.title}
              value={loading ? "..." : (metric?.value ?? "0")}
              trend={metric?.change ?? 0}
              trendData={metric?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
              icon={kpi.icon}
              colorScheme={kpi.colorScheme}
              suffix={(kpi as any).suffix}
              tooltip={kpi.tooltip}
              href={(kpi as any).href}
            />
          );
        })}
      </div>
    </div>
  );
}

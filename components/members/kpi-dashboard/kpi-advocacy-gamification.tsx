"use client";

import React from "react";
import { Heart, Star, Zap, Trophy, Crown } from "lucide-react";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import type { StatValue } from "@/graphql/actions/member-kpi-dashboard";

const advocacyGamificationKPIs = [
  {
    title: "Advocacy Index",
    key: "communityAdvocacyIndex",
    icon: Heart,
    color: "bg-rose-500",
    tooltip: "Composite 0–100: 0.4 × Referral + 0.35 × Reshare + 0.25 × Review",
  },
  {
    title: "Superfan %",
    key: "superfanRatio",
    icon: Star,
    color: "bg-amber-500",
    suffix: "%",
    tooltip: "(Top 10% engagement for 3+ months ÷ Active Members) × 100",
  },
  {
    title: "Points Issued",
    key: "gamificationPointsEarned",
    icon: Zap,
    color: "bg-indigo-500",
    tooltip: "SUM(points_awarded WHERE awarded_at IN period)",
    href: "/gamification/points-and-badges/points",
  },
  {
    title: "Badges Earned",
    key: "badgesEarned",
    icon: Trophy,
    color: "bg-purple-500",
    tooltip: "COUNT(badge_awards WHERE awarded_at IN period)",
  },
  {
    title: "Leaderboard Players",
    key: "leaderboardParticipants",
    icon: Crown,
    color: "bg-cyan-500",
    tooltip: "COUNT(DISTINCT member_id WHERE appeared_on_leaderboard = true)",
    href: "/gamification/points-and-badges/leaderboard",
  },
];

interface KPIAdvocacyGamificationProps {
  loading: boolean;
  getMetric: (key: string) => StatValue;
}

export function KPIAdvocacyGamification({
  loading,
  getMetric,
}: KPIAdvocacyGamificationProps) {
  const advocacyValue = Number(getMetric("communityAdvocacyIndex")?.value ?? 0);

  return (
    <section id="kpi-section-advocacy" className="space-y-3 mt-20 scroll-mt-24">
      <DashboardSectionHeading title="ADVOCACY & GAMIFICATION" />

      {/* Advocacy Index gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                <Heart className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-none">
                  Composite Score
                </p>
                <p className="text-sm font-semibold text-foreground leading-tight">
                  Advocacy Index
                </p>
              </div>
              <span className="ml-auto text-2xl font-extrabold text-foreground tabular-nums">
                {loading ? "..." : advocacyValue}
                <span className="text-xs text-muted-foreground font-medium ml-0.5">
                  /100
                </span>
              </span>
            </div>
            <div className="h-2 w-full bg-muted/50 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-violet-500 transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(advocacyValue, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between mt-1.5">
              <span className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">
                Low
              </span>
              <span className="text-[9px] text-muted-foreground/50 font-bold uppercase tracking-wider">
                High
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {advocacyGamificationKPIs.slice(1).map((v) => {
            const item = getMetric(v.key);
            return (
              <EcosystemKPI
                key={v.key}
                title={v.title}
                value={loading ? "..." : (item?.value ?? "0")}
                trend={item?.change ?? 0}
                trendData={item?.trend ?? [0, 0, 0, 0, 0, 0, 0]}
                icon={v.icon}
                color={v.color}
                suffix={(v as any).suffix}
                tooltip={v.tooltip}
                href={(v as any).href}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

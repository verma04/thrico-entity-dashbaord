"use client";

import React from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Award,
  Trophy,
  Calendar,
  Users,
  Zap,
  Star,
  History,
  ScrollText,
  ShieldCheck,
  Activity,
  LayoutGrid,
  Sparkles,
  ArrowRight,
  Settings,
  Flame,
} from "lucide-react";
import Link from "next/link";
import {
  useGetGamificationStats,
  useGetPointRules,
  useGetBadges,
  useGetRanks,
} from "@/graphql/actions";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function GamificationOverview() {
  const { reloginConfig, settings } = useGamificationStore();

  const { data: statsData, loading: statsLoading } = useGetGamificationStats();
  const { data: rulesData, loading: rulesLoading } = useGetPointRules();
  const { data: badgesData, loading: badgesLoading } = useGetBadges();
  const { data: ranksData, loading: ranksLoading } = useGetRanks();

  const gamificationStats = statsData?.getGamificationStats;
  const pointRules = rulesData?.getPointRules || [];
  const badges = badgesData?.getBadges || [];
  const ranks = ranksData?.getRanks || [];

  const isLoading =
    statsLoading || rulesLoading || badgesLoading || ranksLoading;

  const stats = [
    {
      title: "Point Rules",
      value: isLoading ? "..." : pointRules.length,
      active: gamificationStats?.activePointRules ?? 0,
      icon: TrendingUp,
      href: "/gamification/points",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      title: "Badges",
      value: isLoading ? "..." : badges.length,
      active: gamificationStats?.activeBadges ?? 0,
      icon: Award,
      href: "/gamification/badges",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      title: "Ranks",
      value: isLoading ? "..." : ranks.length,
      active: gamificationStats?.activeRanks ?? 0,
      icon: Trophy,
      href: "/gamification/ranks",
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
    {
      title: "Streak Bonuses",
      value: reloginConfig.streakBonuses.length,
      active: reloginConfig.isEnabled ? reloginConfig.streakBonuses.length : 0,
      icon: Calendar,
      href: "/gamification/relogin",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="gamification-center">
      <EcosystemHeader
        title="Meta Protocol"
        badgeText="Gamification Hub"
        description="Strategic engine for community engagement. Orchestrate points, badges, and ranks to drive high-value archetypal behaviors."
        icon={Trophy}
      />

      <EcosystemActionBar shadow="none">
        <EcosystemActionBar.Group>
          <EcosystemActionBar.Item>
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "h-3 w-3 rounded-full animate-pulse",
                  settings.isEnabled
                    ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                    : "bg-slate-400",
                )}
              />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                Platform {settings.isEnabled ? "Energized" : "Static"}
              </span>
            </div>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Separator />
          <EcosystemActionBar.Item>
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />
              <span>Invariants Locked</span>
            </div>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>

        <EcosystemActionBar.Group align="right">
          <EcosystemActionBar.Item>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mr-2">
              Cycles: {new Date().toLocaleDateString()}
            </p>
          </EcosystemActionBar.Item>
          <EcosystemActionBar.Item>
            <Button
              variant="outline"
              className="h-10 px-4 rounded-xl border-slate-200 font-bold hover:bg-slate-50 transition-all gap-2"
            >
              <Activity className="h-4 w-4 text-emerald-500" />
              Live telemetry
            </Button>
          </EcosystemActionBar.Item>
        </EcosystemActionBar.Group>
      </EcosystemActionBar>

      <EcosystemContainer className="space-y-12 p-8 lg:p-12">
        {/* Global Performance Matrix */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-100">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
                Yield Analytics
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">
                Foundational platform metrics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <Users className="h-20 w-20 text-indigo-500" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Engaged Entities
                </p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                  {statsLoading
                    ? "..."
                    : (gamificationStats?.totalUsers?.toLocaleString() ?? 0)}
                </h3>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-emerald-600 uppercase">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Stable Population
                </div>
              </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-slate-900 shadow-2xl shadow-indigo-900/10 group hover:translate-y-[-4px] transition-all duration-500 overflow-hidden relative border border-white/5">
              <div className="absolute top-0 right-0 p-8 opacity-10 scale-150 -rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <Zap className="h-20 w-20 text-amber-500" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Points Manifested
                </p>
                <h3 className="text-4xl font-black text-white tracking-tighter">
                  {statsLoading
                    ? "..."
                    : (gamificationStats?.totalPointsAwarded?.toLocaleString() ??
                      0)}
                </h3>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-amber-500 uppercase">
                  <Flame className="h-3.5 w-3.5 fill-amber-500" />
                  Active Issuance
                </div>
              </div>
            </div>

            <div className="p-10 rounded-[3rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 group hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                <Award className="h-20 w-20 text-purple-500" />
              </div>
              <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                  Badges Achieved
                </p>
                <h3 className="text-4xl font-black text-slate-900 tracking-tighter">
                  {statsLoading
                    ? "..."
                    : (gamificationStats?.totalBadgesEarned?.toLocaleString() ??
                      0)}
                </h3>
                <div className="mt-6 flex items-center gap-2 text-[10px] font-bold text-purple-600 uppercase">
                  <Star className="h-3.5 w-3.5 fill-purple-600" />
                  Legacy Expansion
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gamificationStats?.mostPopularBadge && (
              <div className="p-8 rounded-[2.5rem] bg-indigo-50/50 border border-indigo-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 border-dashed">
                <div className="flex items-center gap-8">
                  <div className="h-20 w-20 bg-white rounded-3xl flex items-center justify-center shadow-xl border border-slate-100 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 text-5xl">
                    {gamificationStats.mostPopularBadge.icon || "🏆"}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-2">
                      Archetypal Favorite
                    </p>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
                      {gamificationStats.mostPopularBadge.name}
                    </h4>
                  </div>
                </div>
                <div className="h-10 px-6 rounded-xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest flex items-center shadow-lg shadow-indigo-200">
                  Elite Status
                </div>
              </div>
            )}

            {gamificationStats?.topRank && (
              <div className="p-8 rounded-[2.5rem] bg-orange-50/50 border border-orange-100 flex items-center justify-between group hover:bg-white hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-500 border-dashed">
                <div className="flex items-center gap-8">
                  <div
                    className="h-20 w-20 rounded-3xl flex items-center justify-center shadow-xl border border-slate-100 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500"
                    style={{
                      backgroundColor: `${gamificationStats.topRank.color}15`,
                    }}
                  >
                    <Trophy
                      className="h-10 w-10"
                      style={{ color: gamificationStats.topRank.color }}
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.3em] mb-2">
                      Max Prestige Target
                    </p>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
                      {gamificationStats.topRank.name}
                    </h4>
                  </div>
                </div>
                <div
                  className="h-10 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center shadow-lg shadow-orange-100"
                  style={{
                    backgroundColor: gamificationStats.topRank.color,
                    color: "white",
                  }}
                >
                  Top Invariant
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modules Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-white">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">
                Subsystem Matrix
              </h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">
                Configurable engagement vectors
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <Link key={stat.title} href={stat.href} className="group">
                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm group-hover:shadow-2xl group-hover:translate-y-[-8px] group-hover:border-slate-200 transition-all duration-500 relative overflow-hidden">
                  <div
                    className={cn(
                      "inline-flex p-4 rounded-2xl mb-6 transition-all duration-500 group-hover:scale-110",
                      stat.bg,
                    )}
                  >
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {stat.title}
                  </h4>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-black text-slate-900">
                      {stat.value}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-black uppercase tracking-tighter opacity-60",
                        stat.color,
                      )}
                    >
                      {stat.active} Active
                    </span>
                  </div>
                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      Adjust Logic
                    </span>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Binary Systems & Utilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* System configuration */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="h-5 w-5 text-slate-900" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">
                Atomic Settings
              </h3>
            </div>
            <div className="p-10 rounded-[3.5rem] bg-slate-900 border border-white/5 space-y-6">
              <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  CORE ENGINE STATE
                </span>
                <div
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                    settings.isEnabled
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-700 text-slate-400",
                  )}
                >
                  {settings.isEnabled ? "Energized" : "Offline"}
                </div>
              </div>
              <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  LOGIN YIELD SYSTEM
                </span>
                <div
                  className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest",
                    reloginConfig.isEnabled
                      ? "bg-indigo-500 text-white"
                      : "bg-slate-700 text-slate-400",
                  )}
                >
                  {reloginConfig.isEnabled ? "Stable" : "Locked"}
                </div>
              </div>
              <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  DAILY EMISSION CAP
                </span>
                <div className="flex items-center gap-2 font-black text-white text-xl">
                  {settings.dailyPointsCap || "∞"}{" "}
                  <span className="text-[10px] text-slate-500 uppercase">
                    TC
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  POINT DECAY PROTOCOL
                </span>
                <Badge
                  variant={settings.pointDecayEnabled ? "default" : "outline"}
                  className={cn(
                    "rounded-lg font-black text-[10px] uppercase",
                    settings.pointDecayEnabled
                      ? "bg-rose-500"
                      : "border-slate-700 text-slate-500",
                  )}
                >
                  {settings.pointDecayEnabled ? "DESTRUCTIVE" : "PRESERVATIVE"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Utilities */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-slate-900" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight italic uppercase">
                Utility Nodes
              </h3>
            </div>
            <div className="space-y-6">
              <Link href="/gamification/leaderboard">
                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-amber-200 group transition-all duration-500 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Trophy className="h-7 w-7 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">
                        Consolidated Leaderboard
                      </h4>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">
                        Audit high-tier entity performance
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-amber-500 group-hover:translate-x-2 transition-all" />
                </div>
              </Link>
              <Link href="/gamification/activity-log">
                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-emerald-200 group transition-all duration-500 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <History className="h-7 w-7 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">
                        Archival Logs
                      </h4>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">
                        Audit temporal emission events
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-2 transition-all" />
                </div>
              </Link>
              <Link href="/gamification/settings">
                <div className="p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 group transition-all duration-500 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <Settings className="h-7 w-7 text-indigo-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 tracking-tight italic uppercase">
                        System Control
                      </h4>
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">
                        Adjust global emission invariants
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-2 transition-all" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

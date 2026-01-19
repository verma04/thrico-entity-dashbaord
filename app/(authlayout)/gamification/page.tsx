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
} from "lucide-react";
import Link from "next/link";
import {
  useGetGamificationStats,
  useGetPointRules,
  useGetBadges,
  useGetRanks,
} from "@/graphql/actions";

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
      color: "text-yellow-500",
    },
    {
      title: "Badges",
      value: isLoading ? "..." : badges.length,
      active: gamificationStats?.activeBadges ?? 0,
      icon: Award,
      href: "/gamification/badges",
      color: "text-purple-500",
    },
    {
      title: "Ranks",
      value: isLoading ? "..." : ranks.length,
      active: gamificationStats?.activeRanks ?? 0,
      icon: Trophy,
      href: "/gamification/ranks",
      color: "text-orange-500",
    },
    {
      title: "Streak Bonuses",
      value: reloginConfig.streakBonuses.length,
      active: reloginConfig.isEnabled ? reloginConfig.streakBonuses.length : 0,
      icon: Calendar,
      href: "/gamification/relogin",
      color: "text-blue-500",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Global Performance Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" /> Platform Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 border-blue-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-600/80">
                    Total Participants
                  </p>
                  <p className="text-3xl font-bold text-blue-900 font-mono">
                    {statsLoading
                      ? "..."
                      : (gamificationStats?.totalUsers ?? 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-500/20 rounded-xl">
                  <Zap className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-yellow-600/80">
                    Points Distributed
                  </p>
                  <p className="text-3xl font-bold text-yellow-900 font-mono">
                    {statsLoading
                      ? "..."
                      : (gamificationStats?.totalPointsAwarded?.toLocaleString() ??
                        0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-100">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Award className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-600/80">
                    Badges Earned
                  </p>
                  <p className="text-3xl font-bold text-purple-900 font-mono">
                    {statsLoading
                      ? "..."
                      : (gamificationStats?.totalBadgesEarned ?? 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gamificationStats?.mostPopularBadge && (
            <Card className="border-dashed border-2 bg-muted/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm border">
                    <span className="text-xl">
                      {gamificationStats.mostPopularBadge.icon || "🏆"}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Most Popular Badge
                    </p>
                    <p className="font-bold">
                      {gamificationStats.mostPopularBadge.name}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white">
                  Community Favorite
                </Badge>
              </CardContent>
            </Card>
          )}

          {gamificationStats?.topRank && (
            <Card className="border-dashed border-2 bg-muted/30">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-full flex items-center justify-center shadow-sm border"
                    style={{
                      backgroundColor: `${gamificationStats.topRank.color}20`,
                    }}
                  >
                    <Star
                      className="h-6 w-6"
                      style={{ color: gamificationStats.topRank.color }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                      Target Prestige
                    </p>
                    <p className="font-bold">
                      {gamificationStats.topRank.name}
                    </p>
                  </div>
                </div>
                <Badge
                  style={{
                    backgroundColor: gamificationStats.topRank.color,
                    color: "white",
                  }}
                >
                  Top Tier
                </Badge>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-orange-500" /> Module Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">
                        {stat.active} active
                      </p>
                    </div>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" /> System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Gamification System</span>
              <Badge variant={settings.isEnabled ? "default" : "secondary"}>
                {settings.isEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Login Rewards</span>
              <Badge
                variant={reloginConfig.isEnabled ? "default" : "secondary"}
              >
                {reloginConfig.isEnabled ? "Enabled" : "Disabled"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Daily Points Cap</span>
              <span className="font-medium">
                {settings.dailyPointsCap || "∞"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Point Decay</span>
              <Badge
                variant={settings.pointDecayEnabled ? "destructive" : "outline"}
              >
                {settings.pointDecayEnabled ? "Active" : "Off"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" /> Quick Links
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link
              href="/gamification/leaderboard"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="font-medium">Leaderboard</p>
                <p className="text-xs text-muted-foreground">View top users</p>
              </div>
            </Link>
            <Link
              href="/gamification/settings"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted transition-colors"
            >
              <Zap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="font-medium">Settings</p>
                <p className="text-xs text-muted-foreground">
                  Configure limits & decay
                </p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { useGamificationStore } from "@/store/useGamificationStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Award, Trophy, Calendar, Users, Zap } from "lucide-react";
import Link from "next/link";

export default function GamificationOverview() {
  const { pointRules, badges, ranks, reloginConfig, settings } =
    useGamificationStore();

  const stats = [
    {
      title: "Point Rules",
      value: pointRules.length,
      active: pointRules.filter((r) => r.isActive).length,
      icon: TrendingUp,
      href: "/gamification/points",
      color: "text-yellow-500",
    },
    {
      title: "Badges",
      value: badges.length,
      active: badges.filter((b) => b.isActive).length,
      icon: Award,
      href: "/gamification/badges",
      color: "text-purple-500",
    },
    {
      title: "Ranks",
      value: ranks.length,
      active: ranks.filter((r) => r.isActive).length,
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
    <div className="space-y-6">
      {/* Stats Grid */}
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Zap className="h-5 w-5" /> System Status
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
              <Users className="h-5 w-5" /> Quick Links
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

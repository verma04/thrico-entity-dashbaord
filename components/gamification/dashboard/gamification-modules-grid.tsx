"use client";

import React from "react";
import Link from "next/link";
import {
  Coins,
  Award,
  Crown,
  Trophy,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GamificationModulesGridProps {
  pointRulesCount?: number;
  badgesCount?: number;
  ranksCount?: number;
  topRankName?: string;
  loading?: boolean;
}

export const GamificationModulesGrid: React.FC<GamificationModulesGridProps> = ({
  pointRulesCount = 8,
  badgesCount = 14,
  ranksCount = 5,
  topRankName = "Grandmaster",
  loading = false,
}) => {
  const cards = [
    {
      id: "points",
      name: "Points & Token Rules",
      subtitle: "Earning Triggers & Multipliers",
      description: "Define how members earn points across feed, events, polls, and custom API webhooks with daily rate caps.",
      icon: Coins,
      href: "/gamification/points-and-badges/points",
      badge: `${pointRulesCount} Rules`,
      borderHover: "hover:border-amber-500/50 hover:shadow-amber-500/10",
      iconBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
      badgeBg: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
      btnClass: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20",
      stats: [
        { label: "Active", value: pointRulesCount.toString() },
        { label: "Daily Cap", value: "Enabled" },
        { label: "Decay", value: "Active" },
      ],
      highlights: [
        "Post, comment & reaction triggers",
        "Streak bonuses & event RSVPs",
        "Role-based multipliers",
      ],
    },
    {
      id: "badges",
      name: "Achievement Badges",
      subtitle: "Visual Credentials & Honors",
      description: "Award collectible digital badges for milestones, longevity, top contributions, and exclusive event participation.",
      icon: Award,
      href: "/gamification/points-and-badges/badges",
      badge: `${badgesCount} Badges`,
      borderHover: "hover:border-purple-500/50 hover:shadow-purple-500/10",
      iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
      badgeBg: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
      btnClass: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20",
      stats: [
        { label: "Total", value: badgesCount.toString() },
        { label: "Rarity", value: "4 Tiers" },
        { label: "Auto Grant", value: "Instant" },
      ],
      highlights: [
        "Bronze, Silver, Gold, Platinum",
        "Profile flair & hover popovers",
        "Automated milestone criteria",
      ],
    },
    {
      id: "ranks",
      name: "Tier Progression & Ranks",
      subtitle: "Level Progression & Status",
      description: "Establish ascending tier levels with custom color badges, icons, point thresholds, and special member privileges.",
      icon: Crown,
      href: "/gamification/points-and-badges/ranks",
      badge: `${ranksCount} Tiers`,
      borderHover: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
      iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
      badgeBg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
      btnClass: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20",
      stats: [
        { label: "Levels", value: ranksCount.toString() },
        { label: "Top Rank", value: topRankName },
        { label: "Ladder", value: "Thresholds" },
      ],
      highlights: [
        "Automated level promotions",
        "Custom hex rank badge colors",
        "Exclusive channel access",
      ],
    },
    {
      id: "competitions",
      name: "Leaderboard & Sprints",
      subtitle: "Competitive Community Ranking",
      description: "Engage members with real-time seasonal leaderboards, monthly sprints, and top contributor spotlights.",
      icon: Trophy,
      href: "/gamification/points-and-badges/leaderboard",
      badge: "Live Board",
      borderHover: "hover:border-rose-500/50 hover:shadow-rose-500/10",
      iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
      badgeBg: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
      btnClass: "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20",
      stats: [
        { label: "Scope", value: "Global / Entity" },
        { label: "Medals", value: "🥇 🥈 🥉" },
        { label: "Cycles", value: "7D / 30D" },
      ],
      highlights: [
        "All-time & periodic ranking",
        "Member profile hover cards",
        "Top performer rewards sync",
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className={cn(
              "group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-4 transition-all duration-200 shadow-xs hover:shadow-sm",
              card.borderHover
            )}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center border shrink-0 transition-transform duration-200 group-hover:scale-105",
                    card.iconBg
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>

                <span
                  className={cn(
                    "inline-block text-[8px] font-bold px-1.5 py-0.2 rounded-full border shrink-0",
                    card.badgeBg
                  )}
                >
                  {card.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {card.name}
                </h3>
                <p className="text-[10px] text-muted-foreground leading-snug mt-1">
                  {card.description}
                </p>
              </div>

              {/* Stats Box */}
              <div className="grid grid-cols-3 gap-1 p-1.5 rounded-lg bg-muted/40 border border-border/50 text-center">
                {card.stats.map((stat, i) => (
                  <div key={i} className="space-y-0.2">
                    <span className="text-[11px] font-extrabold text-foreground block tabular-nums leading-tight truncate">
                      {stat.value}
                    </span>
                    <span className="text-[8px] font-medium text-muted-foreground uppercase tracking-tight block leading-tight truncate">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Highlights */}
              <div className="space-y-0.5 pt-0.5">
                {card.highlights.map((hl, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 text-[10px] font-medium text-foreground/80"
                  >
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{hl}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="pt-3 mt-2.5 border-t border-border/50">
              <Link href={card.href} className="block w-full">
                <Button
                  className={cn(
                    "w-full h-7.5 rounded-lg font-bold text-[11px] gap-1 shadow-2xs transition-all group/btn cursor-pointer",
                    card.btnClass
                  )}
                >
                  Manage {card.name.split(" ")[0]}
                  <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
};

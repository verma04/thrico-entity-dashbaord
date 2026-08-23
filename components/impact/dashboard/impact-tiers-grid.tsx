"use client";

import React from "react";
import Link from "next/link";
import {
  Crown,
  Award,
  Sparkles,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImpactTiersGridProps {
  totalUsersCount?: number;
}

export function ImpactTiersGrid({ totalUsersCount = 148 }: ImpactTiersGridProps) {
  const tiers = [
    {
      id: "platinum",
      name: "Platinum Tier",
      range: "800+ pts",
      badge: "Top 5%",
      icon: Crown,
      description: "Highest tier of influence, authority, and leadership.",
      borderHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      badgeBg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
      btnClass: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20",
      membersCount: 8,
      perks: [
        "Advisory council access",
        "Exclusive host privileges",
        "Platinum badge flair",
      ],
    },
    {
      id: "gold",
      name: "Gold Tier",
      range: "500 - 799 pts",
      badge: "Top 20%",
      icon: Award,
      description: "Consistent high-value contributors & organizers.",
      borderHover: "hover:border-indigo-500/50 hover:shadow-indigo-500/10",
      iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
      badgeBg: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
      btnClass: "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20",
      membersCount: 32,
      perks: [
        "Priority Q&A highlight",
        "Custom forum reaction flairs",
        "VIP event invites",
      ],
    },
    {
      id: "silver",
      name: "Silver Tier",
      range: "250 - 499 pts",
      badge: "Active",
      icon: Sparkles,
      description: "Regular active members engaging in discussions.",
      borderHover: "hover:border-purple-500/50 hover:shadow-purple-500/10",
      iconBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
      badgeBg: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
      btnClass: "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-600/20",
      membersCount: 64,
      perks: [
        "Silver profile ring",
        "Access to peer groups",
        "Weekly streak boost",
      ],
    },
    {
      id: "bronze",
      name: "Bronze Tier",
      range: "0 - 249 pts",
      badge: "Discovery",
      icon: Users,
      description: "New and onboarding members discovering the community.",
      borderHover: "hover:border-slate-400/50 hover:shadow-slate-400/10",
      iconBg: "bg-muted text-muted-foreground border-border",
      badgeBg: "bg-muted text-muted-foreground border-border",
      btnClass: "bg-muted-foreground hover:bg-foreground text-background",
      membersCount: 44,
      perks: [
        "Welcome bonus pack",
        "Community feed access",
        "Starter challenge quests",
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {tiers.map((tier) => {
        const Icon = tier.icon;

        return (
          <div
            key={tier.id}
            className={cn(
              "group relative flex flex-col justify-between rounded-xl border border-border/80 bg-card p-3.5 transition-all duration-200 shadow-xs hover:shadow-sm",
              tier.borderHover
            )}
          >
            <div className="space-y-2.5">
              <div className="flex items-start justify-between gap-1.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-lg flex items-center justify-center border shrink-0 transition-transform duration-200 group-hover:scale-105",
                    tier.iconBg
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <span
                  className={cn(
                    "inline-block text-[8px] font-bold px-1.5 py-0.2 rounded-full border shrink-0",
                    tier.badgeBg
                  )}
                >
                  {tier.badge}
                </span>
              </div>

              <div>
                <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                  {tier.name}
                </h3>
                <span className="text-[10px] font-extrabold text-foreground/80 block mt-0.2">
                  {tier.range}
                </span>
                <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">
                  {tier.description}
                </p>
              </div>

              {/* Members in tier */}
              <div className="p-1.5 rounded-lg bg-muted/40 border border-border/50 flex items-center justify-between text-[10px]">
                <span className="text-[8px] uppercase font-bold text-muted-foreground">
                  Tier Members
                </span>
                <span className="font-extrabold text-foreground tabular-nums">
                  {tier.membersCount} members
                </span>
              </div>

              {/* Perks */}
              <div className="space-y-0.5 pt-0.5">
                {tier.perks.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 text-[10px] font-medium text-foreground/80"
                  >
                    <CheckCircle2 className="h-2.5 w-2.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2.5 mt-2 border-t border-border/50">
              <Link href="/gamification/impact-score/members" className="block w-full">
                <Button
                  className={cn(
                    "w-full h-7 rounded-lg font-bold text-[10px] gap-1 shadow-2xs transition-all group/btn cursor-pointer",
                    tier.btnClass
                  )}
                >
                  View Members
                  <ArrowRight className="h-2.5 w-2.5 group-hover/btn:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

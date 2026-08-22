"use client";

import React from "react";
import Link from "next/link";
import { Zap, Dices, RectangleHorizontal, RefreshCw, Award } from "lucide-react";
import { GamificationHookItem } from "./types";

const gamificationHooks: GamificationHookItem[] = [
  { name: "Spin Wheel", icon: Dices, href: "/gamification/rewards/engagement-games/spin-wheel" },
  { name: "Scratch Card", icon: RectangleHorizontal, href: "/gamification/rewards/engagement-games/scratch-card" },
  { name: "Match & Win", icon: RefreshCw, href: "/gamification/rewards/engagement-games/match-win" },
  { name: "Points & Badges", icon: Award, href: "/gamification/points-and-badges" },
];

export const ManualGamificationHooks: React.FC = () => {
  return (
    <div className="rounded-xl border border-border/70 bg-muted/30 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-amber-500" />
          Direct Gamification Assignment
        </span>
        <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200/60">
          Auto Distribution
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {gamificationHooks.map((hook, idx) => {
          const Icon = hook.icon;
          return (
            <Link key={idx} href={hook.href}>
              <div className="p-2.5 rounded-lg border border-border/60 bg-card hover:bg-muted/50 transition-colors flex items-center gap-2 cursor-pointer group">
                <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center group-hover:text-primary transition-colors shrink-0">
                  <Icon className="h-3 w-3" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-bold text-foreground truncate group-hover:text-primary transition-colors">
                    {hook.name}
                  </div>
                  <div className="text-[9px] text-muted-foreground">Assign Reward</div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

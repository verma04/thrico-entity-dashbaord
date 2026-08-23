"use client";

import React from "react";
import Link from "next/link";
import { Trophy, ArrowRight, Ticket, Gamepad2, History, ShieldCheck, Layers, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface RewardsNavigationProps {
  stats?: any;
}

export const RewardsNavigation = ({ stats }: RewardsNavigationProps = {}) => {
  const navCards = [
    {
      title: "Reward Pillars",
      desc: "3 fulfillment mechanisms & funding models",
      icon: Layers,
      link: "/gamification/rewards/pillars",
      color: "emerald",
      badge: "Core Architecture",
      iconBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    },
    {
      title: "Rewards & Vouchers",
      desc: "Manage proprietary coupons & inventory",
      icon: Ticket,
      link: "/gamification/rewards/coupons",
      color: "indigo",
      badge: `${stats?.activeCoupons || 14} Active`,
      iconBg: "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30",
      badgeClass: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
    },
    {
      title: "Engagement Games",
      desc: "Spin wheel, scratch card & match win",
      icon: Gamepad2,
      link: "/gamification/rewards/engagement-games",
      color: "violet",
      badge: "3 Interactive",
      iconBg: "bg-violet-500/15 text-violet-600 dark:text-violet-400 border-violet-500/30",
      badgeClass: "bg-violet-500/10 text-violet-700 dark:text-violet-300 border-violet-500/20",
    },
    {
      title: "Redemption History",
      desc: "Audit log of all member claims & pins",
      icon: History,
      link: "/gamification/rewards/redemptions",
      color: "sky",
      badge: `${stats?.totalRedemptions || 128} Claims`,
      iconBg: "bg-sky-500/15 text-sky-600 dark:text-sky-400 border-sky-500/30",
      badgeClass: "bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/20",
    },
    {
      title: "Fraud & Security",
      desc: "Velocity limits & anti-abuse gates",
      icon: ShieldCheck,
      link: "/gamification/rewards/fraud",
      color: "rose",
      badge: "100% Guarded",
      iconBg: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
      badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-500/20",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Trophy className="h-4 w-4 text-primary" />
        <h3 className="text-xs font-bold text-foreground">
          REWARD MODULES &amp; PROGRAM HUB
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {navCards.map((item, i) => {
          const Icon = item.icon;
          return (
            <Link key={i} href={item.link}>
              <div className="group relative p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/40 hover:shadow-sm transition-all duration-200 cursor-pointer h-full flex flex-col justify-between gap-3">
                <div className="flex items-center justify-between">
                  <div className={cn("h-9 w-9 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105", item.iconBg)}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    {item.desc}
                  </p>
                </div>

                <div className={cn("inline-flex self-start items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold", item.badgeClass)}>
                  {item.badge}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

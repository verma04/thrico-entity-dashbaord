import React from "react";
import Link from "next/link";
import { Trophy, ArrowRight, Ticket, Gamepad2, History, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface RewardsNavigationProps {
  stats: any;
}

const colorMap: Record<string, { icon: string; badge: string; ring: string; dot: string }> = {
  indigo: {
    icon: "text-indigo-600",
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    ring: "group-hover:ring-indigo-200",
    dot: "bg-indigo-500",
  },
  amber: {
    icon: "text-amber-600",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    ring: "group-hover:ring-amber-200",
    dot: "bg-amber-500",
  },
  violet: {
    icon: "text-violet-600",
    badge: "bg-violet-50 text-violet-700 border-violet-100",
    ring: "group-hover:ring-violet-200",
    dot: "bg-violet-500",
  },
  emerald: {
    icon: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    ring: "group-hover:ring-emerald-200",
    dot: "bg-emerald-500",
  },
  rose: {
    icon: "text-rose-600",
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    ring: "group-hover:ring-rose-200",
    dot: "bg-rose-500",
  },
  sky: {
    icon: "text-sky-600",
    badge: "bg-sky-50 text-sky-700 border-sky-100",
    ring: "group-hover:ring-sky-200",
    dot: "bg-sky-500",
  },
};

export const RewardsNavigation = ({ stats }: RewardsNavigationProps) => {
  const navCards = [
    {
      title: "Rewards & Codes",
      desc: "Manage offers, vouchers & inventory",
      icon: Ticket,
      link: "/gamification/rewards/coupons",
      color: "indigo",
      stat: stats?.activeCoupons || 0,
      statLabel: "active",
    },
    {
      title: "Interactions",
      desc: "Spin wheel, scratch card & match games",
      icon: Gamepad2,
      link: "/gamification/engagement-games",
      color: "violet",
      stat: null,
      statLabel: "3 types",
    },
    {
      title: "History",
      desc: "Full log of all claimed rewards",
      icon: History,
      link: "/gamification/rewards/redemptions",
      color: "emerald",
      stat: stats?.totalRedemptions || 0,
      statLabel: "total",
    },
    {
      title: "Security",
      desc: "Fraud rules & redemption limits",
      icon: ShieldCheck,
      link: "/gamification/rewards/fraud",
      color: "rose",
      stat: null,
      statLabel: "protected",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1">
        <Trophy className="h-4 w-4 text-foreground/60" />
        <h2 className="text-sm font-semibold text-foreground">
          Manage your rewards program
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {navCards.map((item, i) => {
          const colors = colorMap[item.color];
          return (
            <Link key={i} href={item.link}>
              <div
                className={cn(
                  "group relative p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all duration-300 cursor-pointer h-full flex flex-col gap-3",
                  "ring-2 ring-transparent",
                  colors.ring,
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="h-9 w-9 rounded-lg bg-muted border border-border/60 flex items-center justify-center transition-colors group-hover:bg-white group-hover:shadow-sm">
                    <item.icon
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-colors",
                        `group-hover:${colors.icon.replace("text-", "text-")}`,
                      )}
                      size={16}
                    />
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/30 group-hover:text-foreground group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground leading-none">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-muted-foreground/70 leading-snug">
                    {item.desc}
                  </p>
                </div>
                {item.stat !== null && (
                  <div
                    className={cn(
                      "inline-flex self-start items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wide",
                      colors.badge,
                    )}
                  >
                    <span className={cn("h-1 w-1 rounded-full", colors.dot)} />
                    {item.stat} {item.statLabel}
                  </div>
                )}
                {item.stat === null && (
                  <div
                    className={cn(
                      "inline-flex self-start items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wide",
                      colors.badge,
                    )}
                  >
                    <span className={cn("h-1 w-1 rounded-full", colors.dot)} />
                    {item.statLabel}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

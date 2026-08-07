import React from "react";
import { Trophy, CheckCircle2, Layers } from "lucide-react";
import { Rank } from "@/graphql/actions";

interface StatsCardsProps {
  ranks: Rank[];
}

export function StatsCards({ ranks }: StatsCardsProps) {
  const totalRanks = ranks.length;
  const activeRanks = ranks.filter((r) => r.isActive).length;

  const items = [
    {
      label: "Total Ranks",
      value: totalRanks,
      icon: Layers,
      accent: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-800",
    },
    {
      label: "Active Ranks",
      value: activeRanks,
      icon: CheckCircle2,
      accent: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-800",
    },
    {
      label: "Status",
      value: totalRanks > 0 ? "Configured" : "Not Set Up",
      icon: Trophy,
      accent: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card"
        >
          <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${item.bg}`}>
            <item.icon className={`h-4 w-4 ${item.accent}`} />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{item.label}</p>
            <p className="text-lg font-bold text-foreground tracking-tight">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

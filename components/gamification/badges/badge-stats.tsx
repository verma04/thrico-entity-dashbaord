import { Award, Star, Trophy } from "lucide-react";
import { Badge } from "@/graphql/actions";

interface BadgeStatsProps {
  badges: Badge[];
}

export function BadgeStats({ badges }: BadgeStatsProps) {
  const actionBadges = badges.filter((b) => b.type === "ACTION");
  const pointsBadges = badges.filter((b) => b.type === "POINTS");

  const items = [
    {
      label: "Total Badges",
      value: badges.length,
      icon: Award,
      accent: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-800",
    },
    {
      label: "Action-Based",
      value: actionBadges.length,
      icon: Star,
      accent: "text-zinc-900 dark:text-zinc-100",
      bg: "bg-zinc-100 dark:bg-zinc-800",
    },
    {
      label: "Points-Based",
      value: pointsBadges.length,
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
            <p className="text-xl font-bold text-foreground tracking-tight">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

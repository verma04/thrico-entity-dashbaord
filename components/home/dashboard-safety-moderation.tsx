import React, { useState } from "react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardSafetyModerationProps {
  kpis: any;
  DashboardSectionHeading: React.FC<{
    title: string;
    icon?: React.ReactNode;
    titleClassName?: string;
    rightElement?: React.ReactNode;
  }>;
}

export function DashboardSafetyModeration({
  kpis,
  DashboardSectionHeading,
}: DashboardSafetyModerationProps) {
  const [showAllModerationItems, setShowAllModerationItems] = useState(false);

  return (
    <section className="lg:col-span-4 space-y-3 flex flex-col">
      <DashboardSectionHeading
        title="Safety & Moderation"
        icon={<Shield className="h-3.5 w-3.5 text-rose-500" />}
        titleClassName="text-rose-600 dark:text-rose-400"
        rightElement={
          <div className="flex items-center gap-2">
            {(kpis?.moderationStats?.length ?? 0) > 5 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-[10px] text-muted-foreground font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
                onClick={() => setShowAllModerationItems((prev) => !prev)}
              >
                {showAllModerationItems ? "View Less" : "View More"}
              </Button>
            )}
          </div>
        }
      />

      <div className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-sm flex flex-col flex-1">
        {/* Table header */}
        <div className="grid grid-cols-2 border-b border-border/50 bg-muted/30 px-4 py-2.5">
          <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
            Type
          </span>
          <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] text-right">
            Count
          </span>
        </div>
        <div className="divide-y divide-border/40 overflow-y-auto flex-1">
          {(showAllModerationItems
            ? kpis?.moderationStats
            : kpis?.moderationStats?.slice(0, 5)
          )?.map((stat: any, i: number) => (
            <Link
              key={i}
              href={`/moderation?tab=${stat.type.replace("Reported ", "").toLowerCase()}`}
              className="grid grid-cols-2 items-center px-4 py-3 hover:bg-muted/25 transition-colors group cursor-pointer"
            >
              <span className="text-[12px] text-foreground/85 font-medium truncate pr-2 group-hover:text-primary transition-colors">
                {stat.type}
              </span>
              <span className="text-[13px] font-bold text-foreground tabular-nums text-right">
                {stat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

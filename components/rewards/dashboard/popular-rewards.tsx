import React from "react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { cn } from "@/lib/utils";
import { useGetPopularRewards } from "@/graphql/actions/rewards";
import { Loader2 } from "lucide-react";

const COLORS = ["#6366f1", "#8b5cf6", "#10b981", "#f43f5e", "#f97316"];

export const PopularRewards = () => {
  const { data, loading } = useGetPopularRewards(5);
  const popularRewards = data?.getPopularRewards || [];

  const topRewards = popularRewards
    .map((r: any) => ({
      name: r.title,
      value: r.redeemedCount,
    }))
    .filter((r: any) => r.value > 0);

  const maxVal = topRewards.length > 0 ? topRewards[0].value : 1;

  const displayRewards = topRewards.map((r: any) => ({
    ...r,
    pct: r.value === 0 ? 0 : Math.round((r.value / maxVal) * 100),
  }));
  return (
    <section className="space-y-4">
      <DashboardSectionHeading
        title="Most Popular Rewards"
        titleClassName="normal-case tracking-normal text-sm text-foreground"
      />
      <div className="p-5 rounded-[20px] bg-white dark:bg-card border border-border shadow-sm min-h-[250px]">
        {loading ? (
          <div className="h-full w-full flex flex-col items-center justify-center pt-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : displayRewards.length === 0 ? (
          <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground pt-12">
            <p className="text-sm">No reward redemptions yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayRewards.map((r: any, i: number) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "shrink-0 h-5 w-5 rounded-full text-[10px] font-black flex items-center justify-center",
                        i === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-muted text-muted-foreground",
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate">
                      {r.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-sm font-bold text-foreground tabular-nums">
                      {r.value}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      claims
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${r.pct}%`,
                      backgroundColor: COLORS[i],
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

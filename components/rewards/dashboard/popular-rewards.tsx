"use client";

import React from "react";
import { Trophy, Award, Flame, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useGetPopularRewards } from "@/graphql/actions/rewards";

const COLORS = ["#6366f1", "#8b5cf6", "#10b981", "#f43f5e", "#f97316"];

interface PopularRewardsProps {
  loading?: boolean;
  rewards?: any[];
}

export const PopularRewards = ({
  loading: propLoading,
  rewards: propRewards,
}: PopularRewardsProps = {}) => {
  const { data, loading: gqlLoading } = useGetPopularRewards(5);
  const loading = propLoading ?? gqlLoading;
  const popularRewards = propRewards || data?.getPopularRewards || [];

  const topRewards = (popularRewards.length > 0
    ? popularRewards
    : [
        { title: "20% Off Shopify Storewide", redeemedCount: 54 },
        { title: "₹500 Amazon Gift Card", redeemedCount: 42 },
        { title: "Free Express Shipping Code", redeemedCount: 36 },
        { title: "VIP Community Lounge Pass", redeemedCount: 28 },
        { title: "₹250 Swiggy Money Voucher", redeemedCount: 19 },
      ]
  ).map((r: any) => ({
    name: r.title,
    value: r.redeemedCount || 0,
  }));

  const maxVal = topRewards.length > 0 ? Math.max(...topRewards.map((r) => r.value), 1) : 1;

  const displayRewards = topRewards.map((r: any) => ({
    ...r,
    pct: r.value === 0 ? 0 : Math.round((r.value / maxVal) * 100),
  }));

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-xs relative h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-border/40 px-4 sm:px-6 pt-4 sm:pt-5">
        <div className="space-y-0.5">
          <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
            <Trophy className="h-3.5 w-3.5 text-amber-500" />
            Top Claimed Rewards
          </span>
          <p className="text-[11px] text-muted-foreground">
            Most popular rewards redeemed by members
          </p>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          Leaderboard
        </span>
      </CardHeader>

      <CardContent className="flex-1 p-4 sm:p-6 space-y-3.5">
        {loading ? (
          <div className="h-full w-full flex flex-col items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          displayRewards.map((r: any, i: number) => {
            const rankBadges = ["🥇", "🥈", "🥉"];
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-bold w-5 text-center shrink-0">
                      {i < 3 ? rankBadges[i] : `#${i + 1}`}
                    </span>
                    <span className="text-xs font-bold text-foreground truncate">
                      {r.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs font-black text-foreground tabular-nums">
                      {r.value}
                    </span>
                    <span className="text-[10px] text-muted-foreground font-medium">
                      claims
                    </span>
                  </div>
                </div>

                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${r.pct}%`,
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

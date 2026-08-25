"use client";

import React, { useMemo } from "react";
import { TrendingUp, Radio } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  ChartTimeFilter,
  ChartTimeFilterValue,
} from "@/components/home/chart-time-filter";
import { cn } from "@/lib/utils";

interface PollsVotingChartProps {
  loading: boolean;
  pollVotesData: Array<{ name: string; votes: number }>;
  filterKey: string;
  onFilterChange: (key: string, value: ChartTimeFilterValue) => void;
  growthPercentage?: number;
  totalVotes?: number;
}

export function PollsVotingChart({
  loading,
  pollVotesData,
  filterKey,
  onFilterChange,
  growthPercentage = 0,
  totalVotes,
}: PollsVotingChartProps) {
  const totalRecorded = useMemo(() => {
    if (totalVotes !== undefined) return totalVotes;
    return pollVotesData.reduce((acc, item) => acc + (item.votes || 0), 0);
  }, [totalVotes, pollVotesData]);

  return (
    <section className="space-y-3 flex flex-col h-full">
      <DashboardSectionHeading
        title="Voting Velocity & Timeline"
        icon={<TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />}
      />
      <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm relative flex-1 flex flex-col rounded-xl">
        <CardHeader className="flex flex-row items-start justify-between pb-2 border-b border-border/40 mb-2">
          <div className="space-y-1 w-full sm:w-auto min-w-[200px]">
            {!loading && (
              <div className="pt-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold tracking-tighter tabular-nums text-foreground">
                    {totalRecorded.toLocaleString()}
                  </span>
                  <div
                    className={cn(
                      "flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full",
                      growthPercentage >= 0
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    )}
                  >
                    {growthPercentage >= 0 ? "+" : ""}
                    {growthPercentage.toFixed(1)}%
                    <TrendingUp
                      className={cn(
                        "h-3 w-3",
                        growthPercentage < 0 && "rotate-180"
                      )}
                    />
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider font-medium">
                  Total Ballot Votes Cast
                </p>
              </div>
            )}
          </div>

          <ChartTimeFilter
            value={filterKey}
            onChange={(key, val) => onFilterChange(key, val)}
          />
        </CardHeader>

        <CardContent className="flex-1 pb-4 pt-2 px-2 sm:px-6 relative min-h-[260px] flex flex-col justify-between">
          {loading ? (
            <div className="h-[240px] w-full flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  Loading Voting Trend...
                </p>
              </div>
            </div>
          ) : pollVotesData.length === 0 ? (
            <div className="h-[240px] w-full flex flex-col items-center justify-center text-center text-muted-foreground">
              <Radio className="h-8 w-8 mb-2 opacity-30" />
              <span className="text-xs">No voting data recorded for this period</span>
            </div>
          ) : (
            <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={pollVotesData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="fillPollVotes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    vertical={false}
                    strokeDasharray="3 3"
                    className="stroke-muted-foreground/15"
                  />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    minTickGap={28}
                    tickFormatter={(value) => {
                      if (!value) return "";
                      try {
                        const d = new Date(value);
                        if (!isNaN(d.getTime())) {
                          return d.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          });
                        }
                      } catch {}
                      return value;
                    }}
                    className="text-[10px] font-medium text-muted-foreground"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                    className="text-[10px] font-medium text-muted-foreground"
                  />
                  <Tooltip
                    cursor={{
                      stroke: "hsl(var(--muted-foreground)/0.2)",
                      strokeWidth: 2,
                    }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border border-border/60 bg-background p-2.5 shadow-xl">
                            <p className="text-[10px] font-medium text-muted-foreground mb-1">
                              {label}
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-indigo-500" />
                              <span className="text-xs font-bold text-foreground">
                                {payload[0].value} votes
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="votes"
                    name="Votes"
                    stroke="#6366f1"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#fillPollVotes)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}

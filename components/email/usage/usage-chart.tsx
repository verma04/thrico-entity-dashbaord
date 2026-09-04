"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetEmailDeliveryPerformance } from "@/graphql/actions/email";
import { Activity, TrendingUp } from "lucide-react";

export function UsageChart() {
  const { data: performanceData, loading } = useGetEmailDeliveryPerformance();

  const chartData = performanceData?.getEmailDeliveryPerformance || [
    { day: "Mon", sent: 0, delivered: 0 },
    { day: "Tue", sent: 0, delivered: 0 },
    { day: "Wed", sent: 0, delivered: 0 },
    { day: "Thu", sent: 0, delivered: 0 },
    { day: "Fri", sent: 0, delivered: 0 },
    { day: "Sat", sent: 0, delivered: 0 },
    { day: "Sun", sent: 0, delivered: 0 },
  ];

  if (loading) {
    return (
      <Card className="border-border/60 bg-card shadow-2xs">
        <CardHeader className="px-5 py-4 border-b border-border/40">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-48 rounded" />
            </div>
            <Skeleton className="h-4 w-24 rounded" />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[280px] w-full flex flex-col justify-end space-y-3">
            <Skeleton className="h-48 w-full rounded-xl" />
            <div className="flex justify-between">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-3 w-8 rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/60 bg-card shadow-2xs">
      <CardHeader className="px-5 py-4 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
              <Activity className="h-3.5 w-3.5" />
            </div>
            <div>
              <CardTitle className="text-[13px] font-bold text-foreground">
                Delivery Distribution & Throughput
              </CardTitle>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Sent vs Delivered verification timeline
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-slate-900 dark:bg-slate-100" />
              <span className="text-[11px] font-semibold text-muted-foreground">Sent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-semibold text-muted-foreground">Delivered</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
              />
              <RechartsTooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid rgba(0,0,0,0.08)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  fontSize: "12px",
                }}
              />
              <Area
                type="monotone"
                dataKey="sent"
                stroke="#0f172a"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSent)"
              />
              <Area
                type="monotone"
                dataKey="delivered"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDelivered)"
              />
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.06} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.08} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

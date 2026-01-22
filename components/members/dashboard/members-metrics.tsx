"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserPlus,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useGetUserAnalytics } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { TimeRange } from "@/graphql/actions/dashbaord/dashboard-quries";

interface MembersMetricsProps {
  timeRange: TimeRange;
}

export const MembersMetrics = ({ timeRange }: MembersMetricsProps) => {
  const { data, loading } = useGetUserAnalytics(timeRange);
  const stats = data?.getUserAnalytics;

  const metrics = [
    {
      title: "Total Members",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.totalMembers?.toLocaleString() || "0"
      ),
      change: stats?.totalMembersChange || 0,
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Users",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.activeMembers?.toLocaleString() || "0"
      ),
      change: stats?.activePercent || 0,
      trend: "up",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "New Members",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.newMembersThisMonth?.toLocaleString() || "0"
      ),
      change: 4.3,
      trend: "up",
      icon: UserPlus,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Verified Users",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.verifiedMembers?.toLocaleString() || "0"
      ),
      change: stats?.verifiedPercent || 0,
      trend: "up",
      icon: ShieldCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((stat, index) => {
        const Icon = stat.icon;
        const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
        return (
          <Card key={index} className="shadow-sm border-border/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <div className="text-2xl font-bold mt-1 flex items-center min-h-[32px]">
                  {stat.value}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

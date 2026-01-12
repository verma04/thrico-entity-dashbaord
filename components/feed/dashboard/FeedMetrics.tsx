"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AppWindow, Users, Repeat2, User, ArrowUpRight } from "lucide-react";

export const FeedMetrics = () => {
  const metrics = [
    {
      title: "Total Feeds",
      value: "128",
      change: 5,
      trend: "up",
      icon: AppWindow,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      trendColor: "text-emerald-600",
      trendBg: "bg-emerald-100/50",
    },
    {
      title: "Total Comments",
      value: "3,200",
      change: 12,
      trend: "up",
      icon: Users,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      trendColor: "text-yellow-600",
      trendBg: "bg-yellow-100/50",
    },
    {
      title: "Total Reactions",
      value: "5,400",
      change: 8,
      trend: "up",
      icon: Repeat2,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trendColor: "text-blue-600",
      trendBg: "bg-blue-100/50",
    },
    {
      title: "Total ReShares",
      value: "1,240",
      change: 15,
      trend: "up",
      icon: User,
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      trendColor: "text-pink-600",
      trendBg: "bg-pink-100/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${stat.trendBg} ${stat.trendColor}`}
                >
                  <ArrowUpRight className="h-3 w-3" />
                  {stat.change}%
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">
                  {stat.title}
                </p>
                <div className="text-3xl font-bold flex items-center tracking-tight">
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

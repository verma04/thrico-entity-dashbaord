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
      bgColor: "bg-emerald-500/10",
      description: "5% from last month"
    },
    {
      title: "Total Comments",
      value: "3,200",
      change: 12,
      trend: "up",
      icon: Users,
      color: "text-yellow-600",
      bgColor: "bg-yellow-500/10",
      description: "12% from last month"
    },
    {
      title: "Total Reactions",
      value: "5,400",
      change: 8,
      trend: "up",
      icon: Repeat2,
      color: "text-blue-600",
      bgColor: "bg-blue-500/10",
      description: "8% from last month"
    },
    {
      title: "Total ReShares",
      value: "1,240",
      change: 15,
      trend: "up",
      icon: User,
      color: "text-pink-600",
      bgColor: "bg-pink-500/10",
      description: "15% from last month"
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div
                  className={`${stat.bgColor} p-2.5 rounded-xl transition-transform group-hover:scale-110`}
                >
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                {stat.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

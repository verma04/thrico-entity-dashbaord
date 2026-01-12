"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  UserPlus,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

export const MembersMetrics = () => {
  const metrics = [
    {
      title: "Total Members",
      value: "15,234",
      change: 8.2,
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      trendColor: "text-blue-600",
      trendBg: "bg-blue-100/50",
    },
    {
      title: "Active Today",
      value: "1,432",
      change: 12.5,
      trend: "up",
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-50",
      trendColor: "text-green-600",
      trendBg: "bg-green-100/50",
    },
    {
      title: "New Members",
      value: "145",
      change: 4.3,
      trend: "up",
      icon: UserPlus,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      trendColor: "text-purple-600",
      trendBg: "bg-purple-100/50",
    },
    {
      title: "Verified Users",
      value: "8,940",
      change: 2.1,
      trend: "up",
      icon: ShieldCheck,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      trendColor: "text-orange-600",
      trendBg: "bg-orange-100/50",
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

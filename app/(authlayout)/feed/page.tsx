"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";
import { FeedMetrics } from "@/components/feed/dashboard/FeedMetrics";
import { FeedWeeklyChart } from "@/components/feed/dashboard/FeedWeeklyChart";
import { FeedCategoryChart } from "@/components/feed/dashboard/FeedCategoryChart";

const weeklySignupsData = [
  { day: "Mon", signups: 120 },
  { day: "Tue", signups: 132 },
  { day: "Wed", signups: 101 },
  { day: "Thu", signups: 134 },
  { day: "Fri", signups: 190 },
  { day: "Sat", signups: 230 },
  { day: "Sun", signups: 210 },
];

const membersByInterestData = [
  { name: "Technology", value: 35 },
  { name: "Arts", value: 25 },
  { name: "Finance", value: 15 },
  { name: "Health", value: 15 },
  { name: "Other", value: 10 },
];

const COLORS = ["#1890ff", "#52c41a", "#faad14", "#eb2f96", "#722ed1"];

export default function FeedPage() {
  const [dateRange, setDateRange] = useState<string>("7days");

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Top Navigation Bar */}
      <Card className="border-none shadow-none bg-transparent">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Feed Overview</h1>
            <p className="text-muted-foreground">
              Monitor your feed performance and analytics.
            </p>
          </div>
          <div className="flex gap-2">
            <Tabs value={dateRange} onValueChange={setDateRange}>
              <TabsList>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="7days">7 Days</TabsTrigger>
                <TabsTrigger value="30days">30 Days</TabsTrigger>
              </TabsList>
            </Tabs>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* Metric Cards */}
      <FeedMetrics />

      {/* Charts Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <FeedWeeklyChart data={weeklySignupsData} />
        <FeedCategoryChart data={membersByInterestData} colors={COLORS} />
      </div>
    </div>
  );
}

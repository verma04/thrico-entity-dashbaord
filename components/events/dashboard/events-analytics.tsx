"use client";

import React, { useState } from "react";
import {
  ModuleAnalyticsLayout,
  KPIStat,
} from "@/components/analytics/module-analytics-layout";
// import { useGetEventStats } from "@/graphql/actions/events";
import { TimeRange } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Users, Activity, BarChart3 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function EventsAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  // const { data, loading } = useGetEventStats(timeRange);

  const stats = [];
  const loading = false;

  const kpiStats: KPIStat[] = [
    {
      title: "Total Events",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.totalEvents?.toLocaleString() ?? "N/A"
      ),
      change: stats?.totalEventsChange ?? 0,
      trend: (stats?.totalEventsChange ?? 0) >= 0 ? "up" : "down",
      icon: Calendar,
      color: "text-purple-700",
      bgColor: "bg-purple-100",
    },
    {
      title: "Active Events",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.activeEvents?.toLocaleString() ?? "N/A"
      ),
      change: stats?.activeEventsChange ?? 0,
      trend: (stats?.activeEventsChange ?? 0) >= 0 ? "up" : "down",
      icon: Activity,
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
    {
      title: "Total Attendees",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.attendees?.toLocaleString() ?? "N/A"
      ),
      change: stats?.attendeesChange ?? 0,
      trend: (stats?.attendeesChange ?? 0) >= 0 ? "up" : "down",
      icon: Users,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    {
      title: "Engagement Rate",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : stats ? (
        `${stats.engagementRate}%`
      ) : (
        "N/A"
      ),
      change: stats?.engagementRateChange ?? 0,
      trend: (stats?.engagementRateChange ?? 0) >= 0 ? "up" : "down",
      icon: BarChart3,
      color: "text-orange-700",
      bgColor: "bg-orange-100",
    },
  ];

  // Mock data for charts - could be fetched similarly
  const eventActivityData = [
    { name: "Mon", events: 4, attendees: 120 },
    { name: "Tue", events: 3, attendees: 98 },
    { name: "Wed", events: 5, attendees: 150 },
    { name: "Thu", events: 2, attendees: 80 },
    { name: "Fri", events: 6, attendees: 210 },
    { name: "Sat", events: 8, attendees: 340 },
    { name: "Sun", events: 4, attendees: 130 },
  ];

  return (
    <ModuleAnalyticsLayout
      title="Events Dashboard"
      description="Monitor your events performance and attendee engagement"
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      kpiStats={kpiStats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Activity</CardTitle>
            <CardDescription>
              Events and attendees over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={eventActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="events" fill="#8884d8" name="Events" />
                <Bar dataKey="attendees" fill="#82ca9d" name="Attendees" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        {/* Placeholder for another chart */}
        <Card>
          <CardHeader>
            <CardTitle>Top Events</CardTitle>
            <CardDescription>Highest performing events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        Tech Conference 202{i}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Virtual • {100 + i * 20} attendees
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    Active
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ModuleAnalyticsLayout>
  );
}

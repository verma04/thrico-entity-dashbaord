"use client";

import React, { useState } from "react";
import {
  ModuleAnalyticsLayout,
  KPIStat,
} from "@/components/analytics/module-analytics-layout";
import { useGetOfferStats } from "@/graphql/actions/offers";
import { TimeRange } from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Tag, Eye, ShoppingCart, Percent } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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

export default function OffersAnalytics() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data, loading } = useGetOfferStats(timeRange);

  const stats = data?.getOfferStats;

  const kpiStats: KPIStat[] = [
    {
      title: "Total Offers",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.totalOffers?.toLocaleString() ?? "N/A"
      ),
      change: stats?.totalOffersChange ?? 0,
      trend: (stats?.totalOffersChange ?? 0) >= 0 ? "up" : "down",
      icon: Tag,
      color: "text-blue-700",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Offers",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.activeOffers?.toLocaleString() ?? "N/A"
      ),
      change: stats?.activeOffersChange ?? 0,
      trend: (stats?.activeOffersChange ?? 0) >= 0 ? "up" : "down",
      icon: Percent,
      color: "text-green-700",
      bgColor: "bg-green-100",
    },
    {
      title: "Claims",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.claims?.toLocaleString() ?? "N/A"
      ),
      change: stats?.claimsChange ?? 0,
      trend: (stats?.claimsChange ?? 0) >= 0 ? "up" : "down",
      icon: ShoppingCart,
      color: "text-purple-700",
      bgColor: "bg-purple-100",
    },
    {
      title: "Total Views",
      value: loading ? (
        <Skeleton className="h-8 w-24" />
      ) : (
        stats?.views?.toLocaleString() ?? "N/A"
      ),
      change: stats?.viewsChange ?? 0,
      trend: (stats?.viewsChange ?? 0) >= 0 ? "up" : "down",
      icon: Eye,
      color: "text-orange-700",
      bgColor: "bg-orange-100",
    },
  ];

  const offerClaimsData = [
    { name: "Mon", claims: 5 },
    { name: "Tue", claims: 12 },
    { name: "Wed", claims: 8 },
    { name: "Thu", claims: 15 },
    { name: "Fri", claims: 22 },
    { name: "Sat", claims: 30 },
    { name: "Sun", claims: 18 },
  ];

  return (
    <ModuleAnalyticsLayout
      title="Offers Analytics"
      description="Track offer performance and claim rates"
      timeRange={timeRange}
      onTimeRangeChange={setTimeRange}
      kpiStats={kpiStats}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Offer Claims</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={offerClaimsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="claims" fill="#ec4899" name="Claims" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </ModuleAnalyticsLayout>
  );
}

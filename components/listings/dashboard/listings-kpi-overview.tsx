"use client";

import React, { useMemo } from "react";
import { Store, Clock, Eye, ThumbsUp } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";

interface ListingsKpiOverviewProps {
  loading: boolean;
  moduleName?: string;
  stats?: {
    totalListings?: number;
    activeListings?: number;
    totalViews?: number;
    listingsDiff?: string | number;
    viewsPercent?: string | number;
    activePercent?: string | number;
  };
  pendingCount?: number;
  trendData?: Array<{ name: string; listings: number }>;
}

export function ListingsKpiOverview({
  loading,
  moduleName = "Marketplace",
  stats,
  pendingCount = 0,
  trendData = [],
}: ListingsKpiOverviewProps) {
  const sparklineData = useMemo(() => {
    if (trendData && trendData.length >= 3) {
      return trendData.map((d) => d.listings || 0);
    }
    return [6, 14, 10, 22, 30, 26, 38];
  }, [trendData]);

  return (
    <section className="space-y-3">
      <DashboardSectionHeading title="CORE CATALOG METRICS" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EcosystemKPI
          title={`Total ${moduleName}`}
          value={loading ? "..." : (stats?.totalListings?.toLocaleString() ?? "0")}
          trend={Number(stats?.listingsDiff || 0)}
          icon={Store}
          colorScheme="indigo"
          tooltip="Total marketplace listings and catalog inventory created"
          trendData={sparklineData.map((v) => Math.round(v * 1.5) + 4)}
          href="/listing/all"
        />
        <EcosystemKPI
          title="Pending Review"
          value={loading ? "..." : pendingCount.toLocaleString()}
          trend={pendingCount}
          icon={Clock}
          colorScheme="orange"
          tooltip="Items currently awaiting administrative or moderator verification"
          trendData={sparklineData.map((v) => Math.round(v * 0.7) + 1)}
          trendLabel="Awaiting"
          href="/listing/all"
        />
        <EcosystemKPI
          title="Catalog Views"
          value={loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0")}
          trend={Number(stats?.viewsPercent || 0)}
          icon={Eye}
          colorScheme="purple"
          tooltip="Total audience search impressions and listing detail views"
          trendData={sparklineData.map((v) => Math.round(v * 3.4) + 15)}
          href="/listing/all"
        />
        <EcosystemKPI
          title={`Active ${moduleName}`}
          value={loading ? "..." : (stats?.activeListings?.toLocaleString() ?? "0")}
          trend={Number(stats?.activePercent || 0)}
          icon={ThumbsUp}
          colorScheme="lime"
          tooltip="Live items currently active and discoverable by community buyers"
          trendData={sparklineData}
          trendLabel="Active"
          href="/listing/all"
        />
      </div>
    </section>
  );
}

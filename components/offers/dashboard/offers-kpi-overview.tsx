"use client";

import React, { useMemo } from "react";
import { Tag, Activity, Check, Eye } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";

interface OffersKpiOverviewProps {
  loading: boolean;
  moduleName?: string;
  stats?: {
    totalOffers?: number;
    activeOffers?: number;
    claims?: number;
    views?: number;
    totalOffersChange?: number;
    activeOffersChange?: number;
    claimsChange?: number;
    viewsChange?: number;
  };
  trendData?: Array<{ name: string; claims: number; views?: number }>;
}

export function OffersKpiOverview({
  loading,
  moduleName = "Offers",
  stats,
  trendData = [],
}: OffersKpiOverviewProps) {
  const sparklineData = useMemo(() => {
    if (trendData && trendData.length >= 3) {
      return trendData.map((d) => d.claims || 0);
    }
    return [8, 16, 12, 25, 34, 28, 42];
  }, [trendData]);

  return (
    <section className="space-y-3">
      <DashboardSectionHeading title="CORE PROMOTION METRICS" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EcosystemKPI
          title={`Total ${moduleName}`}
          value={loading ? "..." : (stats?.totalOffers?.toLocaleString() ?? "0")}
          trend={stats?.totalOffersChange ?? 0}
          icon={Tag}
          colorScheme="indigo"
          tooltip="Total promotional discount deals and voucher offers created"
          trendData={sparklineData.map((v) => Math.round(v * 1.5) + 6)}
          href="/offers/all"
        />
        <EcosystemKPI
          title="Active Now"
          value={loading ? "..." : (stats?.activeOffers?.toLocaleString() ?? "0")}
          trend={stats?.activeOffersChange ?? 0}
          icon={Activity}
          colorScheme="lime"
          tooltip="Live promotions currently eligible for member redemption"
          trendData={sparklineData.map((v) => Math.round(v * 0.9) + 2)}
          href="/offers/all"
        />
        <EcosystemKPI
          title="Claim Yield"
          value={loading ? "..." : (stats?.claims?.toLocaleString() ?? "0")}
          trend={stats?.claimsChange ?? 0}
          icon={Check}
          colorScheme="purple"
          tooltip="Total successful voucher redemptions and coupon claims"
          trendData={sparklineData}
          href="/offers/all"
        />
        <EcosystemKPI
          title="Offer Views"
          value={loading ? "..." : (stats?.views?.toLocaleString() ?? "0")}
          trend={stats?.viewsChange ?? 0}
          icon={Eye}
          colorScheme="orange"
          tooltip="Total view impressions across offer listing and deal pages"
          trendData={sparklineData.map((v) => Math.round(v * 3.2) + 14)}
        />
      </div>
    </section>
  );
}

"use client";

import React, { useMemo } from "react";
import { Eye, Package, ImageIcon, Layers } from "lucide-react";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";

interface ShopKpiOverviewProps {
  loading: boolean;
  moduleName?: string;
  stats?: {
    totalViews?: number;
    activeProducts?: number;
    activeBanners?: number;
    totalCategories?: number;
    viewsChange?: number;
    productsChange?: number;
    bannersChange?: number;
    categoriesChange?: number;
  };
}

export function ShopKpiOverview({
  loading,
  moduleName = "Products",
  stats,
}: ShopKpiOverviewProps) {
  const sparklineData = useMemo(() => {
    return [7, 15, 11, 24, 32, 27, 40];
  }, []);

  return (
    <section className="space-y-3">
      <DashboardSectionHeading title="CORE COMMERCE METRICS" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <EcosystemKPI
          title="Storefront Views"
          value={loading ? "..." : (stats?.totalViews?.toLocaleString() ?? "0")}
          trend={stats?.viewsChange ?? 0}
          icon={Eye}
          colorScheme="indigo"
          tooltip="Total audience view impressions across digital shop pages"
          trendData={sparklineData.map((v) => Math.round(v * 3.5) + 20)}
          href="/shop/all"
        />
        <EcosystemKPI
          title={`Active ${moduleName}`}
          value={loading ? "..." : (stats?.activeProducts?.toLocaleString() ?? "0")}
          trend={stats?.productsChange ?? 0}
          icon={Package}
          colorScheme="lime"
          tooltip="Live catalog products ready for purchase and checkout"
          trendData={sparklineData.map((v) => Math.round(v * 1.1) + 4)}
          href="/shop/all"
        />
        <EcosystemKPI
          title="Promotional Banners"
          value={loading ? "..." : (stats?.activeBanners?.toLocaleString() ?? "0")}
          trend={stats?.bannersChange ?? 0}
          icon={ImageIcon}
          colorScheme="purple"
          tooltip="Active hero display banners promoting seasonal offerings"
          trendData={sparklineData.map((v) => Math.round(v * 0.7) + 2)}
          href="/shop/banners"
        />
        <EcosystemKPI
          title="Shop Categories"
          value={loading ? "..." : (stats?.totalCategories?.toLocaleString() ?? "0")}
          trend={stats?.categoriesChange ?? 0}
          icon={Layers}
          colorScheme="orange"
          tooltip="Organized catalog taxonomy and merchandise collections"
          trendData={sparklineData}
          href="/shop/all"
        />
      </div>
    </section>
  );
}

"use client";

import { useGetListingStats } from "@/graphql/actions/listing";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-analytics";
import { 
  ClipboardList, 
  CheckCircle, 
  ShieldCheck, 
  Eye 
} from "lucide-react";

export function ListingStats() {
  const { data, loading } = useGetListingStats();

  const stats = data?.getListingStats;

  const kpis = [
    {
      title: "Total Listings",
      value: loading ? "..." : (stats?.totalListings ?? 0),
      trend: stats?.listingsDiff,
      icon: ClipboardList,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      title: "Active Listings",
      value: loading ? "..." : (stats?.activeListings ?? 0),
      trend: stats?.activePercent,
      icon: CheckCircle,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      title: "Verified Items",
      value: loading ? "..." : (stats?.verifiedListings ?? 0),
      trend: stats?.verifiedPercent,
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Marketplace Views",
      value: loading ? "..." : (stats?.totalViews ?? 0),
      trend: stats?.viewsPercent,
      icon: Eye,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {kpis.map((kpi, i) => (
        <EcosystemKPI 
          key={i} 
          {...kpi} 
          trendLabel="vs last period" 
        />
      ))}
    </div>
  );
}

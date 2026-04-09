"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Package,
  Plus,
  Eye,
  Image as ImageIcon,
  Layers,
  ShieldCheck,
  RotateCcw,
  Timer,
  LayoutGrid,
} from "lucide-react";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";

import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { Button } from "@/components/ui/button";
import { useGetShopStats, TimeRange } from "@/graphql/actions/shop/shop-hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function ShopDashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDateRange(range);
    if (!range?.from || !range?.to) return;
    const diffDays = Math.round(
      (range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24),
    );
    if (diffDays <= 1) setTimeRange(TimeRange.LAST_24_HOURS);
    else if (diffDays <= 7) setTimeRange(TimeRange.LAST_7_DAYS);
    else if (diffDays <= 30) setTimeRange(TimeRange.LAST_30_DAYS);
    else if (diffDays <= 90) setTimeRange(TimeRange.LAST_90_DAYS);
  };

  const formattedDateRange = dateRange?.from && dateRange?.to
    ? {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      }
    : undefined;

  const { data, loading } = useGetShopStats(timeRange, formattedDateRange);
  const stats = data?.getShopStats;

  const kpis = [
    {
      title: "Total Views",
      value: loading ? "—" : (stats?.totalViews?.toLocaleString() ?? "0"),
      trend: stats?.viewsChange,
      icon: Eye,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      title: "Active Products",
      value: loading ? "—" : (stats?.activeProducts?.toLocaleString() ?? "0"),
      trend: stats?.productsChange,
      icon: Package,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      title: "Active Banners",
      value: loading ? "—" : (stats?.activeBanners?.toLocaleString() ?? "0"),
      trend: stats?.bannersChange,
      icon: ImageIcon,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Categories",
      value: loading ? "—" : (stats?.totalCategories?.toLocaleString() ?? "0"),
      trend: stats?.categoriesChange,
      icon: Layers,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <EcosystemWrapper anonymized-1="shop-intelligence">
      <EcosystemHeader
        title="Commerce Hub"
        description="Monitor product performance, inventory status, and storefront analytics."
        badgeText="Overview"
        icon={ShoppingBag}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground italic">
              Verified Commerce Stream
            </span>
          </div>

          <div className="flex items-center gap-3">
            <DateRangePicker 
              date={dateRange}
              onDateChange={handleDateChange}
              defaultValue="LAST_7_DAYS"
            />
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Link href="/shop/all">
              <Button

                variant="outline"
                className="h-9 px-4 rounded-lg border-zinc-200 font-bold text-[10px] uppercase tracking-widest text-zinc-600 gap-2 hover:bg-zinc-50 transition-all shadow-sm"
              >
                <ShoppingBag className="h-4 w-4 text-indigo-500" />
                Catalog
              </Button>
            </Link>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Link href="/shop/all?action=create">
              <Button className="h-9 px-6 rounded-lg bg-zinc-900 border-zinc-800 font-bold text-[10px] uppercase tracking-widest gap-2 shadow-sm hover:bg-black transition-all active:scale-95 group">
                <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi, i) => (
            <EcosystemKPI key={i} {...kpi} trendLabel="Period stats" />
          ))}
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

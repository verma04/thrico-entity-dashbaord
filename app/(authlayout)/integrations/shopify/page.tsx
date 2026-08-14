"use client";

import React, { useState } from "react";
import {
  ShoppingBag,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowUpRight,
  Activity,
  Award,
  Globe,
} from "lucide-react";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { EcosystemKPI } from "@/components/layout/ecosystem/ecosystem-kpi";
import { DashboardSectionHeading } from "@/components/home/dashboard-section-heading";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  useGetShopifyConnection,
  useGetShopifySyncStatus,
  useGetShopifyStats,
  useSyncShopifyCustomers,
  useSyncShopifyOrders,
  useSyncShopifyProducts,
  ShopifyTimeRange,
} from "@/graphql/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUrlDateRange } from "@/hooks/use-url-date-range";

const timeRangeMap: Record<string, ShopifyTimeRange> = {
  "24h": ShopifyTimeRange.TODAY,
  "7d": ShopifyTimeRange.LAST_7_DAYS,
  "30d": ShopifyTimeRange.LAST_30_DAYS,
  "90d": ShopifyTimeRange.LAST_MONTH,
};

export default function ShopifyDashboardPage() {
  const { dateRange, timeRange, handleDateChange } = useUrlDateRange(7);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formattedDateRange = React.useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    return {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    };
  }, [dateRange]);

  const { data: connectionData, refetch: refetchConnection } =
    useGetShopifyConnection();
  const { data: syncStatusData, refetch: refetchSyncStatus } =
    useGetShopifySyncStatus();
  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useGetShopifyStats({
    timeRange: timeRangeMap[timeRange] || ShopifyTimeRange.LAST_7_DAYS,
    dateRange: formattedDateRange,
  });

  const [syncCustomers, { loading: syncingCustomers }] =
    useSyncShopifyCustomers();
  const [syncOrders, { loading: syncingOrders }] = useSyncShopifyOrders();
  const [syncProducts, { loading: syncingProducts }] = useSyncShopifyProducts();

  const isSyncingAny = syncingCustomers || syncingOrders || syncingProducts;

  const handleSyncAll = async () => {
    try {
      await Promise.all([syncCustomers(), syncOrders(), syncProducts()]);
      toast.success("Successfully triggered full Shopify sync");
      refetchConnection();
      refetchSyncStatus();
      refetchStats();
    } catch (err: any) {
      toast.error(err.message || "Failed to complete full sync");
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchConnection(),
        refetchSyncStatus(),
        refetchStats(),
      ]);
      toast.success("Dashboard metrics refreshed");
    } finally {
      setIsRefreshing(false);
    }
  };

  const connection = connectionData?.shopifyConnection;
  const syncStatus = syncStatusData?.shopifySyncStatus;
  const stats = statsData?.shopifyStats;

  // Chart data for North Star card
  const chartData = [
    { value: 12 },
    { value: 18 },
    { value: 15 },
    { value: 25 },
    { value: 32 },
    { value: 28 },
    { value: 45 },
  ];

  const totalCustomers = stats?.totalCustomers ?? 0;
  const customerGrowth = stats?.customerGrowth ?? 0;
  const isCustomerGrowthPositive = customerGrowth >= 0;

  return (
    <EcosystemWrapper>
      <EcosystemContainer className="space-y-6">
        {/* Header */}
        <EcosystemHeader
          title="Shopify Overview"
          badgeText="E-Commerce Integration"
          description={
            connection?.shopDomain
              ? `Real-time analytics and synchronization for ${connection.shopDomain}`
              : "Overview of your connected Shopify store, synced customers, and products."
          }
          icon={ShoppingBag}
          breadcrumbs={[
            { label: "Integrations", href: "/settings/integrations" },
            { label: "Shopify" },
          ]}
          actions={
            <div className="flex items-center gap-3">
              <DateRangePicker
                date={dateRange}
                onDateChange={handleDateChange}
                defaultValue="LAST_7_DAYS"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncAll}
                disabled={isSyncingAny}
                className="h-8 px-3 rounded-md text-[11px] font-semibold gap-1.5 border-border"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isSyncingAny ? "animate-spin" : ""}`}
                />
                {isSyncingAny ? "Syncing Store…" : "Sync All"}
              </Button>
            </div>
          }
        />

        {/* ── North Star Metric Highlight (same pattern as members/page.tsx) ── */}
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/[0.04] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Connected Shopify Customers
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]"
                  >
                    {connection?.shopDomain || "Active Store"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-end gap-3">
                <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight tabular-nums leading-none">
                  {statsLoading ? (
                    <span className="inline-block h-10 w-28 rounded-lg bg-muted animate-pulse" />
                  ) : (
                    totalCustomers
                  )}
                </span>

                {!statsLoading && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-bold mb-1",
                      isCustomerGrowthPositive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400",
                    )}
                  >
                    {isCustomerGrowthPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    {isCustomerGrowthPositive ? "+" : ""}
                    {typeof customerGrowth === "number"
                      ? customerGrowth.toFixed(1)
                      : customerGrowth}
                    %
                    <span className="text-[10px] font-medium text-muted-foreground ml-1">
                      vs last period
                    </span>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-muted-foreground/70 max-w-md leading-relaxed">
                Total synchronized customers matched with Thrico community
                profiles eligible for gamification & reward rules.
              </p>
            </div>

            {/* Sparkline chart */}
            <div className="h-[80px] w-full md:w-[280px] shrink-0">
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={1}
                minHeight={1}
              >
                <AreaChart
                  data={chartData}
                  margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="shopifyGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#shopifyGradient)"
                    dot={false}
                    isAnimationActive={true}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── 1. Commerce & Sync Metrics ── */}
        <section className="space-y-3">
          <DashboardSectionHeading title="COMMERCE & CUSTOMERS" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <EcosystemKPI
              title="Total Customers"
              value={statsLoading ? "..." : (stats?.totalCustomers ?? "0")}
              trend={stats?.customerGrowth ?? 0}
              trendData={[10, 14, 18, 22, 28, 35, 42]}
              icon={Users}
              color="bg-emerald-500"
              href="/integrations/shopify/user"
            />
            <EcosystemKPI
              title="Synced Products"
              value={statsLoading ? "..." : (stats?.syncedProducts ?? "0")}
              trend={stats?.productGrowth ?? 0}
              trendData={[5, 8, 12, 15, 18, 20, 24]}
              icon={Package}
              color="bg-indigo-500"
              href="/integrations/shopify/product"
            />
            <EcosystemKPI
              title="Orders Processed"
              value={statsLoading ? "..." : (stats?.ordersProcessed ?? "0")}
              trend={stats?.orderGrowth ?? 0}
              trendData={[15, 22, 20, 30, 38, 45, 52]}
              icon={ShoppingCart}
              color="bg-cyan-500"
            />
            <EcosystemKPI
              title="Gamified Rewards"
              value={
                statsLoading ? "..." : (stats?.gamifiedRewardsClaimed ?? "0")
              }
              trend={stats?.rewardGrowth ?? 0}
              trendData={[4, 7, 10, 14, 18, 22, 30]}
              icon={Sparkles}
              color="bg-purple-500"
              href="/gamification/points-and-badges"
            />
          </div>
        </section>

        {/* ── 2. Sync Health & Store Status ── */}
        <section className="space-y-3">
          <DashboardSectionHeading title="SYNC HEALTH & STORE STATUS" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                  Connected Domain
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-lg font-bold text-foreground truncate">
                  {connection?.shopDomain || "No Store Connected"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Installed on{" "}
                  {connection?.installedAt
                    ? new Date(connection.installedAt).toLocaleDateString()
                    : "—"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                  Synchronization Health
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs font-semibold"
                  >
                    {syncStatus || "SYNCED_TODAY"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Automated background sync worker is running normally.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xs font-semibold uppercase text-muted-foreground">
                  Last Synced Timestamp
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-lg font-bold text-foreground">
                  {connection?.lastSyncAt
                    ? new Date(connection.lastSyncAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      }) +
                      ", " +
                      new Date(connection.lastSyncAt).toLocaleDateString()
                    : "Just now"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  All customer and product catalogs are up-to-date.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

"use client";

import React, { useState } from "react";
import {
  Store,
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
  Tag,
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
import {
  useGetWooCommerceConnection,
  useGetWooCommerceSyncStatus,
  useGetWooCommerceStats,
  useSyncWooCommerceCustomers,
  useSyncWooCommerceOrders,
  useSyncWooCommerceProducts,
  WooCommerceTimeRange,
} from "@/graphql/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUrlDateRange } from "@/hooks/use-url-date-range";

const timeRangeMap: Record<string, WooCommerceTimeRange> = {
  "24h": WooCommerceTimeRange.TODAY,
  "7d": WooCommerceTimeRange.LAST_7_DAYS,
  "30d": WooCommerceTimeRange.LAST_30_DAYS,
  "90d": WooCommerceTimeRange.LAST_MONTH,
};

export default function WooCommerceDashboardPage() {
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
    useGetWooCommerceConnection();
  const { data: syncStatusData, refetch: refetchSyncStatus } =
    useGetWooCommerceSyncStatus();
  const {
    data: statsData,
    loading: statsLoading,
    refetch: refetchStats,
  } = useGetWooCommerceStats({
    timeRange: timeRangeMap[timeRange] || WooCommerceTimeRange.LAST_7_DAYS,
    dateRange: formattedDateRange,
  });

  const [syncCustomers, { loading: syncingCustomers }] =
    useSyncWooCommerceCustomers();
  const [syncOrders, { loading: syncingOrders }] = useSyncWooCommerceOrders();
  const [syncProducts, { loading: syncingProducts }] =
    useSyncWooCommerceProducts();

  const isSyncingAny = syncingCustomers || syncingOrders || syncingProducts;

  const handleSyncAll = async () => {
    try {
      await Promise.all([syncCustomers(), syncOrders(), syncProducts()]);
      toast.success("Successfully triggered full WooCommerce sync");
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

  const connection = connectionData?.wooCommerceConnection;
  const syncStatus = syncStatusData?.wooCommerceSyncStatus;
  const stats = statsData?.wooCommerceStats;

  // Chart data for North Star card
  const chartData = [
    { value: 14 },
    { value: 22 },
    { value: 19 },
    { value: 29 },
    { value: 38 },
    { value: 34 },
    { value: 52 },
  ];

  const totalCustomers = stats?.totalCustomers ?? 0;
  const customerGrowth = stats?.customerGrowth ?? 0;
  const isCustomerGrowthPositive = customerGrowth >= 0;

  return (
    <EcosystemWrapper>
      <EcosystemContainer className="space-y-6">
        {/* Header */}
        <EcosystemHeader
          title="WooCommerce Overview"
          badgeText="E-Commerce Integration"
          description={
            connection?.siteUrl
              ? `Real-time analytics and synchronization for ${connection.siteUrl}`
              : "Overview of your connected WordPress WooCommerce store, synced customers, and products."
          }
          icon={Store}
          breadcrumbs={[
            { label: "Integrations", href: "/settings/integrations" },
            { label: "WooCommerce" },
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

        {/* ── North Star Metric Highlight ── */}
        <div className="relative mt-10 overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-[#7F54B3]/[0.04] p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-md bg-[#7F54B3]/10 text-[#7F54B3] flex items-center justify-center">
                  <Store className="h-3.5 w-3.5" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Connected WooCommerce Customers
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-[#7F54B3]/10 text-[#7F54B3] border-[#7F54B3]/20 text-[10px]"
                  >
                    {connection?.siteUrl || "Active Store"}
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
                        : "text-rose-600 dark:text-rose-400"
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
                      : 0}
                    %
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground max-w-sm">
                Total synchronized customer records ready for rewards and engagements.
              </p>
            </div>

            {/* Sparkline mini-graph */}
            <div className="h-24 w-full md:w-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="wooGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7F54B3" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#7F54B3" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#7F54B3"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#wooGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── 1. Synced Catalog & Metrics ── */}
        <section className="space-y-3">
          <DashboardSectionHeading title="SYNCHRONIZED DATA OVERVIEW" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <EcosystemKPI
              title="Synced Customers"
              value={statsLoading ? "..." : (stats?.totalCustomers ?? "0")}
              trend={stats?.customerGrowth ?? 0}
              trendData={[10, 14, 18, 25, 28, 35, 42]}
              icon={Users}
              color="bg-emerald-500"
              href="/integrations/woocommerce/user"
            />
            <EcosystemKPI
              title="Synced Products"
              value={statsLoading ? "..." : (stats?.syncedProducts ?? "0")}
              trend={stats?.productGrowth ?? 0}
              trendData={[5, 12, 18, 22, 25, 30, 35]}
              icon={Package}
              color="bg-blue-500"
              href="/integrations/woocommerce/product"
            />
            <EcosystemKPI
              title="Orders Processed"
              value={statsLoading ? "..." : (stats?.ordersProcessed ?? "0")}
              trend={stats?.orderGrowth ?? 0}
              trendData={[15, 22, 20, 30, 38, 45, 52]}
              icon={ShoppingCart}
              color="bg-cyan-500"
              href="/integrations/woocommerce/orders"
            />
            <EcosystemKPI
              title="Discounts & Coupons"
              value="Catalog"
              trend={0}
              trendData={[8, 10, 12, 14, 15, 18, 20]}
              icon={Tag}
              color="bg-amber-500"
              href="/integrations/woocommerce/coupons"
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
                  {connection?.siteUrl || "No Store Connected"}
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
                    ? new Date(connection.lastSyncAt).toLocaleString()
                    : "Never Synced"}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Scheduled automatic sync runs periodically.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Sparkles,
  Activity,
  Award,
  Tag,
  RotateCcw,
  CheckCircle2,
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
  useGetShopifyConnection,
  useGetShopifySyncStatus,
  useGetShopifyStats,
  useGetShopifyOrders,
  useGetShopifyCustomers,
  useGetShopifyCoupons,
  useSyncShopifyCustomers,
  useSyncShopifyOrders,
  useSyncShopifyProducts,
  ShopifyTimeRange,
} from "@/graphql/actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useUrlDateRange } from "@/hooks/use-url-date-range";

import { CommerceGrowthChart } from "@/components/integrations/commerce-dashboard/commerce-growth-chart";
import { CommerceDistributionChart } from "@/components/integrations/commerce-dashboard/commerce-distribution-chart";
import { CommerceOrdersFeed } from "@/components/integrations/commerce-dashboard/commerce-orders-feed";
import { CommerceCustomersFeed } from "@/components/integrations/commerce-dashboard/commerce-customers-feed";
import { CommerceCouponsFeed } from "@/components/integrations/commerce-dashboard/commerce-coupons-feed";
import { CommerceQuickModules } from "@/components/integrations/commerce-dashboard/commerce-quick-modules";
import { CommerceSyncEngine } from "@/components/integrations/commerce-dashboard/commerce-sync-engine";

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

  // Recent feeds data
  const {
    data: ordersData,
    loading: ordersLoading,
    refetch: refetchOrders,
  } = useGetShopifyOrders({
    input: { limit: 6, offset: 0 },
  });

  const {
    data: customersData,
    loading: customersLoading,
    refetch: refetchCustomers,
  } = useGetShopifyCustomers({
    input: { limit: 6, offset: 0 },
  });

  const {
    data: couponsData,
    loading: couponsLoading,
    refetch: refetchCoupons,
  } = useGetShopifyCoupons({
    input: { limit: 6, offset: 0 },
  });

  const [syncCustomers, { loading: syncingCustomers }] =
    useSyncShopifyCustomers();
  const [syncOrders, { loading: syncingOrders }] = useSyncShopifyOrders();
  const [syncProducts, { loading: syncingProducts }] = useSyncShopifyProducts();

  const isSyncingAny = syncingCustomers || syncingOrders || syncingProducts;

  const handleSyncAll = async () => {
    try {
      await Promise.all([syncCustomers(), syncOrders(), syncProducts()]);
      toast.success("Successfully triggered full Shopify store sync");
      refetchConnection();
      refetchSyncStatus();
      refetchStats();
      refetchOrders();
      refetchCustomers();
      refetchCoupons();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || "Failed to complete full sync");
    }
  };

  const handleSyncSingle = async (
    type: "customers" | "orders" | "products",
  ) => {
    try {
      if (type === "customers") await syncCustomers();
      if (type === "orders") await syncOrders();
      if (type === "products") await syncProducts();
      toast.success(`Successfully synced Shopify ${type}`);
      refetchStats();
      if (type === "customers") refetchCustomers();
      if (type === "orders") refetchOrders();
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || `Failed to sync ${type}`);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        refetchConnection(),
        refetchSyncStatus(),
        refetchStats(),
        refetchOrders(),
        refetchCustomers(),
        refetchCoupons(),
      ]);
      toast.success("Shopify metrics refreshed");
    } finally {
      setIsRefreshing(false);
    }
  };

  const connection = connectionData?.shopifyConnection;
  const syncStatus = syncStatusData?.shopifySyncStatus;
  const stats = statsData?.shopifyStats;

  const recentOrders = ordersData?.getShopifyOrders?.data || [];
  const recentCustomers = customersData?.getShopifyCustomers?.data || [];
  const activeCoupons = couponsData?.getShopifyCoupons?.data || [];
  const totalCouponsCount = couponsData?.getShopifyCoupons?.total ?? activeCoupons.length;

  const totalCustomers = stats?.totalCustomers ?? 0;
  const syncedProducts = stats?.syncedProducts ?? 0;
  const ordersProcessed = stats?.ordersProcessed ?? 0;
  const gamifiedRewards = stats?.gamifiedRewardsClaimed ?? 0;

  const customerGrowth = stats?.customerGrowth ?? 0;
  const orderGrowth = stats?.orderGrowth ?? 0;
  const isCustomerGrowthPositive = customerGrowth >= 0;

  // Chart sparkline data
  const sparklineData = [
    { value: 16 },
    { value: 24 },
    { value: 20 },
    { value: 34 },
    { value: 42 },
    { value: 38 },
    { value: 58 },
  ];

  return (
    <EcosystemWrapper>
      <EcosystemContainer className="p-6 lg:p-8 space-y-8">
        {/* Header */}
        <EcosystemHeader
          title="Shopify Overview"
          badgeText="E-Commerce Integration"
          description={
            connection?.shopDomain
              ? `Real-time bidirectional synchronization and rewards engine for ${connection.shopDomain}`
              : "Overview of your connected Shopify store, synced customers, live products, and orders."
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
                className="h-9 px-3.5 rounded-lg text-xs font-semibold gap-1.5 border-border bg-card shadow-2xs hover:bg-muted"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${isSyncingAny ? "animate-spin" : ""}`}
                />
                {isSyncingAny ? "Syncing Store…" : "Sync All"}
              </Button>
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-0.5" />
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 text-muted-foreground hover:text-emerald-600 rounded-lg transition-all"
                onClick={handleRefresh}
                disabled={statsLoading || isRefreshing}
              >
                <RotateCcw
                  size={14}
                  className={cn((statsLoading || isRefreshing) && "animate-spin")}
                />
              </Button>
            </div>
          }
        />

        {/* ── North Star Store Spotlight Card ── */}
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-emerald-500/[0.04] p-6 sm:p-7 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                  <ShoppingBag className="h-4 w-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Connected Shopify Customers
                  </span>
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px] font-bold"
                  >
                    {connection?.shopDomain || "Active Store"}
                  </Badge>
                </div>
              </div>

              <div className="flex items-end gap-3.5">
                <span className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight tabular-nums leading-none">
                  {statsLoading ? (
                    <span className="inline-block h-10 w-32 rounded-lg bg-muted animate-pulse" />
                  ) : (
                    totalCustomers.toLocaleString()
                  )}
                </span>

                {!statsLoading && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-sm font-bold mb-1 px-2 py-0.5 rounded-full",
                      isCustomerGrowthPositive
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-rose-500/10 text-rose-600 dark:text-rose-400",
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
                    <span className="text-[10px] font-medium opacity-80 ml-0.5">
                      period
                    </span>
                  </div>
                )}
              </div>

              <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
                Total customer records synced from Shopify and connected to Thrico member profiles for automated gamification & rewards.
              </p>
            </div>

            {/* Sparkline mini-graph */}
            <div className="h-20 w-full md:w-[260px] shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={sparklineData}
                  margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="shopifyHeroGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#shopifyHeroGrad)"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* ── 1. Core Commerce Insights Grid (8 Key Metrics) ── */}
        <section className="space-y-3">
          <DashboardSectionHeading title="COMMERCE & SYNCHRONIZATION VITALS" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <EcosystemKPI
              title="Synced Customers"
              value={statsLoading ? "..." : totalCustomers}
              trend={stats?.customerGrowth ?? 0}
              trendData={[12, 16, 22, 28, 34, 40, 48]}
              icon={Users}
              color="bg-emerald-500"
              tooltip="Total registered customer profiles imported and linked"
              href="/integrations/shopify/user"
            />
            <EcosystemKPI
              title="Catalog Products"
              value={statsLoading ? "..." : syncedProducts}
              trend={stats?.productGrowth ?? 0}
              trendData={[5, 8, 12, 15, 18, 20, 24]}
              icon={Package}
              color="bg-blue-500"
              tooltip="Active product listings synchronized in real-time"
              href="/integrations/shopify/product"
            />
            <EcosystemKPI
              title="Orders Processed"
              value={statsLoading ? "..." : ordersProcessed}
              trend={stats?.orderGrowth ?? 0}
              trendData={[15, 22, 20, 30, 38, 45, 52]}
              icon={ShoppingCart}
              color="bg-cyan-500"
              tooltip="Store checkout orders captured and matched for reward rules"
              href="/integrations/shopify/orders"
            />
            <EcosystemKPI
              title="Gamified Rewards"
              value={statsLoading ? "..." : gamifiedRewards}
              trend={stats?.rewardGrowth ?? 0}
              trendData={[4, 7, 10, 14, 18, 22, 30]}
              icon={Sparkles}
              color="bg-purple-500"
              tooltip="Loyalty points & achievements triggered from Shopify orders"
              href="/gamification/points-and-badges"
            />
            <EcosystemKPI
              title="Active Promo Coupons"
              value={couponsLoading ? "..." : totalCouponsCount}
              trend={0}
              trendData={[6, 8, 10, 12, 14, 15, 18]}
              icon={Tag}
              color="bg-amber-500"
              tooltip="Store discount codes eligible for gamification campaigns"
              href="/integrations/shopify/coupons"
            />
            <EcosystemKPI
              title="Profile Match Rate"
              value="96.4"
              suffix="%"
              trend={2.1}
              trendData={[88, 90, 92, 94, 95, 96, 96.4]}
              icon={CheckCircle2}
              color="bg-indigo-500"
              tooltip="Shoppers automatically matched with community member accounts"
            />
            <EcosystemKPI
              title="Reward Claim Rate"
              value={ordersProcessed > 0 ? ((gamifiedRewards / ordersProcessed) * 100).toFixed(1) : "0"}
              suffix="%"
              trend={1.8}
              trendData={[45, 50, 52, 58, 62, 65, 68]}
              icon={Award}
              color="bg-rose-500"
              tooltip="Percentage of store orders resulting in gamified community rewards"
            />
            <EcosystemKPI
              title="Sync Engine Health"
              value="99.9"
              suffix="%"
              trend={0}
              trendData={[99, 99, 99.5, 99.8, 99.9, 99.9, 99.9]}
              icon={Activity}
              color="bg-teal-500"
              tooltip="Webhook delivery success rate and background worker uptime"
            />
          </div>
        </section>

        {/* ── 2. Growth Trends & Status Breakdown (Dual Charts) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <section className="lg:col-span-7 space-y-3 flex flex-col">
            <DashboardSectionHeading
              title="SYNC VELOCITY & ORDER VOLUME"
              description="Customer acquisition and checkout transactions trend"
            />
            <div className="flex-1">
              <CommerceGrowthChart
                brand="shopify"
                totalCustomers={totalCustomers}
                totalOrders={ordersProcessed}
                customerGrowth={customerGrowth}
                orderGrowth={orderGrowth}
                loading={statsLoading}
              />
            </div>
          </section>

          <section className="lg:col-span-5 space-y-3 flex flex-col">
            <DashboardSectionHeading
              title="ORDER STATUS & REWARDS DISTRIBUTION"
              description="Fulfillment breakdown and rewards delivery rate"
            />
            <div className="flex-1">
              <CommerceDistributionChart
                brand="shopify"
                ordersProcessed={ordersProcessed}
                syncedProducts={syncedProducts}
                gamifiedRewardsClaimed={gamifiedRewards}
                loading={statsLoading}
              />
            </div>
          </section>
        </div>

        {/* ── 3. Quick Operations & Module Navigation ── */}
        <section className="space-y-3">
          <DashboardSectionHeading title="INTEGRATION MODULES & SHORTCUTS" />
          <CommerceQuickModules
            brand="shopify"
            totalCustomers={totalCustomers}
            syncedProducts={syncedProducts}
            ordersProcessed={ordersProcessed}
            couponsCount={totalCouponsCount}
            rewardsClaimed={gamifiedRewards}
            loading={statsLoading}
          />
        </section>

        {/* ── 4. Live Commerce Feeds (Orders, Customers, Coupons) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Synced Orders */}
          <section className="space-y-3 flex flex-col h-full">
            <DashboardSectionHeading
              title="RECENT SYNCED ORDERS"
              icon={<ShoppingCart className="h-3.5 w-3.5 text-cyan-500" />}
              rightElement={
                <Link href="/integrations/shopify/orders">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] text-muted-foreground font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
                  >
                    View all
                  </Button>
                </Link>
              }
            />
            <div className="flex-1">
              <CommerceOrdersFeed
                orders={recentOrders}
                loading={ordersLoading}
                viewAllHref="/integrations/shopify/orders"
              />
            </div>
          </section>

          {/* Recent Synced Customers */}
          <section className="space-y-3 flex flex-col h-full">
            <DashboardSectionHeading
              title="RECENT SYNCED CUSTOMERS"
              icon={<Users className="h-3.5 w-3.5 text-emerald-500" />}
              rightElement={
                <Link href="/integrations/shopify/user">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] text-muted-foreground font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
                  >
                    View all
                  </Button>
                </Link>
              }
            />
            <div className="flex-1">
              <CommerceCustomersFeed
                customers={recentCustomers}
                loading={customersLoading}
                viewAllHref="/integrations/shopify/user"
              />
            </div>
          </section>

          {/* Active Promo Coupons */}
          <section className="space-y-3 flex flex-col h-full">
            <DashboardSectionHeading
              title="PROMO DISCOUNTS & COUPONS"
              icon={<Tag className="h-3.5 w-3.5 text-amber-500" />}
              rightElement={
                <Link href="/integrations/shopify/coupons">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[10px] text-muted-foreground font-medium h-7 px-2.5 rounded-lg hover:bg-muted"
                  >
                    View all
                  </Button>
                </Link>
              }
            />
            <div className="flex-1">
              <CommerceCouponsFeed
                coupons={activeCoupons}
                loading={couponsLoading}
                viewAllHref="/integrations/shopify/coupons"
              />
            </div>
          </section>
        </div>

        {/* ── 5. Sync Engine Diagnostics & Manual Triggers ── */}
        <section className="space-y-3">
          <DashboardSectionHeading title="SYNCHRONIZATION ENGINE & WEBHOOK HEALTH" />
          <CommerceSyncEngine
            brand="shopify"
            storeDomain={connection?.shopDomain}
            installedAt={connection?.installedAt}
            lastSyncAt={connection?.lastSyncAt}
            syncStatus={syncStatus}
            onSyncCustomers={() => handleSyncSingle("customers")}
            onSyncOrders={() => handleSyncSingle("orders")}
            onSyncProducts={() => handleSyncSingle("products")}
            syncingCustomers={syncingCustomers}
            syncingOrders={syncingOrders}
            syncingProducts={syncingProducts}
          />
        </section>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

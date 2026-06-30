"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Calendar,
  Store,
  Eye,
  ThumbsUp,
  Clock,
  CheckCircle,
  XCircle,
  PauseCircle,
  TrendingUp,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import Link from "next/link";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import {
  EcosystemKPI,
  EcosystemCard,
} from "@/components/layout/ecosystem/ecosystem-analytics";
import { 
  useListings, 
  useGetListingStats, 
  useListingTrend, 
  useListingCategoryDistribution 
} from "@/graphql/actions/listing";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";
import { cn } from "@/lib/utils";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useModuleStore } from "@/store/useModuleStore";

interface ListingData {
  id: string;
  title: string;
  category: string;
  condition: string;
  price: number;
  status: string;
  views: number;
  likes: number;
  date: string;
}

// Removing dummy data constants

const MarketplaceDashboard = () => {
  const moduleName = useModuleStore((state) => state.listingModuleName);
  const singularName = useModuleStore((state) => state.listingSingularName);
  const [timeRange, setTimeRange] = useState("THIS_MONTH");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const dateRangeParam = dateRange?.from && dateRange?.to
    ? {
        startDate: dateRange.from.toISOString(),
        endDate: dateRange.to.toISOString(),
      }
    : undefined;

  const { data: listingsData, loading: listingsLoading } = useListings({
    variables: { input: { status: "ALL" } },
  });

  const { data: statsData, loading: statsLoading } = useGetListingStats();

  const { data: trendData, loading: trendLoading } = useListingTrend(
    timeRange,
    dateRangeParam
  );

  const { data: categoryData, loading: categoryLoading } = useListingCategoryDistribution(
    timeRange,
    dateRangeParam
  );

  const listingData = listingsData?.getListing?.data || [];
  const stats = statsData?.getListingStats;
  const weeklyListingsData = trendData?.getListingTrend || [];
  const categoryDistributionData = categoryData?.getListingCategoryDistribution || [];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      approved: {
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      APPROVED: {
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      pending: { 
        color: "text-amber-600 bg-amber-50 border-amber-100", 
        icon: <Clock className="w-3 h-3" /> 
      },
      PENDING: { 
        color: "text-amber-600 bg-amber-50 border-amber-100", 
        icon: <Clock className="w-3 h-3" /> 
      },
      blocked: {
        color: "text-rose-600 bg-rose-50 border-rose-100",
        icon: <XCircle className="w-3 h-3" />,
      },
      inactive: {
        color: "text-muted-foreground bg-muted/50 border-border",
        icon: <PauseCircle className="w-3 h-3" />,
      },
      DISABLED: {
        color: "text-muted-foreground bg-muted/50 border-border",
        icon: <PauseCircle className="w-3 h-3" />,
      },
      PAUSED: {
        color: "text-muted-foreground bg-muted/50 border-border",
        icon: <PauseCircle className="w-3 h-3" />,
      },
    };

    const config = variants[status] || variants.approved;

    return (
      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.color}`}>
        {config.icon}
        {status}
      </span>
    );
  };

  const totalListings = stats?.totalListings || 0;
  const pendingCount = listingData.filter(i => i.status === "PENDING" || i.status === "pending").length;
  const totalViews = stats?.totalViews || 0;
  const totalLikes = 0; // Not available in stats yet

  return (
    <EcosystemWrapper anonymized-1="marketplace-overview">
      <EcosystemHeader
        title="Marketplace Overview"
        description="Monitor catalog expansion, inventory health, and engagement performance."
        badgeText="Dashboard"
        icon={Store}
      />

      <EcosystemActionBar shadow="none">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2 px-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Last Sync: Just now
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-9 w-[160px] rounded-lg border-border bg-card text-xs font-semibold">
                <Calendar className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LAST_24_HOURS" className="text-xs">Last 24 Hours</SelectItem>
                <SelectItem value="LAST_7_DAYS" className="text-xs">Last 7 Days</SelectItem>
                <SelectItem value="LAST_30_DAYS" className="text-xs">Last 30 Days</SelectItem>
                <SelectItem value="LAST_90_DAYS" className="text-xs">Last 90 Days</SelectItem>
                <SelectItem value="THIS_MONTH" className="text-xs">This Month</SelectItem>
                <SelectItem value="LAST_MONTH" className="text-xs">Last Month</SelectItem>
              </SelectContent>
            </Select>
            <div className="h-4 w-px bg-muted mx-1" />
            <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-bold border-border">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EcosystemKPI
            title={`Total ${moduleName}`}
            value={totalListings.toString()}
            trend={Number(stats?.listingsDiff || 0)}
            icon={Store}
            color="text-foreground"
            bg="bg-muted"
          />
          <EcosystemKPI
            title="Pending Review"
            value={pendingCount.toString()}
            trend={pendingCount}
            icon={Clock}
            color="text-amber-600"
            bg="bg-amber-50"
            trendLabel="Awaiting"
          />
          <EcosystemKPI
            title="Search Views"
            value={totalViews.toLocaleString()}
            trend={Number(stats?.viewsPercent || 0)}
            icon={Eye}
            color="text-indigo-600"
            bg="bg-indigo-50"
          />
          <EcosystemKPI
            title={`Active ${moduleName}`}
            value={stats?.activeListings?.toString() || "0"}
            trend={Number(stats?.activePercent || 0)}
            icon={ThumbsUp}
            color="text-rose-600"
            bg="bg-rose-50"
            trendLabel="Active"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <EcosystemCard
              title={`${singularName} Velocity`}
              description="New entries published over time"
              icon={TrendingUp}
            >
              <div className="h-[320px] w-full mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={weeklyListingsData}>
                    <defs>
                      <linearGradient id="colorList" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#18181b" stopOpacity={0.05} />
                        <stop offset="95%" stopColor="#18181b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                      dy={10} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fontWeight: 600, fill: '#94a3b8' }} 
                    />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: "#18181b", border: "none", borderRadius: "12px" }}
                      itemStyle={{ color: "#fff", fontWeight: 700, fontSize: "11px" }}
                      labelStyle={{ display: "none" }}
                    />
                    <Area
                      type="monotone"
                      dataKey="listings"
                      stroke="#18181b"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorList)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </EcosystemCard>
          </div>

          <div className="lg:col-span-4">
            <EcosystemCard
              title="Category Mix"
              description="Inventory distribution"
              icon={Package}
            >
              <div className="h-56 w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 px-2 mt-4">
                {categoryDistributionData.map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-foreground">{item.value}%</span>
                  </div>
                ))}
              </div>
            </EcosystemCard>
          </div>
        </div>

        <EcosystemCard
          title="Recent Catalog Performance"
          description={`Detailed metrics for latest active ${moduleName.toLowerCase()}`}
          icon={Clock}
        >
          <div className="space-y-1 mt-4">
            {listingData.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between p-4 rounded-xl border border-border hover:bg-muted/50 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/listing/${listing.id}/manage`}
                    className="text-sm font-semibold text-foreground hover:text-indigo-600 transition-colors block truncate"
                  >
                    {listing.title}
                  </Link>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                    {listing.category} • {listing.condition}
                  </p>
                </div>
                 <div className="flex items-center gap-12">
                   <div className="text-right">
                      <p className="text-xs font-bold text-foreground">${Number(listing.price || 0).toLocaleString()}</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">Value</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold text-foreground">{Number(listing.numberOfViews || 0).toLocaleString()}</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter">Views</p>
                   </div>
                   <div className="w-28 flex justify-end">
                      {getStatusBadge(listing.status)}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </EcosystemCard>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default withModulePermission(MarketplaceDashboard, "LISTING", "canRead");

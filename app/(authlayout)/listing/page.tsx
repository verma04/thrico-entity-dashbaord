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

const weeklyListingsData = [
  { day: "Mon", listings: 45 },
  { day: "Tue", listings: 52 },
  { day: "Wed", listings: 38 },
  { day: "Thu", listings: 65 },
  { day: "Fri", listings: 78 },
  { day: "Sat", listings: 95 },
  { day: "Sun", listings: 82 },
];

const categoryDistributionData = [
  { name: "Vehicles", value: 28, color: "#18181b" },
  { name: "Electronics", value: 35, color: "#3f3f46" },
  { name: "Real Estate", value: 15, color: "#71717a" },
  { name: "Furniture", value: 12, color: "#a1a1aa" },
  { name: "Other", value: 10, color: "#e4e4e7" },
];

const MarketplaceDashboard = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [listingData, setListingData] = useState<ListingData[]>([]);

  useEffect(() => {
    const mockData: ListingData[] = [
      {
        id: "1",
        title: "2022 Tesla Model 3",
        category: "Vehicles",
        condition: "Used",
        price: 35000,
        status: "approved",
        views: 1245,
        likes: 89,
        date: "2023-05-01",
      },
      {
        id: "2",
        title: "MacBook Pro 16-inch",
        category: "Electronics",
        condition: "New",
        price: 2400,
        status: "pending",
        views: 780,
        likes: 45,
        date: "2023-05-02",
      },
      {
        id: "3",
        title: "Luxury Apartment for Rent",
        category: "Real Estate",
        condition: "New",
        price: 3500,
        status: "approved",
        views: 2100,
        likes: 120,
        date: "2023-05-03",
      },
      {
        id: "4",
        title: "Vintage Leather Sofa",
        category: "Furniture",
        condition: "Used",
        price: 850,
        status: "blocked",
        views: 320,
        likes: 15,
        date: "2023-05-04",
      },
      {
        id: "5",
        title: "iPhone 14 Pro Max",
        category: "Electronics",
        condition: "New",
        price: 1100,
        status: "inactive",
        views: 450,
        likes: 30,
        date: "2023-05-05",
      },
    ];

    setListingData(mockData);
  }, []);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { color: string; icon: any }> = {
      approved: {
        color: "text-emerald-600 bg-emerald-50 border-emerald-100",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      pending: { 
        color: "text-amber-600 bg-amber-50 border-amber-100", 
        icon: <Clock className="w-3 h-3" /> 
      },
      blocked: {
        color: "text-rose-600 bg-rose-50 border-rose-100",
        icon: <XCircle className="w-3 h-3" />,
      },
      inactive: {
        color: "text-zinc-500 bg-zinc-50 border-zinc-100",
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

  const totalListings = listingData.length;
  const pendingCount = listingData.filter(i => i.status === "pending").length;
  const totalViews = listingData.reduce((s, i) => s + i.views, 0);
  const totalLikes = listingData.reduce((s, i) => s + i.likes, 0);

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
            <Clock className="h-4 w-4 text-zinc-400" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Last Sync: Just now
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="h-9 w-[160px] rounded-lg border-zinc-200 bg-white text-xs font-semibold">
                <Calendar className="h-3.5 w-3.5 mr-2 text-indigo-500" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today" className="text-xs">Today</SelectItem>
                <SelectItem value="week" className="text-xs">This Week</SelectItem>
                <SelectItem value="month" className="text-xs">This Month</SelectItem>
                <SelectItem value="year" className="text-xs">This Year</SelectItem>
              </SelectContent>
            </Select>
            <div className="h-4 w-px bg-zinc-200 mx-1" />
            <Button variant="outline" size="sm" className="h-9 gap-2 text-xs font-bold border-zinc-200">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>
        </div>
      </EcosystemActionBar>

      <EcosystemContainer className="p-6 lg:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <EcosystemKPI
            title="Total Listings"
            value={totalListings.toString()}
            trend={12}
            icon={Store}
            color="text-zinc-900"
            bg="bg-zinc-100"
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
            trend={8}
            icon={Eye}
            color="text-indigo-600"
            bg="bg-indigo-50"
          />
          <EcosystemKPI
            title="Social Likes"
            value={totalLikes.toString()}
            trend={totalLikes}
            icon={ThumbsUp}
            color="text-rose-600"
            bg="bg-rose-50"
            trendLabel="Weekly"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <EcosystemCard
              title="Listing Velocity"
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
                      dataKey="day" 
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
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{item.name}</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-900">{item.value}%</span>
                  </div>
                ))}
              </div>
            </EcosystemCard>
          </div>
        </div>

        <EcosystemCard
          title="Recent Catalog Performance"
          description="Detailed metrics for latest active listings"
          icon={Clock}
        >
          <div className="space-y-1 mt-4">
            {listingData.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between p-4 rounded-xl border border-zinc-100 hover:bg-zinc-50 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/listing/${listing.id}`}
                    className="text-sm font-semibold text-zinc-900 hover:text-indigo-600 transition-colors block truncate"
                  >
                    {listing.title}
                  </Link>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                    {listing.category} • {listing.condition}
                  </p>
                </div>
                <div className="flex items-center gap-12">
                   <div className="text-right">
                      <p className="text-xs font-bold text-zinc-900">${listing.price.toLocaleString()}</p>
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">Value</p>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-bold text-zinc-900">{listing.views.toLocaleString()}</p>
                      <p className="text-[8px] font-bold text-zinc-400 uppercase tracking-tighter">Views</p>
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

export default MarketplaceDashboard;

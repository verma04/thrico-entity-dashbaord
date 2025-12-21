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
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import Link from "next/link";

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

// Sample data for charts
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
  { name: "Vehicles", value: 28 },
  { name: "Electronics", value: 35 },
  { name: "Real Estate", value: 15 },
  { name: "Furniture", value: 12 },
  { name: "Other", value: 10 },
];

// Colors for pie chart
const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("week");
  const [listingData, setListingData] = useState<ListingData[]>([]);

  // Mock data - in a real app, this would come from an API
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
    const variants: Record<string, { variant: any; icon: any }> = {
      approved: {
        variant: "default",
        icon: <CheckCircle className="w-3 h-3" />,
      },
      pending: { variant: "secondary", icon: <Clock className="w-3 h-3" /> },
      blocked: {
        variant: "destructive",
        icon: <XCircle className="w-3 h-3" />,
      },
      inactive: {
        variant: "outline",
        icon: <PauseCircle className="w-3 h-3" />,
      },
    };

    const statusConfig = variants[status] || variants.approved;

    return (
      <span className="inline-flex items-center gap-1">
        {statusConfig.icon}
        {status.toUpperCase()}
      </span>
    );
  };

  // Calculate statistics
  const totalListings = listingData.length;
  const pendingListings = listingData.filter(
    (item) => item.status === "pending"
  ).length;
  const totalViews = listingData.reduce((sum, item) => sum + item.views, 0);
  const totalLikes = listingData.reduce((sum, item) => sum + item.likes, 0);
  const totalRevenue = listingData.reduce((sum, item) => sum + item.price, 0);

  // Top categories
  const categoryCount = listingData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Marketplace Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage and monitor your marketplace listings
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                </SelectContent>
              </Select>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Download CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Listings
            </CardTitle>
            <div className="rounded-full p-2 bg-green-50 dark:bg-green-950">
              <Store className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {totalListings}
            </div>
            <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12% from last week
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <div className="rounded-full p-2 bg-amber-50 dark:bg-amber-950">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {pendingListings}
            </div>
            <div className="flex items-center text-xs text-amber-600 dark:text-amber-400 mt-1">
              <Package className="h-3 w-3 mr-1" />
              {pendingListings} awaiting review
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-950">
              <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {totalViews.toLocaleString()}
            </div>
            <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8% increase
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <div className="rounded-full p-2 bg-pink-50 dark:bg-pink-950">
              <ThumbsUp className="h-4 w-4 text-pink-600 dark:text-pink-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
              {totalLikes}
            </div>
            <div className="flex items-center text-xs text-pink-600 dark:text-pink-400 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              {totalLikes} likes this week
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - Second Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly New Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={weeklyListingsData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorListings"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor="hsl(var(--primary))"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="listings"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorListings)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Listings by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryDistributionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Categories */}
      <div className="grid gap-4 md:grid-cols-3">
        {topCategories.map(([category, count], index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                {category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">
                listing{count > 1 ? "s" : ""}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Listings Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Listings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {listingData.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <Link
                    href={`/listing/${listing.id}`}
                    className="font-medium hover:underline text-primary"
                  >
                    {listing.title}
                  </Link>
                  <p className="text-sm text-muted-foreground mt-1">
                    {listing.category} • {listing.condition}
                  </p>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      ${listing.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">price</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{listing.views}</p>
                    <p className="text-xs text-muted-foreground">views</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{listing.likes}</p>
                    <p className="text-xs text-muted-foreground">likes</p>
                  </div>
                  <div className="text-right w-32">
                    {getStatusBadge(listing.status)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ArrowUp,
  ArrowDown,
  Download,
  Filter,
  TrendingUp,
  Users,
  Eye,
  MousePointerClick,
  Calendar,
  BarChart3,
} from "lucide-react";

// Sample data for charts
const engagementData = [
  { name: "Jan", likes: 4000, comments: 2400, shares: 1200 },
  { name: "Feb", likes: 3000, comments: 1398, shares: 900 },
  { name: "Mar", likes: 2000, comments: 9800, shares: 1600 },
  { name: "Apr", likes: 2780, comments: 3908, shares: 2000 },
  { name: "May", likes: 1890, comments: 4800, shares: 2181 },
  { name: "Jun", likes: 2390, comments: 3800, shares: 2500 },
  { name: "Jul", likes: 3490, comments: 4300, shares: 2100 },
];

const userGrowthData = [
  { name: "Jan", users: 1200 },
  { name: "Feb", users: 1900 },
  { name: "Mar", users: 3000 },
  { name: "Apr", users: 5000 },
  { name: "May", users: 8000 },
  { name: "Jun", users: 10000 },
  { name: "Jul", users: 12000 },
];

const trafficSourceData = [
  { name: "Direct", value: 40 },
  { name: "Social Media", value: 30 },
  { name: "Referral", value: 20 },
  { name: "Organic Search", value: 10 },
];

const COLORS = ["#4f46e5", "#818cf8", "#c7d2fe", "#e0e7ff"];

const topPostsData = [
  {
    key: "1",
    title: "Welcome to PulsePlay Digital",
    views: 12453,
    engagement: 8.7,
    conversionRate: "3.2%",
  },
  {
    key: "2",
    title: "New Features Coming Soon",
    views: 9876,
    engagement: 7.5,
    conversionRate: "2.8%",
  },
  {
    key: "3",
    title: "Community Guidelines Update",
    views: 8765,
    engagement: 6.9,
    conversionRate: "2.5%",
  },
  {
    key: "4",
    title: "Upcoming Events in June",
    views: 7654,
    engagement: 6.2,
    conversionRate: "2.1%",
  },
  {
    key: "5",
    title: "User Spotlight: May Edition",
    views: 6543,
    engagement: 5.8,
    conversionRate: "1.9%",
  },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState("month");

  const topPostsData = [
    {
      id: "1",
      title: "Welcome to PulsePlay Digital",
      views: 12453,
      engagement: 8.7,
      conversionRate: "3.2%",
    },
    {
      id: "2",
      title: "New Features Coming Soon",
      views: 9876,
      engagement: 7.5,
      conversionRate: "2.8%",
    },
    {
      id: "3",
      title: "Community Guidelines Update",
      views: 8765,
      engagement: 6.9,
      conversionRate: "2.5%",
    },
    {
      id: "4",
      title: "Upcoming Events in June",
      views: 7654,
      engagement: 6.2,
      conversionRate: "2.1%",
    },
    {
      id: "5",
      title: "User Spotlight: May Edition",
      views: 6543,
      engagement: 5.8,
      conversionRate: "1.9%",
    },
  ];

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            Detailed insights into your platform performance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="month" onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124,532</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              12% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Engagement
            </CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7.8%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              0.5% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4%</div>
            <div className="flex items-center text-xs text-red-600">
              <ArrowDown className="mr-1 h-3 w-3" />
              0.2% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,432</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUp className="mr-1 h-3 w-3" />
              8% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>
                Track likes, comments, and shares over time
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={engagementData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="likes"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="comments"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="shares"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* User Growth and Traffic Sources */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>Monthly active user growth trend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={userGrowthData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar
                    dataKey="users"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSourceData}
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
                    {trafficSourceData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {trafficSourceData.map((entry, index) => (
                <div
                  key={`legend-${index}`}
                  className="flex items-center gap-2"
                >
                  <div
                    className="h-3 w-3 rounded-sm"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {entry.name}: {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Content */}
      <Card>
        <Tabs defaultValue="posts" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="posts">Top Posts</TabsTrigger>
              <TabsTrigger value="demographics">Demographics</TabsTrigger>
              <TabsTrigger value="devices">Devices</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="posts" className="mt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Post Title</TableHead>
                    <TableHead className="text-right">Views</TableHead>
                    <TableHead className="text-right">Engagement</TableHead>
                    <TableHead className="text-right">Conversion</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topPostsData.map((post) => (
                    <TableRow key={post.id}>
                      <TableCell className="font-medium">
                        <a href="#" className="hover:underline">
                          {post.title}
                        </a>
                      </TableCell>
                      <TableCell className="text-right">
                        {post.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        {post.engagement}%
                      </TableCell>
                      <TableCell className="text-right">
                        {post.conversionRate}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="demographics" className="mt-0">
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Age Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">18-24</span>
                        <span className="font-medium">25%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">25-34</span>
                        <span className="font-medium">40%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">35-44</span>
                        <span className="font-medium">20%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">45+</span>
                        <span className="font-medium">15%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Gender</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Male</span>
                        <span className="font-medium">48%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Female</span>
                        <span className="font-medium">47%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Other</span>
                        <span className="font-medium">5%</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Location</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          North America
                        </span>
                        <span className="font-medium">45%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Europe</span>
                        <span className="font-medium">30%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Asia</span>
                        <span className="font-medium">25%</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="devices" className="mt-0">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Mobile</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">65%</div>
                    <p className="text-xs text-green-600 mt-2">
                      +5% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Desktop</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">30%</div>
                    <p className="text-xs text-red-600 mt-2">
                      -3% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tablet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">5%</div>
                    <p className="text-xs text-red-600 mt-2">
                      -2% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}

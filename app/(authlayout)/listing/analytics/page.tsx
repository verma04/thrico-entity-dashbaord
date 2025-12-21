"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Store, Users, Eye, ThumbsUp } from "lucide-react";
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

interface CategoryData {
  category: string;
  count: number;
  percentage: number;
}

interface ConditionData {
  condition: string;
  count: number;
  percentage: number;
}

interface UserData {
  username: string;
  listingsCount: number;
  viewsCount: number;
  likesCount: number;
}

interface TrendData {
  date: string;
  listings: number;
  views: number;
  likes: number;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82CA9D",
  "#FFC658",
];

const Analytics = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [conditionData, setConditionData] = useState<ConditionData[]>([]);
  const [userData, setUserData] = useState<UserData[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    // Category data
    const mockCategoryData: CategoryData[] = [
      { category: "Vehicles", count: 245, percentage: 24.5 },
      { category: "Electronics", count: 198, percentage: 19.8 },
      { category: "Real Estate", count: 156, percentage: 15.6 },
      { category: "Furniture", count: 132, percentage: 13.2 },
      { category: "Clothing", count: 98, percentage: 9.8 },
      { category: "Services", count: 87, percentage: 8.7 },
      { category: "Other", count: 84, percentage: 8.4 },
    ];

    // Condition data
    const mockConditionData: ConditionData[] = [
      { condition: "New", count: 420, percentage: 42.0 },
      { condition: "Used - Like New", count: 210, percentage: 21.0 },
      { condition: "Used - Good", count: 180, percentage: 18.0 },
      { condition: "Used - Fair", count: 110, percentage: 11.0 },
      { condition: "Refurbished", count: 50, percentage: 5.0 },
      { condition: "For parts", count: 30, percentage: 3.0 },
    ];

    // Top users data
    const mockUserData: UserData[] = [
      {
        username: "john_doe",
        listingsCount: 45,
        viewsCount: 12500,
        likesCount: 780,
      },
      {
        username: "jane_smith",
        listingsCount: 38,
        viewsCount: 9800,
        likesCount: 620,
      },
      {
        username: "robert_johnson",
        listingsCount: 32,
        viewsCount: 8200,
        likesCount: 540,
      },
      {
        username: "emily_davis",
        listingsCount: 29,
        viewsCount: 7500,
        likesCount: 490,
      },
      {
        username: "michael_wilson",
        listingsCount: 25,
        viewsCount: 6800,
        likesCount: 420,
      },
      {
        username: "sarah_brown",
        listingsCount: 22,
        viewsCount: 5900,
        likesCount: 380,
      },
      {
        username: "david_miller",
        listingsCount: 20,
        viewsCount: 5200,
        likesCount: 340,
      },
      {
        username: "lisa_taylor",
        listingsCount: 18,
        viewsCount: 4800,
        likesCount: 310,
      },
      {
        username: "james_anderson",
        listingsCount: 16,
        viewsCount: 4200,
        likesCount: 280,
      },
      {
        username: "jennifer_thomas",
        listingsCount: 15,
        viewsCount: 3900,
        likesCount: 260,
      },
    ];

    // Trend data for the last 30 days
    const mockTrendData: TrendData[] = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));

      return {
        date: date.toISOString().split("T")[0],
        listings: Math.floor(Math.random() * 20) + 10,
        views: Math.floor(Math.random() * 1000) + 500,
        likes: Math.floor(Math.random() * 100) + 50,
      };
    });

    setCategoryData(mockCategoryData);
    setConditionData(mockConditionData);
    setUserData(mockUserData);
    setTrendData(mockTrendData);
  }, []);

  // Calculate totals
  const totalListings = categoryData.reduce((sum, item) => sum + item.count, 0);
  const totalViews = userData.reduce((sum, item) => sum + item.viewsCount, 0);
  const totalLikes = userData.reduce((sum, item) => sum + item.likesCount, 0);

  // Prepare data for charts
  const categoryPieData = categoryData.map((item) => ({
    name: item.category,
    value: item.count,
  }));

  const conditionPieData = conditionData.map((item) => ({
    name: item.condition,
    value: item.count,
  }));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-4">
          <Select defaultValue="month" onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Listings
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalListings}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalViews.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalLikes.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div>
        <h2 className="text-xl font-semibold mb-4">Listing Trends</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Daily Views</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#8884d8"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Daily New Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="listings" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        <h2 className="text-xl font-semibold mb-4">
          Category & Condition Distribution
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Listings by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Listings by Condition</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={conditionPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {conditionPieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        <h2 className="text-xl font-semibold mb-4">Top Categories</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Top Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Listings</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoryData.map((item) => (
                    <TableRow key={item.category}>
                      <TableCell className="font-medium">
                        {item.category}
                      </TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                      <TableCell className="text-right">
                        {item.percentage}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Conditions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Condition</TableHead>
                    <TableHead className="text-right">Listings</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conditionData.map((item) => (
                    <TableRow key={item.condition}>
                      <TableCell className="font-medium">
                        {item.condition}
                      </TableCell>
                      <TableCell className="text-right">{item.count}</TableCell>
                      <TableCell className="text-right">
                        {item.percentage}%
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-6" />

      <div>
        <h2 className="text-xl font-semibold mb-4">Top Users</h2>
        <Card>
          <CardHeader>
            <CardTitle>Top Users by Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead className="text-right">Listings</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Likes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData.map((user) => (
                  <TableRow key={user.username}>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.listingsCount}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.viewsCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.likesCount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

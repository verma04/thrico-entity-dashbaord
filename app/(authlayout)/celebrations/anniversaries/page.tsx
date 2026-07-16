"use client";

import { useState } from "react";
import { Gift, Calendar, ArrowLeft, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

// Sample data for anniversaries
const anniversariesData = [
  {
    id: 1,
    name: "Sarah Johnson",
    date: "2025-12-25",
    yearsOfService: 10,
    department: "Engineering",
    avatar: "SJ",
    joinDate: "2015-12-25",
  },
  {
    id: 2,
    name: "Michael Chen",
    date: "2025-12-28",
    yearsOfService: 5,
    department: "Marketing",
    avatar: "MC",
    joinDate: "2020-12-28",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    date: "2026-01-05",
    yearsOfService: 3,
    department: "Product",
    avatar: "ER",
    joinDate: "2023-01-05",
  },
  {
    id: 4,
    name: "David Kim",
    date: "2026-01-12",
    yearsOfService: 7,
    department: "Sales",
    avatar: "DK",
    joinDate: "2019-01-12",
  },
  {
    id: 5,
    name: "Lisa Thompson",
    date: "2025-12-15",
    yearsOfService: 12,
    department: "HR",
    avatar: "LT",
    joinDate: "2013-12-15",
  },
  {
    id: 6,
    name: "James Wilson",
    date: "2025-12-10",
    yearsOfService: 8,
    department: "Engineering",
    avatar: "JW",
    joinDate: "2017-12-10",
  },
  {
    id: 7,
    name: "Maria Garcia",
    date: "2025-11-28",
    yearsOfService: 4,
    department: "Design",
    avatar: "MG",
    joinDate: "2021-11-28",
  },
  {
    id: 8,
    name: "Robert Brown",
    date: "2025-11-15",
    yearsOfService: 6,
    department: "Finance",
    avatar: "RB",
    joinDate: "2019-11-15",
  },
];

export default function AnniversariesPage() {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState("all");

  const today = new Date("2025-12-21"); // Using current date from metadata

  const upcomingAnniversaries = anniversariesData
    .filter((anniversary) => new Date(anniversary.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAnniversaries = anniversariesData
    .filter((anniversary) => new Date(anniversary.date) < today)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDaysUntil = (dateString: string) => {
    const date = new Date(dateString);
    const diffTime = date.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays < 7) return `In ${diffDays} days`;
    if (diffDays < 30) return `In ${Math.floor(diffDays / 7)} weeks`;
    return `In ${Math.floor(diffDays / 30)} months`;
  };

  const getColorClass = (years: number) => {
    if (years >= 10) return "border-amber-500 bg-amber-50 dark:bg-amber-950";
    if (years >= 5) return "border-purple-500 bg-purple-50 dark:bg-purple-950";
    return "border-blue-500 bg-blue-50 dark:bg-blue-950";
  };

  const getIconColor = (years: number) => {
    if (years >= 10) return "text-amber-600 dark:text-amber-400";
    if (years >= 5) return "text-purple-600 dark:text-purple-400";
    return "text-blue-600 dark:text-blue-400";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/celebrations")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">
                  Work Anniversaries
                </h1>
                <p className="text-muted-foreground mt-1">
                  Celebrating our team's milestones
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-[180px]">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Gift className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {upcomingAnniversaries.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              In the next 3 months
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              3
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              December celebrations
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Milestones</CardTitle>
            <Award className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              2
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              10+ years of service
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {anniversariesData.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              All anniversaries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Anniversaries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Upcoming Anniversaries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingAnniversaries.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAnniversaries.map((anniversary) => (
                <Card
                  key={anniversary.id}
                  className={`hover:shadow-lg transition-all border-2 ${getColorClass(
                    anniversary.yearsOfService
                  )}`}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white w-12 h-12 flex items-center justify-center font-bold text-lg">
                        {anniversary.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {anniversary.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {anniversary.department}
                        </p>
                        <div className="mt-3 space-y-1">
                          <div
                            className={`flex items-center gap-1 text-sm font-medium ${getIconColor(
                              anniversary.yearsOfService
                            )}`}
                          >
                            <Award className="h-4 w-4" />
                            <span>
                              {anniversary.yearsOfService} Year
                              {anniversary.yearsOfService !== 1 ? "s" : ""}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatDate(anniversary.date)}</span>
                          </div>
                          <div className="text-xs font-medium text-primary">
                            {getDaysUntil(anniversary.date)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No upcoming anniversaries
            </p>
          )}
        </CardContent>
      </Card>

      {/* Past Anniversaries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            Past Anniversaries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pastAnniversaries.length > 0 ? (
            <div className="space-y-3">
              {pastAnniversaries.map((anniversary) => (
                <div
                  key={anniversary.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-gradient-to-br from-gray-400 to-gray-600 text-white w-10 h-10 flex items-center justify-center font-bold">
                      {anniversary.avatar}
                    </div>
                    <div>
                      <h3 className="font-medium">{anniversary.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {anniversary.department}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Award className="h-4 w-4" />
                      <span>
                        {anniversary.yearsOfService} Year
                        {anniversary.yearsOfService !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(anniversary.date)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No past anniversaries
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

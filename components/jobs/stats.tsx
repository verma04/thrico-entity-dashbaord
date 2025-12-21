"use client";

import {
  Briefcase,
  TrendingUp,
  Users,
  Eye,
  Star,
  CheckCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useJobStats } from "../../graphql/actions/jobs";

const Stats = () => {
  const { data } = useJobStats();
  const stats = data?.getJobStats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 mb-6">
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          <div className="rounded-full p-2 bg-green-50 dark:bg-green-950">
            <Briefcase className="h-4 w-4 text-green-600 dark:text-green-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {stats?.totalJobs || 0}
          </div>
          <div className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{stats?.applicationsLastWeek || 0} this month
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          <div className="rounded-full p-2 bg-amber-50 dark:bg-amber-950">
            <CheckCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
            {stats?.activeJobs || 0}
          </div>
          <div className="flex items-center text-xs text-amber-600 dark:text-amber-400 mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            {stats?.totalJobs || 0}% of total jobs
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Applications
          </CardTitle>
          <div className="rounded-full p-2 bg-blue-50 dark:bg-blue-950">
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {stats?.totalApplications || 0}
          </div>
          <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{stats?.applicationsThisWeek || 0} this week
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          <div className="rounded-full p-2 bg-pink-50 dark:bg-pink-950">
            <Eye className="h-4 w-4 text-pink-600 dark:text-pink-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">
            {stats?.totalViews || 0}
          </div>
          <div className="flex items-center text-xs text-pink-600 dark:text-pink-400 mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{stats?.viewsLastWeek || 0}% from last week
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg. Applications
          </CardTitle>
          <div className="rounded-full p-2 bg-purple-50 dark:bg-purple-950">
            <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {stats?.avgApplications || 0}
          </div>
          <div className="flex items-center text-xs text-purple-600 dark:text-purple-400 mt-1">
            <Star className="h-3 w-3 mr-1" />
            per job posting
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Stats;

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Briefcase,
  Tag,
  Users,
  CalendarDays,
  UserCircle,
  Globe,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Clock,
  LucideIcon,
  AlertCircle,
} from "lucide-react";
import {
  useCheckEntitySubscription,
  useGetPlatformModuleActivity,
  TimeRange,
} from "@/graphql/actions";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ModuleStats {
  total?: number;
  active?: number;
  pending?: number;
  pages?: number;
  modules?: number;
  published?: boolean;
}

interface Module {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  stats: ModuleStats;
  subscriptionKey?: string;
}

const modules: Module[] = [
  {
    title: "Discussion Forums",
    description: "Community discussions, Q&A, and knowledge sharing",
    icon: MessageSquare,
    href: "/discussion-forum",
    color: "bg-gray-600",
    stats: { total: 0, active: 0, pending: 0 },
    subscriptionKey: "forums",
  },
  {
    title: "Job Board",
    description: "Post jobs, manage applications, and hire talent",
    icon: Briefcase,
    href: "/jobs",
    color: "bg-gray-600",
    stats: { total: 0, active: 0, pending: 0 },
    subscriptionKey: "jobs",
  },
  {
    title: "Offers & Deals",
    description: "Manage offers, categories, and user submissions",
    icon: Tag,
    href: "/offers",
    color: "bg-gray-600",
    stats: { total: 0, active: 0, pending: 0 },
    subscriptionKey: "offers",
  },
  {
    title: "Mentorship",
    description: "Connect mentors and mentees, manage requests",
    icon: Users,
    href: "/mentorship",
    color: "bg-gray-600",
    stats: { total: 0, active: 0, pending: 0 },
    subscriptionKey: "mentorship",
  },
  {
    title: "Events",
    description: "Create and manage events, registrations, and attendance",
    icon: CalendarDays,
    href: "/events",
    color: "bg-gray-600",
    stats: { total: 0, active: 0, pending: 0 },
    subscriptionKey: "events",
  },
  {
    title: "Communities",
    description: "Build and moderate communities around shared interests",
    icon: UserCircle,
    href: "/communities",
    color: "bg-gray-600",
    stats: { total: 0, active: 0, pending: 0 },
    subscriptionKey: "communities",
  },
  {
    title: "Website Builder",
    description: "Design and customize your entity's public website",
    icon: Globe,
    href: "/website",
    color: "bg-gray-600",
    stats: { pages: 12, modules: 45, published: true },
    subscriptionKey: "website",
  },
];

export function PlatformModules() {
  const [timeRange] = useState<TimeRange>(TimeRange.LAST_7_DAYS);
  const { data, loading, error } = useCheckEntitySubscription();
  const { data: activityData, loading: activityLoading } =
    useGetPlatformModuleActivity(timeRange);

  const enabledModules = React.useMemo(() => {
    if (!data?.checkEntitySubscription?.modules) return modules;

    const subscriptionModules = data.checkEntitySubscription.modules;
    const enabledModuleKeys = new Set(
      subscriptionModules
        .filter((m: any) => m.enabled)
        .map((m: any) => m.name?.toLowerCase().replace(/'/g, "_")),
    );

    // Get activity data
    const activityModules =
      activityData?.getPlatformModuleActivity?.modules || [];

    return modules
      .filter((module) => {
        if (!module.subscriptionKey) return true;
        return enabledModuleKeys.has(module.subscriptionKey.toLowerCase());
      })
      .map((module) => {
        // Find matching activity data for this module
        const activity = activityModules.find((a) =>
          a.name
            .toLowerCase()
            .includes(module.subscriptionKey?.toLowerCase() || ""),
        );

        // If we have activity data, update the stats
        if (activity && module.subscriptionKey !== "website") {
          return {
            ...module,
            stats: {
              ...module.stats,
              total: activity.itemCount,
              active: activity.itemCount, // You might want to adjust this based on your data
              pending: 0, // This would need to come from a different API endpoint
            },
          };
        }

        return module;
      });
  }, [data, activityData]);

  if (loading || activityLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load subscription data. Showing all modules.
        </AlertDescription>
      </Alert>
    );
  }

  if (enabledModules.length === 0) {
    return null;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <div className="p-2 rounded-lg bg-gray-100">
          <TrendingUp className="h-5 w-5 text-gray-700" />
        </div>
        Platform Modules
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enabledModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card
              key={module.href}
              className="hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className={`p-4 rounded-xl  bg-opacity-10 shadow-sm`}>
                    <Icon
                      className={`h-8 w-8  text-amber-100 ${module.color.replace(
                        "bg-",
                        "text-",
                      )}`}
                    />
                  </div>
                  <Link href={module.href}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Open
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
                <CardTitle className="mt-4">{module.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {module.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {module.stats.total !== undefined ? (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {module.stats.total}
                      </span>
                      <span className="text-muted-foreground">Total</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-gray-600" />
                      <span className="font-semibold">
                        {module.stats.active}
                      </span>
                      <span className="text-muted-foreground">Active</span>
                    </div>
                    {module.stats.pending! > 0 && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <Badge variant="secondary">
                          {module.stats.pending}
                        </Badge>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">
                        {module.stats.pages}
                      </span>
                      <span className="text-muted-foreground">Pages</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold">
                        {module.stats.modules}
                      </span>
                      <span className="text-muted-foreground">Modules</span>
                    </div>
                    {module.stats.published && (
                      <Badge variant="default" className="bg-gray-600">
                        Published
                      </Badge>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

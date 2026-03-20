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
    color: "blue",
    stats: { total: 0, active: 0, pending: 0 },
    subscriptionKey: "forums",
  },
  {
    title: "Job Board",
    description: "Post jobs, manage applications, and hire talent",
    icon: Briefcase,
    href: "/jobs",
    color: "emerald",
    stats: { total: 0, active: 0, pending: 0 },
    subscriptionKey: "jobs",
  },
  {
    title: "Offers & Deals",
    description: "Manage offers, categories, and user submissions",
    icon: Tag,
    href: "/offers",
    color: "orange",
    stats: { total: 0, active: 0, pending: 0 },
    subscriptionKey: "offers",
  },
  {
    title: "Mentorship",
    description: "Connect mentors and mentees, manage requests",
    icon: Users,
    href: "/mentorship",
    color: "purple",
    stats: { total: 0, active: 0, pending: 0 },
    subscriptionKey: "mentorship",
  },
  {
    title: "Events",
    description: "Create and manage events, registrations, and attendance",
    icon: CalendarDays,
    href: "/events",
    color: "pink",
    stats: { total: 0, active: 0, pending: 0 },
    subscriptionKey: "events",
  },
  {
    title: "Communities",
    description: "Build and moderate communities around shared interests",
    icon: UserCircle,
    href: "/communities",
    color: "cyan",
    stats: { total: 0, active: 0, pending: 0 },
    subscriptionKey: "communities",
  },
  {
    title: "Website Builder",
    description: "Design and customize your entity's public website",
    icon: Globe,
    href: "/website",
    color: "violet",
    stats: { pages: 12, modules: 45, published: true },
    subscriptionKey: "website",
  },
];

const colorStyles: Record<
  string,
  {
    bg: string;
    text: string;
    lightBg: string;
    border: string;
    gradient: string;
  }
> = {
  blue: {
    bg: "bg-blue-600",
    text: "text-blue-600",
    lightBg: "bg-blue-50",
    border: "border-blue-200",
    gradient: "from-blue-500 to-indigo-600",
  },
  emerald: {
    bg: "bg-emerald-600",
    text: "text-emerald-600",
    lightBg: "bg-emerald-50",
    border: "border-emerald-200",
    gradient: "from-emerald-500 to-teal-600",
  },
  orange: {
    bg: "bg-orange-600",
    text: "text-orange-600",
    lightBg: "bg-orange-50",
    border: "border-orange-200",
    gradient: "from-orange-500 to-red-500",
  },
  purple: {
    bg: "bg-purple-600",
    text: "text-purple-600",
    lightBg: "bg-purple-50",
    border: "border-purple-200",
    gradient: "from-purple-500 to-indigo-600",
  },
  pink: {
    bg: "bg-pink-600",
    text: "text-pink-600",
    lightBg: "bg-pink-50",
    border: "border-pink-200",
    gradient: "from-pink-500 to-rose-500",
  },
  cyan: {
    bg: "bg-cyan-600",
    text: "text-cyan-600",
    lightBg: "bg-cyan-50",
    border: "border-cyan-200",
    gradient: "from-cyan-500 to-blue-500",
  },
  violet: {
    bg: "bg-violet-600",
    text: "text-violet-600",
    lightBg: "bg-violet-50",
    border: "border-violet-200",
    gradient: "from-violet-500 to-fuchsia-600",
  },
};

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
        <Skeleton className="h-8 w-48 rounded-md" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-[210px] w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant="destructive"
        className="rounded-xl border-red-200 bg-red-50/50"
      >
        <AlertCircle className="h-5 w-5" />
        <div className="ml-2">
          <AlertTitle className="font-semibold">Error</AlertTitle>
          <AlertDescription>
            Failed to load subscription data. We could not fetch your modules at
            this time.
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  if (enabledModules.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
              Platform Modules
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Manage and monitor your active ecosystem components
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {enabledModules.map((module) => {
          const Icon = module.icon;
          const styles = colorStyles[module.color] || colorStyles.blue;

          return (
            <Link
              key={module.href}
              href={module.href}
              className="group outline-none"
            >
              <Card
                className={`h-full border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden bg-white dark:bg-gray-900/50 hover:border-${module.color}-200`}
              >
                <div
                  className={`h-1.5 w-full bg-gradient-to-r ${styles.gradient} opacity-80 group-hover:opacity-100 transition-opacity`}
                />
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div
                      className={`p-3.5 rounded-2xl ${styles.lightBg} shadow-inner group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className={`h-6 w-6 ${styles.text}`} />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 -mr-2 -mt-2 hover:bg-transparent"
                    >
                      <div
                        className={`p-2 rounded-full ${styles.lightBg} group-hover:bg-white shadow-sm transition-colors`}
                      >
                        <ArrowRight className={`h-4 w-4 ${styles.text}`} />
                      </div>
                    </Button>
                  </div>
                  <CardTitle className="mt-5 text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:${styles.gradient} transition-all duration-300">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm mt-1.5 text-gray-500 dark:text-gray-400">
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800">
                    {module.stats.total !== undefined ? (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 group/stat">
                          <div
                            className={`p-1.5 rounded-md ${styles.lightBg} group-hover/stat:bg-white transition-colors`}
                          >
                            <TrendingUp
                              className={`h-3.5 w-3.5 ${styles.text}`}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-gray-100 leading-none">
                              {module.stats.total}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                              Total
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 group/stat">
                          <div className="p-1.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 group-hover/stat:bg-white transition-colors">
                            <CheckCircle className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-gray-100 leading-none">
                              {module.stats.active}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                              Active
                            </span>
                          </div>
                        </div>

                        {module.stats.pending! > 0 ? (
                          <div className="flex items-center gap-2 group/stat">
                            <div className="p-1.5 rounded-md bg-amber-50 dark:bg-amber-900/20 group-hover/stat:bg-white transition-colors">
                              <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-bold text-gray-900 dark:text-gray-100 leading-none">
                                {module.stats.pending}
                              </span>
                              <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                                Pending
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-[60px]"></div> // Placeholder for consistent layout
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 group/stat">
                          <div
                            className={`p-1.5 rounded-md ${styles.lightBg} group-hover/stat:bg-white transition-colors`}
                          >
                            <Globe className={`h-3.5 w-3.5 ${styles.text}`} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-gray-100 leading-none">
                              {module.stats.pages}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                              Pages
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 group/stat">
                          <div
                            className={`p-1.5 rounded-md ${styles.lightBg} group-hover/stat:bg-white transition-colors`}
                          >
                            <CheckCircle
                              className={`h-3.5 w-3.5 ${styles.text}`}
                            />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900 dark:text-gray-100 leading-none">
                              {module.stats.modules}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
                              Modules
                            </span>
                          </div>
                        </div>

                        {module.stats.published ? (
                          <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-0 shadow-none font-medium">
                            Published
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground shadow-none"
                          >
                            Draft
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

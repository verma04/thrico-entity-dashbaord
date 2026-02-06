"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, AlertTriangle, Flag, Link2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  useGetModerationStats,
  useGetContentReports,
} from "@/graphql/moderation/hooks";

export function ModerationDashboard() {
  const { data: statsData, loading: statsLoading } = useGetModerationStats();
  const { data: reportsData, loading: reportsLoading } = useGetContentReports({
    status: "PENDING",
    limit: 5,
  });

  const stats = statsData?.getModerationStats || {
    totalReports: 0,
    pendingReports: 0,
    resolvedReports: 0,
    bannedWordsCount: 0,
    blockedLinksCount: 0,
    autoModeratedToday: 0,
  };

  const recentReports = reportsData?.getContentReports.items || [];

  const statCards = [
    {
      title: "Pending Reports",
      value: stats.pendingReports,
      icon: <Flag className="h-4 w-4 text-red-500" />,
      description: "Require immediate attention",
      color: "border-red-100 bg-red-50/50",
    },
    {
      title: "Auto-Moderated Today",
      value: stats.autoModeratedToday,
      icon: <ShieldCheck className="h-4 w-4 text-green-500" />,
      description: "Actions taken today",
      color: "border-green-100 bg-green-50/50",
    },
    {
      title: "Banned Words",
      value: stats.bannedWordsCount,
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      description: "Active word filters",
      color: "border-orange-100 bg-orange-50/50",
    },
    {
      title: "Blocked Links",
      value: stats.blockedLinksCount,
      icon: <Link2 className="h-4 w-4 text-blue-500" />,
      description: "Restricted domains",
      color: "border-blue-100 bg-blue-50/50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => (
          <Card key={idx} className={cn("border shadow-sm", card.color)}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : card.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Pending Reports */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              Recent Pending Reports
            </CardTitle>
            <CardDescription>
              Latest content reports awaiting moderator action
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reportsLoading ? (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                Loading...
              </div>
            ) : recentReports.length > 0 ? (
              <div className="space-y-4">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {report.reportedBy.firstName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium capitalize">
                            {report.contentType.toLowerCase()}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {report.reason}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-[300px]">
                          {report.contentPreview || "No preview available"}
                        </p>
                      </div>
                    </div>
                    <Link href="/settings/moderation/reports">
                      <Button variant="ghost" size="sm">
                        Review
                      </Button>
                    </Link>
                  </div>
                ))}
                <div className="pt-2">
                  <Link href="/settings/moderation/reports">
                    <Button variant="outline" className="w-full">
                      View All Reports
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="h-32 flex flex-col items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                <ShieldCheck className="h-8 w-8 mb-2 opacity-20" />
                <p>All clear! No pending reports.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Center / Quick Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Moderation Health</CardTitle>
            <CardDescription>System status and health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-700">
                  Auto-Mod System
                </span>
                <Badge className="bg-green-600">Online</Badge>
              </div>
              <p className="text-xs text-green-600">
                Working normally. Spam detection is active.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Quick Actions</h4>
              <div className="grid grid-cols-1 gap-2">
                <Link href="/settings/moderation/words">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    <span>Manage Banned Words</span>
                  </Button>
                </Link>
                <Link href="/settings/moderation/links">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2"
                  >
                    <Link2 className="h-4 w-4" />
                    <span>Manage Blocked Links</span>
                  </Button>
                </Link>
                <Link href="/settings/moderation/settings">
                  <Button
                    variant="outline"
                    size="sm"
                    className="justify-start gap-2"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Review Safety Thresholds</span>
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

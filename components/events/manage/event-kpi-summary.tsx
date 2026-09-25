"use client";

import React from "react";
import {
  Calendar,
  Users,
  Eye,
  TrendingUp,
  CheckCircle2,
  Clock,
  Sparkles,
  Radio,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Event, EventStatus } from "@/graphql/actions/events";
import moment from "moment";
import { cn } from "@/lib/utils";

interface EventKpiSummaryProps {
  events: Event[];
  loading?: boolean;
  moduleName?: string;
  onFilterStatus?: (status: EventStatus) => void;
  activeStatus?: string;
}

export function EventKpiSummary({
  events,
  loading,
  moduleName = "Events",
  onFilterStatus,
  activeStatus = "ALL",
}: EventKpiSummaryProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card
            key={i}
            className="border-border/60 bg-card shadow-2xs rounded-xl"
          >
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24 rounded" />
                <Skeleton className="h-7 w-7 rounded-lg" />
              </div>
              <Skeleton className="h-6 w-28 rounded" />
              <Skeleton className="h-2.5 w-3/4 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalEvents = events.length;
  const approvedEvents = events.filter(
    (e) => (e.status || "").toUpperCase() === "APPROVED"
  );
  const pendingEvents = events.filter(
    (e) => (e.status || "").toUpperCase() === "PENDING"
  );

  const now = moment();
  const upcomingEvents = events.filter((e) => {
    if (!e.startDate) return false;
    return moment(e.startDate).isSameOrAfter(now, "day");
  });

  const totalAttendees = events.reduce(
    (acc, e) => acc + (e.numberOfAttendees || 0),
    0
  );
  const totalViews = events.reduce(
    (acc, e) => acc + (e.numberOfViews || 0),
    0
  );

  const avgAttendance =
    totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* 1. Total Events */}
      <Card
        onClick={() => onFilterStatus && onFilterStatus(EventStatus.ALL)}
        className={cn(
          "border-border/60 bg-card shadow-2xs hover:border-primary/40 transition-all rounded-xl cursor-pointer group",
          activeStatus === "ALL" && "ring-1 ring-primary/30 border-primary/40"
        )}
      >
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total {moduleName}
            </span>
            <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 group-hover:scale-105 transition-transform">
              <Calendar className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-foreground tracking-tight">
                {totalEvents.toLocaleString()}
              </span>
              <Badge
                variant="secondary"
                className="text-[9px] px-1.5 py-0 font-bold bg-muted text-muted-foreground rounded"
              >
                {approvedEvents.length} Active
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-indigo-500 shrink-0" />
              <span>{pendingEvents.length} pending approval</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 2. Total Registrations / Attendees */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all rounded-xl">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Attendance
            </span>
            <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/40">
              <Users className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                {totalAttendees.toLocaleString()}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                RSVPs
              </span>
            </div>
            <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-2 flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span>Avg {avgAttendance} attendees per {moduleName.toLowerCase().replace(/s$/, "")}</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 3. Upcoming Schedule */}
      <Card
        onClick={() => onFilterStatus && onFilterStatus(EventStatus.APPROVED)}
        className="border-border/60 bg-card shadow-2xs hover:border-primary/40 transition-all rounded-xl cursor-pointer group"
      >
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Upcoming Schedule
            </span>
            <div className="h-7 w-7 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-900/40 group-hover:scale-105 transition-transform">
              <Clock className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
                {upcomingEvents.length.toLocaleString()}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                scheduled
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <Radio className="h-3 w-3 text-blue-500 shrink-0 animate-pulse" />
              <span>Future scheduled assemblies</span>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 4. Total Impressions & Views */}
      <Card className="border-border/60 bg-card shadow-2xs hover:border-border transition-all rounded-xl">
        <CardContent className="p-4 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Reach & Views
            </span>
            <div className="h-7 w-7 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center border border-purple-100 dark:border-purple-900/40">
              <Eye className="h-3.5 w-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400 tracking-tight">
                {totalViews.toLocaleString()}
              </span>
              <span className="text-[11px] font-medium text-muted-foreground">
                impressions
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-purple-500 shrink-0" />
              <span>Event listing engagement</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

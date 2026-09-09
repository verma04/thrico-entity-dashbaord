"use client";

import React, { useMemo } from "react";
import { useSessionAnalytics } from "@/graphql/analytics/sessionAnalytics";
import { useUrlDateRange } from "@/hooks/use-url-date-range";
import { SessionAnalyticsCard } from "./session-analytics-card";

interface OverallAnalyticsDashboardProps {
  defaultDays?: number;
  className?: string;
}

export function OverallAnalyticsDashboard({
  defaultDays = 7,
  className,
}: OverallAnalyticsDashboardProps) {
  const { dateRange, timeRange } = useUrlDateRange(defaultDays);

  // Format the date picker range to ISO string
  const formattedDateRange = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return undefined;
    return {
      startDate: dateRange.from.toISOString(),
      endDate: dateRange.to.toISOString(),
    };
  }, [dateRange]);

  return (
    <SessionAnalyticsCard
      className={className}
      variables={{
        dateRange: formattedDateRange,
        // fallback if no custom dates selected
        timeRange: !formattedDateRange ? "LAST_7_DAYS" : undefined,
      }}
    />
  );
}

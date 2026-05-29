"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { TimeRange } from "@/graphql/actions/dashboard"
import { startOfYear, endOfYear, subYears, startOfQuarter, endOfQuarter } from "date-fns"

export type ChartTimeFilterValue = {
  timeRange?: TimeRange;
  dateRange?: { startDate: string; endDate: string };
};

interface ChartTimeFilterProps {
  value: string;
  onChange: (key: string, filter: ChartTimeFilterValue) => void;
}

export const chartTimeFilterOptions = [
  { key: "7d", label: "Last 7 days" },
  { key: "30d", label: "Last 30 days" },
  { key: "90d", label: "Last 90 days" },
  { key: "this_month", label: "This Month" },
  { key: "last_month", label: "Last Month" },
  { key: "this_quarter", label: "This Quarter" },
  { key: "this_year", label: "This Year" },
  { key: "last_year", label: "Last Year" },
]

export function getChartTimeFilter(key: string): ChartTimeFilterValue {
  const now = new Date();
  switch (key) {
    case "7d": return { timeRange: TimeRange.LAST_7_DAYS }
    case "30d": return { timeRange: TimeRange.LAST_30_DAYS }
    case "90d": return { timeRange: TimeRange.LAST_90_DAYS }
    case "this_month": return { timeRange: TimeRange.THIS_MONTH }
    case "last_month": return { timeRange: TimeRange.LAST_MONTH }
    case "this_quarter": return {
      dateRange: {
        startDate: startOfQuarter(now).toISOString(),
        endDate: endOfQuarter(now).toISOString()
      }
    }
    case "this_year": return {
      dateRange: {
        startDate: startOfYear(now).toISOString(),
        endDate: endOfYear(now).toISOString()
      }
    }
    case "last_year": return {
      dateRange: {
        startDate: startOfYear(subYears(now, 1)).toISOString(),
        endDate: endOfYear(subYears(now, 1)).toISOString()
      }
    }
    default: return { timeRange: TimeRange.LAST_90_DAYS }
  }
}

export function ChartTimeFilter({ value, onChange }: ChartTimeFilterProps) {
  const handleValueChange = (val: string) => {
    onChange(val, getChartTimeFilter(val));
  }

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger
        className="w-[140px] rounded-lg h-8 text-[11px] font-medium bg-background/50 border-border/70 hover:bg-accent/50 transition-colors"
        aria-label="Select time range"
      >
        <SelectValue placeholder="Select timeframe" />
      </SelectTrigger>
      <SelectContent className="rounded-xl border-border/60 backdrop-blur-xl bg-background/95">
        {chartTimeFilterOptions.map(opt => (
          <SelectItem key={opt.key} value={opt.key} className="text-xs font-medium">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

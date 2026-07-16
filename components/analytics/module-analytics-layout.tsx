import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowUpRight, ArrowDownRight, LucideIcon } from "lucide-react";
import { TimeRange } from "@/graphql/actions";

export interface KPIStat {
  title: string;
  value: string | number | React.ReactNode;
  change?: number;
  trend?: "up" | "down";
  icon: LucideIcon;
  color?: string;
  bgColor?: string;
}

interface ModuleAnalyticsLayoutProps {
  title: string;
  description?: string;
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  kpiStats: KPIStat[];
  children?: React.ReactNode;
}

export const ModuleAnalyticsLayout: React.FC<ModuleAnalyticsLayoutProps> = ({
  title,
  description,
  timeRange,
  onTimeRangeChange,
  kpiStats,
  children,
}) => {
  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          {description && (
            <p className="text-muted-foreground">{description}</p>
          )}
        </div>
        <Select
          value={timeRange}
          onValueChange={(val) => onTimeRangeChange(val as TimeRange)}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TimeRange.LAST_24_HOURS}>
              Last 24 hours
            </SelectItem>
            <SelectItem value={TimeRange.LAST_7_DAYS}>Last 7 days</SelectItem>
            <SelectItem value={TimeRange.LAST_30_DAYS}>Last 30 days</SelectItem>
            <SelectItem value={TimeRange.LAST_90_DAYS}>Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiStats.map((stat, index) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;
          const trendColor =
            stat.trend === "up" ? "text-emerald-600" : "text-rose-600";
          const trendBg = stat.trend === "up" ? "bg-emerald-50" : "bg-rose-50";

          return (
            <Card
              key={index}
              className="shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-2xl ${
                      stat.bgColor || "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`h-6 w-6 ${stat.color || "text-gray-700"}`}
                    />
                  </div>
                  {stat.change !== undefined && (
                    <div
                      className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendBg} ${trendColor}`}
                    >
                      <TrendIcon className="h-3 w-3" />
                      {Math.round(Math.abs(stat.change))}%
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    {stat.title}
                  </p>
                  <div className="text-3xl font-bold flex items-center tracking-tight">
                    {stat.value}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Area (Charts) */}
      {children}
    </div>
  );
};

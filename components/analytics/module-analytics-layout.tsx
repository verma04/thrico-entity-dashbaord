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
            stat.trend === "up" ? "text-gray-600" : "text-gray-500";

          return (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-2 rounded-lg ${
                      stat.bgColor || "bg-gray-100"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${stat.color || "text-gray-700"}`}
                    />
                  </div>
                  {stat.change !== undefined && (
                    <div
                      className={`flex items-center gap-1 text-sm font-semibold ${trendColor}`}
                    >
                      <TrendIcon className="h-4 w-4" />
                      {Math.abs(stat.change)}%
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <div className="text-2xl font-bold mt-1 flex items-center min-h-[32px]">
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

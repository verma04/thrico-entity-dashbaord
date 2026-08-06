import React from "react";
import { cn } from "@/lib/utils";
import {
  LucideIcon,
  TrendingUp,
  TrendingDown,
  Activity,
  Info,
} from "lucide-react";
import { formatNumber } from "@/lib/formatNumber";
import { ResponsiveContainer, AreaChart, Area } from "recharts";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface EcosystemKPIProps {
  title: string;
  value: string | number | React.ReactNode;
  trend?: number;
  trendData?: number[];
  icon?: LucideIcon;
  color?: string; // Kept for backwards compatibility
  bg?: string; // Kept for backwards compatibility
  trendLabel?: string;
  tooltip?: string;
  suffix?: string;
  colorScheme?:
    | "indigo"
    | "sky"
    | "lime"
    | "rose"
    | "purple"
    | "orange"
    | "slate";
}

const colorStyles = {
  indigo: {
    bg: "bg-card border-border/50",
    iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
    iconColor: "text-indigo-600 dark:text-indigo-400",
  },
  sky: {
    bg: "bg-card border-border/50",
    iconBg: "bg-sky-100 dark:bg-sky-900/40",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
  lime: {
    bg: "bg-card border-border/50",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/40",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  rose: {
    bg: "bg-card border-border/50",
    iconBg: "bg-rose-100 dark:bg-rose-900/40",
    iconColor: "text-rose-600 dark:text-rose-400",
  },
  purple: {
    bg: "bg-card border-border/50",
    iconBg: "bg-purple-100 dark:bg-purple-900/40",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  orange: {
    bg: "bg-card border-border/50",
    iconBg: "bg-orange-100 dark:bg-orange-900/40",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  slate: {
    bg: "bg-card border-border/50",
    iconBg: "bg-muted",
    iconColor: "text-muted-foreground",
  },
};

// Helper to map old raw color classes to our new color schemes
function inferColorScheme(
  colorClass?: string,
  bgClass?: string,
): keyof typeof colorStyles {
  const str = `${colorClass || ""} ${bgClass || ""}`.toLowerCase();
  if (str.includes("amber") || str.includes("orange")) return "orange";
  if (str.includes("indigo") || str.includes("blue")) return "indigo";
  if (str.includes("emerald") || str.includes("green") || str.includes("lime"))
    return "lime";
  if (str.includes("rose") || str.includes("red")) return "rose";
  if (str.includes("purple") || str.includes("violet")) return "purple";
  if (str.includes("sky") || str.includes("cyan")) return "sky";
  return "slate"; // Default fallback
}

export function EcosystemKPI({
  title,
  value,
  trend,
  trendData,
  icon: Icon,
  color,
  bg,
  trendLabel = "vs last period",
  tooltip,
  suffix = "",
  colorScheme,
}: EcosystemKPIProps) {
  const isPositive = trend !== undefined && trend >= 0;
  const isNegative = trend !== undefined && trend < 0;

  // Resolve color scheme
  const scheme = colorScheme || inferColorScheme(color, bg);
  const currentStyle = colorStyles[scheme] || colorStyles.slate;

  // Create dummy flat trend if none provided but we want the aesthetic
  const chartData = (trendData ?? [0, 0, 0, 0, 0, 0, 0]).map((val, i) => ({
    value: val,
    id: i,
  }));

  const formattedValue =
    typeof value === "number" ? formatNumber(value) : value;

  return (
    <div
      className={cn(
        "relative flex flex-col p-3 rounded-[12px] border transition-all duration-300 hover:shadow-sm overflow-hidden",
        currentStyle.bg,
      )}
    >
      <div className="flex items-start justify-between relative z-10">
        {Icon ? (
          <div
            className={cn(
              "h-6 w-6 rounded-[6px] flex items-center justify-center shadow-none",
              currentStyle.iconBg,
            )}
          >
            <Icon
              className={cn(
                "h-3 w-3 z-1",
                (currentStyle as any).iconColor ?? "text-white",
              )}
            />
          </div>
        ) : (
          <div className="h-6 w-6 rounded-[6px] bg-muted/50" />
        )}

        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-3.5 w-3.5 text-muted-foreground/30 cursor-help hover:text-muted-foreground/60 transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px] bg-background border border-border/60 text-foreground shadow-xl">
                <p className="font-mono text-[10px] text-muted-foreground">
                  {tooltip}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="mt-2 relative z-10">
        <h3 className="text-[8px] font-bold text-muted-foreground/60 uppercase tracking-[0.1em] mb-0.5 leading-tight">
          {title}
        </h3>

        <div className="flex items-end gap-1.5">
          <span className="text-base font-bold text-foreground tracking-tight leading-none tabular-nums">
            {formattedValue}
            {suffix}
          </span>
          {trend !== undefined && trend !== 0 && (
            <div
              className={cn(
                "flex items-center gap-0.5 text-[9px] font-bold mb-px",
                isPositive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-rose-600 dark:text-rose-400",
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-2.5 w-2.5" />
              ) : (
                <TrendingDown className="h-2.5 w-2.5" />
              )}
              {isPositive ? "+" : ""}
              {typeof trend === "number" ? trend.toFixed(1) : trend}%
            </div>
          )}
        </div>
      </div>

      {/* Subtle sparkline in the background at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none opacity-30 mix-blend-multiply dark:mix-blend-lighten">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id={`gradient-${title.replace(/\s+/g, "")}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={
                    isPositive ? "#10b981" : isNegative ? "#f43f5e" : "#8b5cf6"
                  }
                  stopOpacity={0.4}
                />
                <stop
                  offset="95%"
                  stopColor={
                    isPositive ? "#10b981" : isNegative ? "#f43f5e" : "#8b5cf6"
                  }
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={
                isPositive ? "#10b981" : isNegative ? "#f43f5e" : "#8b5cf6"
              }
              strokeWidth={1.5}
              fillOpacity={1}
              fill={`url(#gradient-${title.replace(/\s+/g, "")})`}
              isAnimationActive={true}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

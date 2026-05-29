"use client"

import * as React from "react"
import { MonitorSmartphone, Laptop, Smartphone } from "lucide-react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { useGetLoginSessionsReport, TimeRange, GroupBy } from "@/graphql/actions/dashboard"

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#6366f1", // Indigo
  },
  mobile: {
    label: "Mobile",
    color: "#f43f5e", // Rose
  },
} satisfies ChartConfig

export function DashboardSessionRadarChart() {
  const { data, loading } = useGetLoginSessionsReport(TimeRange.LAST_90_DAYS, GroupBy.MONTH)
  const chartData = data?.getLoginSessionsReport || []

  // Ensure data formatting for displaying "month" in the radar chart mapping
  const formattedData = React.useMemo(() => {
    return chartData.map((d) => {
      // Clean up the label if it's a date string to just show Month
      let displayLabel = d.time;
      if (displayLabel && displayLabel.includes("-")) {
        const date = new Date(displayLabel + "-01"); // Append day to prevent off-by-one errors with timezones
        if (!isNaN(date.getTime())) {
          displayLabel = date.toLocaleDateString("en-US", { month: "short" });
        }
      }
      
      return {
        ...d,
        month: displayLabel,
      }
    })
  }, [chartData])

  // Calculate totals for summary metrics
  const totals = React.useMemo(() => {
    return chartData.reduce(
      (acc, curr) => ({
        desktop: acc.desktop + curr.desktop,
        mobile: acc.mobile + curr.mobile,
      }),
      { desktop: 0, mobile: 0 }
    )
  }, [chartData])

  const totalSessions = totals.desktop + totals.mobile;

  return (
    <Card className="border-border/60 shadow-sm relative flex flex-col h-full overflow-hidden">
      <CardHeader className="flex flex-col gap-1 pb-2 border-b border-border/40 relative z-10">
        <div className="space-y-1.5 w-full">
          <CardTitle className="text-rose-500 tracking-wider flex items-center gap-2 text-base">
            <div className="p-1.5 rounded-md bg-rose-500/10"><MonitorSmartphone className="h-4 w-4 text-rose-500" /></div>
            Login Sessions
          </CardTitle>
          <CardDescription>Desktop vs Mobile login patterns over the last 3 months.</CardDescription>
        </div>

        {!loading && totalSessions > 0 && (
          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-border/40">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#6366f1]/10 flex items-center justify-center">
                <Laptop className="h-4 w-4 text-[#6366f1]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-0.5">Desktop</p>
                <p className="text-sm font-bold leading-none">{((totals.desktop / totalSessions) * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-[#f43f5e]/10 flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-[#f43f5e]" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-0.5">Mobile</p>
                <p className="text-sm font-bold leading-none">{((totals.mobile / totalSessions) * 100).toFixed(0)}%</p>
              </div>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 pb-4 relative min-h-[300px]">
        {/* Abstract Background Elements */}

        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm transition-all duration-300">
            <div className="flex flex-col items-center gap-3 bg-background/90 p-4 rounded-xl shadow-lg border border-border/50">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-500 border-t-transparent" />
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                Analyzing Sessions
              </p>
            </div>
          </div>
        )}
        
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-[4/3] w-full pt-4"
        >
          <BarChart data={formattedData} margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground)/0.2)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12, fontWeight: 500 }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--muted)/0.4)" }}
              content={
                <ChartTooltipContent
                  className="backdrop-blur-xl bg-background/95 border-border/50 shadow-xl rounded-xl"
                />
              }
            />
            <Bar
              name="Desktop"
              dataKey="desktop"
              stackId="a"
              fill="var(--color-desktop)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              name="Mobile"
              dataKey="mobile"
              stackId="a"
              fill="var(--color-mobile)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

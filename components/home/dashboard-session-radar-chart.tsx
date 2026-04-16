"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

export function DashboardSessionRadarChart() {
  const { data, loading } = useGetLoginSessionsReport(TimeRange.LAST_90_DAYS, GroupBy.MONTH)

  const chartData = data?.getLoginSessionsReport || []

  // Ensure data formatting for displaying "month" in the radar chart mapping
  const formattedData = React.useMemo(() => {
    return chartData.map((d) => ({
      ...d,
      month: d.time,
    }))
  }, [chartData])

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm relative">
      <CardHeader className="items-center pb-4">
        <CardTitle className="text-lg font-semibold tracking-tight">Login Sessions</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Desktop vs Mobile for the last 3 months
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0 relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                Loading Sessions...
              </p>
            </div>
          </div>
        )}
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px] w-full"
        >
          <RadarChart data={formattedData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarAngleAxis dataKey="month" className="text-[10px] font-medium" />
            <PolarGrid radialLines={false} className="stroke-muted-foreground/20" />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0}
              stroke="var(--color-desktop)"
              strokeWidth={3}
            />
            <Radar
              dataKey="mobile"
              fill="var(--color-mobile)"
              fillOpacity={0}
              stroke="var(--color-mobile)"
              strokeWidth={3}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

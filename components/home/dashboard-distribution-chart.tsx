"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Monitor, Smartphone, Tablet } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  useGetDeviceDistribution,
  TimeRange,
} from "@/graphql/actions/dashboard"

const timeRangeMap: Record<string, TimeRange> = {
  "90d": TimeRange.LAST_90_DAYS,
  "30d": TimeRange.LAST_30_DAYS,
  "7d": TimeRange.LAST_7_DAYS,
}

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  web: {
    label: "Web",
    color: "hsl(var(--chart-1))",
    icon: Monitor,
  },
  ios: {
    label: "iOS",
    color: "hsl(var(--chart-2))",
    icon: Smartphone,
  },
  android: {
    label: "Android",
    color: "hsl(var(--chart-3))",
    icon: Smartphone,
  },
} satisfies ChartConfig

export function DashboardDistributionChart() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const { data, loading } = useGetDeviceDistribution(timeRangeMap[timeRange])

  const chartData = data?.getDeviceDistribution || []

  return (
    <Card className="border-border/60 bg-gradient-to-b from-background to-muted/20 shadow-sm overflow-hidden min-h-[450px]">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b border-border/60 py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle className="text-lg font-semibold tracking-tight">Device Distribution</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Visitor traffic across Web, iOS, and Android platforms
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-xl sm:ml-auto h-9 text-xs bg-background/50 border-border/70"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-border/60">
            <SelectItem value="90d" className="text-xs">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="text-xs">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="text-xs">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6 relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
                Loading Distribution...
              </p>
            </div>
          </div>
        )}
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillWeb" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-web)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-web)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillIos" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-ios)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-ios)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAndroid" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-android)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-android)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted-foreground/20" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
              className="text-[10px] font-medium text-muted-foreground"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="android"
              type="natural"
              fill="url(#fillAndroid)"
              stroke="var(--color-android)"
              stackId="a"
              strokeWidth={2}
            />
            <Area
              dataKey="ios"
              type="natural"
              fill="url(#fillIos)"
              stroke="var(--color-ios)"
              stackId="a"
              strokeWidth={2}
            />
            <Area
              dataKey="web"
              type="natural"
              fill="url(#fillWeb)"
              stroke="var(--color-web)"
              stackId="a"
              strokeWidth={2}
            />
            <ChartLegend content={<ChartLegendContent />} className="pt-4" />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

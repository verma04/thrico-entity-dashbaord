"use client";

import { useEventDetailStats } from "@/graphql/actions/events";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  Ticket,
  Users,
  DollarSign,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

export default function EventAnalytics({ eventId }: { eventId: string }) {
  const { data, loading } = useEventDetailStats(eventId);
  const stats = data?.getEventDetailStats;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin border-2 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-muted-foreground">Analysing event data...</p>
      </div>
    );
  }

  const kpis = [
    {
      title: "Total Revenue",
      value: `$${stats?.totalRevenue?.toLocaleString() || "0"}`,
      description: "Gross revenue from ticket sales",
      icon: DollarSign,
      color: "text-green-600",
      bg: "bg-green-500/10",
    },
    {
      title: "Tickets Sold",
      value: stats?.totalTicketsSold?.toLocaleString() || "0",
      description: "Total number of tickets purchased",
      icon: Ticket,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
    },
    {
      title: "Attendees",
      value: stats?.totalAttendees?.toLocaleString() || "0",
      description: "Registered participants",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
    },
    {
      title: "Check-in Rate",
      value: `${Math.round(stats?.checkInRate || 0)}%`,
      description: "Current attendance conversion",
      icon: CheckCircle,
      color: "text-orange-600",
      bg: "bg-orange-500/10",
    },
  ];

  const hourlyData = stats?.hourlyData || [];

  const ticketDistribution = stats?.ticketDistribution || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Event Analytics</h2>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          <TrendingUp className="h-4 w-4 text-green-500" />
          Real-time tracking enabled
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <Card
            key={i}
            className="border-none shadow-sm ring-1 ring-border/50 overflow-hidden group"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {kpi.title}
                  </p>
                  <h3 className="text-3xl font-bold mt-1">{kpi.value}</h3>
                </div>
                <div
                  className={`${kpi.bg} p-2.5 rounded-xl transition-transform group-hover:scale-110`}
                >
                  <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
                </div>
              </div>
              <p className="mt-4 text-xs text-muted-foreground flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-green-500" />
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm ring-1 ring-border/50">
          <CardHeader>
            <CardTitle>Attendance Flow</CardTitle>
            <CardDescription>
              Live attendee check-ins over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#88888820"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#888888" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#888888" }}
                  />
                  <Tooltip
                    cursor={{ fill: "#88888810" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm ring-1 ring-border/50">
          <CardHeader>
            <CardTitle>Ticket Distribution</CardTitle>
            <CardDescription>Sales by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ticketDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {ticketDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {ticketDistribution.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">
                    {stats?.totalTicketsSold
                      ? Math.round((item.value / stats.totalTicketsSold) * 100)
                      : 0}
                    %
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

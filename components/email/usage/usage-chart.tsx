"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetEmailDeliveryPerformance } from "@/graphql/actions/email";
import { RefreshCw } from "lucide-react";

export function UsageChart() {
  const { data: performanceData, loading } = useGetEmailDeliveryPerformance();
  
  const chartData = performanceData?.getEmailDeliveryPerformance || [
    { day: "Mon", sent: 0, delivered: 0 },
    { day: "Tue", sent: 0, delivered: 0 },
    { day: "Wed", sent: 0, delivered: 0 },
    { day: "Thu", sent: 0, delivered: 0 },
    { day: "Fri", sent: 0, delivered: 0 },
    { day: "Sat", sent: 0, delivered: 0 },
    { day: "Sun", sent: 0, delivered: 0 },
  ];

  if (loading) {
    return (
      <Card className="border-border shadow-none bg-background h-[400px] flex items-center justify-center">
        <RefreshCw className="h-5 w-5 text-muted-foreground animate-spin" />
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-none bg-background">
      <CardHeader className="px-5 py-4 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-foreground">
              Delivery Distribution
            </CardTitle>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Historical delivery performance
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-slate-900" />
              <span className="text-[10px] font-medium text-muted-foreground">Sent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-medium text-muted-foreground">Delivered</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#64748b' }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#64748b' }} 
              />
              <RechartsTooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: '1px solid rgba(0,0,0,0.05)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                  fontSize: '12px'
                }} 
              />
              <Area
                type="monotone"
                dataKey="sent"
                stroke="#0f172a"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSent)"
              />
              <Area
                type="monotone"
                dataKey="delivered"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorDelivered)"
              />
              <defs>
                <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f172a" stopOpacity={0.05} />
                  <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.05} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

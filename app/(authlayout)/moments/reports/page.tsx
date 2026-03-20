"use client";

import React from "react";
import { BarChart3, TrendingUp, Eye, Heart, MessageSquare, Video, Download } from "lucide-react";
import { SettingsHeader } from "@/components/settings/settings-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetMomentDashboardKPIs } from "@/graphql/actions/moments";
import { TimeRange } from "@/graphql/actions/dashboard";

export default function MomentsReportsPage() {
  const { data: statsData, loading } = useGetMomentDashboardKPIs(TimeRange.LAST_30_DAYS);
  const stats = statsData?.getMomentAnalytics;

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <SettingsHeader
          title="Moments Reports"
          description="Detailed performance metrics and engagement analytics."
          breadcrumb="Content & Engagement"
          icon={BarChart3}
        />
        <Button variant="outline" className="rounded-xl font-bold text-[10px] uppercase tracking-widest gap-2">
            <Download className="h-4 w-4" />
            Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="rounded-[40px] border-none shadow-2xl shadow-black/5 bg-background overflow-hidden">
              <CardHeader className="border-b border-muted/50 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Growth Trends</CardTitle>
                        <p className="text-[10px] text-muted-foreground font-medium mt-1">Video upload rate over time</p>
                    </div>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center p-0">
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <BarChart3 className="h-8 w-8" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Growth Matrix Visualizer</p>
                  </div>
              </CardContent>
          </Card>

          <Card className="rounded-[40px] border-none shadow-2xl shadow-black/5 bg-background overflow-hidden">
              <CardHeader className="border-b border-muted/50 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-sm font-black uppercase tracking-widest">Engagement Core</CardTitle>
                        <p className="text-[10px] text-muted-foreground font-medium mt-1">Interactions distribution</p>
                    </div>
                    <Heart className="h-4 w-4 text-rose-500 fill-rose-500/10" />
                  </div>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center p-0">
                  <div className="flex flex-col items-center gap-2 opacity-20">
                    <div className="w-16 h-16 rounded-full border-4 border-muted flex items-center justify-center" />
                    <p className="text-[10px] font-black uppercase tracking-widest">Distribution Chart coming soon</p>
                  </div>
              </CardContent>
          </Card>
      </div>

      <div className="space-y-6">
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Detailed Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                  { label: "Completion Rate", value: "68%", icon: Eye, color: "text-blue-500" },
                  { label: "Avg. Watch Time", value: "14.2s", icon: Video, color: "text-purple-500" },
                  { label: "Share Velocity", value: "2.4/hr", icon: BarChart3, color: "text-amber-500" },
                  { label: "Re-watch Ratio", value: "1.12x", icon: TrendingUp, color: "text-emerald-500" },
              ].map((m, i) => (
                  <div key={i} className="p-6 bg-muted/10 rounded-3xl border border-muted/20 flex flex-col gap-1">
                      <m.icon className={`h-4 w-4 ${m.color} mb-2`} />
                      <p className="text-[18px] font-black tracking-tighter">{m.value}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{m.label}</p>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
}

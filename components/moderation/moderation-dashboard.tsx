"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ShieldCheck, AlertTriangle, Flag, Link2, Clock, Inbox, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import {
  useGetModerationStats,
  useGetContentReports,
} from "@/graphql/moderation/hooks";
import { AiModerationDashboardWidget } from "./ai-moderation-dashboard-widget";
import { ModerationSummaryWidget } from "./moderation-summary-widget";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";

export function ModerationDashboard() {
  const { data: statsData, loading: statsLoading } = useGetModerationStats();
  const { data: reportsData, loading: reportsLoading } = useGetContentReports({
    status: "PENDING",
    limit: 5,
  });

  const recentReports = reportsData?.getContentReports.items || [];

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Content Moderation"
        description="Monitor, review, and manage community content safety across your platform."
        breadcrumb="Trust & Safety"
        icon={ShieldCheck}
        badgeText="Safety Center"
        showLiveIndicator={false}
      />
      
      <div className="space-y-6">
        {/* Overview Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ModerationSummaryWidget />
          <AiModerationDashboardWidget />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Pending Reports */}
          <div className="lg:col-span-8 rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200 shrink-0">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                   <h3 className="text-[14px] font-semibold text-slate-900 tracking-tight">Pending Reports</h3>
                   <p className="text-[11px] text-slate-500 mt-0.5">Content awaiting manual review</p>
                </div>
              </div>
              <Link href="/settings/moderation/reports">
                <Button variant="outline" size="sm" className="h-8 text-[11px] font-semibold border-slate-200">
                  View All Queue
                </Button>
              </Link>
            </div>
            
            <div className="p-0">
              {reportsLoading ? (
                <div className="h-48 flex flex-col items-center justify-center text-slate-400 space-y-3">
                  <div className="h-6 w-6 rounded-full border-2 border-slate-200 border-t-slate-400 animate-spin" />
                  <span className="text-[12px] font-medium">Fetching reports...</span>
                </div>
              ) : recentReports.length > 0 ? (
                <div className="divide-y divide-slate-100">
                  {recentReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-center justify-between p-5 hover:bg-slate-50/50 transition-colors group"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="h-9 w-9 border border-slate-200 shadow-sm mt-0.5">
                          <AvatarFallback className="bg-slate-100 text-[12px] font-bold text-slate-600">
                            {report.reportedBy.firstName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[13px] font-semibold text-slate-900 capitalize leading-none pt-1">
                              {report.contentType.toLowerCase()}
                            </span>
                            <Badge variant="outline" className="text-[9px] uppercase tracking-widest font-bold border-red-200 text-red-600 bg-red-50 px-1.5 py-0">
                              {report.reason}
                            </Badge>
                          </div>
                          <p className="text-[12px] text-slate-500 truncate max-w-sm md:max-w-md">
                            {report.contentPreview || "No preview available..."}
                          </p>
                        </div>
                      </div>
                      <Link href="/settings/moderation/reports">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center">
                  <div className="h-12 w-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-3">
                     <ShieldCheck className="h-6 w-6 text-slate-300" />
                  </div>
                  <p className="text-[13px] font-semibold text-slate-900">Queue is empty</p>
                  <p className="text-[12px] text-slate-500 mt-0.5">No pending reports require your attention.</p>
                </div>
              )}
            </div>
          </div>
  
          {/* Action Center / Quick Settings */}
          <div className="lg:col-span-4 rounded-xl border border-slate-200/80 bg-slate-50/30 shadow-sm flex flex-col h-fit">
            <div className="px-5 py-4 border-b border-slate-100 bg-white rounded-t-xl">
               <h3 className="text-[13px] font-semibold text-slate-900 tracking-tight">System Health</h3>
               <p className="text-[11px] text-slate-500 mt-0.5">Automated filters & tools</p>
            </div>
            
            <div className="p-5 space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Activity className="h-24 w-24 text-emerald-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-bold text-emerald-800 uppercase tracking-widest">
                      Auto-Mod
                    </span>
                    <div className="flex items-center gap-1.5 bg-emerald-500 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full shadow-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      Online
                    </div>
                  </div>
                  <p className="text-[11px] font-medium text-emerald-700/80">
                    Neural filters and spam detection actively screening content.
                  </p>
                </div>
              </div>
  
              <div className="space-y-2.5">
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Actions</h4>
                <div className="grid grid-cols-1 gap-2">
                  <Link href="/settings/moderation/words" className="group">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-sm cursor-pointer">
                      <div className="h-7 w-7 rounded bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[12px] font-semibold text-slate-700 group-hover:text-slate-900">Manage Banned Words</span>
                    </div>
                  </Link>
                  <Link href="/settings/moderation/links" className="group">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-sm cursor-pointer">
                      <div className="h-7 w-7 rounded bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <Link2 className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[12px] font-semibold text-slate-700 group-hover:text-slate-900">Manage Blocked Links</span>
                    </div>
                  </Link>
                  <Link href="/settings/moderation/settings" className="group">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-colors shadow-sm cursor-pointer">
                      <div className="h-7 w-7 rounded bg-slate-100 text-slate-600 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-colors">
                        <ShieldCheck className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[12px] font-semibold text-slate-700 group-hover:text-slate-900">Safety Thresholds</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </EcosystemWrapper>
  );
}

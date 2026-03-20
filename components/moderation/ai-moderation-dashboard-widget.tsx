"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useGetAiModerationDashboard } from "@/graphql/moderation/hooks";
import { Bot, FileText, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { History, ExternalLink } from "lucide-react";

export function AiModerationDashboardWidget() {
  const { data, loading, error } = useGetAiModerationDashboard();

  if (error) {
    return (
      <Card className="border-red-100 bg-red-50/50">
        <CardContent className="pt-6">
          <p className="text-red-500">Failed to load AI Moderation Dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  const aiStats = data?.getAiModerationDashboard;

  const totalPosts = aiStats?.totalPosts || 0;
  const flagged = aiStats?.flaggedContent || 0;
  const pending = aiStats?.pendingModeration || 0;
  const rejected = aiStats?.rejectedPosts || 0;
  const autoApproved = totalPosts - flagged - pending - rejected;

  const getPercentage = (value: number) => {
    return totalPosts > 0 ? Math.round((value / totalPosts) * 100) : 0;
  };

  return (
    <Card className="col-span-1 border-none shadow-xl bg-linear-to-br from-indigo-50/80 via-white to-blue-50/80 backdrop-blur-md overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-700 pointer-events-none">
        <Bot className="h-32 w-32 rotate-12" />
      </div>
      
      <CardHeader className="pb-4 relative z-10">
        <CardTitle className="text-xl font-black flex items-center gap-3 text-slate-900 tracking-tight">
          <div className="p-2 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 animate-pulse-slow">
            <Bot className="h-6 w-6" />
          </div>
          AI Content Gateway
          <Badge variant="secondary" className="ml-2 bg-indigo-100 text-indigo-700 border-indigo-200 font-bold animate-pulse">
            LIVE ANALYTICS
          </Badge>
        </CardTitle>
        <CardDescription className="text-slate-500 font-medium">
          Autonomous content moderation processed via Thrico AI Pipeline
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="flex-1 min-w-[120px] flex flex-col p-4 rounded-2xl bg-white/80 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
              <FileText className="h-3.5 w-3.5 text-indigo-500" />
              Total Analyzed
            </div>
            <div className="text-3xl font-black text-slate-900 tracking-tighter">
              {loading ? <Skeleton className="h-9 w-16" /> : totalPosts.toLocaleString()}
            </div>
          </div>
          
          <div className="flex-1 min-w-[120px] flex flex-col p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 text-[10px] font-black text-amber-600 uppercase tracking-widest mb-2">
              <AlertCircle className="h-3.5 w-3.5" />
              Flagged
            </div>
            <div className="text-3xl font-black text-amber-700 tracking-tighter">
              {loading ? <Skeleton className="h-9 w-16" /> : flagged.toLocaleString()}
            </div>
          </div>
          
          <div className="flex-1 min-w-[120px] flex flex-col p-4 rounded-2xl bg-red-50/50 border border-red-100/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 text-[10px] font-black text-red-600 uppercase tracking-widest mb-2">
              <XCircle className="h-3.5 w-3.5" />
              Rejected
            </div>
            <div className="text-3xl font-black text-red-700 tracking-tighter">
              {loading ? <Skeleton className="h-9 w-16" /> : rejected.toLocaleString()}
            </div>
          </div>
          
          <div className="flex-1 min-w-[120px] flex flex-col p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100/50 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-2">
              <Bot className="h-3.5 w-3.5" />
              Pending
            </div>
            <div className="text-3xl font-black text-indigo-700 tracking-tighter">
              {loading ? <Skeleton className="h-9 w-16" /> : pending.toLocaleString()}
            </div>
          </div>
        </div>

        {!loading && totalPosts > 0 && (
          <div className="space-y-6 bg-white/60 p-6 rounded-3xl border border-white/80 shadow-inner backdrop-blur-sm">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-200 animate-pulse" />
                  Auto-Approval Trust Score
                </span>
                <Badge variant="outline" className="text-green-700 border-green-200 bg-green-50 font-black">
                  {getPercentage(autoApproved)}%
                </Badge>
              </div>
              <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-50 shadow-inner">
                <div 
                  className="h-full bg-linear-to-r from-green-400 to-emerald-500 rounded-full shadow-sm transition-all duration-1000 ease-out"
                  style={{ width: `${getPercentage(autoApproved)}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-amber-600">
                  <span>Flagged Rate</span>
                  <span>{getPercentage(flagged)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getPercentage(flagged)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-red-500">
                  <span>Rejection Rate</span>
                  <span>{getPercentage(rejected)}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-red-500 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${getPercentage(rejected)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-6 flex items-center gap-3">
          <Link href="/settings/moderation/ai-logs" className="flex-1">
            <Button variant="outline" className="w-full h-10 rounded-xl flex items-center gap-2 border-slate-100 text-slate-600 hover:bg-slate-50 font-bold text-xs uppercase tracking-tight">
              <History className="h-4 w-4" />
              Audit Logs
            </Button>
          </Link>
          <Link href="/settings/moderation/reports" className="flex-1">
            <Button className="w-full h-10 rounded-xl flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-tight shadow-lg shadow-indigo-100">
              Review Content
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import React from "react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Database, HardDrive, FileText, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface StorageStat {
  module: string;
  totalBytes: number;
  fileCount: number;
}

interface StorageSummary {
  totalBytes: number;
  totalFileCount: number;
}

interface StorageStatsProps {
  stats?: StorageStat[];
  summary?: StorageSummary;
}

const formatBytes = (bytes: number | undefined, decimals = 1) => {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i];
};

const moduleBarColors: Record<string, string> = {
  default: "bg-slate-500",
  media: "bg-blue-500",
  documents: "bg-emerald-500",
  images: "bg-violet-500",
  backups: "bg-amber-500",
};

export const StorageStats = ({
  stats = [],
  summary = { totalBytes: 0, totalFileCount: 0 },
}: StorageStatsProps) => {
  const TOTAL_LIMIT = 5 * 1024 * 1024 * 1024; // 5 GB
  const usedBytes = summary.totalBytes || 0;
  const percent = TOTAL_LIMIT > 0 ? Math.min((usedBytes / TOTAL_LIMIT) * 100, 100) : 0;

  const usageColor =
    percent > 90 ? "bg-red-500" : percent > 70 ? "bg-amber-400" : "bg-slate-800";

  const badgeStyle =
    percent > 90
      ? "bg-red-50 text-red-700 border-red-200"
      : percent > 70
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-900 flex items-center justify-center shrink-0">
            <Database className="h-4.5 w-4.5 text-white" />
          </div>
          <div>
            <h2 className="text-[14px] font-semibold text-slate-900 leading-none tracking-tight">
              Storage
            </h2>
            <p className="text-[11px] text-slate-400 mt-1">Cloud file usage</p>
          </div>
        </div>
        <span
          className={cn(
            "text-[10px] font-semibold uppercase tracking-wider border px-2 py-1 rounded-md",
            badgeStyle
          )}
        >
          {percent.toFixed(1)}% used
        </span>
      </div>

      {/* Main bar */}
      <div className="px-5 py-4 space-y-2">
        <div className="flex items-center justify-between text-[12px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <HardDrive className="h-3 w-3" />
            <span>Cloud Storage</span>
          </div>
          <span className="font-semibold text-slate-800 tabular-nums">
            {formatBytes(usedBytes)}
            <span className="font-normal text-slate-400"> / {formatBytes(TOTAL_LIMIT)}</span>
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-all duration-700", usageColor)}
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px]">
          {percent > 80 ? (
            <span className="text-red-600 font-medium flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
              Running low — consider upgrading
            </span>
          ) : (
            <span className="text-slate-400">{(100 - percent).toFixed(1)}% remaining</span>
          )}
          <span className="text-slate-400 flex items-center gap-1">
            <FileText className="h-3 w-3" />
            {summary.totalFileCount.toLocaleString()} files
          </span>
        </div>
      </div>

      {/* Breakdown */}
      {stats.length > 0 && (
        <div className="border-t border-slate-100 px-5 py-4 flex-1 space-y-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
            By Module
          </p>
          <div className="space-y-2">
            {stats.map((stat) => {
              const modulePercent = usedBytes > 0 ? (stat.totalBytes / usedBytes) * 100 : 0;
              const barColor =
                moduleBarColors[stat.module.toLowerCase()] ?? moduleBarColors.default;

              return (
                <div
                  key={stat.module}
                  className="flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="h-5 w-5 rounded bg-slate-100 flex items-center justify-center shrink-0">
                      <PieChart className="h-2.5 w-2.5 text-slate-400" />
                    </div>
                    <span className="text-[12px] font-medium text-slate-700 capitalize truncate">
                      {stat.module.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="w-14 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full", barColor)}
                        style={{ width: `${Math.min(modulePercent, 100)}%` }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium tabular-nums w-14 text-right">
                      {formatBytes(stat.totalBytes)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

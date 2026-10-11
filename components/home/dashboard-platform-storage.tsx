"use client";

import React from "react";
import { Database } from "lucide-react";
import { StorageStats } from "../subscription/storage-stats";
import PlanOverview from "../subscription/plan-overview";
import {
  useGetStorageStats,
  useGetStorageSummary,
} from "@/graphql/storage/storage-hooks";

interface DashboardPlatformStorageProps {
  DashboardSectionHeading: React.FC<{
    title: string;
    icon?: React.ReactNode;
  }>;
}

export function DashboardPlatformStorageSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[300px]">
      <section className="lg:col-span-4 space-y-3">
        <div className="h-5 w-32 rounded bg-muted animate-pulse" />
        <div className="h-[280px] border border-border/70 rounded-2xl bg-gradient-to-b from-background to-muted/25 animate-pulse" />
      </section>
      <section className="lg:col-span-8 space-y-3">
        <div className="h-5 w-40 rounded bg-muted animate-pulse" />
        <div className="h-[280px] border border-border/70 rounded-2xl bg-gradient-to-b from-background to-muted/25 animate-pulse" />
      </section>
    </div>
  );
}

export function DashboardPlatformStorage({
  DashboardSectionHeading,
}: DashboardPlatformStorageProps) {
  const { data: statsData, loading: statsLoading } = useGetStorageStats();
  const { data: summaryData, loading: summaryLoading } = useGetStorageSummary();

  const storageStats = statsData?.getStorageStats || [];
  const storageSummary = summaryData?.getStorageSummary;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Storage Stats */}
      <section className="lg:col-span-4 space-y-3">
        <DashboardSectionHeading
          title="Platform Storage"
          icon={<Database className="h-3.5 w-3.5 text-slate-500" />}
        />
        <div className="h-full">
          {statsLoading || summaryLoading ? (
            <div className="h-[280px] border border-border/70 rounded-2xl bg-gradient-to-b from-background to-muted/25 animate-pulse flex items-center justify-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                Crunching usage data...
              </span>
            </div>
          ) : (
            <StorageStats stats={storageStats} summary={storageSummary} />
          )}
        </div>
      </section>

      {/* Subscription Details */}
      <section className="lg:col-span-8 space-y-3">
        <DashboardSectionHeading title="Subscription Details" />
        <div className="h-full">
          <PlanOverview />
        </div>
      </section>
    </div>
  );
}

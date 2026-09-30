"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function CustomizationSkeleton() {
  return (
    <div className="w-full pb-20 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tabs bar skeleton */}
          <div className="p-1.5 bg-zinc-100/90 dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 rounded-xl grid grid-cols-3 gap-1.5">
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
            <Skeleton className="h-9 rounded-lg" />
          </div>

          {/* Card Skeleton (Polaris Form Card) */}
          <div className="rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-80 max-w-full" />
              </div>
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-800/80 pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="w-5 h-5 rounded-md" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="w-3.5 h-3.5 rounded-full" />
                  </div>
                  <Skeleton className="h-2.5 w-full" />
                </div>

                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="w-5 h-5 rounded-md" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="w-3.5 h-3.5 rounded-full" />
                  </div>
                  <Skeleton className="h-2.5 w-full" />
                </div>

                <div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Skeleton className="w-5 h-5 rounded-md" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                    <Skeleton className="w-3.5 h-3.5 rounded-full" />
                  </div>
                  <Skeleton className="h-2.5 w-full" />
                </div>
              </div>

              {/* Informative bar skeleton */}
              <div className="mt-2.5 px-2.5 py-1.5 rounded-md border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="w-3.5 h-3.5 rounded-full" />
                  <Skeleton className="h-2.5 w-32" />
                </div>
                <div className="flex items-center gap-1">
                  <Skeleton className="h-4 w-12 rounded-sm" />
                  <Skeleton className="h-4 w-14 rounded-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column (1/3 width) */}
        <div className="space-y-4">
          {/* Simulated Preview Card Skeleton */}
          <div className="rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-4 w-20 rounded-full" />
            </div>

            {/* Simulated Device Frame */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 p-3 space-y-3">
              <Skeleton className="h-7 w-full rounded-lg" />
              <div className="p-3 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-3">
                <div className="space-y-1">
                  <Skeleton className="h-2.5 w-20" />
                  <Skeleton className="h-3.5 w-36" />
                </div>
                <Skeleton className="h-8 w-full rounded-lg" />
                <div className="space-y-1">
                  <Skeleton className="h-2.5 w-16" />
                  <Skeleton className="h-7 w-full" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="h-7 w-full" />
                  <Skeleton className="h-7 w-full" />
                </div>
                <Skeleton className="h-7 w-full" />
                <Skeleton className="h-8 w-full rounded-lg" />
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between">
                <Skeleton className="h-2.5 w-28" />
                <Skeleton className="h-2.5 w-16" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-2.5 w-24" />
                <Skeleton className="h-2.5 w-14" />
              </div>
            </div>
          </div>

          {/* Tip Card Skeleton */}
          <div className="rounded-[10px] border border-blue-200/60 dark:border-blue-900/40 bg-blue-50/30 dark:bg-blue-950/20 p-4 space-y-2">
            <Skeleton className="h-3.5 w-36" />
            <Skeleton className="h-2.5 w-full" />
            <Skeleton className="h-2.5 w-5/6" />
            <Skeleton className="h-2.5 w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

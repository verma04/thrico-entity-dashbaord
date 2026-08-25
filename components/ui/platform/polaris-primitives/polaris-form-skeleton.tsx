"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

/* ─────────────────────────────────────────────────────────────
 * Shimmer skeleton block — thin animated pulse bar.
 * Uses the exact Polaris card/field sizing so it feels native.
 * ──────────────────────────────────────────────────────────── */
function Bone({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[6px] bg-[#e4e5e7] dark:bg-zinc-800",
        className
      )}
    />
  );
}

/* ─────────────────────────────────────────────────────────────
 * A single skeleton card that mimics a PolarisCard with fields
 * ──────────────────────────────────────────────────────────── */
interface SkeletonCardProps {
  /** Number of 2-column field rows to render inside the card */
  fieldRows?: number;
  /** Number of full-width field rows */
  fullWidthRows?: number;
  /** Whether to show the card title + description skeleton */
  showHeader?: boolean;
}

function SkeletonCard({
  fieldRows = 2,
  fullWidthRows = 0,
  showHeader = true,
}: SkeletonCardProps) {
  return (
    <div className="rounded-[12px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4">
      {showHeader && (
        <div className="mb-4">
          <Bone className="h-[16px] w-[140px] mb-2" />
          <Bone className="h-[13px] w-[260px]" />
        </div>
      )}
      <div className="space-y-4">
        {Array.from({ length: fieldRows }).map((_, i) => (
          <div key={`row-${i}`} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Bone className="h-[13.5px] w-[80px] mb-[6px]" />
              <Bone className="h-[40px] w-full rounded-[8px]" />
            </div>
            <div className="space-y-1.5">
              <Bone className="h-[13.5px] w-[90px] mb-[6px]" />
              <Bone className="h-[40px] w-full rounded-[8px]" />
            </div>
          </div>
        ))}
        {Array.from({ length: fullWidthRows }).map((_, i) => (
          <div key={`full-${i}`} className="space-y-1.5">
            <Bone className="h-[13.5px] w-[110px] mb-[6px]" />
            <Bone className="h-[40px] w-full rounded-[8px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * A sidebar skeleton card (avatar preview, summary rows, etc.)
 * ──────────────────────────────────────────────────────────── */
function SkeletonSidebarCard({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-[12px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4">
      <div className="mb-3">
        <Bone className="h-[14px] w-[120px]" />
      </div>
      <div className="flex flex-col items-center p-4 bg-[#f6f6f7] dark:bg-zinc-900/60 rounded-xl border border-[#e1e3e5] dark:border-zinc-800">
        <Bone className="h-20 w-20 rounded-2xl mb-3" />
        <Bone className="h-[14px] w-[120px] mb-1.5" />
        <Bone className="h-[12px] w-[160px]" />
      </div>
      <div className="space-y-2 mt-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between py-1">
            <Bone className="h-[12.5px] w-[60px]" />
            <Bone className="h-[12.5px] w-[90px]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function SkeletonInfoCard() {
  return (
    <div className="rounded-[12px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4">
      <div className="flex items-center gap-2 mb-2">
        <Bone className="h-4 w-4 rounded-full shrink-0" />
        <Bone className="h-[14px] w-[130px]" />
      </div>
      <Bone className="h-[12.5px] w-full mb-1.5" />
      <Bone className="h-[12.5px] w-3/4" />
    </div>
  );
}

function SkeletonTipCard() {
  return (
    <div className="rounded-[12px] border border-amber-200 dark:border-amber-900/40 bg-amber-50/50 dark:bg-amber-950/20 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-4">
      <div className="flex items-start gap-2">
        <Bone className="h-4 w-4 rounded-full shrink-0 mt-0.5 bg-amber-200 dark:bg-amber-800" />
        <div className="flex-1">
          <Bone className="h-[13px] w-[150px] mb-2 bg-amber-200 dark:bg-amber-800" />
          <Bone className="h-[12.5px] w-full mb-1.5 bg-amber-100 dark:bg-amber-900/40" />
          <Bone className="h-[12.5px] w-4/5 bg-amber-100 dark:bg-amber-900/40" />
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
 * PolarisFormSkeleton — Full-page skeleton for the Polaris form
 * layout (8-col main + 4-col sidebar, bg-[#f6f6f7]).
 * ──────────────────────────────────────────────────────────── */
export interface PolarisFormSkeletonProps {
  showHeader?: boolean;
  pageTitle?: string;
  showBackArrow?: boolean;
  /** Cards to show in the main column. Defaults to 3 cards. */
  mainCards?: SkeletonCardProps[];
  /** Number of summary rows in the sidebar preview card */
  sidebarSummaryRows?: number;
  /** Whether to show the sidebar info card */
  showSidebarInfo?: boolean;
  /** Whether to show the sidebar tip card */
  showSidebarTip?: boolean;
  /** Extra className on the root wrapper */
  className?: string;
}

export function PolarisFormSkeleton({
  showHeader = true,
  pageTitle = "Add member",
  showBackArrow = true,
  mainCards = [
    { fieldRows: 2, fullWidthRows: 2 },
    { fieldRows: 0, fullWidthRows: 3 },
    { fieldRows: 0, fullWidthRows: 1 },
  ],
  sidebarSummaryRows = 5,
  showSidebarInfo = true,
  showSidebarTip = true,
  className,
}: PolarisFormSkeletonProps) {
  return (
    <div
      className={cn(
        "min-h-screen bg-[#f6f6f7] dark:bg-zinc-950 text-[#303030] dark:text-zinc-100 px-4 sm:px-8 md:px-10 py-6 sm:py-8 pb-28 sm:pb-32 font-sans antialiased",
        className
      )}
    >
      <div className="max-w-[1280px] mx-auto space-y-4">
        {/* ── Page Header: Back arrow + Title ── */}
        {showHeader && (
          <header className="flex items-center gap-2.5 h-[48px] mb-4">
            {showBackArrow && (
              <div className="h-9 w-9 rounded-[8px] flex items-center justify-center text-[#616161] dark:text-zinc-400">
                <ArrowLeft className="h-5 w-5 stroke-[2.2]" />
              </div>
            )}
            <h1 className="text-[20px] font-semibold text-[#303030] dark:text-zinc-100 leading-[28px] tracking-tight">
              {pageTitle}
            </h1>
          </header>
        )}

        {/* ── 2-Column Grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* Main Column (8 cols) */}
          <div className="lg:col-span-8 space-y-4 min-w-0">
            {mainCards.map((card, i) => (
              <SkeletonCard key={i} {...card} />
            ))}
          </div>

          {/* Sidebar Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="sticky top-6 space-y-4">
              <SkeletonSidebarCard rows={sidebarSummaryRows} />
              {showSidebarInfo && <SkeletonInfoCard />}
              {showSidebarTip && <SkeletonTipCard />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Re-export sub-components for custom composition */
export { Bone, SkeletonCard, SkeletonSidebarCard, SkeletonInfoCard, SkeletonTipCard };

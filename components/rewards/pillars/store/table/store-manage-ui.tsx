"use client";

import React from "react";
import {
  ShoppingBag,
  Tag,
  Percent,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type StoreStatusValue =
  | "ALL"
  | "FIXED"
  | "PERCENTAGE"
  | "ACTIVE"
  | "INACTIVE";

export const STORE_STATUS_TABS = [
  {
    value: "ALL",
    label: "All Rules",
    icon: ShoppingBag,
    dot: "",
    color: "text-foreground",
  },
  {
    value: "FIXED",
    label: "Fixed ₹ Off",
    icon: Tag,
    dot: "bg-emerald-500",
    color: "text-emerald-600",
  },
  {
    value: "PERCENTAGE",
    label: "Percentage % Off",
    icon: Percent,
    dot: "bg-blue-500",
    color: "text-blue-600",
  },
  {
    value: "ACTIVE",
    label: "Active Rules",
    icon: CheckCircle2,
    dot: "bg-emerald-600",
    color: "text-emerald-600",
  },
  {
    value: "INACTIVE",
    label: "Drafts / Inactive",
    icon: Clock,
    dot: "bg-zinc-400",
    color: "text-zinc-500",
  },
];

interface SectionHeaderProps {
  count?: number;
  label?: string;
  isFiltered?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  count = 0,
  label = "Store Discount Rule",
  isFiltered = false,
}) => {
  return (
    <div className="flex items-center gap-2 px-1">
      <div className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
      <span className="text-xs font-bold text-foreground">
        {count} {label}
        {count !== 1 ? "s" : ""}
      </span>
      {isFiltered && (
        <span className="text-[10px] text-muted-foreground font-medium">
          (filtered)
        </span>
      )}
    </div>
  );
};

interface ContentAreaProps {
  children: React.ReactNode;
  loading?: boolean;
  viewMode?: "grid" | "list";
}

export const ContentArea: React.FC<ContentAreaProps> = ({
  children,
  loading = false,
  viewMode = "grid",
}) => {
  if (loading) {
    if (viewMode === "grid") {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl border border-border/60 bg-card space-y-3"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="pt-2 border-t border-border/40 flex justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="rounded-xl border border-border/70 bg-card p-4 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between gap-4 py-2">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="transition-all duration-200 ease-in-out">{children}</div>
  );
};

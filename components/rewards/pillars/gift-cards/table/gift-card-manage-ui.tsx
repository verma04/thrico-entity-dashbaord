"use client";

import React from "react";
import {
  Gift,
  ShoppingBag,
  Utensils,
  Sparkles,
  CheckCircle2,
  Receipt,
  Clock,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export type GiftCardStatusValue =
  | "ALL"
  | "ECOMMERCE"
  | "FOOD"
  | "LIFESTYLE"
  | "ACTIVE"
  | "LEDGER";

export const GIFT_CARD_STATUS_TABS = [
  {
    value: "ALL",
    label: "All Offers",
    icon: Gift,
    dot: "",
    color: "text-foreground",
  },
  {
    value: "ECOMMERCE",
    label: "E-Commerce",
    icon: ShoppingBag,
    dot: "bg-blue-500",
    color: "text-blue-600",
  },
  {
    value: "FOOD",
    label: "Food & Dining",
    icon: Utensils,
    dot: "bg-orange-500",
    color: "text-orange-600",
  },
  {
    value: "LIFESTYLE",
    label: "Fashion & Lifestyle",
    icon: Sparkles,
    dot: "bg-pink-500",
    color: "text-pink-600",
  },
  {
    value: "ACTIVE",
    label: "Active Offers",
    icon: CheckCircle2,
    dot: "bg-emerald-600",
    color: "text-emerald-600",
  },
  {
    value: "LEDGER",
    label: "Issuance Ledger",
    icon: Receipt,
    dot: "bg-violet-600",
    color: "text-violet-600",
  },
];

interface SectionHeaderProps {
  count?: number;
  label?: string;
  isFiltered?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  count = 0,
  label = "Gift Card Offer",
  isFiltered = false,
}) => {
  return (
    <div className="flex items-center gap-2 px-1">
      <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
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

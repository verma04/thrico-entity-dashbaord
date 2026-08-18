"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import moment from "moment";
import {
  Target,
  Sparkles,
  MapPin,
  Calendar,
  Eye,
  Heart,
  DollarSign,
} from "lucide-react";
import { AdminOpportunity } from "@/graphql/actions/opportunities";
import { OpportunityActions } from "./opportunity-actions";
import { cn } from "@/lib/utils";

interface OpportunityCardCompactProps {
  opportunity: AdminOpportunity;
  refetch?: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string; bar: string }
> = {
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    bar: "#10b981",
  },
  PENDING: {
    label: "Pending",
    bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    bar: "#f59e0b",
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    bar: "#f43f5e",
  },
};

const formatLocation = (loc: any): string => {
  if (!loc) return "";
  if (typeof loc === "string") return loc;
  if (typeof loc === "object") {
    const parts = [loc.city, loc.state, loc.country].filter(Boolean);
    if (parts.length > 0) return parts.join(", ");
    if (loc.address) return loc.address;
    if (loc.name) return loc.name;
    return Object.values(loc).filter((v) => typeof v === "string").join(", ");
  }
  return String(loc || "");
};

const formatBudget = (budget: any): string => {
  if (!budget) return "";
  if (typeof budget === "string") return budget;
  if (typeof budget === "number") return `$${budget}`;
  if (typeof budget === "object") {
    if (budget.min !== undefined && budget.max !== undefined) {
      return `${budget.currency || "$"}${budget.min} - ${budget.currency || "$"}${budget.max}`;
    }
    if (budget.amount !== undefined) {
      return `${budget.currency || "$"}${budget.amount}`;
    }
    return Object.values(budget).filter((v) => typeof v === "string" || typeof v === "number").join(" ");
  }
  return String(budget || "");
};

export function OpportunityCardCompact({
  opportunity,
  refetch,
}: OpportunityCardCompactProps) {
  const router = useRouter();

  const statusKey = opportunity.status?.toUpperCase() || "PENDING";
  const statusInfo = STATUS_CONFIG[statusKey] || {
    label: statusKey,
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    bar: "#6366f1",
  };

  const coverUrl = opportunity.coverImage
    ? opportunity.coverImage.startsWith("http")
      ? opportunity.coverImage
      : `https://cdn.thrico.network/${opportunity.coverImage}`
    : null;

  const categoryLabel =
    typeof opportunity.category === "string"
      ? opportunity.category.replace(/_/g, " ")
      : typeof opportunity.category === "object" && opportunity.category
        ? (opportunity.category as any).name || (opportunity.category as any).label || "Opportunity"
        : "Opportunity";

  const tags: string[] = Array.isArray(opportunity.tags)
    ? opportunity.tags
    : Array.isArray(opportunity.skills)
      ? opportunity.skills
      : [];

  const locationString = formatLocation(opportunity.location);
  const budgetString = formatBudget(opportunity.budgetRange);
  const descriptionString =
    typeof opportunity.description === "string"
      ? opportunity.description
      : typeof opportunity.description === "object" && opportunity.description
        ? (opportunity.description as any).text || ""
        : "";

  return (
    <div
      onClick={() => router.push(`/opportunities/${opportunity.id}/manage`)}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      {/* Classification-card style top color bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: statusInfo.bar }}
      />

      {/* ── Optional Cover Image ────────────────────────────────────────── */}
      {coverUrl ? (
        <div className="relative h-28 sm:h-32 w-full overflow-hidden bg-muted">
          <Image
            src={coverUrl}
            alt={opportunity.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-2 left-2 flex items-center gap-1 z-10">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-black/60 text-white backdrop-blur-md border border-white/20">
              {categoryLabel}
            </span>
          </div>

          {/* Action Menu button */}
          <div className="absolute top-2 right-2 z-10 bg-black/60 hover:bg-black/80 rounded-md backdrop-blur-md transition-colors text-white">
            <OpportunityActions opportunity={opportunity} refetch={refetch} />
          </div>

          {/* Status & Featured bar at bottom of image */}
          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] text-white/90 z-10">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-semibold bg-black/60 backdrop-blur-md border border-white/20">
              <span
                className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
              />
              {statusInfo.label}
            </span>

            {opportunity.isFeatured && (
              <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-300 bg-black/60 backdrop-blur-md border border-amber-300/40 px-1.5 py-0.5 rounded">
                <Sparkles className="h-2.5 w-2.5 fill-amber-300" />
                Featured
              </span>
            )}
          </div>
        </div>
      ) : (
        /* ── No Image Inlined Header ───────────────────────────────────── */
        <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-primary/10 text-primary border border-primary/20">
              {categoryLabel}
            </span>

            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
              <span
                className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
              />
              {statusInfo.label}
            </span>

            {opportunity.isFeatured && (
              <span className="flex items-center gap-0.5 text-[9px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                <Sparkles className="h-2.5 w-2.5 fill-amber-500" />
                Featured
              </span>
            )}
          </div>

          <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
            <OpportunityActions opportunity={opportunity} refetch={refetch} />
          </div>
        </div>
      )}

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Title */}
          <h3
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors"
            title={opportunity.title}
          >
            {opportunity.title}
          </h3>

          {/* Description */}
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {descriptionString || "No description provided."}
          </p>

          {/* Tags & Skills */}
          {tags && tags.length > 0 && (
            <div className="pt-0.5 flex flex-wrap gap-1">
              {tags.slice(0, 2).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted/60 text-foreground/80 border border-border/50 truncate max-w-[120px]"
                  title={tag}
                >
                  {tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="text-[10px] font-medium text-muted-foreground self-center">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Location / Budget info */}
          <div className="pt-0.5 space-y-0.5 text-[10px] text-muted-foreground">
            {locationString && (
              <div className="flex items-center gap-1.5 truncate">
                <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                <span className="truncate">{locationString}</span>
              </div>
            )}
            {budgetString && (
              <div className="flex items-center gap-1.5 truncate font-medium text-foreground/80">
                <DollarSign className="h-3 w-3 shrink-0 text-primary" />
                <span className="truncate">{budgetString}</span>
              </div>
            )}
          </div>
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Eye className="h-3 w-3 shrink-0" />
              <span>{opportunity.viewsCount || 0}</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Heart className="h-3 w-3 shrink-0" />
              <span>{opportunity.interestedCount || 0}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Calendar className="h-3 w-3 shrink-0" />
            <span>{moment(opportunity.createdAt).format("MMM D")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OpportunityCardCompact;

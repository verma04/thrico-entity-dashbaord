"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Ban,
} from "lucide-react";
import { Survey } from "@/graphql/surveys/survey-queries";
import { SurveyActions } from "./survey-actions";
import { cn } from "@/lib/utils";

interface SurveyCardCompactProps {
  survey: Survey;
  onEditDetails?: (survey: Survey) => void;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  onDraft?: (id: string) => void;
  onShare?: (survey: Survey) => void;
  shareSurveyAsFeed?: boolean;
  refetch?: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; dot: string; bar: string }
> = {
  PUBLISHED: {
    label: "Published",
    bg: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    bar: "#10b981",
  },
  DRAFT: {
    label: "Draft",
    bg: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    dot: "bg-amber-500",
    bar: "#f59e0b",
  },
  CLOSED: {
    label: "Closed",
    bg: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
    text: "text-rose-700 dark:text-rose-300",
    dot: "bg-rose-500",
    bar: "#f43f5e",
  },
};

export function SurveyCardCompact({
  survey,
  onEditDetails,
  onDelete,
  onPublish,
  onDraft,
  onShare,
  shareSurveyAsFeed,
  refetch,
}: SurveyCardCompactProps) {
  const router = useRouter();

  const statusInfo = STATUS_CONFIG[survey.status?.toUpperCase()] || {
    label: survey.status || "Unknown",
    bg: "bg-muted text-muted-foreground",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    bar: "#6366f1",
  };

  const isPublished = survey.status === "PUBLISHED";

  return (
    <div
      onClick={() => router.push(`/surveys/${survey.formId || survey.id}`)}
      className="relative overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xs hover:shadow-md hover:border-primary/40 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
    >
      {/* Classification-card style top color bar */}
      <div
        className="absolute top-0 left-0 h-1 w-full opacity-90 group-hover:opacity-100 transition-opacity z-10"
        style={{ backgroundColor: statusInfo.bar }}
      />

      {/* ── Card Header ─────────────────────────────────────────────────── */}
      <div className="p-3 pb-0 flex items-center justify-between gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-muted text-muted-foreground border border-border">
            <span
              className={cn("h-1.5 w-1.5 rounded-full shrink-0", statusInfo.dot)}
            />
            {statusInfo.label}
          </span>

          {survey.sharedAsFeed && (
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-tight bg-primary/10 text-primary border border-primary/20">
              Shared to Feed
            </span>
          )}
        </div>

        <div className="bg-background/80 hover:bg-background rounded-md transition-colors shrink-0">
          <SurveyActions
            survey={survey}
            onEditDetails={onEditDetails}
            onDelete={onDelete}
            onPublish={onPublish}
            onDraft={onDraft}
            onShare={onShare}
            shareSurveyAsFeed={shareSurveyAsFeed}
            refetch={refetch}
          />
        </div>
      </div>

      {/* ── Card Content Body ───────────────────────────────────────────── */}
      <div className="p-3 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Title */}
          <h3
            className="text-xs sm:text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors"
            title={survey.title}
          >
            {survey.title}
          </h3>

          {/* Description */}
          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
            {survey.description || "No description provided."}
          </p>

          {/* Duration info */}
          {(survey.startDate || survey.endDate) && (
            <div className="pt-0.5 space-y-0.5 text-[10px] text-muted-foreground">
              {survey.startDate && (
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                  <span className="truncate">
                    Start: {format(new Date(survey.startDate), "MMM d, yyyy")}
                  </span>
                </div>
              )}
              {survey.endDate && (
                <div className="flex items-center gap-1.5 truncate">
                  <Clock className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                  <span className="truncate">
                    End: {format(new Date(survey.endDate), "MMM d, yyyy")}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Card Footer ──────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span>
              Created {survey.createdAt ? format(new Date(survey.createdAt), "MMM d, yyyy") : "—"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {isPublished && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Active
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SurveyCardCompact;

"use client";

import React, { useState } from "react";
import { useCustomer360AiSummary } from "@/graphql/analytics/customer360AiSummary";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Bot,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from "lucide-react";

/* ── Compact AI Insight Tile ────────────────────────────────────────────── */

export interface CompactInsightTileProps {
  title: string;
  icon: React.ElementType;
  items: string[];
  color: "emerald" | "rose" | "indigo";
}

export function CompactInsightTile({
  title,
  icon: Icon,
  items,
  color,
}: CompactInsightTileProps) {
  const styles = {
    emerald: {
      card: "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-900/30",
      title: "text-emerald-800 dark:text-emerald-300",
      icon: "text-emerald-600 dark:text-emerald-400",
      bullet: "text-emerald-500",
      text: "text-emerald-950 dark:text-emerald-100",
    },
    rose: {
      card: "bg-rose-50/40 dark:bg-rose-950/20 border-rose-200/50 dark:border-rose-900/30",
      title: "text-rose-800 dark:text-rose-300",
      icon: "text-rose-600 dark:text-rose-400",
      bullet: "text-rose-500",
      text: "text-rose-950 dark:text-rose-100",
    },
    indigo: {
      card: "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-200/50 dark:border-indigo-900/30",
      title: "text-indigo-800 dark:text-indigo-300",
      icon: "text-indigo-600 dark:text-indigo-400",
      bullet: "text-indigo-500",
      text: "text-indigo-950 dark:text-indigo-100",
    },
  };
  const s = styles[color];

  return (
    <div className={cn("p-2.5 rounded-lg border space-y-1.5", s.card)}>
      <h4 className={cn("font-bold flex items-center gap-1.5 text-[11px] uppercase tracking-wider", s.title)}>
        <Icon className={cn("h-3 w-3", s.icon)} /> {title}
      </h4>
      <ul className="space-y-1">
        {items?.slice(0, 3).map((item, idx) => (
          <li key={idx} className={cn("flex items-start gap-1.5 text-[11px] leading-snug", s.text)}>
            <span className={cn("font-black text-[10px] mt-px shrink-0", s.bullet)}>•</span>
            <span className="line-clamp-2">{item}</span>
          </li>
        ))}
        {(!items || items.length === 0) && (
          <li className="text-[11px] text-muted-foreground italic">None identified</li>
        )}
      </ul>
    </div>
  );
}

/* ── Customer 360 AI Executive Summary Card ─────────────────────────────── */

export interface Customer360AiSummaryCardProps {
  userId: string;
  initialExpanded?: boolean;
  className?: string;
}

export function Customer360AiSummaryCard({
  userId,
  initialExpanded = true,
  className,
}: Customer360AiSummaryCardProps) {
  const { data: aiData, loading: aiLoading, error } = useCustomer360AiSummary(userId);
  const [aiExpanded, setAiExpanded] = useState(initialExpanded);

  const aiSummary = aiData?.getCustomer360AiSummary;

  // Don't render anything if userId is missing, or query finished with no summary/error
  if (!userId) return null;
  if (!aiLoading && (!aiSummary || error)) return null;

  return (
    <Card className={cn("border border-border/60 shadow-xs overflow-hidden", className)}>
      <div
        onClick={() => setAiExpanded(!aiExpanded)}
        className="p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/30 select-none transition-colors border-b border-border/40"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <div className="p-1.5 rounded-md bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/40">
            <Bot className="h-3.5 w-3.5" />
          </div>
          <h4 className="text-xs font-bold text-foreground">
            AI Executive Summary
          </h4>
          {aiSummary?.personaTitle && (
            <Badge variant="secondary" className="text-[10px] font-semibold h-4.5 px-2">
              {aiSummary.personaTitle}
            </Badge>
          )}
          {aiSummary?.suggestedOutreachChannel && (
            <Badge variant="outline" className="text-[10px] font-medium gap-1 h-4.5 px-1.5 text-muted-foreground hidden sm:inline-flex">
              <MessageSquare className="h-2.5 w-2.5 text-primary" />
              Channel: {aiSummary.suggestedOutreachChannel}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            {aiExpanded ? "Collapse" : "Expand Insights"}
          </span>
          <Button variant="ghost" size="icon" className="h-6 w-6 rounded-md">
            {aiExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </Button>
        </div>
      </div>

      {aiExpanded && (
        <CardContent className="p-3 sm:p-4 pt-3 space-y-3 animate-in fade-in-50 duration-200">
          {aiLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5 pt-1">
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
                <Skeleton className="h-20 rounded-lg" />
              </div>
            </div>
          ) : aiSummary ? (
            <>
              <p className="text-xs text-foreground/90 leading-relaxed bg-muted/20 p-2.5 rounded-md border border-border/30">
                {aiSummary.summary}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-2.5">
                <CompactInsightTile
                  title="Key Strengths"
                  icon={CheckCircle2}
                  items={aiSummary.keyStrengths || []}
                  color="emerald"
                />
                <CompactInsightTile
                  title="Risk Factors"
                  icon={AlertTriangle}
                  items={aiSummary.riskFactors || []}
                  color="rose"
                />
                <CompactInsightTile
                  title="Recommended Actions"
                  icon={Zap}
                  items={aiSummary.recommendedActions || []}
                  color="indigo"
                />
              </div>
            </>
          ) : null}
        </CardContent>
      )}
    </Card>
  );
}

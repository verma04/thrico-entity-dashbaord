"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  useCustomer360AiSummary,
  Customer360AiSummary,
  Customer360AiSummaryMessage,
  Customer360AiSummaryResult,
} from "@/graphql/analytics/customer360AiSummary";
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
  Coins,
  ArrowUpRight,
  RotateCcw,
} from "lucide-react";
import { useSubscriptionStore } from "@/store/subscriptionStore";
import { useDrawerStore } from "@/store/drawerStore";
import { AITopupModal } from "@/components/ai/ai-topup-modal";

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
  initialSummary?: Customer360AiSummaryResult | null;
  className?: string;
}

export function Customer360AiSummaryCard({
  userId,
  initialExpanded = true,
  initialSummary,
  className,
}: Customer360AiSummaryCardProps) {
  const {
    data: aiData,
    loading: aiLoading,
    error,
    refetch,
  } = useCustomer360AiSummary(userId);
  const [aiExpanded, setAiExpanded] = useState(initialExpanded);
  const [showTopupModal, setShowTopupModal] = useState(false);

  const { openDrawer } = useDrawerStore();
  const { setShowBuyPlanDialog } = useSubscriptionStore();

  const handleUpgradePlan = () => {
    if (typeof openDrawer === "function") {
      openDrawer();
    }
    setShowBuyPlanDialog(true);
  };

  const responseData = aiData?.getCustomer360AiSummary ?? initialSummary;

  const isSummaryMessage =
    responseData?.__typename === "Customer360AiSummaryMessage" ||
    (Boolean(responseData) && "message" in responseData! && !("summary" in responseData!));

  const aiSummary =
    !isSummaryMessage && responseData && "summary" in responseData
      ? (responseData as Customer360AiSummary)
      : null;

  const backendMessage =
    isSummaryMessage && responseData && "message" in responseData
      ? (responseData as Customer360AiSummaryMessage).message
      : null;

  const hasErrorOrMessage = Boolean(backendMessage || error);
  const isActuallyLoading = aiLoading && !initialSummary;

  // Don't render anything if userId is missing, or query finished with no summary and no error/message
  if (!userId) return null;
  if (!isActuallyLoading && !aiSummary && !hasErrorOrMessage) return null;

  const errorMessage =
    backendMessage ||
    error?.graphQLErrors?.[0]?.message ||
    error?.message ||
    (error ? "Failed to generate AI executive summary." : "");

  const isInsufficientTokens = Boolean(
    errorMessage &&
      (/token/i.test(errorMessage) ||
        /top-up/i.test(errorMessage) ||
        /insufficient/i.test(errorMessage) ||
        /balance/i.test(errorMessage) ||
        /quota/i.test(errorMessage) ||
        /tier/i.test(errorMessage) ||
        /upgrade/i.test(errorMessage))
  );

  return (
    <Card className={cn("border border-border/60 shadow-xs overflow-hidden", className)}>
      <div
        onClick={() => setAiExpanded(!aiExpanded)}
        className="p-3 sm:p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-muted/30 select-none transition-colors border-b border-border/40"
      >
        <div className="flex items-center gap-2 flex-wrap">
          <div
            className={cn(
              "p-1.5 rounded-md border transition-colors",
              hasErrorOrMessage
                ? isInsufficientTokens
                  ? "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/40"
                  : "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/40"
                : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/40"
            )}
          >
            {hasErrorOrMessage ? (
              <AlertTriangle className="h-3.5 w-3.5" />
            ) : (
              <Bot className="h-3.5 w-3.5" />
            )}
          </div>
          <h4 className="text-xs font-bold text-foreground">
            AI Executive Summary
          </h4>
          {hasErrorOrMessage ? (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-semibold h-4.5 px-2 gap-1 border",
                isInsufficientTokens
                  ? "border-amber-300/70 dark:border-amber-800/80 bg-amber-50/80 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300"
                  : "border-rose-300/70 dark:border-rose-800/80 bg-rose-50/80 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300"
              )}
            >
              {isInsufficientTokens ? (
                <>
                  <Coins className="h-2.5 w-2.5 text-amber-600 dark:text-amber-400" />
                  Tokens Required
                </>
              ) : (
                <>
                  <AlertTriangle className="h-2.5 w-2.5" />
                  Unavailable
                </>
              )}
            </Badge>
          ) : (
            <>
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
            </>
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
          ) : hasErrorOrMessage ? (
            <div
              className={cn(
                "rounded-xl border p-3.5 sm:p-4 space-y-3.5 transition-all",
                isInsufficientTokens
                  ? "border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/70 via-orange-50/25 to-background dark:from-amber-950/25 dark:via-background dark:to-background"
                  : "border-rose-200/80 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20"
              )}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "p-2 sm:p-2.5 rounded-xl border shrink-0 mt-0.5 sm:mt-0",
                      isInsufficientTokens
                        ? "bg-amber-100/80 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800/60"
                        : "bg-rose-100/80 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
                    )}
                  >
                    {isInsufficientTokens ? (
                      <Coins className="h-5 w-5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5" />
                    )}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h5 className="text-xs sm:text-sm font-bold text-foreground">
                        {isInsufficientTokens
                          ? "AI Token Balance Exhausted"
                          : "AI Summary Generation Error"}
                      </h5>
                      {isInsufficientTokens && (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-semibold bg-background/80 text-amber-700 dark:text-amber-300 border-amber-300/80 dark:border-amber-800"
                        >
                          Top-Up Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">
                      {errorMessage}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 flex-wrap sm:flex-nowrap">
                  {isInsufficientTokens && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowTopupModal(true);
                      }}
                      className="h-8.5 px-3 rounded-lg text-xs font-semibold gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-xs"
                    >
                      <Coins className="h-3.5 w-3.5" />
                      Top Up Tokens
                    </Button>
                  )}

                  <Button
                    variant={isInsufficientTokens ? "outline" : "default"}
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpgradePlan();
                    }}
                    className={cn(
                      "h-8.5 px-3 rounded-lg text-xs font-semibold gap-1.5",
                      isInsufficientTokens
                        ? "border-amber-300 dark:border-amber-800 hover:bg-amber-100/60 dark:hover:bg-amber-950/40 text-foreground"
                        : "bg-primary text-primary-foreground"
                    )}
                  >
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    Upgrade Plan
                  </Button>
                </div>
              </div>

              <div
                className={cn(
                  "flex items-center justify-between pt-2.5 border-t text-[11px] text-muted-foreground flex-wrap gap-2",
                  isInsufficientTokens
                    ? "border-amber-200/60 dark:border-amber-900/40"
                    : "border-border/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <Link
                    href="/ai/usage"
                    className="inline-flex items-center gap-1 font-semibold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    View AI Usage & Ledger
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                  <span className="text-border">•</span>
                  <Link
                    href="/settings/billing"
                    className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground hover:underline"
                  >
                    Billing History
                  </Link>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    refetch?.();
                  }}
                  className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground gap-1"
                >
                  <RotateCcw className="h-3 w-3" />
                  Retry
                </Button>
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

      {showTopupModal && (
        <AITopupModal
          onClose={() => {
            setShowTopupModal(false);
            refetch?.();
          }}
        />
      )}
    </Card>
  );
}

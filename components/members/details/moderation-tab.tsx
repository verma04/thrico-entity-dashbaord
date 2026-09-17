"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  Clock,
  ExternalLink,
  Bot,
  Coins,
  Cpu,
  Layers,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  MessageSquare,
  FileText,
  HelpCircle,
  Tag,
  ThumbsUp,
  AlertOctagon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetUserModerationTimeline,
  useGetUserModerationSummary,
  UserModerationEvent,
} from "@/graphql/actions";
import { ModerationContentType } from "@/graphql/moderation/types";
import { safeFormat, safeFormatDistanceToNow } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

interface ModerationTabProps {
  userId: string;
  member?: any;
}

const DECISION_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    accentBorder: string;
    label: string;
  }
> = {
  BLOCK: {
    icon: Ban,
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-700 dark:text-rose-400",
    badgeBorder: "border-rose-500/30",
    accentBorder: "border-l-rose-500",
    label: "Blocked",
  },
  FLAG: {
    icon: AlertTriangle,
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-700 dark:text-amber-400",
    badgeBorder: "border-amber-500/30",
    accentBorder: "border-l-amber-500",
    label: "Flagged",
  },
  WARNING: {
    icon: AlertOctagon,
    badgeBg: "bg-orange-500/10",
    badgeText: "text-orange-700 dark:text-orange-400",
    badgeBorder: "border-orange-500/30",
    accentBorder: "border-l-orange-500",
    label: "Warning",
  },
  ALLOW: {
    icon: CheckCircle2,
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-700 dark:text-emerald-400",
    badgeBorder: "border-emerald-500/30",
    accentBorder: "border-l-emerald-500",
    label: "Allowed",
  },
  AUTO_APPROVE: {
    icon: ThumbsUp,
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-700 dark:text-emerald-400",
    badgeBorder: "border-emerald-500/30",
    accentBorder: "border-l-emerald-500",
    label: "Auto Approved",
  },
  SHADOW_HIDE: {
    icon: Ban,
    badgeBg: "bg-purple-500/10",
    badgeText: "text-purple-700 dark:text-purple-400",
    badgeBorder: "border-purple-500/30",
    accentBorder: "border-l-purple-500",
    label: "Shadow Hidden",
  },
};

function ContentDetailView({
  content,
  contentType,
  contentId,
}: {
  content?: string | null;
  contentType?: string;
  contentId?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!content) {
    if (!contentId) return null;
    return (
      <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 px-3 py-2 text-xs flex items-center justify-between text-muted-foreground">
        <span className="flex items-center gap-1.5 text-[11px]">
          <FileText className="h-3.5 w-3.5 text-muted-foreground/70" />
          <span className="font-medium text-foreground/80">{contentType || "Content"} ID:</span>
          <code className="font-mono text-[10px] text-muted-foreground">{contentId}</code>
        </span>
      </div>
    );
  }

  const isLong = content.length > 220;
  const displayText = isLong && !isExpanded ? content.slice(0, 220) + "..." : content;

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-border/70 bg-muted/25 dark:bg-card/60 p-3 text-xs space-y-1.5 shadow-2xs">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5 text-primary" />
          <span>Content Details</span>
          {contentType && (
            <span className="font-semibold text-foreground/70 lowercase first-letter:uppercase">({contentType})</span>
          )}
        </span>
        <div className="flex items-center gap-1.5">
          {contentId && (
            <span className="font-mono text-[10px] text-muted-foreground hidden sm:inline">
              #{contentId.slice(0, 8)}
            </span>
          )}
          <button
            type="button"
            onClick={handleCopy}
            title="Copy content text"
            className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-muted transition-colors"
          >
            {copied ? (
              <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
      <p className="text-foreground text-xs leading-relaxed font-normal whitespace-pre-wrap break-words bg-background/80 dark:bg-background/40 p-2.5 rounded-md border border-border/40">
        {displayText}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1 pt-0.5"
        >
          {isExpanded ? (
            <>
              Show less <ChevronUp className="h-3 w-3" />
            </>
          ) : (
            <>
              Show full content ({content.length} characters) <ChevronDown className="h-3 w-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
}

export function ModerationTab({ userId, member }: ModerationTabProps) {
  const [selectedDecision, setSelectedDecision] = useState<string>("ALL");
  const [selectedContentType, setSelectedContentType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 15;

  // 1. Summary stats query
  const {
    data: summaryData,
    loading: isSummaryLoading,
    refetch: refetchSummary,
  } = useGetUserModerationSummary(
    { userId },
    { skip: !userId, fetchPolicy: "cache-and-network" }
  );

  // 2. Timeline query
  const timelineVariables = {
    userId,
    limit: pageSize,
    offset: page * pageSize,
    decision: selectedDecision !== "ALL" ? selectedDecision : undefined,
    contentType:
      selectedContentType !== "ALL"
        ? (selectedContentType as ModerationContentType)
        : undefined,
  };

  const {
    data: timelineData,
    loading: isTimelineLoading,
    error: timelineError,
    refetch: refetchTimeline,
  } = useGetUserModerationTimeline(timelineVariables, {
    skip: !userId,
    fetchPolicy: "network-only",
  });

  const summary = summaryData?.getUserModerationSummary;
  const events = timelineData?.getUserModerationTimeline?.items || [];
  const totalCount = timelineData?.getUserModerationTimeline?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / pageSize);

  // Client-side search filtering if user typed in query
  const filteredEvents = events.filter((ev: UserModerationEvent) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      ev.reason?.toLowerCase().includes(q) ||
      ev.label?.toLowerCase().includes(q) ||
      ev.contentId?.toLowerCase().includes(q) ||
      ev.contentType?.toLowerCase().includes(q) ||
      ev.categories?.some((c) => c.toLowerCase().includes(q))
    );
  });

  const handleRefresh = () => {
    refetchSummary();
    refetchTimeline();
  };

  const getDecisionStyle = (decision: string) => {
    const key = (decision || "").toUpperCase();
    return (
      DECISION_CONFIG[key] || {
        icon: HelpCircle,
        badgeBg: "bg-muted",
        badgeText: "text-muted-foreground",
        badgeBorder: "border-border",
        accentBorder: "border-l-border",
        label: decision || "Unknown",
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* ── Metric Summary Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {/* Total Checked */}
        <Card className="border-border/60 bg-card/60 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Analyzed</span>
              <Sparkles className="h-4 w-4 text-sky-500" />
            </div>
            {isSummaryLoading && !summary ? (
              <Skeleton className="h-7 w-16 mt-1" />
            ) : (
              <div className="text-2xl font-black tracking-tight text-foreground">
                {summary?.totalChecked ?? 0}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">Content checks performed</p>
          </CardContent>
        </Card>

        {/* Violations */}
        <Card className="border-border/60 bg-card/60 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Violations</span>
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </div>
            {isSummaryLoading && !summary ? (
              <Skeleton className="h-7 w-16 mt-1" />
            ) : (
              <div className="text-2xl font-black tracking-tight text-rose-600 dark:text-rose-400">
                {summary?.violationsCount ?? 0}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">Policy breaches</p>
          </CardContent>
        </Card>

        {/* Spam Caught */}
        <Card className="border-border/60 bg-card/60 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Spam</span>
              <ShieldAlert className="h-4 w-4 text-amber-500" />
            </div>
            {isSummaryLoading && !summary ? (
              <Skeleton className="h-7 w-16 mt-1" />
            ) : (
              <div className="text-2xl font-black tracking-tight text-amber-600 dark:text-amber-400">
                {summary?.spamCount ?? 0}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">Spam detections</p>
          </CardContent>
        </Card>

        {/* Blocked */}
        <Card className="border-border/60 bg-card/60 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Blocked</span>
              <Ban className="h-4 w-4 text-red-500" />
            </div>
            {isSummaryLoading && !summary ? (
              <Skeleton className="h-7 w-16 mt-1" />
            ) : (
              <div className="text-2xl font-black tracking-tight text-red-600 dark:text-red-400">
                {summary?.blockedCount ?? 0}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">Content items removed</p>
          </CardContent>
        </Card>

        {/* Approved / Clean */}
        <Card className="border-border/60 bg-card/60 shadow-xs col-span-2 md:col-span-1">
          <CardContent className="p-4 space-y-1">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Clean</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            {isSummaryLoading && !summary ? (
              <Skeleton className="h-7 w-16 mt-1" />
            ) : (
              <div className="text-2xl font-black tracking-tight text-emerald-600 dark:text-emerald-400">
                {summary?.approvedCount ?? 0}
              </div>
            )}
            <p className="text-[10px] text-muted-foreground">Safe content</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Filters & Search Header ─────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border/70 shadow-xs">
        <div className="flex items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by reason, category, content ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-9 text-xs rounded-lg"
            />
          </div>

          {/* Decision Filter */}
          <Select
            value={selectedDecision}
            onValueChange={(val) => {
              setSelectedDecision(val);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-[140px] h-9 text-xs rounded-lg">
              <SelectValue placeholder="Decision" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Decisions</SelectItem>
              <SelectItem value="BLOCK">Blocked</SelectItem>
              <SelectItem value="FLAG">Flagged</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="ALLOW">Allowed</SelectItem>
              <SelectItem value="SHADOW_HIDE">Shadow Hide</SelectItem>
            </SelectContent>
          </Select>

          {/* Content Type Filter */}
          <Select
            value={selectedContentType}
            onValueChange={(val) => {
              setSelectedContentType(val);
              setPage(0);
            }}
          >
            <SelectTrigger className="w-[150px] h-9 text-xs rounded-lg">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="POST">Posts</SelectItem>
              <SelectItem value="COMMENT">Comments</SelectItem>
              <SelectItem value="DISCUSSION_FORUM">Forums</SelectItem>
              <SelectItem value="MARKETPLACE">Marketplace</SelectItem>
              <SelectItem value="JOB">Jobs</SelectItem>
              <SelectItem value="OFFER">Offers</SelectItem>
              <SelectItem value="MESSAGE">Messages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Refresh & Count */}
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <span className="text-xs text-muted-foreground font-medium">
            Total: <strong className="text-foreground">{totalCount}</strong>
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isTimelineLoading || isSummaryLoading}
            className="h-9 px-3 rounded-lg text-xs gap-1.5"
          >
            <RefreshCw
              className={cn(
                "h-3.5 w-3.5",
                (isTimelineLoading || isSummaryLoading) && "animate-spin text-primary"
              )}
            />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>

      {/* ── Timeline Events Feed ────────────────────────────────────────── */}
      <div className="space-y-4">
        {isTimelineLoading && events.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-border/60 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : timelineError ? (
          <Card className="border-rose-500/20 bg-rose-500/5 p-8 text-center space-y-3">
            <ShieldAlert className="h-10 w-10 text-rose-500 mx-auto" />
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-rose-700 dark:text-rose-400">
                Failed to Load Moderation Timeline
              </h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {timelineError.message ||
                  "Unable to query moderation audit records from the safety engine."}
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2 text-xs">
              Try Again
            </Button>
          </Card>
        ) : filteredEvents.length === 0 ? (
          <Card className="border-dashed border-border/80 bg-card/40 p-12 text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-muted/60 border border-border flex items-center justify-center mx-auto text-muted-foreground">
              <ShieldCheck className="h-7 w-7 text-emerald-500" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-foreground tracking-tight">
                No Moderation Violations Found
              </h4>
              <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
                This member has no recorded policy violations or moderation interventions matching
                the selected filters.
              </p>
            </div>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map((event: UserModerationEvent, idx: number) => {
              const decisionStyle = getDecisionStyle(event.decision);
              const DecisionIcon = decisionStyle.icon;
              const confidencePercent = Math.round((event.confidence || 0) * 100);

              return (
                <Card
                  key={event.eventId || idx}
                  className={cn(
                    "border-border/70 border-l-4 shadow-xs transition-all hover:border-border hover:shadow-sm",
                    decisionStyle.accentBorder
                  )}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Header Row: Decision Badge + Content Type + Timestamp */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Decision */}
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wide border",
                            decisionStyle.badgeBg,
                            decisionStyle.badgeText,
                            decisionStyle.badgeBorder
                          )}
                        >
                          <DecisionIcon className="h-3.5 w-3.5" />
                          {decisionStyle.label}
                        </span>

                        {/* Content Type */}
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-muted/40"
                        >
                          {event.contentType}
                        </Badge>

                        {/* Spam / Violation tag */}
                        {event.isViolation && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20">
                            Violation
                          </span>
                        )}
                        {event.isSpam && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            Spam
                          </span>
                        )}
                      </div>

                      {/* Date & Relative Time */}
                      <div className="text-right">
                        <span className="text-xs font-semibold text-foreground">
                          {safeFormatDistanceToNow(event.createdAt, { addSuffix: true })}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          {safeFormat(event.createdAt, "MMM d, yyyy • h:mm a")}
                        </span>
                      </div>
                    </div>

                    {/* Content Details / Text */}
                    <ContentDetailView
                      content={event.contentPreview || event.originalContent}
                      contentType={event.contentType}
                      contentId={event.contentId}
                    />

                    {/* Reason Callout Box */}
                    {event.reason && (
                      <div className="relative pl-3.5 pr-3 py-2 rounded-lg bg-muted/40 border border-border/40 text-xs text-foreground/90 space-y-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                          Analysis & Reason
                        </span>
                        <p className="text-xs font-medium leading-relaxed">{event.reason}</p>
                      </div>
                    )}

                    {/* Categories chips */}
                    {event.categories && event.categories.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                          Categories:
                        </span>
                        {event.categories.map((cat, cIdx) => (
                          <span
                            key={cIdx}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-muted border border-border/60 text-muted-foreground"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Row: AI Model + Confidence Score + Tokens + Content ID */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border/40 text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Model */}
                        {event.model && (
                          <span className="flex items-center gap-1 font-mono text-[10px] bg-muted/40 px-2 py-0.5 rounded-md border border-border/50">
                            <Bot className="h-3 w-3 text-primary" />
                            <span>{event.model}</span>
                          </span>
                        )}

                        {/* Tokens */}
                        {event.tokens > 0 && (
                          <span className="flex items-center gap-1 text-[10px]">
                            <Coins className="h-3 w-3 text-amber-500/70" />
                            <span>{event.tokens} tokens</span>
                          </span>
                        )}

                        {/* Confidence */}
                        {confidencePercent > 0 && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-medium">Confidence:</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full",
                                  confidencePercent > 80
                                    ? "bg-rose-500"
                                    : confidencePercent > 50
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                                )}
                                style={{ width: `${confidencePercent}%` }}
                              />
                            </div>
                            <span className="text-[10px] font-mono font-bold text-foreground">
                              {confidencePercent}%
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Content ID Reference */}
                      {event.contentId && (
                        <span className="font-mono text-[10px] text-muted-foreground">
                          ID: <strong className="text-foreground">{event.contentId}</strong>
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* ── Pagination Controls ───────────────────────────────────────── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-border/60">
            <span className="text-xs text-muted-foreground">
              Page <strong className="text-foreground">{page + 1}</strong> of{" "}
              <strong className="text-foreground">{totalPages}</strong>
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0 || isTimelineLoading}
                className="h-8 px-2.5 text-xs gap-1"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                <span>Previous</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1 || isTimelineLoading}
                className="h-8 px-2.5 text-xs gap-1"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetUserStatusTimeline,
  UserStatusEvent,
} from "@/graphql/actions";
import { safeFormat, safeFormatDistanceToNow } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import {
  Clock,
  History,
  ShieldAlert,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Unlock,
  RotateCcw,
  ShieldCheck,
  ShieldX,
  Flag,
  User,
  RefreshCw,
  ArrowRight,
  MessageSquareQuote,
  Code2,
  ChevronDown,
  ChevronUp,
  Bot,
  SlidersHorizontal,
} from "lucide-react";

interface UserStatusTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  currentStatus?: string;
}

const ACTION_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    nodeBg: string;
    nodeColor: string;
  }
> = {
  APPROVE: {
    icon: CheckCircle2,
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-700 dark:text-emerald-400",
    badgeBorder: "border-emerald-500/20",
    nodeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    nodeColor: "text-emerald-600 dark:text-emerald-400 ring-emerald-500/30",
  },
  BLOCK: {
    icon: ShieldAlert,
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-700 dark:text-rose-400",
    badgeBorder: "border-rose-500/20",
    nodeBg: "bg-rose-50 dark:bg-rose-950/40",
    nodeColor: "text-rose-600 dark:text-rose-400 ring-rose-500/30",
  },
  REJECT: {
    icon: XCircle,
    badgeBg: "bg-red-500/10",
    badgeText: "text-red-700 dark:text-red-400",
    badgeBorder: "border-red-500/20",
    nodeBg: "bg-red-50 dark:bg-red-950/40",
    nodeColor: "text-red-600 dark:text-red-400 ring-red-500/30",
  },
  DISABLE: {
    icon: PauseCircle,
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-700 dark:text-amber-400",
    badgeBorder: "border-amber-500/20",
    nodeBg: "bg-amber-50 dark:bg-amber-950/40",
    nodeColor: "text-amber-600 dark:text-amber-400 ring-amber-500/30",
  },
  ENABLE: {
    icon: Unlock,
    badgeBg: "bg-teal-500/10",
    badgeText: "text-teal-700 dark:text-teal-400",
    badgeBorder: "border-teal-500/20",
    nodeBg: "bg-teal-50 dark:bg-teal-950/40",
    nodeColor: "text-teal-600 dark:text-teal-400 ring-teal-500/30",
  },
  UNBLOCK: {
    icon: Unlock,
    badgeBg: "bg-teal-500/10",
    badgeText: "text-teal-700 dark:text-teal-400",
    badgeBorder: "border-teal-500/20",
    nodeBg: "bg-teal-50 dark:bg-teal-950/40",
    nodeColor: "text-teal-600 dark:text-teal-400 ring-teal-500/30",
  },
  FLAG: {
    icon: Flag,
    badgeBg: "bg-yellow-500/10",
    badgeText: "text-yellow-700 dark:text-yellow-400",
    badgeBorder: "border-yellow-500/20",
    nodeBg: "bg-yellow-50 dark:bg-yellow-950/40",
    nodeColor: "text-yellow-600 dark:text-yellow-400 ring-yellow-500/30",
  },
  VERIFY: {
    icon: ShieldCheck,
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-700 dark:text-blue-400",
    badgeBorder: "border-blue-500/20",
    nodeBg: "bg-blue-50 dark:bg-blue-950/40",
    nodeColor: "text-blue-600 dark:text-blue-400 ring-blue-500/30",
  },
  UNVERIFY: {
    icon: ShieldX,
    badgeBg: "bg-slate-500/10",
    badgeText: "text-slate-700 dark:text-slate-400",
    badgeBorder: "border-slate-500/20",
    nodeBg: "bg-slate-50 dark:bg-slate-950/40",
    nodeColor: "text-slate-600 dark:text-slate-400 ring-slate-500/30",
  },
  REAPPROVE: {
    icon: RotateCcw,
    badgeBg: "bg-sky-500/10",
    badgeText: "text-sky-700 dark:text-sky-400",
    badgeBorder: "border-sky-500/20",
    nodeBg: "bg-sky-50 dark:bg-sky-950/40",
    nodeColor: "text-sky-600 dark:text-sky-400 ring-sky-500/30",
  },
};

const STATUS_PILL_STYLES: Record<string, string> = {
  APPROVED: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  ACTIVE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  PENDING: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  BLOCKED: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  DISABLED: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20",
  REJECTED: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  SUSPENDED: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
};

export function UserStatusTimelineModal({
  isOpen,
  onClose,
  userId,
  userName = "Member",
  userEmail,
  userAvatar,
  currentStatus,
}: UserStatusTimelineModalProps) {
  const [expandedMetadata, setExpandedMetadata] = useState<Record<string, boolean>>({});

  const { data, loading, error, refetch } = useGetUserStatusTimeline(
    { userId: userId || "", limit: 50 },
    {
      skip: !userId || !isOpen,
      fetchPolicy: "network-only",
    }
  );

  const timelineData = data?.getUserStatusTimeline;
  const events = timelineData?.items || [];
  const totalCount = timelineData?.totalCount ?? events.length;

  const toggleMetadata = (eventId: string) => {
    setExpandedMetadata((prev) => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const getActionConfig = (action: string) => {
    const key = (action || "").toUpperCase();
    return (
      ACTION_CONFIG[key] || {
        icon: Clock,
        badgeBg: "bg-muted",
        badgeText: "text-muted-foreground",
        badgeBorder: "border-border",
        nodeBg: "bg-muted/50",
        nodeColor: "text-muted-foreground ring-border",
      }
    );
  };

  const getStatusPill = (status?: string | null) => {
    if (!status) return null;
    const upper = status.toUpperCase();
    const style = STATUS_PILL_STYLES[upper] || "bg-muted text-muted-foreground border-border";
    return (
      <span
        className={cn(
          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase border",
          style
        )}
      >
        {upper}
      </span>
    );
  };

  const avatarSrc = userAvatar
    ? userAvatar.startsWith("http")
      ? userAvatar
      : `https://cdn.thrico.network/${userAvatar}`
    : undefined;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col p-0 overflow-hidden gap-0 border-border shadow-2xl">
        {/* Modal Header */}
        <DialogHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <Avatar className="h-12 w-12 border-2 border-background shadow-md">
                <AvatarImage src={avatarSrc} alt={userName} />
                <AvatarFallback className="text-sm font-bold bg-muted text-muted-foreground">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <DialogTitle className="text-lg font-bold tracking-tight text-foreground">
                    {userName}
                  </DialogTitle>
                  {currentStatus && getStatusPill(currentStatus)}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {userEmail && <span className="font-medium">{userEmail}</span>}
                  {userEmail && <span className="text-border">•</span>}
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <History className="h-3 w-3 text-muted-foreground" />
                    Status Audit Trail
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
              className="h-8 px-2.5 rounded-lg border-border/80 hover:bg-muted text-xs gap-1.5 shrink-0"
              title="Refresh timeline"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin text-primary")} />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
          </div>

          <DialogDescription className="sr-only">
            View the compliance status change audit trail and administrative action history for this user.
          </DialogDescription>
        </DialogHeader>

        {/* Stats bar */}
        <div className="px-6 py-2.5 bg-muted/40 border-b border-border/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-muted-foreground font-medium">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>
              Recorded Events:{" "}
              <strong className="text-foreground font-bold">{totalCount}</strong>
            </span>
          </div>
          {events.length > 0 && (
            <span className="text-[11px] text-muted-foreground">
              Last event:{" "}
              <span className="font-semibold text-foreground">
                {safeFormatDistanceToNow(events[0]?.createdAt, { addSuffix: true })}
              </span>
            </span>
          )}
        </div>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && !timelineData ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-16 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center space-y-3 bg-rose-500/5 rounded-xl border border-rose-500/20 my-4">
              <ShieldAlert className="h-8 w-8 text-rose-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
                  Failed to load status timeline
                </p>
                <p className="text-xs text-muted-foreground">
                  {error.message || "An unexpected error occurred while querying audit records."}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2 text-xs h-7"
              >
                Retry
              </Button>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-muted/60 border border-border/80 flex items-center justify-center mx-auto text-muted-foreground">
                <ShieldCheck className="h-6 w-6 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-foreground tracking-tight">
                  No Status History Recorded
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  This user has no recorded status change events in the compliance audit log. Any future
                  approvals, blocks, or suspensions will appear here.
                </p>
              </div>
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-[2px] before:bg-border/60">
              {events.map((event, idx) => {
                const config = getActionConfig(event.action);
                const ActionIcon = config.icon;
                const isExpanded = !!expandedMetadata[event.eventId];
                const hasMetadata = !!event.metadata && event.metadata !== "{}" && event.metadata !== '""';

                return (
                  <div key={event.eventId || idx} className="relative group">
                    {/* Node Dot / Icon */}
                    <div
                      className={cn(
                        "absolute -left-[25px] top-1 h-8 w-8 rounded-full border-2 border-background flex items-center justify-center ring-4 transition-all shadow-sm",
                        config.nodeBg,
                        config.nodeColor
                      )}
                    >
                      <ActionIcon className="h-4 w-4" />
                    </div>

                    {/* Event Card */}
                    <div className="bg-card border border-border/70 rounded-xl p-4 shadow-sm hover:border-border transition-all space-y-3 ml-2">
                      {/* Top Row: Action + Status Transition + Time */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider border",
                              config.badgeBg,
                              config.badgeText,
                              config.badgeBorder
                            )}
                          >
                            {event.action}
                          </span>

                          {/* Transition: Prev -> New */}
                          <div className="flex items-center gap-1.5 text-xs">
                            {event.previousStatus ? (
                              <>
                                <span className="line-through text-muted-foreground text-[11px] font-medium">
                                  {event.previousStatus}
                                </span>
                                <ArrowRight className="h-3 w-3 text-muted-foreground" />
                              </>
                            ) : null}
                            {getStatusPill(event.newStatus)}
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="text-right">
                          <div className="text-xs font-semibold text-foreground">
                            {safeFormatDistanceToNow(event.createdAt, { addSuffix: true })}
                          </div>
                          <div className="text-[10px] text-muted-foreground">
                            {safeFormat(event.createdAt, "MMM d, yyyy • h:mm a")}
                          </div>
                        </div>
                      </div>

                      {/* Reason Callout */}
                      {event.reason && (
                        <div className="relative pl-3.5 pr-3 py-2 rounded-lg bg-muted/40 border-l-2 border-primary/60 text-xs text-foreground/90 flex items-start gap-2">
                          <MessageSquareQuote className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                          <div className="space-y-0.5 flex-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
                              Reason
                            </span>
                            <p className="leading-snug text-xs font-medium text-foreground">
                              {event.reason}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Footer Row: Performed By + Source */}
                      <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px] text-muted-foreground">
                        <div className="flex items-center gap-3">
                          {event.performedBy ? (
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3 text-muted-foreground" />
                              <span>
                                By: <strong className="text-foreground font-mono text-[10px]">{event.performedBy}</strong>
                              </span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <Bot className="h-3 w-3 text-muted-foreground" />
                              <span>System Action</span>
                            </span>
                          )}

                          {event.source && (
                            <Badge
                              variant="outline"
                              className="text-[9px] uppercase tracking-wider py-0 px-1.5 font-mono bg-muted/30"
                            >
                              {event.source}
                            </Badge>
                          )}
                        </div>

                        {/* Metadata Toggle */}
                        {hasMetadata && (
                          <button
                            onClick={() => toggleMetadata(event.eventId)}
                            className="inline-flex items-center gap-1 text-[11px] font-medium text-primary hover:underline"
                          >
                            <Code2 className="h-3 w-3" />
                            <span>{isExpanded ? "Hide Details" : "View Details"}</span>
                            {isExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </button>
                        )}
                      </div>

                      {/* Expandable Metadata JSON view */}
                      {hasMetadata && isExpanded && (
                        <div className="mt-2 pt-2 border-t border-border/40">
                          <div className="p-2.5 rounded-lg bg-slate-950 text-slate-100 dark:bg-black/60 font-mono text-[11px] overflow-x-auto">
                            <pre className="whitespace-pre-wrap break-all">
                              {(() => {
                                try {
                                  return JSON.stringify(JSON.parse(event.metadata!), null, 2);
                                } catch {
                                  return event.metadata;
                                }
                              })()}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-muted/20 border-t border-border/60 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Compliance & Moderation Audit Trail
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs h-8 px-4">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  useCustomer360Timeline,
  Customer360TimelineItem,
} from "@/graphql/analytics/analytics360";
import {
  Clock,
  Search,
  ExternalLink,
  Code2,
  ChevronDown,
  ChevronRight,
  User,
  Activity,
  Compass,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  RefreshCw,
  Layers,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface Customer360TimelineModalProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function Customer360TimelineModal({
  userId,
  isOpen,
  onClose,
}: Customer360TimelineModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEvents, setExpandedEvents] = useState<Record<string, boolean>>({});

  const { data, loading, error, refetch } = useCustomer360Timeline(
    userId || "",
    {
      skip: !userId || !isOpen,
    }
  );

  const timelineData = data?.getCustomer360Timeline;
  const events = timelineData?.events || [];

  const toggleExpand = (id: string) => {
    setExpandedEvents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEvents = events.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.eventType?.toLowerCase().includes(q) ||
      e.title?.toLowerCase().includes(q) ||
      e.description?.toLowerCase().includes(q) ||
      e.category?.toLowerCase().includes(q) ||
      e.source?.toLowerCase().includes(q) ||
      e.pageTitle?.toLowerCase().includes(q)
    );
  });

  const getEventCategoryStyle = (category: string, eventType: string) => {
    const key = (category || eventType || "").toLowerCase();
    if (key.includes("order") || key.includes("purchase") || key.includes("commerce") || key.includes("payment")) {
      return {
        icon: <ShoppingBag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
        badge: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
        ring: "ring-emerald-500/30",
      };
    }
    if (key.includes("post") || key.includes("comment") || key.includes("message") || key.includes("feed")) {
      return {
        icon: <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />,
        badge: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
        ring: "ring-blue-500/30",
      };
    }
    if (key.includes("page") || key.includes("view") || key.includes("session") || key.includes("navigation")) {
      return {
        icon: <Compass className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />,
        badge: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/20",
        ring: "ring-indigo-500/30",
      };
    }
    if (key.includes("auth") || key.includes("login") || key.includes("signup") || key.includes("onboard")) {
      return {
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
        badge: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
        ring: "ring-amber-500/30",
      };
    }
    return {
      icon: <Activity className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />,
      badge: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
      ring: "ring-purple-500/30",
    };
  };

  const formatEventTimestamp = (timestampStr: string) => {
    try {
      const date = new Date(timestampStr);
      if (isNaN(date.getTime())) return timestampStr;
      return {
        absolute: format(date, "MMM d, yyyy · HH:mm:ss"),
        relative: formatDistanceToNow(date, { addSuffix: true }),
      };
    } catch {
      return { absolute: timestampStr, relative: "" };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden rounded-2xl border-border bg-card">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-semibold">
                <User className="w-4 h-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold flex items-center gap-2">
                  Customer 360 Activity Journey
                  {timelineData?.total !== undefined && (
                    <Badge variant="outline" className="font-mono text-xs">
                      {timelineData.total} Events
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground font-mono">
                  Member ID: {userId}
                </DialogDescription>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
              className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`}
              />
              Sync
            </Button>
          </div>

          {/* Search Filter */}
          <div className="mt-3 relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Filter activities by type, action, category or URL..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-background/80"
            />
          </div>
        </DialogHeader>

        {/* Timeline Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="space-y-4 py-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex gap-4 items-start">
                  <Skeleton className="w-8 h-8 rounded-full shrink-0" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-12 text-center text-sm text-destructive">
              Failed to load journey timeline: {error.message}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-sm">
              <Layers className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No activities found for this member{searchQuery ? " matching your filter" : ""}.
            </div>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {filteredEvents.map((evt, idx) => {
                const style = getEventCategoryStyle(evt.category, evt.eventType);
                const isExpanded = expandedEvents[evt.eventId || `evt-${idx}`];
                const ts = formatEventTimestamp(evt.timestamp);

                return (
                  <div key={evt.eventId || idx} className="relative group">
                    {/* Dot on line */}
                    <div
                      className={`absolute -left-6 top-1 w-5 h-5 rounded-full bg-card border-2 border-primary/40 flex items-center justify-center ring-4 ring-background ${style.ring}`}
                    >
                      {style.icon}
                    </div>

                    {/* Event Content Card */}
                    <div className="bg-muted/30 hover:bg-muted/50 transition-colors border border-border/60 rounded-xl p-3.5 space-y-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-xs text-foreground">
                            {evt.title || evt.eventType}
                          </span>
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 uppercase font-mono font-medium ${style.badge}`}
                          >
                            {evt.eventType}
                          </Badge>
                          {evt.source && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0 font-mono"
                            >
                              {evt.source}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                          <Clock className="w-3 h-3" />
                          <span>{ts.absolute}</span>
                          {ts.relative && (
                            <span className="text-muted-foreground/60">
                              ({ts.relative})
                            </span>
                          )}
                        </div>
                      </div>

                      {evt.description && (
                        <p className="text-xs text-muted-foreground">
                          {evt.description}
                        </p>
                      )}

                      {/* URL / Page Info */}
                      {(evt.pageTitle || evt.pageUrl) && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-background/60 px-2.5 py-1 rounded-md border border-border/40">
                          <ExternalLink className="w-3 h-3 text-primary/70 shrink-0" />
                          <span className="font-medium text-foreground truncate max-w-xs">
                            {evt.pageTitle || evt.pageUrl}
                          </span>
                          {evt.pageUrl && evt.pageTitle && (
                            <span className="text-[11px] font-mono text-muted-foreground/70 truncate">
                              {evt.pageUrl}
                            </span>
                          )}
                        </div>
                      )}

                      {/* JSON Properties Toggle */}
                      {evt.properties && Object.keys(evt.properties).length > 0 && (
                        <div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              toggleExpand(evt.eventId || `evt-${idx}`)
                            }
                            className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground font-mono"
                          >
                            <Code2 className="w-3 h-3 mr-1" />
                            {isExpanded ? (
                              <>
                                <ChevronDown className="w-3 h-3 mr-1" />
                                Hide Properties
                              </>
                            ) : (
                              <>
                                <ChevronRight className="w-3 h-3 mr-1" />
                                Inspect Properties ({Object.keys(evt.properties).length})
                              </>
                            )}
                          </Button>

                          {isExpanded && (
                            <pre className="mt-1.5 p-2.5 text-[11px] font-mono bg-zinc-950 text-zinc-200 dark:bg-zinc-900 rounded-lg overflow-x-auto border border-zinc-800">
                              {JSON.stringify(evt.properties, null, 2)}
                            </pre>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

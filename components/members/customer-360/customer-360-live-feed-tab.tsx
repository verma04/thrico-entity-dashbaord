"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAnalytics360LiveEvents,
  Analytics360LiveEvent,
} from "@/graphql/analytics/analytics360";
import {
  Radio,
  Search,
  RefreshCw,
  ExternalLink,
  Code2,
  ChevronDown,
  ChevronRight,
  User,
  Activity,
  Layers,
  Sparkles,
  Compass,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

interface Customer360LiveFeedTabProps {
  onInspectMember: (userId: string) => void;
}

export function Customer360LiveFeedTab({
  onInspectMember,
}: Customer360LiveFeedTabProps) {
  const [isLiveStreaming, setIsLiveStreaming] = useState(true);
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPayloads, setExpandedPayloads] = useState<Record<string, boolean>>({});

  const { data, loading, error, refetch, startPolling, stopPolling } =
    useAnalytics360LiveEvents({
      limit: 50,
      eventType: eventTypeFilter || undefined,
    });

  useEffect(() => {
    if (isLiveStreaming) {
      startPolling(8000); // Poll every 8s
    } else {
      stopPolling();
    }
    return () => {
      stopPolling();
    };
  }, [isLiveStreaming, startPolling, stopPolling]);

  const liveEvents = data?.getAnalytics360LiveEvents || [];

  const togglePayload = (id: string) => {
    setExpandedPayloads((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredEvents = liveEvents.filter((e) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      e.eventType?.toLowerCase().includes(q) ||
      e.entityType?.toLowerCase().includes(q) ||
      e.source?.toLowerCase().includes(q) ||
      e.userId?.toLowerCase().includes(q) ||
      e.pageUrl?.toLowerCase().includes(q)
    );
  });

  const formatEventTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      return {
        absolute: format(d, "HH:mm:ss"),
        relative: formatDistanceToNow(d, { addSuffix: true }),
      };
    } catch {
      return { absolute: isoString, relative: "" };
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/80 bg-card">
        <CardHeader className="pb-4 border-b border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-500" />
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  Real-Time Activity Telemetry
                  {isLiveStreaming && (
                    <span className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      STREAMING
                    </span>
                  )}
                </CardTitle>
              </div>
              <CardDescription className="text-xs">
                Sub-second live stream of platform events, page navigation & actions
              </CardDescription>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Auto stream toggle */}
              <div className="flex items-center gap-2 bg-muted/40 border border-border/40 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-muted-foreground text-xs">Live Polling</span>
                <Switch
                  checked={isLiveStreaming}
                  onCheckedChange={setIsLiveStreaming}
                />
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Filter by user, event, page..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs w-48 sm:w-56"
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => refetch()}
                disabled={loading}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading && liveEvents.length === 0 ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : error && liveEvents.length === 0 ? (
            <div className="py-12 text-center text-sm text-destructive">
              Failed to load live events: {error.message}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground text-xs">
              <Activity className="w-8 h-8 opacity-30 mx-auto mb-2" />
              No live telemetry events recorded yet.
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {filteredEvents.map((evt, idx) => {
                const isExpanded = expandedPayloads[evt.eventId || `live-${idx}`];
                const timeInfo = formatEventTime(evt.eventTime);

                return (
                  <div
                    key={evt.eventId || idx}
                    className="p-3.5 hover:bg-muted/30 transition-colors text-xs space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {/* Event type */}
                        <Badge
                          variant="outline"
                          className="font-mono text-[10px] uppercase px-1.5 py-0 bg-primary/5 text-primary border-primary/20"
                        >
                          {evt.eventType}
                        </Badge>

                        {/* Entity type/ID */}
                        {evt.entityType && (
                          <span className="font-mono text-[11px] text-muted-foreground">
                            {evt.entityType}
                            {evt.entityId && `:${evt.entityId.slice(0, 8)}`}
                          </span>
                        )}

                        {/* Source */}
                        {evt.source && (
                          <Badge
                            variant="secondary"
                            className="font-mono text-[10px] px-1.5 py-0"
                          >
                            {evt.source}
                          </Badge>
                        )}

                        {/* User attribution chip */}
                        {evt.userId && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onInspectMember(evt.userId!)}
                            className="h-5 px-1.5 text-[11px] font-mono text-primary hover:text-primary hover:bg-primary/10 gap-1 rounded"
                            title="Inspect Member Journey"
                          >
                            <User className="w-3 h-3" />
                            <span>{evt.userId.slice(0, 12)}...</span>
                          </Button>
                        )}
                      </div>

                      {/* Time */}
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                        <span className="font-semibold text-foreground">
                          {timeInfo.absolute}
                        </span>
                        {timeInfo.relative && (
                          <span className="text-muted-foreground/60">
                            ({timeInfo.relative})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Page info */}
                    {(evt.pageTitle || evt.pageUrl) && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-md">
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

                    {/* Payload viewer toggle */}
                    {evt.properties && Object.keys(evt.properties).length > 0 && (
                      <div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            togglePayload(evt.eventId || `live-${idx}`)
                          }
                          className="h-5 px-2 text-[10px] text-muted-foreground hover:text-foreground font-mono"
                        >
                          <Code2 className="w-3 h-3 mr-1" />
                          {isExpanded ? (
                            <>
                              <ChevronDown className="w-3 h-3 mr-1" />
                              Hide Payload
                            </>
                          ) : (
                            <>
                              <ChevronRight className="w-3 h-3 mr-1" />
                              Inspect Payload
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
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

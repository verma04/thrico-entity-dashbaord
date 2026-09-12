"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { safeFormatDistanceToNow, safeFormat } from "@/lib/date-utils";
import {
  Activity,
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  ExternalLink,
  ShoppingBag,
  MessageSquare,
  Calendar,
  Award,
  Globe,
  LogIn,
  Mail,
  Clock,
  Layers,
  Code2,
  SlidersHorizontal,
  X,
  FileText,
  Table as TableIcon,
  LayoutGrid,
} from "lucide-react";

/* ── Types ───────────────────────────────────────────────────────────────── */

export interface ActivityStreamItem {
  eventType: string;
  entityType?: string;
  entityId?: string;
  timestamp: string;
  summary?: string;
  properties?: Record<string, any>;
}

interface MemberActivityStreamProps {
  activities?: ActivityStreamItem[];
  className?: string;
}

type EventCategory =
  | "ALL"
  | "COMMERCE"
  | "COMMUNITY"
  | "EVENTS"
  | "GAMIFICATION"
  | "WEB"
  | "EMAIL"
  | "AUTH"
  | "OTHER";

/* ── Category & Styling Helpers ──────────────────────────────────────────── */

function getEventCategory(eventType: string, entityType?: string): EventCategory {
  const t = (eventType || "").toUpperCase();
  const ent = (entityType || "").toUpperCase();

  if (
    t.includes("ORDER") ||
    t.includes("PURCHASE") ||
    t.includes("CHECKOUT") ||
    t.includes("PAYMENT") ||
    ent === "ORDER" ||
    ent === "COMMERCE"
  ) {
    return "COMMERCE";
  }
  if (
    t.includes("COMMUNITY") ||
    t.includes("POST") ||
    t.includes("COMMENT") ||
    t.includes("REACTION") ||
    t.includes("FORUM") ||
    ent === "POST" ||
    ent === "COMMUNITY" ||
    ent === "COMMENT"
  ) {
    return "COMMUNITY";
  }
  if (
    t.includes("EVENT") ||
    t.includes("TICKET") ||
    t.includes("ATTENDEE") ||
    ent === "EVENT" ||
    ent === "TICKET"
  ) {
    return "EVENTS";
  }
  if (
    t.includes("BADGE") ||
    t.includes("POINT") ||
    t.includes("REWARD") ||
    t.includes("GAMIF") ||
    ent === "BADGE" ||
    ent === "REWARD"
  ) {
    return "GAMIFICATION";
  }
  if (
    t.includes("PAGE_VIEW") ||
    t.includes("CLICK") ||
    t.includes("SCROLL") ||
    t.includes("FORM") ||
    t.includes("WEB")
  ) {
    return "WEB";
  }
  if (t.includes("CAMPAIGN") || t.includes("EMAIL") || t.includes("MAIL") || ent === "CAMPAIGN") {
    return "EMAIL";
  }
  if (t.includes("LOGIN") || t.includes("AUTH") || t.includes("SESSION") || t.includes("SIGNUP")) {
    return "AUTH";
  }
  return "OTHER";
}

const CATEGORY_CONFIG: Record<
  EventCategory,
  {
    label: string;
    icon: React.ElementType;
    badgeBg: string;
    badgeText: string;
    border: string;
  }
> = {
  ALL: {
    label: "All Events",
    icon: Layers,
    badgeBg: "bg-slate-100 dark:bg-slate-800",
    badgeText: "text-slate-700 dark:text-slate-200",
    border: "border-slate-200 dark:border-slate-700",
  },
  COMMERCE: {
    label: "Commerce",
    icon: ShoppingBag,
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-900/50",
  },
  COMMUNITY: {
    label: "Community",
    icon: MessageSquare,
    badgeBg: "bg-violet-50 dark:bg-violet-950/40",
    badgeText: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-900/50",
  },
  EVENTS: {
    label: "Events",
    icon: Calendar,
    badgeBg: "bg-blue-50 dark:bg-blue-950/40",
    badgeText: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-900/50",
  },
  GAMIFICATION: {
    label: "Gamification",
    icon: Award,
    badgeBg: "bg-amber-50 dark:bg-amber-950/40",
    badgeText: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-900/50",
  },
  WEB: {
    label: "Web & Telemetry",
    icon: Globe,
    badgeBg: "bg-cyan-50 dark:bg-cyan-950/40",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-900/50",
  },
  EMAIL: {
    label: "Email & Mail",
    icon: Mail,
    badgeBg: "bg-sky-50 dark:bg-sky-950/40",
    badgeText: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-900/50",
  },
  AUTH: {
    label: "Auth & Access",
    icon: LogIn,
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-900/50",
  },
  OTHER: {
    label: "System",
    icon: Activity,
    badgeBg: "bg-slate-100 dark:bg-slate-800",
    badgeText: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
  },
};

/* ── Smart Event Formatter ───────────────────────────────────────────────── */

function formatEventDetails(act: ActivityStreamItem) {
  const props = act.properties || {};
  const ev = (act.eventType || "").toUpperCase();

  let title = act.summary || act.eventType.replace(/_/g, " ");
  let subtitle = "";
  let highlights: Array<{ label: string; value: string }> = [];

  // Commerce
  if (ev === "ORDER_COMPLETED" || ev.includes("ORDER") || ev.includes("PURCHASE")) {
    const amount = props.amount || props.total_amount || props.total;
    const currency = props.currency || "₹";
    title = amount ? `Completed Order (${currency}${Number(amount).toLocaleString()})` : "Completed Purchase Order";
    if (props.itemCount || props.items_count) {
      highlights.push({ label: "Items", value: String(props.itemCount || props.items_count) });
    }
    if (amount) {
      highlights.push({ label: "Total", value: `${currency}${Number(amount).toLocaleString()}` });
    }
    if (props.orderNumber || props.order_id) {
      subtitle = `Order #${props.orderNumber || props.order_id}`;
    }
  }
  // Community Posts & Comments
  else if (ev === "POST_CREATED" || ev === "COMMUNITY_POST_CREATED") {
    title = props.title ? `Published Post: "${props.title}"` : "Published Community Post";
    if (props.content) subtitle = props.content.slice(0, 80) + (props.content.length > 80 ? "..." : "");
    if (props.channelName) highlights.push({ label: "Channel", value: props.channelName });
  } else if (ev === "COMMENT_CREATED" || ev === "COMMUNITY_COMMENT_CREATED") {
    title = "Commented on Discussion";
    if (props.text || props.content) {
      subtitle = `"${(props.text || props.content).slice(0, 80)}${(props.text || props.content).length > 80 ? "..." : ""}"`;
    }
  }
  // Events
  else if (ev.includes("EVENT_REGISTERED") || ev.includes("EVENT_ATTENDEE_REGISTERED")) {
    title = props.eventTitle ? `Registered: ${props.eventTitle}` : "Registered for Event";
    if (props.ticketType) highlights.push({ label: "Ticket", value: props.ticketType });
    if (props.eventDate) highlights.push({ label: "Date", value: safeFormat(props.eventDate, "MMM d, yyyy") });
  } else if (ev.includes("EVENT_ATTENDEE_CHECKED_IN")) {
    title = props.eventTitle ? `Checked In: ${props.eventTitle}` : "Checked in to Event Venue";
    highlights.push({ label: "Status", value: "Attended" });
  }
  // Gamification
  else if (ev === "POINTS_EARNED" || ev.includes("POINT")) {
    const pts = props.points || props.amount || 0;
    title = pts ? `Earned +${pts} Points` : "Earned Gamification Points";
    if (props.reason || props.action) subtitle = props.reason || props.action;
    highlights.push({ label: "Reward", value: `+${pts} pts` });
  } else if (ev.includes("BADGE")) {
    title = props.badgeName ? `Unlocked Badge: ${props.badgeName}` : "Unlocked Achievement Badge";
    highlights.push({ label: "Badge", value: props.badgeName || "Badge" });
  }
  // Web telemetry
  else if (ev === "PAGE_VIEW" || ev === "WEB_PAGE_VIEW") {
    const pageTitle = props.page_title || props.title;
    const pageUrl = props.page_url || props.url || props.path;
    title = pageTitle ? `Viewed: ${pageTitle}` : pageUrl ? `Visited ${pageUrl}` : "Viewed Web Page";
    if (pageUrl && pageTitle) subtitle = pageUrl;
    if (props.referrer) highlights.push({ label: "Ref", value: props.referrer });
  } else if (ev === "WEB_CLICK") {
    title = `Clicked: ${props.text || props.tag || "Element"}`;
    if (props.target || props.href) subtitle = props.target || props.href;
  } else if (ev === "WEB_SCROLL") {
    title = `Scrolled Page (${props.depthPercent || props.depth || 0}%)`;
    if (props.page_url) subtitle = props.page_url;
  } else if (ev === "FORM_SUBMIT" || ev === "FORM_START") {
    title = `${ev === "FORM_SUBMIT" ? "Submitted" : "Started"} Form: ${props.formName || props.formId || "Website Form"}`;
    if (props.page_url) subtitle = props.page_url;
  }

  if (!subtitle && act.entityId) {
    subtitle = `ID: ${act.entityId}`;
  }

  return { title, subtitle, highlights };
}

/* ── Copy to Clipboard Button ────────────────────────────────────────────── */

function CopyButton({
  text,
  label = "Copy",
}: {
  text: string;
  label?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "h-5 px-1.5 text-[10px] text-muted-foreground hover:text-foreground transition-all gap-1",
        copied && "text-emerald-600 dark:text-emerald-400 font-medium",
      )}
      onClick={handleCopy}
      title={copied ? "Copied!" : `Copy ${label}`}
    >
      {copied ? (
        <>
          <Check className="h-2.5 w-2.5 text-emerald-500" />
          <span>Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-2.5 w-2.5 opacity-70" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}

/* ── Expandable Event Detail Drawer ──────────────────────────────────────── */

function ActivityEventDetailDrawer({ activity }: { activity: ActivityStreamItem }) {
  const props = activity.properties || {};
  const exactDate = safeFormat(activity.timestamp, "PPP 'at' pp", "Recent");
  const relativeTime = safeFormatDistanceToNow(activity.timestamp, { addSuffix: true });
  const pageUrl = props.page_url || props.url || props.pageUrl;
  const pageTitle = props.page_title || props.pageTitle;

  const extraProps = useMemo(() => {
    const hiddenKeys = new Set([
      "page_url",
      "pageUrl",
      "page_title",
      "pageTitle",
      "source",
      "summary",
      "url",
    ]);
    return Object.entries(props).filter(([k]) => !hiddenKeys.has(k));
  }, [props]);

  return (
    <div className="p-3 sm:p-4 bg-muted/15 border-t border-border/40 space-y-3 animate-in fade-in-50 duration-200">
      {/* 1. Metadata Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <div className="p-2 rounded-md bg-card border border-border/50">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
            Event Type
          </span>
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <span className="text-xs font-mono font-bold truncate text-foreground">
              {activity.eventType}
            </span>
            <CopyButton text={activity.eventType} label="Copy" />
          </div>
        </div>

        <div className="p-2 rounded-md bg-card border border-border/50">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
            Target Entity ({activity.entityType || "Generic"})
          </span>
          <div className="flex items-center justify-between gap-1 mt-0.5">
            <span className="text-xs font-mono truncate text-foreground" title={activity.entityId}>
              {activity.entityId || "N/A"}
            </span>
            {activity.entityId && <CopyButton text={activity.entityId} label="Copy" />}
          </div>
        </div>

        <div className="p-2 rounded-md bg-card border border-border/50">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider block">
            Timestamp
          </span>
          <div className="mt-0.5">
            <span className="text-xs font-medium text-foreground block truncate">
              {exactDate}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {relativeTime}
            </span>
          </div>
        </div>
      </div>

      {/* 2. Web & Page Context (If Available) */}
      {(pageUrl || pageTitle) && (
        <div className="p-2.5 rounded-md bg-card border border-border/50 flex items-center justify-between gap-2 flex-wrap">
          <div className="min-w-0 flex-1">
            <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Globe className="h-3 w-3 text-cyan-500" /> Web Context
            </span>
            {pageTitle && <p className="text-xs font-semibold text-foreground truncate mt-0.5">{pageTitle}</p>}
            {pageUrl && <p className="text-[10px] font-mono text-muted-foreground truncate">{pageUrl}</p>}
          </div>
          {pageUrl && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-[10px] px-2 gap-1 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                window.open(pageUrl, "_blank", "noopener,noreferrer");
              }}
            >
              <ExternalLink className="h-2.5 w-2.5" />
              Visit
            </Button>
          )}
        </div>
      )}

      {/* 3. Event Properties (If any) */}
      {extraProps.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <FileText className="h-3 w-3" /> Event Properties ({extraProps.length})
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {extraProps.map(([key, val]) => {
              const displayVal = typeof val === "object" && val !== null ? JSON.stringify(val) : String(val);
              return (
                <div key={key} className="p-1.5 rounded bg-card border border-border/40 text-xs">
                  <span className="text-[9px] font-semibold text-muted-foreground block truncate">{key}</span>
                  <span className="font-mono text-[11px] text-foreground block truncate mt-0.5" title={displayVal}>
                    {displayVal}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Raw JSON Telemetry Payload */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
            <Code2 className="h-3 w-3 text-primary" /> Telemetry Payload (JSON)
          </span>
          <CopyButton text={JSON.stringify(activity, null, 2)} label="Copy JSON" />
        </div>
        <pre className="p-2.5 rounded-md bg-slate-950 text-slate-100 font-mono text-[10px] leading-relaxed overflow-x-auto max-h-40 border border-slate-800 shadow-inner">
          {JSON.stringify(activity.properties || {}, null, 2)}
        </pre>
      </div>
    </div>
  );
}

/* ── Main Activity Stream Component ──────────────────────────────────────── */

export function MemberActivityStream({
  activities = [],
  className,
}: MemberActivityStreamProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("ALL");
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());
  const [viewMode, setViewMode] = useState<"table" | "cards">("table");
  const [pageSize, setPageSize] = useState<number>(15);
  const [page, setPage] = useState<number>(0);

  // Compute category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<EventCategory, number> = {
      ALL: activities.length,
      COMMERCE: 0,
      COMMUNITY: 0,
      EVENTS: 0,
      GAMIFICATION: 0,
      WEB: 0,
      EMAIL: 0,
      AUTH: 0,
      OTHER: 0,
    };

    activities.forEach((act) => {
      const cat = getEventCategory(act.eventType, act.entityType);
      counts[cat] = (counts[cat] || 0) + 1;
    });

    return counts;
  }, [activities]);

  // Filter activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (selectedCategory !== "ALL") {
        const cat = getEventCategory(act.eventType, act.entityType);
        if (cat !== selectedCategory) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const evType = (act.eventType || "").toLowerCase();
        const entType = (act.entityType || "").toLowerCase();
        const entId = (act.entityId || "").toLowerCase();
        const summary = (act.summary || "").toLowerCase();
        const propsStr = JSON.stringify(act.properties || {}).toLowerCase();

        return (
          evType.includes(q) ||
          entType.includes(q) ||
          entId.includes(q) ||
          summary.includes(q) ||
          propsStr.includes(q)
        );
      }

      return true;
    });
  }, [activities, selectedCategory, searchQuery]);

  // Pagination slice
  const totalPages = Math.ceil(filteredActivities.length / pageSize) || 1;
  const paginatedActivities = useMemo(() => {
    const start = page * pageSize;
    return filteredActivities.slice(start, start + pageSize);
  }, [filteredActivities, page, pageSize]);

  // Toggle single item
  const toggleItem = (index: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const isAllExpanded =
    paginatedActivities.length > 0 &&
    paginatedActivities.every((_, i) => expandedIndices.has(page * pageSize + i));

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedIndices(new Set());
    } else {
      const indices = paginatedActivities.map((_, i) => page * pageSize + i);
      setExpandedIndices(new Set(indices));
    }
  };

  return (
    <Card className={cn("border border-border/60 shadow-xs overflow-hidden", className)}>
      {/* ── Compact Header & Toolbar ── */}
      <CardHeader className="p-3 sm:p-4 border-b border-border/50 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40">
              <Activity className="h-3.5 w-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xs sm:text-sm font-bold text-foreground">
                  Activity Telemetry Stream
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-semibold px-2 py-0 h-4.5">
                  {filteredActivities.length} events
                </Badge>
              </div>
              <CardDescription className="text-[10px] text-muted-foreground mt-0.5 hidden sm:block">
                Sub-second behavioral events and real-time interaction logs
              </CardDescription>
            </div>
          </div>

          {/* Quick View Controls: Table vs Card & Expand All */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            <div className="flex items-center bg-muted/60 p-0.5 rounded-md border border-border/50">
              <Button
                variant={viewMode === "table" ? "default" : "ghost"}
                size="sm"
                className="h-6 px-2 text-[11px] gap-1 rounded-xs"
                onClick={() => setViewMode("table")}
                title="Compact Table View"
              >
                <TableIcon className="h-3 w-3" />
                <span>Table</span>
              </Button>
              <Button
                variant={viewMode === "cards" ? "default" : "ghost"}
                size="sm"
                className="h-6 px-2 text-[11px] gap-1 rounded-xs"
                onClick={() => setViewMode("cards")}
                title="Compact Card View"
              >
                <LayoutGrid className="h-3 w-3" />
                <span>Cards</span>
              </Button>
            </div>

            {filteredActivities.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[10px] font-medium gap-1 px-2 border-border/60"
                onClick={toggleExpandAll}
              >
                {isAllExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3" /> Collapse All
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3" /> Expand All
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* ── Search & Filter Chips ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-0.5">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search event type, IDs, paths..."
              className="pl-7 pr-7 h-7 text-xs bg-muted/25 focus:bg-background border-border/60"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 no-scrollbar">
            {(
              [
                "ALL",
                "COMMERCE",
                "COMMUNITY",
                "EVENTS",
                "GAMIFICATION",
                "WEB",
                "AUTH",
              ] as EventCategory[]
            ).map((cat) => {
              const count = categoryCounts[cat] || 0;
              const isSelected = selectedCategory === cat;
              const cfg = CATEGORY_CONFIG[cat];
              const CatIcon = cfg.icon;

              if (cat !== "ALL" && count === 0) return null;

              return (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setPage(0);
                  }}
                  className={cn(
                    "flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium transition-all whitespace-nowrap border shrink-0 h-6",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary font-bold shadow-2xs"
                      : "bg-muted/30 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50",
                  )}
                >
                  <CatIcon className="h-2.5 w-2.5" />
                  <span>{cat === "ALL" ? "All" : cfg.label}</span>
                  <span
                    className={cn(
                      "text-[9px] px-1 rounded-full font-mono",
                      isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      {/* ── Card Content: Dual Table / Card Rendering ── */}
      <CardContent className="p-0">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <Activity className="h-5 w-5 opacity-30 mb-1" />
            <p className="text-xs font-semibold text-foreground">No Telemetry Events</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              No activity logged for this member in ClickHouse yet.
            </p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <Search className="h-5 w-5 opacity-30 mb-1" />
            <p className="text-xs font-semibold text-foreground">No Matching Events</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2 text-[10px] h-6 px-2"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
              }}
            >
              Clear Search
            </Button>
          </div>
        ) : viewMode === "table" ? (
          /* ═════════════════════════════════════════════════════════════════
             COMPACT DATA TABLE VIEW
             ═════════════════════════════════════════════════════════════════ */
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 bg-muted/20 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold select-none">
                  <th className="py-2 px-3">Event Type</th>
                  <th className="py-2 px-2.5">Category</th>
                  <th className="py-2 px-2.5">Summary / Context</th>
                  <th className="py-2 px-2 hidden md:table-cell">Entity</th>
                  <th className="py-2 px-2 hidden sm:table-cell">Source</th>
                  <th className="py-2 px-3 text-right">Time</th>
                  <th className="py-2 px-2 text-center w-8"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {paginatedActivities.map((act, idx) => {
                  const globalIdx = page * pageSize + idx;
                  const isExpanded = expandedIndices.has(globalIdx);
                  const category = getEventCategory(act.eventType, act.entityType);
                  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.OTHER;
                  const CatIcon = cfg.icon;
                  const { title, subtitle, highlights } = formatEventDetails(act);
                  const relativeTime = safeFormatDistanceToNow(act.timestamp, { addSuffix: true });
                  const exactDate = safeFormat(act.timestamp, "PPP 'at' pp", "Recent");
                  const source = act.properties?.source || "web";

                  return (
                    <React.Fragment key={`${act.eventType}-${act.timestamp}-${globalIdx}`}>
                      <tr
                        onClick={() => toggleItem(globalIdx)}
                        className={cn(
                          "transition-colors cursor-pointer group text-xs",
                          isExpanded
                            ? "bg-primary/5 dark:bg-primary/10"
                            : "hover:bg-muted/40",
                        )}
                      >
                        {/* Event Name & Mini-Icon */}
                        <td className="py-2 px-3 align-middle font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <div className={cn("p-1 rounded shrink-0 border", cfg.badgeBg, cfg.border)}>
                              <CatIcon className={cn("h-3 w-3", cfg.badgeText)} />
                            </div>
                            <span className="font-semibold text-xs text-foreground truncate max-w-[180px] sm:max-w-[220px]">
                              {title}
                            </span>
                          </div>
                        </td>

                        {/* Category Badge */}
                        <td className="py-2 px-2.5 align-middle">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[9px] font-semibold px-1.5 py-0 h-4 rounded border",
                              cfg.badgeBg,
                              cfg.badgeText,
                              cfg.border,
                            )}
                          >
                            {cfg.label}
                          </Badge>
                        </td>

                        {/* Summary / Context */}
                        <td className="py-2 px-2.5 align-middle text-muted-foreground">
                          <div className="flex items-center gap-1.5 flex-wrap max-w-sm">
                            {subtitle && (
                              <span className="text-[11px] truncate max-w-[200px] text-foreground/80">
                                {subtitle}
                              </span>
                            )}
                            {highlights.slice(0, 2).map((h, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-0.5 text-[9px] px-1 py-0 rounded bg-muted/60 text-foreground border border-border/40 font-mono"
                              >
                                <span className="text-muted-foreground">{h.label}:</span>
                                <b>{h.value}</b>
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Entity Target */}
                        <td className="py-2 px-2 align-middle hidden md:table-cell text-muted-foreground font-mono text-[10px]">
                          {act.entityType ? (
                            <span className="truncate max-w-[120px] block" title={`${act.entityType}:${act.entityId || ""}`}>
                              {act.entityType}
                              {act.entityId && `:${act.entityId.slice(0, 6)}`}
                            </span>
                          ) : (
                            <span className="text-muted-foreground/50">—</span>
                          )}
                        </td>

                        {/* Source Tag */}
                        <td className="py-2 px-2 align-middle hidden sm:table-cell">
                          <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-muted/60 text-muted-foreground uppercase">
                            {source}
                          </span>
                        </td>

                        {/* Timestamp */}
                        <td className="py-2 px-3 align-middle text-right text-[11px] text-muted-foreground tabular-nums whitespace-nowrap">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="cursor-help flex items-center justify-end gap-1">
                                  <Clock className="h-2.5 w-2.5 opacity-50" />
                                  {relativeTime}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p className="text-[10px] font-medium">{exactDate}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>

                        {/* Chevron Expand Toggle */}
                        <td className="py-2 px-2 align-middle text-center">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-5 w-5 rounded text-muted-foreground group-hover:text-foreground"
                          >
                            {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                          </Button>
                        </td>
                      </tr>

                      {/* Expandable Table Detail Drawer */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} className="p-0 border-b border-border/60">
                            <ActivityEventDetailDrawer activity={act} />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          /* ═════════════════════════════════════════════════════════════════
             COMPACT CARD VIEW (STREAMLINED TILES)
             ═════════════════════════════════════════════════════════════════ */
          <div className="p-3 sm:p-4 space-y-2">
            {paginatedActivities.map((act, idx) => {
              const globalIdx = page * pageSize + idx;
              const isExpanded = expandedIndices.has(globalIdx);
              const category = getEventCategory(act.eventType, act.entityType);
              const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.OTHER;
              const CatIcon = cfg.icon;
              const { title, subtitle, highlights } = formatEventDetails(act);
              const relativeTime = safeFormatDistanceToNow(act.timestamp, { addSuffix: true });
              const source = act.properties?.source || "web";

              return (
                <div
                  key={`${act.eventType}-${act.timestamp}-${globalIdx}`}
                  className={cn(
                    "border rounded-lg transition-all duration-150 overflow-hidden",
                    isExpanded
                      ? "bg-card border-primary/40 ring-1 ring-primary/10 shadow-2xs"
                      : "bg-card/60 hover:bg-muted/30 border-border/50",
                  )}
                >
                  <div
                    onClick={() => toggleItem(globalIdx)}
                    className="p-2.5 sm:p-3 flex items-start justify-between gap-2.5 cursor-pointer select-none group"
                  >
                    <div className="flex items-start gap-2.5 min-w-0 flex-1">
                      <div className={cn("p-1.5 rounded-md shrink-0 mt-0.5 border", cfg.badgeBg, cfg.border)}>
                        <CatIcon className={cn("h-3.5 w-3.5", cfg.badgeText)} />
                      </div>
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-foreground tracking-tight">
                            {title}
                          </span>
                          <Badge
                            variant="outline"
                            className={cn("text-[9px] px-1.5 py-0 h-4 border", cfg.badgeBg, cfg.badgeText, cfg.border)}
                          >
                            {cfg.label}
                          </Badge>
                          {source && (
                            <span className="text-[9px] font-mono px-1 rounded bg-muted/60 text-muted-foreground">
                              {source}
                            </span>
                          )}
                        </div>
                        {subtitle && <p className="text-[11px] text-muted-foreground truncate">{subtitle}</p>}
                        {highlights.length > 0 && (
                          <div className="flex items-center gap-1 pt-0.5 flex-wrap">
                            {highlights.map((h, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0 rounded bg-muted/60 text-foreground border border-border/40 font-mono"
                              >
                                <span className="text-muted-foreground">{h.label}:</span>
                                <b>{h.value}</b>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 self-start mt-0.5">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5 opacity-50" />
                        {relativeTime}
                      </span>
                      <Button variant="ghost" size="icon" className="h-5 w-5 rounded">
                        {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  {isExpanded && <ActivityEventDetailDrawer activity={act} />}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Compact Pagination Bar ── */}
        {filteredActivities.length > pageSize && (
          <div className="p-2.5 px-3 border-t border-border/50 bg-muted/10 flex items-center justify-between gap-2 text-xs">
            <div className="text-[11px] text-muted-foreground">
              Showing{" "}
              <b>{page * pageSize + 1}</b> - <b>{Math.min((page + 1) * pageSize, filteredActivities.length)}</b> of{" "}
              <b>{filteredActivities.length}</b> events
            </div>

            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[11px] px-2"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
              >
                Previous
              </Button>
              <span className="text-[10px] font-mono text-muted-foreground px-1">
                {page + 1}/{totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-[11px] px-2"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

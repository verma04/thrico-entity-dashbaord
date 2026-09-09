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
    glow: string;
  }
> = {
  ALL: {
    label: "All Events",
    icon: Layers,
    badgeBg: "bg-slate-100 dark:bg-slate-800",
    badgeText: "text-slate-700 dark:text-slate-200",
    border: "border-slate-200 dark:border-slate-700",
    glow: "hover:border-slate-300 dark:hover:border-slate-600",
  },
  COMMERCE: {
    label: "Commerce",
    icon: ShoppingBag,
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/40",
    badgeText: "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-200 dark:border-emerald-900/50",
    glow: "hover:border-emerald-300 dark:hover:border-emerald-700",
  },
  COMMUNITY: {
    label: "Community",
    icon: MessageSquare,
    badgeBg: "bg-violet-50 dark:bg-violet-950/40",
    badgeText: "text-violet-700 dark:text-violet-300",
    border: "border-violet-200 dark:border-violet-900/50",
    glow: "hover:border-violet-300 dark:hover:border-violet-700",
  },
  EVENTS: {
    label: "Events",
    icon: Calendar,
    badgeBg: "bg-blue-50 dark:bg-blue-950/40",
    badgeText: "text-blue-700 dark:text-blue-300",
    border: "border-blue-200 dark:border-blue-900/50",
    glow: "hover:border-blue-300 dark:hover:border-blue-700",
  },
  GAMIFICATION: {
    label: "Gamification",
    icon: Award,
    badgeBg: "bg-amber-50 dark:bg-amber-950/40",
    badgeText: "text-amber-700 dark:text-amber-300",
    border: "border-amber-200 dark:border-amber-900/50",
    glow: "hover:border-amber-300 dark:hover:border-amber-700",
  },
  WEB: {
    label: "Web & Forms",
    icon: Globe,
    badgeBg: "bg-cyan-50 dark:bg-cyan-950/40",
    badgeText: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-200 dark:border-cyan-900/50",
    glow: "hover:border-cyan-300 dark:hover:border-cyan-700",
  },
  EMAIL: {
    label: "Email & Outreach",
    icon: Mail,
    badgeBg: "bg-sky-50 dark:bg-sky-950/40",
    badgeText: "text-sky-700 dark:text-sky-300",
    border: "border-sky-200 dark:border-sky-900/50",
    glow: "hover:border-sky-300 dark:hover:border-sky-700",
  },
  AUTH: {
    label: "Auth & Sessions",
    icon: LogIn,
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/40",
    badgeText: "text-indigo-700 dark:text-indigo-300",
    border: "border-indigo-200 dark:border-indigo-900/50",
    glow: "hover:border-indigo-300 dark:hover:border-indigo-700",
  },
  OTHER: {
    label: "System",
    icon: Activity,
    badgeBg: "bg-slate-100 dark:bg-slate-800",
    badgeText: "text-slate-700 dark:text-slate-300",
    border: "border-slate-200 dark:border-slate-700",
    glow: "hover:border-slate-300 dark:hover:border-slate-600",
  },
};

/* ── Smart Event Formatter ───────────────────────────────────────────────── */

function formatEventDetails(act: ActivityStreamItem) {
  const props = act.properties || {};
  const ev = (act.eventType || "").toUpperCase();

  let title = act.summary || act.eventType.replace(/_/g, " ");
  let subtitle = "";
  let highlights: Array<{ label: string; value: string; variant?: "default" | "secondary" | "outline" }> = [];

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
    if (props.content) subtitle = props.content.slice(0, 90) + (props.content.length > 90 ? "..." : "");
    if (props.channelName) highlights.push({ label: "Channel", value: props.channelName });
  } else if (ev === "COMMENT_CREATED" || ev === "COMMUNITY_COMMENT_CREATED") {
    title = "Commented on Discussion";
    if (props.text || props.content) {
      subtitle = `"${(props.text || props.content).slice(0, 90)}${(props.text || props.content).length > 90 ? "..." : ""}"`;
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
    highlights.push({ label: "Achievement", value: props.badgeName || "Badge" });
  }
  // Web telemetry
  else if (ev === "PAGE_VIEW" || ev === "WEB_PAGE_VIEW") {
    const pageTitle = props.page_title || props.title;
    const pageUrl = props.page_url || props.url || props.path;
    title = pageTitle ? `Viewed Page: ${pageTitle}` : pageUrl ? `Visited ${pageUrl}` : "Viewed Website Page";
    if (pageUrl && pageTitle) subtitle = pageUrl;
    if (props.referrer) highlights.push({ label: "Referrer", value: props.referrer });
  } else if (ev === "WEB_CLICK") {
    title = `Clicked ${props.text || props.tag || "Element"}`;
    if (props.target || props.href) subtitle = props.target || props.href;
  } else if (ev === "WEB_SCROLL") {
    title = `Scrolled Page (${props.depthPercent || props.depth || 0}%)`;
    if (props.page_url) subtitle = props.page_url;
  } else if (ev === "FORM_SUBMIT" || ev === "FORM_START") {
    title = `${ev === "FORM_SUBMIT" ? "Submitted" : "Started"} Form: ${props.formName || props.formId || "Website Form"}`;
    if (props.page_url) subtitle = props.page_url;
  }

  // Fallback subtitle if empty
  if (!subtitle && act.entityId) {
    subtitle = `Target ID: ${act.entityId}`;
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
        "h-6 px-1.5 text-xs text-muted-foreground hover:text-foreground transition-all",
        copied && "text-emerald-600 dark:text-emerald-400 font-medium",
      )}
      onClick={handleCopy}
      title={copied ? "Copied!" : `Copy ${label}`}
    >
      {copied ? (
        <>
          <Check className="h-3 w-3 mr-1 text-emerald-500" />
          <span className="text-[10px]">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3 w-3 mr-1 opacity-70" />
          <span className="text-[10px]">{label}</span>
        </>
      )}
    </Button>
  );
}

/* ── Single Event Row with Expandable Drawer ─────────────────────────────── */

interface ActivityEventItemProps {
  activity: ActivityStreamItem;
  isExpanded: boolean;
  onToggle: () => void;
  key?: React.Key;
}

function ActivityEventItem({
  activity,
  isExpanded,
  onToggle,
}: ActivityEventItemProps) {
  const category = getEventCategory(activity.eventType, activity.entityType);
  const cfg = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.OTHER;
  const CategoryIcon = cfg.icon;
  const { title, subtitle, highlights } = formatEventDetails(activity);
  const props = activity.properties || {};

  // Formatted date values
  const relativeTime = safeFormatDistanceToNow(activity.timestamp, { addSuffix: true });
  const exactDate = safeFormat(activity.timestamp, "PPP 'at' pp", "Recent");
  const shortDate = safeFormat(activity.timestamp, "MMM d, h:mm a");

  // Page link if available
  const pageUrl = props.page_url || props.url || props.pageUrl;
  const pageTitle = props.page_title || props.pageTitle;
  const sourceChannel = props.source || "web";

  // Filter out properties already highlighted to show clean extra key-values
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
    <div
      className={cn(
        "border rounded-xl transition-all duration-200 overflow-hidden",
        isExpanded
          ? "bg-card shadow-sm border-primary/30 dark:border-primary/20 ring-1 ring-primary/10"
          : "bg-card/60 hover:bg-muted/30 border-border/50",
      )}
    >
      {/* ── Row Header (Click to toggle) ── */}
      <div
        onClick={onToggle}
        className="flex items-start justify-between gap-3 p-3.5 sm:p-4 cursor-pointer select-none group"
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {/* Categorized Icon */}
          <div
            className={cn(
              "h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border shadow-2xs transition-transform group-hover:scale-105",
              cfg.badgeBg,
              cfg.border,
            )}
          >
            <CategoryIcon className={cn("h-4 w-4", cfg.badgeText)} />
          </div>

          {/* Core Content */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-semibold text-foreground tracking-tight">
                {title}
              </span>

              {/* Category Badge */}
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-medium px-2 py-0 h-4.5 rounded-md shrink-0 border",
                  cfg.badgeBg,
                  cfg.badgeText,
                  cfg.border,
                )}
              >
                {cfg.label}
              </Badge>

              {/* Entity Type Badge */}
              {activity.entityType && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 font-normal text-muted-foreground shrink-0 uppercase tracking-wider"
                >
                  {activity.entityType}
                </Badge>
              )}

              {/* Source Pill */}
              {sourceChannel && (
                <span className="text-[10px] text-muted-foreground/80 font-mono px-1.5 py-0.5 rounded bg-muted/60 shrink-0">
                  {sourceChannel}
                </span>
              )}
            </div>

            {/* Subtitle / Context Snippet */}
            {subtitle && (
              <p className="text-xs text-muted-foreground line-clamp-1 break-all">
                {subtitle}
              </p>
            )}

            {/* Quick Property Highlight Badges */}
            {highlights.length > 0 && (
              <div className="flex items-center gap-1.5 pt-0.5 flex-wrap">
                {highlights.map((h, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-md font-medium bg-muted/70 text-foreground/90 border border-border/60"
                  >
                    <span className="text-muted-foreground">{h.label}:</span>
                    <span className="font-semibold">{h.value}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Timestamp & Expand Button */}
        <div className="flex items-center gap-2 shrink-0 ml-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="text-right flex items-center gap-1 text-muted-foreground text-xs font-medium cursor-help">
                  <Clock className="h-3 w-3 opacity-60" />
                  <span className="hidden sm:inline">{relativeTime}</span>
                  <span className="sm:hidden">{shortDate}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-xs font-medium">{exactDate}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-lg text-muted-foreground group-hover:text-foreground group-hover:bg-muted/80 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* ── Expanded Details Panel ── */}
      {isExpanded && (
        <div className="border-t border-border/50 bg-muted/15 p-4 sm:p-5 space-y-4 animate-in fade-in-50 duration-200">
          {/* Metadata Specs Grid */}
          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
              <SlidersHorizontal className="h-3 w-3" /> Event Telemetry Metadata
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {/* Event Type */}
              <div className="p-2.5 rounded-lg bg-card border border-border/60 flex flex-col justify-between">
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  Event Type
                </span>
                <div className="flex items-center justify-between gap-1 mt-1">
                  <span className="text-xs font-mono font-bold truncate text-foreground">
                    {activity.eventType}
                  </span>
                  <CopyButton text={activity.eventType} label="Type" />
                </div>
              </div>

              {/* Entity Target */}
              <div className="p-2.5 rounded-lg bg-card border border-border/60 flex flex-col justify-between">
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  Entity ID ({activity.entityType || "Generic"})
                </span>
                <div className="flex items-center justify-between gap-1 mt-1">
                  <span className="text-xs font-mono truncate text-foreground" title={activity.entityId}>
                    {activity.entityId || "N/A"}
                  </span>
                  {activity.entityId && (
                    <CopyButton text={activity.entityId} label="ID" />
                  )}
                </div>
              </div>

              {/* Timestamp */}
              <div className="p-2.5 rounded-lg bg-card border border-border/60 flex flex-col justify-between">
                <span className="text-[10px] font-medium text-muted-foreground uppercase">
                  Event Timestamp
                </span>
                <div className="mt-1">
                  <span className="text-xs font-medium text-foreground block truncate">
                    {exactDate}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {relativeTime}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Web / Page Context (If Available) */}
          {(pageUrl || pageTitle) && (
            <div className="p-3 rounded-lg bg-card border border-border/60 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                <Globe className="h-3 w-3 text-cyan-500" /> Page & Navigation Context
              </span>
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="min-w-0 flex-1">
                  {pageTitle && (
                    <p className="text-xs font-semibold text-foreground truncate">
                      {pageTitle}
                    </p>
                  )}
                  {pageUrl && (
                    <p className="text-[11px] font-mono text-muted-foreground truncate">
                      {pageUrl}
                    </p>
                  )}
                </div>
                {pageUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-[11px] gap-1 shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(pageUrl, "_blank", "noopener,noreferrer");
                    }}
                  >
                    <ExternalLink className="h-3 w-3" />
                    Visit Page
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Key Attributes List (If Extra Props exist) */}
          {extraProps.length > 0 && (
            <div className="space-y-2">
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <FileText className="h-3 w-3" /> Event Properties ({extraProps.length})
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {extraProps.map(([key, val]) => {
                  const displayVal =
                    typeof val === "object" && val !== null
                      ? JSON.stringify(val)
                      : String(val);

                  return (
                    <div
                      key={key}
                      className="p-2.5 rounded-lg bg-card/80 border border-border/50 text-xs"
                    >
                      <span className="text-[10px] font-semibold text-muted-foreground block truncate">
                        {key}
                      </span>
                      <span
                        className="font-medium text-foreground block truncate mt-0.5"
                        title={displayVal}
                      >
                        {displayVal}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Raw JSON Telemetry Payload Inspector */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Code2 className="h-3 w-3 text-primary" /> Raw Telemetry Payload (JSON)
              </span>
              <CopyButton
                text={JSON.stringify(activity, null, 2)}
                label="Copy JSON"
              />
            </div>
            <pre className="p-3 rounded-lg bg-slate-950 text-slate-100 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-52 border border-slate-800 shadow-inner">
              {JSON.stringify(activity.properties || {}, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Activity Stream Card ───────────────────────────────────────────── */

export function MemberActivityStream({
  activities = [],
  className,
}: MemberActivityStreamProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>("ALL");
  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());

  // Compute counts per category
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

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      // Category filter
      if (selectedCategory !== "ALL") {
        const cat = getEventCategory(act.eventType, act.entityType);
        if (cat !== selectedCategory) return false;
      }

      // Search query filter
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

  // Toggle individual item
  const toggleItem = (index: number) => {
    setExpandedIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  // Expand / Collapse All
  const isAllExpanded =
    filteredActivities.length > 0 &&
    filteredActivities.every((_, i) => expandedIndices.has(i));

  const toggleExpandAll = () => {
    if (isAllExpanded) {
      setExpandedIndices(new Set());
    } else {
      setExpandedIndices(new Set(filteredActivities.map((_, i) => i)));
    }
  };

  return (
    <Card className={cn("overflow-hidden border border-border/60 shadow-sm", className)}>
      {/* ── Card Header ── */}
      <CardHeader className="p-4 sm:p-5 border-b border-border/40 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-base font-bold">Activity Stream</CardTitle>
                <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5">
                  {activities.length} total events
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                Real-time behavioral telemetry, event properties & interaction history
              </CardDescription>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            {filteredActivities.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-medium gap-1.5"
                onClick={toggleExpandAll}
              >
                {isAllExpanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" /> Collapse All
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" /> Expand All
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* ── Search & Filter Controls ── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 pt-1">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search event type, IDs, URLs, attributes..."
              className="pl-8 pr-8 h-8 text-xs bg-muted/30 focus:bg-background"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
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
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all whitespace-nowrap border shrink-0",
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary shadow-xs font-semibold"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/60",
                  )}
                >
                  <CatIcon className="h-3 w-3" />
                  <span>{cat === "ALL" ? "All" : cfg.label}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1 py-0 rounded-full font-mono",
                      isSelected
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-muted-foreground/10 text-muted-foreground",
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

      {/* ── Card Content: Event Stream ── */}
      <CardContent className="p-4 sm:p-5">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
            <div className="p-3 rounded-full bg-muted/50 mb-2.5">
              <Activity className="h-6 w-6 opacity-40" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Activity Events Logged</p>
            <p className="text-xs text-muted-foreground max-w-sm mt-1">
              There are no behavioral telemetry events recorded for this member in ClickHouse yet.
            </p>
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <div className="p-3 rounded-full bg-muted/50 mb-2.5">
              <Search className="h-5 w-5 opacity-40" />
            </div>
            <p className="text-sm font-semibold text-foreground">No Matching Events</p>
            <p className="text-xs text-muted-foreground mt-1">
              No events found matching your search query and filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3 text-xs"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("ALL");
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-1">
            {filteredActivities.map((act, idx) => (
              <ActivityEventItem
                key={`${act.eventType}-${act.timestamp}-${idx}`}
                activity={act}
                isExpanded={expandedIndices.has(idx)}
                onToggle={() => toggleItem(idx)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

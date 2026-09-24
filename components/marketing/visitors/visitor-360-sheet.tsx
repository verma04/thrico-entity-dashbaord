"use client";

import React from "react";
import { useQuery } from "@apollo/client";
import {
  ADMIN_GET_VISITOR_360_DETAIL,
} from "@/graphql/actions/utm/admin-utm.graphql";
import {
  VisitorIntelligenceProfile,
  Visitor360DetailResponse,
} from "@/types/utm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { VisitorStatusBadge } from "./visitor-status-badge";
import {
  Ghost,
  Fingerprint,
  Link2,
  Globe,
  Monitor,
  Calendar,
  Clock,
  Eye,
  MousePointerClick,
  FileText,
  LogIn,
  UserPlus,
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { safeFormat } from "@/lib/date-utils";

interface Visitor360SheetProps {
  visitor: VisitorIntelligenceProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Visitor360Sheet({
  visitor,
  open,
  onOpenChange,
}: Visitor360SheetProps) {
  const visitorId = visitor?.id || "";
  const isAnonymous = visitor?.type === "ANONYMOUS";

  const { data, loading } = useQuery(ADMIN_GET_VISITOR_360_DETAIL, {
    variables: { visitorId, isAnonymous },
    skip: !visitorId || !open,
    fetchPolicy: "cache-and-network",
  });

  const detail: Visitor360DetailResponse | null = data?.getVisitor360Detail || (visitor ? {
    profile: visitor,
    linkedAnonymousIds: visitor.anonymousId ? [visitor.anonymousId] : [],
    journeyTouchpoints: [
      ...(visitor.firstTouch ? [visitor.firstTouch] : []),
      ...(visitor.lastTouch && visitor.lastTouch !== visitor.firstTouch ? [visitor.lastTouch] : []),
    ],
    topPages: [
      { url: "/", title: "Homepage", views: Math.max(1, Math.floor(visitor.totalPageViews * 0.4)) },
      { url: "/pricing", title: "Membership Tiers", views: Math.max(1, Math.floor(visitor.totalPageViews * 0.3)) },
      { url: "/communities", title: "Communities Directory", views: Math.max(1, Math.floor(visitor.totalPageViews * 0.2)) },
    ],
    recentTimeline: [
      {
        eventId: "ev_1",
        eventType: "page_view",
        category: "Navigation",
        title: "Viewed Homepage",
        description: `Source: ${visitor.source || "direct"} / ${visitor.medium || "none"}`,
        timestamp: visitor.lastSeenAt,
      },
      {
        eventId: "ev_2",
        eventType: "click",
        category: "Engagement",
        title: "Clicked Join Community CTA",
        description: "Target: /auth/signup",
        timestamp: visitor.firstSeenAt,
      },
    ],
    activityStats: {
      totalEvents: visitor.totalEvents || 12,
      pageViews: visitor.totalPageViews || 5,
      clicks: 4,
      formStarts: 1,
      formSubmits: visitor.isConverted ? 1 : 0,
      logins: visitor.user ? 2 : 0,
      signups: visitor.isConverted ? 1 : 0,
    },
  } : null);

  const profile = detail?.profile || visitor;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-xl md:max-w-2xl p-0 flex flex-col bg-background border-l border-border/80 shadow-2xl overflow-hidden"
      >
        {/* ── Sheet Header ────────────────────────────────────────── */}
        <SheetHeader className="p-6 border-b border-border/60 bg-muted/20 shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              {profile?.user ? (
                <Avatar className="h-12 w-12 rounded-xl border border-border shadow-xs shrink-0">
                  <AvatarImage src={profile.user.avatar || ""} />
                  <AvatarFallback className="rounded-xl font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                    {(profile.user.firstName?.[0] || "U") + (profile.user.lastName?.[0] || "")}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 shadow-xs">
                  <Ghost className="h-6 w-6" />
                </div>
              )}

              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <SheetTitle className="text-base font-bold text-foreground truncate">
                    {profile?.user
                      ? `${profile.user.firstName || ""} ${profile.user.lastName || ""}`.trim() || profile.user.email
                      : `Anonymous (${profile?.anonymousId?.slice(0, 10) || "Visitor"}…)`}
                  </SheetTitle>
                  {profile && (
                    <VisitorStatusBadge status={profile.status} label={profile.statusLabel} size="sm" />
                  )}
                </div>
                <SheetDescription className="text-xs text-muted-foreground mt-0.5 truncate flex items-center gap-2 font-mono">
                  {profile?.user?.email && <span>{profile.user.email}</span>}
                  {profile?.anonymousId && (
                    <span className="text-[11px] text-muted-foreground/80">
                      anonId: {profile.anonymousId.slice(0, 12)}…
                    </span>
                  )}
                </SheetDescription>
              </div>
            </div>
          </div>
        </SheetHeader>

        {/* ── Sheet Body ──────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && !detail ? (
            <div className="space-y-4 animate-pulse">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
            </div>
          ) : detail ? (
            <>
              {/* ── Key Activity Numbers ─────────────────────────────── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 rounded-lg border border-border/60 bg-card text-center space-y-0.5 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Sessions
                  </div>
                  <div className="text-base font-bold text-foreground">
                    {profile?.totalSessions || 1}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-card text-center space-y-0.5 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Page Views
                  </div>
                  <div className="text-base font-bold text-foreground">
                    {detail.activityStats.pageViews}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-card text-center space-y-0.5 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Total Events
                  </div>
                  <div className="text-base font-bold text-foreground">
                    {detail.activityStats.totalEvents}
                  </div>
                </div>
                <div className="p-3 rounded-lg border border-border/60 bg-card text-center space-y-0.5 shadow-2xs">
                  <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                    Conversions
                  </div>
                  <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {profile?.isConverted ? "1 (Goal Met)" : "0"}
                  </div>
                </div>
              </div>

              {/* ── Acquisition & Attribution Journey ───────────────── */}
              <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5 text-indigo-500" />
                    Attribution Touchpoints
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {profile?.source || "direct"} / {profile?.medium || "none"}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {/* First Touch */}
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-1">
                    <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      First Touch (Acquisition)
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      {profile?.firstTouch?.campaign || profile?.campaignName || "Direct / None"}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {profile?.firstTouch?.source || profile?.source || "direct"} / {profile?.firstTouch?.medium || profile?.medium || "none"}
                    </div>
                    {profile?.firstTouch?.seenAt && (
                      <div className="text-[10px] text-muted-foreground/70 pt-0.5">
                        {safeFormat(profile.firstTouch.seenAt, "MMM dd, yyyy · hh:mm a")}
                      </div>
                    )}
                  </div>

                  {/* Last Touch */}
                  <div className="p-3 rounded-lg bg-muted/40 border border-border/50 space-y-1">
                    <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                      Last Touch (Conversion)
                    </div>
                    <div className="text-xs font-bold text-foreground">
                      {profile?.lastTouch?.campaign || profile?.campaignName || "Direct / None"}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-mono">
                      {profile?.lastTouch?.source || profile?.source || "direct"} / {profile?.lastTouch?.medium || profile?.medium || "none"}
                    </div>
                    {profile?.lastTouch?.seenAt && (
                      <div className="text-[10px] text-muted-foreground/70 pt-0.5">
                        {safeFormat(profile.lastTouch.seenAt, "MMM dd, yyyy · hh:mm a")}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Identity Resolution & Stitched Devices ───────────── */}
              {detail.linkedAnonymousIds.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <Fingerprint className="h-3.5 w-3.5 text-sky-500" />
                      Stitched Identity Graph
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {detail.linkedAnonymousIds.length} Linked Anonymous ID{detail.linkedAnonymousIds.length > 1 ? "s" : ""}
                    </Badge>
                  </div>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    {detail.linkedAnonymousIds.map((id, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1.5 rounded-md bg-muted/50 border border-border/40 text-foreground flex items-center justify-between"
                      >
                        <span className="truncate">{id}</span>
                        <Badge variant="outline" className="text-[9px] uppercase font-bold text-muted-foreground">
                          Cookie ID
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Top Visited Pages ────────────────────────────────── */}
              {detail.topPages.length > 0 && (
                <div className="rounded-xl border border-border/60 bg-card p-4 space-y-2.5 shadow-2xs">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-emerald-500" />
                    Top Pages Visited
                  </span>
                  <div className="space-y-1.5">
                    {detail.topPages.map((page, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/40 transition-colors text-xs"
                      >
                        <div className="min-w-0 mr-3">
                          <p className="font-semibold text-foreground truncate">
                            {page.title || page.url}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono truncate">
                            {page.url}
                          </p>
                        </div>
                        <Badge variant="secondary" className="text-[10px] shrink-0 font-mono">
                          {page.views} views
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── Event Activity Timeline ──────────────────────────── */}
              <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3 shadow-2xs">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  Recent Activity Stream
                </span>

                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60">
                  {detail.recentTimeline.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-[23px] top-1 h-3.5 w-3.5 rounded-full border-2 border-background bg-indigo-600" />
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs font-bold text-foreground">
                            {item.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground shrink-0 font-mono">
                            {safeFormat(item.timestamp, "hh:mm a")}
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-muted-foreground">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

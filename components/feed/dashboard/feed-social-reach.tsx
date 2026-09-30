"use client";

import React, { useState, useMemo } from "react";
import {
  Share2,
  TrendingUp,
  Heart,
  MessageCircle,
  Eye,
  RefreshCw,
  ExternalLink,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Radio,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetAdminSocialAnalytics,
  useGetAdminSocialPublications,
  useSyncSocialPublicationMetrics,
  useSyncAllSocialPublicationsMetrics,
  AdminSocialPlatform,
  AdminSocialPublication,
} from "@/graphql/actions/social";
import {
  Linkedin,
  Facebook,
  Instagram,
} from "@/components/ui/brand-icons";

const PLATFORM_CONFIG: Record<
  string,
  {
    name: string;
    icon: React.ComponentType<{ className?: string; size?: number | string }>;
    color: string;
    badgeBg: string;
    border: string;
    lightBg: string;
  }
> = {
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-[#0A66C2]",
    badgeBg: "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20",
    border: "border-[#0A66C2]/20",
    lightBg: "bg-[#0A66C2]/5",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "text-[#1877F2]",
    badgeBg: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20",
    border: "border-[#1877F2]/20",
    lightBg: "bg-[#1877F2]/5",
  },
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "text-[#E4405F]",
    badgeBg: "bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]/20",
    border: "border-[#E4405F]/20",
    lightBg: "bg-[#E4405F]/5",
  },
};

export function FeedSocialReach() {
  const [selectedPlatform, setSelectedPlatform] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Queries
  const {
    data: analyticsData,
    loading: loadingAnalytics,
    refetch: refetchAnalytics,
  } = useGetAdminSocialAnalytics();

  const {
    data: publicationsData,
    loading: loadingPubs,
    refetch: refetchPubs,
  } = useGetAdminSocialPublications({
    input: {
      platform:
        selectedPlatform !== "ALL"
          ? (selectedPlatform as AdminSocialPlatform)
          : undefined,
      limit: 50,
    },
  });

  // Mutations
  const [syncSingle] = useSyncSocialPublicationMetrics();
  const [syncAll, { loading: isSyncingAll }] = useSyncAllSocialPublicationsMetrics();

  const analytics = analyticsData?.getAdminSocialAnalytics;
  const rawPublications: AdminSocialPublication[] =
    publicationsData?.getAdminSocialPublications?.publications || [];

  // Filter out any Twitter/X publications from view
  const publications = useMemo(() => {
    return rawPublications.filter((p) => {
      const plat = (p.platform || "").toLowerCase();
      if (plat.includes("twitter") || plat === "x") return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const title = (p.postTitle || "").toLowerCase();
      const author = (p.authorName || "").toLowerCase();
      const acc = (p.accountName || "").toLowerCase();
      return title.includes(q) || author.includes(q) || acc.includes(q);
    });
  }, [rawPublications, searchQuery]);

  // Filter platform breakdown to exclude Twitter/X
  const platformBreakdown = useMemo(() => {
    const list = analytics?.platformBreakdown || [];
    return list.filter((p) => {
      const plat = (p.platform || "").toLowerCase();
      return !plat.includes("twitter") && plat !== "x";
    });
  }, [analytics]);

  const handleSyncAll = async () => {
    try {
      const res = await syncAll({ variables: { limit: 25 } });
      if (res.data?.syncAllSocialPublicationsMetrics?.success) {
        toast.success(
          `Batch sync completed! Refreshed ${res.data.syncAllSocialPublicationsMetrics.syncedCount ?? 0} publications.`
        );
        await Promise.all([refetchAnalytics(), refetchPubs()]);
      } else {
        toast.error("Failed to sync social metrics");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to trigger batch sync");
    }
  };

  const handleSyncSingle = async (pub: AdminSocialPublication) => {
    setSyncingId(pub.id);
    const platformName =
      PLATFORM_CONFIG[pub.platform?.toLowerCase()]?.name || pub.platform;
    try {
      const res = await syncSingle({ variables: { publicationId: pub.id } });
      if (res.data?.syncSocialPublicationMetrics?.success) {
        const updated = res.data.syncSocialPublicationMetrics.publication;
        await Promise.all([refetchAnalytics(), refetchPubs()]);
        toast.success(
          `Synced ${platformName}: ${updated?.likeCount ?? 0} likes, ${
            updated?.commentCount ?? 0
          } comments, ${updated?.impressionCount ?? 0} views`
        );
      } else {
        toast.error(`Unable to sync ${platformName} metrics`);
      }
    } catch (err: any) {
      toast.error(err.message || `Failed to sync ${platformName}`);
    } finally {
      setSyncingId(null);
    }
  };

  const totalImpressions = analytics?.totalImpressions || 0;
  const totalLikes = analytics?.totalLikes || 0;
  const totalComments = analytics?.totalComments || 0;
  const totalShares = analytics?.totalShares || 0;
  const avgEngagementRate = analytics?.avgEngagementRate || 0;
  const totalPublications = publications.length;

  return (
    <div className="space-y-6">
      {/* ── Section Header ───────────────────────────────────────────── */}
      <Card className="bg-card border-border/70 rounded-2xl shadow-xs overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Radio className="h-4 w-4 animate-pulse" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Cross-Platform Social Reach & Publications
                </h3>
              </div>
              <p className="text-xs text-muted-foreground max-w-2xl">
                Real-time engagement, reactions, comments, and impressions tracked directly from linked LinkedIn, Instagram, and Facebook entity channels.
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSyncAll}
                disabled={isSyncingAll}
                className="h-9 px-3 text-xs gap-2 rounded-xl font-medium shadow-xs hover:bg-muted"
                title="Refresh metrics for all active publications"
              >
                <RefreshCw
                  className={cn("h-3.5 w-3.5", isSyncingAll && "animate-spin text-primary")}
                />
                <span>{isSyncingAll ? "Syncing APIs..." : "Sync All Channels"}</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Top Aggregate KPI Cards ──────────────────────────────────── */}
      {loadingAnalytics && !analytics ? (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Total Impressions / Views */}
          <Card className="bg-card border-border/70 rounded-xl p-3.5 shadow-xs hover:border-border transition-colors">
            <CardContent className="p-0 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Total Impressions
                </span>
                <div className="h-6 w-6 rounded-md bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                  <Eye className="h-3.5 w-3.5" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-foreground">
                  {totalImpressions.toLocaleString()}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Cross-platform views
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Total Likes / Reactions */}
          <Card className="bg-card border-border/70 rounded-xl p-3.5 shadow-xs hover:border-border transition-colors">
            <CardContent className="p-0 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Reactions & Likes
                </span>
                <div className="h-6 w-6 rounded-md bg-rose-500/10 text-rose-500 flex items-center justify-center">
                  <Heart className="h-3.5 w-3.5" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-foreground">
                  {totalLikes.toLocaleString()}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Audience reactions
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Comments & Discussions */}
          <Card className="bg-card border-border/70 rounded-xl p-3.5 shadow-xs hover:border-border transition-colors">
            <CardContent className="p-0 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Comments & Replies
                </span>
                <div className="h-6 w-6 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center">
                  <MessageCircle className="h-3.5 w-3.5" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-foreground">
                  {totalComments.toLocaleString()}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Discussions sparked
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Shares / Reposts */}
          <Card className="bg-card border-border/70 rounded-xl p-3.5 shadow-xs hover:border-border transition-colors">
            <CardContent className="p-0 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Shares & Reposts
                </span>
                <div className="h-6 w-6 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                  <Share2 className="h-3.5 w-3.5" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-foreground">
                  {totalShares.toLocaleString()}
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Amplify reshares
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Rate */}
          <Card className="bg-card border-border/70 rounded-xl p-3.5 shadow-xs hover:border-border transition-colors col-span-2 sm:col-span-1">
            <CardContent className="p-0 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-muted-foreground">
                  Avg Engagement Rate
                </span>
                <div className="h-6 w-6 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <TrendingUp className="h-3.5 w-3.5" />
                </div>
              </div>
              <div>
                <p className="text-xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                  {avgEngagementRate}%
                </p>
                <span className="text-[10px] text-muted-foreground">
                  Interactions / views
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Platform Channel Performance Breakdown ───────────────────── */}
      {platformBreakdown.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {platformBreakdown.map((item) => {
            const platKey = item.platform.toLowerCase();
            const cfg = PLATFORM_CONFIG[platKey] || {
              name: item.platform,
              icon: Share2,
              color: "text-indigo-500",
              badgeBg: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
              border: "border-indigo-500/20",
              lightBg: "bg-indigo-500/5",
            };
            const Icon = cfg.icon;
            const isSelected = selectedPlatform === item.platform.toUpperCase();

            return (
              <Card
                key={item.platform}
                onClick={() =>
                  setSelectedPlatform(
                    isSelected ? "ALL" : item.platform.toUpperCase()
                  )
                }
                className={cn(
                  "cursor-pointer transition-all rounded-xl p-4 border bg-card hover:bg-muted/30 shadow-xs",
                  isSelected
                    ? "border-primary ring-1 ring-primary/20"
                    : "border-border/70"
                )}
              >
                <CardContent className="p-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs px-2.5 py-0.5 flex items-center gap-1.5 rounded-lg font-medium",
                        cfg.badgeBg
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{cfg.name}</span>
                    </Badge>

                    <span className="text-xs font-semibold text-muted-foreground">
                      {item.publicationsCount} post{item.publicationsCount === 1 ? "" : "s"}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-1 pt-1 border-t border-border/40 text-center">
                    <div>
                      <span className="text-[10px] text-muted-foreground block">
                        Likes
                      </span>
                      <p className="text-xs font-bold text-foreground">
                        {item.likes.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">
                        Comments
                      </span>
                      <p className="text-xs font-bold text-foreground">
                        {item.comments.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground block">
                        Views
                      </span>
                      <p className="text-xs font-bold text-foreground">
                        {item.impressions.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── Publications Table Section ──────────────────────────────── */}
      <Card className="bg-card border-border/70 rounded-2xl shadow-xs overflow-hidden">
        <CardHeader className="p-5 border-b border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm sm:text-base font-bold text-foreground">
                External Broadcasts & Real-Time Sync
              </CardTitle>
              <CardDescription className="text-xs">
                {totalPublications} publication{totalPublications === 1 ? "" : "s"} tracked across LinkedIn, Instagram, and Facebook
              </CardDescription>
            </div>

            {/* Filter Tabs & Search */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Platform selector pills */}
              <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/50 text-xs">
                {["ALL", "LINKEDIN", "INSTAGRAM", "FACEBOOK"].map((plat) => {
                  const isActive = selectedPlatform === plat;
                  const label =
                    plat === "ALL"
                      ? "All Channels"
                      : PLATFORM_CONFIG[plat.toLowerCase()]?.name || plat;
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => setSelectedPlatform(plat)}
                      className={cn(
                        "px-2.5 py-1 rounded-lg text-xs font-semibold transition-all",
                        isActive
                          ? "bg-background text-foreground shadow-xs"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* Search input */}
              <div className="relative w-44 sm:w-52">
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filter posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8 pl-8 text-xs rounded-xl"
                />
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loadingPubs && !publications.length ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl" />
              ))}
            </div>
          ) : publications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center space-y-3">
              <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                <Radio className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">
                  No social publications found
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm">
                  {searchQuery
                    ? `No publications match "${searchQuery}".`
                    : "When feed posts are broadcasted to linked LinkedIn, Instagram, or Facebook channels, their live engagement and impressions will appear here."}
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-border/50 text-xs">
                    <TableHead className="min-w-[240px]">Post & Channel</TableHead>
                    <TableHead className="text-center">Likes</TableHead>
                    <TableHead className="text-center">Comments</TableHead>
                    <TableHead className="text-center">Shares</TableHead>
                    <TableHead className="text-center">Views</TableHead>
                    <TableHead className="text-center">Rate</TableHead>
                    <TableHead>Status & Sync</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {publications.map((pub) => {
                    const platKey = pub.platform?.toLowerCase() || "";
                    const cfg = PLATFORM_CONFIG[platKey] || {
                      name: pub.platform,
                      icon: Share2,
                      color: "text-indigo-500",
                      badgeBg: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
                    };
                    const PlatformIcon = cfg.icon;
                    const isSyncing = syncingId === pub.id;

                    return (
                      <TableRow key={pub.id} className="text-xs hover:bg-muted/30">
                        {/* Post & Channel */}
                        <TableCell className="max-w-[280px]">
                          <div className="font-semibold text-foreground truncate">
                            {pub.postTitle || "Post Broadcast"}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[10px] px-2 py-0.5 flex items-center gap-1 rounded-md font-medium",
                                cfg.badgeBg
                              )}
                            >
                              <PlatformIcon className="h-3 w-3" />
                              <span>{cfg.name}</span>
                            </Badge>
                            {pub.accountName && (
                              <span className="text-[11px] text-muted-foreground truncate">
                                by {pub.accountName}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Likes */}
                        <TableCell className="text-center font-bold">
                          {pub.likeCount.toLocaleString()}
                        </TableCell>

                        {/* Comments */}
                        <TableCell className="text-center font-bold">
                          {pub.commentCount.toLocaleString()}
                        </TableCell>

                        {/* Shares */}
                        <TableCell className="text-center font-bold">
                          {pub.shareCount.toLocaleString()}
                        </TableCell>

                        {/* Impressions */}
                        <TableCell className="text-center font-bold">
                          {pub.impressionCount.toLocaleString()}
                        </TableCell>

                        {/* Engagement Rate */}
                        <TableCell className="text-center">
                          <span className="inline-flex items-center gap-1 font-semibold text-indigo-600 dark:text-indigo-400">
                            {pub.engagementRate}%
                          </span>
                        </TableCell>

                        {/* Status & Sync Time */}
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" />
                              {pub.status}
                            </span>
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />
                              {pub.lastSyncedAt
                                ? `Synced ${new Date(pub.lastSyncedAt).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}`
                                : "Not synced"}
                            </span>
                          </div>
                        </TableCell>

                        {/* Actions: View Live Post & Sync */}
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {pub.permalink && (
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                              >
                                <a
                                  href={pub.permalink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open live post"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                </a>
                              </Button>
                            )}

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSyncSingle(pub)}
                              disabled={isSyncing}
                              className="h-8 px-2.5 text-xs gap-1.5 rounded-lg border-border hover:bg-muted font-medium"
                              title="Sync live metrics from platform API"
                            >
                              <RefreshCw
                                className={cn(
                                  "h-3 w-3",
                                  isSyncing && "animate-spin text-primary"
                                )}
                              />
                              <span className="hidden sm:inline">
                                {isSyncing ? "Syncing..." : "Sync"}
                              </span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default FeedSocialReach;

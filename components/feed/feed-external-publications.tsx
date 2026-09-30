"use client";

import React, { useState } from "react";
import {
  ExternalLink,
  RefreshCw,
  TrendingUp,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useGetAdminFeedSocialPublications,
  useSyncSocialPublicationMetrics,
  AdminSocialPublication,
} from "@/graphql/actions/social";
import {
  Linkedin,
  Facebook,
  Instagram,
} from "@/components/ui/brand-icons";

interface FeedExternalPublicationsProps {
  feedId: string;
  className?: string;
}

const PLATFORM_CONFIG: Record<
  string,
  {
    name: string;
    icon: React.ComponentType<{ className?: string; size?: number | string }>;
    color: string;
    badgeBg: string;
    accentBorder: string;
  }
> = {
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-[#0A66C2]",
    badgeBg: "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20",
    accentBorder: "hover:border-[#0A66C2]/40",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "text-[#1877F2]",
    badgeBg: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20",
    accentBorder: "hover:border-[#1877F2]/40",
  },
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "text-[#E4405F]",
    badgeBg: "bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]/20",
    accentBorder: "hover:border-[#E4405F]/40",
  },
};

export function FeedExternalPublications({
  feedId,
  className,
}: FeedExternalPublicationsProps) {
  const { data, loading, error, refetch } = useGetAdminFeedSocialPublications(
    feedId,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [syncSocialMetrics] = useSyncSocialPublicationMetrics();
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const publications: AdminSocialPublication[] =
    data?.getAdminFeedSocialPublications || [];

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Broadcast publications updated");
    } catch {
      toast.error("Failed to refresh publications");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSyncPublication = async (pub: AdminSocialPublication) => {
    setSyncingId(pub.id);
    const platformName =
      PLATFORM_CONFIG[pub.platform?.toLowerCase()]?.name || pub.platform;

    try {
      const res = await syncSocialMetrics({
        variables: { publicationId: pub.id },
      });

      if (res.data?.syncSocialPublicationMetrics?.success) {
        const updated = res.data.syncSocialPublicationMetrics.publication;
        await refetch();
        toast.success(
          `Synced ${platformName} metrics: ${updated?.likeCount ?? 0} likes, ${
            updated?.commentCount ?? 0
          } comments, ${updated?.impressionCount ?? 0} impressions`
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

  if (loading && !publications.length) {
    return (
      <div className={cn("space-y-4", className)}>
        <Skeleton className="h-20 rounded-xl" />
        <Skeleton className="h-36 rounded-xl" />
      </div>
    );
  }

  if (error && !publications.length) {
    return (
      <div
        className={cn(
          "p-6 text-center border border-dashed border-border/60 rounded-xl bg-muted/10 space-y-2",
          className
        )}
      >
        <AlertCircle className="h-6 w-6 text-muted-foreground mx-auto" />
        <p className="text-xs font-semibold text-foreground">
          Could not load external publications
        </p>
        <p className="text-[11px] text-muted-foreground">{error.message}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleManualRefresh}
          className="h-7 text-xs mt-2"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header Bar */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Radio className="h-3.5 w-3.5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground flex items-center gap-2">
              Cross-Platform Social Broadcasts
              {publications.length > 0 && (
                <Badge
                  variant="outline"
                  className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 text-[10px] px-1.5 py-0 h-4 font-mono font-semibold"
                >
                  {publications.length} {publications.length === 1 ? "Channel" : "Channels"}
                </Badge>
              )}
            </h4>
            <p className="text-[11px] text-muted-foreground">
              Live engagement & impressions tracked directly from social APIs
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className="h-7 px-2 text-xs rounded-lg gap-1 text-muted-foreground hover:text-foreground"
          title="Refresh publications"
        >
          <RefreshCw
            className={cn("h-3 w-3", isRefreshing && "animate-spin")}
          />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>

      {/* Publications List */}
      {publications.length === 0 ? (
        <Card className="bg-card/50 border border-dashed border-border/80 rounded-xl p-5 shadow-xs">
          <CardContent className="p-0 flex flex-col items-center text-center space-y-3">
            <div className="flex items-center gap-2.5 text-muted-foreground/60">
              <Linkedin className="h-5 w-5" />
              <Instagram className="h-5 w-5" />
              <Facebook className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground">
                No external broadcasts recorded for this post
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5 max-w-sm">
                When this post is broadcast to official LinkedIn, Instagram, or Facebook accounts, its live reactions, comments, impressions, and engagement rates will appear here with on-demand sync.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {publications.map((pub) => {
            const platKey = pub.platform?.toLowerCase() || "";
            const cfg = PLATFORM_CONFIG[platKey] || {
              name: pub.platform,
              icon: Share2,
              color: "text-indigo-500",
              badgeBg: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
              accentBorder: "hover:border-indigo-500/40",
            };
            const PlatformIcon = cfg.icon;
            const isSyncing = syncingId === pub.id;

            return (
              <Card
                key={pub.id}
                className={cn(
                  "bg-card border border-border/70 rounded-xl p-4 shadow-xs transition-all",
                  cfg.accentBorder
                )}
              >
                <CardContent className="p-0 space-y-3">
                  {/* Top Row: Platform badge + Account info + Actions */}
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs px-2.5 py-0.5 flex items-center gap-1.5 rounded-lg font-medium",
                          cfg.badgeBg
                        )}
                      >
                        <PlatformIcon className="h-3.5 w-3.5" />
                        <span>{cfg.name}</span>
                      </Badge>

                      {pub.accountName && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                          <span>via</span>
                          <Avatar className="h-4 w-4 border border-border/60">
                            {pub.accountAvatar && (
                              <AvatarImage
                                src={pub.accountAvatar}
                                alt={pub.accountName}
                              />
                            )}
                            <AvatarFallback className="text-[8px]">
                              {pub.accountName[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium text-foreground truncate max-w-[120px] sm:max-w-[160px]">
                            {pub.accountName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Sync & External Link Actions */}
                    <div className="flex items-center gap-1.5">
                      {pub.permalink && (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
                        >
                          <a
                            href={pub.permalink}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Open post on platform"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span className="hidden sm:inline">View Post</span>
                          </a>
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSyncPublication(pub)}
                        disabled={isSyncing}
                        className="h-7 px-2.5 text-xs gap-1.5 rounded-lg border-border hover:bg-muted font-medium"
                        title="Sync live metrics from platform API"
                      >
                        <RefreshCw
                          className={cn(
                            "h-3 w-3",
                            isSyncing && "animate-spin text-primary"
                          )}
                        />
                        <span>{isSyncing ? "Syncing..." : "Sync Live"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-border/50">
                    {/* Reactions / Likes */}
                    <div className="p-2 rounded-lg bg-muted/30 border border-border/40 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-medium block">
                          Likes
                        </span>
                        <p className="text-sm font-bold text-foreground tracking-tight">
                          {pub.likeCount.toLocaleString()}
                        </p>
                      </div>
                      <div className="h-6 w-6 rounded-md bg-rose-500/10 text-rose-500 flex items-center justify-center">
                        <Heart className="h-3 w-3" />
                      </div>
                    </div>

                    {/* Comments */}
                    <div className="p-2 rounded-lg bg-muted/30 border border-border/40 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-medium block">
                          Comments
                        </span>
                        <p className="text-sm font-bold text-foreground tracking-tight">
                          {pub.commentCount.toLocaleString()}
                        </p>
                      </div>
                      <div className="h-6 w-6 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center">
                        <MessageCircle className="h-3 w-3" />
                      </div>
                    </div>

                    {/* Shares / Reposts */}
                    <div className="p-2 rounded-lg bg-muted/30 border border-border/40 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-medium block">
                          Shares
                        </span>
                        <p className="text-sm font-bold text-foreground tracking-tight">
                          {pub.shareCount.toLocaleString()}
                        </p>
                      </div>
                      <div className="h-6 w-6 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Share2 className="h-3 w-3" />
                      </div>
                    </div>

                    {/* Impressions / Views */}
                    <div className="p-2 rounded-lg bg-muted/30 border border-border/40 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-muted-foreground font-medium block">
                          Impressions
                        </span>
                        <p className="text-sm font-bold text-foreground tracking-tight">
                          {pub.impressionCount.toLocaleString()}
                        </p>
                      </div>
                      <div className="h-6 w-6 rounded-md bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Eye className="h-3 w-3" />
                      </div>
                    </div>
                  </div>

                  {/* Footer status line: Engagement rate + Last synced */}
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-medium text-foreground">
                        <TrendingUp className="h-3 w-3 text-indigo-500" />
                        Engagement Rate:{" "}
                        <strong className="text-indigo-600 dark:text-indigo-400">
                          {pub.engagementRate}%
                        </strong>
                      </span>
                      {pub.reachCount > 0 && (
                        <span className="hidden sm:inline text-muted-foreground/70">
                          • Reach: {pub.reachCount.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 text-[10px]">
                      <Clock className="h-2.5 w-2.5 text-muted-foreground/70" />
                      <span>
                        {pub.lastSyncedAt
                          ? `Synced ${new Date(pub.lastSyncedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}`
                          : "Not synced yet"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FeedExternalPublications;

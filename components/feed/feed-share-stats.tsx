"use client";

import React, { useState } from "react";
import {
  Share2,
  Users,
  ShieldCheck,
  TrendingUp,
  MousePointerClick,
  RefreshCw,
  Copy,
  Check,
  Search,
  ExternalLink,
  Sparkles,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useFeedShareStats,
  FeedSharePlatformStat,
  FeedShareUser,
} from "@/graphql/actions/feed";
import {
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
} from "@/components/ui/brand-icons";
import { WhatsAppIcon } from "@/components/icons/whatsapp-icon";
import { FeedExternalPublications } from "./feed-external-publications";

interface FeedShareStatsViewProps {
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
    barColor: string;
  }
> = {
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-[#0A66C2]",
    badgeBg: "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20",
    barColor: "bg-[#0A66C2]",
  },
  whatsapp: {
    name: "WhatsApp",
    icon: WhatsAppIcon,
    color: "text-[#25D366]",
    badgeBg: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20",
    barColor: "bg-[#25D366]",
  },
  twitter: {
    name: "X / Twitter",
    icon: Twitter,
    color: "text-foreground",
    badgeBg: "bg-foreground/10 text-foreground border-foreground/20",
    barColor: "bg-foreground",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "text-[#1877F2]",
    badgeBg: "bg-[#1877F2]/10 text-[#1877F2] border-[#1877F2]/20",
    barColor: "bg-[#1877F2]",
  },
  instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "text-[#E4405F]",
    badgeBg: "bg-[#E4405F]/10 text-[#E4405F] border-[#E4405F]/20",
    barColor: "bg-[#E4405F]",
  },
  link: {
    name: "Direct Link",
    icon: ExternalLink,
    color: "text-indigo-500",
    badgeBg: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    barColor: "bg-indigo-500",
  },
};

export function FeedShareStatsView({
  feedId,
  className,
}: FeedShareStatsViewProps) {
  const { data, loading, error, refetch } = useFeedShareStats(feedId, {
    fetchPolicy: "network-only",
  });
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState<"broadcasts" | "referrals">("broadcasts");

  const stats = data?.getFeedShareStats;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Share stats refreshed");
    } catch {
      toast.error("Failed to refresh share stats");
    } finally {
      setIsRefreshing(false);
    }
  };

  const copyUserId = (userId: string) => {
    navigator.clipboard.writeText(userId);
    setCopiedId(userId);
    toast.success("User ID copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const sharers: FeedShareUser[] = stats?.recentSharers || [];
  const filteredSharers = sharers.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const name = `${s.firstName || ""} ${s.lastName || ""}`.toLowerCase();
    const uid = (s.userId || "").toLowerCase();
    const plats = (s.platforms || []).join(" ").toLowerCase();
    return name.includes(q) || uid.includes(q) || plats.includes(q);
  });

  const totalClicks = stats?.totalClicks || 0;
  const totalVerified = stats?.totalVerified || 0;
  const totalUniqueSharers = stats?.totalUniqueSharers || 0;
  const conversionRate = stats?.conversionRate || 0;
  const platforms: FeedSharePlatformStat[] = stats?.platformBreakdown || [];

  return (
    <div className={cn("space-y-5", className)}>
      {/* Segmented Pill Switcher */}
      <div className="flex items-center justify-between gap-2 p-1 bg-muted/60 rounded-xl border border-border/50">
        <button
          type="button"
          onClick={() => setActiveSection("broadcasts")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
            activeSection === "broadcasts"
              ? "bg-background text-foreground shadow-xs border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Radio className="h-3.5 w-3.5 text-indigo-500" />
          <span>Social Broadcasts (API)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection("referrals")}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
            activeSection === "referrals"
              ? "bg-background text-foreground shadow-xs border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
          <span>Viral Referral Links</span>
        </button>
      </div>

      {activeSection === "broadcasts" ? (
        <FeedExternalPublications feedId={feedId} />
      ) : loading && !stats ? (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
      ) : error && !stats ? (
        <div className="p-8 text-center space-y-3">
          <div className="h-10 w-10 mx-auto rounded-full bg-destructive/10 text-destructive flex items-center justify-center">
            <Share2 className="h-5 w-5" />
          </div>
          <p className="text-sm font-semibold text-foreground">
            Failed to load share statistics
          </p>
          <p className="text-xs text-muted-foreground">{error.message}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="mt-2"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Retry
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Controls / Subheader */}
          <div className="flex items-center justify-between gap-3 px-1">
            <div>
              <h4 className="text-sm font-semibold text-foreground">
                Viral Distribution & Sharers
              </h4>
              <p className="text-xs text-muted-foreground">
                Real-time track of who shared this post and social platform performance
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="h-8 px-2.5 text-xs rounded-lg gap-1.5"
            >
              <RefreshCw
                className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")}
              />
              <span>Refresh</span>
            </Button>
          </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="bg-card border-border/70 rounded-xl p-3.5 shadow-xs">
          <CardContent className="p-0 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">
                Total Clicks
              </span>
              <div className="h-6 w-6 rounded-md bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <MousePointerClick className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {totalClicks.toLocaleString()}
              </p>
              <span className="text-[10px] text-muted-foreground">
                Share links opened
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/70 rounded-xl p-3.5 shadow-xs">
          <CardContent className="p-0 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">
                Verified Shares
              </span>
              <div className="h-6 w-6 rounded-md bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {totalVerified.toLocaleString()}
              </p>
              <span className="text-[10px] text-muted-foreground">
                Completed shares
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/70 rounded-xl p-3.5 shadow-xs">
          <CardContent className="p-0 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">
                Unique Sharers
              </span>
              <div className="h-6 w-6 rounded-md bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Users className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {totalUniqueSharers.toLocaleString()}
              </p>
              <span className="text-[10px] text-muted-foreground">
                Distinct members
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/70 rounded-xl p-3.5 shadow-xs">
          <CardContent className="p-0 flex flex-col justify-between gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-muted-foreground">
                Conversion Rate
              </span>
              <div className="h-6 w-6 rounded-md bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            <div>
              <p className="text-xl font-bold tracking-tight text-foreground">
                {conversionRate}%
              </p>
              <span className="text-[10px] text-muted-foreground">
                Clicks to shares
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
            Platform Breakdown
          </span>
          <div className="h-px bg-border flex-1" />
        </div>

        {platforms.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-border/60 rounded-xl bg-muted/10">
            <p className="text-xs text-muted-foreground">
              No platform-specific share events recorded yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {platforms.map((p) => {
              const cfg =
                PLATFORM_CONFIG[p.platform.toLowerCase()] ||
                PLATFORM_CONFIG.link;
              const Icon = cfg.icon;
              const sharePercent =
                totalVerified > 0
                  ? Math.round((p.verified / totalVerified) * 100)
                  : totalClicks > 0
                  ? Math.round((p.clicks / totalClicks) * 100)
                  : 0;

              return (
                <Card
                  key={p.platform}
                  className="bg-card border-border/70 rounded-xl p-3.5 shadow-xs hover:border-border transition-colors"
                >
                  <CardContent className="p-0 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "h-7 w-7 rounded-lg flex items-center justify-center",
                            cfg.badgeBg
                          )}
                        >
                          <Icon className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-xs font-semibold text-foreground capitalize">
                          {cfg.name}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] px-1.5 py-0.5", cfg.badgeBg)}
                      >
                        {sharePercent}% of shares
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1 border-t border-border/40 text-center">
                      <div>
                        <p className="text-base font-bold text-foreground">
                          {p.verified}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          Verified
                        </span>
                      </div>
                      <div>
                        <p className="text-base font-bold text-foreground">
                          {p.clicks}
                        </p>
                        <span className="text-[10px] text-muted-foreground">
                          Clicks
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Distribution</span>
                        <span>{sharePercent}%</span>
                      </div>
                      <Progress value={sharePercent} className="h-1.5" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Sharers Directory */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
              Who Has Shared ({sharers.length})
            </span>
            <div className="h-px bg-border flex-1" />
          </div>
          {sharers.length > 3 && (
            <div className="relative w-48 shrink-0">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Filter sharers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs rounded-lg"
              />
            </div>
          )}
        </div>

        {sharers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-border/60 rounded-xl bg-muted/10">
            <div className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center mb-2">
              <Sparkles className="h-4 w-4 text-muted-foreground/60" />
            </div>
            <p className="text-xs font-semibold text-foreground">
              No verified sharers yet
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[280px]">
              When community members share this post to WhatsApp, LinkedIn, or other platforms, they will appear here.
            </p>
          </div>
        ) : filteredSharers.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-border/60 rounded-xl bg-muted/10">
            <p className="text-xs text-muted-foreground">
              No sharers match "{searchQuery}"
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSharers.map((sharer) => {
              const fullName =
                `${sharer.firstName || ""} ${sharer.lastName || ""}`.trim() ||
                "Community Member";
              const initials =
                (sharer.firstName?.[0] || "") + (sharer.lastName?.[0] || "") ||
                "U";

              return (
                <div
                  key={sharer.userId}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border/60 bg-card hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-9 w-9 border border-border/60 shrink-0">
                      {sharer.avatar && (
                        <AvatarImage src={sharer.avatar} alt={fullName} />
                      )}
                      <AvatarFallback className="text-xs font-semibold uppercase bg-muted">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {fullName}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[140px] sm:max-w-[200px]">
                          {sharer.userId}
                        </span>
                        <button
                          type="button"
                          onClick={() => copyUserId(sharer.userId)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          title="Copy User ID"
                        >
                          {copiedId === sharer.userId ? (
                            <Check className="h-2.5 w-2.5 text-emerald-500" />
                          ) : (
                            <Copy className="h-2.5 w-2.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Platforms badges */}
                  <div className="flex items-center gap-1.5 flex-wrap justify-end shrink-0">
                    {(sharer.platforms || []).map((plat) => {
                      const cfg =
                        PLATFORM_CONFIG[plat.toLowerCase()] ||
                        PLATFORM_CONFIG.link;
                      const Icon = cfg.icon;
                      return (
                        <Badge
                          key={plat}
                          variant="outline"
                          className={cn(
                            "text-[10px] px-2 py-0.5 flex items-center gap-1 rounded-md",
                            cfg.badgeBg
                          )}
                        >
                          <Icon className="h-3 w-3" />
                          <span className="capitalize">{cfg.name}</span>
                        </Badge>
                      );
                    })}

                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] px-1.5 py-0.5 flex items-center gap-1"
                    >
                      <ShieldCheck className="h-3 w-3" />
                      <span>Verified</span>
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
}

export default FeedShareStatsView;

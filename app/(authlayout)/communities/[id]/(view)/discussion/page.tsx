"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  GET_COMMUNITY_BY_ID,
  GET_COMMUNITY_RATINGS,
} from "@/graphql/quries/group/approval";
import {
  Star,
  Users,
  ShieldCheck,
  MessageCircle,
  Activity,
  Eye,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommunityFeed from "@/components/feed/community-feed";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CommunityDiscussionPage() {
  const singularName = useModuleStore((state) => state.communitySingularName);
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("all-discussions");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: communityData, refetch: refetchCommunity } = useQuery(
    GET_COMMUNITY_BY_ID,
    {
      variables: { input: { communityId: id } },
      skip: !id,
    }
  );

  const { data: ratingData, refetch: refetchRating } = useQuery(
    GET_COMMUNITY_RATINGS,
    {
      variables: { communityId: id, limit: 1, offset: 0 },
      skip: !id,
    }
  );

  const community = communityData?.getCommunityById;
  const ratingSummary = ratingData?.getCommunityRatings?.summary;
  const averageRating = ratingSummary?.averageRating || 0;
  const totalRatings = ratingSummary?.totalRatings || 0;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([refetchCommunity?.(), refetchRating?.()]);
      toast.success("Discussion feed refreshed");
    } catch {
      toast.error("Failed to refresh discussion data");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Top KPI Telemetry Strip ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Discussions
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950/50 rounded">
              Total
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {(community?.numberOfPost ?? 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              threads
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-1">
            Community conversation feed
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Impressions
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold px-1.5 py-0.2 bg-purple-50 dark:bg-purple-950/50 rounded">
              Reach
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {(community?.numberOfViews ?? 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              views
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-1">
            {(community?.numberOfLikes ?? 0).toLocaleString()} member likes
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Members
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
              Participants
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {(community?.numberOfUser ?? 0).toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              active
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-1">
            Eligible to comment and react
          </p>
        </div>

        <div
          onClick={() => router.push(`/communities/${id}/rating`)}
          className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs hover:border-amber-300 dark:hover:border-amber-700 transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-amber-600 transition-colors">
              Satisfaction
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold px-1.5 py-0.2 bg-amber-50 dark:bg-amber-950/50 rounded">
              Score
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums flex items-center gap-1">
              {averageRating ? averageRating.toFixed(1) : "5.0"}
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 inline" />
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              rating
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-1 flex items-center justify-between">
            <span>{totalRatings} member ratings</span>
            <ChevronRight className="h-3 w-3 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </div>
      </div>

      {/* ── Main Layout: Feed (8/12) + Sidebar (4/12) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Feed Area (8/12) ───────────────────────────────────────────── */}
        <div className="lg:col-span-8 space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full space-y-4"
          >
            {/* Filter & Subheader bar */}
            <div className="flex items-center justify-between gap-3 bg-card border border-border/60 rounded-xl p-2.5 shadow-2xs">
              <TabsList className="h-8 bg-muted/60 border border-border/60 rounded-lg p-0.5 gap-1">
                <TabsTrigger
                  value="all-discussions"
                  className="h-7 px-3 rounded-md text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-2xs text-muted-foreground data-[state=active]:text-foreground gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  Published Feed
                  <Badge
                    variant="secondary"
                    className="ml-1 px-1.5 py-0 text-[10px] rounded font-semibold"
                  >
                    {community?.numberOfPost ?? 0}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="pending-discussions"
                  className="h-7 px-3 rounded-md text-xs font-semibold data-[state=active]:bg-background data-[state=active]:shadow-2xs text-muted-foreground data-[state=active]:text-foreground gap-1.5 cursor-pointer"
                >
                  <Clock className="h-3.5 w-3.5 text-amber-500" />
                  Pending Approvals
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="h-8 w-8 rounded-lg border-border/60 text-muted-foreground hover:text-foreground"
                  title="Refresh posts"
                >
                  <RotateCcw
                    className={cn(
                      "h-3.5 w-3.5",
                      isRefreshing && "animate-spin text-primary"
                    )}
                  />
                </Button>
              </div>
            </div>

            <TabsContent
              value="all-discussions"
              className="mt-0 focus-visible:outline-none"
            >
              <CommunityFeed communityId={id} status="APPROVED" />
            </TabsContent>

            <TabsContent
              value="pending-discussions"
              className="mt-0 focus-visible:outline-none"
            >
              <CommunityFeed communityId={id} status="PENDING" />
            </TabsContent>
          </Tabs>
        </div>

        {/* ── Sidebar (4/12) ─────────────────────────────────────────────── */}
        <div className="lg:col-span-4 space-y-5">
          {/* Activity Snapshot Card */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Activity className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Activity Telemetry
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MessageCircle className="h-3.5 w-3.5 text-indigo-500" />
                  Total Discussions
                </span>
                <span className="font-semibold text-foreground tabular-nums">
                  {community?.numberOfPost || 0}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-emerald-500" />
                  Total Views
                </span>
                <span className="font-semibold text-foreground tabular-nums">
                  {community?.numberOfViews || 0}
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-blue-500" />
                  Active Members
                </span>
                <span className="font-semibold text-foreground tabular-nums">
                  {community?.numberOfUser || 0}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-500" />
                  Satisfaction Rating
                </span>
                <div className="flex items-center gap-1 font-semibold text-foreground">
                  <span>{averageRating ? averageRating.toFixed(1) : "5.0"}</span>
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Rating Spotlight Card */}
          <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-200/70 dark:border-amber-900/50 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-950 dark:text-amber-200">
                  Member Satisfaction
                </h4>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[11px] text-amber-800 dark:text-amber-300 hover:bg-amber-100/60 font-semibold"
                onClick={() => router.push(`/communities/${id}/rating`)}
              >
                View Reviews
              </Button>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-foreground tabular-nums">
                {averageRating ? averageRating.toFixed(1) : "5.0"}
              </span>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      "h-3.5 w-3.5",
                      s <= Math.round(averageRating || 5)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-muted text-muted"
                    )}
                  />
                ))}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Based on {totalRatings} verified member reviews
            </p>
          </div>

          {/* Moderation Policies Card */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-primary" />
                <h4 className="text-sm font-semibold text-foreground">
                  Post Moderation
                </h4>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-md",
                  community?.requireAdminApprovalForPosts
                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800"
                )}
              >
                {community?.requireAdminApprovalForPosts
                  ? "Admin Approval"
                  : "Direct Publish"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {community?.requireAdminApprovalForPosts
                ? "All discussions submitted by members require manual administrator approval before appearing in the public feed."
                : "Members can post directly to the discussion feed. Flagged items can be reviewed under Reported Items."}
            </p>
          </div>

          {/* Community Host Card */}
          {community?.creator && (
            <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-3">
              <div className="flex items-center gap-2 border-b border-border/60 pb-3">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h4 className="text-sm font-semibold text-foreground">
                  Community Host
                </h4>
              </div>

              <UserProfileHoverCard user={community.creator}>
                <div className="flex items-center gap-3 p-2.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-all cursor-pointer">
                  <Avatar className="h-9 w-9 rounded-xl border border-border/60">
                    <AvatarImage src={community.creator.avatar || ""} />
                    <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                      {community.creator.firstName?.charAt(0) || "H"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {community.creator.firstName} {community.creator.lastName}
                    </span>
                    <Badge
                      variant="outline"
                      className="w-fit text-[9px] h-4 px-1.5 uppercase tracking-wider bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-800 font-semibold"
                    >
                      Administrator
                    </Badge>
                  </div>
                </div>
              </UserProfileHoverCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
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
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommunityFeed from "@/components/feed/community-feed";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import { useModuleStore } from "@/store/useModuleStore";

export default function CommunityDashboard() {
  const singularName = useModuleStore((state) => state.communitySingularName);
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data: communityData } = useQuery(GET_COMMUNITY_BY_ID, {
    variables: { input: { communityId: id } },
    skip: !id,
  });

  const { data: ratingData } = useQuery(GET_COMMUNITY_RATINGS, {
    variables: { communityId: id, limit: 1, offset: 0 },
    skip: !id,
  });

  const community = communityData?.getCommunityById;
  const ratingSummary = ratingData?.getCommunityRatings?.summary;
  const averageRating = ratingSummary?.averageRating || 0;
  const totalRatings = ratingSummary?.totalRatings || 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* ─── Main Feed Area (8/12) ───────────────────────────────────────── */}
      <div className="lg:col-span-8 space-y-4">
        <Tabs defaultValue="all-discussions" className="w-full">
          <div className="flex items-center justify-between gap-3 mb-4 bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-2 shadow-sm">
            <TabsList className="h-8 bg-muted/60 border border-border/60 rounded-lg p-0.5 gap-0.5">
              <TabsTrigger
                value="all-discussions"
                className="h-7 px-3 rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm text-muted-foreground data-[state=active]:text-foreground"
              >
                Published Posts
              </TabsTrigger>
              <TabsTrigger
                value="pending-discussions"
                className="h-7 px-3 rounded-md text-xs font-medium data-[state=active]:bg-background data-[state=active]:shadow-sm text-muted-foreground data-[state=active]:text-foreground"
              >
                Pending Approvals
              </TabsTrigger>
            </TabsList>

            <span className="text-[11px] text-muted-foreground px-2 hidden sm:inline-block">
              {community?.numberOfPost || 0} total discussions
            </span>
          </div>

          <TabsContent value="all-discussions" className="mt-0 focus-visible:outline-none">
            <CommunityFeed communityId={id} status="APPROVED" />
          </TabsContent>
          <TabsContent value="pending-discussions" className="mt-0 focus-visible:outline-none">
            <CommunityFeed communityId={id} status="PENDING" />
          </TabsContent>
        </Tabs>
      </div>

      {/* ─── Sidebar Stats & Admin (4/12) ─────────────────────────────────── */}
      <div className="lg:col-span-4 space-y-5">
        {/* Activity Metric Card */}
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <Activity className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Activity Snapshot</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <MessageCircle className="h-3.5 w-3.5 text-indigo-500" />
                Total Posts
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
                Community Rating
              </span>
              <div className="flex items-center gap-1 font-semibold text-foreground">
                <span>{averageRating.toFixed(1)}</span>
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Rating Breakdown Card */}
        <div className="bg-gradient-to-br from-amber-50/50 to-orange-50/30 dark:from-amber-950/20 dark:to-orange-950/10 border border-amber-200/70 dark:border-amber-900/50 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-950 dark:text-amber-200">
                Community Rating
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
            <span className="text-3xl font-bold tracking-tight text-foreground tabular-nums">
              {averageRating.toFixed(1)}
            </span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-3.5 w-3.5 ${
                    s <= Math.round(averageRating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Based on {totalRatings} verified member reviews
          </p>
        </div>

        {/* Community Admin Card with UserProfileHoverCard */}
        <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-border/60 pb-3">
            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <h4 className="text-sm font-semibold text-foreground">Community Host</h4>
          </div>

          {community?.creator ? (
            <UserProfileHoverCard user={community.creator}>
              <div className="flex items-center gap-3 p-2 rounded-lg border border-border/60 hover:bg-muted/30 transition-all cursor-pointer">
                <Avatar className="h-9 w-9 rounded-lg border border-border/60">
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
                    className="w-fit text-[9px] h-4 px-1 uppercase tracking-wider bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border-orange-200 dark:border-orange-800"
                  >
                    Administrator
                  </Badge>
                </div>
              </div>
            </UserProfileHoverCard>
          ) : (
            <div className="text-xs text-muted-foreground">No administrator information available</div>
          )}
        </div>
      </div>
    </div>
  );
}

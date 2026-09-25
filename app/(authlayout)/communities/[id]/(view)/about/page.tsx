"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import {
  GET_COMMUNITY_BY_ID,
  GET_COMMUNITY_RATINGS,
} from "@/graphql/quries/group/approval";
import {
  Info,
  ShieldAlert,
  CalendarDays,
  Hash,
  UserCircle,
  Lock,
  Unlock,
  Type,
  MapPin,
  CheckCircle2,
  Users,
  Settings,
  Shield,
  ChevronRight,
  Sparkles,
  MessageCircle,
  Eye,
  Star,
  ArrowRight,
  ShieldCheck,
  Megaphone,
  Share2,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import moment from "moment";
import { useModuleStore } from "@/store/useModuleStore";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function CommunityAbout() {
  const singularName = useModuleStore((state) => state.communitySingularName);
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const { data, loading, error, refetch } = useQuery(GET_COMMUNITY_BY_ID, {
    variables: { input: { communityId: id } },
    skip: !id,
  });

  const { data: ratingData } = useQuery(GET_COMMUNITY_RATINGS, {
    variables: { communityId: id, limit: 1, offset: 0 },
    skip: !id,
  });

  const community = data?.getCommunityById;
  const ratingSummary = ratingData?.getCommunityRatings?.summary;
  const averageRating = ratingSummary?.averageRating || 0;
  const totalRatings = ratingSummary?.totalRatings || 0;

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* KPI Scorecard Skeletons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-border/60 bg-card space-y-2.5 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20 rounded-[3px]" />
                <Skeleton className="h-5 w-5 rounded-[3px]" />
              </div>
              <Skeleton className="h-7 w-24 rounded-[3px]" />
              <Skeleton className="h-3 w-3/4 rounded-[3px]" />
            </div>
          ))}
        </div>

        {/* 2-Column Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="lg:col-span-2 h-96 rounded-xl" />
          <Skeleton className="h-96 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error || !community) {
    return (
      <div className="bg-card border border-border/80 rounded-xl p-12 text-center max-w-lg mx-auto shadow-2xs">
        <Info className="h-10 w-10 mx-auto text-muted-foreground mb-3 opacity-60" />
        <h3 className="text-base font-semibold">{singularName} Not Found</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Failed to load community details. Please try again or return to the overview.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4 h-8 text-xs font-semibold"
          onClick={() => router.push("/communities/all")}
        >
          Back to All Communities
        </Button>
      </div>
    );
  }

  const rules = community.rules || [];
  const isPublic = community.privacy === "PUBLIC";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Community link copied to clipboard");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Top Hero Identity Banner ────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-2xs">
        {community.cover ? (
          <div className="h-36 sm:h-44 w-full relative overflow-hidden bg-muted">
            <img
              src={
                community.cover.startsWith("http")
                  ? community.cover
                  : `https://cdn.thrico.network/${community.cover}`
              }
              alt={community.title || "Cover"}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
          </div>
        ) : (
          <div className="h-28 w-full bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-950/40 dark:via-purple-950/30 dark:to-pink-950/20 border-b border-border/40" />
        )}

        <div className="p-5 sm:p-6 sm:-mt-10 relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="flex items-start sm:items-end gap-4 min-w-0">
            <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-card border-2 border-background shadow-md flex items-center justify-center text-primary shrink-0 overflow-hidden">
              {community.cover ? (
                <img
                  src={
                    community.cover.startsWith("http")
                      ? community.cover
                      : `https://cdn.thrico.network/${community.cover}`
                  }
                  alt={community.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Users className="h-8 w-8 text-primary/70" />
              )}
            </div>

            <div className="space-y-1.5 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className={cn(
                    "px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md border",
                    isPublic
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20"
                  )}
                >
                  {isPublic ? "Public Community" : "Private Community"}
                </Badge>
                {community.communityType && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                  >
                    {community.communityType}
                  </Badge>
                )}
                {community.categories?.[0] && (
                  <Badge
                    variant="outline"
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md text-muted-foreground"
                  >
                    {community.categories[0]}
                  </Badge>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground truncate">
                {community.title || `${singularName} Details`}
              </h1>

              {community.tagline && (
                <p className="text-xs sm:text-sm text-muted-foreground leading-snug truncate max-w-xl">
                  {community.tagline}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="h-8 text-xs font-semibold gap-1.5 border-border/70 rounded-lg hover:bg-muted/70"
            >
              <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
              Share
            </Button>
            <Button
              size="sm"
              onClick={() => router.push(`/communities/${id}/discussion`)}
              className="h-8 text-xs font-semibold gap-1.5 rounded-lg bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              Open Feed
            </Button>
          </div>
        </div>
      </div>

      {/* ── KPI Metric Scorecards (Email Campaign Style) ────────────────── */}
      <TooltipProvider delayDuration={150}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Card 1: Members */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => router.push(`/communities/${id}/members`)}
                className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs hover:border-blue-300 dark:hover:border-blue-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-blue-600 transition-colors">
                    Members
                  </span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950/50 rounded">
                    Roster
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                    {(community.numberOfUser ?? 0).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    active
                  </span>
                </div>
                <p className="text-[10.5px] text-muted-foreground pt-1 flex items-center justify-between">
                  <span>{isPublic ? "Open enrollment" : "Requires invite"}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="max-w-[280px] p-3 rounded-lg bg-zinc-950 text-zinc-100 border border-zinc-800 shadow-xl space-y-1 text-left text-xs"
            >
              <p className="font-bold text-blue-400">👥 Total Active Members</p>
              <p className="text-[11px] text-zinc-300 leading-snug">
                Total users currently enrolled in this community with active participation permissions.
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Card 2: Discussions */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                onClick={() => router.push(`/communities/${id}/discussion`)}
                className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs hover:border-emerald-300 dark:hover:border-emerald-700 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                    Discussions
                  </span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
                    Feed
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                    {(community.numberOfPost ?? 0).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    posts
                  </span>
                </div>
                <p className="text-[10.5px] text-muted-foreground pt-1 flex items-center justify-between">
                  <span>
                    {community.requireAdminApprovalForPosts
                      ? "Admin moderated"
                      : "Direct publishing"}
                  </span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground/60 group-hover:translate-x-0.5 transition-transform" />
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="max-w-[280px] p-3 rounded-lg bg-zinc-950 text-zinc-100 border border-zinc-800 shadow-xl space-y-1 text-left text-xs"
            >
              <p className="font-bold text-emerald-400">💬 Discussion Activity</p>
              <p className="text-[11px] text-zinc-300 leading-snug">
                Total conversational threads, announcements, and member questions posted inside the feed.
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Card 3: Reach & Impressions */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs hover:border-purple-300 dark:hover:border-purple-700 transition-all cursor-help">
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
                    {(community.numberOfViews ?? 0).toLocaleString()}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">
                    views
                  </span>
                </div>
                <p className="text-[10.5px] text-muted-foreground pt-1">
                  {(community.numberOfLikes ?? 0).toLocaleString()} total likes recorded
                </p>
              </div>
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="max-w-[280px] p-3 rounded-lg bg-zinc-950 text-zinc-100 border border-zinc-800 shadow-xl space-y-1 text-left text-xs"
            >
              <p className="font-bold text-purple-400">👁️ Community Reach & Views</p>
              <p className="text-[11px] text-zinc-300 leading-snug">
                Aggregate impressions across web and mobile surfaces for this community's overview and threads.
              </p>
            </TooltipContent>
          </Tooltip>

          {/* Card 4: Rating */}
          <Tooltip>
            <TooltipTrigger asChild>
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
            </TooltipTrigger>
            <TooltipContent
              side="bottom"
              className="max-w-[280px] p-3 rounded-lg bg-zinc-950 text-zinc-100 border border-zinc-800 shadow-xl space-y-1 text-left text-xs"
            >
              <p className="font-bold text-amber-400">⭐ Member Satisfaction Rating</p>
              <p className="text-[11px] text-zinc-300 leading-snug">
                Verified member rating score calculated from submitted reviews and helpfulness votes.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* ── Action Starters (Inspired by Email's Broadcast Starters) ──────── */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="text-[11.5px] font-bold text-foreground uppercase tracking-wider">
            Quick Actions & Hub Shortcuts
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              title: "Community Discussions",
              description: "Review member discussions, answer questions, or approve pending posts.",
              icon: MessageCircle,
              gradient: "from-blue-500 to-indigo-600",
              badge: `${community.numberOfPost || 0} Posts`,
              action: () => router.push(`/communities/${id}/discussion`),
              btnText: "Open Feed",
            },
            {
              title: "Member Directory",
              description: "Manage roster, invite participants, and configure moderator roles.",
              icon: Users,
              gradient: "from-emerald-500 to-teal-600",
              badge: `${community.numberOfUser || 0} Members`,
              action: () => router.push(`/communities/${id}/members`),
              btnText: "View Directory",
            },
            {
              title: "Community Guidelines",
              description: "Establish safety rules, moderation policies, and behavior conduct.",
              icon: ShieldAlert,
              gradient: "from-purple-500 to-pink-600",
              badge: `${rules.length} Rules`,
              action: () => router.push(`/communities/${id}/rules`),
              btnText: "Edit Rules",
            },
            {
              title: "Ratings & Feedback",
              description: "Monitor member satisfaction scores, reviews, and helpful feedback.",
              icon: Star,
              gradient: "from-amber-500 to-orange-600",
              badge: `${averageRating.toFixed(1)} ★`,
              action: () => router.push(`/communities/${id}/rating`),
              btnText: "Inspect Reviews",
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={item.action}
                className="group flex flex-col justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-2xs transition-all text-left cursor-pointer"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "h-7 w-7 rounded-lg bg-gradient-to-br flex items-center justify-center text-white shrink-0 shadow-xs",
                        item.gradient
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <Badge
                      variant="secondary"
                      className="text-[9px] px-1.5 py-0 font-semibold rounded-[3px]"
                    >
                      {item.badge}
                    </Badge>
                  </div>
                  <p className="text-[12px] font-bold text-foreground group-hover:text-indigo-600 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[10.5px] text-muted-foreground leading-snug line-clamp-2">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[10.5px] font-semibold text-indigo-600 dark:text-indigo-400 pt-3 border-t border-border/40 mt-3">
                  <span>{item.btnText}</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 2-Column Main Layout (2/3 Main + 1/3 Sidebar Specs) ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ── Left Column (2/3) ────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mission & Description Card */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <Type className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Core Mission & Overview
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/communities/${id}/settings`)}
                className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <Settings className="h-3 w-3 mr-1" /> Edit
              </Button>
            </div>

            {community.description ? (
              <div className="pl-3.5 border-l-2 border-primary/40 space-y-2">
                <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-line font-normal">
                  {community.description}
                </p>
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg">
                No detailed mission statement provided yet.
              </div>
            )}

            {/* Categories & Topics Tag Cloud */}
            {community.categories && community.categories.length > 0 && (
              <div className="pt-2 border-t border-border/40">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                  Tagged Topics & Categories
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {community.categories.map((cat: string, index: number) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-2 py-0.5 text-[11px] font-medium rounded-md"
                    >
                      <Hash className="h-3 w-3 mr-1 text-muted-foreground" />
                      {cat}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Guidelines & Rules Card */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-semibold text-foreground">
                  Community Conduct Guidelines
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-[10px] font-semibold">
                  {rules.length} Rules Active
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push(`/communities/${id}/rules`)}
                  className="h-7 px-2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  Manage
                </Button>
              </div>
            </div>

            {rules.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rules.map((rule: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border/60 bg-muted/20 hover:border-border transition-all"
                  >
                    <div className="mt-0.5 p-1 bg-emerald-500/10 rounded-md shrink-0">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <h4 className="text-xs font-semibold text-foreground truncate">
                        {rule.title || `Rule #${index + 1}`}
                      </h4>
                      {rule.description && (
                        <p className="text-[11px] text-muted-foreground line-clamp-2 leading-snug">
                          {rule.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-muted-foreground border border-dashed rounded-lg space-y-2">
                <p>No guidelines published yet.</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/communities/${id}/rules`)}
                  className="h-7 text-xs font-medium"
                >
                  Create Guidelines
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column (1/3 Specs & Host) ──────────────────────────── */}
        <div className="space-y-6">
          {/* Quick Specifications Matrix */}
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h4 className="text-sm font-semibold text-foreground">
                Community Metadata
              </h4>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  {isPublic ? (
                    <Unlock className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-amber-500" />
                  )}
                  Access Visibility
                </span>
                <span className="font-semibold text-foreground">
                  {isPublic ? "Public Directory" : "Private / Invite-Only"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <UserCircle className="h-3.5 w-3.5 text-blue-500" />
                  Joining Terms
                </span>
                <span className="font-semibold text-foreground">
                  {community.joiningTerms === "OPEN" ||
                  community.joiningTerms === "ANYONE_CAN_JOIN"
                    ? "Instant Join"
                    : "Admin Approval Required"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-indigo-500" />
                  Post Moderation
                </span>
                <span className="font-semibold text-foreground">
                  {community.requireAdminApprovalForPosts
                    ? "Requires Approval"
                    : "Direct Posting"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-border/40">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-sky-500" />
                  Location
                </span>
                <span className="font-semibold text-foreground truncate max-w-[150px]">
                  {community.location || "Global Virtual"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-muted-foreground flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-slate-500" />
                  Created Date
                </span>
                <span className="font-semibold text-foreground">
                  {moment(Number(community.createdAt) || community.createdAt).format("MMM D, YYYY")}
                </span>
              </div>
            </div>

            {/* Quick Actions Shortcuts */}
            <div className="pt-2 flex flex-col gap-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs justify-between h-8 text-muted-foreground hover:text-foreground border-border/60"
                onClick={() => router.push(`/communities/${id}/members`)}
              >
                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  Inspect Members Roster
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs justify-between h-8 text-muted-foreground hover:text-foreground border-border/60"
                onClick={() => router.push(`/communities/${id}/settings`)}
              >
                <span className="flex items-center gap-1.5">
                  <Settings className="h-3.5 w-3.5" />
                  Edit Configuration
                </span>
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Community Host Card */}
          {community.creator && (
            <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Community Host
              </h4>
              <UserProfileHoverCard user={community.creator}>
                <div className="flex items-center gap-3 p-2.5 rounded-lg border border-border/60 hover:bg-muted/40 transition-all cursor-pointer">
                  <Avatar className="h-10 w-10 rounded-xl border border-border/60">
                    <AvatarImage src={community.creator.avatar} />
                    <AvatarFallback className="text-xs font-bold bg-muted text-muted-foreground">
                      {community.creator.firstName?.charAt(0) || "H"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-foreground truncate">
                      {community.creator.firstName} {community.creator.lastName}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      Community Administrator
                    </span>
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

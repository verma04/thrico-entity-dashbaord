/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import type { ApolloCache } from "@apollo/client";
import {
  Trash2,
  Pin,
  MoreVertical,
  Share2,
  MapPin,
  Briefcase,
  ShoppingBag,
  Play,
  DollarSign,
  LayoutGrid,
  Loader2,
  ShieldCheck,
  Sparkles,
  BarChart2,
  BarChart3,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import FeedUserDetails from "./feed-user-details";
import type { FeedProps } from "./types";
import Like from "./actions/like";
import Analytics from "./analytics";
import Comments from "./comment/comment";
import PollVote from "../polls/poll-vote";
import type { poll } from "../polls/ts-types";
import FeedMedia from "./feed-media";
import FeedDescription from "./feed-description";
import { cn } from "@/lib/utils";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import {
  useDeleteFeed,
  usePinFeed,
  useDeleteCommunityFeed,
} from "@/graphql/actions/feed";
import {
  GET_PINNED_FEED,
  GET_COMMUNITY_FEED,
  GET_ALL_FEED,
  NUMBER_OF_FEED,
} from "@/graphql/quries/feed";
import { toast } from "sonner";
import moment from "moment";

export default function Feed({ feed }: { feed: FeedProps }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);

  const [deleteFeedGlobal, { loading: isDeletingGlobal }] = useDeleteFeed({
    refetchQueries: [{ query: GET_ALL_FEED }, { query: NUMBER_OF_FEED }],
    update(cache: ApolloCache<unknown>) {
      cache.evict({ id: cache.identify({ __typename: "Feed", id: feed.id }) });
      cache.gc();
    },
    onCompleted: () => {
      setIsDeleteDialogOpen(false);
      toast.success("Post deleted successfully", {
        description: "The post has been permanently removed from the feed.",
        icon: <Trash2 className="h-4 w-4 text-emerald-500" />,
      });
    },
    onError: (error: Error) => {
      if (error.message?.toLowerCase().includes("not found")) {
        setIsDeleteDialogOpen(false);
        toast.info("Post already removed", {
          description: "This post no longer exists and has been removed from the feed.",
        });
        return;
      }
      toast.error("Failed to delete post", {
        description:
          error.message || "Something went wrong while deleting this post.",
      });
    },
  });

  const [deleteFeedCommunity, { loading: isDeletingCommunity }] =
    useDeleteCommunityFeed({
      refetchQueries: [
        { query: GET_COMMUNITY_FEED },
        { query: GET_ALL_FEED },
        { query: NUMBER_OF_FEED },
      ],
      update(cache: ApolloCache<unknown>) {
        cache.evict({ id: cache.identify({ __typename: "Feed", id: feed.id }) });
        cache.gc();
      },
      onCompleted: () => {
        setIsDeleteDialogOpen(false);
        toast.success("Community post deleted successfully", {
          description:
            "The post has been permanently removed from the community feed.",
          icon: <Trash2 className="h-4 w-4 text-emerald-500" />,
        });
      },
      onError: (error: Error) => {
        if (error.message?.toLowerCase().includes("not found")) {
          setIsDeleteDialogOpen(false);
          toast.info("Post already removed", {
            description: "This post no longer exists and has been removed from the feed.",
          });
          return;
        }
        toast.error("Failed to delete community post", {
          description:
            error.message || "Something went wrong while deleting this post.",
        });
      },
    });

  const isDeleting = feed.isCommunityFeed
    ? isDeletingCommunity
    : isDeletingGlobal;

  const [pinFeed, { loading: isPinning }] = usePinFeed({
    refetchQueries: [{ query: GET_PINNED_FEED }],
    update(cache: ApolloCache<unknown>, { data }: { data?: { pinFeed?: { isPinned: boolean; pinnedAt?: string } } }) {
      if (!data?.pinFeed) return;
      const updatedPin = data.pinFeed;
      cache.modify({
        id: cache.identify({ __typename: "Feed", id: feed.id }),
        fields: {
          isPinned() {
            return updatedPin.isPinned;
          },
          pinnedAt() {
            return updatedPin.pinnedAt;
          },
        },
      });
    },
    onCompleted: (data: { pinFeed?: { isPinned?: boolean } }) => {
      const isPinned = data?.pinFeed?.isPinned;
      toast.success(isPinned ? "Post Pinned" : "Post Unpinned", {
        description: isPinned
          ? "This post will now appear at the top of the feed."
          : "The post has been unpinned from the top of the feed.",
        icon: <Pin className="h-4 w-4 text-amber-500" />,
      });
    },
    onError: (error: Error) => {
      toast.error("Action failed", {
        description: error.message || "Could not update the pin status.",
      });
    },
  });

  const handleDelete = () => {
    if (feed.isCommunityFeed) {
      deleteFeedCommunity({
        variables: {
          input: { id: feed.id },
        },
      });
    } else {
      deleteFeedGlobal({
        variables: {
          input: { id: feed.id },
        },
      });
    }
  };

  const handlePin = (e: React.MouseEvent) => {
    e.stopPropagation();
    pinFeed({
      variables: {
        input: {
          feedId: feed.id.toString(),
          isPinned: !feed.isPinned,
        },
      },
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== "undefined") {
      const postUrl = `${window.location.origin}/feed/all?id=${feed.id}`;
      navigator.clipboard.writeText(postUrl);
      setCopied(true);
      toast.success("Link copied to clipboard", {
        description: "You can now share this post link anywhere.",
        icon: <Copy className="h-4 w-4 text-primary" />,
      });
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const isMarketplace = feed.source === "marketPlace";
  const isJob = feed.source === "jobs";

  return (
    <div className="w-full">
      <div className="w-full rounded-[10px] bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-800 shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-xs transition-all duration-150 overflow-hidden group">
        {/* Pinned Highlight Banner */}
        {feed.isPinned && (
          <div className="flex items-center justify-between px-4 py-2 bg-amber-50/70 dark:bg-amber-950/30 border-b border-amber-200/80 dark:border-amber-800/60 text-amber-900 dark:text-amber-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Pin className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>Pinned Announcement</span>
            </div>
            {feed.pinnedAt && (
              <span className="text-[11px] text-amber-700/80 dark:text-amber-400/80 font-medium font-mono">
                {moment(feed.pinnedAt).fromNow()}
              </span>
            )}
          </div>
        )}

        <div className="p-4 sm:p-5">
          {/* Card Top: Author Info + Category Badge + Actions Menu */}
          <div className="flex justify-between items-start gap-3 mb-3.5">
            <FeedUserDetails {...feed} />

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Category Pills if applicable */}
              {isJob && (
                <Badge
                  variant="outline"
                  className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-[4px]"
                >
                  <Briefcase className="h-3 w-3" /> Job
                </Badge>
              )}
              {isMarketplace && (
                <Badge
                  variant="outline"
                  className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-[4px]"
                >
                  <ShoppingBag className="h-3 w-3" /> Listing
                </Badge>
              )}
              {feed.moment && (
                <Badge
                  variant="outline"
                  className="bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-[4px]"
                >
                  <Play className="h-3 w-3" /> Moment
                </Badge>
              )}
              {feed.poll && (
                <Badge
                  variant="outline"
                  className="bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-800 text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-[4px]"
                >
                  <BarChart2 className="h-3 w-3" /> Poll
                </Badge>
              )}
              {feed.celebration && (
                <Badge
                  variant="outline"
                  className="bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800 text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5 rounded-[4px]"
                >
                  <Sparkles className="h-3 w-3" /> Celebration
                </Badge>
              )}

              {/* Action Menu */}
              <AlertDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Post options</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 rounded-xl">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsAnalyticsOpen(true);
                      }}
                      className="cursor-pointer gap-2"
                    >
                      <BarChart3 className="h-4 w-4 text-indigo-500" />
                      <span>Analytics</span>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    {feed.isOwner ? (
                      <>
                        <DropdownMenuItem
                          onClick={handlePin}
                          disabled={isPinning}
                          className="cursor-pointer gap-2"
                        >
                          {isPinning ? (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                          ) : (
                            <Pin
                              className={cn(
                                "h-4 w-4",
                                feed.isPinned &&
                                  "fill-amber-500 text-amber-500",
                              )}
                            />
                          )}
                          <span>
                            {feed.isPinned ? "Unpin Post" : "Pin to Top"}
                          </span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={handleShare}
                          className="cursor-pointer gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Copy Link</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer gap-2">
                            <Trash2 className="h-4 w-4" />
                            <span>Delete Post</span>
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem
                          onClick={handleShare}
                          className="cursor-pointer gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          <span>Copy Link</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-muted-foreground cursor-pointer gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Report Post</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                <AlertDialogContent className="rounded-xl border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xl max-w-md">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-sm font-bold text-[#303030] dark:text-zinc-100">
                      Delete this post?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="text-xs text-[#616161] dark:text-zinc-400">
                      This will permanently remove the post and all its contents
                      from the community feed. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className="pt-2">
                    <AlertDialogCancel className="rounded-lg h-8.5 px-3 text-xs font-semibold border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-200">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="rounded-lg h-8.5 px-3.5 text-xs font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          {/* Post Description */}
          {feed?.description && (
            <div className="mb-3.5">
              <FeedDescription text={feed.description} />
            </div>
          )}

          {/* Media & Attachments */}
          <div className="space-y-3.5">
            {feed?.media && feed.media.length > 0 && (
              <FeedMedia media={feed.media} />
            )}

            {/* Moments Video Reel Preview */}
            {feed?.moment && (
              <div className="group relative mt-2 rounded-xl overflow-hidden border border-border/80 bg-black aspect-9/16 max-h-[460px] mx-auto cursor-pointer shadow-md">
                <img
                  src={getPreferredMediaUrl(feed.moment.thumbnailUrl)}
                  className="w-full h-full object-cover opacity-90 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
                  alt="Moment Thumbnail"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="h-4 w-4 fill-white" />
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">
                        Watch Moment
                      </p>
                      <p className="text-white/80 text-xs">
                        {feed.moment.totalReactions} views
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Poll Component Embed */}
            {feed?.poll && (
              <div className="mt-2 rounded-xl overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb]/50 dark:bg-zinc-900/40">
                <PollVote data={feed.poll as unknown as poll} />
              </div>
            )}

            {/* Celebration Embed */}
            {feed?.celebration && (
              <div className="mt-2 p-4 rounded-xl border border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent flex flex-col sm:flex-row gap-4 items-start">
                {feed.celebration.cover && (
                  <div className="w-full sm:w-24 sm:h-24 h-40 rounded-lg overflow-hidden bg-muted border border-border/60 shrink-0 relative">
                    <img
                      src={getPreferredMediaUrl(feed.celebration.cover)}
                      alt={feed.celebration.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  <Badge
                    variant="outline"
                    className="text-[10px] uppercase font-semibold mb-1.5 w-fit bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
                  >
                    {feed.celebration.celebrationType?.replace(/_/g, " ")}
                  </Badge>
                  <h4 className="font-semibold text-foreground text-sm mb-1">
                    {feed.celebration.title}
                  </h4>
                  {feed.celebration.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {feed.celebration.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Job Opening Embed */}
            {isJob && feed.job && (
              <div className="mt-2 p-4 rounded-xl border border-border/70 bg-card flex flex-col gap-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 shrink-0">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-foreground text-sm truncate">
                        {feed.job.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Career Opportunity
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-xs font-medium bg-indigo-500/10 text-indigo-600 border-indigo-500/20 shrink-0"
                  >
                    {feed.job.jobType}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  {feed.job.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <span>{feed.job.location}</span>
                    </div>
                  )}
                  {feed.job.salary && (
                    <div className="flex items-center gap-1.5">
                      <DollarSign className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <span>{feed.job.salary}</span>
                    </div>
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs font-semibold rounded-lg hover:bg-muted"
                >
                  View Job Details
                </Button>
              </div>
            )}

            {/* Marketplace Listing Embed */}
            {isMarketplace && feed.marketPlace && (
              <div className="mt-2 p-4 rounded-xl border border-border/70 bg-card flex flex-col gap-3 shadow-xs">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                      <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-semibold text-foreground text-sm truncate">
                        {feed.marketPlace.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Marketplace Item
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-sm text-foreground shrink-0">
                    ${feed.marketPlace.price}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {feed.marketPlace.location?.name && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <span>{feed.marketPlace.location.name}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <LayoutGrid className="h-3.5 w-3.5 text-muted-foreground/70" />
                    <span className="capitalize">
                      {feed.marketPlace.category || "General"}
                    </span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-8 text-xs font-semibold rounded-lg hover:bg-muted"
                >
                  View Listing
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Card Footer: Engagement Actions Bar */}
        <div className="px-4 py-2.5 bg-[#f9fafb]/50 dark:bg-zinc-900/50 border-t border-[#e1e3e5]/60 dark:border-zinc-800/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Like item={feed} />
            <Comments id={feed.id} totalComments={feed.totalComment} />
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg h-8 px-2.5 font-medium text-xs text-[#616161] dark:text-zinc-400 hover:text-[#303030] dark:hover:text-zinc-200 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 transition-all flex items-center gap-1.5 cursor-pointer"
              onClick={handleShare}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">
                    Copied
                  </span>
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center">
            <Analytics
              feedId={feed.id.toString()}
              feed={feed}
              open={isAnalyticsOpen}
              onOpenChange={setIsAnalyticsOpen}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

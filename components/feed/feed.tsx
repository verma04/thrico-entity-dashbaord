"use client";

import React, { useState } from "react";
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
  Copy,
  Check,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import FeedMedia from "./feed-media";
import FeedDescription from "./feed-description";
import { cn } from "@/lib/utils";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import {
  useDeleteFeed,
  usePinFeed,
  useDeleteCommunityFeed,
} from "@/graphql/actions/feed";
import { GET_PINNED_FEED, GET_COMMUNITY_FEED } from "@/graphql/quries/feed";
import { toast } from "sonner";
import moment from "moment";

export default function Feed({ feed }: { feed: FeedProps }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const [deleteFeedGlobal, { loading: isDeletingGlobal }] = useDeleteFeed({
    onCompleted: () => {
      setIsDeleteDialogOpen(false);
      toast.success("Post deleted successfully", {
        description: "The post has been permanently removed from the feed.",
        icon: <Trash2 className="h-4 w-4 text-emerald-500" />,
      });
    },
    onError: (error: any) => {
      toast.error("Failed to delete post", {
        description:
          error.message || "Something went wrong while deleting this post.",
      });
    },
  });

  const [deleteFeedCommunity, { loading: isDeletingCommunity }] =
    useDeleteCommunityFeed({
      onCompleted: () => {
        setIsDeleteDialogOpen(false);
        toast.success("Community post deleted successfully", {
          description:
            "The post has been permanently removed from the community feed.",
          icon: <Trash2 className="h-4 w-4 text-emerald-500" />,
        });
      },
      onError: (error: any) => {
        toast.error("Failed to delete community post", {
          description:
            error.message || "Something went wrong while deleting this post.",
        });
      },
      refetchQueries: [GET_COMMUNITY_FEED],
    });

  const isDeleting = feed.isCommunityFeed
    ? isDeletingCommunity
    : isDeletingGlobal;

  const [pinFeed, { loading: isPinning }] = usePinFeed({
    refetchQueries: [{ query: GET_PINNED_FEED }],
    update(cache: any, { data: { pinFeed } }: any) {
      cache.modify({
        id: cache.identify(feed),
        fields: {
          isPinned() {
            return pinFeed.isPinned;
          },
          pinnedAt() {
            return pinFeed.pinnedAt;
          },
        },
      });
    },
    onCompleted: (data: any) => {
      const isPinned = data?.pinFeed?.isPinned;
      toast.success(isPinned ? "Post Pinned" : "Post Unpinned", {
        description: isPinned
          ? "This post will now appear at the top of the feed."
          : "The post has been unpinned from the top of the feed.",
        icon: <Pin className="h-4 w-4 text-amber-500" />,
      });
    },
    onError: (error: any) => {
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
      <Card className="w-full rounded-2xl bg-card border border-border/80 shadow-xs hover:shadow-md hover:border-border transition-all duration-300 overflow-hidden group">
        {/* Pinned Highlight Banner */}
        {feed.isPinned && (
          <div className="flex items-center justify-between px-5 py-2 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-b border-amber-500/20 text-amber-600 dark:text-amber-400">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Pin className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>Pinned Announcement</span>
            </div>
            {feed.pinnedAt && (
              <span className="text-[11px] text-amber-600/70 dark:text-amber-400/70 font-medium">
                {moment(feed.pinnedAt).fromNow()}
              </span>
            )}
          </div>
        )}

        <div className="p-5">
          {/* Card Top: Author Info + Category Badge + Actions Menu */}
          <div className="flex justify-between items-start gap-3 mb-3.5">
            <FeedUserDetails {...feed} />

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Category Pills if applicable */}
              {isJob && (
                <Badge
                  variant="outline"
                  className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20 text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5"
                >
                  <Briefcase className="h-3 w-3" /> Job
                </Badge>
              )}
              {isMarketplace && (
                <Badge
                  variant="outline"
                  className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5"
                >
                  <ShoppingBag className="h-3 w-3" /> Listing
                </Badge>
              )}
              {feed.moment && (
                <Badge
                  variant="outline"
                  className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5"
                >
                  <Play className="h-3 w-3" /> Moment
                </Badge>
              )}
              {feed.poll && (
                <Badge
                  variant="outline"
                  className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5"
                >
                  <BarChart2 className="h-3 w-3" /> Poll
                </Badge>
              )}
              {feed.celebration && (
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[10px] font-semibold flex items-center gap-1 px-2 py-0.5"
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
                                feed.isPinned && "fill-amber-500 text-amber-500"
                              )}
                            />
                          )}
                          <span>{feed.isPinned ? "Unpin Post" : "Pin to Top"}</span>
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

                <AlertDialogContent className="rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove the post and all its contents
                      from the community feed. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl"
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
              <div className="mt-2 rounded-xl overflow-hidden border border-border/60 bg-muted/20">
                <PollVote data={feed.poll as any} />
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
        <div className="px-4 py-2.5 bg-muted/20 border-t border-border/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Like item={feed as any} />
            <Comments id={feed.id} totalComments={feed.totalComment} />
            <Button
              variant="ghost"
              size="sm"
              className="rounded-lg h-8 px-2.5 font-medium text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all flex items-center gap-1.5"
              onClick={handleShare}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
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
            <Analytics feedId={feed.id.toString()} />
          </div>
        </div>
      </Card>
    </div>
  );
}


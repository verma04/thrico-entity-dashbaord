import {
  Trash2,
  Pin,
  MoreVertical,
  Repeat2,
  MapPin,
  Briefcase,
  ShoppingBag,
  Play,
  Film,
  DollarSign,
  ChevronRight,
  TrendingUp,
  LayoutGrid,
  Loader2,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useDeleteFeed, usePinFeed, useDeleteCommunityFeed } from "@/graphql/actions/feed";
import { GET_PINNED_FEED, GET_COMMUNITY_FEED } from "@/graphql/quries/feed";
import { useState } from "react";
import { toast } from "sonner";

export default function Feed({ feed }: { feed: FeedProps }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
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

  const [deleteFeedCommunity, { loading: isDeletingCommunity }] = useDeleteCommunityFeed({
    onCompleted: () => {
      setIsDeleteDialogOpen(false);
      toast.success("Community post deleted successfully", {
        description: "The post has been permanently removed from the community feed.",
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

  const isDeleting = feed.isCommunityFeed ? isDeletingCommunity : isDeletingGlobal;

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
          ? "This post will now appear at the top of the admin feed."
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

  const isMarketplace = feed.source === "marketPlace";
  const isJob = feed.source === "jobs";

  return (
    <div className="w-full">
      <Card className="w-full rounded-xl bg-card border border-border shadow-sm overflow-hidden">
        <div className="p-5">
          {feed.isPinned && (
            <div className="flex items-center gap-1.5 mb-4 px-2 py-1 bg-muted w-fit rounded-md border border-border">
              <Pin className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">
                Pinned
              </span>
            </div>
          )}

          <div className="flex justify-between items-start mb-6">
            <FeedUserDetails {...feed} />
            <AlertDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {feed.isOwner ? (
                    <>
                      <DropdownMenuItem
                        onClick={handlePin}
                        disabled={isPinning}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          {isPinning ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Pin
                              className={cn(
                                "h-4 w-4",
                                feed.isPinned && "fill-current",
                              )}
                            />
                          )}
                          {feed.isPinned ? "Unpin Post" : "Pin to Top"}
                        </div>
                      </DropdownMenuItem>

                      <Separator className="my-1" />

                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                          <div className="flex items-center gap-2">
                            <Trash2 className="h-4 w-4" />
                            Delete Post
                          </div>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </>
                  ) : (
                    <DropdownMenuItem className="text-muted-foreground cursor-pointer">
                      <ShieldCheck className="h-4 w-4 mr-2" />
                      Report Post
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove the post and all its contents
                    from the feed. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="space-y-4">
            {feed?.description && (
              <div className="px-0.5">
                <FeedDescription text={feed.description} />
              </div>
            )}

            {feed?.media && feed.media.length > 0 && (
              <FeedMedia media={feed.media} />
            )}

            {feed?.moment && (
              <div className="group relative mt-2 rounded-xl overflow-hidden border border-border bg-black aspect-9/16 max-h-[500px] mx-auto cursor-pointer">
                <img
                  src={getPreferredMediaUrl(feed.moment.thumbnailUrl)}
                  className="w-full h-full object-cover opacity-90 transition-opacity group-hover:opacity-100"
                  alt="Moment Thumbnail"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white">
                      <Play className="h-4 w-4 fill-white" />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">
                        Watch Moment
                      </p>
                      <p className="text-white/70 text-xs">
                        {feed.moment.totalReactions} views
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {feed?.poll && (
              <div className="mt-2 rounded-xl overflow-hidden border border-border bg-muted/20 p-2">
                <PollVote data={feed.poll as any} />
              </div>
            )}

            {feed?.celebration && (
              <div className="mt-2 p-4 rounded-xl border border-border bg-muted/10 flex flex-col sm:flex-row gap-4 items-start">
                {feed.celebration.cover && (
                  <div className="w-full sm:w-24 sm:h-24 h-48 rounded-lg overflow-hidden bg-muted border border-border flex-shrink-0 relative">
                    <img 
                      src={getPreferredMediaUrl(feed.celebration.cover)} 
                      alt={feed.celebration.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col justify-center">
                  <Badge variant="secondary" className="text-[10px] uppercase font-semibold mb-2 w-fit border-border">
                    {feed.celebration.celebrationType?.replace(/_/g, ' ')}
                  </Badge>
                  <h4 className="font-semibold text-foreground text-[15px] mb-1.5">
                    {feed.celebration.title}
                  </h4>
                  {feed.celebration.description && (
                    <p className="text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {feed.celebration.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {isJob && feed.job && (
              <div className="mt-2 p-4 rounded-xl border border-border bg-muted/10 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-background shadow-sm flex items-center justify-center border border-border">
                      <Briefcase className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        {feed.job.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Job Opening
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {feed.job.jobType}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{feed.job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="h-3.5 w-3.5" />
                    <span>{feed.job.salary}</span>
                  </div>
                </div>

                <Button variant="outline" className="w-full h-9 text-xs">
                  View Job Details
                </Button>
              </div>
            )}

            {isMarketplace && feed.marketPlace && (
              <div className="mt-2 p-4 rounded-xl border border-border bg-muted/10 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-background shadow-sm flex items-center justify-center border border-border">
                      <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm">
                        {feed.marketPlace.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        Marketplace Listing
                      </p>
                    </div>
                  </div>
                  <div className="font-medium text-sm">
                    ${feed.marketPlace.price}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{feed.marketPlace.location.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <LayoutGrid className="h-3.5 w-3.5" />
                    <span className="capitalize">
                      {feed.marketPlace.category || "General"}
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full h-9 text-xs">
                  View Listing
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end mt-4 mb-4 px-0.5">
            <Analytics feedId={feed.id.toString()} />
          </div>

          <Separator className="mb-4" />

          <div className="flex items-center justify-between gap-3 px-0.5">
            <div className="flex items-center gap-1.5">
              <Like item={feed as any} />
              <Comments id={feed.id} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground flex items-center gap-2"
            >
              <Repeat2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

import { ShieldCheck } from "lucide-react";

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
import { cn } from "@/lib/utils";
import { getPreferredMediaUrl } from "@/lib/media-utils";
import { useDeleteFeed, usePinFeed } from "@/graphql/actions/feed";
import { GET_PINNED_FEED } from "@/graphql/quries/feed";
import { useState } from "react";
import { toast } from "sonner";

export default function Feed({ feed }: { feed: FeedProps }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteFeed, { loading: isDeleting }] = useDeleteFeed({
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
    deleteFeed({
      variables: {
        input: { id: feed.id },
      },
    });
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
    <div className="w-full animate-in fade-in slide-in-from-bottom-3 duration-500">
      <Card className="w-full rounded-[32px] bg-white border border-zinc-100 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)] overflow-hidden transition-all hover:shadow-[0_8px_40px_-4px_rgba(0,0,0,0.08)] ring-1 ring-zinc-100/50">
        <div className="p-6">
          {feed.isPinned && (
            <div className="flex items-center gap-2 mb-4 px-1.5 py-1 bg-amber-50/50 w-fit rounded-full border border-amber-100/50 animate-in fade-in slide-in-from-left-2 duration-500">
              <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                <Pin className="h-3 w-3 text-amber-600 fill-amber-600" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 pr-2">
                Pinned Insight
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
                    className="h-10 w-10 rounded-2xl text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50 transition-all"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[220px] rounded-[24px] border-zinc-100 shadow-2xl p-2 bg-white/80 backdrop-blur-xl"
                >
                  {feed.isOwner ? (
                    <>
                      <DropdownMenuItem
                        onClick={handlePin}
                        disabled={isPinning}
                        className="text-amber-600 focus:bg-amber-50 focus:text-amber-700 rounded-xl px-4 py-3 font-bold text-[13px] transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
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
                          {feed.isPinned ? "Unpin Post" : "Pin Post"}
                        </div>
                      </DropdownMenuItem>

                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-red-500 focus:bg-red-50 focus:text-red-600 rounded-xl px-4 py-3 font-bold text-[13px] transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Trash2 className="h-4 w-4" />
                            Delete Post
                          </div>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </>
                  ) : (
                    <DropdownMenuItem className="text-zinc-600 focus:bg-zinc-50 rounded-xl px-4 py-3 font-bold text-[13px] transition-all cursor-pointer">
                      No actions available
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialogContent className="rounded-[32px] border-zinc-100 shadow-2xl p-8 max-w-md">
                <AlertDialogHeader>
                  <div className="h-16 w-16 rounded-3xl bg-red-50 flex items-center justify-center mb-6">
                    <Trash2 className="h-8 w-8 text-red-500" />
                  </div>
                  <AlertDialogTitle className="text-2xl font-black text-zinc-900 tracking-tight leading-none mb-2">
                    Delete this post?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-[15px] font-medium text-zinc-500 leading-relaxed uppercase tracking-tight">
                    This action is permanent and cannot be undone. All data
                    associated with this post will be erased from our ecosystem
                    registry.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-8 gap-3">
                  <AlertDialogCancel className="h-14 rounded-2xl border-zinc-100 font-black text-[12px] uppercase tracking-widest text-zinc-400 hover:bg-zinc-50 hover:text-zinc-900 transition-all flex-1">
                    Cancel Operation
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-14 rounded-2xl bg-red-500 hover:bg-red-600 border-none font-black text-[12px] uppercase tracking-widest text-white shadow-xl shadow-red-500/20 transition-all flex-1 active:scale-95 disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Confirm Deletion"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="space-y-6">
            {feed?.description && (
              <div className="px-1">
                <p className="text-[17px] leading-relaxed text-zinc-800 font-medium tracking-tight whitespace-pre-wrap">
                  {feed?.description}
                </p>
              </div>
            )}

            {feed?.media && feed.media.length > 0 && (
              <FeedMedia media={feed.media} />
            )}

            {feed?.moment && (
              <div className="group relative mt-4 rounded-3xl overflow-hidden shadow-2xl shadow-indigo-500/10 border border-zinc-100 bg-black aspect-9/16 max-h-[600px] mx-auto cursor-pointer">
                <img
                  src={getPreferredMediaUrl(feed.moment.thumbnailUrl)}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                  alt="Moment Thumbnail"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center text-white ring-8 ring-white/5 animate-pulse">
                      <Play className="h-6 w-6 fill-white" />
                    </div>
                    <div>
                      <p className="text-white font-black text-xl tracking-tight">
                        Watch Moment
                      </p>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest">
                        {feed.moment.totalReactions} Views
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 left-6">
                  <Badge className="bg-white/20 backdrop-blur-md border-white/30 text-white font-black text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-xl">
                    <Film className="h-3 w-3 mr-1.5" />
                    Flash Moment
                  </Badge>
                </div>
              </div>
            )}

            {feed?.poll && (
              <div className="mt-2 rounded-[32px] overflow-hidden border border-emerald-100 bg-emerald-50/5 p-1">
                <PollVote data={feed.poll as any} />
              </div>
            )}

            {isJob && feed.job && (
              <div className="bg-indigo-50/30 p-8 rounded-[40px] border border-indigo-100/50 flex flex-col gap-6 group cursor-pointer hover:bg-white hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                  <Briefcase className="h-32 w-32" />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-indigo-50 transition-transform group-hover:scale-110 duration-500">
                      <Briefcase className="h-7 w-7 text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-zinc-900 tracking-tight text-xl mb-1">
                        {feed.job.title}
                      </h4>
                      <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest italic">
                        Employment Opportunity
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className="bg-indigo-100 text-indigo-700 font-black text-[10px] uppercase tracking-wider rounded-xl px-4 py-1.5"
                  >
                    {feed.job.jobType}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-6 mt-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-zinc-100">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="text-[14px] font-bold text-zinc-600">
                      {feed.job.location}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-zinc-100">
                      <DollarSign className="h-4 w-4 text-indigo-500" />
                    </div>
                    <span className="text-[14px] font-bold text-zinc-900">
                      {feed.job.salary}
                    </span>
                  </div>
                </div>

                <Button className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest mt-2 shadow-xl shadow-indigo-500/20 group/btn">
                  View Job Details
                  <ChevronRight className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            )}

            {isMarketplace && feed.marketPlace && (
              <div className="bg-amber-50/30 p-8 rounded-[40px] border border-amber-100/50 flex flex-col gap-6 group cursor-pointer hover:bg-white hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:scale-110 transition-transform duration-1000 -rotate-12">
                  <ShoppingBag className="h-32 w-32" />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-white shadow-xl flex items-center justify-center border border-amber-50 transition-transform group-hover:scale-110 duration-500">
                      <ShoppingBag className="h-7 w-7 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-black text-zinc-900 tracking-tight text-xl mb-1">
                        {feed.marketPlace.title}
                      </h4>
                      <p className="text-[12px] font-bold text-zinc-400 uppercase tracking-widest italic">
                        Community Market Listing
                      </p>
                    </div>
                  </div>
                  <div className="bg-emerald-500 text-white font-black text-[14px] rounded-2xl px-5 py-2.5 shadow-xl shadow-emerald-500/20">
                    ${feed.marketPlace.price}
                  </div>
                </div>

                <div className="flex items-center gap-6 mt-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-zinc-100">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                    </div>
                    <span className="text-[14px] font-bold text-zinc-600">
                      {feed.marketPlace.location.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center shadow-sm border border-zinc-100">
                      <LayoutGrid className="h-4 w-4 text-amber-500" />
                    </div>
                    <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-widest">
                      {feed.marketPlace.category || "Listing"}
                    </span>
                  </div>
                </div>

                <Button className="w-full h-14 bg-zinc-900 hover:bg-black text-white rounded-2xl font-black text-[13px] uppercase tracking-widest mt-2 shadow-xl shadow-zinc-900/20 group/btn">
                  Explore Offering
                  <ShoppingBag className="h-4 w-4 ml-2 transition-transform group-hover/btn:translate-y-[-2px]" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-8 mb-6 px-1">
            <div className="flex items-center gap-5 text-[11px] font-black text-zinc-400 uppercase tracking-[0.15em]">
              <div className="flex items-center gap-2 hover:text-zinc-900 cursor-default transition-colors">
                <span className="text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full">
                  {feed?.totalReactions || 0}
                </span>
                <span>Interactions</span>
              </div>
              <div className="flex items-center gap-2 hover:text-zinc-900 cursor-default transition-colors">
                <span className="text-zinc-900 bg-zinc-100 px-2 py-0.5 rounded-full">
                  {feed?.totalComment || 0}
                </span>
                <span>Discussion</span>
              </div>
            </div>
            <Analytics />
          </div>

          <div className="h-px w-full bg-linear-to-r from-transparent via-zinc-100 to-transparent mb-5" />

          <div className="flex items-center justify-between gap-3 px-0.5">
            <div className="flex items-center gap-2">
              <Like item={feed as any} />
              <Comments id={feed.id} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full h-11 px-6 text-zinc-500 font-bold text-[14px] hover:bg-zinc-50 hover:text-zinc-900 transition-all flex items-center gap-2.5"
            >
              <Repeat2 className="h-4.5 w-4.5" strokeWidth={3} />
              Share
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

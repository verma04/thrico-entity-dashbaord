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
      <Card className="w-full rounded-[32px] bg-card border border-border shadow-sm overflow-hidden transition-all hover:shadow-md ring-1 ring-border/50">
        <div className="p-6">
          {feed.isPinned && (
            <div className="flex items-center gap-2 mb-4 px-2 py-1 bg-amber-500/10 w-fit rounded-lg border border-amber-500/20 animate-in fade-in slide-in-from-left-2 duration-500">
              <Pin className="h-3 w-3 text-amber-600 fill-amber-600" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-amber-700">
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
                    className="h-10 w-10 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
                  >
                    <MoreVertical className="h-4.5 w-4.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-[200px] rounded-2xl border-border shadow-xl p-1.5 bg-card/95 backdrop-blur-xl"
                >
                  {feed.isOwner ? (
                    <>
                      <DropdownMenuItem
                        onClick={handlePin}
                        disabled={isPinning}
                        className="text-amber-600 focus:bg-amber-50 focus:text-amber-700 rounded-xl px-4 py-3 font-bold text-[12px] transition-all cursor-pointer"
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
                          {feed.isPinned ? "Unpin Insight" : "Pin to Top"}
                        </div>
                      </DropdownMenuItem>
                      
                      <Separator className="my-1.5 opacity-50" />

                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-xl px-4 py-3 font-bold text-[12px] transition-all cursor-pointer">
                          <div className="flex items-center gap-3">
                            <Trash2 className="h-4 w-4" />
                            Purge Content
                          </div>
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                    </>
                  ) : (
                    <DropdownMenuItem className="text-muted-foreground focus:bg-muted rounded-xl px-4 py-3 font-bold text-[12px] transition-all cursor-pointer">
                      <ShieldCheck className="h-4 w-4 mr-3" />
                      View Policy
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <AlertDialogContent className="rounded-[32px] border-border shadow-2xl p-8 max-w-md">
                <AlertDialogHeader>
                  <div className="h-14 w-14 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
                    <Trash2 className="h-7 w-7 text-destructive" />
                  </div>
                  <AlertDialogTitle className="text-xl font-bold text-foreground tracking-tight mb-2">
                    Purge this content?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed">
                    This will permanently clear the metadata and media associated with this post from the global registry.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-8 gap-3">
                  <AlertDialogCancel className="h-12 rounded-xl border-border font-bold text-xs uppercase tracking-widest text-muted-foreground hover:bg-muted transition-all flex-1">
                    Abort
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="h-12 rounded-xl bg-destructive hover:bg-destructive/90 border-none font-bold text-xs uppercase tracking-widest text-white shadow-lg shadow-destructive/20 transition-all flex-1 active:scale-95 disabled:opacity-50"
                  >
                    {isDeleting ? "Purging..." : "Confirm Purge"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="space-y-6">
            {feed?.description && (
              <div className="px-0.5">
                <p className="text-[17px] leading-relaxed text-foreground font-medium tracking-tight whitespace-pre-wrap">
                  {feed?.description}
                </p>
              </div>
            )}

            {feed?.media && feed.media.length > 0 && (
              <FeedMedia media={feed.media} />
            )}

            {feed?.moment && (
              <div className="group relative mt-4 rounded-2xl overflow-hidden shadow-xl shadow-indigo-500/10 border border-border bg-black aspect-9/16 max-h-[580px] mx-auto cursor-pointer">
                <img
                  src={getPreferredMediaUrl(feed.moment.thumbnailUrl)}
                  className="w-full h-full object-cover opacity-85 group-hover:scale-110 transition-transform duration-1000"
                  alt="Moment Thumbnail"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl transition-transform group-hover:scale-110">
                      <Play className="h-5 w-5 fill-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-lg tracking-tight leading-none mb-1">
                        Watch Moment
                      </p>
                      <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">
                        {feed.moment.totalReactions} Ecosystem Views
                      </p>
                    </div>
                  </div>
                </div>
                <div className="absolute top-6 left-6">
                  <Badge className="bg-primary/20 backdrop-blur-lg border-white/20 text-white font-bold text-[10px] uppercase tracking-widest px-3 py-1.5 rounded-lg">
                    <Zap className="h-3 w-3 mr-1.5 fill-current" />
                    Instant Flash
                  </Badge>
                </div>
              </div>
            )}

            {feed?.poll && (
              <div className="mt-2 rounded-[28px] overflow-hidden border border-emerald-500/10 bg-emerald-500/5 p-1">
                <PollVote data={feed.poll as any} />
              </div>
            )}

            {isJob && feed.job && (
              <div className="bg-primary/5 p-8 rounded-[32px] border border-primary/10 flex flex-col gap-6 group cursor-pointer hover:bg-card hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000 rotate-12">
                  <Briefcase className="h-24 w-24" />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-card shadow-sm flex items-center justify-center border border-border transition-transform group-hover:scale-110 duration-500">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground tracking-tight text-lg mb-0.5">
                        {feed.job.title}
                      </h4>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        Opportunity Registry
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-wider rounded-lg border-primary/20"
                  >
                    {feed.job.jobType}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-5 mt-1 text-sm font-medium text-muted-foreground">
                   <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      <span>{feed.job.location}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4 text-primary" />
                      <span className="text-foreground font-bold">{feed.job.salary}</span>
                   </div>
                </div>

                <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold text-xs uppercase tracking-widest mt-2 shadow-lg shadow-primary/20 group/btn transition-all">
                  Open Career Registry
                  <ChevronRight className="h-3.5 w-3.5 ml-2 transition-transform group-hover/btn:translate-x-1" />
                </Button>
              </div>
            )}

            {isMarketplace && feed.marketPlace && (
              <div className="bg-amber-500/5 p-8 rounded-[32px] border border-amber-500/10 flex flex-col gap-6 group cursor-pointer hover:bg-card hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000 -rotate-12 text-amber-500">
                  <ShoppingBag className="h-24 w-24" />
                </div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-card shadow-sm flex items-center justify-center border border-border transition-transform group-hover:scale-110 duration-500">
                      <ShoppingBag className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground tracking-tight text-lg mb-0.5">
                        {feed.marketPlace.title}
                      </h4>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                        Marketplace Node
                      </p>
                    </div>
                  </div>
                  <div className="bg-emerald-500 text-white font-bold text-[14px] rounded-xl px-4 py-2 shadow-lg shadow-emerald-500/20">
                    ${feed.marketPlace.price}
                  </div>
                </div>

                <div className="flex items-center gap-5 mt-1 text-sm font-medium text-muted-foreground">
                   <div className="flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-500" />
                      <span>{feed.marketPlace.location.name}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <LayoutGrid className="h-4 w-4 text-amber-600" />
                      <span className="uppercase text-[10px] font-bold tracking-widest">{feed.marketPlace.category || "General"}</span>
                   </div>
                </div>

                <Button className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 rounded-xl font-bold text-xs uppercase tracking-widest mt-2 shadow-lg transition-all group/btn">
                  Interrogate Offering
                  <ShoppingBag className="h-3.5 w-3.5 ml-2 transition-transform group-hover/btn:-translate-y-0.5" />
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-8 mb-5 px-0.5">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-muted text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <TrendingUp className="h-3 w-3 text-emerald-500" />
                  {feed?.totalReactions || 0} Growth
               </div>
               <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-muted text-[10px] font-bold uppercase tracking-widest text-muted-foreground border border-border/50">
                  {feed?.totalComment || 0} Dialogue
               </div>
            </div>
            <Analytics />
          </div>

          <Separator className="mb-5 opacity-40" />

          <div className="flex items-center justify-between gap-3 px-0.5">
            <div className="flex items-center gap-1.5">
              <Like item={feed as any} />
              <Comments id={feed.id} />
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-xl h-10 px-4 text-muted-foreground font-bold text-[13px] hover:bg-muted hover:text-foreground transition-all flex items-center gap-2"
            >
              <Repeat2 className="h-4 w-4" strokeWidth={2.5} />
              Redistribute
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

import { ShieldCheck } from "lucide-react";

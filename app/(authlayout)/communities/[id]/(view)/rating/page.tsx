"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  Loader2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";
import moment from "moment";
import {
  getCommunityRatings,
  deleteCommunityRating,
  updateCommunityRating,
  voteCommunityRatingHelpfulness,
} from "@/graphql/actions/group";

export default function CommunityRatings() {
  const params = useParams();
  const communityId = params?.id as string;

  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");

  const [editRatingId, setEditRatingId] = useState<string | null>(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editRatingValue, setEditRatingValue] = useState(5);

  const [deleteRatingId, setDeleteRatingId] = useState<string | null>(null);

  const { data, loading, fetchMore, refetch } = getCommunityRatings({
    variables: {
      communityId,
      limit: 15,
      offset: 0,
      sortBy,
      filterRating,
    },
    fetchPolicy: "cache-and-network",
    skip: !communityId,
  });

  const [delRating, { loading: deleting }] = deleteCommunityRating({
    onCompleted: () => {
      toast.success("Review deleted successfully");
      setDeleteRatingId(null);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete review");
    },
  });

  const [updRating, { loading: updating }] = updateCommunityRating({
    onCompleted: () => {
      toast.success("Review updated successfully");
      setEditRatingId(null);
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update review");
    },
  });

  const [voteRating] = voteCommunityRatingHelpfulness({
    onCompleted: () => {
      refetch();
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to vote on review");
    },
  });

  const handleVote = (ratingId: string, isHelpful: boolean) => {
    voteRating({
      variables: {
        ratingId,
        isHelpful,
      },
    });
  };

  const ratingsList = data?.getCommunityRatings?.data || [];
  const totalCount = data?.getCommunityRatings?.totalCount || 0;

  const handleLoadMore = () => {
    fetchMore({
      variables: {
        offset: ratingsList.length,
      },
      updateQuery: (prev: any, { fetchMoreResult }: any) => {
        if (!fetchMoreResult) return prev;
        return {
          getCommunityRatings: {
            ...fetchMoreResult.getCommunityRatings,
            data: [
              ...prev.getCommunityRatings.data,
              ...fetchMoreResult.getCommunityRatings.data,
            ],
          },
        };
      },
    });
  };

  const openEditDialog = (rating: any) => {
    setEditRatingId(rating.id);
    setEditReviewText(rating.review || "");
    setEditRatingValue(rating.rating);
  };

  const handleUpdate = () => {
    updRating({
      variables: {
        input: {
          id: editRatingId,
          review: editReviewText,
          rating: editRatingValue,
        },
      },
    });
  };

  const renderStars = (rating: number, size = "h-3.5 w-3.5") => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(
              size,
              i <= Math.round(rating)
                ? "fill-amber-400 text-amber-400"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
    );
  };

  const summary = data?.getCommunityRatings?.summary || {
    totalRatings: 0,
    averageRating: 0,
    oneStar: 0,
    twoStar: 0,
    threeStar: 0,
    fourStar: 0,
    fiveStar: 0,
  };

  const calcPercentage = (count: number, total: number) =>
    total > 0 ? Math.round((count / total) * 100) : 0;

  const ratingData = [
    { stars: 5, count: summary.fiveStar, percentage: calcPercentage(summary.fiveStar, summary.totalRatings) },
    { stars: 4, count: summary.fourStar, percentage: calcPercentage(summary.fourStar, summary.totalRatings) },
    { stars: 3, count: summary.threeStar, percentage: calcPercentage(summary.threeStar, summary.totalRatings) },
    { stars: 2, count: summary.twoStar, percentage: calcPercentage(summary.twoStar, summary.totalRatings) },
    { stars: 1, count: summary.oneStar, percentage: calcPercentage(summary.oneStar, summary.totalRatings) },
  ];

  return (
    <div className="space-y-6">
      {/* ─── Top Control Strip ────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card/60 backdrop-blur-sm border border-border/70 rounded-xl p-4 shadow-sm">
        <div>
          <h2 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
            Ratings & Feedback
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Member reviews, satisfaction scores, and feedback distribution.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[125px] h-8 text-xs bg-background">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-[125px] h-8 text-xs bg-background">
              <div className="flex items-center gap-1.5 text-xs">
                <Filter className="h-3 w-3 text-muted-foreground" />
                <SelectValue placeholder="Rating" />
              </div>
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="all">All Stars</SelectItem>
              <SelectItem value="5">5 Stars</SelectItem>
              <SelectItem value="4">4 Stars</SelectItem>
              <SelectItem value="3">3 Stars</SelectItem>
              <SelectItem value="2">2 Stars</SelectItem>
              <SelectItem value="1">1 Star</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-8 px-2.5 text-xs text-muted-foreground hover:text-foreground"
            title="Refresh reviews"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* ─── 2-Column Shopify Layout (1/3 Score Breakdown + 2/3 Reviews Feed) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* ─── Left Column (1/3 Rating Summary) ─────────────────────────────── */}
        <div className="space-y-4">
          <div className="bg-card border border-border/80 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-foreground">Score Summary</h3>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-5xl font-extrabold tracking-tight text-foreground tabular-nums">
                {summary.averageRating ? summary.averageRating.toFixed(1) : "0.0"}
              </span>
              <div className="space-y-1">
                {renderStars(summary.averageRating, "h-4 w-4")}
                <p className="text-[11px] text-muted-foreground">
                  {summary.totalRatings} total reviews
                </p>
              </div>
            </div>

            {/* Rating Bars Distribution */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              {ratingData.map((item) => (
                <div key={item.stars} className="flex items-center gap-2 text-xs">
                  <span className="w-12 text-[11px] text-muted-foreground flex items-center gap-1 shrink-0">
                    {item.stars} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-[11px] text-muted-foreground text-right tabular-nums">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Right Column (2/3 Reviews List) ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-3">
          {loading && ratingsList.length === 0 ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : ratingsList.length === 0 ? (
            <div className="bg-card border border-dashed border-border/80 rounded-xl p-12 text-center text-xs text-muted-foreground">
              <Star className="h-8 w-8 mx-auto opacity-40 mb-2" />
              <p className="font-medium text-foreground">No reviews found</p>
              <p className="text-muted-foreground mt-0.5">
                {filterRating !== "all"
                  ? "No reviews match the selected star filter."
                  : "Community members have not submitted any reviews yet."}
              </p>
            </div>
          ) : (
            <>
              {ratingsList.map((review: any) => {
                const fullName = `${review.user?.firstName || ""} ${review.user?.lastName || ""}`.trim();
                const initial =
                  review.user?.firstName?.charAt(0) ||
                  review.user?.lastName?.charAt(0) ||
                  "U";

                return (
                  <div
                    key={review.id}
                    className="bg-card border border-border/80 hover:border-border rounded-xl p-4 shadow-sm transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <UserProfileHoverCard user={review.user ?? {}}>
                          <Avatar className="h-8 w-8 rounded-lg border border-border/60 cursor-pointer">
                            <AvatarImage src={review.user?.avatar ?? ""} />
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                              {initial}
                            </AvatarFallback>
                          </Avatar>
                        </UserProfileHoverCard>

                        <div>
                          <div className="flex items-center gap-2">
                            <UserProfileHoverCard user={review.user ?? {}}>
                              <span className="text-xs font-semibold text-foreground hover:text-primary transition-colors cursor-pointer">
                                {fullName || "Anonymous Member"}
                              </span>
                            </UserProfileHoverCard>
                            {review.isVerified && (
                              <Badge
                                variant="outline"
                                className="px-1.5 py-0 text-[9px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                              >
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            {renderStars(review.rating, "h-3 w-3")}
                            <span className="text-[10px] text-muted-foreground">
                              {moment(Number(review.createdAt) || review.createdAt).fromNow()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground">
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 text-xs">
                          <DropdownMenuItem onClick={() => openEditDialog(review)} className="text-xs gap-1.5">
                            <Edit className="h-3.5 w-3.5" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive text-xs gap-1.5"
                            onClick={() => setDeleteRatingId(review.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {review.review && (
                      <p className="text-xs text-foreground/90 leading-relaxed pl-11">
                        {review.review}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pl-11 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[11px] font-medium gap-1 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50"
                        onClick={() => handleVote(review.id, true)}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        Helpful ({review.helpfulCount || 0})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[11px] font-medium gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        onClick={() => handleVote(review.id, false)}
                      >
                        <ThumbsDown className="h-3 w-3" />
                        Not helpful ({review.unhelpfulCount || 0})
                      </Button>
                    </div>
                  </div>
                );
              })}

              {ratingsList.length < totalCount && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="w-full h-8 text-xs text-muted-foreground border-dashed"
                >
                  {loading && <Loader2 className="h-3 w-3 animate-spin mr-1.5" />}
                  Load More Reviews ({ratingsList.length} of {totalCount})
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ─── Edit Review Dialog ────────────────────────────────────────────── */}
      <Dialog open={!!editRatingId} onOpenChange={(o) => !o && setEditRatingId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Edit Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">Score Rating</Label>
              <Select value={String(editRatingValue)} onValueChange={(v) => setEditRatingValue(Number(v))}>
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent className="text-xs">
                  {[5, 4, 3, 2, 1].map((val) => (
                    <SelectItem key={val} value={String(val)}>
                      {val} Stars
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">Review Content</Label>
              <Textarea
                value={editReviewText}
                onChange={(e) => setEditReviewText(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="text-xs resize-none"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" onClick={() => setEditRatingId(null)} className="h-8 text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleUpdate} disabled={updating} className="h-8 text-xs">
              {updating && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ─── Delete Review Dialog ──────────────────────────────────────────── */}
      <AlertDialog open={!!deleteRatingId} onOpenChange={(o) => !o && setDeleteRatingId(null)}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">Delete Review</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              This review will be permanently deleted and score aggregates will be recalculated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel disabled={deleting} className="h-8 text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-8 text-xs shadow-sm"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                delRating({ variables: { id: deleteRatingId } });
              }}
            >
              {deleting && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

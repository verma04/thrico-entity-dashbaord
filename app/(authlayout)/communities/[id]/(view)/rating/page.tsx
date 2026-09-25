"use client";

import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  Loader2,
  RotateCcw,
  Sparkles,
  Upload,
  MessageSquare,
  CheckCircle2,
  Heart,
  TrendingUp,
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
import { buildCsv, downloadCsv } from "@/lib/export-csv";

export default function CommunityRatings() {
  const params = useParams();
  const communityId = params?.id as string;

  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [editRatingId, setEditRatingId] = useState<string | null>(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editRatingValue, setEditRatingValue] = useState(5);

  const [deleteRatingId, setDeleteRatingId] = useState<string | null>(null);

  const { data, loading, fetchMore, refetch } = getCommunityRatings({
    variables: {
      communityId,
      limit: 20,
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast.success("Ratings refreshed");
    } catch {
      toast.error("Failed to refresh reviews");
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const ratingsList = data?.getCommunityRatings?.data || [];
  const totalCount = data?.getCommunityRatings?.totalCount || 0;

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

  const positiveRate = useMemo(() => {
    if (!summary.totalRatings) return 100;
    const positive = (summary.fourStar || 0) + (summary.fiveStar || 0);
    return Math.round((positive / summary.totalRatings) * 100);
  }, [summary]);

  const totalHelpfulVotes = useMemo(() => {
    return ratingsList.reduce((acc: number, r: any) => acc + (r.helpfulCount || 0), 0);
  }, [ratingsList]);

  const ratingData = [
    {
      stars: 5,
      count: summary.fiveStar,
      percentage: calcPercentage(summary.fiveStar, summary.totalRatings),
    },
    {
      stars: 4,
      count: summary.fourStar,
      percentage: calcPercentage(summary.fourStar, summary.totalRatings),
    },
    {
      stars: 3,
      count: summary.threeStar,
      percentage: calcPercentage(summary.threeStar, summary.totalRatings),
    },
    {
      stars: 2,
      count: summary.twoStar,
      percentage: calcPercentage(summary.twoStar, summary.totalRatings),
    },
    {
      stars: 1,
      count: summary.oneStar,
      percentage: calcPercentage(summary.oneStar, summary.totalRatings),
    },
  ];

  const handleExportReviews = () => {
    if (ratingsList.length === 0) {
      toast.error("No reviews available to export");
      return;
    }

    const csv = buildCsv(ratingsList, [
      { header: "Review ID", getValue: (r: any) => r.id },
      {
        header: "Author",
        getValue: (r: any) =>
          `${r.user?.firstName || ""} ${r.user?.lastName || ""}`.trim() ||
          "Anonymous",
      },
      { header: "Author Email", getValue: (r: any) => r.user?.email || "" },
      { header: "Score", getValue: (r: any) => r.rating },
      { header: "Review Text", getValue: (r: any) => r.review || "" },
      { header: "Helpful Votes", getValue: (r: any) => r.helpfulCount || 0 },
      {
        header: "Date",
        getValue: (r: any) =>
          moment(Number(r.createdAt) || r.createdAt).format("YYYY-MM-DD HH:mm"),
      },
    ]);

    downloadCsv(csv, `community-ratings-${moment().format("YYYY-MM-DD")}`);
    toast.success(`Exported ${ratingsList.length} reviews successfully`);
  };

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

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* ── Top Scorecard Metrics ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Average Score
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold px-1.5 py-0.2 bg-amber-50 dark:bg-amber-950/50 rounded">
              Overall
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums flex items-center gap-1">
              {summary.averageRating ? summary.averageRating.toFixed(1) : "0.0"}
              <Star className="h-4 w-4 fill-amber-400 text-amber-400 inline" />
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              out of 5
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-1">
            Calculated from {summary.totalRatings} ratings
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Total Reviews
            </span>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold px-1.5 py-0.2 bg-blue-50 dark:bg-blue-950/50 rounded">
              Verified
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {summary.totalRatings.toLocaleString()}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              submitted
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-1">
            Active community members
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Positive Sentiment
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.2 bg-emerald-50 dark:bg-emerald-950/50 rounded">
              Satisfaction
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {positiveRate}%
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              favorable
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-1">
            Rated 4 or 5 stars by members
          </p>
        </div>

        <div className="p-4 rounded-xl border border-border/60 bg-card space-y-1 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Helpful Votes
            </span>
            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold px-1.5 py-0.2 bg-purple-50 dark:bg-purple-950/50 rounded">
              Feedback
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
              {totalHelpfulVotes}
            </span>
            <span className="text-[11px] text-muted-foreground font-medium">
              upvotes
            </span>
          </div>
          <p className="text-[10.5px] text-muted-foreground pt-1">
            Community moderation consensus
          </p>
        </div>
      </div>

      {/* ── Subheader Action Bar ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card border border-border/60 rounded-xl p-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <div>
            <h3 className="text-xs font-semibold text-foreground">
              Member Reviews Roster
            </h3>
            <p className="text-[11px] text-muted-foreground">
              Showing {ratingsList.length} of {totalCount} reviews
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[125px] h-8 text-xs rounded-lg bg-background border-border/60 shadow-2xs">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="text-xs">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterRating} onValueChange={setFilterRating}>
            <SelectTrigger className="w-[125px] h-8 text-xs rounded-lg bg-background border-border/60 shadow-2xs">
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
            size="icon"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-8 w-8 rounded-lg border-border/60 text-muted-foreground hover:text-foreground shadow-2xs"
            title="Refresh reviews"
          >
            <RotateCcw
              className={cn(
                "h-3.5 w-3.5",
                isRefreshing && "animate-spin text-primary"
              )}
            />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleExportReviews}
            className="h-8 text-xs font-medium gap-1.5 border-border/60 rounded-lg shadow-2xs hover:bg-muted/60"
          >
            <Upload className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>

      {/* ── 2-Column Layout (1/3 Summary + 2/3 Reviews Feed) ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column (1/3 Rating Breakdown) */}
        <div className="space-y-4">
          <div className="bg-card border border-border/60 rounded-xl p-5 shadow-2xs space-y-5">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold text-foreground">
                Score Summary
              </h3>
            </div>

            <div className="flex items-baseline gap-3.5">
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
                <div
                  key={item.stars}
                  onClick={() => setFilterRating(String(item.stars))}
                  className="flex items-center gap-2 text-xs group cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <span className="w-12 text-[11px] text-muted-foreground flex items-center gap-1 shrink-0 font-medium">
                    {item.stars}{" "}
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
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

            {filterRating !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilterRating("all")}
                className="w-full h-7 text-xs text-muted-foreground hover:text-foreground border border-dashed rounded-lg"
              >
                Clear Star Filter
              </Button>
            )}
          </div>
        </div>

        {/* Right Column (2/3 Reviews List) */}
        <div className="lg:col-span-2 space-y-3">
          {loading && ratingsList.length === 0 ? (
            <div className="flex justify-center p-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : ratingsList.length === 0 ? (
            <div className="bg-card border border-dashed border-border/80 rounded-xl p-16 text-center text-xs text-muted-foreground shadow-2xs space-y-2">
              <Star className="h-10 w-10 mx-auto opacity-30 text-amber-400" />
              <p className="font-semibold text-foreground text-sm">
                No reviews found
              </p>
              <p className="text-muted-foreground max-w-sm mx-auto">
                {filterRating !== "all"
                  ? "No reviews match the selected star filter."
                  : "Community members have not submitted any reviews yet."}
              </p>
              {filterRating !== "all" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFilterRating("all")}
                  className="mt-2 h-7 text-xs font-semibold"
                >
                  Show All Reviews
                </Button>
              )}
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
                    className="bg-card border border-border/60 hover:border-border rounded-xl p-4 shadow-2xs transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <UserProfileHoverCard user={review.user ?? {}}>
                          <Avatar className="h-9 w-9 rounded-xl border border-border/60 cursor-pointer shadow-xs">
                            <AvatarImage src={review.user?.avatar ?? ""} />
                            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-bold">
                              {initial}
                            </AvatarFallback>
                          </Avatar>
                        </UserProfileHoverCard>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
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
                                Verified Member
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
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32 text-xs">
                          <DropdownMenuItem
                            onClick={() => openEditDialog(review)}
                            className="text-xs gap-1.5 cursor-pointer"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            Edit Review
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive text-xs gap-1.5 cursor-pointer"
                            onClick={() => setDeleteRatingId(review.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {review.review && (
                      <p className="text-xs text-foreground/90 leading-relaxed pl-12">
                        {review.review}
                      </p>
                    )}

                    <div className="flex items-center gap-2 pl-12 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[11px] font-medium gap-1 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-md"
                        onClick={() => handleVote(review.id, true)}
                      >
                        <ThumbsUp className="h-3 w-3" />
                        Helpful ({review.helpfulCount || 0})
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-[11px] font-medium gap-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md"
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
                  className="w-full h-8 text-xs text-muted-foreground border-dashed rounded-lg"
                >
                  {loading && (
                    <Loader2 className="h-3 w-3 animate-spin mr-1.5" />
                  )}
                  Load More Reviews ({ratingsList.length} of {totalCount})
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Edit Review Dialog ────────────────────────────────────────────── */}
      <Dialog
        open={!!editRatingId}
        onOpenChange={(o) => !o && setEditRatingId(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">
              Edit Review
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-foreground">
                Score Rating
              </Label>
              <Select
                value={String(editRatingValue)}
                onValueChange={(v) => setEditRatingValue(Number(v))}
              >
                <SelectTrigger className="h-8 text-xs rounded-lg">
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
              <Label className="text-xs font-medium text-foreground">
                Review Content
              </Label>
              <Textarea
                value={editReviewText}
                onChange={(e) => setEditReviewText(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="text-xs resize-none rounded-lg"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditRatingId(null)}
              className="h-8 text-xs rounded-lg"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUpdate}
              disabled={updating}
              className="h-8 text-xs rounded-lg bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900"
            >
              {updating && (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              )}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Review Dialog ──────────────────────────────────────────── */}
      <AlertDialog
        open={!!deleteRatingId}
        onOpenChange={(o) => !o && setDeleteRatingId(null)}
      >
        <AlertDialogContent className="sm:max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold">
              Delete Review
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-muted-foreground">
              This review will be permanently deleted and score aggregates will be recalculated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel disabled={deleting} className="h-8 text-xs rounded-lg">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-8 text-xs shadow-2xs rounded-lg"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                delRating({ variables: { id: deleteRatingId } });
              }}
            >
              {deleting && (
                <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
              )}
              Delete Review
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

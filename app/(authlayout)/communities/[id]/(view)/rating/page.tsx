"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Filter,
  ArrowUpDown,
  MoreVertical,
  Trash,
  Edit,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
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
import { Separator } from "@/components/ui/separator";
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
import { useToast } from "@/components/ui/use-toast";
import { UserProfileHoverCard } from "@/components/shared/user-profile-hover-card";

import {
  getCommunityRatings,
  deleteCommunityRating,
  updateCommunityRating,
  voteCommunityRatingHelpfulness,
} from "@/graphql/actions/group";

export default function CommunityRatings() {
  const params = useParams();
  const communityId = params?.id as string;
  const { toast } = useToast();

  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");

  const [editRatingId, setEditRatingId] = useState<string | null>(null);
  const [editReviewText, setEditReviewText] = useState("");
  const [editRatingValue, setEditRatingValue] = useState(5);

  const [deleteRatingId, setDeleteRatingId] = useState<string | null>(null);

  const { data, loading, fetchMore, refetch } = getCommunityRatings({
    variables: {
      communityId,
      limit: 10,
      offset: 0,
      sortBy,
      filterRating,
    },
    fetchPolicy: "cache-and-network",
  });

  const [delRating, { loading: deleting }] = deleteCommunityRating({
    onCompleted: () => {
      toast({ title: "Rating deleted successfully" });
      setDeleteRatingId(null);
      refetch();
    },
    onError: (err: any) => {
      toast({
        title: "Error deleting rating",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const [updRating, { loading: updating }] = updateCommunityRating({
    onCompleted: () => {
      toast({ title: "Rating updated successfully" });
      setEditRatingId(null);
    },
    onError: (err: any) => {
      toast({
        title: "Error updating rating",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const [voteRating] = voteCommunityRatingHelpfulness({
    onCompleted: () => {
      // Data is refetched or cache is updated, for now just refetch
      refetch();
    },
    onError: (err: any) => {
      toast({
        title: "Error voting on rating",
        description: err.message,
        variant: "destructive",
      });
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

  const renderStars = (rating: number, size = "h-4 w-4") => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              size,
              i < Math.floor(rating)
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
    total > 0 ? (count / total) * 100 : 0;

  const ratingData = [
    { stars: 5, count: summary.fiveStar, percentage: calcPercentage(summary.fiveStar, summary.totalRatings) },
    { stars: 4, count: summary.fourStar, percentage: calcPercentage(summary.fourStar, summary.totalRatings) },
    { stars: 3, count: summary.threeStar, percentage: calcPercentage(summary.threeStar, summary.totalRatings) },
    { stars: 2, count: summary.twoStar, percentage: calcPercentage(summary.twoStar, summary.totalRatings) },
    { stars: 1, count: summary.oneStar, percentage: calcPercentage(summary.oneStar, summary.totalRatings) },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Ratings & Reviews
          </h1>
          <p className="text-muted-foreground mt-1">
            Detailed feedback from the community members.
          </p>
        </div>
      </header>

      {/* Main Content - Overview & Reviews */}
      <div className="space-y-8">
        <Card className="border-none shadow-lg shadow-black/[0.03] ring-1 ring-border/40 rounded-2xl overflow-hidden bg-gradient-to-br from-card to-amber-50/20">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                <div className="space-y-1">
                  <span className="text-7xl font-black tracking-tighter text-foreground">
                    {summary.averageRating || "0.0"}
                  </span>
                  <div className="flex justify-center md:justify-start">
                    {renderStars(Number(summary.averageRating) || 0, "h-6 w-6")}
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    {totalCount} Total Ratings
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {ratingData.map((item) => (
                  <div
                    key={item.stars}
                    className="flex items-center gap-4 group"
                  >
                    <div className="flex items-center gap-1.5 w-10">
                      <span className="text-sm font-bold text-foreground">
                        {item.stars}
                      </span>
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <Progress
                      value={item.percentage}
                      className="h-2 flex-1 bg-muted group-hover:bg-muted/80 transition-colors [&>div]:bg-amber-500"
                    />
                    <span className="text-[11px] font-bold text-muted-foreground w-8 tabular-nums">
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <h3 className="font-semibold text-lg">Reviews List</h3>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[160px] bg-card rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Sort by" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl">
                <SelectItem value="newest" className="rounded-lg">Newest First</SelectItem>
                <SelectItem value="oldest" className="rounded-lg">Oldest First</SelectItem>
                <SelectItem value="helpful" className="rounded-lg">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger className="w-full sm:w-[140px] bg-card rounded-xl">
                <div className="flex items-center gap-2 text-xs font-semibold">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  <SelectValue placeholder="Filter stars" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl shadow-xl">
                <SelectItem value="all" className="rounded-lg">All Ratings</SelectItem>
                <SelectItem value="5" className="rounded-lg">5 Stars</SelectItem>
                <SelectItem value="4" className="rounded-lg">4 Stars</SelectItem>
                <SelectItem value="3" className="rounded-lg">3 Stars</SelectItem>
                <SelectItem value="2" className="rounded-lg">2 Stars</SelectItem>
                <SelectItem value="1" className="rounded-lg">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4">
          {loading && ratingsList.length === 0 ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : ratingsList.length === 0 ? (
            <div className="text-center p-12 border border-dashed rounded-2xl bg-card/50">
              <Star className="h-8 w-8 text-muted-foreground/40 mx-auto mb-4" />
              <p className="text-base font-semibold">No ratings found</p>
              <p className="text-sm text-muted-foreground">Be the first to review this community.</p>
            </div>
          ) : (
            ratingsList.map((review: any) => (
              <Card
                key={review.id}
                className="border-none shadow-sm shadow-black/[0.02] ring-1 ring-border/40 overflow-hidden group hover:ring-primary/20 transition-all relative rounded-2xl"
              >
                <CardContent className="p-6">
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground rounded-lg">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-xl shadow-xl min-w-[140px]">
                        <DropdownMenuItem onClick={() => openEditDialog(review)} className="rounded-lg font-medium">
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600 focus:bg-red-50 focus:text-red-700 rounded-lg font-medium"
                          onClick={() => setDeleteRatingId(review.id)}
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex gap-5">
                    <UserProfileHoverCard user={review.user || {}}>
                      <div className="cursor-pointer shrink-0 mt-1">
                        <Avatar className="h-12 w-12 border border-border/50 ring-1 ring-black/[0.04]">
                          <AvatarImage src={review.user?.avatar || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
                            {(review.user?.firstName?.[0] || "") + (review.user?.lastName?.[0] || "")}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </UserProfileHoverCard>
                    <div className="flex-1 space-y-3">
                      <div className="flex flex-col pr-8">
                        <div className="flex items-center gap-2">
                          <UserProfileHoverCard user={review.user || {}}>
                            <span className="font-semibold text-base text-foreground cursor-pointer hover:underline">
                              {review.user?.firstName} {review.user?.lastName}
                            </span>
                          </UserProfileHoverCard>
                          {review.isVerified && (
                            <Badge
                              variant="outline"
                              className="px-1.5 py-0 h-5 gap-1 bg-blue-50 text-blue-700 border-blue-200 text-[10px] uppercase tracking-wider font-semibold rounded-md"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          {renderStars(review.rating, "h-3.5 w-3.5")}
                          <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                            {new Date(Number(review.createdAt)).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {review.review || "No review text provided."}
                      </p>

                      <div className="flex items-center gap-2 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-xs font-semibold gap-1.5 text-muted-foreground hover:text-emerald-600 hover:bg-emerald-50 transition-colors rounded-lg"
                          onClick={() => handleVote(review.id, true)}
                        >
                          <ThumbsUp className="h-3.5 w-3.5" />
                          Helpful ({review.helpfulCount || 0})
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2.5 text-xs font-semibold gap-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors rounded-lg"
                          onClick={() => handleVote(review.id, false)}
                        >
                          <ThumbsDown className="h-3.5 w-3.5" />
                          Not helpful ({review.unhelpfulCount || 0})
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}

          {ratingsList.length < totalCount && (
            <Button
              variant="outline"
              onClick={handleLoadMore}
              disabled={loading}
              className="w-full h-12 rounded-xl border-dashed border-2 hover:border-primary/40 hover:bg-primary/5 text-muted-foreground font-semibold transition-all"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Load More Reviews
            </Button>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editRatingId} onOpenChange={(o) => !o && setEditRatingId(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>Edit Rating</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Rating (Stars)</Label>
              <Select value={String(editRatingValue)} onValueChange={(v) => setEditRatingValue(Number(v))}>
                <SelectTrigger className="rounded-xl h-11">
                  <SelectValue placeholder="Select rating" />
                </SelectTrigger>
                <SelectContent className="rounded-xl shadow-xl">
                  {[5, 4, 3, 2, 1].map((val) => (
                    <SelectItem key={val} value={String(val)} className="rounded-lg">
                      {val} Stars
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2.5">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Review Text</Label>
              <Textarea
                value={editReviewText}
                onChange={(e) => setEditReviewText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={5}
                className="rounded-xl resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setEditRatingId(null)} className="rounded-xl">Cancel</Button>
            <Button onClick={handleUpdate} disabled={updating} className="rounded-xl shadow-sm">
              {updating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Alert Dialog */}
      <AlertDialog open={!!deleteRatingId} onOpenChange={(o) => !o && setDeleteRatingId(null)}>
        <AlertDialogContent className="rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this review
              from the community.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting} className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm"
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                delRating({ variables: { id: deleteRatingId } });
              }}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {deleting ? "Deleting..." : "Delete Rating"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

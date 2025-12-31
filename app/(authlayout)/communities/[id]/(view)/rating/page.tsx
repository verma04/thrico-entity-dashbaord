"use client";

import { useState } from "react";
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  TrendingUp,
  PenSquare,
  Filter,
  ArrowUpDown,
  User,
  MessageSquare,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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

export default function CommunityRatings() {
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");

  const ratingData = [
    { stars: 5, count: 78, percentage: 65 },
    { stars: 4, count: 45, percentage: 38 },
    { stars: 3, count: 18, percentage: 15 },
    { stars: 2, count: 8, percentage: 7 },
    { stars: 1, count: 7, percentage: 6 },
  ];

  const categoryRatings = [
    { category: "Content Quality", rating: 4.7, color: "bg-blue-500" },
    { category: "Community Support", rating: 4.8, color: "bg-green-500" },
    { category: "Moderation", rating: 4.5, color: "bg-orange-500" },
    { category: "Educational Value", rating: 4.6, color: "bg-purple-500" },
    { category: "User Experience", rating: 4.4, color: "bg-sky-500" },
  ];

  const renderStars = (rating: number, size = "h-4 w-4") => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={cn(
              size,
              i < Math.floor(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            )}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-4 sm:p-6 bg-background/50 min-h-screen animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Ratings & Reviews
            </h1>
            <p className="text-muted-foreground">
              Detailed feedback from the community members.
            </p>
          </div>
          <Button className="gap-2 shadow-lg shadow-primary/20 h-11 px-6">
            <PenSquare className="h-4 w-4" />
            Write a Review
          </Button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content - Overview & Reviews */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-border/50">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
                    <div className="space-y-1">
                      <span className="text-7xl font-black tracking-tighter text-foreground">
                        4.6
                      </span>
                      <div className="flex justify-center md:justify-start">
                        {renderStars(4.6, "h-6 w-6")}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                        156 Total Ratings
                      </span>
                      <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 w-fit mx-auto md:mx-0">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +0.2 this month
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {ratingData.map((item) => (
                      <div
                        key={item.stars}
                        className="flex items-center gap-4 group"
                      >
                        <div className="flex items-center gap-1 w-8">
                          <span className="text-sm font-bold">
                            {item.stars}
                          </span>
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <Progress
                          value={item.percentage}
                          className="h-2.5 flex-1 bg-muted group-hover:bg-muted/80 transition-colors"
                        />
                        <span className="text-xs font-bold text-muted-foreground w-8 tabular-nums">
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
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <h3 className="font-bold text-lg">Reviews List</h3>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-[160px] bg-background">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <ArrowUpDown className="h-3 w-3 text-muted-foreground" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="helpful">Most Helpful</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterRating} onValueChange={setFilterRating}>
                  <SelectTrigger className="w-full sm:w-[140px] bg-background">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <Filter className="h-3 w-3 text-muted-foreground" />
                      <SelectValue placeholder="Filter stars" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-6">
              {[
                {
                  name: "Sarah Johnson",
                  verified: true,
                  rating: 5,
                  time: "2 days ago",
                  since: "Jan 2024",
                  title: "Amazing photography community!",
                  comment:
                    "This community has helped me improve my photography skills tremendously. The feedback is always constructive and the weekly challenges keep me motivated. Highly recommend to anyone interested in photography!",
                  tags: ["Content Quality", "Community Support"],
                  helpful: 24,
                  notHelpful: 2,
                },
                {
                  name: "Mike Chen",
                  verified: false,
                  rating: 4,
                  time: "1 week ago",
                  since: "Mar 2024",
                  title: "Great community with active members",
                  comment:
                    "Love the active discussions and the variety of photography styles shared. The admins are responsive and the community guidelines are clear. Only wish there were more in-person meetups.",
                  tags: ["Engagement", "Moderation"],
                  helpful: 18,
                  notHelpful: 1,
                },
              ].map((review, i) => (
                <Card
                  key={i}
                  className="border-none shadow-xl shadow-black/5 ring-1 ring-border/50 overflow-hidden group hover:ring-primary/20 transition-all"
                >
                  <CardContent className="p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      <Avatar className="h-14 w-14 ring-2 ring-background border-2 border-primary/10 shrink-0">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary/10 text-primary font-bold">
                          {review.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-lg text-foreground">
                              {review.name}
                            </span>
                            {review.verified && (
                              <Badge
                                variant="outline"
                                className="h-5 gap-1 bg-blue-50 text-blue-700 border-blue-200"
                              >
                                <CheckCircle2 className="h-3 w-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            {renderStars(review.rating, "h-3.5 w-3.5")}
                            <span className="text-xs font-medium text-muted-foreground">
                              {review.time}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-bold text-foreground">
                            {review.title}
                          </h4>
                          <p className="text-sm leading-relaxed text-muted-foreground antialiased">
                            {review.comment}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {review.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="bg-muted/50 text-muted-foreground hover:bg-muted font-medium py-0.5 px-2"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <Separator className="bg-border/50" />

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs text-muted-foreground font-medium">
                            Joined {review.since}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs font-semibold gap-1.5 text-muted-foreground hover:text-green-600 hover:bg-green-50"
                            >
                              <ThumbsUp className="h-3.5 w-3.5" />
                              Helpful ({review.helpful})
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-xs font-semibold gap-1.5 text-muted-foreground hover:text-red-600 hover:bg-red-50"
                            >
                              <ThumbsDown className="h-3.5 w-3.5" />
                              Not helpful ({review.notHelpful})
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                variant="outline"
                className="w-full h-12 border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground font-bold"
              >
                Load More Reviews
              </Button>
            </div>
          </div>

          {/* Sidebar - Category breakdown */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="border-none shadow-xl shadow-black/5 ring-1 ring-border/50 overflow-hidden sticky top-6">
              <CardHeader className="bg-muted/30 pb-4">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Category Ratings</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-8">
                {categoryRatings.map((item) => (
                  <div key={item.category} className="space-y-3 group">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-bold text-foreground/80 group-hover:text-primary transition-colors">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1.5 px-2 py-0.5 bg-muted rounded-full text-xs font-black">
                        <span>{item.rating}</span>
                        <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                      </div>
                    </div>
                    <Progress
                      value={item.rating * 20}
                      className={cn(
                        "h-1.5 bg-muted transition-all duration-1000 group-hover:h-2"
                      )}
                    />
                  </div>
                ))}

                <Separator className="bg-border/50" />

                <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Star className="h-6 w-6 text-primary fill-primary/20" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground">
                        Highest Rated Community
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed px-4">
                        Members consistently praise our high quality educational
                        content and moderation.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { BarChart3 } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePostAnalytics } from "@/graphql/actions/feed";

const currentFeed = {
  id: 2,
  author: {
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "UX Designer",
    verified: false,
  },
  timePosted: "12 hours ago",
  visibility: "public",
  content: {
    text: "Just finished my latest design project!",
    description:
      "Really excited to share this new dashboard design with everyone. Let me know what you think!",
    image: "/placeholder.svg?height=400&width=600",
  },
  stats: {
    likes: 78,
    comments: 23,
    shares: 5,
    views: 845,
  },
};

const feedData = [
  {
    id: 1,
    author: {
      name: "Pankaj Verma",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Software Developer",
      verified: true,
    },
    timePosted: "6 hours ago",
    visibility: "public",
    content: {
      text: "Google",
      description: "Google to Migrate Ad Tech Stack to JavaScript!",
      image: "/placeholder.svg?height=400&width=600",
    },
    stats: {
      likes: 42,
      comments: 8,
      shares: 12,
      views: 1024,
    },
  },
  {
    id: 2,
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "UX Designer",
      verified: false,
    },
    timePosted: "12 hours ago",
    visibility: "public",
    content: {
      text: "Just finished my latest design project!",
      description:
        "Really excited to share this new dashboard design with everyone. Let me know what you think!",
      image: "/placeholder.svg?height=400&width=600",
    },
    stats: {
      likes: 78,
      comments: 23,
      shares: 5,
      views: 845,
    },
  },
  {
    id: 3,
    author: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=100&width=100",
      role: "Product Manager",
      verified: true,
    },
    timePosted: "1 day ago",
    visibility: "private",
    content: {
      text: "Team update",
      description:
        "We've hit our quarterly goals! Great job everyone on the team for your hard work and dedication.",
      image: null,
    },
    stats: {
      likes: 56,
      comments: 14,
      shares: 3,
      views: 320,
    },
  },
];

const getAnalyticsData = (feedId: number) => {
  const feed = feedData.find((f) => f.id === feedId);
  if (!feed) return null;

  return {
    engagement: [
      { name: "Likes", value: feed.stats.likes, color: "text-red-500" },
      { name: "Comments", value: feed.stats.comments, color: "text-blue-500" },
      { name: "Shares", value: feed.stats.shares, color: "text-green-500" },
    ],
    demographics: {
      age: [
        { group: "18-24", percentage: 35 },
        { group: "25-34", percentage: 45 },
        { group: "35-44", percentage: 15 },
        { group: "45+", percentage: 5 },
      ],
      location: [
        { country: "United States", percentage: 40 },
        { country: "India", percentage: 30 },
        { country: "Europe", percentage: 20 },
        { country: "Other", percentage: 10 },
      ],
    },
    reachData: {
      total: feed.stats.views,
      organic: Math.floor(feed.stats.views * 0.7),
      paid: Math.floor(feed.stats.views * 0.3),
    },
  };
};

const Analytics = ({ feedId }: { feedId?: string }) => {
  const { data, loading } = usePostAnalytics(feedId || "");
  const analyticsData = data?.getPostAnalytics;

  const [analyticsVisible, setAnalyticsVisible] = useState(false);

  return (
    <>
      <Button
        onClick={() => setAnalyticsVisible(true)}
        variant="ghost"
        size="sm"
      >
        <BarChart3 className="h-4 w-4" />
        Analytics
      </Button>
      <Dialog open={analyticsVisible} onOpenChange={setAnalyticsVisible}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b border-border">
            <DialogTitle className="text-3xl font-bold tracking-tight">Post Analytics</DialogTitle>
          </DialogHeader>

          <div className="space-y-12 py-6">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-[12px] font-bold text-foreground uppercase tracking-widest animate-pulse">Analyzing engagement...</p>
              </div>
            ) : !analyticsData ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-muted-foreground italic">No analytics data available for this post.</p>
              </div>
            ) : (
              <>
                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-[11px] font-bold text-foreground uppercase tracking-[0.3em] whitespace-nowrap">
                      Engagement Overview
                    </h3>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {analyticsData?.engagement.map((item) => (
                      <Card key={item.name} className="bg-charcoal-3 border-none shadow-none">
                        <CardContent className="py-8">
                          <div className="text-center">
                            <p className="text-3xl font-bold tracking-tight text-foreground mb-1">{item.value}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                              {item.name}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-[11px] font-bold text-foreground uppercase tracking-[0.3em] whitespace-nowrap">
                      Reach & Visibility
                    </h3>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-charcoal-4 border-none shadow-none">
                      <CardContent className="py-8">
                        <div className="text-center">
                          <p className="text-3xl font-bold tracking-tight text-foreground mb-1">
                            {analyticsData?.reachData.total}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Total Views
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border border-border shadow-none">
                      <CardContent className="py-8">
                        <div className="text-center">
                          <p className="text-3xl font-bold tracking-tight text-foreground mb-1">
                            {analyticsData?.reachData.organic}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Organic Reach
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border border-border shadow-none">
                      <CardContent className="py-8">
                        <div className="text-center">
                          <p className="text-3xl font-bold tracking-tight text-foreground mb-1">
                            {analyticsData?.reachData.paid}
                          </p>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                            Paid Reach
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-4">
                    <h3 className="text-[11px] font-bold text-foreground uppercase tracking-[0.3em] whitespace-nowrap">
                      Audience Demographics
                    </h3>
                    <div className="h-px bg-border flex-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <Card className="border border-border">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                          Age Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analyticsData?.demographics.age.map((item) => (
                            <div key={item.group} className="space-y-1.5">
                              <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide">
                                <span className="text-muted-foreground">{item.group}</span>
                                <span className="text-foreground">{item.percentage}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-charcoal-4 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-foreground rounded-full"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border border-border">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
                          Geographic Distribution
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {analyticsData?.demographics.location.map((item) => (
                            <div key={item.country} className="space-y-1.5">
                              <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wide">
                                <span className="text-muted-foreground">{item.country}</span>
                                <span className="text-foreground">{item.percentage}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-charcoal-4 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-foreground rounded-full opacity-60"
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Analytics;

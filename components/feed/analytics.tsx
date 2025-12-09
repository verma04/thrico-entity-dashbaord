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

const Analytics = () => {
  const analyticsData = currentFeed.id
    ? getAnalyticsData(currentFeed.id)
    : null;

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
          <DialogHeader>
            <DialogTitle>Post Analytics</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold mb-4">
                Engagement Overview
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {analyticsData?.engagement.map((item) => (
                  <Card key={item.name}>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{item.value}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-4">Reach</h3>
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {analyticsData?.reachData.total}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Views
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {analyticsData?.reachData.organic}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Organic Reach
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold">
                        {analyticsData?.reachData.paid}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Paid Reach
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold mb-4">Demographics</h3>
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Age Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData?.demographics.age.map((item) => (
                        <div key={item.group}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.group}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded">
                            <div
                              className="h-full bg-blue-500 rounded"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Geographic Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analyticsData?.demographics.location.map((item) => (
                        <div key={item.country}>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{item.country}</span>
                            <span>{item.percentage}%</span>
                          </div>
                          <div className="w-full h-2 bg-muted rounded">
                            <div
                              className="h-full bg-green-500 rounded"
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Analytics;

"use client";

import { BarChart3, TrendingUp, Users, Heart, MessageCircle, Share2, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePostAnalytics } from "@/graphql/actions/feed";

const Analytics = ({ feedId }: { feedId?: string }) => {
  const { data, loading } = usePostAnalytics(feedId || "", {
    fetchPolicy: "network-only",
  });
  const analyticsData = data?.getPostAnalytics;

  const [analyticsVisible, setAnalyticsVisible] = useState(false);

  const getMetricIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("like") || lower.includes("reaction")) {
      return { icon: Heart, color: "text-rose-500", bg: "bg-rose-500/10" };
    }
    if (lower.includes("comment") || lower.includes("discussion")) {
      return { icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-500/10" };
    }
    if (lower.includes("share") || lower.includes("reach")) {
      return { icon: Share2, color: "text-emerald-500", bg: "bg-emerald-500/10" };
    }
    return { icon: TrendingUp, color: "text-indigo-500", bg: "bg-indigo-500/10" };
  };

  return (
    <>
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setAnalyticsVisible(true);
        }}
        variant="ghost"
        size="sm"
        className="rounded-lg h-8 px-2.5 font-medium text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all flex items-center gap-1.5"
      >
        <BarChart3 className="h-4 w-4" />
        <span>Analytics</span>
      </Button>

      <Dialog open={analyticsVisible} onOpenChange={setAnalyticsVisible}>
        <DialogContent
          className="sm:max-w-[620px] max-h-[85vh] p-0 overflow-hidden rounded-2xl border border-border shadow-xl flex flex-col bg-background"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogHeader className="p-5 border-b border-border/80 bg-card/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <BarChart3 className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold text-foreground tracking-tight">
                  Post Performance Analytics
                </DialogTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Real-time engagement breakdown and ecosystem reach
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6 overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="h-8 w-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
                <p className="text-xs font-semibold text-muted-foreground">
                  Analyzing post engagement...
                </p>
              </div>
            ) : !analyticsData || !analyticsData?.engagement || analyticsData.engagement.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border border-dashed border-border/60 rounded-xl bg-muted/10">
                <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center mb-2">
                  <Sparkles className="h-5 w-5 text-muted-foreground/60" />
                </div>
                <p className="text-xs font-semibold text-foreground">
                  No analytics data available yet
                </p>
                <p className="text-[11px] text-muted-foreground mt-0.5 max-w-[280px]">
                  Analytics will update as members interact with this post.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Engagement Metrics
                  </span>
                  <div className="h-px bg-border flex-1" />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {analyticsData.engagement.map((item, idx) => {
                    const { icon: MetricIcon, color, bg } = getMetricIcon(item.name);
                    return (
                      <Card
                        key={idx}
                        className="bg-card border border-border/70 rounded-xl p-4 shadow-xs hover:border-border transition-colors"
                      >
                        <CardContent className="p-0 flex flex-col justify-between gap-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground capitalize">
                              {item.name}
                            </span>
                            <div className={`h-7 w-7 rounded-lg ${bg} ${color} flex items-center justify-center`}>
                              <MetricIcon className="h-3.5 w-3.5" />
                            </div>
                          </div>
                          <div>
                            <p className="text-2xl font-bold tracking-tight text-foreground">
                              {item.value}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Analytics;


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



const Analytics = ({ feedId }: { feedId?: string }) => {
  const { data, loading } = usePostAnalytics(feedId || "", {
    fetchPolicy: "network-only",
  });
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


              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Analytics;

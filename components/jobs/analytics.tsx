"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Users, Phone, TrendingUp, TrendingDown } from "lucide-react";
import { useGetListingStatsById } from "../../graphql/actions/listing";

interface AnalyticsProps {
  id: string;
  open: boolean;
  onClose: () => void;
}

const Analytics = ({ id, open, onClose }: AnalyticsProps) => {
  const { data, loading } = useGetListingStatsById({
    variables: { input: { listingId: id } },
  });
  const stats = data?.getListingStatsById;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Job Analytics</DialogTitle>
          <DialogDescription>
            Detailed performance metrics for your job posting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Top Stats Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalViews || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.weeklyViewsDiff || 0} this week
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Unique Views
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.uniqueViews || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{stats?.lastWeekViews || 0} from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Contact Clicks
                </CardTitle>
                <Phone className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalContactClicks || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.contactRate || 0}% contact rate
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Comparison */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Views This Week
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {stats?.thisWeekViews || 0}
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Views Last Week
                </CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats?.lastWeekViews || 0}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Analytics;

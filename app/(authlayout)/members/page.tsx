"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Download, Plus, RotateCcw } from "lucide-react";
import { MembersMetrics } from "@/components/members/dashboard/members-metrics";
import { MembersGrowthChart } from "@/components/members/dashboard/members-growth-chart";
import { MembersRoleChart } from "@/components/members/dashboard/members-role-chart";
import { MembersListCards } from "@/components/members/dashboard/members-listcards";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimeRange } from "@/graphql/actions/dashbaord/dashboard-quries";

const MembersPage = () => {
  const [timePeriod, setTimePeriod] = useState<TimeRange>(
    TimeRange.LAST_7_DAYS,
  );

  return (
    <div className="p-6 space-y-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Members Overview</h1>
          <p className="text-muted-foreground">
            Manage your community members and track growth.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={timePeriod}
            onValueChange={(val) => setTimePeriod(val as TimeRange)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TimeRange.LAST_24_HOURS}>
                Last 24 hours
              </SelectItem>
              <SelectItem value={TimeRange.LAST_7_DAYS}>Last 7 days</SelectItem>
              <SelectItem value={TimeRange.LAST_30_DAYS}>
                Last 30 days
              </SelectItem>
              <SelectItem value={TimeRange.LAST_90_DAYS}>
                Last 90 days
              </SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <MembersMetrics timeRange={timePeriod} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <MembersGrowthChart timeRange={timePeriod} />
        <MembersRoleChart timeRange={timePeriod} />
      </div>

      {/* Members List Cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Community Members</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        <MembersListCards />
      </div>
    </div>
  );
};

export default MembersPage;

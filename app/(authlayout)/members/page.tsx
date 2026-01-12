"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Plus } from "lucide-react";
import { MembersMetrics } from "@/components/members/dashboard/MembersMetrics";
import { MembersGrowthChart } from "@/components/members/dashboard/MembersGrowthChart";
import { MembersRoleChart } from "@/components/members/dashboard/MembersRoleChart";
import { RecentMembersTable } from "@/components/members/dashboard/RecentMembersTable";

const MembersPage = () => {
  const [timeRange, setTimeRange] = useState<string>("7days");

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 space-y-6">
      {/* Header */}
      <Card className="border-none shadow-none bg-transparent">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Members Overview
            </h1>
            <p className="text-muted-foreground">
              Manage your community members and track growth.
            </p>
          </div>
          <div className="flex gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Invite Members
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Metrics */}
      <MembersMetrics />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <MembersGrowthChart />
        <MembersRoleChart />
      </div>

      {/* Recent Members Table */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <RecentMembersTable />
      </div>
    </div>
  );
};

export default MembersPage;

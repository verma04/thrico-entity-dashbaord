import React from "react";
import { DashboardDistributionChart } from "./dashboard-distribution-chart";
import { DashboardSessionRadarChart } from "./dashboard-session-radar-chart";
import { SessionAnalyticsCard } from "@/components/analytics";

interface DashboardTrafficSessionsProps {
  DashboardSectionHeading: React.FC<{ title: string; action?: React.ReactNode; tooltip?: string }>;
}

export function DashboardTrafficSessions({ DashboardSectionHeading }: DashboardTrafficSessionsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 items-stretch">
        <section className="lg:col-span-7 space-y-3 flex flex-col h-full">
          <DashboardSectionHeading title="Platform Traffic" />
          <DashboardDistributionChart />
        </section>
        <section className="lg:col-span-3 space-y-3 flex flex-col h-full">
          <DashboardSectionHeading title="Login Sessions" />
          <DashboardSessionRadarChart />
        </section>
      </div>
      <SessionAnalyticsCard />
    </div>
  );
}

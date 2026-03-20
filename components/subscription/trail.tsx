"use client";

import PlanOverview from "./plan-overview";
import MyPlan from "./my-plan";
import BuyPlan from "./buy-plan/buy-plan";
import { StorageStats } from "./storage-stats";
import { Crown } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";

interface TrailProps {
  storageStats?: any[];
  storageSummary?: any;
}

const Trail = ({ storageStats, storageSummary }: TrailProps) => {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Plans & Pricing"
        description="Get started free. Upgrade for more credits, usage & collaboration."
        icon={Crown}
        badgeText="Billing"
        showLiveIndicator={false}
      />

      <MyPlan />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <PlanOverview />
        </div>
        <div>
          <StorageStats stats={storageStats} summary={storageSummary} />
        </div>
      </div>

      <BuyPlan />
    </EcosystemWrapper>
  );
};

export default Trail;

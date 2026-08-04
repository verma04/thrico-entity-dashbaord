"use client";

import PlanOverview from "./plan-overview";
import MyPlan from "./my-plan";
import BuyPlan from "./buy-plan/buy-plan";
import { StorageStats } from "./storage-stats";
import { Crown } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

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
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Subscription" },
        ]}
        icon={Crown}
        badgeText="Billing"
        showLiveIndicator={false}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-8 space-y-5">
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
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default Trail;

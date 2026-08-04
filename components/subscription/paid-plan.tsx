"use client";

import React from "react";
import Upgrade from "./upgrade/upgrade";
import PlanOverview from "./plan-overview";
import { StorageStats } from "./storage-stats";
import AddonPricingSection from "./addon-pricing-section";
import { Crown } from "lucide-react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

interface PaidPlanProps {
  storageStats?: any[];
  storageSummary?: any;
}

const PaidPlan = ({ storageStats, storageSummary }: PaidPlanProps) => {
  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Subscription"
        description="Manage your plan, add-ons, and billing preferences."
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
          {/* Overview + Storage side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <PlanOverview />
            </div>
            <div>
              <StorageStats stats={storageStats} summary={storageSummary} />
            </div>
          </div>

          {/* Add-ons */}
          <AddonPricingSection />

          {/* Upgrade plans */}
          <Upgrade />
        </div>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
};

export default PaidPlan;

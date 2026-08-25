"use client";

import React, { useState } from "react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Coins, Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillarOneManual } from "@/components/rewards/pillars/manual";

export default function PillarOneManualPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Manual / Internal Vouchers"
        badgeText="Pillar 1"
        description="Create and manage proprietary organization vouchers directly within Thrico with zero external provider costs."
        icon={Coins}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
          { label: "Manual / Internal Vouchers" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsHowItWorksOpen(true)}
              className="text-xs font-semibold h-8 gap-1.5 cursor-pointer shadow-2xs"
            >
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
              How Manual Works
            </Button>

            <Button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-medium text-xs h-8 shadow-2xs cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Create Internal Voucher
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-4 sm:p-5 space-y-4">
        <PillarOneManual
          isExternalDrawerOpen={isDrawerOpen}
          setIsExternalDrawerOpen={setIsDrawerOpen}
          isExternalHowItWorksOpen={isHowItWorksOpen}
          setIsExternalHowItWorksOpen={setIsHowItWorksOpen}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

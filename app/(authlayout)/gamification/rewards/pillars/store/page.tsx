"use client";

import React, { useState } from "react";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { ShoppingBag, Plus, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillarTwoStore } from "@/components/rewards/pillars/store";

export default function PillarTwoStorePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="E-Commerce Store Discounts"
        badgeText="Pillar 2"
        description="Configure on-demand Shopify store discount rules that synthesize single-use promo codes upon member minigame wins."
        icon={ShoppingBag}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
          { label: "E-Commerce" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsHowItWorksOpen(true)}
              className="text-xs font-semibold h-9 gap-1.5 border-indigo-300 dark:border-indigo-800 bg-background/80 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 cursor-pointer shadow-xs"
            >
              <HelpCircle className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              How Store Rewards Work
            </Button>

            <Button
              onClick={() => setIsDrawerOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 font-semibold text-xs h-9 shadow-xs cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Store Reward
            </Button>
          </div>
        }
      />

      <EcosystemContainer className="p-4 sm:p-5 space-y-4">
        <PillarTwoStore
          isExternalDrawerOpen={isDrawerOpen}
          setIsExternalDrawerOpen={setIsDrawerOpen}
          isExternalHowItWorksOpen={isHowItWorksOpen}
          setIsExternalHowItWorksOpen={setIsHowItWorksOpen}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

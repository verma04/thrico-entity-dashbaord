"use client";

import React, { useState } from "react";
import Link from "next/link";
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
              className="text-xs font-semibold h-8 gap-1.5 cursor-pointer shadow-2xs"
            >
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
              How Store Rewards Work
            </Button>

            <Link href="/gamification/rewards/pillars/store/add">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-medium text-xs h-8 shadow-2xs cursor-pointer">
                <Plus className="h-3.5 w-3.5" />
                Create Store Reward
              </Button>
            </Link>
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

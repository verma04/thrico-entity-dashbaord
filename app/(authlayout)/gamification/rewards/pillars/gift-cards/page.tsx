"use client";

import React, { useState } from "react";
import Link from "next/link";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Gift, Plus, HelpCircle, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PillarThreeGiftCards } from "@/components/rewards/pillars/gift-cards";
import { useGetEntityRewardWallet } from "@/graphql/actions/rewards/gift-cards";

export default function PillarThreeGiftCardsPage() {
  const { data: walletData, loading: walletLoading, refetch: refetchWallet } = useGetEntityRewardWallet();
  const wallet = walletData?.getEntityRewardWallet;
  const [localBalanceDelta, setLocalBalanceDelta] = useState<number>(0);

  const walletBalance = (wallet?.balance ?? 0) + localBalanceDelta;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState(false);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);

  const handleTopUpSuccess = (amount: number) => {
    setLocalBalanceDelta((prev) => prev + amount);
    refetchWallet?.();
  };


  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Thrico Digital Gift Cards"
        badgeText="Pillar 3"
        description="Fulfill instant Amazon, Flipkart, Swiggy & top brand gift cards on-demand. Cards are purchased from provider API upon member win with 2-phase reservation protection."
        icon={Gift}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
          { label: "Digital Gift Cards" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setIsTopUpOpen(true)}
              className="text-xs font-semibold h-8 gap-1.5 cursor-pointer shadow-2xs"
            >
              <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
              <span>Wallet: ₹{walletBalance.toLocaleString("en-IN")}</span>
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsHowItWorksOpen(true)}
              className="text-xs font-semibold h-8 gap-1.5 cursor-pointer shadow-2xs"
            >
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
              How Gift Cards Work
            </Button>

            <Link href="/gamification/rewards/pillars/gift-cards/add">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 font-medium text-xs h-8 shadow-2xs cursor-pointer">
                <Plus className="h-3.5 w-3.5" />
                Configure Gift Card
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="p-4 sm:p-5 space-y-4">
        <PillarThreeGiftCards
          isExternalDrawerOpen={isDrawerOpen}
          setIsExternalDrawerOpen={setIsDrawerOpen}
          isExternalHowItWorksOpen={isHowItWorksOpen}
          setIsExternalHowItWorksOpen={setIsHowItWorksOpen}
          isExternalTopUpOpen={isTopUpOpen}
          setIsExternalTopUpOpen={setIsTopUpOpen}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}


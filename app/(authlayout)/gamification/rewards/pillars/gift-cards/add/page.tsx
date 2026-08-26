"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gift, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { GiftCardForm } from "@/components/rewards/pillars/gift-cards/drawer/gift-card-form";
import { useGetEntityRewardWallet } from "@/graphql/actions/rewards/gift-cards";

export default function CreateGiftCardRulePage() {
  const router = useRouter();
  const { data: walletData } = useGetEntityRewardWallet();
  const walletBalance = walletData?.getEntityRewardWallet?.balance ?? 0;

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Configure Digital Gift Card"
        badgeText="Pillar 3"
        description="Configure partner brand, card denomination, service fee calculation, and game allocations for instant win redemption."
        icon={Gift}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
          {
            label: "Digital Gift Cards",
            href: "/gamification/rewards/pillars/gift-cards",
          },
          { label: "Configure Gift Card" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/gamification/rewards/pillars/gift-cards">
              <Button
                variant="outline"
                className="text-[13px] font-medium h-[36px] gap-1.5 border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-[#303030] dark:text-zinc-100 cursor-pointer shadow-xs rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4 text-[#616161]" />
                Back to Gift Cards
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <GiftCardForm
          walletBalance={walletBalance}
          onSuccess={() => {
            router.push("/gamification/rewards/pillars/gift-cards");
          }}
          onCancel={() => {
            router.push("/gamification/rewards/pillars/gift-cards");
          }}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

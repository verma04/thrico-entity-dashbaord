"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { StoreRewardForm } from "@/components/rewards/pillars/store/drawer/store-reward-form";

export default function CreateStoreDiscountRulePage() {
  const router = useRouter();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Create Store Discount Rule"
        badgeText="Pillar 2"
        description="Configure on-demand Shopify store discount rules that synthesize single-use promo codes upon member minigame wins."
        icon={ShoppingBag}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
          {
            label: "E-Commerce",
            href: "/gamification/rewards/pillars/store",
          },
          { label: "Create Rule" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/gamification/rewards/pillars/store">
              <Button
                variant="outline"
                className="text-[13px] font-medium h-[36px] gap-1.5 border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-[#303030] dark:text-zinc-100 cursor-pointer shadow-xs rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4 text-[#616161]" />
                Back to Store Discounts
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <StoreRewardForm
          onSuccess={() => {
            router.push("/gamification/rewards/pillars/store");
          }}
          onCancel={() => {
            router.push("/gamification/rewards/pillars/store");
          }}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Gift, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { GiftCardForm } from "@/components/rewards/pillars/gift-cards/drawer/gift-card-form";
import {
  useGetDigitalCardRuleById,
  useGetEntityRewardWallet,
} from "@/graphql/actions/rewards/gift-cards";
import { GiftCardRuleItem } from "@/components/rewards/pillars/gift-cards/types";

export default function EditGiftCardRulePage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);

  const { data, loading, error } = useGetDigitalCardRuleById(id || "");
  const { data: walletData } = useGetEntityRewardWallet();
  const walletBalance = walletData?.getEntityRewardWallet?.balance ?? 0;

  const rawRule = data?.getDigitalCardRuleById;
  const rule: GiftCardRuleItem | null = rawRule
    ? {
        id: rawRule.id,
        title: rawRule.title,
        brand: rawRule.brandName || "Amazon Pay",
        category: "E-Commerce",
        denomination: rawRule.faceValue || 500,
        serviceFee: 25,
        totalCostPerWin: (rawRule.faceValue || 500) + 25,
        validityMonths: Math.round((rawRule.validityDays || 365) / 30),
        isActive: rawRule.isActive ?? true,
        totalIssued: rawRule.totalAllocated || 0,
        totalSpent: 0,
        gameAssignments: ["Spin the Wheel"],
      }
    : null;

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={rule ? `Edit · ${rule.title}` : "Digital Gift Card"}
        badgeText="Pillar 3"
        description="Update partner brand, card denomination, fee calculations, and game allocations."
        icon={Gift}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
          {
            label: "Digital Gift Cards",
            href: "/gamification/rewards/pillars/gift-cards",
          },
          { label: rule?.title || "Edit Gift Card" },
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
        {loading ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : !rawRule || error ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[12px] bg-white dark:bg-zinc-900 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <Gift className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-[#303030] dark:text-zinc-100">
                Gift Card Rule Not Found
              </h3>
              <p className="text-[13px] text-[#616161] dark:text-zinc-400">
                The gift card offer #{id} may have been deleted or the link is
                invalid.
              </p>
            </div>
            <Link href="/gamification/rewards/pillars/gift-cards">
              <Button
                variant="outline"
                className="gap-2 text-[13px] font-medium h-[36px] border-[#aeb4b9] rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Gift Cards
              </Button>
            </Link>
          </div>
        ) : (
          <GiftCardForm
            initialItem={rule}
            id={id}
            walletBalance={walletBalance}
            onSuccess={() => {
              router.push("/gamification/rewards/pillars/gift-cards");
            }}
            onCancel={() => {
              router.push("/gamification/rewards/pillars/gift-cards");
            }}
          />
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

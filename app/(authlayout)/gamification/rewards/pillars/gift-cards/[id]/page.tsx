"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Gift, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
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

  if (loading) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader
          title="Loading Gift Card Rule..."
          badgeText="Pillar 3"
          description="Fetching digital gift card configuration details."
          icon={Gift}
          breadcrumbs={[
            { label: "Gamification", href: "/gamification" },
            { label: "Rewards", href: "/gamification/rewards" },
            { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
            { label: "Digital Gift Cards", href: "/gamification/rewards/pillars/gift-cards" },
            { label: "Loading..." },
          ]}
        />
        <EcosystemContainer className="p-4 sm:p-5">
          <div className="flex flex-col items-center justify-center p-16 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
            <p className="text-xs text-muted-foreground font-medium">
              Loading gift card rule configuration...
            </p>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  if (!rawRule || error) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader
          title="Gift Card Not Found"
          badgeText="Pillar 3"
          description="The requested gift card offer could not be located."
          icon={Gift}
          breadcrumbs={[
            { label: "Gamification", href: "/gamification" },
            { label: "Rewards", href: "/gamification/rewards" },
            { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
            { label: "Digital Gift Cards", href: "/gamification/rewards/pillars/gift-cards" },
            { label: "Not Found" },
          ]}
        />
        <EcosystemContainer className="p-4 sm:p-5">
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-border/80 rounded-2xl bg-muted/10 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <Gift className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-foreground">
                Gift Card Rule Not Found
              </h3>
              <p className="text-xs text-muted-foreground">
                The gift card offer #{id} may have been deleted or the link is invalid.
              </p>
            </div>
            <Link href="/gamification/rewards/pillars/gift-cards">
              <Button
                variant="outline"
                className="gap-2 text-xs font-semibold h-9 border-border cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Gift Cards
              </Button>
            </Link>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`Edit · ${rawRule.title}`}
        badgeText="Pillar 3"
        description="Update denomination, brand pricing, and rules for this gift card offer."
        icon={Gift}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
          { label: "Digital Gift Cards", href: "/gamification/rewards/pillars/gift-cards" },
          { label: rawRule.title || "Edit Gift Card" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/gamification/rewards/pillars/gift-cards">
              <Button
                variant="outline"
                className="text-xs font-semibold h-9 gap-1.5 border-border bg-background/80 hover:bg-muted text-foreground cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                Back to Gift Cards
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="p-4 sm:p-5">
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
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

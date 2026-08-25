"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { StoreRewardForm } from "@/components/rewards/pillars/store/drawer/store-reward-form";
import { useGetStoreDiscountRuleById } from "@/graphql/actions/rewards/store";

export default function EditStoreDiscountRulePage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);

  const { data, loading, error } = useGetStoreDiscountRuleById(id || "");
  const rule = data?.getStoreDiscountRuleById;

  if (loading) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader
          title="Loading Store Discount Rule..."
          badgeText="Pillar 2"
          description="Fetching store reward configuration details."
          icon={ShoppingBag}
          breadcrumbs={[
            { label: "Gamification", href: "/gamification" },
            { label: "Rewards", href: "/gamification/rewards" },
            { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
            { label: "E-Commerce", href: "/gamification/rewards/pillars/store" },
            { label: "Loading..." },
          ]}
        />
        <EcosystemContainer className="p-4 sm:p-5">
          <div className="flex flex-col items-center justify-center p-16 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            <p className="text-xs text-muted-foreground font-medium">
              Loading reward rule configuration...
            </p>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  if (!rule || error) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader
          title="Rule Not Found"
          badgeText="Pillar 2"
          description="The requested store discount rule could not be located."
          icon={ShoppingBag}
          breadcrumbs={[
            { label: "Gamification", href: "/gamification" },
            { label: "Rewards", href: "/gamification/rewards" },
            { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
            { label: "E-Commerce", href: "/gamification/rewards/pillars/store" },
            { label: "Not Found" },
          ]}
        />
        <EcosystemContainer className="p-4 sm:p-5">
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-border/80 rounded-2xl bg-muted/10 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-foreground">
                Store Rule Not Found
              </h3>
              <p className="text-xs text-muted-foreground">
                The discount rule #{id} may have been deleted or the link is invalid.
              </p>
            </div>
            <Link href="/gamification/rewards/pillars/store">
              <Button
                variant="outline"
                className="gap-2 text-xs font-semibold h-9 border-border cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Store Discounts
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
        title={`Edit · ${rule.title}`}
        badgeText="Pillar 2"
        description="Update discount value, cart minimums, validity period, and single-use locking for this Shopify rule."
        icon={ShoppingBag}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
          { label: "E-Commerce", href: "/gamification/rewards/pillars/store" },
          { label: rule.title || "Edit Rule" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/gamification/rewards/pillars/store">
              <Button
                variant="outline"
                className="text-xs font-semibold h-9 gap-1.5 border-border bg-background/80 hover:bg-muted text-foreground cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                Back to Store Pillars
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="p-4 sm:p-5">
        <StoreRewardForm
          initialItem={rule}
          id={id}
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

"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { StoreRewardForm } from "@/components/rewards/pillars/store/drawer/store-reward-form";
import { useGetStoreDiscountRuleById } from "@/graphql/actions/rewards/store";

export default function EditStoreDiscountRulePage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);

  const { data, loading, error } = useGetStoreDiscountRuleById(id || "");
  const rule = data?.getStoreDiscountRuleById;

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={rule ? `Edit · ${rule.title}` : "Store Discount Rule"}
        badgeText="Pillar 2"
        description="Update discount value, cart minimums, validity period, and single-use locking for this Shopify rule."
        icon={ShoppingBag}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
          {
            label: "E-Commerce",
            href: "/gamification/rewards/pillars/store",
          },
          { label: rule?.title || "Edit Rule" },
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
        {loading ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : !rule || error ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[12px] bg-white dark:bg-zinc-900 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-[#303030] dark:text-zinc-100">
                Store Rule Not Found
              </h3>
              <p className="text-[13px] text-[#616161] dark:text-zinc-400">
                The discount rule #{id} may have been deleted or the link is
                invalid.
              </p>
            </div>
            <Link href="/gamification/rewards/pillars/store">
              <Button
                variant="outline"
                className="gap-2 text-[13px] font-medium h-[36px] border-[#aeb4b9] rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Store Discounts
              </Button>
            </Link>
          </div>
        ) : (
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
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

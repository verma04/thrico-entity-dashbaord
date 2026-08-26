"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Coins, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { InternalRewardForm } from "@/components/rewards/pillars/manual/drawer/internal-reward-form";

export default function CreateManualVoucherPage() {
  const router = useRouter();

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Create Internal Voucher"
        badgeText="Pillar 1"
        description="Create a proprietary internal voucher batch with custom serialization or promo code for your members with zero vendor fee."
        icon={Coins}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
          {
            label: "Manual Vouchers",
            href: "/gamification/rewards/pillars/manual",
          },
          { label: "Create Voucher" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/gamification/rewards/pillars/manual">
              <Button
                variant="outline"
                className="text-[13px] font-medium h-[36px] gap-1.5 border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-[#303030] dark:text-zinc-100 cursor-pointer shadow-xs rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4 text-[#616161]" />
                Back to Manual Vouchers
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <InternalRewardForm
          onSuccess={() => {
            router.push("/gamification/rewards/pillars/manual");
          }}
          onCancel={() => {
            router.push("/gamification/rewards/pillars/manual");
          }}
        />
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

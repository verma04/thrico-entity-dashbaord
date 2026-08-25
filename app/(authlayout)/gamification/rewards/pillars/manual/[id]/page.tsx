"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Coins, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { InternalRewardForm } from "@/components/rewards/pillars/manual/drawer/internal-reward-form";
import { useGetManualVoucherBatchById } from "@/graphql/actions/rewards/manual";
import { ManualRewardItem } from "@/components/rewards/pillars/manual/table/manual-reward-card";

export default function EditManualVoucherBatchPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);

  const { data, loading, error } = useGetManualVoucherBatchById(id || "");

  const rawBatch = data?.getManualVoucherBatchById;
  const batch: ManualRewardItem | null = rawBatch
    ? {
        id: rawBatch.id,
        title: rawBatch.name,
        description: rawBatch.description,
        image: rawBatch.image || "",
        url: rawBatch.url || "",
        couponType: rawBatch.couponType || "ONE_TO_ONE",
        couponCode: rawBatch.couponType === "ONE_TO_MANY" ? rawBatch.name : "",
        codePrefix: "VCH",
        faceValue: rawBatch.faceValue || 0,
        currency: rawBatch.currency || "TC",
        totalInventory: rawBatch.totalCount || 0,
        allocatedCount: rawBatch.allocatedCount || 0,
        redeemedCount: rawBatch.redeemedCount || 0,
        remainingCount: rawBatch.remainingCount || 0,
        isActive: rawBatch.status === "ACTIVE",
        validityDays: 30,
        createdAt: rawBatch.createdAt || new Date().toISOString(),
      }
    : null;

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={rawBatch ? `Edit · ${rawBatch.name}` : "Manual Voucher"}
        badgeText="Pillar 1"
        description="Update campaign details and settings for this proprietary voucher."
        icon={Coins}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
          {
            label: "Manual Vouchers",
            href: "/gamification/rewards/pillars/manual",
          },
          { label: rawBatch?.name || "Edit Voucher" },
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
        {loading ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : !rawBatch || error ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[12px] bg-white dark:bg-zinc-900 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <Coins className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-[#303030] dark:text-zinc-100">
                Voucher Batch Not Found
              </h3>
              <p className="text-[13px] text-[#616161] dark:text-zinc-400">
                The voucher batch #{id} may have been deleted or the link is
                invalid.
              </p>
            </div>
            <Link href="/gamification/rewards/pillars/manual">
              <Button
                variant="outline"
                className="gap-2 text-[13px] font-medium h-[36px] border-[#aeb4b9] rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Manual Vouchers
              </Button>
            </Link>
          </div>
        ) : (
          <InternalRewardForm
            initialItem={batch}
            id={id}
            onSuccess={() => {
              router.push("/gamification/rewards/pillars/manual");
            }}
            onCancel={() => {
              router.push("/gamification/rewards/pillars/manual");
            }}
          />
        )}
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

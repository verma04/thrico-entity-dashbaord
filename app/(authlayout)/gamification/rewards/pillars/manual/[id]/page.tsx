"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Coins, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
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

  if (loading) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader
          title="Loading Voucher Batch..."
          badgeText="Pillar 1"
          description="Fetching internal voucher campaign details."
          icon={Coins}
          breadcrumbs={[
            { label: "Gamification", href: "/gamification" },
            { label: "Rewards", href: "/gamification/rewards" },
            { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
            { label: "Manual Vouchers", href: "/gamification/rewards/pillars/manual" },
            { label: "Loading..." },
          ]}
        />
        <EcosystemContainer className="p-4 sm:p-5">
          <div className="flex flex-col items-center justify-center p-16 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <p className="text-xs text-muted-foreground font-medium">
              Loading internal voucher batch...
            </p>
          </div>
        </EcosystemContainer>
      </EcosystemWrapper>
    );
  }

  if (!rawBatch || error) {
    return (
      <EcosystemWrapper>
        <EcosystemHeader
          title="Voucher Batch Not Found"
          badgeText="Pillar 1"
          description="The requested internal voucher batch could not be located."
          icon={Coins}
          breadcrumbs={[
            { label: "Gamification", href: "/gamification" },
            { label: "Rewards", href: "/gamification/rewards" },
            { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
            { label: "Manual Vouchers", href: "/gamification/rewards/pillars/manual" },
            { label: "Not Found" },
          ]}
        />
        <EcosystemContainer className="p-4 sm:p-5">
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-border/80 rounded-2xl bg-muted/10 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <Coins className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-foreground">
                Voucher Batch Not Found
              </h3>
              <p className="text-xs text-muted-foreground">
                The voucher batch #{id} may have been deleted or the link is invalid.
              </p>
            </div>
            <Link href="/gamification/rewards/pillars/manual">
              <Button
                variant="outline"
                className="gap-2 text-xs font-semibold h-9 border-border cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Manual Vouchers
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
        title={`Edit · ${rawBatch.name}`}
        badgeText="Pillar 1"
        description="Update campaign details and settings for this proprietary voucher."
        icon={Coins}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Pillars", href: "/gamification/rewards/pillars" },
          { label: "Manual Vouchers", href: "/gamification/rewards/pillars/manual" },
          { label: rawBatch.name || "Edit Voucher" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/gamification/rewards/pillars/manual">
              <Button
                variant="outline"
                className="text-xs font-semibold h-9 gap-1.5 border-border bg-background/80 hover:bg-muted text-foreground cursor-pointer shadow-xs"
              >
                <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                Back to Manual Vouchers
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="p-4 sm:p-5">
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
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

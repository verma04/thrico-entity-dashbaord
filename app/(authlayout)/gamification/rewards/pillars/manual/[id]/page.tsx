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
import {
  useGetManualVoucherBatchById,
  useGetManualVoucherById,
  useUpdateManualVoucher,
  ManualCouponType,
  ManualVoucherStatus,
  UpdateManualVoucherInput,
} from "@/graphql/actions/rewards/manual";
import { ManualRewardItem } from "@/components/rewards/pillars/manual/table/manual-reward-card";
import { toast } from "sonner";

export default function EditManualVoucherBatchPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = params?.id;
  const id = Array.isArray(rawId) ? rawId[0] : (rawId as string);

  const {
    data: batchData,
    loading: batchLoading,
    error: batchError,
  } = useGetManualVoucherBatchById(id || "");

  const {
    data: voucherData,
    loading: voucherLoading,
    error: voucherError,
  } = useGetManualVoucherById(id || "", {
    skip: !id || Boolean(batchData?.getManualVoucherBatchById),
  });

  const [updateManualVoucher, { loading: isUpdating }] =
    useUpdateManualVoucher();

  const rawBatch = batchData?.getManualVoucherBatchById;
  const rawVoucher = voucherData?.getManualVoucherById;
  const rawItem = rawBatch || rawVoucher;
  const loading = batchLoading || (voucherLoading && !rawBatch);
  const error = !rawBatch && voucherError ? voucherError : batchError;

  const expiryDateString = rawBatch?.expiryDate || rawVoucher?.expiryDate;
  const createdAtString = rawBatch?.createdAt || rawVoucher?.createdAt;

  let calculatedValidityDays = 30;
  if (expiryDateString) {
    const expiry = new Date(expiryDateString);
    const created = createdAtString
      ? new Date(createdAtString)
      : new Date();
    const diffDays = Math.round(
      (expiry.getTime() - created.getTime()) / (1000 * 60 * 60 * 24),
    );
    calculatedValidityDays =
      diffDays > 0
        ? diffDays
        : Math.max(
            Math.ceil((expiry.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
            1,
          );
  }

  let parsedMeta: any = {};
  try {
    const metaSource = rawBatch?.metadata || rawVoucher?.metadata;
    if (metaSource) {
      parsedMeta =
        typeof metaSource === "string"
          ? JSON.parse(metaSource)
          : metaSource;
    }
  } catch {
    parsedMeta = {};
  }

  const isOneToMany =
    (rawBatch?.couponType || rawVoucher?.couponType) === "ONE_TO_MANY";
  const couponCode =
    parsedMeta.couponCode ||
    rawVoucher?.code ||
    (isOneToMany ? rawBatch?.name : "");

  const codeName =
    rawBatch?.name || rawVoucher?.reward?.title || rawVoucher?.code || "";
  const codePrefix =
    parsedMeta.prefix ||
    (!isOneToMany &&
    codeName &&
    codeName.length <= 8 &&
    !codeName.includes(" ")
      ? codeName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
      : rawVoucher?.code?.split("-")[0] || "VCH");

  const batch: ManualRewardItem | null = rawItem
    ? {
        id: rawItem.id,
        title:
          rawBatch?.name ||
          rawVoucher?.reward?.title ||
          rawVoucher?.code ||
          "Manual Voucher",
        description: rawBatch?.description || rawVoucher?.batch?.name || "",
        image: rawBatch?.image || rawVoucher?.reward?.image || "",
        url: rawBatch?.url || rawVoucher?.claimUrl || "",
        couponType:
          rawBatch?.couponType || rawVoucher?.couponType || "ONE_TO_ONE",
        couponCode: couponCode || (isOneToMany ? codeName : ""),
        codePrefix: codePrefix || "VCH",
        faceValue: Number(rawBatch?.faceValue ?? rawVoucher?.faceValue ?? 0),
        currency: rawBatch?.currency || rawVoucher?.currency || "TC",
        totalInventory: rawBatch?.totalCount ?? rawVoucher?.totalInventory ?? 0,
        allocatedCount:
          rawBatch?.allocatedCount ?? (rawVoucher?.assignedTo ? 1 : 0),
        redeemedCount:
          rawBatch?.redeemedCount ?? (rawVoucher?.isUsed ? 1 : 0),
        remainingCount:
          rawBatch?.remainingCount ?? rawVoucher?.remainingInventory ?? 0,
        isActive: rawBatch
          ? rawBatch.status === "ACTIVE"
          : rawVoucher?.status !== "VOID" && rawVoucher?.status !== "EXPIRED",
        validityDays: expiryDateString ? calculatedValidityDays : 30,
        expiryDate: expiryDateString || undefined,
        createdAt: createdAtString || new Date().toISOString(),
      }
    : null;

  const handleUpdate = async (values: any) => {
    try {
      let resolvedExpiryDate: string | undefined = undefined;
      if (values.expiryDate) {
        const parsedDate = new Date(values.expiryDate);
        if (!isNaN(parsedDate.getTime())) {
          resolvedExpiryDate = parsedDate.toISOString();
        }
      } else if (values.validityDays) {
        const d = new Date();
        d.setDate(d.getDate() + Number(values.validityDays));
        resolvedExpiryDate = d.toISOString();
      }

      const metadataObj: Record<string, any> = {
        title: values.title,
        name: values.title,
        description: values.description,
        image: values.image || undefined,
        url: values.url || undefined,
        prefix: values.prefix,
        couponCode: values.couponCode,
        validityDays: values.validityDays,
      };

      const input: UpdateManualVoucherInput = {
        code:
          values.couponType === ManualCouponType.ONE_TO_MANY
            ? values.couponCode || values.title
            : values.couponCode || undefined,
        claimUrl: values.url || undefined,
        faceValue:
          Number(values.faceValue) || Number(rawItem?.faceValue) || 0,
        currency: values.currency || rawItem?.currency || "TC",
        inventoryRequired: values.inventoryRequired ?? true,
        totalInventory:
          values.couponType === ManualCouponType.ONE_TO_ONE
            ? Number(values.count) || undefined
            : Number(values.totalUsageLimit) || undefined,
        remainingInventory:
          values.couponType === ManualCouponType.ONE_TO_ONE
            ? Number(values.count) || undefined
            : Number(values.totalUsageLimit) || undefined,
        totalUsageLimit: Number(values.totalUsageLimit) || 0,
        perUserLimit: 1,
        status: values.isActive
          ? ManualVoucherStatus.UNASSIGNED
          : ManualVoucherStatus.VOID,
        expiryDate: resolvedExpiryDate,
        metadata: JSON.stringify(metadataObj),
      };

      const res = await updateManualVoucher({
        variables: {
          id,
          input,
        },
      });

      if (res.data?.updateManualVoucher) {
        toast.success("Manual voucher updated successfully");
        router.push("/gamification/rewards/pillars/manual");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update manual voucher");
      throw err;
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={rawItem ? `Edit · ${batch?.title}` : "Manual Voucher"}
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
          { label: batch?.title || "Edit Voucher" },
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
        ) : !rawItem || error ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[12px] bg-white dark:bg-zinc-900 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <Coins className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-[#303030] dark:text-zinc-100">
                Voucher Not Found
              </h3>
              <p className="text-[13px] text-[#616161] dark:text-zinc-400">
                The voucher #{id} may have been deleted or the link is
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
            onUpdate={handleUpdate}
            isSaving={isUpdating}
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

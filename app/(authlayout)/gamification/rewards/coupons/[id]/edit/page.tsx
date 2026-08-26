"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { Ticket, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useGetRewardById, useUpdateReward } from "@/graphql/actions/rewards";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { RewardFormSections } from "@/components/rewards/coupons/form/reward-form-sections";
import { RewardPreviewSidebar } from "@/components/rewards/coupons/form/reward-preview-sidebar";
import { RewardInfoSidebar } from "@/components/rewards/coupons/form/reward-info-sidebar";
import { couponSchema } from "@/components/rewards/coupons/types";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";

export default function EditRewardPage() {
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const rewardId = params?.id as string;

  const { data, loading: fetchLoading } = useGetRewardById(rewardId);
  const [updateReward, { loading }] = useUpdateReward();
  const [saved, setSaved] = useState(false);

  const reward = data?.getRewardById;

  const getInitialValues = (r: any) => {
    const elig = r?.eligibility;
    const uIds = elig?.eligibleUserIds || r?.eligibleUserIds || [];
    const tIds =
      elig?.membershipTierId ||
      elig?.eligibleTierIds ||
      r?.membershipTierId ||
      r?.eligibleTierIds ||
      [];
    const mEligibility =
      elig?.memberEligibility ||
      r?.memberEligibility ||
      (uIds.length > 0
        ? "SPECIFIC_CUSTOMERS"
        : tIds.length > 0
          ? "TIERS"
          : "ALL");

    return {
      title: r?.title || "",
      description: r?.description || "",
      tcCost: r?.tcCost || 1,
      discountType: r?.discountType || "Flat",
      discountValue: r?.discountValue || "",
      validityDays: Number(r?.validityDays || 30),
      totalUsageLimit: elig?.totalUsageLimit ?? r?.totalUsageLimit ?? 0,
      perUserLimit: elig?.perUserLimit ?? r?.perUserLimit ?? 1,
      minAccountAge: elig?.minAccountAge ?? r?.minAccountAge ?? 0,
      minActivityRequired:
        elig?.minActivityRequired ?? r?.minActivityRequired ?? 0,
      blockWarnedUsers:
        elig?.blockWarnedUsers ?? r?.blockWarnedUsers ?? false,
      cooldownPeriod: elig?.cooldownPeriod ?? r?.cooldownPeriod ?? 0,
      showToAllMembers: elig?.showToAllMembers ?? r?.showToAllMembers ?? true,
      inventoryRequired: r?.inventoryRequired ?? false,
      image: r?.image || "",
      mechanism:
        r?.mechanism?.type === "STORE_DISCOUNT"
          ? "ECOMMERCE"
          : r?.mechanism?.type === "DIGITAL_GIFT_CARD"
            ? "DIGITAL_GIFT_CARD"
            : "INTERNAL",
      rewardPillar:
        r?.mechanism?.type === "STORE_DISCOUNT"
          ? "ECOMMERCE"
          : r?.mechanism?.type === "DIGITAL_GIFT_CARD"
            ? "DIGITAL_GIFT_CARD"
            : "INTERNAL",
      selectedRuleId:
        r?.mechanism?.ruleId ||
        r?.mechanism?.manualBatchId ||
        r?.mechanism?.storeDiscountRuleId ||
        r?.mechanism?.digitalCardRuleId ||
        r?.manualBatch?.id ||
        r?.storeDiscountRule?.id ||
        r?.digitalCardRule?.id ||
        "",
      rewardMechanism: r?.rewardMechanism || [],
      storeDiscountType: "FIXED_AMOUNT",
      storeCodePrefix: "THRICO-",
      storeMinCart: 0,
      giftCardBrand: r?.digitalCardRule?.title || "Amazon Pay",
      giftCardValue: Number(r?.digitalCardRule?.faceValue) || 500,
      giftCardFee: (Number(r?.digitalCardRule?.faceValue) || 500) * 0.05,
      status: r?.status || "ACTIVE",
      isActive: r?.isActive ?? true,
      url: r?.url || "",
      howToClaim: r?.howToClaim || "",
      couponCode: r?.couponCode || "",
      couponType: "ONE_TO_ONE",
      memberEligibility: mEligibility,
      membershipTierId: tIds,
      eligibleTierIds: tIds,
      eligibleUserIds: uIds,
      expiryDate: r?.expiryDate
        ? new Date(
            Number(r.expiryDate) ? Number(r.expiryDate) : r.expiryDate,
          )
            .toISOString()
            .slice(0, 16)
        : "",
    };
  };

  const formik = useFormik({
    initialValues: getInitialValues(reward),
    validationSchema: couponSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const tierIds = Array.isArray(values.membershipTierId)
          ? values.membershipTierId
          : values.membershipTierId
            ? [values.membershipTierId]
            : values.eligibleTierIds || [];

        await updateReward({
          variables: {
            updateRewardId: rewardId,
            input: {
              title: values.title,
              description: values.description,
              howToClaim: values.howToClaim,
              tcCost: values.tcCost,
              expiryDays: Number(values.validityDays || 30),
              inventoryRequired: values.inventoryRequired,
              image: values.image,
              url: values.url,
              couponCode: values.couponCode,
              eligibility: {
                memberEligibility: values.memberEligibility || "ALL",
                membershipTierId: tierIds,
                eligibleTierIds: tierIds,
                eligibleUserIds: values.eligibleUserIds || [],
                totalUsageLimit: values.totalUsageLimit,
                perUserLimit: values.perUserLimit,
                minAccountAge: values.minAccountAge,
                minActivityRequired: values.minActivityRequired,
                blockWarnedUsers: values.blockWarnedUsers,
                cooldownPeriod: values.cooldownPeriod,
                showToAllMembers: values.showToAllMembers ?? true,
              },
              mechanism: {
                type:
                  values.rewardPillar === "ECOMMERCE" ||
                  values.mechanism === "ECOMMERCE"
                    ? "STORE_DISCOUNT"
                    : values.rewardPillar === "DIGITAL_GIFT_CARD" ||
                        values.mechanism === "DIGITAL_GIFT_CARD"
                      ? "DIGITAL_GIFT_CARD"
                      : "INTERNAL_VOUCHER",
                ruleId: values.selectedRuleId || null,
                manualBatchId:
                  values.rewardPillar === "INTERNAL" ||
                  values.mechanism === "INTERNAL"
                    ? values.selectedRuleId || null
                    : null,
                storeDiscountRuleId:
                  values.rewardPillar === "ECOMMERCE" ||
                  values.mechanism === "ECOMMERCE"
                    ? values.selectedRuleId || null
                    : null,
                digitalCardRuleId:
                  values.rewardPillar === "DIGITAL_GIFT_CARD" ||
                  values.mechanism === "DIGITAL_GIFT_CARD"
                    ? values.selectedRuleId || null
                    : null,
              },
              isActive: values.isActive,
              status: values.status,
              expiryDate: values.expiryDate || null,
            },
          },
        });
        toast({
          title: "Reward Updated",
          description: `${values.title} configuration has been saved.`,
        });
        setSaved(true);
      } catch (err: any) {
        toast({
          title: "Update failed",
          description: err.message,
          variant: "destructive",
        });
      }
    },
  });

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={reward ? `Edit · ${reward.title}` : "Reward Coupon"}
        badgeText="Reward Studio"
        description="Update coupon terms, points pricing, member gating, and fulfillment rules."
        icon={Ticket}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Coupons", href: "/gamification/rewards/coupons" },
          { label: reward?.title || "Edit" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/gamification/rewards/coupons">
              <Button
                variant="outline"
                className="text-[13px] font-medium h-[36px] gap-1.5 border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-[#303030] dark:text-zinc-100 cursor-pointer shadow-xs rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4 text-[#616161]" />
                Back to Reward Coupons
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        {fetchLoading ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : !reward ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[12px] bg-white dark:bg-zinc-900 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <Ticket className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-[#303030] dark:text-zinc-100">
                Reward Coupon Not Found
              </h3>
              <p className="text-[13px] text-[#616161] dark:text-zinc-400">
                This reward may have been deleted or the link is invalid.
              </p>
            </div>
            <Link href="/gamification/rewards/coupons">
              <Button
                variant="outline"
                className="gap-2 text-[13px] font-medium h-[36px] border-[#aeb4b9] rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Reward Coupons
              </Button>
            </Link>
          </div>
        ) : (
          <PolarisFormLayout
            sidebar={
              <div className="space-y-4">
                <RewardPreviewSidebar formik={formik} showStrategy />
                <RewardInfoSidebar
                  reward={reward}
                  inventoryRequired={formik.values.inventoryRequired}
                />
              </div>
            }
          >
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <RewardFormSections
                key={reward?.id || "reward-form"}
                formik={formik}
                rewardId={rewardId}
              />
            </form>
          </PolarisFormLayout>
        )}
      </EcosystemContainer>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={saved}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title="Unsaved Changes"
        description="You have pending changes to this reward coupon."
        buttonText="Save Changes"
      />
    </EcosystemWrapper>
  );
}

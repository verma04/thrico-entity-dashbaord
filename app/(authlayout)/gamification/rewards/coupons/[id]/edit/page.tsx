"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import { Ticket, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useGetRewardById, useUpdateReward } from "@/graphql/actions/rewards";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { RewardFormSections } from "@/components/rewards/coupons/form/reward-form-sections";
import { RewardPreviewSidebar } from "@/components/rewards/coupons/form/reward-preview-sidebar";
import { RewardInfoSidebar } from "@/components/rewards/coupons/form/reward-info-sidebar";
import { RewardFormHeader } from "@/components/rewards/coupons/form/reward-form-header";
import { couponSchema } from "@/components/rewards/coupons/types";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";

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
      (uIds.length > 0 ? "SPECIFIC_CUSTOMERS" : tIds.length > 0 ? "TIERS" : "ALL");

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

        const validMechanisms = ["SPIN_WHEEL", "SCRATCH_CARD", "MATCH_AND_WIN"];
        const filteredMechanisms = Array.isArray(values.rewardMechanism)
          ? values.rewardMechanism.filter((m: string) =>
              validMechanisms.includes(m),
            )
          : [];

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
              ...(filteredMechanisms.length > 0 && {
                rewardMechanism: filteredMechanisms,
              }),
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
              status: values.status,
              isActive: values.isActive,
              expiryDate: values.expiryDate || null,
            },
          },
        });
        toast({
          title: "Reward updated",
          description: `${values.title} has been saved.`,
        });
        setSaved(true);
        setTimeout(() => {
          router.push("/gamification/rewards/coupons");
        }, 1500);
      } catch (err: any) {
        toast({
          title: "Update failed",
          description: err.message,
          variant: "destructive",
        });
      }
    },
  });

  React.useEffect(() => {
    if (reward) {
      formik.resetForm({ values: getInitialValues(reward) });
    }
  }, [reward]);

  if (fetchLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-black/10">
        <RewardFormHeader
          title="Loading Reward..."
          backUrl="/gamification/rewards/coupons"
        />
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4"
                >
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-72" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>
              ))}
            </div>
            <div className="lg:col-span-4">
              <Skeleton className="aspect-[3/4] w-full rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-black/10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto border border-zinc-200 dark:border-zinc-700">
            <Ticket className="h-7 w-7 text-zinc-400" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
              Reward not found
            </h2>
            <p className="text-xs text-zinc-500 max-w-xs">
              This reward may have been deleted or the link is invalid.
            </p>
          </div>
          <Link href="/gamification/rewards/coupons">
            <Button
              variant="outline"
              className="rounded-lg px-5 text-xs font-semibold"
            >
              Back to Reward Coupons
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black/10 pb-20">
      <RewardFormHeader
        title="Edit Reward"
        subtitle={`Editing · ${reward.title}`}
        backUrl="/gamification/rewards/coupons"
        icon={Sparkles}
      />

      <main className="px-6 py-8">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-6">
              <RewardPreviewSidebar formik={formik} />
              <RewardInfoSidebar
                reward={reward}
                inventoryRequired={formik.values.inventoryRequired}
              />
            </div>
          }
        >
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <RewardFormSections
              key={reward?.id || "reward-form"}
              formik={formik}
              rewardId={rewardId}
            />
          </form>
        </PolarisFormLayout>
      </main>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={saved}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title="Unsaved Changes"
        description="You have pending changes to this reward."
        buttonText="Save Changes"
      />
    </div>
  );
}

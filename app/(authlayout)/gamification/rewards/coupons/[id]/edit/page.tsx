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

  const formik = useFormik({
    initialValues: {
      title: reward?.title || "",
      description: reward?.description || "",
      tcCost: reward?.tcCost || 1,
      discountType: reward?.discountType || "Flat",
      discountValue: reward?.discountValue || "",
      validityDays: reward?.validityDays || 30,
      totalUsageLimit: reward?.totalUsageLimit || 0,
      perUserLimit: reward?.perUserLimit || 1,
      minAccountAge: reward?.minAccountAge || 0,
      minActivityRequired: reward?.minActivityRequired || 0,
      blockWarnedUsers: reward?.blockWarnedUsers || false,
      cooldownPeriod: reward?.cooldownPeriod || 0,
      inventoryRequired: reward?.inventoryRequired || false,
      image: reward?.image || "",
      rewardMechanism: reward?.rewardMechanism || "COUPON",
      status: reward?.status || "ACTIVE",
      isActive: reward?.isActive ?? true,
      url: reward?.url || "",
      howToClaim: reward?.howToClaim || "",
      couponCode: reward?.couponCode || "",
      couponType: reward?.couponType || "PERCENTAGE",
      expiryDate: reward?.expiryDate
        ? new Date(
            Number(reward.expiryDate)
              ? Number(reward.expiryDate)
              : reward.expiryDate,
          )
            .toISOString()
            .slice(0, 16)
        : "",
    },
    validationSchema: couponSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateReward({
          variables: {
            updateRewardId: rewardId,
            input: {
              title: values.title,
              description: values.description,
              howToClaim: values.howToClaim,
              tcCost: values.tcCost,
              inventoryRequired: values.inventoryRequired,
              perUserLimit: values.perUserLimit,
              totalUsageLimit: values.totalUsageLimit,
              minAccountAge: values.minAccountAge,
              minActivityRequired: values.minActivityRequired,
              blockWarnedUsers: values.blockWarnedUsers,
              cooldownPeriod: values.cooldownPeriod,
              image: values.image,
              rewardMechanism: Array.isArray(values.rewardMechanism)
                ? values.rewardMechanism
                : [values.rewardMechanism || "COUPON"],
              status: values.status,
              isActive: values.isActive,
              url: values.url,
              couponType: values.couponType,
              couponCode: values.couponCode,
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
            <Button variant="outline" className="rounded-lg px-5 text-xs font-semibold">
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
            <RewardFormSections formik={formik} rewardId={rewardId} />
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

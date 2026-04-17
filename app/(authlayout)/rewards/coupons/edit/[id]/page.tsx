"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import { useParams, useRouter } from "next/navigation";
import {
  Ticket,
  Sparkles,
} from "lucide-react";
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
              tcCost: values.tcCost,
              inventoryRequired: values.inventoryRequired,
              perUserLimit: values.perUserLimit,
              totalUsageLimit: values.totalUsageLimit,
              minAccountAge: values.minAccountAge,
              minActivityRequired: values.minActivityRequired,
              blockWarnedUsers: values.blockWarnedUsers,
              cooldownPeriod: values.cooldownPeriod,
              image: values.image,
              rewardMechanism: values.rewardMechanism,
              status: values.status,
              isActive: values.isActive,
            },
          },
        });
        toast({
          title: "Reward updated",
          description: `${values.title} has been saved.`,
        });
        setSaved(true);
        setTimeout(() => {
          router.push("/rewards/coupons");
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
      <div className="min-h-screen bg-[#fafafa] dark:bg-black/5">
        <RewardFormHeader 
           title="Loading Reward..." 
           backUrl="/rewards/coupons" 
        />
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
            <div className="space-y-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-10 w-10 rounded-xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-3 w-64" />
                    </div>
                  </div>
                  <div className="pl-14 space-y-4">
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Skeleton className="aspect-[3/4] w-full rounded-[32px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="min-h-screen bg-[#fafafa] dark:bg-black/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mx-auto border border-border">
            <Ticket className="h-7 w-7 text-muted-foreground/30" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-foreground">
              Reward not found
            </h2>
            <p className="text-sm text-muted-foreground max-w-xs">
              This reward may have been deleted or the link is invalid.
            </p>
          </div>
          <Link href="/rewards/coupons">
            <Button variant="outline" className="rounded-full px-6 gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Back to rewards
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] dark:bg-black/5 pb-20">
      <RewardFormHeader 
        title="Edit Reward" 
        subtitle={`Editing · ${reward.title}`}
        backUrl="/rewards/coupons"
        icon={Sparkles}
      />

      <main className="max-w-[1400px] mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          {/* Form */}
          <div className="space-y-12">
            <form onSubmit={formik.handleSubmit}>
              <RewardFormSections formik={formik} />
            </form>
          </div>

          {/* Sticky Preview & Info */}
          <div className="space-y-6">
            <RewardPreviewSidebar formik={formik} />
            <RewardInfoSidebar 
              reward={reward} 
              inventoryRequired={formik.values.inventoryRequired} 
            />
          </div>
        </div>
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

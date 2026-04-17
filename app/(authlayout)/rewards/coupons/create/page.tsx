"use client";

import React from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useCreateReward } from "@/graphql/actions/rewards";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { RewardFormSections } from "@/components/rewards/coupons/form/reward-form-sections";
import { RewardPreviewSidebar } from "@/components/rewards/coupons/form/reward-preview-sidebar";
import { RewardStudioHeader } from "@/components/rewards/coupons/form/reward-form-header";
import { couponSchema } from "@/components/rewards/coupons/types";

export default function CreateCouponPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [createReward, { loading }] = useCreateReward();
  const [saved, setSaved] = React.useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      tcCost: 1,
      discountType: "Flat",
      discountValue: "",
      validityDays: 30,
      totalUsageLimit: 0,
      perUserLimit: 1,
      minAccountAge: 0,
      minActivityRequired: 0,
      blockWarnedUsers: false,
      cooldownPeriod: 0,
      inventoryRequired: false,
      image: "",
      rewardMechanism: ["COUPON"],
    },
    validationSchema: couponSchema,
    onSubmit: async (values) => {
      try {
        await createReward({
          variables: {
            input: {
              title: values.title,
              description: values.description,
              categoryId: "cat-002", // Default to internal, can be expanded if category selection is added later
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
                ? values.rewardMechanism[0] || "COUPON"
                : values.rewardMechanism || "COUPON",
            },
          },
        });
        toast({
          title: "Boom! Reward is live",
          description: `${values.title} has been added to the hub.`,
        });
        setSaved(true);
        setTimeout(() => {
          router.push("/rewards/coupons");
        }, 1500);
      } catch (err: any) {
        toast({
          title: "Whoops!",
          description: err.message,
          variant: "destructive",
        });
      }
    },
  });

  return (
    <div className="flex flex-col h-full bg-[#fafafa] dark:bg-black/5 overflow-hidden relative">
      <RewardStudioHeader 
        title="Reward Studio"
        breadcrumbs={["Rewards", "Coupons", "Create New Reward"]}
        onCancel={() => router.back()}
      />

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
            <div className="space-y-12">
              <form onSubmit={formik.handleSubmit}>
                <RewardFormSections formik={formik} />
              </form>
            </div>

            {/* Sidebar / Preview */}
            <RewardPreviewSidebar formik={formik} showStrategy />
          </div>
        </div>
      </div>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={saved}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title="Unsaved Changes"
        description="You have pending changes to this reward."
        buttonText="Publish Reward"
      />
    </div>
  );
}

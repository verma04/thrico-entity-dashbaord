"use client";

import React from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useCreateReward } from "@/graphql/actions/rewards";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { RewardFormSections } from "@/components/rewards/coupons/form/reward-form-sections";
import { RewardPreviewSidebar } from "@/components/rewards/coupons/form/reward-preview-sidebar";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { Ticket } from "lucide-react";

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
      validityDays: 350,
      totalUsageLimit: 0,
      perUserLimit: 0,
      minAccountAge: 0,
      minActivityRequired: 0,
      blockWarnedUsers: false,
      cooldownPeriod: 0,
      inventoryRequired: false,
      image: "",
      rewardMechanism: ["COUPON"],
      url: "",
      howToClaim: "",
      couponType: "ONE_TO_ONE",
      couponCode: "",
      isActive: true,
      status: "ACTIVE",
      expiryDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 350);
        const offset = d.getTimezoneOffset() * 60000;
        return new Date(d.getTime() - offset).toISOString().slice(0, 16);
      })(),
    },
    validationSchema: couponSchema,
    onSubmit: async (values) => {
      try {
        await createReward({
          variables: {
            input: {
              title: values.title,
              description: values.description,
              howToClaim: values.howToClaim,
              categoryId: "cat-002",
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
              url: values.url,
              couponType: values.couponType,
              couponCode: values.couponCode,
              isActive: values.isActive,
              status: values.status,
              expiryDate: values.expiryDate || null,
            },
          },
        });
        toast({
          title: "Reward Published",
          description: `${values.title} has been added to the catalog.`,
        });
        setSaved(true);
        setTimeout(() => {
          router.push("/gamification/rewards/coupons");
        }, 1500);
      } catch (err: any) {
        toast({
          title: "Failed to create reward",
          description: err.message,
          variant: "destructive",
        });
      }
    },
  });

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Create Reward Coupon"
        badgeText="Reward Studio"
        description="Design and publish coupon rewards redeemable by community members."
        icon={Ticket}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          { label: "Reward Coupons", href: "/gamification/rewards/coupons" },
          { label: "Create" },
        ]}
      />
      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <PolarisFormLayout
          sidebar={<RewardPreviewSidebar formik={formik} showStrategy />}
        >
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <RewardFormSections formik={formik} />
          </form>
        </PolarisFormLayout>
      </EcosystemContainer>

      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={saved}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title="Unsaved Reward"
        description="You have pending changes to this reward configuration."
        buttonText="Publish Reward"
      />
    </EcosystemWrapper>
  );
}

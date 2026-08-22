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
import { couponSchema } from "@/components/rewards/coupons/types";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";

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
      mechanism: "INTERNAL",
      rewardPillar: "INTERNAL",
      selectedRuleId: "",
      rewardMechanism: ["COUPON"],
      storeDiscountType: "FIXED_AMOUNT",
      storeCodePrefix: "THRICO-",
      storeMinCart: 0,
      customerLock: true,
      giftCardBrand: "Amazon Pay",
      giftCardValue: 500,
      giftCardFee: 25,
      url: "",
      howToClaim: "",
      couponType: "ONE_TO_ONE",
      couponCode: "",
      memberEligibility: "ALL",
      membershipTierId: [],
      eligibleTierIds: [],
      eligibleUserIds: [],
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
        const tierIds = Array.isArray(values.membershipTierId)
          ? values.membershipTierId
          : values.membershipTierId
            ? [values.membershipTierId]
            : values.eligibleTierIds || [];

        await createReward({
          variables: {
            input: {
              title: values.title,
              description: values.description,
              howToClaim: values.howToClaim,
              tcCost: values.tcCost,
              validityDays: Number(values.validityDays || 30),
              inventoryRequired: values.inventoryRequired,
              image: values.image,
              url: values.url,
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
      <EcosystemContainer className="h-full w-full border-none shadow-none bg-transparent p-0 ring-0">
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

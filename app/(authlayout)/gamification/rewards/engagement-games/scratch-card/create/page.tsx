"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { RectangleHorizontal } from "lucide-react";
import { useCreateScratchCardPrize } from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { ScratchTierFormSections } from "@/components/rewards/scratch-card/create/scratch-tier-form-sections";
import { ScratchTierPreviewSidebar } from "@/components/rewards/scratch-card/create/scratch-tier-preview-sidebar";

const scratchTierSchema = Yup.object().shape({
  label: Yup.string().required("Tier label is required"),
  rewardType: Yup.string().required("Reward type is required"),
  memberEligibility: Yup.string().default("ALL"),
  membershipTierId: Yup.array().when("memberEligibility", {
    is: "TIERS",
    then: (schema) =>
      schema
        .min(1, "Please select at least one membership tier")
        .required("Please select at least one membership tier"),
    otherwise: (schema) => schema.notRequired(),
  }),
  eligibleTierIds: Yup.array().when("memberEligibility", {
    is: "TIERS",
    then: (schema) =>
      schema
        .min(1, "Please select at least one membership tier")
        .required("Please select at least one membership tier"),
    otherwise: (schema) => schema.notRequired(),
  }),
  eligibleUserIds: Yup.array().when("memberEligibility", {
    is: "SPECIFIC_CUSTOMERS",
    then: (schema) =>
      schema
        .min(1, "Please select at least one customer")
        .required("Please select at least one customer"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

export default function CreateScratchCardTierPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [createTier, { loading }] = useCreateScratchCardPrize();
  const [saved, setSaved] = useState(false);

  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const formik = useFormik({
    initialValues: {
      label: `50 ${currencyName} Scratch Card`,
      rewardType: "COINS",
      rewardValue: 50,
      probability: 15,
      cardColor: "#4F46E5",
      isActive: true,
      rewardId: "",

      // Shared Delivery & Fulfillment pillar tracking
      mechanism: "INTERNAL" as "INTERNAL" | "ECOMMERCE" | "DIGITAL_GIFT_CARD",
      selectedRuleId: "",

      // Member Eligibility & Access Controls (PolarisEligibilityCard)
      memberEligibility: "ALL",
      membershipTierId: [] as string[],
      eligibleTierIds: [] as string[],
      eligibleUserIds: [] as string[],
      eligibleSegmentIds: [] as string[],
      eligibleRoles: [] as string[],
      showToAllMembers: true,

      // Anti-Abuse & Guardrails
      minAccountAge: 0,
      minActivity: 0,
      cooldownPeriod: 0,
      blockWarnedUsers: false,
      eligibilityDescription: "",

      // Pillar 1: Internal Voucher
      manualBatchId: "",

      // Pillar 2: Store Discount
      storeDiscountRuleId: "",
      storeDiscountType: "FIXED_AMOUNT",
      storeCodePrefix: "THRICO-",
      storeMinCart: 0,
      customerLock: true,
      ecommerceDiscountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT",
      ecommerceDiscountValue: 20,
      ecommerceTitle: "20% Off Store Voucher",

      // Pillar 3: Brand Digital Gift Card
      digitalCardRuleId: "",
      giftCardBrand: "",
      giftCardProductId: "",
      giftCardDenomination: 100,
      giftCardValue: 0,
      giftCardFee: 0,

      // Coupon-compatibility fields
      title: "",
      description: "",
      couponCode: "",
      couponType: "ONE_TO_ONE",
      inventoryRequired: false,
      discountValue: "",
      discountType: "Flat",
      validityDays: 30,
      image: "",

      totalUsageLimit: 0,
      perUserLimit: 0,
    },
    validationSchema: scratchTierSchema,
    onSubmit: async (values) => {
      try {
        const tierIds = Array.isArray(values.membershipTierId)
          ? values.membershipTierId
          : values.membershipTierId
            ? [values.membershipTierId]
            : values.eligibleTierIds || [];

        const ruleId = values.selectedRuleId || values.rewardId || null;

        const baseInput: any = {
          label: values.label.trim(),
          probability: Number(values.probability || 15),
          cardColor: values.cardColor || "#4F46E5",
          isActive: values.isActive,
          eligibility: {
            memberEligibility: values.memberEligibility || "ALL",
            membershipTierId: tierIds,
            eligibleTierIds: tierIds,
            eligibleUserIds: values.eligibleUserIds || [],
            minAccountAge: Number(values.minAccountAge || 0),
            minActivity: Number(values.minActivity || 0),
            cooldownPeriod: Number(values.cooldownPeriod || 0),
            blockWarnedUsers: values.blockWarnedUsers,
            eligibilityDescription: values.eligibilityDescription,
            showToAllMembers: values.showToAllMembers ?? true,
          },
        };

        if (values.rewardType === "COINS") {
          baseInput.type = "COINS";
          baseInput.value = Number(values.rewardValue || 50);
        } else if (values.rewardType === "NO_REWARDS") {
          baseInput.type = "NO_REWARDS";
          baseInput.value = 0;
        } else if (
          values.rewardType === "DIGITAL_GIFT_CARD" ||
          values.rewardType === "GIFT_CARD"
        ) {
          const cardRuleId = values.digitalCardRuleId || ruleId;
          baseInput.type = "VOUCHER";
          baseInput.value = Number(
            values.giftCardDenomination || values.rewardValue || 100,
          );
          baseInput.mechanism = {
            type: "DIGITAL_GIFT_CARD",
            ruleId: cardRuleId || null,
            digitalCardRuleId: cardRuleId || null,
          };
        } else if (
          values.rewardType === "STORE_DISCOUNT" ||
          values.rewardType === "ECOMMERCE"
        ) {
          const storeRuleId = values.storeDiscountRuleId || ruleId;
          baseInput.type = "VOUCHER";
          baseInput.value = Number(
            values.ecommerceDiscountValue || values.rewardValue || 20,
          );
          baseInput.mechanism = {
            type: "STORE_DISCOUNT",
            ruleId: storeRuleId || null,
            storeDiscountRuleId: storeRuleId || null,
          };
        } else {
          // INTERNAL_VOUCHER or VOUCHER
          const manualId = values.manualBatchId || ruleId;
          baseInput.type = "VOUCHER";
          baseInput.value = Number(values.rewardValue || 0);
          baseInput.mechanism = {
            type: "INTERNAL_VOUCHER",
            ruleId: manualId || null,
            manualBatchId: manualId || null,
          };
        }

        await createTier({ variables: { input: baseInput } });
        toast({
          title: "Scratch Tier Created",
          description: "New reward tier published to scratch engine.",
        });
        setSaved(true);
        router.push("/gamification/rewards/engagement-games/scratch-card");
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Failed to create tier",
          description: err?.message || "An unexpected error occurred",
        });
      }
    },
  });

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title="Add Scratch Tier"
        badgeText="Scratch & Win Tier"
        description="Configure a new reward tier, member eligibility gating, and fulfillment rules."
        icon={RectangleHorizontal}
        breadcrumbs={[
          { label: "Gamification", href: "/gamification" },
          { label: "Rewards", href: "/gamification/rewards" },
          {
            label: "Engagement Games",
            href: "/gamification/rewards/engagement-games",
          },
          {
            label: "Scratch Card",
            href: "/gamification/rewards/engagement-games/scratch-card",
          },
          { label: "Add Reward Tier" },
        ]}
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        <PolarisFormLayout
          sidebar={
            <ScratchTierPreviewSidebar
              formik={formik}
              currencyName={currencyName}
            />
          }
        >
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <ScratchTierFormSections
              formik={formik}
              currencyName={currencyName}
            />
          </form>
        </PolarisFormLayout>
      </EcosystemContainer>

      {/* ── Floating Action Bar ───────────────────────────────────────── */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        isSaving={loading}
        onSave={() => formik.submitForm()}
        onReset={() => {
          formik.resetForm();
          setSaved(false);
        }}
        title="New Scratch Tier"
        description="Publish this reward tier to the active scratch game."
        buttonText="Create Scratch Tier"
        saved={saved}
      />
    </EcosystemWrapper>
  );
}

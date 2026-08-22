"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { RectangleHorizontal, Sparkles } from "lucide-react";
import { useCreateScratchCardPrize } from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { ScratchTierFormSections } from "@/components/rewards/scratch-card/create/scratch-tier-form-sections";
import { ScratchTierPreviewSidebar } from "@/components/rewards/scratch-card/create/scratch-tier-preview-sidebar";

const scratchTierSchema = Yup.object().shape({
  label: Yup.string().required("Tier label is required"),
  rewardType: Yup.string().required("Reward type is required"),
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

      // Coupon-compatibility fields for pillar sub-sections
      title: "",
      description: "",
      couponCode: "",
      couponType: "ONE_TO_ONE",
      inventoryRequired: false,
      discountValue: "",
      discountType: "Flat",
      validityDays: 30,
      image: "",

      // Supply limits (not shown but needed by pillar sections)
      totalUsageLimit: 0,
      perUserLimit: 0,
    },
    validationSchema: scratchTierSchema,
    onSubmit: async (values) => {
      try {
        const ruleId = values.selectedRuleId || values.rewardId || null;

        const tierIds = Array.isArray(values.membershipTierId)
          ? values.membershipTierId
          : values.membershipTierId
            ? [values.membershipTierId]
            : values.eligibleTierIds || [];

        const eligibilityInput = {
          memberEligibility: values.memberEligibility || "ALL",
          membershipTierId: tierIds,
          eligibleTierIds: tierIds,
          eligibleUserIds: values.eligibleUserIds || [],
          eligibleSegmentIds: values.eligibleSegmentIds || [],
          eligibleRoles: values.eligibleRoles || [],
          minAccountAge: Number(values.minAccountAge || 0),
          minActivityRequired: Number(values.minActivity || 0),
          totalUsageLimit: Number(values.totalUsageLimit || 0),
          perUserLimit: Number(values.perUserLimit || 0),
          cooldownPeriod: Number(values.cooldownPeriod || 0),
          blockWarnedUsers: Boolean(values.blockWarnedUsers || false),
        };

        const baseInput: any = {
          label: values.label.trim(),
          minAccountAge: Number(values.minAccountAge || 0),
          minActivity: Number(values.minActivity || 0),
          eligibilityDescription: values.eligibilityDescription || "",
          eligibility: eligibilityInput,
        };

        if (values.rewardType === "COINS") {
          baseInput.type = "COINS";
          baseInput.value = Number(values.rewardValue || 50);
          baseInput.coinsAmount = Number(values.rewardValue || 50);
        } else if (values.rewardType === "NO_REWARDS") {
          baseInput.type = "NO_REWARDS";
          baseInput.value = 0;
          baseInput.tryAgainMessage =
            values.label.trim() || "Better Luck Next Time";
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
          title: "Tier created",
          description: "Reward tier added successfully to Scratch Card engine.",
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
    <form onSubmit={formik.handleSubmit}>
      <EcosystemWrapper className="flex-col gap-4 flex min-h-screen bg-[#fafafa] dark:bg-black/10">
        <EcosystemHeader
          title="Add Reward Tier"
          badgeText="Scratch & Win Tier"
          description="Define a new reward prize, win probability, and member eligibility parameters."
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
        {/* ── Form Body & Preview Sidebar Layout ────────────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <PolarisFormLayout
            sidebar={
              <ScratchTierPreviewSidebar
                formik={formik}
                currencyName={currencyName}
              />
            }
          >
            <ScratchTierFormSections
              formik={formik}
              currencyName={currencyName}
            />
          </PolarisFormLayout>
        </div>

        {/* ── Floating Action Bar ───────────────────────────────────────── */}
        <FloatingSavePanel
          hasChanged={formik.dirty || true}
          isSaving={loading}
          onSave={formik.handleSubmit}
          onReset={() =>
            router.push("/gamification/rewards/engagement-games/scratch-card")
          }
          title="New Scratch Card Tier"
          description="Publish this reward tier to the active scratch game."
          buttonText="Create Reward Tier"
          saved={saved}
        />
      </EcosystemWrapper>
    </form>
  );
}

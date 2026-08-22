"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "@/hooks/use-toast";
import { RectangleHorizontal, Loader2 } from "lucide-react";
import {
  useGetScratchCardPrizeById,
  useUpdateScratchCardPrize,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { ScratchTierFormSections } from "@/components/rewards/scratch-card/create/scratch-tier-form-sections";
import { ScratchTierPreviewSidebar } from "@/components/rewards/scratch-card/create/scratch-tier-preview-sidebar";
import { resolveGameRewardType } from "@/components/rewards/scratch-card/types";

const scratchTierSchema = Yup.object().shape({
  label: Yup.string().required("Tier label is required"),
  rewardType: Yup.string().required("Reward type is required"),
});

export default function EditScratchCardTierPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: prizeData, loading: prizeLoading } = useGetScratchCardPrizeById({
    id: id as string,
  });

  const [updateTier, { loading: updatingTier }] = useUpdateScratchCardPrize();
  const [saved, setSaved] = useState(false);

  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const prize = prizeData?.getScratchCardPrizeById;

  const formik = useFormik({
    initialValues: {
      label: "",
      rewardType: "COINS",
      rewardValue: 50,
      probability: 15,
      cardColor: "#4F46E5",
      isActive: true,
      rewardId: "",

      // Shared Delivery & Fulfillment pillar tracking
      mechanism: "INTERNAL" as "INTERNAL" | "ECOMMERCE" | "DIGITAL_GIFT_CARD",
      selectedRuleId: "",

      // Member Eligibility & Access Controls
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

      // Supply limits
      totalUsageLimit: 0,
      perUserLimit: 0,
    },
    validationSchema: scratchTierSchema,
    enableReinitialize: true,
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
          isActive: values.isActive,
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

        await updateTier({ variables: { id, input: baseInput } });
        toast({
          title: "Tier updated",
          description: "Reward tier modified successfully.",
        });
        setSaved(true);
        router.push("/gamification/rewards/engagement-games/scratch-card");
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Failed to update tier",
          description: err?.message || "An unexpected error occurred",
        });
      }
    },
  });

  // Populate form with fetched prize data
  useEffect(() => {
    if (prize) {
      const uiType = resolveGameRewardType(prize);
      const ruleId =
        prize.storeDiscountRuleId ||
        prize.manualBatchId ||
        prize.digitalCardRuleId ||
        prize.mechanism?.ruleId ||
        "";

      let mechCategory: "INTERNAL" | "ECOMMERCE" | "DIGITAL_GIFT_CARD" = "INTERNAL";
      if (uiType === "ECOMMERCE") {
        mechCategory = "ECOMMERCE";
      } else if (uiType === "GIFT_CARD") {
        mechCategory = "DIGITAL_GIFT_CARD";
      }

      formik.resetForm({
        values: {
          label: prize.label || "",
          rewardType: uiType,
          rewardValue: prize.value ?? prize.coinsAmount ?? 50,
          probability: 15,
          cardColor: "#4F46E5",
          isActive: prize.isActive !== false,
          rewardId: ruleId,

          mechanism: mechCategory,
          selectedRuleId: ruleId,

          memberEligibility: prize.eligibility?.memberEligibility || "ALL",
          membershipTierId:
            prize.eligibility?.membershipTierId ||
            prize.eligibility?.eligibleTierIds ||
            [],
          eligibleTierIds:
            prize.eligibility?.eligibleTierIds ||
            prize.eligibility?.membershipTierId ||
            [],
          eligibleUserIds: prize.eligibility?.eligibleUserIds || [],
          eligibleSegmentIds: prize.eligibility?.eligibleSegmentIds || [],
          eligibleRoles: prize.eligibility?.eligibleRoles || [],

          minAccountAge:
            prize.minAccountAge || prize.eligibility?.minAccountAge || 0,
          minActivity:
            prize.minActivity || prize.eligibility?.minActivityRequired || 0,
          cooldownPeriod: prize.eligibility?.cooldownPeriod || 0,
          blockWarnedUsers: prize.eligibility?.blockWarnedUsers || false,
          eligibilityDescription: prize.eligibilityDescription || "",

          manualBatchId: prize.manualBatchId || ruleId || "",
          storeDiscountRuleId: prize.storeDiscountRuleId || ruleId || "",
          storeDiscountType: "FIXED_AMOUNT",
          storeCodePrefix: "THRICO-",
          storeMinCart: 0,
          customerLock: true,
          ecommerceDiscountType: "PERCENTAGE",
          ecommerceDiscountValue:
            prize.storeDiscountRule?.discountValue || prize.value || 20,
          ecommerceTitle: prize.storeDiscountRule?.title || "Store Voucher",

          digitalCardRuleId: prize.digitalCardRuleId || ruleId || "",
          giftCardBrand: "",
          giftCardProductId: "",
          giftCardDenomination:
            prize.digitalCardRule?.faceValue || prize.value || 100,
          giftCardValue: prize.digitalCardRule?.faceValue || prize.value || 100,
          giftCardFee: 0,

          title: prize.label || "",
          description: prize.tryAgainMessage || "",
          couponCode: "",
          couponType: "ONE_TO_ONE",
          inventoryRequired: false,
          discountValue: String(prize.value || ""),
          discountType: "Flat",
          validityDays: 30,
          image: "",

          totalUsageLimit: prize.eligibility?.totalUsageLimit || 0,
          perUserLimit: prize.eligibility?.perUserLimit || 0,
        },
      });
    }
  }, [prize]);

  if (prizeLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <EcosystemWrapper className="flex-col gap-4 flex min-h-screen bg-[#fafafa] dark:bg-black/10">
        <EcosystemHeader
          title={`Edit ${prize?.label || "Reward Tier"}`}
          badgeText="Scratch & Win Tier"
          description="Update reward prize values, member qualification rules, and engine availability."
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
            { label: "Edit Reward Tier" },
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
          hasChanged={formik.dirty}
          isSaving={updatingTier}
          onSave={formik.handleSubmit}
          onReset={() =>
            router.push("/gamification/rewards/engagement-games/scratch-card")
          }
          title="Unsaved Tier Changes"
          description="You have modified properties for this scratch card tier."
          buttonText="Save Changes"
          saved={saved}
        />
      </EcosystemWrapper>
    </form>
  );
}

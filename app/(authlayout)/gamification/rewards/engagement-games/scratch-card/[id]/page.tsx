"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "@/hooks/use-toast";
import { RectangleHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
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

export default function EditScratchCardTierPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: prizeData, loading: prizeLoading } = useGetScratchCardPrizeById(
    {
      id: id as string,
    },
  );

  const [updateTier, { loading: updatingTier }] = useUpdateScratchCardPrize();
  const [saved, setSaved] = useState(false);

  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const prize =
    prizeData?.getScratchCardPrizeById || prizeData?.getScratchCardPrize;

  const initialValues = useMemo(() => {
    if (!prize) {
      return {
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
      };
    }

    const uiType = resolveGameRewardType(prize);
    const ruleId =
      prize.storeDiscountRuleId ||
      prize.manualBatchId ||
      prize.digitalCardRuleId ||
      prize.eligibilityRuleId ||
      prize.mechanism?.ruleId ||
      "";

    let mechCategory: "INTERNAL" | "ECOMMERCE" | "DIGITAL_GIFT_CARD" =
      "INTERNAL";
    if (uiType === "ECOMMERCE") {
      mechCategory = "ECOMMERCE";
    } else if (uiType === "GIFT_CARD") {
      mechCategory = "DIGITAL_GIFT_CARD";
    }

    const prizeLabel = prize.label || prize.tryAgainMessage || "";

    return {
      label: prizeLabel,
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
      showToAllMembers: prize.eligibility?.showToAllMembers ?? true,

      minAccountAge:
        prize.minAccountAge || prize.eligibility?.minAccountAge || 0,
      minActivity:
        prize.minActivity || prize.eligibility?.minActivityRequired || 0,
      cooldownPeriod: prize.eligibility?.cooldownPeriod || 0,
      blockWarnedUsers: prize.eligibility?.blockWarnedUsers || false,
      eligibilityDescription: prize.eligibilityDescription || "",

      manualBatchId: prize.manualBatchId || ruleId || "",
      storeDiscountRuleId: prize.storeDiscountRuleId || ruleId || "",
      storeDiscountType:
        prize.storeDiscountRule?.discountType || "FIXED_AMOUNT",
      storeCodePrefix: "THRICO-",
      storeMinCart: 0,
      customerLock: true,
      ecommerceDiscountType:
        prize.storeDiscountRule?.discountType === "PERCENTAGE"
          ? "PERCENTAGE"
          : "FIXED_AMOUNT",
      ecommerceDiscountValue:
        prize.storeDiscountRule?.discountValue || prize.value || 20,
      ecommerceTitle: prize.storeDiscountRule?.title || "Store Voucher",

      digitalCardRuleId: prize.digitalCardRuleId || ruleId || "",
      giftCardBrand: prize.digitalCardRule?.brandName || "",
      giftCardProductId: "",
      giftCardDenomination:
        prize.digitalCardRule?.faceValue || prize.value || 100,
      giftCardValue: prize.digitalCardRule?.faceValue || prize.value || 100,
      giftCardFee: 0,

      title: prizeLabel,
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
    };
  }, [prize]);

  const formik = useFormik({
    initialValues,
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
          showToAllMembers: Boolean(values.showToAllMembers ?? true),
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

  if (prizeLoading) {
    return (
      <EcosystemWrapper className="flex-col gap-4 flex min-h-screen bg-[#fafafa] dark:bg-black/10">
        <EcosystemHeader
          title="Loading Reward Tier..."
          badgeText="Scratch & Win Tier"
          description="Fetching reward prize parameters, member qualification rules, and engine configuration."
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

        {/* ── Skeleton Form Body & Preview Sidebar Layout ─────────────────── */}
        <div className="flex-1 overflow-y-auto">
          <PolarisFormLayout
            sidebar={
              <div className="space-y-6">
                {/* Sidebar Card Mockup Skeleton */}
                <div className="p-5 rounded-2xl border border-border bg-card shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-12 rounded-full" />
                  </div>
                  <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                  <div className="space-y-2 pt-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>

                {/* Sidebar Details Info Skeleton */}
                <div className="p-4 rounded-xl border border-border bg-card shadow-xs space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full rounded-lg" />
                    <Skeleton className="h-8 w-full rounded-lg" />
                  </div>
                </div>
              </div>
            }
          >
            <div className="space-y-6">
              {/* Step 1 Skeleton */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-6 rounded-full" />
                      <Skeleton className="h-5 w-48" />
                    </div>
                    <Skeleton className="h-3.5 w-72" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-20 w-full rounded-xl" />
                  ))}
                </div>
                <Skeleton className="h-28 w-full rounded-xl" />
              </div>

              {/* Step 2 Skeleton */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-6 rounded-full" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                    <Skeleton className="h-3.5 w-64" />
                  </div>
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-9 w-32 rounded-lg" />
                  </div>
                  <Skeleton className="h-14 w-full rounded-xl" />
                </div>
              </div>

              {/* Step 3 Skeleton */}
              <div className="p-6 rounded-2xl border border-border bg-card shadow-xs space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-5 w-6 rounded-full" />
                      <Skeleton className="h-5 w-44" />
                    </div>
                    <Skeleton className="h-3.5 w-80" />
                  </div>
                  <Skeleton className="h-5 w-24 rounded-full" />
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Skeleton className="h-24 w-full rounded-xl" />
                    <Skeleton className="h-24 w-full rounded-xl" />
                  </div>
                  <Skeleton className="h-16 w-full rounded-xl" />
                </div>
              </div>
            </div>
          </PolarisFormLayout>
        </div>
      </EcosystemWrapper>
    );
  }

  if (!prize && !prizeLoading) {
    return (
      <EcosystemWrapper className="flex-col gap-4 flex min-h-screen bg-[#fafafa] dark:bg-black/10">
        <EcosystemHeader
          title="Reward Tier Not Found"
          badgeText="Scratch & Win Tier"
          description="The requested scratch card tier could not be found or has been deleted."
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
            { label: "Not Found" },
          ]}
        />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-4 max-w-sm">
            <div className="h-14 w-14 rounded-2xl bg-muted flex items-center justify-center mx-auto border border-border">
              <RectangleHorizontal className="h-7 w-7 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-foreground">
                Tier Not Found
              </h2>
              <p className="text-xs text-muted-foreground">
                This scratch card reward tier does not exist or may have been removed.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                router.push(
                  "/gamification/rewards/engagement-games/scratch-card",
                )
              }
              className="text-xs font-semibold"
            >
              Back to Scratch Cards
            </Button>
          </div>
        </div>
      </EcosystemWrapper>
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

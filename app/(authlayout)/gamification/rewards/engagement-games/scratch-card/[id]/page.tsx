"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "@/hooks/use-toast";
import { RectangleHorizontal, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  useGetScratchCardPrizeById,
  useUpdateScratchCardPrize,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
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
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

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
      };
    }

    const elig = prize?.eligibility || {};
    const uIds = elig?.eligibleUserIds || [];
    const tIds = elig?.membershipTierId || elig?.eligibleTierIds || [];
    const mEligibility =
      elig?.memberEligibility ||
      (uIds.length > 0
        ? "SPECIFIC_CUSTOMERS"
        : tIds.length > 0
          ? "TIERS"
          : "ALL");

    const derivedRewardType = resolveGameRewardType(
      prize?.type,
      prize?.mechanism?.type,
    );

    return {
      label: prize?.label || prize?.title || "",
      rewardType: derivedRewardType,
      rewardValue: prize?.value || 50,
      probability: prize?.probability || 15,
      cardColor: prize?.cardColor || "#4F46E5",
      isActive: prize?.isActive ?? true,
      rewardId: prize?.mechanism?.ruleId || "",

      // Shared Delivery & Fulfillment pillar tracking
      mechanism: (prize?.mechanism?.type === "STORE_DISCOUNT"
        ? "ECOMMERCE"
        : prize?.mechanism?.type === "DIGITAL_GIFT_CARD"
          ? "DIGITAL_GIFT_CARD"
          : prize?.type === "COINS"
            ? "COINS"
            : prize?.type === "NO_REWARDS"
              ? "NO_REWARDS"
              : "INTERNAL") as any,
      selectedRuleId: prize?.mechanism?.ruleId || "",

      // Member Eligibility & Access Controls
      memberEligibility: mEligibility,
      membershipTierId: tIds,
      eligibleTierIds: tIds,
      eligibleUserIds: uIds,
      eligibleSegmentIds: elig?.eligibleSegmentIds || [],
      eligibleRoles: elig?.eligibleRoles || [],
      showToAllMembers: elig?.showToAllMembers ?? true,

      // Anti-Abuse & Guardrails
      minAccountAge: elig?.minAccountAge ?? 0,
      minActivity: elig?.minActivity ?? 0,
      cooldownPeriod: elig?.cooldownPeriod ?? 0,
      blockWarnedUsers: elig?.blockWarnedUsers ?? false,
      eligibilityDescription: elig?.eligibilityDescription || "",

      // Pillar 1: Internal Voucher
      manualBatchId:
        prize?.mechanism?.manualBatchId || prize?.mechanism?.ruleId || "",

      // Pillar 2: Store Discount
      storeDiscountRuleId:
        prize?.mechanism?.storeDiscountRuleId ||
        prize?.mechanism?.ruleId ||
        "",
      storeDiscountType: "FIXED_AMOUNT",
      storeCodePrefix: "THRICO-",
      storeMinCart: 0,
      customerLock: true,
      ecommerceDiscountType: "PERCENTAGE" as "PERCENTAGE" | "FIXED_AMOUNT",
      ecommerceDiscountValue: 20,
      ecommerceTitle: "20% Off Store Voucher",

      // Pillar 3: Brand Digital Gift Card
      digitalCardRuleId:
        prize?.mechanism?.digitalCardRuleId ||
        prize?.mechanism?.ruleId ||
        "",
      giftCardBrand: "",
      giftCardProductId: "",
      giftCardDenomination: 100,
      giftCardValue: 0,
      giftCardFee: 0,

      // Coupon-compatibility fields
      title: prize?.label || prize?.title || "",
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
    };
  }, [prize]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
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

        await updateTier({ variables: { id, input: baseInput } });
        toast({
          title: "Tier Updated",
          description: "Scratch card reward tier configuration saved.",
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

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={prize ? `Edit · ${prize.label || prize.title}` : "Edit Scratch Tier"}
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
          { label: prize?.label || prize?.title || "Edit Tier" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/gamification/rewards/engagement-games/scratch-card">
              <Button
                variant="outline"
                className="text-[13px] font-medium h-[36px] gap-1.5 border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-[#303030] dark:text-zinc-100 cursor-pointer shadow-xs rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4 text-[#616161]" />
                Back to Scratch Cards
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        {prizeLoading ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : !prize ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[12px] bg-white dark:bg-zinc-900 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <RectangleHorizontal className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-[#303030] dark:text-zinc-100">
                Scratch Tier Not Found
              </h3>
              <p className="text-[13px] text-[#616161] dark:text-zinc-400">
                This reward tier may have been deleted or the link is invalid.
              </p>
            </div>
            <Link href="/gamification/rewards/engagement-games/scratch-card">
              <Button
                variant="outline"
                className="gap-2 text-[13px] font-medium h-[36px] border-[#aeb4b9] rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Scratch Cards
              </Button>
            </Link>
          </div>
        ) : (
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
        )}
      </EcosystemContainer>

      {/* ── Floating Action Bar ───────────────────────────────────────── */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        isSaving={updatingTier}
        onSave={() => formik.submitForm()}
        onReset={() => {
          formik.resetForm();
          setSaved(false);
        }}
        title="Unsaved Tier Changes"
        description="You have modified properties for this scratch card tier."
        buttonText="Save Changes"
        saved={saved}
      />
    </EcosystemWrapper>
  );
}

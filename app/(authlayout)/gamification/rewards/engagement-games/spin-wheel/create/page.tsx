"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Dices, AlertTriangle } from "lucide-react";
import {
  useCreateSpinWheelPrize,
  useGetSpinWheelConfig,
  useGetSpinWheelPrizes,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { SpinSegmentFormSections } from "@/components/rewards/spin-wheel/create/spin-segment-form-sections";
import { SpinSegmentPreviewSidebar } from "@/components/rewards/spin-wheel/create/spin-segment-preview-sidebar";

const spinSegmentSchema = Yup.object().shape({
  label: Yup.string().required("Segment label is required"),
  rewardType: Yup.string().required("Reward type is required"),
  probability: Yup.number()
    .min(0.1, "Minimum probability is 0.1%")
    .max(100, "Maximum probability is 100%")
    .required("Probability is required"),
});

export default function CreateSpinWheelSegmentPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [createPrize, { loading }] = useCreateSpinWheelPrize();
  const { data: configData } = useGetSpinWheelConfig();
  const { data: prizesData } = useGetSpinWheelPrizes();
  const [saved, setSaved] = useState(false);

  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const currentCount = prizesData?.getSpinWheelPrizes?.length || 0;
  const maxWheelItems =
    configData?.getSpinWheelConfig?.maxWheelItems ||
    configData?.getSpinWheelConfig?.maxItems ||
    12;
  const isLimitReached = currentCount >= maxWheelItems;

  const formik = useFormik({
    initialValues: {
      label: `20 ${currencyName}`,
      rewardType: "COINS",
      rewardValue: 20,
      probability: 10,
      color: "#4F46E5",
      sortOrder: currentCount + 1,
      isActive: true,
      rewardId: "",

      // Shared Delivery & Fulfillment pillar tracking
      mechanism: "INTERNAL" as "INTERNAL" | "ECOMMERCE" | "DIGITAL_GIFT_CARD",
      selectedRuleId: "",

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
    validationSchema: spinSegmentSchema,
    onSubmit: async (values) => {
      if (isLimitReached) {
        toast({
          variant: "destructive",
          title: "Maximum wheel items reached",
          description: `Cannot add more than ${maxWheelItems} segments. Please delete or update existing segments.`,
        });
        return;
      }

      try {
        const ruleId = values.selectedRuleId || values.rewardId || null;

        const baseInput: any = {
          label: values.label.trim(),
          probability: Number(values.probability || 10),
          color: values.color || "#4F46E5",
          sortOrder: Number(values.sortOrder || 1),
          isActive: values.isActive,
        };

        if (values.rewardType === "COINS") {
          baseInput.type = "COINS";
          baseInput.value = Number(values.rewardValue || 20);
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

        await createPrize({ variables: { input: baseInput } });
        toast({
          title: "Segment added",
          description: "New wheel segment created successfully.",
        });
        setSaved(true);
        router.push("/gamification/rewards/engagement-games/spin-wheel");
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Failed to add segment",
          description: err?.message || "An unexpected error occurred",
        });
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <EcosystemWrapper className="flex-col gap-4 flex min-h-screen bg-[#fafafa] dark:bg-black/10">
        <EcosystemHeader
          title="Add Wheel Segment"
          badgeText="Spin & Win Segment"
          description="Define a new prize slice, win probability, and slice color."
          icon={Dices}
          breadcrumbs={[
            { label: "Gamification", href: "/gamification" },
            { label: "Rewards", href: "/gamification/rewards" },
            {
              label: "Engagement Games",
              href: "/gamification/rewards/engagement-games",
            },
            {
              label: "Spin Wheel",
              href: "/gamification/rewards/engagement-games/spin-wheel",
            },
            { label: "Add Wheel Segment" },
          ]}
        />

        {/* ── Form Body & Preview Sidebar Layout ────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 max-w-7xl mx-auto w-full space-y-4">
          {/* Wheel Limit Warning Banner */}
          {isLimitReached && (
            <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/90 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 flex items-start gap-3 shadow-xs">
              <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold">
                  Wheel Capacity Reached ({currentCount}/{maxWheelItems} Segments)
                </h4>
                <p className="text-[11px] opacity-90 leading-relaxed">
                  You have configured the maximum allowed number of wheel segments ({maxWheelItems}). You cannot add more segments until you remove or modify existing ones in the manager.
                </p>
              </div>
            </div>
          )}

          <PolarisFormLayout
            sidebar={
              <SpinSegmentPreviewSidebar
                formik={formik}
                currencyName={currencyName}
              />
            }
          >
            <SpinSegmentFormSections
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
            router.push("/gamification/rewards/engagement-games/spin-wheel")
          }
          title={isLimitReached ? "Wheel Full" : "New Wheel Segment"}
          description={
            isLimitReached
              ? `Maximum wheel items limit (${maxWheelItems}) reached.`
              : "Publish this segment slice to the active spin wheel."
          }
          buttonText={
            isLimitReached
              ? `Wheel Full (${currentCount}/${maxWheelItems})`
              : "Create Wheel Segment"
          }
          saved={saved}
        />
      </EcosystemWrapper>
    </form>
  );
}

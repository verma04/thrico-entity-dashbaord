"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "@/hooks/use-toast";
import { Dices, Loader2 } from "lucide-react";
import {
  useGetSpinWheelPrizes,
  useUpdateSpinWheelPrize,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { SpinSegmentFormSections } from "@/components/rewards/spin-wheel/create/spin-segment-form-sections";
import { SpinSegmentPreviewSidebar } from "@/components/rewards/spin-wheel/create/spin-segment-preview-sidebar";
import { resolveGameRewardType } from "@/components/rewards/spin-wheel/constants";

const spinSegmentSchema = Yup.object().shape({
  label: Yup.string().required("Segment label is required"),
  rewardType: Yup.string().required("Reward type is required"),
  probability: Yup.number()
    .min(0.1, "Minimum probability is 0.1%")
    .max(100, "Maximum probability is 100%")
    .required("Probability is required"),
});

export default function EditSpinWheelSegmentPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: prizesData, loading: prizesLoading } = useGetSpinWheelPrizes();
  const [updatePrize, { loading: updatingPrize }] = useUpdateSpinWheelPrize();
  const [saved, setSaved] = useState(false);

  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const prize = useMemo(() => {
    if (!prizesData?.getSpinWheelPrizes) return null;
    return prizesData.getSpinWheelPrizes.find((p: any) => p.id === id);
  }, [prizesData, id]);

  const formik = useFormik({
    initialValues: {
      label: "",
      rewardType: "COINS",
      rewardValue: 20,
      probability: 10,
      color: "#4F46E5",
      sortOrder: 1,
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
    enableReinitialize: true,
    onSubmit: async (values) => {
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

        await updatePrize({ variables: { id, input: baseInput } });
        toast({
          title: "Segment updated",
          description: "Wheel segment modified successfully.",
        });
        setSaved(true);
        router.push("/gamification/rewards/engagement-games/spin-wheel");
      } catch (err: any) {
        toast({
          variant: "destructive",
          title: "Failed to update segment",
          description: err?.message || "An unexpected error occurred",
        });
      }
    },
  });

  // Prepopulate form with existing prize data
  useEffect(() => {
    if (prize) {
      const uiType = resolveGameRewardType(prize);
      const ruleId =
        prize.storeDiscountRuleId ||
        prize.manualBatchId ||
        prize.digitalCardRuleId ||
        prize.mechanism?.ruleId ||
        prize.rewardId ||
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
          rewardValue: prize.value ?? 20,
          probability: prize.probability ?? 10,
          color: prize.color || "#4F46E5",
          sortOrder: prize.sortOrder ?? 1,
          isActive: prize.isActive !== false,
          rewardId: ruleId,

          mechanism: mechCategory,
          selectedRuleId: ruleId,

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

          totalUsageLimit: 0,
          perUserLimit: 0,
        },
      });
    }
  }, [prize]);

  if (prizesLoading) {
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
          title={`Edit ${prize?.label || "Wheel Segment"}`}
          badgeText="Spin & Win Segment"
          description="Update slice prize values, winning probability, and slice colors."
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
            { label: "Edit Wheel Segment" },
          ]}
        />

        {/* ── Form Body & Preview Sidebar Layout ────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 max-w-7xl mx-auto w-full space-y-4">
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
          hasChanged={formik.dirty}
          isSaving={updatingPrize}
          onSave={formik.handleSubmit}
          onReset={() =>
            router.push("/gamification/rewards/engagement-games/spin-wheel")
          }
          title="Unsaved Segment Changes"
          description="You have modified properties for this wheel segment."
          buttonText="Save Changes"
          saved={saved}
        />
      </EcosystemWrapper>
    </form>
  );
}

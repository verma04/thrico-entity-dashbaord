"use client";

import React, { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "@/hooks/use-toast";
import { Dices, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  useGetSpinWheelPrizes,
  useUpdateSpinWheelPrize,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";
import { PolarisFormSkeleton } from "@/components/ui/platform/polaris-primitives";
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
  const id = Array.isArray(params?.id) ? params.id[0] : (params?.id as string);

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
      label: prize?.label || "",
      rewardType: resolveGameRewardType(prize?.type, prize?.mechanism?.type),
      rewardValue: prize?.value || 20,
      probability: prize?.probability || 10,
      color: prize?.color || "#4F46E5",
      sortOrder: prize?.sortOrder || 1,
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
      title: prize?.label || "",
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
    enableReinitialize: true,
    validationSchema: spinSegmentSchema,
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
          description: "Wheel segment configuration saved successfully.",
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

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={prize ? `Edit · ${prize.label}` : "Edit Wheel Segment"}
        badgeText="Spin & Win Segment"
        description="Update prize payout, win probability, and segment appearance."
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
          { label: prize?.label || "Edit Segment" },
        ]}
        actions={
          <div className="flex items-center gap-2">
            <Link href="/gamification/rewards/engagement-games/spin-wheel">
              <Button
                variant="outline"
                className="text-[13px] font-medium h-[36px] gap-1.5 border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 text-[#303030] dark:text-zinc-100 cursor-pointer shadow-xs rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4 text-[#616161]" />
                Back to Spin Wheel
              </Button>
            </Link>
          </div>
        }
      />

      <EcosystemContainer className="h-full border-none shadow-none bg-transparent p-0 ring-0">
        {prizesLoading ? (
          <PolarisFormSkeleton showHeader={false} />
        ) : !prize ? (
          <div className="flex flex-col items-center justify-center p-16 text-center border border-dashed border-[#d2d5d9] dark:border-zinc-800 rounded-[12px] bg-white dark:bg-zinc-900 space-y-4">
            <div className="h-14 w-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 shadow-xs">
              <Dices className="h-7 w-7" />
            </div>
            <div className="space-y-1 max-w-sm">
              <h3 className="text-base font-bold text-[#303030] dark:text-zinc-100">
                Segment Not Found
              </h3>
              <p className="text-[13px] text-[#616161] dark:text-zinc-400">
                This wheel slice may have been deleted or the link is invalid.
              </p>
            </div>
            <Link href="/gamification/rewards/engagement-games/spin-wheel">
              <Button
                variant="outline"
                className="gap-2 text-[13px] font-medium h-[36px] border-[#aeb4b9] rounded-[6px]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Spin Wheel
              </Button>
            </Link>
          </div>
        ) : (
          <PolarisFormLayout
            sidebar={
              <SpinSegmentPreviewSidebar
                formik={formik}
                currencyName={currencyName}
              />
            }
          >
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <SpinSegmentFormSections
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
        isSaving={updatingPrize}
        onSave={() => formik.submitForm()}
        onReset={() => {
          formik.resetForm();
          setSaved(false);
        }}
        title="Unsaved Segment Changes"
        description="You have unsaved changes to this wheel slice."
        buttonText="Save Segment Changes"
        saved={saved}
      />
    </EcosystemWrapper>
  );
}

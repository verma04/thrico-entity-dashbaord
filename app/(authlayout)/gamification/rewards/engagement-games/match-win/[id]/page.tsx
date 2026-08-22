"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { Sparkles, Loader2 } from "lucide-react";
import {
  useGetMatchWinData,
  useUpsertMatchWinCombination,
} from "@/graphql/actions/rewards";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { MatchWinFormSections } from "@/components/rewards/match-win/create/match-win-form-sections";
import { MatchWinPreviewSidebar } from "@/components/rewards/match-win/create/match-win-preview-sidebar";
import { DEFAULT_SLOT_SYMBOLS, resolveGameRewardType } from "@/components/rewards/match-win/types";

const matchWinSchema = Yup.object().shape({
  key: Yup.string().required("Rule identifier key is required"),
  rewardType: Yup.string().required("Reward type is required"),
  probability: Yup.number()
    .min(0.1, "Minimum probability is 0.1%")
    .max(100, "Maximum probability is 100%")
    .required("Probability is required"),
});

export default function EditMatchWinCombinationPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { toast } = useToast();

  const { data: gameData, loading: dataLoading } = useGetMatchWinData();
  const [upsertCombination, { loading: saving }] = useUpsertMatchWinCombination();
  const [saved, setSaved] = useState(false);

  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const config = gameData?.getMatchWinConfig;
  const dbSymbols = config?.symbols || DEFAULT_SLOT_SYMBOLS;
  const dbCombinations = config?.combinations || [];

  const combination = dbCombinations.find(
    (c: any) => c.id === id || c.key === id,
  );

  const formik = useFormik({
    initialValues: {
      key: "",
      symbol1Id: "",
      symbol2Id: "",
      symbol3Id: "",
      rewardType: "COINS",
      rewardValue: 50,
      probability: 10,
      maxWins: 0,
      isActive: true,
      rewardId: "",

      // Delivery & Fulfillment pillar tracking
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
    validationSchema: matchWinSchema,
    enableReinitialize: false,
    onSubmit: async (values) => {
      if (!config?.id) {
        toast({
          variant: "destructive",
          title: "Configuration not ready",
          description: "Match & Win game engine configuration is not loaded yet.",
        });
        return;
      }

      try {
        const isLoss =
          values.rewardType === "NO_REWARDS" || values.rewardType === "NOTHING";

        let backendType = "NO_REWARDS";
        let payoutValue = 0;
        let mechanismInput: any = null;

        if (values.rewardType === "COINS" || values.rewardType === "TC") {
          backendType = "COINS";
          payoutValue = Number(values.rewardValue || 50);
        } else if (isLoss) {
          backendType = "NO_REWARDS";
          payoutValue = 0;
        } else if (
          values.rewardType === "DIGITAL_GIFT_CARD" ||
          values.rewardType === "GIFT_CARD"
        ) {
          backendType = "DIGITAL_GIFT_CARD";
          payoutValue = Number(
            values.giftCardDenomination || values.rewardValue || 100,
          );
          const digitalRuleId =
            values.digitalCardRuleId || values.selectedRuleId || values.rewardId || null;
          if (digitalRuleId) {
            mechanismInput = {
              type: "DIGITAL_GIFT_CARD",
              digitalCardRuleId: digitalRuleId,
            };
          }
        } else if (
          values.rewardType === "STORE_DISCOUNT" ||
          values.rewardType === "ECOMMERCE"
        ) {
          backendType = "STORE_DISCOUNT";
          payoutValue = Number(
            values.ecommerceDiscountValue || values.rewardValue || 20,
          );
          const storeRuleId =
            values.storeDiscountRuleId || values.selectedRuleId || values.rewardId || null;
          if (storeRuleId) {
            mechanismInput = {
              type: "STORE_DISCOUNT",
              storeDiscountRuleId: storeRuleId,
            };
          }
        } else {
          backendType = "INTERNAL_VOUCHER";
          payoutValue = Number(values.rewardValue || 0);
          const manualBatchId =
            values.manualBatchId || values.selectedRuleId || values.rewardId || null;
          if (manualBatchId) {
            mechanismInput = {
              type: "INTERNAL_VOUCHER",
              manualBatchId,
            };
          }
        }

        const input: any = {
          id: combination?.id || id,
          key: values.key.trim().toLowerCase().replace(/\s+/g, "_"),
          type: backendType,
          value: isLoss ? 0 : payoutValue,
          probability: Number(values.probability || 10),
          maxWins: values.maxWins ? Number(values.maxWins) : null,
          symbol1Id: isLoss ? null : values.symbol1Id || null,
          symbol2Id: isLoss ? null : values.symbol2Id || null,
          symbol3Id: isLoss ? null : values.symbol3Id || null,
          ...(mechanismInput ? { mechanism: mechanismInput } : {}),
        };

        await upsertCombination({
          variables: {
            configId: config.id,
            input,
          },
        });

        sonnerToast.success("3-reel winning combination updated successfully.");
        toast({
          title: "Combination updated",
          description: "3-reel winning combination updated successfully.",
        });
        setSaved(true);
        router.push("/gamification/rewards/engagement-games/match-win");
      } catch (err: any) {
        const errorMsg =
          err?.graphQLErrors?.[0]?.message ||
          err?.networkError?.result?.errors?.[0]?.message ||
          err?.message ||
          "Failed to update combination";
        sonnerToast.error(errorMsg);
        toast({
          variant: "destructive",
          title: "Failed to update combination",
          description: errorMsg,
        });
      }
    },
  });

  // Populate form values when combination loads
  useEffect(() => {
    if (combination) {
      const uiType = resolveGameRewardType(combination);
      const ruleId =
        combination.storeDiscountRuleId ||
        combination.manualBatchId ||
        combination.digitalCardRuleId ||
        combination.mechanism?.ruleId ||
        combination.rewardId ||
        "";

      formik.setValues({
        key: combination.key || "",
        symbol1Id: combination.symbol1?.id || combination.symbol1Id || dbSymbols[0]?.id || "",
        symbol2Id: combination.symbol2?.id || combination.symbol2Id || dbSymbols[0]?.id || "",
        symbol3Id: combination.symbol3?.id || combination.symbol3Id || dbSymbols[0]?.id || "",
        rewardType: uiType as any,
        rewardValue: combination.value ?? 50,
        probability: combination.probability ?? 10,
        maxWins: combination.maxWins ?? 0,
        isActive: combination.isActive !== false,
        rewardId: ruleId,

        mechanism:
          uiType === "GIFT_CARD"
            ? "DIGITAL_GIFT_CARD"
            : uiType === "ECOMMERCE"
              ? "ECOMMERCE"
              : "INTERNAL",
        selectedRuleId: ruleId,

        manualBatchId: combination.manualBatchId || ruleId,
        storeDiscountRuleId: combination.storeDiscountRuleId || ruleId,
        storeDiscountType: "FIXED_AMOUNT",
        storeCodePrefix: "THRICO-",
        storeMinCart: 0,
        customerLock: true,
        ecommerceDiscountType: combination.ecommerceDiscountType || "PERCENTAGE",
        ecommerceDiscountValue: combination.ecommerceDiscountValue || combination.value || 20,
        ecommerceTitle: combination.ecommerceTitle || `${combination.value || 20}% Off Store`,

        digitalCardRuleId: combination.digitalCardRuleId || ruleId,
        giftCardBrand: combination.giftCardBrand || "",
        giftCardProductId: combination.giftCardProductId || "",
        giftCardDenomination: combination.giftCardDenomination || combination.value || 100,
        giftCardValue: combination.value || 100,
        giftCardFee: 0,

        title: combination.key || "",
        description: "",
        couponCode: "",
        couponType: "ONE_TO_ONE",
        inventoryRequired: false,
        discountValue: String(combination.value || 0),
        discountType: "Flat",
        validityDays: 30,
        image: "",
        totalUsageLimit: combination.maxWins || 0,
        perUserLimit: 0,
      });
    }
  }, [combination, dbSymbols]);

  if (dataLoading) {
    return (
      <EcosystemWrapper className="min-h-screen items-center justify-center flex">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground">
            Loading combination details...
          </p>
        </div>
      </EcosystemWrapper>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <EcosystemWrapper className="flex-col gap-4 flex min-h-screen bg-[#fafafa] dark:bg-black/10">
        <EcosystemHeader
          title={`Edit ${combination?.key || "Winning Combination"}`}
          badgeText="3-Reel Slot Rule"
          description="Update 3-reel matching symbols, prize values, and winning probabilities."
          icon={Sparkles}
          breadcrumbs={[
            { label: "Gamification", href: "/gamification" },
            { label: "Rewards", href: "/gamification/rewards" },
            {
              label: "Engagement Games",
              href: "/gamification/rewards/engagement-games",
            },
            {
              label: "Match & Win",
              href: "/gamification/rewards/engagement-games/match-win",
            },
            { label: combination?.key || "Edit Combination" },
          ]}
        />

        {/* ── Form Body & Preview Sidebar Layout ────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 max-w-7xl mx-auto w-full space-y-4">
          <PolarisFormLayout
            sidebar={
              <MatchWinPreviewSidebar
                formik={formik}
                currencyName={currencyName}
                symbols={dbSymbols}
              />
            }
          >
            <MatchWinFormSections
              formik={formik}
              currencyName={currencyName}
              symbols={dbSymbols}
              existingCombinations={dbCombinations}
              currentCombinationId={combination?.id || id}
            />
          </PolarisFormLayout>
        </div>

        {/* ── Floating Action Bar ───────────────────────────────────────── */}
        <FloatingSavePanel
          hasChanged={formik.dirty}
          isSaving={saving}
          onSave={formik.handleSubmit}
          onReset={() =>
            router.push("/gamification/rewards/engagement-games/match-win")
          }
          title={combination?.key || "Winning Combination"}
          description="Save updates to this 3-reel matching rule."
          buttonText="Save Changes"
          saved={saved}
        />
      </EcosystemWrapper>
    </form>
  );
}

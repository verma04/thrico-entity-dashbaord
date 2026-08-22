"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { toast as sonnerToast } from "sonner";
import { Sparkles } from "lucide-react";
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
import { DEFAULT_SLOT_SYMBOLS } from "@/components/rewards/match-win/types";

const matchWinSchema = Yup.object().shape({
  key: Yup.string().required("Rule identifier key is required"),
  rewardType: Yup.string().required("Reward type is required"),
  probability: Yup.number()
  .min(0.01, "Minimum probability is 0.01%")
  .max(100, "Maximum probability is 100%")
  .required("Probability is required"),
});

export default function CreateMatchWinCombinationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [upsertCombination, { loading }] = useUpsertMatchWinCombination();
  const { data: gameData } = useGetMatchWinData();
  const [saved, setSaved] = useState(false);

  const { data: currencyConfig } = useGetEntityCurrencyConfig();
  const currencyName =
    currencyConfig?.getEntityCurrencyConfig?.currencyName || "Points";

  const config = gameData?.getMatchWinConfig;
  const dbSymbols = config?.symbols || DEFAULT_SLOT_SYMBOLS;
  const dbCombinations = config?.combinations || [];

  const defaultSym = dbSymbols[0]?.id || dbSymbols[0]?.key || "cherry";

  const formik = useFormik({
    initialValues: {
      key: `triple_${dbSymbols[0]?.key || "cherry"}`,
      symbol1Id: defaultSym,
      symbol2Id: defaultSym,
      symbol3Id: defaultSym,
      rewardType: "COINS",
      rewardValue: 50,
      probability: 10,
      maxWins: 0,
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
    validationSchema: matchWinSchema,
    onSubmit: async (values) => {
      if (!config?.id) {
        sonnerToast.error("Game engine configuration is not ready yet.");
        toast({
          variant: "destructive",
          title: "Configuration not ready",
          description: "Match & Win game engine configuration is not loaded yet.",
        });
        return;
      }

      const isLoss =
        values.rewardType === "NO_REWARDS" || values.rewardType === "NOTHING";

      // Client-side duplicate check
      if (!isLoss && dbCombinations.length > 0) {
        const duplicate = dbCombinations.find((c: any) => {
          const s1 = c.symbol1?.id || c.symbol1?.key;
          const s2 = c.symbol2?.id || c.symbol2?.key;
          const s3 = c.symbol3?.id || c.symbol3?.key;
          return (
            s1 === values.symbol1Id &&
            s2 === values.symbol2Id &&
            s3 === values.symbol3Id
          );
        });

        if (duplicate) {
          const dupMsg = `A combination with this 3-symbol pattern already exists (${duplicate.key}).`;
          sonnerToast.error(dupMsg);
          toast({
            variant: "destructive",
            title: "3-Symbol Pattern Already Exists",
            description: `A combination with this 3-symbol pattern already exists (${duplicate.key}). Please choose a different sequence or edit rule "${duplicate.key}".`,
          });
          return;
        }
      }

      try {
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

        sonnerToast.success("New 3-reel winning combination created successfully.");
        toast({
          title: "Combination added",
          description: "New 3-reel winning combination created successfully.",
        });
        setSaved(true);
        router.push("/gamification/rewards/engagement-games/match-win");
      } catch (err: any) {
        const errorMsg =
          err?.graphQLErrors?.[0]?.message ||
          err?.networkError?.result?.errors?.[0]?.message ||
          err?.message ||
          "Failed to add combination";
        sonnerToast.error(errorMsg);
        toast({
          variant: "destructive",
          title: "Failed to add combination",
          description: errorMsg,
        });
      }
    },
  });

  React.useEffect(() => {
    if (config?.symbols && config.symbols.length > 0) {
      const firstSym = config.symbols[0];
      const defaultId = firstSym.id || firstSym.key;
      if (!formik.values.symbol1Id || formik.values.symbol1Id === "cherry") {
        formik.setFieldValue("symbol1Id", defaultId);
        formik.setFieldValue("symbol2Id", defaultId);
        formik.setFieldValue("symbol3Id", defaultId);
        formik.setFieldValue("key", `triple_${firstSym.key}`);
      }
    }
  }, [config?.symbols]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <EcosystemWrapper className="flex-col gap-4 flex min-h-screen bg-[#fafafa] dark:bg-black/10">
        <EcosystemHeader
          title="Add Winning Combination"
          badgeText="3-Reel Slot Rule"
          description="Define 3 matching reel symbols, prize fulfillment, and winning odds."
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
            { label: "Add Combination" },
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
            />
          </PolarisFormLayout>
        </div>

        {/* ── Floating Action Bar ───────────────────────────────────────── */}
        <FloatingSavePanel
          hasChanged={formik.dirty || true}
          isSaving={loading}
          onSave={formik.handleSubmit}
          onReset={() =>
            router.push("/gamification/rewards/engagement-games/match-win")
          }
          title="New Combination Rule"
          description="Publish this winning pattern rule to the active 3-reel slot machine."
          buttonText="Create Combination"
          saved={saved}
        />
      </EcosystemWrapper>
    </form>
  );
}

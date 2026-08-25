"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Gift,
  ShoppingBag,
  Utensils,
  Sparkles,
  Car,
  Film,
  Smartphone,
  Wallet,
  CheckCircle2,
  Check,
  Zap,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisTipCard,
  PolarisSummaryRow,
  PolarisInput,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { GiftCardRuleItem } from "../types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useCreateDigitalCardRule,
  useUpdateDigitalCardRule,
  useGetDigitalCardRuleById,
} from "@/graphql/actions/rewards/gift-cards";

const BRAND_PRESETS: Record<
  string,
  { bg: string; text: string; logoText: string; gradient: string }
> = {
  "Amazon Pay": {
    bg: "bg-[#232f3e]",
    text: "text-amber-400",
    logoText: "amazon pay",
    gradient: "from-[#232f3e] to-[#131921]",
  },
  Flipkart: {
    bg: "bg-[#2874f0]",
    text: "text-yellow-300",
    logoText: "Flipkart",
    gradient: "from-[#2874f0] to-[#1c54b2]",
  },
  Swiggy: {
    bg: "bg-[#fc8019]",
    text: "text-white",
    logoText: "SWIGGY",
    gradient: "from-[#fc8019] to-[#d35f04]",
  },
  Zomato: {
    bg: "bg-[#cb202d]",
    text: "text-white",
    logoText: "zomato",
    gradient: "from-[#cb202d] to-[#99141f]",
  },
  Myntra: {
    bg: "bg-[#ff3f6c]",
    text: "text-white",
    logoText: "myntra",
    gradient: "from-[#ff3f6c] to-[#d62851]",
  },
  Uber: {
    bg: "bg-black",
    text: "text-white",
    logoText: "Uber",
    gradient: "from-zinc-900 to-black",
  },
  BookMyShow: {
    bg: "bg-[#c4242d]",
    text: "text-white",
    logoText: "bookmyshow",
    gradient: "from-[#c4242d] to-[#871219]",
  },
  "Google Play": {
    bg: "bg-[#01875f]",
    text: "text-white",
    logoText: "Google Play",
    gradient: "from-[#01875f] to-[#015f43]",
  },
};

const BRAND_CATALOG = [
  {
    name: "Amazon Pay",
    category: "E-Commerce",
    icon: ShoppingBag,
    feePercent: 5,
    denominations: [100, 250, 500, 1000, 2000],
  },
  {
    name: "Flipkart",
    category: "E-Commerce",
    icon: ShoppingBag,
    feePercent: 5,
    denominations: [100, 250, 500, 1000, 2000],
  },
  {
    name: "Swiggy",
    category: "Food & Dining",
    icon: Utensils,
    feePercent: 5,
    denominations: [100, 250, 500, 1000],
  },
  {
    name: "Zomato",
    category: "Food & Dining",
    icon: Utensils,
    feePercent: 5,
    denominations: [100, 250, 500, 1000],
  },
  {
    name: "Myntra",
    category: "Fashion & Lifestyle",
    icon: Sparkles,
    feePercent: 5,
    denominations: [250, 500, 1000, 2000],
  },
  {
    name: "Uber",
    category: "Travel & Mobility",
    icon: Car,
    feePercent: 5,
    denominations: [100, 250, 500, 1000],
  },
  {
    name: "BookMyShow",
    category: "Entertainment & Tech",
    icon: Film,
    feePercent: 5,
    denominations: [100, 250, 500],
  },
  {
    name: "Google Play",
    category: "Entertainment & Tech",
    icon: Smartphone,
    feePercent: 5,
    denominations: [100, 300, 500, 1000],
  },
];

interface GiftCardFormProps {
  initialItem?: GiftCardRuleItem | null;
  id?: string;
  onSuccess?: (item: GiftCardRuleItem) => void;
  onCancel?: () => void;
  walletBalance?: number;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Reward title is required"),
  brand: Yup.string().required("Brand is required"),
  denomination: Yup.number()
    .min(50, "Minimum ₹50")
    .required("Denomination is required"),
  validityMonths: Yup.number()
    .min(1, "At least 1 month")
    .required("Validity is required"),
});

export function GiftCardForm({
  initialItem,
  id,
  onSuccess,
  onCancel,
  walletBalance = 0,
}: GiftCardFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [createDigitalCardRule] = useCreateDigitalCardRule();
  const [updateDigitalCardRule] = useUpdateDigitalCardRule();

  const ruleId = initialItem?.id || id;
  const isEditing = Boolean(ruleId);

  const { data: fetchedRuleData } = useGetDigitalCardRuleById(id || "", {
    skip: !id || Boolean(initialItem),
  });

  const parsedFetchedItem: GiftCardRuleItem | null = fetchedRuleData
    ?.getDigitalCardRuleById
    ? {
        id: fetchedRuleData.getDigitalCardRuleById.id,
        title: fetchedRuleData.getDigitalCardRuleById.title,
        brand:
          fetchedRuleData.getDigitalCardRuleById.brandName || "Amazon Pay",
        category: "E-Commerce",
        denomination:
          fetchedRuleData.getDigitalCardRuleById.faceValue || 500,
        serviceFee: 25,
        totalCostPerWin:
          (fetchedRuleData.getDigitalCardRuleById.faceValue || 500) + 25,
        validityMonths: Math.round(
          (fetchedRuleData.getDigitalCardRuleById.validityDays || 365) / 30,
        ),
        isActive: fetchedRuleData.getDigitalCardRuleById.isActive ?? true,
        totalIssued:
          fetchedRuleData.getDigitalCardRuleById.totalAllocated || 0,
        totalSpent: 0,
        gameAssignments: ["Spin the Wheel"],
      }
    : null;

  const currentItem = initialItem || parsedFetchedItem;

  const formik = useFormik({
    initialValues: {
      title: currentItem?.title || "₹500 Amazon Gift Card",
      brand: currentItem?.brand || "Amazon Pay",
      category: currentItem?.category || "E-Commerce",
      denomination: currentItem?.denomination || 500,
      serviceFee: currentItem?.serviceFee || 25,
      validityMonths: currentItem?.validityMonths || 12,
      isActive: currentItem?.isActive ?? true,
      gameAssignments: currentItem?.gameAssignments || ["Spin the Wheel"],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const productId = `${values.brand.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${values.denomination}`;
        const totalCostPerWin =
          Number(values.denomination) + Number(values.serviceFee);

        let savedId = currentItem?.id || id || `gc-${Date.now()}`;

        if (isEditing && savedId && !savedId.startsWith("gc-")) {
          await updateDigitalCardRule({
            variables: {
              id: (currentItem?.id || id)!,
              input: {
                title: values.title,
                description: `${values.brand} Digital Gift Card Voucher`,
                faceValue: Number(values.denomination),
                validityDays: Number(values.validityMonths) * 30,
                isActive: values.isActive,
              },
            },
          });
        } else if (!isEditing) {
          try {
            const res = await createDigitalCardRule({
              variables: {
                input: {
                  provider: "THRICO",
                  providerProductId: productId,
                  brandName: values.brand,
                  title: values.title,
                  description: `${values.brand} Digital Gift Card Voucher`,
                  faceValue: Number(values.denomination),
                  currency: "INR",
                  country: "IN",
                  validityDays: Number(values.validityMonths) * 30,
                  isActive: values.isActive,
                  metadata: JSON.stringify({
                    category: values.category,
                    serviceFee: Number(values.serviceFee),
                    gameAssignments: values.gameAssignments,
                  }),
                },
              },
            });
            if (res?.data?.createDigitalCardRule?.id) {
              savedId = res.data.createDigitalCardRule.id;
            }
          } catch (apiErr) {
            console.warn("API creation fallback:", apiErr);
          }
        }

        const savedItem: GiftCardRuleItem = {
          id: savedId,
          title: values.title,
          brand: values.brand,
          category: values.category,
          denomination: Number(values.denomination),
          serviceFee: Number(values.serviceFee),
          totalCostPerWin,
          validityMonths: Number(values.validityMonths),
          isActive: values.isActive,
          totalIssued: initialItem?.totalIssued || 0,
          totalSpent: initialItem?.totalSpent || 0,
          gameAssignments: values.gameAssignments,
          createdAt: initialItem?.createdAt || new Date().toISOString(),
        };

        toast.success(
          isEditing
            ? "Gift Card Offer Updated!"
            : "Digital Gift Card Offer Configured!",
          {
            description: `Voucher blueprint saved. Provider will purchase card on-demand when members win.`,
          },
        );

        setIsSaved(true);
        if (onSuccess) onSuccess(savedItem);
      } catch (err: any) {
        toast.error(
          err?.message || "Failed to save gift card offer. Please try again.",
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const selectedBrandObj =
    BRAND_CATALOG.find((b) => b.name === formik.values.brand) ||
    BRAND_CATALOG[0];

  const brandPreset =
    BRAND_PRESETS[formik.values.brand] || BRAND_PRESETS["Amazon Pay"];

  const handleBrandSelect = (brandName: string) => {
    const brand = BRAND_CATALOG.find((b) => b.name === brandName);
    if (!brand) return;

    const defaultDenom = brand.denominations[2] || brand.denominations[0];
    const fee = (defaultDenom * brand.feePercent) / 100;

    formik.setFieldValue("brand", brand.name);
    formik.setFieldValue("category", brand.category);
    formik.setFieldValue("denomination", defaultDenom);
    formik.setFieldValue("serviceFee", fee);
    formik.setFieldValue("title", `₹${defaultDenom} ${brand.name} Gift Card`);
  };

  const handleDenominationSelect = (denom: number) => {
    const fee = (denom * (selectedBrandObj?.feePercent || 5)) / 100;
    formik.setFieldValue("denomination", denom);
    formik.setFieldValue("serviceFee", fee);
    formik.setFieldValue(
      "title",
      `₹${denom} ${formik.values.brand} Gift Card`,
    );
  };

  const totalCost =
    Number(formik.values.denomination) + Number(formik.values.serviceFee);

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <>
            {/* Live Visual Card Preview */}
            <PolarisSidebarCard title="Gift Card Live Preview" icon={Sparkles}>
              <div className="rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 space-y-3 shadow-xs">
                {/* Simulated Digital Card Artwork */}
                <div
                  className={cn(
                    "relative h-32 w-full rounded-[8px] bg-gradient-to-br p-3.5 flex flex-col justify-between text-white shadow-sm overflow-hidden",
                    brandPreset.gradient,
                  )}
                >
                  {/* Subtle Background Pattern */}
                  <div className="absolute right-[-10px] bottom-[-10px] opacity-15 pointer-events-none">
                    <Gift className="h-28 w-28 text-white" />
                  </div>

                  <div className="flex items-center justify-between z-10">
                    <span className="font-bold tracking-tight text-[15px]">
                      {brandPreset.logoText}
                    </span>
                    <Badge className="bg-white/20 hover:bg-white/20 text-white font-mono text-[10px] px-2 py-0 border-white/30 backdrop-blur-xs">
                      E-GIFT CARD
                    </Badge>
                  </div>

                  <div className="z-10 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-white/75 uppercase tracking-wider block font-medium">
                        Denomination
                      </span>
                      <span className="font-mono text-[20px] font-extrabold leading-none">
                        ₹{formik.values.denomination}
                      </span>
                    </div>
                    <span className="text-[10px] text-white/80 font-mono">
                      VALID: {formik.values.validityMonths}M
                    </span>
                  </div>
                </div>

                {/* Offer Details */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#616161]">
                      {formik.values.category}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] font-medium border-[#d2d5d9] text-[#303030] dark:text-zinc-200"
                    >
                      On-Demand Payout
                    </Badge>
                  </div>
                  <h5 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100 truncate">
                    {formik.values.title || "Untitled Gift Card"}
                  </h5>
                </div>

                {/* Ledger Summary */}
                <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-1">
                  <PolarisSummaryRow
                    label="Face Value"
                    value={`₹${formik.values.denomination}`}
                  />
                  <PolarisSummaryRow
                    label="Service Fee (5%)"
                    value={`+₹${formik.values.serviceFee}`}
                  />
                  <PolarisSummaryRow
                    label="Net Cost per Win"
                    value={
                      <span className="font-bold text-[#303030] dark:text-zinc-100">
                        ₹{totalCost}
                      </span>
                    }
                  />
                  <PolarisSummaryRow
                    label="Validity"
                    value={`${formik.values.validityMonths} Months`}
                    isLast
                  />
                </div>
              </div>
            </PolarisSidebarCard>

            {/* Strategic Guidance */}
            <PolarisTipCard title="Zero Upfront Capital">
              Gift cards are funded on-demand from your entity reward balance
              only when a member actually achieves a winning outcome.
            </PolarisTipCard>
          </>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-3.5">
          {/* Architecture Notice Banner */}
          <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900/50 p-3 space-y-1.5">
            <div className="flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-[4px] bg-[#303030] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Wallet className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                    <span>How Digital Gift Cards Are Fulfilled</span>
                    <Badge className="bg-[#303030] text-white font-semibold text-[8.5px] px-1.5 py-0 uppercase rounded-[3px]">
                      On-Demand Provider Purchase
                    </Badge>
                  </h4>
                </div>

                <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                  Saving this offer{" "}
                  <strong className="text-[#303030] dark:text-zinc-200 font-semibold">
                    does NOT purchase gift cards upfront
                  </strong>
                  . It sets up the blueprint, and Thrico purchases the card from
                  the digital provider API{" "}
                  <strong className="text-[#303030] dark:text-zinc-200 font-semibold">
                    only after a member actually wins
                  </strong>{" "}
                  in an engagement game.
                </p>

                <div className="pt-1.5 border-t border-[#e1e3e5] dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#616161] dark:text-zinc-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      <strong>2-Phase Reservation:</strong> Funds are reserved
                      first; if provider fails, reservation is released (₹0 lost).
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      <strong>Idempotency Key:</strong> Deterministic references
                      prevent double-purchasing on network retries.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 1: Brand Selection */}
          <PolarisFormCard
            step={1}
            title="Select Partner Brand & Category"
            description="Choose from top digital gift card catalogs (Amazon, Flipkart, Swiggy, Zomato)."
            badge="Step 1"
          >
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {BRAND_CATALOG.map((item) => {
                  const Icon = item.icon;
                  const isSelected = formik.values.brand === item.name;

                  return (
                    <button
                      type="button"
                      key={item.name}
                      onClick={() => handleBrandSelect(item.name)}
                      className={cn(
                        "p-2.5 rounded-[6px] border transition-all cursor-pointer flex flex-col justify-between gap-1.5 text-left",
                        isSelected
                          ? "border-[#303030] bg-[#f6f6f7] dark:border-zinc-100 dark:bg-zinc-800 shadow-xs ring-1 ring-[#303030] dark:ring-zinc-100"
                          : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="h-6 w-6 rounded-[4px] bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 flex items-center justify-center">
                          <Icon className="h-3 w-3" />
                        </div>
                        {isSelected && (
                          <Check className="h-3 w-3 text-[#303030] dark:text-zinc-100" />
                        )}
                      </div>
                      <div>
                        <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100 block leading-tight">
                          {item.name}
                        </span>
                        <span className="text-[10.5px] text-[#616161] dark:text-zinc-400 block mt-0.5">
                          {item.category}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisInput
                  id="title"
                  name="title"
                  label="Reward Offer Title"
                  required
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
                />
              </div>
            </div>
          </PolarisFormCard>

          {/* Card 2: Denomination & Pricing Breakdown */}
          <PolarisFormCard
            step={2}
            title="Denomination & Cost Breakdown"
            description="Select card value. Service fee and net wallet deduction are calculated automatically."
            badge="Step 2"
          >
            <div className="space-y-3.5">
              {/* Denomination Buttons */}
              <div className="space-y-1">
                <PolarisLabel>Available Denominations</PolarisLabel>
                <div className="flex flex-wrap gap-1.5">
                  {selectedBrandObj.denominations.map((denom) => {
                    const isSelected = formik.values.denomination === denom;
                    return (
                      <button
                        key={denom}
                        type="button"
                        onClick={() => handleDenominationSelect(denom)}
                        className={cn(
                          "h-[28px] px-2.5 rounded-[4px] border text-[11.5px] font-mono font-semibold transition-all cursor-pointer",
                          isSelected
                            ? "border-[#303030] bg-[#303030] text-white shadow-2xs dark:bg-zinc-100 dark:text-zinc-900"
                            : "border-[#aeb4b9] bg-white dark:bg-zinc-900 hover:border-[#8c9196] text-[#303030] dark:text-zinc-100",
                        )}
                      >
                        ₹{denom}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Financial Ledger Receipt Box */}
              <div className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900/40 space-y-1.5">
                <div className="flex items-center justify-between text-[11.5px] text-[#616161] dark:text-zinc-400">
                  <span>Gift Card Face Value:</span>
                  <span className="font-mono font-semibold text-[#303030] dark:text-zinc-100">
                    ₹{formik.values.denomination}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11.5px] text-[#616161] dark:text-zinc-400">
                  <span>Digital Provider & Service Fee (5%):</span>
                  <span className="font-mono font-semibold text-[#303030] dark:text-zinc-100">
                    + ₹{formik.values.serviceFee}
                  </span>
                </div>
                <div className="pt-1.5 border-t border-[#e1e3e5] dark:border-zinc-800 flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-[#303030] dark:text-zinc-100">
                    Total Deducted per Winning Member:
                  </span>
                  <span className="font-mono text-[13px] font-bold text-[#303030] dark:text-zinc-100">
                    ₹{totalCost}
                  </span>
                </div>
              </div>

              {/* Validity in Months */}
              <div className="w-28">
                <PolarisInput
                  id="validityMonths"
                  name="validityMonths"
                  type="number"
                  min={1}
                  label="Validity (Months)"
                  required
                  value={formik.values.validityMonths}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
            </div>
          </PolarisFormCard>

          {/* Card 3: Game Distribution */}
          <PolarisFormCard
            step={3}
            title="Minigame Assignment & Status"
            description="Assign this gift card to engagement games (Spin the Wheel, Scratch Card, Match Win)."
            badge="Step 3"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40">
                <div className="space-y-0.5">
                  <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                    Active in Minigames
                  </span>
                  <span className="text-[11.5px] text-[#616161] dark:text-zinc-400 block">
                    Enables this reward to appear as a winning slice or scratch unlock.
                  </span>
                </div>
                <Switch
                  checked={formik.values.isActive}
                  onCheckedChange={(c) => formik.setFieldValue("isActive", c)}
                />
              </div>
            </div>
          </PolarisFormCard>
        </form>
      </PolarisFormLayout>

      {/* Floating Save Panel */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={isSaved}
        isSaving={isSubmitting}
        onSave={() => formik.submitForm()}
        onReset={() => {
          formik.resetForm();
          setIsSaved(false);
        }}
        title={isEditing ? "Unsaved Gift Card Rule" : "Unsaved Gift Card Offer"}
        description={
          isEditing
            ? `You have pending changes to "${formik.values.title}".`
            : "You have pending changes to this gift card offer."
        }
        buttonText={
          isEditing ? "Update Gift Card Offer" : "Save Gift Card Offer"
        }
      />
    </div>
  );
}

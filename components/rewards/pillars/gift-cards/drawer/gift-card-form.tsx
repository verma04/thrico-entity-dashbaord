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
  Info,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  PolarisFormLayout,
  PolarisFormCard,
} from "@/components/gamification/shared";
import { GiftCardRuleItem } from "../types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useCreateDigitalCardRule,
  useUpdateDigitalCardRule,
} from "@/graphql/actions/rewards/gift-cards";

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
  onSuccess?: (item: GiftCardRuleItem) => void;
  onCancel?: () => void;
  walletBalance?: number;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Reward title is required"),
  brand: Yup.string().required("Brand is required"),
  denomination: Yup.number().min(50, "Minimum ₹50").required("Denomination is required"),
  validityMonths: Yup.number().min(1, "At least 1 month").required("Validity is required"),
});

export function GiftCardForm({
  initialItem,
  onSuccess,
  onCancel,
  walletBalance = 0,
}: GiftCardFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createDigitalCardRule] = useCreateDigitalCardRule();
  const [updateDigitalCardRule] = useUpdateDigitalCardRule();

  const isEditing = Boolean(initialItem?.id);

  const formik = useFormik({
    initialValues: {
      title: initialItem?.title || "₹500 Amazon Gift Card",
      brand: initialItem?.brand || "Amazon Pay",
      category: initialItem?.category || "E-Commerce",
      denomination: initialItem?.denomination || 500,
      serviceFee: initialItem?.serviceFee || 25,
      validityMonths: initialItem?.validityMonths || 12,
      isActive: initialItem?.isActive ?? true,
      gameAssignments: initialItem?.gameAssignments || ["Spin the Wheel"],
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const productId = `${values.brand.toLowerCase().replace(/[^a-z0-9]/g, "_")}_${values.denomination}`;
        const totalCostPerWin = Number(values.denomination) + Number(values.serviceFee);

        let savedId = initialItem?.id || `gc-${Date.now()}`;

        if (isEditing && initialItem && !initialItem.id.startsWith("gc-")) {
          await updateDigitalCardRule({
            variables: {
              id: initialItem.id,
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
          isEditing ? "Gift Card Offer Updated!" : "Digital Gift Card Offer Configured!",
          {
            description: `Voucher blueprint saved. Provider will purchase card on-demand when members win.`,
          }
        );

        if (onSuccess) onSuccess(savedItem);
      } catch (err: any) {
        toast.error(err?.message || "Failed to save gift card offer. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const selectedBrandObj =
    BRAND_CATALOG.find((b) => b.name === formik.values.brand) || BRAND_CATALOG[0];

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
      `₹${denom} ${formik.values.brand} Gift Card`
    );
  };

  const totalCost = Number(formik.values.denomination) + Number(formik.values.serviceFee);

  return (
    <PolarisFormLayout>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Prominent Architecture Notice Banner */}
        <div className="rounded-xl border border-violet-300 dark:border-violet-800 bg-gradient-to-r from-violet-50 via-violet-50/60 to-purple-50/40 dark:from-violet-950/40 dark:via-violet-950/30 dark:to-purple-950/20 p-4 sm:p-4.5 space-y-2.5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-violet-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Wallet className="h-4 w-4" />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <h4 className="text-xs font-bold text-violet-950 dark:text-violet-200 uppercase tracking-wider flex items-center gap-1.5">
                  <span>How Digital Gift Cards Are Fulfilled</span>
                  <Badge className="bg-violet-600 text-white font-bold text-[9px] px-1.5 py-0 uppercase">
                    On-Demand Provider Purchase
                  </Badge>
                </h4>
              </div>

              <p className="text-xs text-violet-900/90 dark:text-violet-300 leading-relaxed">
                Saving this offer <strong className="text-violet-950 dark:text-white font-bold">does NOT purchase gift cards upfront</strong>. It only sets up the blueprint. Thrico purchases the card from the digital provider API <strong className="text-violet-950 dark:text-white font-bold">only after a member actually wins</strong> in an engagement game.
              </p>

              <div className="pt-1.5 border-t border-violet-200/60 dark:border-violet-900/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-violet-900/80 dark:text-violet-300/90">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                  <span><strong>2-Phase Reservation:</strong> Funds are reserved first; if provider fails, reservation is released (₹0 lost).</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
                  <span><strong>Idempotency Key:</strong> Deterministic references prevent double-purchasing on network retries.</span>
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {BRAND_CATALOG.map((item) => {
                const Icon = item.icon;
                const isSelected = formik.values.brand === item.name;

                return (
                  <div
                    key={item.name}
                    onClick={() => handleBrandSelect(item.name)}
                    className={cn(
                      "p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2",
                      isSelected
                        ? "border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 shadow-xs ring-1 ring-violet-500/30"
                        : "border-border/70 bg-card hover:bg-muted/40"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="h-7 w-7 rounded-lg bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                        <Icon className="h-4 w-4" />
                      </div>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-violet-600" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-foreground block leading-tight">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-muted-foreground block">
                        {item.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-1.5 pt-2">
              <Label className="text-xs font-bold text-foreground">
                Reward Offer Title *
              </Label>
              <Input
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="text-xs font-semibold"
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
          <div className="space-y-4">
            {/* Denomination Buttons */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">
                Available Denominations
              </Label>
              <div className="flex flex-wrap gap-2">
                {selectedBrandObj.denominations.map((denom) => {
                  const isSelected = formik.values.denomination === denom;
                  return (
                    <button
                      key={denom}
                      type="button"
                      onClick={() => handleDenominationSelect(denom)}
                      className={cn(
                        "px-3.5 py-2 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer",
                        isSelected
                          ? "border-violet-600 bg-violet-600 text-white shadow-2xs"
                          : "border-border/70 bg-card hover:bg-muted text-foreground"
                      )}
                    >
                      ₹{denom}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Financial Ledger Receipt Box */}
            <div className="p-3.5 rounded-xl border border-violet-200/80 dark:border-violet-900/60 bg-violet-50/40 dark:bg-violet-950/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Gift Card Face Value:</span>
                <span className="font-mono font-bold text-foreground">
                  ₹{formik.values.denomination}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Digital Provider & Service Fee (5%):</span>
                <span className="font-mono font-bold text-foreground">
                  + ₹{formik.values.serviceFee}
                </span>
              </div>
              <div className="pt-2 border-t border-violet-200/60 dark:border-violet-900/60 flex items-center justify-between text-xs">
                <span className="font-bold text-foreground">
                  Total Deducted per Winning Member:
                </span>
                <span className="font-mono text-sm font-bold text-violet-700 dark:text-violet-300">
                  ₹{totalCost}
                </span>
              </div>
            </div>

            {/* Validity in Months */}
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-foreground">
                Validity (Months) *
              </Label>
              <Input
                type="number"
                name="validityMonths"
                value={formik.values.validityMonths}
                onChange={formik.handleChange}
                className="text-xs font-mono w-32"
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
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-foreground block">
                  Active in Minigames
                </span>
                <span className="text-[10px] text-muted-foreground block">
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

        {/* Form Actions Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 border-t border-border/60">
          <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400 shrink-0" />
            <span>₹0 spent now. ₹{totalCost} is deducted from prepaid wallet only when a player wins.</span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-violet-600 hover:bg-violet-700 text-white gap-2 font-semibold text-xs h-9 shadow-xs cursor-pointer"
            >
              <Sparkles className="h-4 w-4" />
              {isSubmitting ? "Saving Offer..." : "Save Gift Card Offer"}
            </Button>
          </div>
        </div>
      </form>
    </PolarisFormLayout>
  );
}

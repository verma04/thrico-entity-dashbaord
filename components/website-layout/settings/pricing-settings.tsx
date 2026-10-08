"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Plus,
  Trash2,
  Sparkles,
  Type,
  CreditCard,
  Check,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LayoutType } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";

interface PlanItem {
  name: string;
  price: string;
  yearlyPrice?: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  buttonText: string;
  buttonLink?: string;
}

interface PricingFormValues {
  title: string;
  description: string;
  badge: string;
  plans: PlanItem[];
  // Toggle layout
  discountBadge: string;
  // Lifetime layout
  strikePrice: string;
  guaranteeText: string;
}

interface PricingSettingsProps {
  content: Record<string, unknown>;
  onChange: (updates: Record<string, unknown>) => void;
  layout: LayoutType;
}

const pricingValidationSchema = Yup.object().shape({
  title: Yup.string().nullable(),
  description: Yup.string().nullable(),
  badge: Yup.string().nullable(),
  plans: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Plan name is required"),
      price: Yup.string().required("Price is required"),
      period: Yup.string().nullable(),
    })
  ),
});

export const PricingSettings: React.FC<PricingSettingsProps> = ({
  content,
  onChange,
  layout,
}) => {
  const [activePlanIdx, setActivePlanIdx] = useState<number | null>(0);

  const initialPlans: PlanItem[] = Array.isArray(content?.plans) && content.plans.length > 0
    ? (content.plans as PlanItem[])
    : [
        {
          name: "Starter",
          price: "$29",
          yearlyPrice: "$23",
          period: "month",
          description: "Essential tools for small teams looking to scale workflows.",
          features: ["Up to 5 Projects", "10GB Storage", "Community Support", "Email Integration"],
          popular: false,
          buttonText: "Start Free Trial",
          buttonLink: "#",
        },
        {
          name: "Professional",
          price: "$79",
          yearlyPrice: "$63",
          period: "month",
          description: "Advanced features and priority support for growing teams.",
          features: ["Unlimited Projects", "100GB Storage", "Priority 24/7 Support", "Custom Integrations"],
          popular: true,
          buttonText: "Get Started Now",
          buttonLink: "#",
        },
        {
          name: "Enterprise",
          price: "$199",
          yearlyPrice: "$159",
          period: "month",
          description: "Full-scale security, compliance, and dedicated engineering.",
          features: ["Custom Infrastructure", "Unlimited Storage", "SLA Guarantee", "Dedicated Manager"],
          popular: false,
          buttonText: "Contact Sales",
          buttonLink: "#",
        },
      ];

  const formik = useFormik<PricingFormValues>({
    enableReinitialize: true,
    initialValues: {
      title: (content?.title as string) || "Choose Your Plan",
      description:
        (content?.description as string) || "Select the perfect plan for your needs",
      badge: (content?.badge as string) || "Predictable Transparent Pricing",
      plans: initialPlans,
      discountBadge: (content?.discountBadge as string) || "Save 20%",
      strikePrice: (content?.strikePrice as string) || "$799",
      guaranteeText:
        (content?.guaranteeText as string) ||
        "30-Day Full Refund Guarantee • Zero Risk",
    },
    validationSchema: pricingValidationSchema,
    onSubmit: (values) => {
      onChange(values as unknown as Record<string, unknown>);
    },
  });

  const handleUpdate = <K extends keyof PricingFormValues>(
    key: K,
    value: PricingFormValues[K]
  ) => {
    formik.setFieldValue(key, value);
    onChange({
      ...formik.values,
      [key]: value,
    });
  };

  const handleAddPlan = () => {
    const newPlan: PlanItem = {
      name: `Tier ${formik.values.plans.length + 1}`,
      price: "$49",
      yearlyPrice: "$39",
      period: "month",
      description: "Tier benefits and deliverables overview",
      features: ["Core Feature 1", "Core Feature 2", "Standard Support"],
      popular: false,
      buttonText: "Select Plan",
      buttonLink: "#",
    };
    const updated = [...formik.values.plans, newPlan];
    handleUpdate("plans", updated);
    setActivePlanIdx(updated.length - 1);
  };

  const handleRemovePlan = (idx: number) => {
    const updated = formik.values.plans.filter((_, i) => i !== idx);
    handleUpdate("plans", updated);
    if (activePlanIdx === idx) {
      setActivePlanIdx(updated.length > 0 ? 0 : null);
    } else if (activePlanIdx !== null && activePlanIdx > idx) {
      setActivePlanIdx(activePlanIdx - 1);
    }
  };

  const handlePlanChange = (idx: number, patch: Partial<PlanItem>) => {
    const updated = formik.values.plans.map((p, i) =>
      i === idx ? { ...p, ...patch } : p
    );
    handleUpdate("plans", updated);
  };

  const handleAddFeature = (planIdx: number) => {
    const plan = formik.values.plans[planIdx];
    const updatedFeatures = [...(plan.features || []), "New Deliverable"];
    handlePlanChange(planIdx, { features: updatedFeatures });
  };

  const handleRemoveFeature = (planIdx: number, featIdx: number) => {
    const plan = formik.values.plans[planIdx];
    const updatedFeatures = (plan.features || []).filter((_, i) => i !== featIdx);
    handlePlanChange(planIdx, { features: updatedFeatures });
  };

  const handleFeatureTextChange = (planIdx: number, featIdx: number, text: string) => {
    const plan = formik.values.plans[planIdx];
    const updatedFeatures = [...(plan.features || [])];
    updatedFeatures[featIdx] = text;
    handlePlanChange(planIdx, { features: updatedFeatures });
  };

  return (
    <div className="space-y-4">
      {/* ─── SECTION 1: CORE SECTION TYPOGRAPHY ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            1
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Core Typography & Header
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Main section heading, positioning copy, and badge
            </p>
          </div>
        </div>

        {/* Eyebrow / Badge */}
        <div className="space-y-1.5">
          <Label htmlFor="pricing-badge" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Sparkles className="h-3 w-3 text-indigo-500" />
            <span>Eyebrow Pill / Badge</span>
          </Label>
          <Input
            id="pricing-badge"
            name="badge"
            value={formik.values.badge}
            onChange={(e) => handleUpdate("badge", e.target.value)}
            placeholder="e.g. Predictable Transparent Pricing"
            className="h-9 text-xs"
          />
        </div>

        {/* Headline Title */}
        <div className="space-y-1.5">
          <Label htmlFor="pricing-title" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Type className="h-3 w-3 text-muted-foreground" />
            <span>Section Heading</span>
          </Label>
          <Input
            id="pricing-title"
            name="title"
            value={formik.values.title}
            onChange={(e) => handleUpdate("title", e.target.value)}
            placeholder="e.g. Choose Your Plan"
            className="h-9 text-xs font-medium"
          />
        </div>

        {/* Subtitle Narrative */}
        <div className="space-y-1.5">
          <Label htmlFor="pricing-desc" className="text-xs font-semibold text-foreground">
            Subtitle / Narrative Description
          </Label>
          <Textarea
            id="pricing-desc"
            name="description"
            rows={2}
            value={formik.values.description}
            onChange={(e) => handleUpdate("description", e.target.value)}
            placeholder="e.g. Select the perfect tier for your needs..."
            className="text-xs leading-relaxed resize-none"
          />
        </div>
      </div>

      {/* ─── SECTION 2: PLAN TIERS MANAGER ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
              2
            </span>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
                Pricing Tiers ({formik.values.plans.length})
              </h4>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Configure rates, deliverables, and popular tags
              </p>
            </div>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleAddPlan}
            className="bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-xs h-7 font-medium cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Tier
          </Button>
        </div>

        {/* List of Plan Cards */}
        <div className="space-y-3">
          {formik.values.plans.map((plan, idx) => {
            const isExpanded = activePlanIdx === idx;

            return (
              <div
                key={idx}
                className={cn(
                  "rounded-xl border transition-all duration-200 overflow-hidden",
                  isExpanded
                    ? "border-indigo-500/50 bg-muted/20 shadow-xs"
                    : "border-border/60 bg-card hover:border-border"
                )}
              >
                {/* Header Row */}
                <div
                  className="flex items-center justify-between p-3 cursor-pointer select-none"
                  onClick={() => setActivePlanIdx(isExpanded ? null : idx)}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-5 w-5 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      {plan.name || `Tier ${idx + 1}`}
                    </span>
                    <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {plan.price}/{plan.period || "mo"}
                    </span>
                    {plan.popular && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemovePlan(idx)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                    <button
                      type="button"
                      onClick={() => setActivePlanIdx(isExpanded ? null : idx)}
                      className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground"
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Card Details */}
                {isExpanded && (
                  <div className="p-4 pt-1 border-t border-border/50 space-y-3.5 bg-background/50">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-foreground">Tier Name</Label>
                        <Input
                          value={plan.name}
                          onChange={(e) => handlePlanChange(idx, { name: e.target.value })}
                          placeholder="e.g. Professional"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-foreground">Billing Period</Label>
                        <Input
                          value={plan.period}
                          onChange={(e) => handlePlanChange(idx, { period: e.target.value })}
                          placeholder="e.g. month"
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-foreground">Monthly Price</Label>
                        <Input
                          value={plan.price}
                          onChange={(e) => handlePlanChange(idx, { price: e.target.value })}
                          placeholder="$79"
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-foreground">Annual Price (Optional)</Label>
                        <Input
                          value={plan.yearlyPrice || ""}
                          onChange={(e) => handlePlanChange(idx, { yearlyPrice: e.target.value })}
                          placeholder="$63"
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-[11px] font-semibold text-foreground">Description</Label>
                      <Input
                        value={plan.description}
                        onChange={(e) => handlePlanChange(idx, { description: e.target.value })}
                        placeholder="Brief summary of this plan"
                        className="h-8 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-foreground">Button Text</Label>
                        <Input
                          value={plan.buttonText}
                          onChange={(e) => handlePlanChange(idx, { buttonText: e.target.value })}
                          placeholder="Get Started"
                          className="h-8 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[11px] font-semibold text-foreground">Button Link</Label>
                        <Input
                          value={plan.buttonLink || ""}
                          onChange={(e) => handlePlanChange(idx, { buttonLink: e.target.value })}
                          placeholder="/checkout"
                          className="h-8 text-xs font-mono"
                        />
                      </div>
                    </div>

                    {/* Most Popular Switch */}
                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60 bg-card">
                      <div>
                        <div className="text-xs font-bold text-foreground">Highlight as Most Popular</div>
                        <div className="text-[11px] text-muted-foreground">Applies high-contrast borders and badge pill</div>
                      </div>
                      <Switch
                        checked={plan.popular}
                        onCheckedChange={(checked) => handlePlanChange(idx, { popular: checked })}
                      />
                    </div>

                    {/* Features Checklist */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center justify-between">
                        <Label className="text-[11px] font-semibold text-foreground">
                          Included Features ({plan.features?.length || 0})
                        </Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddFeature(idx)}
                          className="h-6 text-[11px] px-2"
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Item
                        </Button>
                      </div>

                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {(plan.features || []).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <Input
                              value={feat}
                              onChange={(e) => handleFeatureTextChange(idx, fIdx, e.target.value)}
                              placeholder="Feature deliverable"
                              className="h-7 text-xs flex-1"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFeature(idx, fIdx)}
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 3: LAYOUT-SPECIFIC CUSTOMIZATION ─── */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shrink-0">
            3
          </span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Layout Controls ({layout})
            </h4>
            <p className="text-[11px] text-muted-foreground leading-snug">
              Fine-tune options tailored for the current active variant
            </p>
          </div>
        </div>

        {layout === "toggle-pricing" && (
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">Annual Discount Pill Text</Label>
            <Input
              value={formik.values.discountBadge}
              onChange={(e) => handleUpdate("discountBadge", e.target.value)}
              placeholder="e.g. Save 20%"
              className="h-9 text-xs"
            />
            <p className="text-[11px] text-muted-foreground">Displayed on the annual billing switch button</p>
          </div>
        )}

        {layout === "lifetime-deal-banner" && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Strike-through Original Price</Label>
                <Input
                  value={formik.values.strikePrice}
                  onChange={(e) => handleUpdate("strikePrice", e.target.value)}
                  placeholder="$799"
                  className="h-9 text-xs font-mono"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-foreground">Guarantee Text</Label>
                <Input
                  value={formik.values.guaranteeText}
                  onChange={(e) => handleUpdate("guaranteeText", e.target.value)}
                  placeholder="30-Day Money-Back Guarantee"
                  className="h-9 text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {(layout === "cards-pricing" || layout === "table-pricing" || layout === "gradient-tier-matrix" || layout === "minimal-editorial-plans") && (
          <div className="p-3 rounded-lg border border-border/50 bg-muted/10 text-xs text-muted-foreground space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <CreditCard className="h-3.5 w-3.5 text-indigo-500" />
              <span>Responsive Grid Active</span>
            </div>
            <p>
              This layout automatically adapts between single-column mobile viewports and 3-column desktop viewports with balanced height normalization.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingSettings;

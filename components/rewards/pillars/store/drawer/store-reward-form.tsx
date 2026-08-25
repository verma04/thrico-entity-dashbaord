"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Tag,
  Percent,
  Truck,
  Sparkles,
  ShoppingBag,
  Clock,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
  Check,
  Store,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisTipCard,
  PolarisSummaryRow,
} from "@/components/gamification/shared/polaris-form-ui";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  StoreDiscountType,
  StoreProvider,
  StoreRewardItem,
  useCreateStoreDiscountRule,
  useUpdateStoreDiscountRule,
  useGetStoreDiscountRuleById,
  CreateStoreDiscountRuleInput,
  UpdateStoreDiscountRuleInput,
} from "@/graphql/actions/rewards/store";
import { useGetEntity } from "@/graphql/actions";
import { useGetEntityCurrencyConfig } from "@/graphql/actions/currency";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface StoreRewardFormProps {
  initialItem?: StoreRewardItem | null;
  id?: string;
  onSuccess?: (createdItem?: StoreRewardItem) => void;
  onCancel?: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Offer title is required"),
  description: Yup.string().required("Description is required"),
  discountType: Yup.string().required("Discount type is required"),
  discountValue: Yup.number().min(0, "Must be positive").required("Value is required"),
  minCartSubtotal: Yup.number().min(0, "Must be positive").nullable(),
  maxDiscountCap: Yup.number().min(0, "Must be positive").nullable(),
  codePrefix: Yup.string().required("Code prefix is required"),
  validityDays: Yup.number().min(1, "At least 1 day").required("Validity is required"),
});

export function StoreRewardForm({
  initialItem,
  id,
  onSuccess,
  onCancel,
}: StoreRewardFormProps) {
  const [createRule, { loading: isCreating }] = useCreateStoreDiscountRule();
  const [updateRule, { loading: isUpdating }] = useUpdateStoreDiscountRule();

  const ruleId = initialItem?.id || id;
  const isEditing = Boolean(ruleId);

  const { data: fetchedRuleData, loading: isFetching } = useGetStoreDiscountRuleById(
    id || "",
    { skip: !id || Boolean(initialItem) }
  );

  const existingRule: StoreRewardItem | null =
    initialItem || fetchedRuleData?.getStoreDiscountRuleById || null;

  const isSubmitting = isCreating || isUpdating;
  const [isSaved, setIsSaved] = useState(false);
  const { data: entityData } = useGetEntity();
  const { data: currencyData } = useGetEntityCurrencyConfig();
  const currencyCode = currencyData?.getEntityCurrencyConfig?.currencyCode || "INR";
  const currencySymbol = currencyData?.getEntityCurrencyConfig?.currencySymbol || "₹";

  const [hasUserEditedPrefix, setHasUserEditedPrefix] = useState(false);

  const rawEntityName = entityData?.getEntity?.name || "THRICO";
  const defaultEntityPrefix =
    (rawEntityName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8) || "SHOP") + "-";

  const formik = useFormik({
    initialValues: {
      title: existingRule?.title || "",
      description: existingRule?.description || "",
      image: existingRule?.image || "",
      discountType: existingRule?.discountType || StoreDiscountType.FIXED_AMOUNT,
      discountValue: existingRule?.discountValue ?? 100,
      minCartSubtotal: existingRule?.minCartSubtotal ?? 499,
      maxDiscountCap: existingRule?.maxDiscountCap ?? 0,
      codePrefix: existingRule?.codePrefix || defaultEntityPrefix,
      storeProvider: existingRule?.storeProvider || StoreProvider.SHOPIFY,
      connectedDomain: existingRule?.connectedDomain || "",
      singleUsePerCustomer: existingRule?.singleUsePerCustomer ?? true,
      validityDays: existingRule?.validityDays ?? 30,
      isActive: existingRule?.isActive ?? true,
    },
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEditing && ruleId) {
          const updateInput: UpdateStoreDiscountRuleInput = {
            title: values.title.trim(),
            description: values.description?.trim() || null,
            image: values.image || null,
            discountType: values.discountType,
            discountValue: Number(values.discountValue),
            currency: currencyCode,
            minCartSubtotal: values.minCartSubtotal ? Number(values.minCartSubtotal) : null,
            maxDiscountCap: values.maxDiscountCap ? Number(values.maxDiscountCap) : null,
            codePrefix: values.codePrefix.trim().toUpperCase(),
            storeProvider: values.storeProvider,
            connectedDomain: values.connectedDomain?.trim() || null,
            singleUsePerCustomer: values.singleUsePerCustomer,
            validityDays: Number(values.validityDays),
            isActive: values.isActive,
          };

          const res = await updateRule({
            variables: {
              id: ruleId,
              input: updateInput,
            },
          });

          const updatedItem = res?.data?.updateStoreDiscountRule;
          setIsSaved(true);

          toast.success("Store Reward Rule Updated!", {
            description: `Changes to "${values.title}" saved successfully.`,
          });

          if (onSuccess) {
            setTimeout(() => onSuccess(updatedItem), 400);
          }
        } else {
          const createInput: CreateStoreDiscountRuleInput = {
            title: values.title.trim(),
            description: values.description?.trim() || null,
            image: values.image || null,
            discountType: values.discountType,
            discountValue: Number(values.discountValue),
            currency: currencyCode,
            minCartSubtotal: values.minCartSubtotal ? Number(values.minCartSubtotal) : null,
            maxDiscountCap: values.maxDiscountCap ? Number(values.maxDiscountCap) : null,
            codePrefix: values.codePrefix.trim().toUpperCase(),
            storeProvider: values.storeProvider,
            connectedDomain: values.connectedDomain?.trim() || null,
            singleUsePerCustomer: values.singleUsePerCustomer,
            validityDays: Number(values.validityDays),
            isActive: values.isActive,
          };

          const res = await createRule({
            variables: {
              input: createInput,
            },
          });

          const createdItem = res?.data?.createStoreDiscountRule;
          setIsSaved(true);

          toast.success("Store Reward Rule Created!", {
            description: `PriceRule blueprint saved. Codes will synthesize on-demand when members win.`,
          });

          if (onSuccess) {
            setTimeout(() => onSuccess(createdItem), 400);
          }
        }
      } catch (err: unknown) {
        toast.error(isEditing ? "Failed to update store reward rule" : "Failed to create store reward rule", {
          description: err instanceof Error ? err.message : "An unexpected error occurred.",
        });
      }
    },
  });

  React.useEffect(() => {
    if (entityData?.getEntity?.name && !hasUserEditedPrefix && !isEditing) {
      const prefix =
        (entityData.getEntity.name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8) || "SHOP") + "-";
      formik.setFieldValue("codePrefix", prefix);
    }
  }, [entityData?.getEntity?.name, hasUserEditedPrefix, isEditing]);

  const getDiscountPreviewLabel = () => {
    switch (formik.values.discountType) {
      case StoreDiscountType.PERCENTAGE:
        return `${formik.values.discountValue || 0}% OFF`;
      case StoreDiscountType.FREE_SHIPPING:
        return "FREE SHIPPING";
      case StoreDiscountType.FIXED_AMOUNT:
      default:
        return `${currencySymbol}${formik.values.discountValue || 0} OFF`;
    }
  };

  return (
    <div className="relative pb-24">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Discount Rule Summary Card */}
            <PolarisSidebarCard title="Reward Summary">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 shadow-xs">
                    <ShoppingBag className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-foreground truncate">
                      {formik.values.title || "Untitled Store Rule"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {formik.values.storeProvider} Integration
                    </p>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200/50 dark:border-indigo-900/50 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wide">
                      Discount Value
                    </span>
                    <Badge className="bg-indigo-600 text-white font-mono text-[9px] px-1.5 py-0">
                      {getDiscountPreviewLabel()}
                    </Badge>
                  </div>
                  <p className="text-[11px] font-mono font-bold text-indigo-950 dark:text-indigo-100">
                    Prefix: {formik.values.codePrefix || "SHOP-"}-XXXXX
                  </p>
                </div>

                <div className="divide-y divide-border/60">
                  <PolarisSummaryRow
                    label="Provider"
                    value={formik.values.storeProvider}
                  />
                  <PolarisSummaryRow
                    label="Min Cart Spend"
                    value={
                      formik.values.minCartSubtotal
                        ? `${currencySymbol}${formik.values.minCartSubtotal}`
                        : "No Minimum"
                    }
                  />
                  <PolarisSummaryRow
                    label="Single-Use Lock"
                    value={formik.values.singleUsePerCustomer ? "Enforced" : "Disabled"}
                  />
                  <PolarisSummaryRow
                    label="Validity"
                    value={`${formik.values.validityDays} Days`}
                    isLast
                  />
                </div>
              </div>
            </PolarisSidebarCard>

            {/* Merchant Strategy Tip */}
            <PolarisTipCard title="On-Demand Synthesis">
              Shopify/WooCommerce discount codes are synthesized only when a member wins in a game or claims a reward. This avoids bloating your store discount inventory.
            </PolarisTipCard>
          </div>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Architecture Notice Banner */}
          <div className="rounded-xl border border-indigo-300 dark:border-indigo-800 bg-gradient-to-r from-indigo-50 via-indigo-50/60 to-purple-50/40 dark:from-indigo-950/40 dark:via-indigo-950/30 dark:to-purple-950/20 p-4 sm:p-4.5 space-y-2.5 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Zap className="h-4 w-4" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-xs font-bold text-indigo-950 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                    <span>How This Rule Generates Coupons</span>
                    <Badge className="bg-indigo-600 text-white font-bold text-[9px] px-1.5 py-0 uppercase">
                      On-Demand On-Win Only
                    </Badge>
                  </h4>
                </div>

                <p className="text-xs text-indigo-900/90 dark:text-indigo-300 leading-relaxed">
                  Saving this rule <strong className="text-indigo-950 dark:text-white font-bold">does NOT generate thousands of codes in advance</strong>. It defines the discount blueprint, and unique single-use codes are synthesized on-demand in Shopify or WooCommerce when members win.
                </p>

                <div className="pt-1.5 border-t border-indigo-200/60 dark:border-indigo-900/60 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-indigo-900/80 dark:text-indigo-300/90">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span><strong>When created:</strong> Only when a member wins in a game (Spin Wheel, Scratch Card) or claims a reward.</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    <span><strong>Unique per user:</strong> Each winning member receives their own unique single-use code (e.g. <code>SHOP-8K4P7X</code>).</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 1: Core Details */}
          <PolarisFormCard
            step={1}
            title="Core Store Reward Identity"
            description="Name, member-facing description, artwork, and store provider."
            badge="Step 1"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  Reward Offer Title <span className="text-rose-500">*</span>
                </Label>
                <Input
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. 100 Flat Order Discount"
                  className="text-xs"
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-[11px] text-red-500 font-medium">{formik.errors.title}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  Description & Terms <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. Applicable on all products with minimum order value of ₹499."
                  className="text-xs min-h-[70px]"
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-[11px] text-red-500 font-medium">
                    {formik.errors.description}
                  </p>
                )}
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  Cover Artwork / Badge Image (Optional)
                </Label>
                <ImageUploadWithCrop
                  currentImage={formik.values.image}
                  onImageUpdate={(cdnUrl: string) =>
                    formik.setFieldValue("image", cdnUrl)
                  }
                  aspectRatio={16 / 9}
                />
              </div>

              {/* Store Provider and Domain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    E-Commerce Store Provider
                  </Label>
                  <Select
                    value={formik.values.storeProvider}
                    onValueChange={(v) => formik.setFieldValue("storeProvider", v as StoreProvider)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={StoreProvider.SHOPIFY}>Shopify</SelectItem>
                      <SelectItem value={StoreProvider.WOOCOMMERCE}>WooCommerce</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    Connected Store Domain / URL (Optional)
                  </Label>
                  <Input
                    name="connectedDomain"
                    value={formik.values.connectedDomain}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="e.g. brand-store.myshopify.com"
                    className="text-xs font-mono"
                  />
                </div>
              </div>
            </div>
          </PolarisFormCard>

          {/* Card 2: Discount Architecture & PriceRule */}
          <PolarisFormCard
            step={2}
            title="PriceRule & Discount Configuration"
            description="Select discount mechanics and parameters for on-demand synthesis."
            badge="Step 2"
          >
            <div className="space-y-4">
              {/* Discount Type Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    type: StoreDiscountType.FIXED_AMOUNT,
                    label: `Fixed ${currencySymbol} Amount`,
                    icon: Tag,
                    desc: "Direct currency reduction",
                  },
                  {
                    type: StoreDiscountType.PERCENTAGE,
                    label: "Percentage %",
                    icon: Percent,
                    desc: "Cart percentage off",
                  },
                  {
                    type: StoreDiscountType.FREE_SHIPPING,
                    label: "Free Shipping",
                    icon: Truck,
                    desc: "Zero delivery fee",
                  },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = formik.values.discountType === item.type;

                  return (
                    <div
                      key={item.type}
                      onClick={() => formik.setFieldValue("discountType", item.type)}
                      className={cn(
                        "p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-1.5",
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs ring-1 ring-indigo-500/20"
                          : "border-border/70 bg-card hover:bg-muted/40"
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        {isSelected && (
                          <Check className="h-3.5 w-3.5 text-indigo-600" />
                        )}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-foreground block">
                          {item.label}
                        </span>
                        <span className="text-[10px] text-muted-foreground block">
                          {item.desc}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Values Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {formik.values.discountType !== StoreDiscountType.FREE_SHIPPING && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">
                      {formik.values.discountType === StoreDiscountType.PERCENTAGE
                        ? "Discount %"
                        : `Discount Amount (${currencySymbol})`} <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      type="number"
                      name="discountValue"
                      value={formik.values.discountValue}
                      onChange={formik.handleChange}
                      className="text-xs font-mono font-bold"
                    />
                    {formik.touched.discountValue && formik.errors.discountValue && (
                      <p className="text-[11px] text-red-500 font-medium">
                        {formik.errors.discountValue as string}
                      </p>
                    )}
                  </div>
                )}

                {formik.values.discountType === StoreDiscountType.PERCENTAGE && (
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-foreground">
                      Max Discount Cap ({currencySymbol})
                    </Label>
                    <Input
                      type="number"
                      name="maxDiscountCap"
                      value={formik.values.maxDiscountCap || ""}
                      onChange={formik.handleChange}
                      placeholder="0 (No limit)"
                      className="text-xs font-mono"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    Min. Cart Subtotal ({currencySymbol})
                  </Label>
                  <Input
                    type="number"
                    name="minCartSubtotal"
                    value={formik.values.minCartSubtotal || ""}
                    onChange={formik.handleChange}
                    placeholder="0 (No minimum)"
                    className="text-xs font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    Code Prefix <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    name="codePrefix"
                    value={formik.values.codePrefix}
                    onChange={(e) => {
                      setHasUserEditedPrefix(true);
                      formik.setFieldValue("codePrefix", e.target.value.toUpperCase());
                    }}
                    placeholder={defaultEntityPrefix}
                    className="text-xs font-mono font-bold uppercase"
                  />
                  {formik.touched.codePrefix && formik.errors.codePrefix && (
                    <p className="text-[11px] text-red-500 font-medium">
                      {formik.errors.codePrefix}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </PolarisFormCard>

          {/* Card 3: Security & Expiry */}
          <PolarisFormCard
            step={3}
            title="Validity & Single-Use Restriction"
            description="Prevent discount abuse with single-use per winning customer locking."
            badge="Step 3"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold text-foreground">
                    Validity Period (Days) <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    type="number"
                    name="validityDays"
                    value={formik.values.validityDays}
                    onChange={formik.handleChange}
                    className="text-xs font-mono"
                  />
                  <span className="text-[10px] text-muted-foreground">
                    Calculates exact expiration date when code is synthesized.
                  </span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg border border-border/70 bg-muted/20">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-foreground block">
                      Single-Use per Customer Lock
                    </span>
                    <span className="text-[10px] text-muted-foreground block">
                      Restricts redemption to winning member email on checkout.
                    </span>
                  </div>
                  <Switch
                    checked={formik.values.singleUsePerCustomer}
                    onCheckedChange={(c) => formik.setFieldValue("singleUsePerCustomer", c)}
                  />
                </div>
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
        onReset={() => formik.resetForm()}
        title={isEditing ? "Unsaved Rule Changes" : "Unsaved Store Reward"}
        description={
          isEditing
            ? `You have pending changes to "${formik.values.title || "Store Discount Rule"}".`
            : "You have pending changes to this store discount blueprint."
        }
        buttonText={isEditing ? "Update Store Reward Blueprint" : "Save Store Reward Blueprint"}
      />
    </div>
  );
}

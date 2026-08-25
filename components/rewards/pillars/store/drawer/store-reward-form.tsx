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
  Zap,
  CheckCircle2,
  Check,
} from "lucide-react";
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
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
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
  discountValue: Yup.number()
    .min(0, "Must be positive")
    .required("Value is required"),
  minCartSubtotal: Yup.number().min(0, "Must be positive").nullable(),
  maxDiscountCap: Yup.number().min(0, "Must be positive").nullable(),
  codePrefix: Yup.string().required("Code prefix is required"),
  validityDays: Yup.number()
    .min(1, "At least 1 day")
    .required("Validity is required"),
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

  const { data: fetchedRuleData } = useGetStoreDiscountRuleById(id || "", {
    skip: !id || Boolean(initialItem),
  });

  const existingRule: StoreRewardItem | null =
    initialItem || fetchedRuleData?.getStoreDiscountRuleById || null;

  const isSubmitting = isCreating || isUpdating;
  const [isSaved, setIsSaved] = useState(false);
  const { data: entityData } = useGetEntity();
  const { data: currencyData } = useGetEntityCurrencyConfig();
  const currencyCode =
    currencyData?.getEntityCurrencyConfig?.currencyCode || "INR";
  const currencySymbol =
    currencyData?.getEntityCurrencyConfig?.currencySymbol || "₹";

  const [hasUserEditedPrefix, setHasUserEditedPrefix] = useState(false);

  const rawEntityName = entityData?.getEntity?.name || "THRICO";
  const defaultEntityPrefix =
    (rawEntityName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8) ||
      "SHOP") + "-";

  const formik = useFormik({
    initialValues: {
      title: existingRule?.title || "",
      description: existingRule?.description || "",
      image: existingRule?.image || "",
      discountType:
        existingRule?.discountType || StoreDiscountType.FIXED_AMOUNT,
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
            minCartSubtotal: values.minCartSubtotal
              ? Number(values.minCartSubtotal)
              : null,
            maxDiscountCap: values.maxDiscountCap
              ? Number(values.maxDiscountCap)
              : null,
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

          if (res.data?.updateStoreDiscountRule) {
            toast.success("Store reward blueprint updated successfully");
            setIsSaved(true);
            onSuccess?.(res.data.updateStoreDiscountRule);
          }
        } else {
          const createInput: CreateStoreDiscountRuleInput = {
            title: values.title.trim(),
            description: values.description?.trim() || null,
            image: values.image || null,
            discountType: values.discountType,
            discountValue: Number(values.discountValue),
            currency: currencyCode,
            minCartSubtotal: values.minCartSubtotal
              ? Number(values.minCartSubtotal)
              : null,
            maxDiscountCap: values.maxDiscountCap
              ? Number(values.maxDiscountCap)
              : null,
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

          if (res.data?.createStoreDiscountRule) {
            toast.success("Store reward blueprint created successfully");
            setIsSaved(true);
            onSuccess?.(res.data.createStoreDiscountRule);
          }
        }
      } catch (err: any) {
        toast.error(
          err.message || "Failed to save store reward configuration.",
        );
      }
    },
  });

  const getDiscountPreviewLabel = () => {
    switch (formik.values.discountType) {
      case StoreDiscountType.PERCENTAGE:
        return `${formik.values.discountValue}% OFF`;
      case StoreDiscountType.FREE_SHIPPING:
        return "FREE SHIPPING";
      case StoreDiscountType.FIXED_AMOUNT:
      default:
        return `${currencySymbol}${formik.values.discountValue} OFF`;
    }
  };

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <>
            {/* Live Preview Card */}
            <PolarisSidebarCard title="Store Reward Live Preview" icon={Sparkles}>
              <div className="rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 space-y-3 shadow-xs">
                {formik.values.image ? (
                  <div className="relative h-28 w-full rounded-[6px] overflow-hidden border border-[#d2d5d9]">
                    <img
                      src={formik.values.image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-full rounded-[6px] bg-[#f6f6f7] dark:bg-zinc-800/40 border border-dashed border-[#d2d5d9] flex flex-col items-center justify-center text-[#616161] gap-1">
                    <ShoppingBag className="h-6 w-6 text-indigo-600/70" />
                    <span className="text-[11px] font-medium">
                      Reward Thumbnail
                    </span>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-[#303030] text-white text-[10px] font-semibold px-2 py-0 rounded-[4px]">
                      {formik.values.storeProvider}
                    </Badge>
                  </div>
                  <h5 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100 truncate">
                    {formik.values.title || "Untitled Store Discount"}
                  </h5>
                  <p className="text-[12px] text-[#616161] dark:text-zinc-400 line-clamp-2 leading-[16px]">
                    {formik.values.description ||
                      "Offer terms and discount conditions displayed to members."}
                  </p>
                </div>

                <div className="p-2.5 rounded-[6px] bg-[#f6f6f7]/80 dark:bg-zinc-800/50 border border-[#d2d5d9] dark:border-zinc-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#616161] uppercase tracking-wide">
                      Discount Value
                    </span>
                    <Badge className="bg-[#303030] text-white font-mono text-[10px] px-2 py-0 rounded-[4px]">
                      {getDiscountPreviewLabel()}
                    </Badge>
                  </div>
                  <p className="text-[12px] font-mono font-semibold text-[#303030] dark:text-zinc-100">
                    Prefix: {formik.values.codePrefix || "SHOP-"}-XXXXX
                  </p>
                </div>

                <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-1">
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
                    value={
                      formik.values.singleUsePerCustomer
                        ? "Enforced"
                        : "Disabled"
                    }
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
              Shopify/WooCommerce discount codes are synthesized only when a
              member wins in a game or claims a reward. This avoids bloating
              your store discount inventory.
            </PolarisTipCard>
          </>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-3.5">
          {/* Architecture Notice Banner */}
          <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/60 dark:bg-zinc-900/50 p-3 space-y-1.5">
            <div className="flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-[4px] bg-[#303030] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100 uppercase tracking-wider flex items-center gap-1.5">
                    <span>How This Rule Generates Coupons</span>
                    <Badge className="bg-[#303030] text-white font-semibold text-[8.5px] px-1.5 py-0 uppercase rounded-[3px]">
                      On-Demand On-Win Only
                    </Badge>
                  </h4>
                </div>

                <p className="text-[11.5px] text-[#616161] dark:text-zinc-400 leading-[16px]">
                  Saving this rule{" "}
                  <strong className="text-[#303030] dark:text-zinc-200 font-semibold">
                    does NOT generate thousands of codes in advance
                  </strong>
                  . It defines the discount blueprint, and unique single-use
                  codes are synthesized on-demand in Shopify or WooCommerce when
                  members win.
                </p>

                <div className="pt-1.5 border-t border-[#e1e3e5] dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-[#616161] dark:text-zinc-400">
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      <strong>When created:</strong> Only upon member win or
                      claim.
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      <strong>Unique per user:</strong> Single-use code (e.g.{" "}
                      <code>SHOP-8K4P7X</code>).
                    </span>
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
            <div className="space-y-3.5">
              <PolarisInput
                id="title"
                name="title"
                label="Reward Offer Title"
                required
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. 100 Flat Order Discount"
                error={formik.touched.title && formik.errors.title ? formik.errors.title : undefined}
              />

              <PolarisTextarea
                id="description"
                name="description"
                label="Description & Terms"
                required
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g. Applicable on all products with minimum order value of ₹499."
                error={formik.touched.description && formik.errors.description ? formik.errors.description : undefined}
              />

              {/* Cover Image Upload */}
              <div className="space-y-1.5 pt-1">
                <PolarisLabel>Cover Artwork / Badge Image (Optional)</PolarisLabel>
                <ImageUploadWithCrop
                  currentImage={formik.values.image}
                  onImageUpdate={(cdnUrl: string) =>
                    formik.setFieldValue("image", cdnUrl)
                  }
                  aspectRatio={16 / 9}
                />
              </div>

              {/* Store Provider and Domain */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <div className="space-y-1">
                  <PolarisLabel>E-Commerce Store Provider</PolarisLabel>
                  <Select
                    value={formik.values.storeProvider}
                    onValueChange={(v) =>
                      formik.setFieldValue("storeProvider", v as StoreProvider)
                    }
                  >
                    <SelectTrigger className="h-[34px] text-[12.5px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 rounded-[6px]">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={StoreProvider.SHOPIFY}>
                        Shopify
                      </SelectItem>
                      <SelectItem value={StoreProvider.WOOCOMMERCE}>
                        WooCommerce
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <PolarisInput
                  id="connectedDomain"
                  name="connectedDomain"
                  label="Connected Store Domain (Optional)"
                  value={formik.values.connectedDomain}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g. brand-store.myshopify.com"
                />
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
            <div className="space-y-3.5">
              {/* Discount Type Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
                    <button
                      type="button"
                      key={item.type}
                      onClick={() =>
                        formik.setFieldValue("discountType", item.type)
                      }
                      className={cn(
                        "p-2.5 rounded-[6px] border transition-all cursor-pointer flex flex-col justify-between gap-1 text-left",
                        isSelected
                          ? "border-[#303030] bg-[#f6f6f7] dark:border-zinc-100 dark:bg-zinc-800 shadow-xs ring-1 ring-[#303030] dark:ring-zinc-100"
                          : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                      )}
                    >
                      <div className="flex items-center justify-between w-full">
                        <Icon className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
                        {isSelected && (
                          <Check className="h-3 w-3 text-[#303030] dark:text-zinc-100" />
                        )}
                      </div>
                      <div>
                        <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100 block">
                          {item.label}
                        </span>
                        <span className="text-[11px] text-[#616161] dark:text-zinc-400 block mt-0.5">
                          {item.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Values Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                {formik.values.discountType !==
                  StoreDiscountType.FREE_SHIPPING && (
                  <PolarisInput
                    id="discountValue"
                    type="number"
                    name="discountValue"
                    label={formik.values.discountType === StoreDiscountType.PERCENTAGE ? "Discount %" : `Discount Amount (${currencySymbol})`}
                    required
                    value={formik.values.discountValue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.discountValue && formik.errors.discountValue ? (formik.errors.discountValue as string) : undefined}
                  />
                )}

                {formik.values.discountType ===
                  StoreDiscountType.PERCENTAGE && (
                  <PolarisInput
                    id="maxDiscountCap"
                    type="number"
                    name="maxDiscountCap"
                    label={`Max Discount Cap (${currencySymbol})`}
                    value={formik.values.maxDiscountCap || ""}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="0 (No limit)"
                  />
                )}

                <PolarisInput
                  id="minCartSubtotal"
                  type="number"
                  name="minCartSubtotal"
                  label={`Min. Cart Subtotal (${currencySymbol})`}
                  value={formik.values.minCartSubtotal || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="0 (No minimum)"
                />

                <PolarisInput
                  id="codePrefix"
                  name="codePrefix"
                  label="Code Prefix"
                  required
                  value={formik.values.codePrefix}
                  onChange={(e) => {
                    setHasUserEditedPrefix(true);
                    formik.setFieldValue(
                      "codePrefix",
                      e.target.value.toUpperCase(),
                    );
                  }}
                  onBlur={formik.handleBlur}
                  placeholder={defaultEntityPrefix}
                  error={formik.touched.codePrefix && formik.errors.codePrefix ? formik.errors.codePrefix : undefined}
                />
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
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <PolarisInput
                  id="validityDays"
                  type="number"
                  min={1}
                  name="validityDays"
                  label="Validity Period (Days)"
                  required
                  value={formik.values.validityDays}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText="Calculates exact expiration date when code is synthesized."
                />

                <div className="flex items-center justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40">
                  <div className="space-y-0.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                      Single-Use per Customer Lock
                    </span>
                    <span className="text-[11.5px] text-[#616161] dark:text-zinc-400 block">
                      Restricts redemption to winning member email on checkout.
                    </span>
                  </div>
                  <Switch
                    checked={formik.values.singleUsePerCustomer}
                    onCheckedChange={(c) =>
                      formik.setFieldValue("singleUsePerCustomer", c)
                    }
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
        buttonText={
          isEditing
            ? "Update Store Reward Blueprint"
            : "Save Store Reward Blueprint"
        }
      />
    </div>
  );
}

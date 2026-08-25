"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "sonner";
import { ArrowLeft, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

import {
  ShopifyDiscountFormValues,
  initialShopifyDiscountValues,
  shopifyDiscountSchema,
} from "./types";

import { DiscountMethodCard } from "./cards/discount-method-card";
import { DiscountValueCard } from "./cards/discount-value-card";
import { CustomerEligibilityCard } from "./cards/customer-eligibility-card";
import { MinimumPurchaseCard } from "./cards/minimum-purchase-card";
import { MaximumUsesCard } from "./cards/maximum-uses-card";
import { CombinationsCard } from "./cards/combinations-card";
import { ActiveDatesCard } from "./cards/active-dates-card";

import { DiscountSummaryCard } from "./cards/discount-summary-card";
import { SalesChannelCard } from "./cards/sales-channel-card";
import { TagsCard } from "./cards/tags-card";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";

export interface ShopifyDiscountFormProps {
  initialValues?: Partial<ShopifyDiscountFormValues>;
  onSubmit?: (values: ShopifyDiscountFormValues) => Promise<void> | void;
  onCancel?: () => void;
  backHref?: string;
  pageTitle?: string;
  className?: string;
}

export function ShopifyDiscountForm({
  initialValues: propInitialValues,
  onSubmit,
  onCancel,
  backHref = "/integrations/shopify/coupons",
  pageTitle = "Create discount",
  className,
}: ShopifyDiscountFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const mergedInitialValues: ShopifyDiscountFormValues = {
    ...initialShopifyDiscountValues,
    ...propInitialValues,
  };

  const formik = useFormik<ShopifyDiscountFormValues>({
    initialValues: mergedInitialValues,
    validationSchema: shopifyDiscountSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (onSubmit) {
          await onSubmit(values);
        } else {
          // Default mock successful creation with realistic delay
          await new Promise((resolve) => setTimeout(resolve, 800));
          const discountIdentifier =
            values.discountMethod === "CODE"
              ? values.code.toUpperCase()
              : values.title;

          setSaved(true);
          toast.success("Discount created successfully", {
            description: `"${discountIdentifier}" is now active in your Shopify store.`,
          });

          if (backHref) {
            router.push(backHref);
          }
        }
      } catch (err: any) {
        toast.error("Failed to create discount", {
          description: err.message || "An unexpected error occurred. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleBack = () => {
    if (onCancel) {
      onCancel();
    } else if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  };

  const handleSaveAttempt = (e?: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();

    if (Object.keys(formik.errors).length > 0) {
      // Find the first error field and focus or scroll to it
      const firstErrorKey = Object.keys(formik.errors)[0];
      toast.error("Please review highlighted errors in the form", {
        description: String(formik.errors[firstErrorKey as keyof typeof formik.errors]),
      });

      const element =
        document.getElementById(`discount-${firstErrorKey}`) ||
        document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }

    formik.handleSubmit();
  };

  const handleDiscard = () => {
    formik.resetForm();
    toast.info("Unsaved changes discarded");
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-[#f6f6f7] dark:bg-zinc-950 text-[#303030] dark:text-zinc-100 px-4 sm:px-8 md:px-10 py-6 sm:py-8 pb-28 sm:pb-32 font-sans antialiased",
        className
      )}
    >
      <div className="max-w-[1280px] mx-auto space-y-4">
        {/* ── Page Header: Back arrow + Title ───────────────────────────────── */}
        <header className="flex items-center gap-2.5 h-[48px] mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="h-9 w-9 rounded-[8px] flex items-center justify-center text-[#616161] hover:text-[#303030] dark:text-zinc-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 stroke-[2.2]" />
          </button>
          <h1 className="text-[20px] font-semibold text-[#303030] dark:text-zinc-100 leading-[28px] tracking-tight">
            {pageTitle}
          </h1>
        </header>

        {/* ── Main Form Formik Layout (2 Columns) ─────────────────────────── */}
        <form onSubmit={handleSaveAttempt}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* ── Main Column (~2fr / 8 cols) ──────────────────────────────── */}
            <div className="lg:col-span-8 space-y-4 min-w-0">
              {/* 1. Method & Code */}
              <DiscountMethodCard
                method={formik.values.discountMethod}
                onMethodChange={(method) =>
                  formik.setFieldValue("discountMethod", method)
                }
                code={formik.values.code}
                onCodeChange={(code) => formik.setFieldValue("code", code)}
                title={formik.values.title}
                onTitleChange={(title) => formik.setFieldValue("title", title)}
                codeError={
                  formik.touched.code && formik.errors.code
                    ? String(formik.errors.code)
                    : null
                }
                titleError={
                  formik.touched.title && formik.errors.title
                    ? String(formik.errors.title)
                    : null
                }
              />

              {/* 2. Value & Scope */}
              <DiscountValueCard
                discountType={formik.values.discountType}
                onDiscountTypeChange={(t) =>
                  formik.setFieldValue("discountType", t)
                }
                value={formik.values.value}
                onValueChange={(val) => formik.setFieldValue("value", val)}
                valueError={
                  formik.touched.value && formik.errors.value
                    ? String(formik.errors.value)
                    : null
                }
                appliesTo={formik.values.appliesTo}
                onAppliesToChange={(app) =>
                  formik.setFieldValue("appliesTo", app)
                }
                selectedCollections={formik.values.selectedCollections}
                onCollectionsChange={(cols) =>
                  formik.setFieldValue("selectedCollections", cols)
                }
                selectedProducts={formik.values.selectedProducts}
                onProductsChange={(prods) =>
                  formik.setFieldValue("selectedProducts", prods)
                }
                purchaseType={formik.values.purchaseType}
                onPurchaseTypeChange={(pt) =>
                  formik.setFieldValue("purchaseType", pt)
                }
              />

              {/* 3. Customer Eligibility */}
              <CustomerEligibilityCard
                eligibility={formik.values.eligibility}
                onEligibilityChange={(el) =>
                  formik.setFieldValue("eligibility", el)
                }
                selectedSegments={formik.values.selectedCustomerSegments}
                onSegmentsChange={(segs) =>
                  formik.setFieldValue("selectedCustomerSegments", segs)
                }
                selectedCustomers={formik.values.selectedCustomers}
                onCustomersChange={(custs) =>
                  formik.setFieldValue("selectedCustomers", custs)
                }
              />

              {/* 4. Minimum Purchase Requirements */}
              <MinimumPurchaseCard
                minType={formik.values.minRequirementType}
                onMinTypeChange={(type) =>
                  formik.setFieldValue("minRequirementType", type)
                }
                minAmount={formik.values.minAmount}
                onMinAmountChange={(val) =>
                  formik.setFieldValue("minAmount", val)
                }
                minAmountError={
                  formik.touched.minAmount && formik.errors.minAmount
                    ? String(formik.errors.minAmount)
                    : null
                }
                minQuantity={formik.values.minQuantity}
                onMinQuantityChange={(val) =>
                  formik.setFieldValue("minQuantity", val)
                }
                minQuantityError={
                  formik.touched.minQuantity && formik.errors.minQuantity
                    ? String(formik.errors.minQuantity)
                    : null
                }
              />

              {/* 5. Maximum Discount Uses */}
              <MaximumUsesCard
                limitTotalUses={formik.values.limitTotalUses}
                onLimitTotalUsesChange={(val) =>
                  formik.setFieldValue("limitTotalUses", val)
                }
                totalUsesLimit={formik.values.totalUsesLimit}
                onTotalUsesLimitChange={(val) =>
                  formik.setFieldValue("totalUsesLimit", val)
                }
                totalUsesLimitError={
                  formik.touched.totalUsesLimit && formik.errors.totalUsesLimit
                    ? String(formik.errors.totalUsesLimit)
                    : null
                }
                limitOncePerCustomer={formik.values.limitOncePerCustomer}
                onLimitOncePerCustomerChange={(val) =>
                  formik.setFieldValue("limitOncePerCustomer", val)
                }
              />

              {/* 6. Combinations */}
              <CombinationsCard
                combinesWithProductDiscounts={
                  formik.values.combinesWithProductDiscounts
                }
                onCombinesWithProductChange={(val) =>
                  formik.setFieldValue("combinesWithProductDiscounts", val)
                }
                combinesWithOrderDiscounts={
                  formik.values.combinesWithOrderDiscounts
                }
                onCombinesWithOrderChange={(val) =>
                  formik.setFieldValue("combinesWithOrderDiscounts", val)
                }
                combinesWithShippingDiscounts={
                  formik.values.combinesWithShippingDiscounts
                }
                onCombinesWithShippingChange={(val) =>
                  formik.setFieldValue("combinesWithShippingDiscounts", val)
                }
              />

              {/* 7. Active Dates */}
              <ActiveDatesCard
                startDate={formik.values.startDate}
                onStartDateChange={(val) =>
                  formik.setFieldValue("startDate", val)
                }
                startDateError={
                  formik.touched.startDate && formik.errors.startDate
                    ? String(formik.errors.startDate)
                    : null
                }
                startTime={formik.values.startTime}
                onStartTimeChange={(val) =>
                  formik.setFieldValue("startTime", val)
                }
                startTimeError={
                  formik.touched.startTime && formik.errors.startTime
                    ? String(formik.errors.startTime)
                    : null
                }
                hasEndDate={formik.values.hasEndDate}
                onHasEndDateChange={(val) =>
                  formik.setFieldValue("hasEndDate", val)
                }
                endDate={formik.values.endDate}
                onEndDateChange={(val) => formik.setFieldValue("endDate", val)}
                endDateError={
                  formik.touched.endDate && formik.errors.endDate
                    ? String(formik.errors.endDate)
                    : null
                }
                endTime={formik.values.endTime}
                onEndTimeChange={(val) => formik.setFieldValue("endTime", val)}
                endTimeError={
                  formik.touched.endTime && formik.errors.endTime
                    ? String(formik.errors.endTime)
                    : null
                }
              />
            </div>

            {/* ── Sidebar Column (~1fr / 4 cols) ───────────────────────────── */}
            <div className="lg:col-span-4 space-y-4">
              <div className="sticky top-6 space-y-4">
                {/* 1. Live Summary Card */}
                <DiscountSummaryCard values={formik.values} />

                {/* 2. Sales Channel Access Card */}
                <SalesChannelCard
                  salesChannelAccess={formik.values.salesChannelAccess}
                  onSalesChannelAccessChange={(val) =>
                    formik.setFieldValue("salesChannelAccess", val)
                  }
                  channels={formik.values.channels}
                  onChannelToggle={(key, val) =>
                    formik.setFieldValue(`channels.${key}`, val)
                  }
                />

                {/* 3. Tags Card */}
                <TagsCard
                  tags={formik.values.tags}
                  onTagsChange={(tags) => formik.setFieldValue("tags", tags)}
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ── Floating Save Panel ─────────────────────────────────────────── */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={saved}
        isSaving={isSubmitting}
        onSave={() => handleSaveAttempt()}
        onReset={handleDiscard}
        title="Unsaved discount"
        description="You have pending changes to this discount configuration."
        buttonText="Save discount"
        discardButtonText="Discard"
      />
    </div>
  );
}

export default ShopifyDiscountForm;


"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Ticket,
  Coins,
  ShieldCheck,
  Sparkles,
  Layers,
  Users,
  Zap,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
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
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { cn } from "@/lib/utils";
import { useGetEntity } from "@/graphql/actions";
import {
  useCreateManualVoucherBatch,
  useGetManualVoucherBatchById,
  ManualCouponType,
} from "@/graphql/actions/rewards/manual";
import { ManualRewardItem } from "../table/manual-reward-card";
import { toast } from "sonner";

interface InternalRewardFormProps {
  initialItem?: ManualRewardItem | null;
  id?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const internalRewardSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),
  couponType: Yup.string().required("Select an emission architecture"),
  prefix: Yup.string().when("couponType", {
    is: ManualCouponType.ONE_TO_ONE,
    then: (schema) => schema.required("Code prefix is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  count: Yup.number().when("couponType", {
    is: ManualCouponType.ONE_TO_ONE,
    then: (schema) =>
      schema
        .min(2, "Minimum 2 voucher codes")
        .max(100, "Maximum 100 voucher codes per batch")
        .required("Batch quantity is required"),
    otherwise: (schema) => schema.nullable(),
  }),
  couponCode: Yup.string().when("couponType", {
    is: ManualCouponType.ONE_TO_MANY,
    then: (schema) =>
      schema.required("Coupon code string is required for shared campaigns"),
    otherwise: (schema) => schema.nullable(),
  }),
  validityDays: Yup.number().min(1, "Validity days must be at least 1"),
  url: Yup.string()
    .url("Must be a valid URL format (e.g. https://example.com)")
    .nullable(),
});

export const InternalRewardForm: React.FC<InternalRewardFormProps> = ({
  initialItem,
  id,
  onSuccess,
  onCancel,
}) => {
  const [createBatch, { loading: creatingBatch }] =
    useCreateManualVoucherBatch();
  const [isSaved, setIsSaved] = useState(false);
  const [hasUserEditedPrefix, setHasUserEditedPrefix] = useState(false);
  const [generatedSampleCodes, setGeneratedSampleCodes] = useState<string[]>(
    [],
  );

  const ruleId = initialItem?.id || id;
  const isEditing = Boolean(ruleId);

  const { data: fetchedBatchData } = useGetManualVoucherBatchById(id || "", {
    skip: !id || Boolean(initialItem),
  });

  const parsedFetchedItem: ManualRewardItem | null = fetchedBatchData
    ?.getManualVoucherBatchById
    ? {
        id: fetchedBatchData.getManualVoucherBatchById.id,
        title: fetchedBatchData.getManualVoucherBatchById.name,
        description: fetchedBatchData.getManualVoucherBatchById.description,
        image: fetchedBatchData.getManualVoucherBatchById.image || "",
        url: fetchedBatchData.getManualVoucherBatchById.url || "",
        couponType:
          fetchedBatchData.getManualVoucherBatchById.couponType ||
          ManualCouponType.ONE_TO_ONE,
        couponCode:
          fetchedBatchData.getManualVoucherBatchById.couponType ===
          ManualCouponType.ONE_TO_MANY
            ? fetchedBatchData.getManualVoucherBatchById.name
            : "",
        codePrefix: "VCH",
        faceValue: fetchedBatchData.getManualVoucherBatchById.faceValue || 0,
        currency: fetchedBatchData.getManualVoucherBatchById.currency || "TC",
        totalInventory:
          fetchedBatchData.getManualVoucherBatchById.totalCount || 0,
        allocatedCount:
          fetchedBatchData.getManualVoucherBatchById.allocatedCount || 0,
        redeemedCount:
          fetchedBatchData.getManualVoucherBatchById.redeemedCount || 0,
        remainingCount:
          fetchedBatchData.getManualVoucherBatchById.remainingCount || 0,
        isActive: fetchedBatchData.getManualVoucherBatchById.status === "ACTIVE",
        validityDays: 30,
        createdAt:
          fetchedBatchData.getManualVoucherBatchById.createdAt ||
          new Date().toISOString(),
      }
    : null;

  const currentItem = initialItem || parsedFetchedItem;

  const { data: entityData } = useGetEntity();
  const rawEntityName = entityData?.getEntity?.name || "VCH";
  const defaultEntityPrefix =
    rawEntityName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6) ||
    "VCH";

  const formik = useFormik({
    initialValues: {
      title: currentItem?.title || "",
      description: currentItem?.description || "",
      image: currentItem?.image || "",
      couponType: currentItem?.couponType || ManualCouponType.ONE_TO_ONE,
      prefix: currentItem?.codePrefix || defaultEntityPrefix,
      count: currentItem?.totalInventory || 25,
      couponCode: currentItem?.couponCode || "",
      inventoryRequired: true,
      totalUsageLimit: currentItem?.totalInventory || 25,
      validityDays: currentItem?.validityDays || 30,
      url: currentItem?.url || "",
      isActive: currentItem?.isActive ?? true,
      status: currentItem?.isActive !== false ? "ACTIVE" : "DRAFT",
      expiryDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + (currentItem?.validityDays || 30));
        return d.toISOString().slice(0, 16);
      })(),
    },
    validationSchema: internalRewardSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (!isEditing) {
          const res = await createBatch({
            variables: {
              input: {
                name: values.title,
                description: values.description,
                image: values.image || undefined,
                url: values.url || undefined,
                couponType: values.couponType as ManualCouponType,
                prefix:
                  values.couponType === ManualCouponType.ONE_TO_ONE
                    ? values.prefix
                    : undefined,
                count:
                  values.couponType === ManualCouponType.ONE_TO_ONE
                    ? Number(values.count)
                    : undefined,
                totalUsageLimit:
                  values.couponType === ManualCouponType.ONE_TO_MANY
                    ? Number(values.totalUsageLimit) || undefined
                    : undefined,
                status: values.status,
              },
            },
          });

          if (res.data?.createManualVoucherBatch) {
            toast.success(
              `Manual voucher pool '${values.title}' created successfully`,
            );
            setIsSaved(true);
            onSuccess?.();
          }
        } else {
          toast.success("Manual voucher configuration updated");
          setIsSaved(true);
          onSuccess?.();
        }
      } catch (err: any) {
        toast.error(
          err.message || "Failed to save internal voucher configuration.",
        );
      }
    },
  });

  const isOneToOne = formik.values.couponType === ManualCouponType.ONE_TO_ONE;

  const handleGeneratePreviewCodes = () => {
    const pfx = formik.values.prefix || "VCH";
    const sample = Array.from({ length: 4 }).map(() => {
      const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
      return `${pfx}-${rand}`;
    });
    setGeneratedSampleCodes(sample);
  };

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <>
            {/* Architecture Overview */}
            <PolarisSidebarCard title="Reward Summary" icon={Layers}>
              <div className="space-y-1">
                <PolarisSummaryRow
                  label="Pillar Type"
                  value={
                    <span className="font-semibold text-[#303030] dark:text-zinc-100">
                      Internal / Manual
                    </span>
                  }
                />
                <PolarisSummaryRow
                  label="Architecture"
                  value={
                    <Badge
                      variant="outline"
                      className="text-[10px] font-semibold border-[#d2d5d9] text-[#303030] dark:text-zinc-100 rounded-[4px]"
                    >
                      {isOneToOne ? "1:1 Unique Pool" : "1:N Shared Code"}
                    </Badge>
                  }
                />
                <PolarisSummaryRow
                  label="Fee Structure"
                  value={
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      $0.00 (Zero Fees)
                    </span>
                  }
                />
                <PolarisSummaryRow
                  label="Code Prefix"
                  value={
                    <span className="font-mono font-semibold text-[#303030] dark:text-zinc-100">
                      {isOneToOne
                        ? formik.values.prefix || "VCH"
                        : formik.values.couponCode || "PROMO"}
                    </span>
                  }
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Live Preview Card */}
            <PolarisSidebarCard title="Live Preview" icon={Sparkles}>
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
                    <Ticket className="h-6 w-6 text-emerald-600/70" />
                    <span className="text-[11px] font-medium">
                      Reward Thumbnail
                    </span>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-[#303030] text-white text-[10px] font-semibold px-2 py-0 rounded-[4px]">
                      {isOneToOne ? "1:1 Unique Serials" : "1:N Shared Code"}
                    </Badge>
                  </div>
                  <h5 className="text-[14px] font-semibold text-[#303030] dark:text-zinc-100 truncate">
                    {formik.values.title || "Untitled Internal Reward"}
                  </h5>
                  <p className="text-[12px] text-[#616161] dark:text-zinc-400 line-clamp-2 leading-[16px]">
                    {formik.values.description ||
                      "Provide a reward description to see how it will appear in user wallet."}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800 space-y-1">
                  <PolarisSummaryRow
                    label="Inventory"
                    value={
                      isOneToOne
                        ? `${formik.values.count} Units (${formik.values.prefix || "VCH"}-*)`
                        : formik.values.totalUsageLimit
                          ? `${formik.values.totalUsageLimit} Redemptions`
                          : "Unlimited Redemptions"
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
            <PolarisTipCard title="Internal Reward Engine">
              Proprietary internal rewards run on zero vendor fees. Codes can be
              assigned directly to Spin Wheels, Scratch Cards, Match & Win, or
              granted directly to members.
            </PolarisTipCard>
          </>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-3.5">
          {/* Card 1: Core Reward Identification */}
          <PolarisFormCard
            step={1}
            title="Reward Identification & Media"
            description="Basic information displayed on reward cards and redemption modals."
            badge="Required"
          >
            <div className="space-y-3.5">
              <PolarisInput
                id="title"
                name="title"
                label="Reward Title"
                required
                placeholder="e.g., VIP Summer Community Pass, 500 Discount Voucher"
                value={formik.values.title}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.title && formik.errors.title ? (formik.errors.title as string) : undefined}
              />

              <PolarisTextarea
                id="description"
                name="description"
                label="Reward Description"
                required
                placeholder="Explain what the member gets, terms of use, and redemption details..."
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.description && formik.errors.description ? (formik.errors.description as string) : undefined}
              />

              {/* Cover Image Upload */}
              <div className="space-y-1.5 pt-1">
                <PolarisLabel>Cover Artwork / Badge Image</PolarisLabel>
                <ImageUploadWithCrop
                  currentImage={formik.values.image}
                  onImageUpdate={(cdnUrl: string) =>
                    formik.setFieldValue("image", cdnUrl)
                  }
                  aspectRatio={16 / 9}
                />
              </div>

              {/* Redemption / Claim URL */}
              <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisInput
                  id="url"
                  name="url"
                  type="url"
                  label="Redemption / Claim URL (Optional)"
                  placeholder="e.g., https://yourbrand.com/redeem or app deep-link"
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.url && formik.errors.url ? (formik.errors.url as string) : undefined}
                  helperText="External link where winners can directly apply or claim their voucher code."
                />
              </div>
            </div>
          </PolarisFormCard>

          {/* Card 2: Emission Architecture & Pool Configuration */}
          <PolarisFormCard
            step={2}
            title="Emission Architecture & Pool Configuration"
            description="Select how codes are generated, validated, and distributed to members."
            badge="Pillar 1"
          >
            <div className="space-y-3.5">
              {/* Architecture Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div
                  onClick={() =>
                    formik.setFieldValue(
                      "couponType",
                      ManualCouponType.ONE_TO_ONE,
                    )
                  }
                  className={cn(
                    "p-3 rounded-[6px] border transition-all cursor-pointer space-y-1",
                    isOneToOne
                      ? "border-[#303030] bg-[#f6f6f7] dark:border-zinc-100 dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
                      : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-[4px] bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                        <Ticket className="h-3 w-3" />
                      </div>
                      <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
                        ONE_TO_ONE (Unique Pool)
                      </span>
                    </div>
                    {isOneToOne && (
                      <Check className="h-3 w-3 text-[#303030] dark:text-zinc-100" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[14px]">
                    Each winner receives an exclusive, single-use credential
                    from a pre-allocated pool.
                  </p>
                </div>

                <div
                  onClick={() =>
                    formik.setFieldValue(
                      "couponType",
                      ManualCouponType.ONE_TO_MANY,
                    )
                  }
                  className={cn(
                    "p-3 rounded-[6px] border transition-all cursor-pointer space-y-1",
                    !isOneToOne
                      ? "border-[#303030] bg-[#f6f6f7] dark:border-zinc-100 dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
                      : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-[4px] bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                        <Users className="h-3 w-3" />
                      </div>
                      <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
                        ONE_TO_MANY (Shared Code)
                      </span>
                    </div>
                    {!isOneToOne && (
                      <Check className="h-3 w-3 text-[#303030] dark:text-zinc-100" />
                    )}
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[14px]">
                    Single promotional string usable across multiple members
                    with global usage limits.
                  </p>
                </div>
              </div>

              {/* Validity Days */}
              <div className="max-w-xs pt-1">
                <PolarisInput
                  id="validityDays"
                  name="validityDays"
                  type="number"
                  min={1}
                  label="Validity Duration (Days)"
                  value={formik.values.validityDays}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>

              {/* Conditional Config based on type */}
              {isOneToOne ? (
                <div className="p-3 rounded-[6px] bg-[#f6f6f7]/60 dark:bg-zinc-800/40 border border-[#d2d5d9] dark:border-zinc-700 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100 flex items-center gap-1.5">
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                      Batch Auto-Generation Config
                    </span>
                    <span className="text-[11px] text-[#616161]">
                      Will create initial voucher batch
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <PolarisInput
                      id="prefix"
                      name="prefix"
                      label="Code Prefix"
                      placeholder={defaultEntityPrefix}
                      value={formik.values.prefix}
                      onChange={(e) => {
                        setHasUserEditedPrefix(true);
                        formik.setFieldValue(
                          "prefix",
                          e.target.value.toUpperCase(),
                        );
                      }}
                      onBlur={formik.handleBlur}
                      error={formik.touched.prefix && formik.errors.prefix ? (formik.errors.prefix as string) : undefined}
                    />

                    <PolarisInput
                      id="count"
                      name="count"
                      type="number"
                      min={2}
                      max={100}
                      label="Initial Batch Quantity (2 - 100 Codes)"
                      value={formik.values.count}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.count && formik.errors.count ? (formik.errors.count as string) : undefined}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGeneratePreviewCodes}
                      className="h-[28px] text-[11.5px] font-semibold gap-1.5 rounded-[4px] border-[#aeb4b9]"
                    >
                      <Zap className="h-3 w-3 text-amber-500" />
                      Preview Sample Series
                    </Button>
                    <span className="text-[11px] text-[#616161] font-mono">
                      Format: {formik.values.prefix || "VCH"}-XXXXX
                    </span>
                  </div>

                  {generatedSampleCodes.length > 0 && (
                    <div className="p-2 rounded-[4px] bg-white dark:bg-zinc-900 border border-[#d2d5d9] dark:border-zinc-700 space-y-1">
                      <span className="text-[10px] font-semibold text-[#616161] uppercase tracking-wider block">
                        Sample Output Series
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {generatedSampleCodes.map((code, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[10.5px] font-semibold px-1.5 py-0.2 rounded-[3px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] text-[#303030] dark:text-zinc-100"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3 rounded-[6px] bg-[#f6f6f7]/60 dark:bg-zinc-800/40 border border-[#d2d5d9] dark:border-zinc-700 space-y-2.5">
                  <PolarisInput
                    id="couponCode"
                    name="couponCode"
                    label="Promotional Code String"
                    required
                    placeholder="e.g. WELCOME2026, SUMMER50, VIPMEMBER"
                    value={formik.values.couponCode}
                    onChange={(e) =>
                      formik.setFieldValue(
                        "couponCode",
                        e.target.value.toUpperCase(),
                      )
                    }
                    onBlur={formik.handleBlur}
                    error={formik.touched.couponCode && formik.errors.couponCode ? (formik.errors.couponCode as string) : undefined}
                  />

                  <div className="max-w-xs">
                    <PolarisInput
                      id="totalUsageLimit"
                      name="totalUsageLimit"
                      type="number"
                      min={0}
                      label="Global Usage Limit"
                      placeholder="0 for unlimited"
                      value={formik.values.totalUsageLimit}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>
              )}
            </div>
          </PolarisFormCard>
        </form>
      </PolarisFormLayout>

      {/* Floating Save Panel */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={isSaved}
        isSaving={creatingBatch}
        onSave={() => formik.submitForm()}
        onReset={() => formik.resetForm()}
        title="Unsaved Internal Reward"
        description="You have pending changes to this internal reward."
        buttonText={isEditing ? "Update Internal Reward" : "Publish Internal Reward"}
      />
    </div>
  );
};

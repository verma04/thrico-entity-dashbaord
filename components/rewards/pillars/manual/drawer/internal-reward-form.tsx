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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisTipCard,
  PolarisSummaryRow,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { cn } from "@/lib/utils";
import { useGetEntity } from "@/graphql/actions";
import {
  useCreateManualVoucherBatch,
  ManualCouponType,
  CreateManualVoucherBatchInput,
} from "@/graphql/actions/rewards/manual";
import { toast } from "sonner";

interface InternalRewardFormProps {
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
  url: Yup.string().url("Must be a valid URL format (e.g. https://example.com)").nullable(),
});

export const InternalRewardForm: React.FC<InternalRewardFormProps> = ({
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

  const { data: entityData } = useGetEntity();
  const rawEntityName = entityData?.getEntity?.name || "VCH";
  const defaultEntityPrefix =
    rawEntityName.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6) || "VCH";

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      image: "",
      couponType: ManualCouponType.ONE_TO_ONE,
      prefix: defaultEntityPrefix,
      count: 25,
      couponCode: "",
      inventoryRequired: true,
      totalUsageLimit: 25,
      validityDays: 30,
      url: "",
      isActive: true,
      status: "ACTIVE",
      expiryDate: (() => {
        const d = new Date();
        d.setDate(d.getDate() + 30);
        return d.toISOString().slice(0, 16);
      })(),
    },
    validationSchema: internalRewardSchema,
    onSubmit: async (values) => {
      try {
        const input: CreateManualVoucherBatchInput = {
          name: values.title,
          description: values.description,
          image: values.image || null,
          url: values.url || null,
          couponType: values.couponType,
          inventoryRequired: values.inventoryRequired,
          faceValue: 0,
          currency: "TC",
          expiryDate: values.expiryDate || null,
        };

        if (values.couponType === ManualCouponType.ONE_TO_ONE) {
          input.count = Math.min(
            Math.max(Number(values.count) || 2, 2),
            100,
          );
          input.prefix = (values.prefix || "VCH").trim().toUpperCase();
        } else {
          input.couponCode = (values.couponCode || "PROMO")
            .trim()
            .toUpperCase();
          input.totalUsageLimit = Number(values.totalUsageLimit) || 0;
        }

        await createBatch({
          variables: {
            input,
          },
        });

        setIsSaved(true);
        toast.success("Internal Voucher Batch Created Successfully!", {
          description: `${values.title} is now active and ready for distribution.`,
        });

        if (onSuccess) {
          setTimeout(onSuccess, 800);
        }
      } catch (err: any) {
        toast.error("Failed to create internal voucher batch", {
          description: err.message || "An unexpected error occurred.",
        });
      }
    },
  });

  React.useEffect(() => {
    if (entityData?.getEntity?.name && !hasUserEditedPrefix) {
      const prefix =
        entityData.getEntity.name.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 6) || "VCH";
      formik.setFieldValue("prefix", prefix);
    }
  }, [entityData?.getEntity?.name, hasUserEditedPrefix]);

  const isOneToOne = formik.values.couponType === ManualCouponType.ONE_TO_ONE;

  const handleGeneratePreviewCodes = () => {
    const codes: string[] = [];
    const count = Math.min(Math.max(Number(formik.values.count) || 2, 2), 100);
    const prefix = (formik.values.prefix || "VCH").trim().toUpperCase();
    for (let i = 0; i < Math.min(count, 5); i++) {
      const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
      codes.push(`${prefix}-${rand}`);
    }
    setGeneratedSampleCodes(codes);
    toast.success(
      `Configured ${count} unique voucher slots (${prefix}-XXXXX)`,
    );
  };

  return (
    <div className="relative">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Status & Publish Card */}
            <PolarisSidebarCard title="Reward Status" icon={ShieldCheck}>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-bold text-foreground">
                    Active & Available
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    Visible in reward pool
                  </p>
                </div>
                <Switch
                  checked={formik.values.isActive}
                  onCheckedChange={(val) => {
                    formik.setFieldValue("isActive", val);
                    formik.setFieldValue("status", val ? "ACTIVE" : "DRAFT");
                  }}
                />
              </div>
            </PolarisSidebarCard>

            {/* Live Preview Card */}
            <PolarisSidebarCard title="Live Preview" icon={Sparkles}>
              <div className="rounded-xl border border-border/80 bg-card p-3 space-y-3 shadow-xs">
                {formik.values.image ? (
                  <div className="relative h-28 w-full rounded-lg overflow-hidden border border-border">
                    <img
                      src={formik.values.image}
                      alt="Preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-24 w-full rounded-lg bg-muted/40 border border-dashed border-border/70 flex flex-col items-center justify-center text-muted-foreground gap-1">
                    <Ticket className="h-6 w-6 text-emerald-600/70" />
                    <span className="text-[10px] font-medium">
                      Reward Thumbnail
                    </span>
                  </div>
                )}

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0">
                      {isOneToOne ? "1:1 Unique Serials" : "1:N Shared Code"}
                    </Badge>
                  </div>
                  <h5 className="text-xs font-bold text-foreground truncate">
                    {formik.values.title || "Untitled Internal Reward"}
                  </h5>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                    {formik.values.description ||
                      "Provide a reward description to see how it will appear in user wallet."}
                  </p>
                </div>

                <div className="pt-2 border-t border-border/60 space-y-1">
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
          </div>
        }
      >
        <form onSubmit={formik.handleSubmit} className="space-y-5">
          {/* Card 1: Core Reward Identification */}
          <PolarisFormCard
            step={1}
            title="Reward Identification & Media"
            description="Basic information displayed on reward cards and redemption modals."
            badge="Required"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label
                  htmlFor="title"
                  className="text-xs font-bold text-foreground"
                >
                  Reward Title <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g., VIP Summer Community Pass, 500 Discount Voucher"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-10 text-xs font-medium"
                />
                {formik.touched.title && formik.errors.title && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.title as string}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="description"
                  className="text-xs font-bold text-foreground"
                >
                  Reward Description <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Explain what the member gets, terms of use, and redemption details..."
                  rows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="text-xs font-medium resize-none"
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.description as string}
                  </p>
                )}
              </div>

              {/* Cover Image Upload */}
              <div className="space-y-1.5">
                <Label className="text-xs font-bold text-foreground">
                  Cover Artwork / Badge Image
                </Label>
                <ImageUploadWithCrop
                  currentImage={formik.values.image}
                  onImageUpdate={(cdnUrl: string) =>
                    formik.setFieldValue("image", cdnUrl)
                  }
                  aspectRatio={16 / 9}
                />
              </div>

              {/* Redemption / Claim URL */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="url"
                  className="text-xs font-bold text-foreground"
                >
                  Redemption / Claim URL (Optional)
                </Label>
                <Input
                  id="url"
                  name="url"
                  type="url"
                  placeholder="e.g., https://yourbrand.com/redeem or app deep-link"
                  value={formik.values.url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="h-10 text-xs font-medium"
                />
                {formik.touched.url && formik.errors.url && (
                  <p className="text-[11px] text-rose-500 font-medium">
                    {formik.errors.url as string}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground">
                  External link where winners can directly apply or claim their voucher code.
                </p>
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
            <div className="space-y-4">
              {/* Architecture Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() =>
                    formik.setFieldValue(
                      "couponType",
                      ManualCouponType.ONE_TO_ONE,
                    )
                  }
                  className={cn(
                    "p-3 rounded-xl border transition-all cursor-pointer space-y-1.5",
                    isOneToOne
                      ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/40 ring-1 ring-emerald-500/20 shadow-xs"
                      : "border-border/70 bg-card hover:bg-muted/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center">
                        <Ticket className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        ONE_TO_ONE (Unique Pool)
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-[9px] h-4">
                      Batch Ingestion
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
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
                    "p-3 rounded-xl border transition-all cursor-pointer space-y-1.5",
                    !isOneToOne
                      ? "border-emerald-600 bg-emerald-50/40 dark:bg-emerald-950/40 ring-1 ring-emerald-500/20 shadow-xs"
                      : "border-border/70 bg-card hover:bg-muted/40",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                        <Users className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs font-bold text-foreground">
                        ONE_TO_MANY (Shared Code)
                      </span>
                    </div>
                    <Badge variant="secondary" className="text-[9px] h-4">
                      Static Promo
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    Single promotional string usable across multiple members
                    with global usage limits.
                  </p>
                </div>
              </div>

              {/* Validity Days */}
              <div className="p-3.5 rounded-xl bg-muted/20 border border-border/70 space-y-1">
                <Label className="text-[11px] font-bold text-muted-foreground">
                  Validity Duration (Days)
                </Label>
                <Input
                  type="number"
                  min={1}
                  name="validityDays"
                  value={formik.values.validityDays}
                  onChange={formik.handleChange}
                  className="h-9 text-xs font-medium"
                />
              </div>

              {/* Conditional Config based on type */}
              {isOneToOne ? (
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                      <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
                      Batch Auto-Generation Config
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      Will create initial voucher batch
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-muted-foreground">
                        Code Prefix
                      </Label>
                      <Input
                        placeholder={defaultEntityPrefix}
                        name="prefix"
                        value={formik.values.prefix}
                        onChange={(e) => {
                          setHasUserEditedPrefix(true);
                          formik.setFieldValue(
                            "prefix",
                            e.target.value.toUpperCase(),
                          );
                        }}
                        onBlur={formik.handleBlur}
                        className="h-9 text-xs font-mono font-bold uppercase"
                      />
                      {formik.touched.prefix && formik.errors.prefix && (
                        <p className="text-[11px] text-rose-500 font-medium">
                          {formik.errors.prefix as string}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[11px] font-bold text-muted-foreground">
                        Initial Batch Quantity (2 - 100 Codes)
                      </Label>
                      <Input
                        type="number"
                        min={2}
                        max={100}
                        name="count"
                        value={formik.values.count}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="h-9 text-xs font-bold"
                      />
                      {formik.touched.count && formik.errors.count && (
                        <p className="text-[11px] text-rose-500 font-medium">
                          {formik.errors.count as string}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleGeneratePreviewCodes}
                      className="h-8 text-xs font-semibold gap-1.5"
                    >
                      <Zap className="h-3.5 w-3.5 text-amber-500" />
                      Preview Sample Series
                    </Button>
                    <span className="text-[11px] text-muted-foreground font-mono">
                      Format: {formik.values.prefix || "VCH"}-XXXXX
                    </span>
                  </div>

                  {generatedSampleCodes.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-card border border-border/80 space-y-1.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase block">
                        Sample Output Series
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {generatedSampleCodes.map((code, idx) => (
                          <span
                            key={idx}
                            className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-muted/60 border border-border text-foreground"
                          >
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-muted/30 border border-border/70 space-y-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="couponCode"
                      className="text-xs font-bold text-foreground"
                    >
                      Promotional Code String{" "}
                      <span className="text-rose-500">*</span>
                    </Label>
                    <Input
                      id="couponCode"
                      name="couponCode"
                      placeholder="e.g. WELCOME2026, SUMMER50, VIPMEMBER"
                      value={formik.values.couponCode}
                      onChange={(e) =>
                        formik.setFieldValue(
                          "couponCode",
                          e.target.value.toUpperCase(),
                        )
                      }
                      onBlur={formik.handleBlur}
                      className="h-10 text-xs font-mono font-bold uppercase tracking-wider"
                    />
                    {formik.touched.couponCode && formik.errors.couponCode && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        {formik.errors.couponCode as string}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-[11px] font-bold text-muted-foreground">
                      Global Usage Limit
                    </Label>
                    <Input
                      type="number"
                      min={0}
                      placeholder="0 for unlimited"
                      name="totalUsageLimit"
                      value={formik.values.totalUsageLimit}
                      onChange={formik.handleChange}
                      className="h-9 text-xs font-medium"
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
        buttonText="Publish Internal Reward"
      />
    </div>
  );
};


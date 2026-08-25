"use client";

import React from "react";
import { Link as LinkIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import {
  PolarisFormCard,
  PolarisInput,
  PolarisTextarea,
  PolarisLabel,
} from "@/components/gamification/shared/polaris-form-ui";

interface RewardInfoSectionProps {
  formik: any;
  err: (field: string) => React.ReactNode;
}

export function RewardInfoSection({ formik, err }: RewardInfoSectionProps) {
  return (
    <PolarisFormCard
      step={1}
      title="Reward Details"
      description="Name, member-facing description, and visual identity for this reward offer."
      badge="Reward Info"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left Column: Title, Description, Link */}
        <div className="md:col-span-7 space-y-3.5">
          <PolarisInput
            id="title"
            label="Reward Title"
            required
            placeholder="e.g. ₹500 Amazon Gift Card, 20% Off Store Discount"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.title && formik.errors.title ? String(formik.errors.title) : undefined}
          />

          <PolarisTextarea
            id="description"
            label="Short Description"
            required
            rows={3}
            placeholder="Describe what members will receive and highlight exclusive benefits..."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description ? String(formik.errors.description) : undefined}
          />

          <PolarisInput
            id="url"
            type="url"
            label="Reward URL (Optional)"
            placeholder="https://yourstore.com/redeem"
            prefix={<LinkIcon className="h-3.5 w-3.5 text-[#616161]" />}
            value={formik.values.url}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.url && formik.errors.url ? String(formik.errors.url) : undefined}
          />
        </div>

        {/* Right Column: Banner & Active Switch */}
        <div className="md:col-span-5 space-y-3.5">
          <div className="space-y-1.5">
            <PolarisLabel>Cover Banner</PolarisLabel>
            <div className="p-1 overflow-hidden">
              <ImageUploadWithCrop
                currentImage={formik.values.image}
                onImageUpdate={(url) => formik.setFieldValue("image", url)}
                aspectRatio={16 / 9}
                recommendedWidth={1200}
                recommendedHeight={675}
                uploadButtonText="Change Banner"
              />
            </div>
          </div>

          {/* Active Toggle Card */}
          <div className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 block">
                Reward Active & Redeemable
              </span>
              <span className="text-[11px] text-[#616161] dark:text-zinc-400 block">
                Controls catalog visibility in member wallet.
              </span>
            </div>
            <Switch
              checked={formik.values.isActive}
              onCheckedChange={(c) => {
                formik.setFieldValue("isActive", c);
                formik.setFieldValue("status", c ? "ACTIVE" : "DRAFT");
              }}
            />
          </div>
        </div>
      </div>
    </PolarisFormCard>
  );
}

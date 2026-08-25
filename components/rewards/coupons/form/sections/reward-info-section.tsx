"use client";

import React from "react";
import { Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";

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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Left Column: Title, Description, Link */}
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="title"
              className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
            >
              Reward Title <span className="text-[#d72c0d] ml-0.5">*</span>
            </label>
            <Input
              id="title"
              placeholder="e.g. ₹500 Amazon Gift Card, 20% Off Store Discount"
              className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
              {...formik.getFieldProps("title")}
            />
            {err("title")}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
            >
              Short Description <span className="text-[#d72c0d] ml-0.5">*</span>
            </label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Describe what members will receive and highlight exclusive benefits..."
              className="min-h-[80px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px] resize-none"
              {...formik.getFieldProps("description")}
            />
            {err("description")}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="url"
              className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none"
            >
              Reward URL (Optional)
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#616161]" />
              <Input
                id="url"
                type="url"
                placeholder="https://yourstore.com/redeem"
                className="pl-9 h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                {...formik.getFieldProps("url")}
              />
            </div>
            {err("url")}
          </div>
        </div>

        {/* Right Column: Banner & Active Switch */}
        <div className="md:col-span-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 leading-[20px] select-none">
              Cover Banner
            </label>
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
          <div className="p-3.5 rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-800/40 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 block">
                Reward Active & Redeemable
              </span>
              <span className="text-[11.5px] text-[#616161] dark:text-zinc-400 block">
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

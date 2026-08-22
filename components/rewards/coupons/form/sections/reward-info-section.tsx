"use client";

import React from "react";
import { Link as LinkIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column: Title, Description, Link */}
        <div className="md:col-span-7 space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Reward Title *
            </Label>
            <Input
              id="title"
              placeholder="e.g. ₹500 Amazon Gift Card, 20% Off Store Discount"
              className="h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-sm font-semibold shadow-none focus-visible:ring-1 focus-visible:ring-zinc-900 dark:focus-visible:ring-zinc-100"
              {...formik.getFieldProps("title")}
            />
            {err("title")}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Short Description *
            </Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="Describe what members will receive and highlight exclusive benefits..."
              className="bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none text-xs leading-relaxed resize-none"
              {...formik.getFieldProps("description")}
            />
            {err("description")}
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="url"
              className="text-xs font-semibold text-zinc-700 dark:text-zinc-300"
            >
              Reward URL (Optional)
            </Label>
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <Input
                id="url"
                type="url"
                placeholder="https://yourstore.com/redeem"
                className="pl-10 h-11 bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 shadow-none text-xs font-medium"
                {...formik.getFieldProps("url")}
              />
            </div>
            {err("url")}
          </div>
        </div>

        {/* Right Column: Banner & Active Switch */}
        <div className="md:col-span-5 space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Cover Banner
            </Label>
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

          <div className="bg-zinc-50/50 dark:bg-zinc-800/40 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 flex items-center justify-between">
            <div className="space-y-0.5">
              <Label
                htmlFor="isActive"
                className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 block cursor-pointer"
              >
                Active in Catalog
              </Label>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Allow members to view and claim.
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formik.values.isActive}
              onCheckedChange={(checked) => {
                formik.setFieldValue("isActive", checked);
                formik.setFieldValue(
                  "status",
                  checked ? "ACTIVE" : "INACTIVE"
                );
              }}
            />
          </div>
        </div>
      </div>

      {/* Claim Instructions */}
      <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-800">
        <Label
          htmlFor="howToClaim"
          className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 block"
        >
          How to Claim Instructions
        </Label>
        <RichTextEditor
          value={formik.values.howToClaim || ""}
          onChange={(val) => formik.setFieldValue("howToClaim", val)}
          placeholder="Step-by-step instructions on how members can claim or redeem this reward..."
          minHeight="130px"
        />
        {err("howToClaim")}
      </div>
    </PolarisFormCard>
  );
}

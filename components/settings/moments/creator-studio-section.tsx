"use client";

import React from "react";
import { FormikProps } from "formik";
import { Film, Type, Clock, AlertCircle, Send, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { MomentsFormValues, PreviewTabId } from "./types";
import { cn } from "@/lib/utils";

interface CreatorStudioSectionProps {
  formik: FormikProps<MomentsFormValues>;
  singularName: string;
  previewTab: PreviewTabId;
  onSelectPreviewTab: (tab: PreviewTabId) => void;
}

export const CreatorStudioSection: React.FC<CreatorStudioSectionProps> = ({
  formik,
  singularName,
  previewTab,
  onSelectPreviewTab,
}) => {
  return (
    <PolarisFormCard
      step={4}
      title="Creator Studio & Upload Screen Customization"
      description="Customize upload modal copy (headline, subtitle, action cards), maximum video duration (up to 2 minutes), feed sharing rights, and AI labeling."
      badge="Creator Studio"
      badgeVariant="indigo"
      icon={Film}
    >
      <div className="space-y-4">
        {/* Quick Preview Switcher Buttons */}
        <div className="flex items-center justify-between pb-1 border-b border-[#e1e3e5]/70 dark:border-zinc-800/70">
          <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
            Upload Flow & Modal Customization
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-[#8c9196]">Preview:</span>
            <button
              type="button"
              onClick={() => onSelectPreviewTab("step1")}
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer",
                previewTab === "step1" ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-[#616161] dark:text-zinc-300"
              )}
            >
              Step 1 (Upload)
            </button>
            <button
              type="button"
              onClick={() => onSelectPreviewTab("step2")}
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer",
                previewTab === "step2" ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-[#616161] dark:text-zinc-300"
              )}
            >
              Step 2 (Trim)
            </button>
            <button
              type="button"
              onClick={() => onSelectPreviewTab("step3")}
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer",
                previewTab === "step3" ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-[#616161] dark:text-zinc-300"
              )}
            >
              Step 3 (Post)
            </button>
          </div>
        </div>

        {/* Subcard 1: Upload Modal Copy Customization */}
        <div className="p-3.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/40 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-[#e1e3e5]/70 dark:border-zinc-800/70">
            <div className="h-7 w-7 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Type className="h-3.5 w-3.5" />
            </div>
            <div>
              <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                Upload Modal Headline & Copy
              </span>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                Personalize the texts displayed to members on Step 1 of the upload workflow.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Upload Headline */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-200 flex items-center justify-between">
                <span>Modal Headline</span>
                <span className="text-[9.5px] text-[#8c9196]">(Default: &quot;Capture the {singularName}&quot;)</span>
              </label>
              <input
                type="text"
                name="momentsUploadTitle"
                placeholder={`Capture the ${singularName}`}
                value={formik.values.momentsUploadTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "text-[12px] h-8 px-2.5 rounded-[4px] border bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500",
                  formik.touched.momentsUploadTitle && formik.errors.momentsUploadTitle
                    ? "border-destructive focus:ring-destructive"
                    : "border-[#d2d5d9] dark:border-zinc-700"
                )}
              />
              {formik.touched.momentsUploadTitle && formik.errors.momentsUploadTitle && (
                <span className="text-[10px] text-destructive">{formik.errors.momentsUploadTitle}</span>
              )}
            </div>

            {/* Format Badge */}
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-200 flex items-center justify-between">
                <span>Video Aspect Ratio / Format</span>
                <span className="text-[9.5px] text-[#8c9196]">(Default: &quot;9:16&quot;)</span>
              </label>
              <input
                type="text"
                name="momentsUploadFormat"
                placeholder="9:16"
                value={formik.values.momentsUploadFormat}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "text-[12px] h-8 px-2.5 rounded-[4px] border bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono",
                  formik.touched.momentsUploadFormat && formik.errors.momentsUploadFormat
                    ? "border-destructive focus:ring-destructive"
                    : "border-[#d2d5d9] dark:border-zinc-700"
                )}
              />
            </div>
          </div>

          {/* Upload Subtitle / Description */}
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-200 flex items-center justify-between">
              <span>Modal Subtitle / Description</span>
              <span className="text-[9.5px] text-[#8c9196]">(Default: &quot;Share your story with the world in a vertical short-form video.&quot;)</span>
            </label>
            <input
              type="text"
              name="momentsUploadDescription"
              placeholder="Share your story with the world in a vertical short-form video."
              value={formik.values.momentsUploadDescription}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn(
                "text-[12px] h-8 px-2.5 rounded-[4px] border bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500",
                formik.touched.momentsUploadDescription && formik.errors.momentsUploadDescription
                  ? "border-destructive focus:ring-destructive"
                  : "border-[#d2d5d9] dark:border-zinc-700"
              )}
            />
            {formik.touched.momentsUploadDescription && formik.errors.momentsUploadDescription && (
              <span className="text-[10px] text-destructive">{formik.errors.momentsUploadDescription}</span>
            )}
          </div>

          {/* Action Card Titles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-200 flex items-center justify-between">
                <span>Action Card Title</span>
                <span className="text-[9.5px] text-[#8c9196]">(Default: &quot;Select from Library&quot;)</span>
              </label>
              <input
                type="text"
                name="momentsUploadCardTitle"
                placeholder="Select from Library"
                value={formik.values.momentsUploadCardTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="text-[12px] h-8 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-200 flex items-center justify-between">
                <span>Action Card Subtitle</span>
                <span className="text-[9.5px] text-[#8c9196]">(Default: &quot;Choose your best video or drag & drop here&quot;)</span>
              </label>
              <input
                type="text"
                name="momentsUploadCardDescription"
                placeholder="Choose your best video or drag & drop here"
                value={formik.values.momentsUploadCardDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="text-[12px] h-8 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Subcard 2: Duration Setting */}
        <div className="p-3.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Clock className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                  Maximum Video Duration
                </span>
                <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                  Set the maximum allowed clip duration for uploaded {singularName.toLowerCase()}s (Between 3s and 120s / 2 minutes).
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[9.5px] font-bold bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400">
              Max 120s
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70">
            <div className="flex items-center gap-2">
              <span className="text-[11.5px] font-medium text-[#303030] dark:text-zinc-200">
                Duration in Seconds:
              </span>
              <input
                type="number"
                name="momentsMaxDuration"
                min={3}
                max={120}
                value={formik.values.momentsMaxDuration}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "text-[12px] h-8 px-2.5 w-24 rounded-[4px] border bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                  formik.touched.momentsMaxDuration && formik.errors.momentsMaxDuration
                    ? "border-destructive text-destructive focus:ring-destructive"
                    : "border-[#d2d5d9] dark:border-zinc-700"
                )}
              />
              <span className="text-[11px] text-[#8c9196]">
                seconds ({formik.values.momentsMaxDuration > 60 ? (formik.values.momentsMaxDuration / 60).toFixed(1) + " mins" : formik.values.momentsMaxDuration + "s"})
              </span>
            </div>

            {/* Preset Buttons */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {[15, 30, 60, 90, 120].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => formik.setFieldValue("momentsMaxDuration", preset)}
                  className={cn(
                    "px-2 py-1 text-[10.5px] rounded-[3px] border font-medium transition-all cursor-pointer",
                    formik.values.momentsMaxDuration === preset
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                      : "bg-white dark:bg-zinc-800 border-[#d2d5d9] dark:border-zinc-700 text-[#616161] dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                  )}
                >
                  {preset}s {preset === 120 ? "(2m)" : ""}
                </button>
              ))}
            </div>
          </div>

          {formik.touched.momentsMaxDuration && formik.errors.momentsMaxDuration && (
            <div className="flex items-center gap-1.5 text-[11px] text-destructive font-medium pt-1">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
              <span>{formik.errors.momentsMaxDuration}</span>
            </div>
          )}
        </div>

        {/* Subcard 3: Share in Feed Settings Card */}
        <div className="p-3.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/40 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-[4px] bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/50 flex items-center justify-center text-sky-600 dark:text-sky-400 mt-0.5 shrink-0">
                <Send className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                    Allow &quot;Share in Feed&quot; Option
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                      formik.values.allowMomentsShareInFeed
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                        : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                    )}
                  >
                    {formik.values.allowMomentsShareInFeed ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                  Permits creators to choose whether their uploaded moment is published to the community feed.
                </p>
              </div>
            </div>
            <Switch
              checked={formik.values.allowMomentsShareInFeed}
              onCheckedChange={(checked) => formik.setFieldValue("allowMomentsShareInFeed", checked)}
            />
          </div>

          {formik.values.allowMomentsShareInFeed && (
            <div className="pt-2.5 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70 space-y-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-300">
                  Custom Option Title (Default: &quot;Share in Feed&quot;)
                </label>
                <input
                  type="text"
                  name="momentsShareInFeedTitle"
                  placeholder="Share in Feed"
                  value={formik.values.momentsShareInFeedTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-300">
                  Custom Option Subtitle (Default: &quot;Make this visible across your community feed&quot;)
                </label>
                <input
                  type="text"
                  name="momentsShareInFeedDescription"
                  placeholder="Make this visible across your community feed"
                  value={formik.values.momentsShareInFeedDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Subcard 4: Add AI Label Settings Card */}
        <div className="p-3.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/40 space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-2.5">
              <div className="h-7 w-7 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mt-0.5 shrink-0">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                    Allow &quot;Add AI Label&quot; Disclosure
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                      formik.values.allowMomentsAiLabel
                        ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400"
                        : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                    )}
                  >
                    {formik.values.allowMomentsAiLabel ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                  Allows creators to disclose and label synthetic AI-generated content on uploaded clips.
                </p>
              </div>
            </div>
            <Switch
              checked={formik.values.allowMomentsAiLabel}
              onCheckedChange={(checked) => formik.setFieldValue("allowMomentsAiLabel", checked)}
            />
          </div>

          {formik.values.allowMomentsAiLabel && (
            <div className="pt-2.5 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70 space-y-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-300">
                  Custom Option Title (Default: &quot;Add AI Label&quot;)
                </label>
                <input
                  type="text"
                  name="momentsAiLabelTitle"
                  placeholder="Add AI Label"
                  value={formik.values.momentsAiLabelTitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-300">
                  Custom Option Subtitle (Default: &quot;Label realistic content made with AI.&quot;)
                </label>
                <input
                  type="text"
                  name="momentsAiLabelDescription"
                  placeholder="Label realistic content made with AI."
                  value={formik.values.momentsAiLabelDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </PolarisFormCard>
  );
};

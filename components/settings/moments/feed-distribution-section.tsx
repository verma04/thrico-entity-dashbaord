"use client";

import React from "react";
import { FormikProps } from "formik";
import { Globe, Video, Rss, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { MomentsFormValues } from "./types";
import { cn } from "@/lib/utils";

interface FeedDistributionSectionProps {
  formik: FormikProps<MomentsFormValues>;
  moduleName: string;
  singularName: string;
  onPreviewFeed: () => void;
}

export const FeedDistributionSection: React.FC<FeedDistributionSectionProps> = ({
  formik,
  moduleName,
  singularName,
  onPreviewFeed,
}) => {
  return (
    <PolarisFormCard
      step={3}
      title="Central Feed & Platform Distribution"
      description="Control how short-form video clips appear across your organization's general feed."
      badge="Distribution"
      icon={Globe}
    >
      <div className="space-y-2.5">
        <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
          <div className="flex items-start gap-2.5">
            <div
              className={cn(
                "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                formik.values.enableShortUploads
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                  : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
              )}
            >
              <Video className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                  Enable Member Video Uploads
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                    formik.values.enableShortUploads
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                      : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                  )}
                >
                  {formik.values.enableShortUploads ? "Enabled" : "Disabled"}
                </Badge>
              </div>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                Allow registered community members to record, draft, and post {singularName.toLowerCase()} clips.
              </p>
            </div>
          </div>
          <Switch
            checked={formik.values.enableShortUploads}
            onCheckedChange={(val) => formik.setFieldValue("enableShortUploads", val)}
          />
        </div>

        {/* Surface in Main Feed */}
        <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
          <div className="flex items-start gap-2.5">
            <div
              className={cn(
                "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                formik.values.allowEntityMomentsInFeed
                  ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-900/50"
                  : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
              )}
            >
              <Rss className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                  Show {moduleName} in Central Feed
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                    formik.values.allowEntityMomentsInFeed
                      ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400"
                      : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                  )}
                >
                  {formik.values.allowEntityMomentsInFeed ? "Included" : "Excluded"}
                </Badge>
              </div>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                Embed playable {singularName.toLowerCase()} video tiles into the central community feed timeline.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPreviewFeed}
              className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
            >
              <Eye className="h-3 w-3" />
              <span>Preview Card</span>
            </button>
            <Switch
              checked={formik.values.allowEntityMomentsInFeed}
              onCheckedChange={(val) => formik.setFieldValue("allowEntityMomentsInFeed", val)}
            />
          </div>
        </div>
      </div>
    </PolarisFormCard>
  );
};

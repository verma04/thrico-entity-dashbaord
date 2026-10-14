"use client";

import React from "react";
import { FormikProps } from "formik";
import { Shield, ShieldCheck, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { MomentsFormValues } from "./types";
import { cn } from "@/lib/utils";

interface ModerationSectionProps {
  formik: FormikProps<MomentsFormValues>;
}

export const ModerationSection: React.FC<ModerationSectionProps> = ({ formik }) => {
  return (
    <PolarisFormCard
      step={5}
      title="Moderation & Quality Protocols"
      description="Configure automated safety checks and manual moderation gateways."
      badge="Moderation"
    >
      <div className="space-y-2.5">
        {/* Content Auto-Moderation */}
        <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
          <div className="flex items-start gap-2.5">
            <div
              className={cn(
                "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                formik.values.autoModeration
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                  : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                  Automated AI Safety Screening
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                    formik.values.autoModeration
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                  )}
                >
                  {formik.values.autoModeration ? "Active" : "Off"}
                </Badge>
              </div>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                Automatically screen uploaded clips against policy violations and copyright standards.
              </p>
            </div>
          </div>
          <Switch
            checked={formik.values.autoModeration}
            onCheckedChange={(val) => formik.setFieldValue("autoModeration", val)}
          />
        </div>

        {/* Moderated Feed Gate */}
        <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
          <div className="flex items-start gap-2.5">
            <div
              className={cn(
                "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                formik.values.moderatedFeed
                  ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50"
                  : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
              )}
            >
              <Shield className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                  Require Admin Approval Before Publishing
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                    formik.values.moderatedFeed
                      ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
                      : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                  )}
                >
                  {formik.values.moderatedFeed ? "Manual Queue" : "Instant"}
                </Badge>
              </div>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                Hold newly uploaded videos in a review queue before showing them to other members.
              </p>
            </div>
          </div>
          <Switch
            checked={formik.values.moderatedFeed}
            onCheckedChange={(val) => formik.setFieldValue("moderatedFeed", val)}
          />
        </div>

        {/* Upload Notifications */}
        <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
          <div className="flex items-start gap-2.5">
            <div
              className={cn(
                "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                formik.values.uploadNotifications
                  ? "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-900/50"
                  : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
              )}
            >
              <Bell className="h-3.5 w-3.5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                  Admin Upload Alerts
                </span>
              </div>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                Receive in-app and email notifications when members post new videos.
              </p>
            </div>
          </div>
          <Switch
            checked={formik.values.uploadNotifications}
            onCheckedChange={(val) => formik.setFieldValue("uploadNotifications", val)}
          />
        </div>
      </div>
    </PolarisFormCard>
  );
};

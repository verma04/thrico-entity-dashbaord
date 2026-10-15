"use client";

import React from "react";
import { FormikProps } from "formik";
import { Sliders, Eye, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import {
  ModuleTabManager,
  ModuleTabItem,
} from "@/components/settings/shared/module-tab-manager";
import { MomentsFormValues } from "./types";
import { cn } from "@/lib/utils";

interface NavigationTabsSectionProps {
  formik: FormikProps<MomentsFormValues>;
  singularName: string;
  onPreviewNavbar: () => void;
  onAddCustomTab: () => void;
  onCurateTab: (tabId: string) => void;
  onDeleteCustomTab: (tabId: string) => void;
}

export const NavigationTabsSection: React.FC<NavigationTabsSectionProps> = ({
  formik,
  singularName,
  onPreviewNavbar,
  onAddCustomTab,
  onCurateTab,
  onDeleteCustomTab,
}) => {
  const handleTabsChange = (updatedTabs: ModuleTabItem[]) => {
    formik.setFieldValue("tabs", updatedTabs);
  };

  return (
    <PolarisFormCard
      step={1}
      title="Navigation Tabs & CTA Customization"
      description="Manage member navigation tabs. Reorder tabs, rename default tabs, or add new custom tabs with your own curated moment clips."
      badge="Navigation"
      badgeVariant="emerald"
      icon={Sliders}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-1">
          <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
            Tabs & Header Actions
          </span>
          <button
            type="button"
            onClick={onPreviewNavbar}
            className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
          >
            <Eye className="h-3 w-3" />
            <span>Preview Nav Bar</span>
          </button>
        </div>

        <ModuleTabManager
          tabs={formik.values.tabs}
          onChange={handleTabsChange}
          onAddCustomTab={onAddCustomTab}
          onCurateMoments={onCurateTab}
          onDeleteCustomTab={onDeleteCustomTab}
        />

        {/* Primary CTA Button Label Customization */}
        <div className="p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/40 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-[4px] bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Plus className="h-3.5 w-3.5 stroke-[2.5px]" />
              </div>
              <div>
                <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                  Primary CTA Button Name
                </span>
                <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                  Customize the button label used across the member header to
                  initiate uploads.
                </p>
              </div>
            </div>
            <Badge variant="outline" className="text-[9.5px] font-bold">
              Header Action
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70">
            <span className="text-[11px] text-[#616161] dark:text-zinc-400">
              Button Text:{" "}
              <span className="text-[10px] text-[#8c9196]">
                (Default: &quot;Create {singularName}&quot;)
              </span>
            </span>
            <div className="flex flex-col w-full sm:w-[240px]">
              <input
                type="text"
                name="ctaName"
                placeholder={`Create ${singularName}`}
                value={formik.values.ctaName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "text-[12px] h-7 px-2.5 rounded-[4px] border bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500",
                  formik.touched.ctaName && formik.errors.ctaName
                    ? "border-destructive focus:ring-destructive"
                    : "border-[#d2d5d9] dark:border-zinc-700",
                )}
              />
              {formik.touched.ctaName && formik.errors.ctaName && (
                <span className="text-[10.5px] text-destructive mt-0.5">
                  {formik.errors.ctaName}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </PolarisFormCard>
  );
};

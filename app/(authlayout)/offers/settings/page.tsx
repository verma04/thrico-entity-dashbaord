"use client";

import React, { useState, useEffect } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import {
  Percent,
  Zap,
  Sparkles,
  CheckCircle2,
  Tag,
  ShieldCheck,
  Gift,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  PolarisFormLayout,
  PolarisFormCard,
  PolarisSidebarCard,
  PolarisSummaryRow,
  PolarisTipCard,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";
import { cn } from "@/lib/utils";

interface OffersSettingsState {
  allowOffers: boolean;
  autoApproveOffers: boolean;
  aiModerationOffers: boolean;
}

function OffersSettings() {
  const moduleName = useModuleStore((state) => state.offerModuleName);
  const singularName = useModuleStore((state) => state.offerSingularName);

  const { data, loading, refetch } = useEntitySettings();
  const [update, { loading: isSaving }] = useUpdateEntitySettings({});

  const initialSettings: OffersSettingsState = {
    allowOffers: data?.getEntitySettings?.allowOffers ?? true,
    autoApproveOffers: data?.getEntitySettings?.autoApproveOffers ?? false,
    aiModerationOffers: data?.getEntitySettings?.aiModerationOffers ?? true,
  };

  const [formData, setFormData] = useState<OffersSettingsState>(initialSettings);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data?.getEntitySettings) {
      setFormData({
        allowOffers: data.getEntitySettings.allowOffers ?? true,
        autoApproveOffers: data.getEntitySettings.autoApproveOffers ?? false,
        aiModerationOffers: data.getEntitySettings.aiModerationOffers ?? true,
      });
      setHasChanged(false);
    }
  }, [data]);

  const handleToggle = (key: keyof OffersSettingsState) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setHasChanged(true);
      return next;
    });
  };

  const handleReset = () => {
    if (data?.getEntitySettings) {
      setFormData({
        allowOffers: data.getEntitySettings.allowOffers ?? true,
        autoApproveOffers: data.getEntitySettings.autoApproveOffers ?? false,
        aiModerationOffers: data.getEntitySettings.aiModerationOffers ?? true,
      });
      setHasChanged(false);
    }
  };

  const handleSave = async () => {
    try {
      await update({
        variables: {
          input: {
            allowOffers: formData.allowOffers,
            autoApproveOffers: formData.autoApproveOffers,
            aiModerationOffers: formData.aiModerationOffers,
          },
        },
      });
      toast.success(`${moduleName} settings synchronized successfully.`);
      setHasChanged(false);
      refetch?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to update ${moduleName.toLowerCase()} configuration.`);
    }
  };

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Governance Preview Card */}
            <PolarisSidebarCard
              title={`${moduleName} Framework`}
              badge="Directory State"
              icon={Sparkles}
            >
              <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
                      <Gift className="h-3 w-3" />
                    </div>
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      {singularName} Gateway
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9.5px] font-bold gap-1 px-1.5 py-0 rounded-[3px]",
                      formData.allowOffers
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
                    )}
                  >
                    {formData.allowOffers ? "Active" : "Paused"}
                  </Badge>
                </div>

                {/* Status breakdown */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Submission Access:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.allowOffers ? "Open to Members" : "Admin Only"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Validation Mode:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.autoApproveOffers ? "Instant (Live)" : "Manual Verification"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>AI Moderation:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.aiModerationOffers ? "Active Sentinel" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Rows */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Perk Creation"
                  value={formData.allowOffers ? "Permitted" : "Paused"}
                  highlight={formData.allowOffers}
                />
                <PolarisSummaryRow
                  label="Publishing Mode"
                  value={formData.autoApproveOffers ? "Direct Live" : "Review Required"}
                />
                <PolarisSummaryRow
                  label="AI Sentinel"
                  value={formData.aiModerationOffers ? "Protected" : "Bypassed"}
                  highlight={formData.aiModerationOffers}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Tip Card */}
            <PolarisTipCard title={`${singularName} Verification Tip`}>
              Direct publishing speeds up time-sensitive promotions. Enabling AI Moderation ensures
              discount codes and partner promotions conform to truth-in-advertising guidelines.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-3.5">
          {/* Section 1: Activation & Creation Gateway */}
          <PolarisFormCard
            step={1}
            title="Publication & Creation Policy"
            description={`Enable or disable the ability for members and partners to submit new ${singularName.toLowerCase()} deals.`}
            badge="Access"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.allowOffers
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                  )}
                >
                  <Tag className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Allow Member {singularName} Postings
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.allowOffers
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                      )}
                    >
                      {formData.allowOffers ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    When active, members and partners can publish exclusive discount codes, vouchers, and perks.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.allowOffers}
                onCheckedChange={() => handleToggle("allowOffers")}
              />
            </div>
          </PolarisFormCard>

          {/* Section 2: Automated Validation */}
          <PolarisFormCard
            step={2}
            title="Validation & Approval Protocols"
            description={`Configure automated moderation protocols for newly submitted ${moduleName.toLowerCase()}.`}
            badge="Automation"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.autoApproveOffers
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                  )}
                >
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Auto Approve New {moduleName}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.autoApproveOffers
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                      )}
                    >
                      {formData.autoApproveOffers ? "Instant" : "Manual"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Instantly publish discount deals to the perks directory without
                    requiring manual review from an administrator.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.autoApproveOffers}
                onCheckedChange={() => handleToggle("autoApproveOffers")}
              />
            </div>
          </PolarisFormCard>

          {/* Section 3: AI Safety Sentinel */}
          <PolarisFormCard
            step={3}
            title="AI Moderation Sentinel"
            description="Autonomous natural language and deal verification for member discount postings."
            badge="AI Safety"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.aiModerationOffers
                      ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                  )}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      AI Offer & Perk Moderation
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.aiModerationOffers
                          ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                      )}
                    >
                      {formData.aiModerationOffers ? "Active Sentinel" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Automatically analyze discount titles, promotional copy, and destination links using AI to prevent deceptive promotions or spam.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.aiModerationOffers}
                onCheckedChange={() => handleToggle("aiModerationOffers")}
              />
            </div>
          </PolarisFormCard>
        </div>

        {/* Floating Save Action Bar */}
        <FloatingSavePanel
          hasChanged={hasChanged}
          saved={false}
          isSaving={isSaving}
          onSave={handleSave}
          onReset={handleReset}
          title={`Save ${moduleName} Settings`}
          description={`You have unsaved changes to ${singularName.toLowerCase()} perk parameters.`}
          buttonText="Save Settings"
        />
      </PolarisFormLayout>
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(OffersSettings, "OFFERS", "canEdit"),
  "offers",
);

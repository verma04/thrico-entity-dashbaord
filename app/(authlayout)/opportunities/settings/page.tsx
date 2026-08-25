"use client";

import React, { useState, useEffect } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import {
  Briefcase,
  Zap,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  FileCheck,
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
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemContainer } from "@/components/layout/ecosystem/ecosystem-container";
import { cn } from "@/lib/utils";

interface OpportunitiesSettingsState {
  allowOpportunities: boolean;
  autoApproveOpportunities: boolean;
}

function OpportunitiesSettingsPage() {
  const moduleName = "Opportunities";
  const singularName = "Opportunity";

  const { data, loading, refetch } = useEntitySettings();
  const [update, { loading: isSaving }] = useUpdateEntitySettings({});

  const initialSettings: OpportunitiesSettingsState = {
    allowOpportunities: data?.getEntitySettings?.allowOpportunities ?? true,
    autoApproveOpportunities:
      data?.getEntitySettings?.autoApproveOpportunities ?? false,
  };

  const [formData, setFormData] =
    useState<OpportunitiesSettingsState>(initialSettings);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data?.getEntitySettings) {
      setFormData({
        allowOpportunities:
          data.getEntitySettings.allowOpportunities ?? true,
        autoApproveOpportunities:
          data.getEntitySettings.autoApproveOpportunities ?? false,
      });
      setHasChanged(false);
    }
  }, [data]);

  const handleToggle = (key: keyof OpportunitiesSettingsState) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setHasChanged(true);
      return next;
    });
  };

  const handleReset = () => {
    if (data?.getEntitySettings) {
      setFormData({
        allowOpportunities:
          data.getEntitySettings.allowOpportunities ?? true,
        autoApproveOpportunities:
          data.getEntitySettings.autoApproveOpportunities ?? false,
      });
      setHasChanged(false);
    }
  };

  const handleSave = async () => {
    try {
      await update({
        variables: {
          input: {
            allowOpportunities: formData.allowOpportunities,
            autoApproveOpportunities: formData.autoApproveOpportunities,
          },
        },
      });
      toast.success(`${singularName} settings synchronized successfully.`);
      setHasChanged(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || `Failed to update ${singularName.toLowerCase()} settings.`);
    }
  };

  return (
    <EcosystemWrapper>
      <EcosystemHeader
        title={`${moduleName} Framework`}
        description={`Moderate interactions and configure the ${singularName.toLowerCase()} engine for your ecosystem.`}
        badgeText="Global Engine"
        icon={Briefcase}
        breadcrumbs={[
          { label: "Opportunities", href: "/opportunities/all" },
          { label: "Settings" },
        ]}
      />
      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <PolarisFormLayout
          sidebar={
            <div className="space-y-4">
              {/* Live Governance Preview Card */}
              <PolarisSidebarCard
                title={`${singularName} Protocols`}
                badge="Engine State"
                icon={Sparkles}
              >
                <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
                        <Briefcase className="h-3 w-3" />
                      </div>
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        {singularName} Gateway
                      </span>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9.5px] font-bold gap-1 px-1.5 py-0 rounded-[3px]",
                        formData.allowOpportunities
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                          : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
                      )}
                    >
                      {formData.allowOpportunities ? "Active" : "Paused"}
                    </Badge>
                  </div>

                  {/* Status breakdown */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-[#616161]">
                      <span>Member Submissions:</span>
                      <span className="font-semibold text-[#303030] dark:text-zinc-200">
                        {formData.allowOpportunities ? "Open" : "Restricted"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#616161]">
                      <span>Publishing Mode:</span>
                      <span className="font-semibold text-[#303030] dark:text-zinc-200">
                        {formData.autoApproveOpportunities ? "Instant (Live)" : "Manual Review"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary Rows */}
                <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                  <PolarisSummaryRow
                    label="Posting Access"
                    value={formData.allowOpportunities ? "Permitted" : "Paused"}
                    highlight={formData.allowOpportunities}
                  />
                  <PolarisSummaryRow
                    label="Verification Mode"
                    value={formData.autoApproveOpportunities ? "Auto-Approved" : "Manual Moderation"}
                    isLast
                  />
                </div>
              </PolarisSidebarCard>

              {/* Tip Card */}
              <PolarisTipCard title={`${singularName} Strategy Tip`}>
                Allowing members to submit collaboration opportunities and proposals
                boosts ecosystem activity. Use manual moderation to verify partner credibility.
              </PolarisTipCard>
            </div>
          }
        >
          <div className="space-y-3.5">
            {/* Section 1: Engagement & Posting Gateway */}
            <PolarisFormCard
              step={1}
              title="Engagement & Posting Policy"
              description={`Enable or disable the ability for ecosystem participants to create new ${singularName.toLowerCase()} posts.`}
              badge="Access"
            >
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.allowOpportunities
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                        : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                    )}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Allow {singularName} Posts
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                          formData.allowOpportunities
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formData.allowOpportunities ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      When active, members can share partnership proposals, grants, and collaboration
                      calls.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.allowOpportunities}
                  onCheckedChange={() => handleToggle("allowOpportunities")}
                />
              </div>
            </PolarisFormCard>

            {/* Section 2: Automation Protocols */}
            <PolarisFormCard
              step={2}
              title="Automation & Validation Protocols"
              description={`Configure automated publishing protocols for newly posted ${singularName.toLowerCase()} items.`}
              badge="Automation"
            >
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.autoApproveOpportunities
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                        : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                    )}
                  >
                    <Zap className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Auto Approve {singularName} Posts
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                          formData.autoApproveOpportunities
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formData.autoApproveOpportunities ? "Instant" : "Manual"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Automatically publish proposals directly to the opportunity stream without
                      pre-moderation delays.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.autoApproveOpportunities}
                  onCheckedChange={() => handleToggle("autoApproveOpportunities")}
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
            title={`Save ${singularName} Settings`}
            description={`You have unsaved changes to ${singularName.toLowerCase()} framework parameters.`}
            buttonText="Save Settings"
          />
        </PolarisFormLayout>
      </EcosystemContainer>
    </EcosystemWrapper>
  );
}

export default withSubscriptionCheck(
  withModulePermission(OpportunitiesSettingsPage, "OPPORTUNITIES", "canEdit"),
  "opportunities",
);

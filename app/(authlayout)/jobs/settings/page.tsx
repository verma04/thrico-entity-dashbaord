"use client";

import React, { useState, useEffect } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import {
  Briefcase,
  Zap,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Building2,
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

interface JobsSettingsState {
  allowJobs: boolean;
  autoApproveJobs: boolean;
  aiModerationJobs: boolean;
}

function JobsSettings() {
  const moduleName = useModuleStore((state) => state.jobModuleName);
  const singularName = useModuleStore((state) => state.jobSingularName);

  const { data, loading, refetch } = useEntitySettings();
  const [update, { loading: isSaving }] = useUpdateEntitySettings({});

  const initialSettings: JobsSettingsState = {
    allowJobs: data?.getEntitySettings?.allowJobs ?? true,
    autoApproveJobs: data?.getEntitySettings?.autoApproveJobs ?? false,
    aiModerationJobs: data?.getEntitySettings?.aiModerationJobs ?? true,
  };

  const [formData, setFormData] = useState<JobsSettingsState>(initialSettings);
  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data?.getEntitySettings) {
      setFormData({
        allowJobs: data.getEntitySettings.allowJobs ?? true,
        autoApproveJobs: data.getEntitySettings.autoApproveJobs ?? false,
        aiModerationJobs: data.getEntitySettings.aiModerationJobs ?? true,
      });
      setHasChanged(false);
    }
  }, [data]);

  const handleToggle = (key: keyof JobsSettingsState) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setHasChanged(true);
      return next;
    });
  };

  const handleReset = () => {
    if (data?.getEntitySettings) {
      setFormData({
        allowJobs: data.getEntitySettings.allowJobs ?? true,
        autoApproveJobs: data.getEntitySettings.autoApproveJobs ?? false,
        aiModerationJobs: data.getEntitySettings.aiModerationJobs ?? true,
      });
      setHasChanged(false);
    }
  };

  const handleSave = async () => {
    try {
      await update({
        variables: {
          input: {
            allowJobs: formData.allowJobs,
            autoApproveJobs: formData.autoApproveJobs,
            aiModerationJobs: formData.aiModerationJobs,
          },
        },
      });
      toast.success(`${moduleName} settings synchronized successfully.`);
      setHasChanged(false);
      refetch();
    } catch (error: any) {
      toast.error(error.message || `Failed to update ${moduleName.toLowerCase()} settings.`);
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
                      {singularName} Board
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9.5px] font-bold gap-1 px-1.5 py-0 rounded-[3px]",
                      formData.allowJobs
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
                    )}
                  >
                    {formData.allowJobs ? "Active" : "Paused"}
                  </Badge>
                </div>

                {/* Status breakdown */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Submission Access:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.allowJobs ? "Open to Employers" : "Admin Only"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Publishing Mode:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.autoApproveJobs ? "Instant (Live)" : "Manual Verification"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>AI Moderation:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.aiModerationJobs ? "Active Sentinel" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary Rows */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Posting Gateway"
                  value={formData.allowJobs ? "Permitted" : "Paused"}
                  highlight={formData.allowJobs}
                />
                <PolarisSummaryRow
                  label="Validation Gateway"
                  value={formData.autoApproveJobs ? "Direct Live" : "Review Required"}
                />
                <PolarisSummaryRow
                  label="AI Sentinel"
                  value={formData.aiModerationJobs ? "Protected" : "Bypassed"}
                  highlight={formData.aiModerationJobs}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Tip Card */}
            <PolarisTipCard title={`${singularName} Board Tip`}>
              Encouraging hiring posts connects community talent. With AI moderation enabled,
              job listings are automatically screened for spam, predatory compensation, and illegitimate recruiters.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-3.5">
          {/* Section 1: Activation & Creation Gateway */}
          <PolarisFormCard
            step={1}
            title="Posting & Access Policy"
            description={`Enable or disable the ability for members and recruiters to post new ${singularName.toLowerCase()} openings.`}
            badge="Access"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.allowJobs
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                  )}
                >
                  <FileCheck className="h-3.5 w-3.5" />
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
                        formData.allowJobs
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                      )}
                    >
                      {formData.allowJobs ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    When active, members can publish hiring opportunities, contract gigs, and open roles to your board.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.allowJobs}
                onCheckedChange={() => handleToggle("allowJobs")}
              />
            </div>
          </PolarisFormCard>

          {/* Section 2: Automated Verification */}
          <PolarisFormCard
            step={2}
            title="Validation & Approval Engines"
            description={`Configure automated moderation protocols for newly submitted ${moduleName.toLowerCase()}.`}
            badge="Automation"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.autoApproveJobs
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
                        formData.autoApproveJobs
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                      )}
                    >
                      {formData.autoApproveJobs ? "Auto" : "Manual"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Instantly publish job listings to the career board without
                    requiring manual review from an administrator.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.autoApproveJobs}
                onCheckedChange={() => handleToggle("autoApproveJobs")}
              />
            </div>
          </PolarisFormCard>

          {/* Section 3: AI Safety Sentinel */}
          <PolarisFormCard
            step={3}
            title="AI Moderation Sentinel"
            description="Autonomous natural language screening for job listings and recruiter requirements."
            badge="AI Safety"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.aiModerationJobs
                      ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                  )}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      AI Job Posting Moderation
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.aiModerationJobs
                          ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                      )}
                    >
                      {formData.aiModerationJobs ? "Active Sentinel" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Automatically analyze job titles, job descriptions, and compensation terms with AI to screen out phishing, illegitimate opportunities, and offensive conditions.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.aiModerationJobs}
                onCheckedChange={() => handleToggle("aiModerationJobs")}
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
          description={`You have unsaved changes to ${moduleName.toLowerCase()} marketplace parameters.`}
          buttonText="Save Settings"
        />
      </PolarisFormLayout>
    </div>
  );
}

export default withModulePermission(JobsSettings, "JOBS", "canUpdate");

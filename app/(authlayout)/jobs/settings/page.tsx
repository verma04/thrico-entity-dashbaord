"use client";

import React, { useState, useEffect } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { EntitySettings } from "@/graphql/actions/settings";
import {
  Briefcase,
  Zap,
  Sparkles,
  CheckCircle2,
  FileCheck,
  Building2,
  ShieldCheck,
  Sliders,
  Layers,
  Plus,
  Compass,
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
import {
  ModuleTabManager,
  ModuleTabItem,
} from "@/components/settings/shared/module-tab-manager";
import { toast } from "sonner";
import { useModuleStore } from "@/store/useModuleStore";
import { cn } from "@/lib/utils";

interface JobsSettingsState {
  allowJobs: boolean;
  autoApproveJobs: boolean;
  aiModerationJobs: boolean;
}

const DEFAULT_SETTINGS: JobsSettingsState = {
  allowJobs: true,
  autoApproveJobs: false,
  aiModerationJobs: true,
};

const createDefaultTabs = (
  moduleName: string,
  singularName: string,
  entitySettings?: EntitySettings
): ModuleTabItem[] => {
  const tabNames = (entitySettings?.jobsTabNames as Record<string, string>) || {};
  const tabOrder = (entitySettings?.jobsTabOrder as string[]) || [
    "discover",
    "myJobs",
    "applied",
  ];
  const allowMyJobs = entitySettings?.allowJobsMyJobsTab ?? true;
  const allowApplied = entitySettings?.allowJobsAppliedTab ?? true;

  const baseMap: Record<string, ModuleTabItem> = {
    discover: {
      id: "discover",
      key: "allowJobsDiscoverTab",
      defaultName: "Discover",
      label: tabNames["discover"] || "",
      description: `Browse available careers, postings, and talent openings.`,
      icon: Compass,
      canHide: false, // Discover tab CANNOT be hidden
      enabled: true,
    },
    myJobs: {
      id: "myJobs",
      key: "allowJobsMyJobsTab",
      defaultName: `My ${moduleName}`,
      label: tabNames["myJobs"] || "",
      description: `Manage ${moduleName.toLowerCase()} posted by the member or company.`,
      icon: Briefcase,
      canHide: true,
      enabled: allowMyJobs,
    },
    applied: {
      id: "applied",
      key: "allowJobsAppliedTab",
      defaultName: "Applied",
      label: tabNames["applied"] || "",
      description: `Track submitted applications and interview review statuses.`,
      icon: FileCheck,
      canHide: true,
      enabled: allowApplied,
    },
  };

  const ordered: ModuleTabItem[] = [];
  tabOrder.forEach((id) => {
    if (baseMap[id]) ordered.push(baseMap[id]);
  });
  Object.keys(baseMap).forEach((id) => {
    if (!ordered.find((t) => t.id === id)) {
      ordered.push(baseMap[id]);
    }
  });

  return ordered;
};

function JobsSettings() {
  const moduleName = useModuleStore((state) => state.jobModuleName);
  const singularName = useModuleStore((state) => state.jobSingularName);

  const { data, loading, refetch } = useEntitySettings();
  const [update, { loading: isSaving }] = useUpdateEntitySettings({});

  const [formData, setFormData] = useState<JobsSettingsState>(() => ({
    allowJobs: data?.getEntitySettings?.allowJobs ?? true,
    autoApproveJobs: data?.getEntitySettings?.autoApproveJobs ?? false,
    aiModerationJobs: data?.getEntitySettings?.aiModerationJobs ?? true,
  }));

  const [tabs, setTabs] = useState<ModuleTabItem[]>(() =>
    createDefaultTabs(moduleName, singularName, data?.getEntitySettings)
  );

  const [ctaName, setCtaName] = useState<string>(
    data?.getEntitySettings?.jobsCtaName || ""
  );

  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data?.getEntitySettings) {
      setFormData({
        allowJobs: data.getEntitySettings.allowJobs ?? true,
        autoApproveJobs: data.getEntitySettings.autoApproveJobs ?? false,
        aiModerationJobs: data.getEntitySettings.aiModerationJobs ?? true,
      });
      setTabs(createDefaultTabs(moduleName, singularName, data.getEntitySettings));
      setCtaName(data.getEntitySettings.jobsCtaName || "");
      setHasChanged(false);
    }
  }, [data, moduleName, singularName]);

  const handleToggle = (key: keyof JobsSettingsState) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      setHasChanged(true);
      return next;
    });
  };

  const handleTabsChange = (updatedTabs: ModuleTabItem[]) => {
    setTabs(updatedTabs);
    setHasChanged(true);
  };

  const handleCtaNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCtaName(e.target.value);
    setHasChanged(true);
  };

  const handleReset = () => {
    if (data?.getEntitySettings) {
      setFormData({
        allowJobs: data.getEntitySettings.allowJobs ?? true,
        autoApproveJobs: data.getEntitySettings.autoApproveJobs ?? false,
        aiModerationJobs: data.getEntitySettings.aiModerationJobs ?? true,
      });
      setTabs(createDefaultTabs(moduleName, singularName, data.getEntitySettings));
      setCtaName(data.getEntitySettings.jobsCtaName || "");
      setHasChanged(false);
    }
  };

  const handleSave = async () => {
    try {
      if (data?.getEntitySettings) {
        const jobsTabNames: Record<string, string> = {};
        tabs.forEach((t) => {
          if (t.label && t.label.trim()) {
            jobsTabNames[t.id] = t.label.trim();
          }
        });

        const myJobsTab = tabs.find((t) => t.id === "myJobs");
        const appliedTab = tabs.find((t) => t.id === "applied");

        await update({
          variables: {
            input: {
              allowJobs: formData.allowJobs,
              autoApproveJobs: formData.autoApproveJobs,
              aiModerationJobs: formData.aiModerationJobs,
              allowJobsDiscoverTab: true,
              allowJobsMyJobsTab: myJobsTab ? myJobsTab.enabled : true,
              allowJobsAppliedTab: appliedTab ? appliedTab.enabled : true,
              jobsTabNames,
              jobsTabOrder: tabs.map((t) => t.id),
              jobsCtaName: ctaName.trim() || null,
            },
          },
        });
      }
      toast.success(`${moduleName} settings synchronized successfully.`);
      setHasChanged(false);
      refetch?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to update ${moduleName.toLowerCase()} settings.`);
    }
  };

  const activeTabs = tabs.filter((t) => t.enabled);

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Live Navigation Tabs Preview */}
            <PolarisSidebarCard
              title="Navigation Bar Preview"
              badge="Live View"
              icon={Sliders}
            >
              <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-3 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
                  <div className="flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                    <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
                      Member Tab Strip
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className="text-[9px] font-bold px-1.5 py-0 rounded-[3px] bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                  >
                    {activeTabs.length} of {tabs.length} Visible
                  </Badge>
                </div>

                {/* Tabs Preview Pills */}
                <div className="space-y-1.5">
                  {activeTabs.map((tab, idx) => {
                    const TabIcon = tab.icon;
                    return (
                      <div
                        key={tab.id}
                        className={cn(
                          "flex items-center justify-between px-2.5 py-1.5 rounded-[4px] border text-[11.5px] transition-all",
                          idx === 0
                            ? "bg-white dark:bg-zinc-800 border-indigo-300 dark:border-indigo-700 font-semibold text-indigo-700 dark:text-indigo-300 shadow-2xs"
                            : "bg-white/60 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700/60 text-[#616161] dark:text-zinc-300"
                        )}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <TabIcon className="h-3 w-3 shrink-0" />
                          <span className="truncate">
                            {tab.label || tab.defaultName}
                          </span>
                        </div>
                        {idx === 0 && (
                          <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-500 shrink-0 ml-1">
                            Default
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Primary CTA Button Preview */}
                <div className="pt-2 border-t border-[#e1e3e5] dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[11px] text-[#616161] dark:text-zinc-400">
                    Action Button:
                  </span>
                  <div className="inline-flex items-center gap-1 px-2 py-1 rounded-[4px] bg-indigo-600 text-white text-[10.5px] font-medium shadow-2xs">
                    <Plus className="h-3 w-3 stroke-[2.5px]" />
                    <span>{ctaName || `Post a ${singularName}`}</span>
                  </div>
                </div>
              </div>

              {/* Summary Rows */}
              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Discover Tab"
                  value="Always Active"
                  highlight
                />
                <PolarisSummaryRow
                  label="My Jobs Tab"
                  value={tabs.find((t) => t.id === "myJobs")?.enabled ? "Visible" : "Hidden"}
                />
                <PolarisSummaryRow
                  label="Applied Tab"
                  value={tabs.find((t) => t.id === "applied")?.enabled ? "Visible" : "Hidden"}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Live Governance Preview Card */}
            <PolarisSidebarCard
              title="Opportunity Protocol"
              badge="Network State"
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
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30"
                    )}
                  >
                    {formData.allowJobs ? "Active" : "Closed"}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Posting Rights:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.allowJobs ? "Open to Members" : "Admin Only"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Publishing Protocol:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.autoApproveJobs ? "Instant (Live)" : "Manual Review"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>AI Safety:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.aiModerationJobs ? "Active Sentinel" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Member Submissions"
                  value={formData.allowJobs ? "Permitted" : "Restricted"}
                  highlight={formData.allowJobs}
                />
                <PolarisSummaryRow
                  label="Review Pipeline"
                  value={formData.autoApproveJobs ? "Automated" : "Verification Required"}
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
            <PolarisTipCard title="Recruitment Strategy Tip">
              The <strong>Discover</strong> tab cannot be hidden, giving candidates instant access to openings. Tailor the tab labels to match your career hub identity.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-3.5">
          {/* Section 1: Navigation Tabs & CTA Configuration */}
          <PolarisFormCard
            step={1}
            title="Navigation Tabs & CTA Customization"
            description={`Configure candidate navigation tabs (Discover is locked on; My ${moduleName} and Applied can be hidden). Reorder and rename tabs to match your job portal taxonomy.`}
            badge="Navigation"
            badgeVariant="emerald"
            icon={Sliders}
          >
            <div className="space-y-4">
              {/* Reusable Tab Manager Component */}
              <ModuleTabManager tabs={tabs} onChange={handleTabsChange} />

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
                        Customize the button label used across the member header to post a new job vacancy.
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9.5px] font-bold">
                    Header Action
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70">
                  <span className="text-[11px] text-[#616161] dark:text-zinc-400">
                    Button Text: <span className="text-[10px] text-[#8c9196]">(Default: &quot;Post a {singularName}&quot;)</span>
                  </span>
                  <input
                    type="text"
                    placeholder={`Post a ${singularName}`}
                    value={ctaName}
                    onChange={handleCtaNameChange}
                    className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full sm:w-[240px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </PolarisFormCard>

          {/* Section 2: Posting Access Policy */}
          <PolarisFormCard
            step={2}
            title="Posting Access Policy"
            description={`Configure permissions for member-initiated ${moduleName.toLowerCase()} postings.`}
            badge="Permissions"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.allowJobs
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
                  )}
                >
                  <Building2 className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Allow Member Job Postings
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.allowJobs
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                      )}
                    >
                      {formData.allowJobs ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    When active, registered members and partner entities can submit job openings to the community directory.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.allowJobs}
                onCheckedChange={() => handleToggle("allowJobs")}
              />
            </div>
          </PolarisFormCard>

          {/* Section 3: Verification Protocols */}
          <PolarisFormCard
            step={3}
            title="Verification Protocols"
            description={`Determine whether submitted ${moduleName.toLowerCase()} require admin review before going live.`}
            badge="Verification"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.autoApproveJobs
                      ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
                  )}
                >
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Auto-Approve New {moduleName}
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.autoApproveJobs
                          ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                      )}
                    >
                      {formData.autoApproveJobs ? "Instant" : "Manual"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Instantly publish newly posted {moduleName.toLowerCase()} without requiring administrative verification.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.autoApproveJobs}
                onCheckedChange={() => handleToggle("autoApproveJobs")}
              />
            </div>
          </PolarisFormCard>

          {/* Section 4: AI Safety Sentinel */}
          <PolarisFormCard
            step={4}
            title="AI Moderation Sentinel"
            description={`Autonomous inspection of compensation claims, requirements, and employer descriptions.`}
            badge="AI Safety"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.aiModerationJobs
                      ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
                  )}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      AI Job Content Moderation
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.aiModerationJobs
                          ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                      )}
                    >
                      {formData.aiModerationJobs ? "Active Sentinel" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Scan job descriptions for non-compliant compensation structures, prohibited terms, and deceptive listings.
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
          description={`You have unsaved changes to ${moduleName.toLowerCase()} settings.`}
          buttonText="Save Settings"
        />
      </PolarisFormLayout>
    </div>
  );
}

export default withModulePermission(JobsSettings, "Jobs");

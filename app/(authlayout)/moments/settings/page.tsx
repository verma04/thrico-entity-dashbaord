"use client";

import React, { useState, useEffect } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import {
  EntitySettings,
  useEntitySettings,
  useUpdateEntitySettings,
} from "@/graphql/actions";
import {
  Globe,
  Video,
  Bell,
  Shield,
  ShieldCheck,
  PlaySquare,
  Rss,
  Compass,
  Users,
  Plus,
  Sliders,
  Layers,
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

interface MomentsSettingsState {
  allowPublicMoments: boolean;
  enableShortUploads: boolean;
  allowEntityMomentsInFeed: boolean;
  uploadNotifications: boolean;
  autoModeration: boolean;
  moderatedFeed: boolean;
}

const DEFAULT_SETTINGS: MomentsSettingsState = {
  allowPublicMoments: true,
  enableShortUploads: true,
  allowEntityMomentsInFeed: true,
  uploadNotifications: false,
  autoModeration: true,
  moderatedFeed: false,
};

const createDefaultTabs = (
  moduleName: string,
  singularName: string,
  entitySettings?: EntitySettings
): ModuleTabItem[] => {
  const tabNames = (entitySettings?.momentsTabNames as Record<string, string>) || {};
  const tabOrder = (entitySettings?.momentsTabOrder as string[]) || [
    "discover",
    "connections",
    "myMoments",
  ];
  const allowConnections = entitySettings?.allowMomentsConnectionsTab ?? true;
  const allowMyMoments = entitySettings?.allowMomentsMyMomentsTab ?? true;

  const baseMap: Record<string, ModuleTabItem> = {
    discover: {
      id: "discover",
      key: "allowMomentsDiscoverTab",
      defaultName: "Discover",
      label: tabNames["discover"] || "",
      description: `Personalized public feed and trending ${singularName.toLowerCase()} clips.`,
      icon: Compass,
      canHide: false, // Discover tab CANNOT be hidden
      enabled: true,
    },
    connections: {
      id: "connections",
      key: "allowMomentsConnectionsTab",
      defaultName: "Connections Moment",
      label: tabNames["connections"] || "",
      description: `Updates and highlights posted exclusively by mutual connections.`,
      icon: Users,
      canHide: true,
      enabled: allowConnections,
    },
    myMoments: {
      id: "myMoments",
      key: "allowMomentsMyMomentsTab",
      defaultName: `My ${moduleName}`,
      label: tabNames["myMoments"] || "",
      description: `Personal repository for members to review their own ${singularName.toLowerCase()} clips and drafts.`,
      icon: PlaySquare,
      canHide: true,
      enabled: allowMyMoments,
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

function MomentsSettingsPage() {
  const moduleName = useModuleStore((state) => state.momentModuleName);
  const singularName = useModuleStore((state) => state.momentSingularName);

  const { data, refetch } = useEntitySettings();
  const [update, { loading: isSaving }] = useUpdateEntitySettings({});

  const [formData, setFormData] = useState<MomentsSettingsState>(() => ({
    ...DEFAULT_SETTINGS,
    allowEntityMomentsInFeed:
      data?.getEntitySettings?.allowEntityMomentsInFeed ?? true,
  }));

  const [tabs, setTabs] = useState<ModuleTabItem[]>(() =>
    createDefaultTabs(moduleName, singularName, data?.getEntitySettings)
  );

  const [ctaName, setCtaName] = useState<string>(
    data?.getEntitySettings?.momentsCtaName || ""
  );

  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data?.getEntitySettings) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({
        ...prev,
        allowEntityMomentsInFeed:
          data.getEntitySettings.allowEntityMomentsInFeed ?? true,
      }));
      setTabs(createDefaultTabs(moduleName, singularName, data.getEntitySettings));
      setCtaName(data.getEntitySettings.momentsCtaName || "");
    }
  }, [data, moduleName, singularName]);

  const handleToggle = (key: keyof MomentsSettingsState) => {
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
    setFormData({
      ...DEFAULT_SETTINGS,
      allowEntityMomentsInFeed:
        data?.getEntitySettings?.allowEntityMomentsInFeed ?? true,
    });
    setTabs(createDefaultTabs(moduleName, singularName, data?.getEntitySettings));
    setCtaName(data?.getEntitySettings?.momentsCtaName || "");
    setHasChanged(false);
  };

  const handleSave = async () => {
    try {
      if (data?.getEntitySettings) {
        const momentsTabNames: Record<string, string> = {};
        tabs.forEach((t) => {
          if (t.label && t.label.trim()) {
            momentsTabNames[t.id] = t.label.trim();
          }
        });

        const connectionsTab = tabs.find((t) => t.id === "connections");
        const myMomentsTab = tabs.find((t) => t.id === "myMoments");

        await update({
          variables: {
            input: {
              allowEntityMomentsInFeed: formData.allowEntityMomentsInFeed,
              allowMomentsDiscoverTab: true,
              allowMomentsConnectionsTab: connectionsTab ? connectionsTab.enabled : true,
              allowMomentsMyMomentsTab: myMomentsTab ? myMomentsTab.enabled : true,
              momentsTabNames,
              momentsTabOrder: tabs.map((t) => t.id),
              momentsCtaName: ctaName.trim() || null,
            },
          },
        });
      }
      toast.success(`${moduleName} settings synchronized successfully.`);
      setHasChanged(false);
      refetch?.();
    } catch (error: unknown) {
      toast.error(
        (error as Error).message || `Failed to update ${moduleName.toLowerCase()} settings.`
      );
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
                    <span>{ctaName || `Create ${singularName}`}</span>
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
                  label="Connections Stream"
                  value={
                    tabs.find((t) => t.id === "connections")?.enabled
                      ? "Active"
                      : "Hidden"
                  }
                />
                <PolarisSummaryRow
                  label="My Clips Stream"
                  value={
                    tabs.find((t) => t.id === "myMoments")?.enabled
                      ? "Active"
                      : "Hidden"
                  }
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Tip Card */}
            <PolarisTipCard title="Tab Navigation Tip">
              The <strong>Discover</strong> tab serves as the primary landing destination and cannot be hidden, ensuring members always have video content to browse. Drag items to adjust tab order.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-3.5">
          {/* Section 1: Tab Navigation & CTA Configuration */}
          <PolarisFormCard
            step={1}
            title="Navigation Tabs & CTA Customization"
            description="Configure member navigation tabs (Discover is locked on; Connections and My Moments can be hidden). Reorder and rename tabs to match your community taxonomy."
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
                        Customize the button label used across the member header to initiate uploads.
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[9.5px] font-bold">
                    Header Action
                  </Badge>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70">
                  <span className="text-[11px] text-[#616161] dark:text-zinc-400">
                    Button Text: <span className="text-[10px] text-[#8c9196]">(Default: &quot;Create {singularName}&quot;)</span>
                  </span>
                  <input
                    type="text"
                    placeholder={`Create ${singularName}`}
                    value={ctaName}
                    onChange={handleCtaNameChange}
                    className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full sm:w-[240px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </PolarisFormCard>

          {/* Section 2: Visibility & Creator Permissions */}
          <PolarisFormCard
            step={2}
            title="Visibility & Creator Permissions"
            description="Configure discoverability parameters and creator upload rights."
            badge="Visibility"
          >
            <div className="space-y-2.5">
              {/* Allow Public Discoverability */}
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.allowPublicMoments
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                        : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
                    )}
                  >
                    <Globe className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Allow Public {moduleName}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                          formData.allowPublicMoments
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                        )}
                      >
                        {formData.allowPublicMoments ? "Public" : "Private"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Enable ecosystem-wide video discoverability so non-members can browse highlights.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.allowPublicMoments}
                  onCheckedChange={() => handleToggle("allowPublicMoments")}
                />
              </div>

              {/* Enable Short Uploads */}
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.enableShortUploads
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
                          formData.enableShortUploads
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                        )}
                      >
                        {formData.enableShortUploads ? "Enabled" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Allow registered community members to record, draft, and post {singularName.toLowerCase()} clips.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.enableShortUploads}
                  onCheckedChange={() => handleToggle("enableShortUploads")}
                />
              </div>

              {/* Surface in Main Feed */}
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.allowEntityMomentsInFeed
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
                          formData.allowEntityMomentsInFeed
                            ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                        )}
                      >
                        {formData.allowEntityMomentsInFeed ? "Included" : "Excluded"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Embed playable {singularName.toLowerCase()} video tiles into the central community feed timeline.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.allowEntityMomentsInFeed}
                  onCheckedChange={() => handleToggle("allowEntityMomentsInFeed")}
                />
              </div>
            </div>
          </PolarisFormCard>

          {/* Section 3: Moderation & Quality Protocols */}
          <PolarisFormCard
            step={3}
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
                      formData.autoModeration
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
                          formData.autoModeration
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                        )}
                      >
                        {formData.autoModeration ? "Active" : "Off"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Automatically screen uploaded clips against policy violations and copyright standards.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.autoModeration}
                  onCheckedChange={() => handleToggle("autoModeration")}
                />
              </div>

              {/* Moderated Feed Gate */}
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.moderatedFeed
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
                          formData.moderatedFeed
                            ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                        )}
                      >
                        {formData.moderatedFeed ? "Manual Queue" : "Instant"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Hold newly uploaded videos in a review queue before showing them to other members.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.moderatedFeed}
                  onCheckedChange={() => handleToggle("moderatedFeed")}
                />
              </div>

              {/* Upload Notifications */}
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.uploadNotifications
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
                  checked={formData.uploadNotifications}
                  onCheckedChange={() => handleToggle("uploadNotifications")}
                />
              </div>
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
          description={`You have unsaved changes to ${singularName.toLowerCase()} configuration parameters.`}
          buttonText="Save Settings"
        />
      </PolarisFormLayout>
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(MomentsSettingsPage, "MOMENTS", "canEdit"),
  "moments",
);

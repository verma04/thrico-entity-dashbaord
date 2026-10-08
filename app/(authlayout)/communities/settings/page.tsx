"use client";

import React, { useState, useEffect } from "react";
import { useEntitySettings, useUpdateEntitySettings } from "@/graphql/actions";
import { EntitySettings } from "@/graphql/actions/settings";
import {
  Globe,
  Zap,
  Sparkles,
  Users2,
  UserCheck,
  MessageSquare,
  ShieldCheck,
  PlusCircle,
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

interface CommunitySettingsState {
  allowCommunity: boolean;
  autoApproveCommunity: boolean;
  autoApproveGroup: boolean;
  aiModerationCommunities: boolean;
}

const DEFAULT_SETTINGS: CommunitySettingsState = {
  allowCommunity: true,
  autoApproveCommunity: false,
  autoApproveGroup: true,
  aiModerationCommunities: true,
};

const createDefaultTabs = (
  moduleName: string,
  singularName: string,
  entitySettings?: EntitySettings
): ModuleTabItem[] => {
  const tabNames = (entitySettings?.communitiesTabNames as Record<string, string>) || {};
  const tabOrder = (entitySettings?.communitiesTabOrder as string[]) || [
    "discover",
    "myCommunities",
    "joined",
    "feed",
  ];
  const allowMyCommunities = entitySettings?.allowCommunitiesMyCommunitiesTab ?? true;
  const allowJoined = entitySettings?.allowCommunitiesJoinedTab ?? true;
  const allowFeed = entitySettings?.allowCommunitiesFeedTab ?? true;

  const baseMap: Record<string, ModuleTabItem> = {
    discover: {
      id: "discover",
      key: "allowCommunitiesDiscoverTab",
      defaultName: "Discover",
      label: tabNames["discover"] || "",
      description: `Public directory, featured, and recommended ${moduleName.toLowerCase()}.`,
      icon: Compass,
      canHide: false, // Discover tab CANNOT be hidden
      enabled: true,
    },
    myCommunities: {
      id: "myCommunities",
      key: "allowCommunitiesMyCommunitiesTab",
      defaultName: `My ${moduleName}`,
      label: tabNames["myCommunities"] || "",
      description: `Personal management portal for ${moduleName.toLowerCase()} owned or led by the member.`,
      icon: Users2,
      canHide: true,
      enabled: allowMyCommunities,
    },
    joined: {
      id: "joined",
      key: "allowCommunitiesJoinedTab",
      defaultName: "Joined",
      label: tabNames["joined"] || "",
      description: `Quick access to all ${moduleName.toLowerCase()} the member has joined.`,
      icon: UserCheck,
      canHide: true,
      enabled: allowJoined,
    },
    feed: {
      id: "feed",
      key: "allowCommunitiesFeedTab",
      defaultName: `${moduleName} Feed`,
      label: tabNames["feed"] || "",
      description: `Aggregated activity feed and updates from all joined ${moduleName.toLowerCase()}.`,
      icon: MessageSquare,
      canHide: true,
      enabled: allowFeed,
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

export default function CommunitySettings() {
  const moduleName = useModuleStore((state) => state.communityModuleName);
  const singularName = useModuleStore((state) => state.communitySingularName);

  const { data, loading, refetch } = useEntitySettings();
  const [update, { loading: isSaving }] = useUpdateEntitySettings({});

  const [formData, setFormData] = useState<CommunitySettingsState>(() => ({
    allowCommunity: data?.getEntitySettings?.allowCommunity ?? true,
    autoApproveCommunity: data?.getEntitySettings?.autoApproveCommunity ?? false,
    autoApproveGroup: data?.getEntitySettings?.autoApproveGroup ?? true,
    aiModerationCommunities: data?.getEntitySettings?.aiModerationCommunities ?? true,
  }));

  const [tabs, setTabs] = useState<ModuleTabItem[]>(() =>
    createDefaultTabs(moduleName, singularName, data?.getEntitySettings)
  );

  const [ctaName, setCtaName] = useState<string>(
    data?.getEntitySettings?.communitiesCtaName || ""
  );

  const [hasChanged, setHasChanged] = useState(false);

  useEffect(() => {
    if (data?.getEntitySettings) {
      setFormData({
        allowCommunity: data.getEntitySettings.allowCommunity ?? true,
        autoApproveCommunity: data.getEntitySettings.autoApproveCommunity ?? false,
        autoApproveGroup: data.getEntitySettings.autoApproveGroup ?? true,
        aiModerationCommunities: data.getEntitySettings.aiModerationCommunities ?? true,
      });
      setTabs(createDefaultTabs(moduleName, singularName, data.getEntitySettings));
      setCtaName(data.getEntitySettings.communitiesCtaName || "");
      setHasChanged(false);
    }
  }, [data, moduleName, singularName]);

  const handleToggle = (key: keyof CommunitySettingsState) => {
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
        allowCommunity: data.getEntitySettings.allowCommunity ?? true,
        autoApproveCommunity: data.getEntitySettings.autoApproveCommunity ?? false,
        autoApproveGroup: data.getEntitySettings.autoApproveGroup ?? true,
        aiModerationCommunities: data.getEntitySettings.aiModerationCommunities ?? true,
      });
      setTabs(createDefaultTabs(moduleName, singularName, data.getEntitySettings));
      setCtaName(data.getEntitySettings.communitiesCtaName || "");
      setHasChanged(false);
    }
  };

  const handleSave = async () => {
    try {
      if (data?.getEntitySettings) {
        const communitiesTabNames: Record<string, string> = {};
        tabs.forEach((t) => {
          if (t.label && t.label.trim()) {
            communitiesTabNames[t.id] = t.label.trim();
          }
        });

        const myCommunitiesTab = tabs.find((t) => t.id === "myCommunities");
        const joinedTab = tabs.find((t) => t.id === "joined");
        const feedTab = tabs.find((t) => t.id === "feed");

        await update({
          variables: {
            input: {
              allowCommunity: formData.allowCommunity,
              autoApproveCommunity: formData.autoApproveCommunity,
              autoApproveGroup: formData.autoApproveGroup,
              aiModerationCommunities: formData.aiModerationCommunities,
              allowCommunitiesDiscoverTab: true,
              allowCommunitiesMyCommunitiesTab: myCommunitiesTab ? myCommunitiesTab.enabled : true,
              allowCommunitiesJoinedTab: joinedTab ? joinedTab.enabled : true,
              allowCommunitiesFeedTab: feedTab ? feedTab.enabled : true,
              communitiesTabNames,
              communitiesTabOrder: tabs.map((t) => t.id),
              communitiesCtaName: ctaName.trim() || null,
            },
          },
        });
      }
      toast.success(`${singularName} settings synchronized successfully.`);
      setHasChanged(false);
      refetch?.();
    } catch (error: any) {
      toast.error(error.message || `Failed to update ${singularName.toLowerCase()} settings.`);
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
                  label="Joined Tab"
                  value={tabs.find((t) => t.id === "joined")?.enabled ? "Visible" : "Hidden"}
                />
                <PolarisSummaryRow
                  label="Feed Tab"
                  value={tabs.find((t) => t.id === "feed")?.enabled ? "Visible" : "Hidden"}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Live Governance Preview Card */}
            <PolarisSidebarCard
              title={`${singularName} Protocol`}
              badge="Network State"
              icon={Sparkles}
            >
              <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#e1e3e5] dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 flex items-center justify-center text-[10px] font-bold">
                      <Globe className="h-3 w-3" />
                    </div>
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      {singularName} Creation
                    </span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[9.5px] font-bold gap-1 px-1.5 py-0 rounded-[3px]",
                      formData.allowCommunity
                        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30",
                    )}
                  >
                    {formData.allowCommunity ? "Enabled" : "Paused"}
                  </Badge>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Member Creation:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.allowCommunity ? "Open to Members" : "Admin Only"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Approval Mode:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.autoApproveCommunity ? "Instant (Live)" : "Manual Verification"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>Group Approval:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.autoApproveGroup ? "Instant" : "Review Required"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#616161]">
                    <span>AI Moderation:</span>
                    <span className="font-semibold text-[#303030] dark:text-zinc-200">
                      {formData.aiModerationCommunities ? "Active Sentinel" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-1 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                <PolarisSummaryRow
                  label="Node Creation"
                  value={formData.allowCommunity ? "Permitted" : "Restricted"}
                  highlight={formData.allowCommunity}
                />
                <PolarisSummaryRow
                  label="Community Approval"
                  value={formData.autoApproveCommunity ? "Automated" : "Review Required"}
                />
                <PolarisSummaryRow
                  label="AI Sentinel"
                  value={formData.aiModerationCommunities ? "Protected" : "Bypassed"}
                  highlight={formData.aiModerationCommunities}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Tip Card */}
            <PolarisTipCard title="Navigation & Governance Tip">
              The <strong>Discover</strong> tab cannot be hidden, ensuring visitors always find active {moduleName.toLowerCase()}. Use custom labels and order to fit your organization taxonomy.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-3.5">
          {/* Section 1: Navigation Tabs & CTA Configuration */}
          <PolarisFormCard
            step={1}
            title="Navigation Tabs & CTA Customization"
            description={`Configure member navigation tabs (Discover is locked on; My ${moduleName}, Joined, and Feed can be hidden). Reorder and rename tabs to match your taxonomy.`}
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
                        Customize the button label used across the member header to launch community creation.
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

          {/* Section 2: Creation & Access Gateway */}
          <PolarisFormCard
            step={2}
            title="Creation & Governance Policy"
            description={`Configure permissions for member-initiated ${moduleName.toLowerCase()} creation.`}
            badge="Access"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.allowCommunity
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                  )}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Allow Member {singularName} Creation
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.allowCommunity
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                      )}
                    >
                      {formData.allowCommunity ? "Enabled" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    When active, community members can create and administer their own sub-groups
                    and interest hubs.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.allowCommunity}
                onCheckedChange={() => handleToggle("allowCommunity")}
              />
            </div>
          </PolarisFormCard>

          {/* Section 3: Automation Protocols */}
          <PolarisFormCard
            step={3}
            title="Automation & Verification Protocols"
            description={`Determine whether new ${moduleName.toLowerCase()} and sub-groups require admin review before going live.`}
            badge="Automation"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.autoApproveCommunity
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
                          formData.autoApproveCommunity
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formData.autoApproveCommunity ? "Instant" : "Manual"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Instantly publish newly created {moduleName.toLowerCase()} in the public discovery
                      directory without moderation delays.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.autoApproveCommunity}
                  onCheckedChange={() => handleToggle("autoApproveCommunity")}
                />
              </div>

              <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
                <div className="flex items-start gap-2.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                      formData.autoApproveGroup
                        ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                        : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                    )}
                  >
                    <Users2 className="h-3.5 w-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                        Auto Approve Sub-Groups
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                          formData.autoApproveGroup
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400"
                            : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                        )}
                      >
                        {formData.autoApproveGroup ? "Instant" : "Manual"}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                      Automatically activate and publish new sub-groups and channels formed within existing communities.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={formData.autoApproveGroup}
                  onCheckedChange={() => handleToggle("autoApproveGroup")}
                />
              </div>
            </div>
          </PolarisFormCard>

          {/* Section 4: AI Safety Sentinel */}
          <PolarisFormCard
            step={4}
            title="AI Moderation Sentinel"
            description={`Autonomous real-time safety inspection for ${moduleName.toLowerCase()} descriptions and member discussions.`}
            badge="AI Safety"
          >
            <div className="flex items-start justify-between p-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/40 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/40 transition-colors">
              <div className="flex items-start gap-2.5">
                <div
                  className={cn(
                    "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                    formData.aiModerationCommunities
                      ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50"
                      : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700",
                  )}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      AI Content Moderation
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[9px] px-1 py-0 rounded-[3px] font-bold",
                        formData.aiModerationCommunities
                          ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800",
                      )}
                    >
                      {formData.aiModerationCommunities ? "Active Sentinel" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                    Automatically scan community profiles, group updates, and descriptions in real-time with AI to prevent harassment, toxicity, and policy breaches.
                  </p>
                </div>
              </div>
              <Switch
                checked={formData.aiModerationCommunities}
                onCheckedChange={() => handleToggle("aiModerationCommunities")}
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
          description={`You have unsaved changes to ${singularName.toLowerCase()} governance protocols.`}
          buttonText="Save Settings"
        />
      </PolarisFormLayout>
    </div>
  );
}

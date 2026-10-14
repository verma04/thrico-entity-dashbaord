/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import {
  EntitySettings,
  useEntitySettings,
  useUpdateEntitySettings,
} from "@/graphql/actions";
import { useGetAllMoments, Moment, useGetMomentSetting, useUpdateMomentSetting } from "@/graphql/actions/moments";
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
  Sparkles,
  Pin,
  ArrowUp,
  ArrowDown,
  Film,
  X,
  Clock,
  Send,
  AlertCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { MomentSelectorModal } from "@/components/settings/moments/moment-selector-modal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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

interface CustomTabConfig {
  id: string;
  name: string;
  icon?: string;
  enabled?: boolean;
  momentIds?: string[];
}

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
  const customTabsList: CustomTabConfig[] = Array.isArray(entitySettings?.momentsCustomTabs)
    ? (entitySettings.momentsCustomTabs as CustomTabConfig[])
    : [];

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
      description: "Updates and highlights posted exclusively by mutual connections.",
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

  // Add custom tabs to baseMap
  customTabsList.forEach((cTab) => {
    baseMap[cTab.id] = {
      id: cTab.id,
      defaultName: cTab.name,
      label: tabNames[cTab.id] || cTab.name,
      description: `Custom curated collection of ${cTab.momentIds?.length || 0} ${singularName.toLowerCase()} clips.`,
      icon: Sparkles,
      canHide: true,
      enabled: cTab.enabled !== false,
      isCustom: true,
      momentIds: cTab.momentIds || [],
    };
  });

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

  const { data: momentsData } = useGetAllMoments({
    pagination: { page: 1, limit: 100 },
  });
  const allMomentsList = useMemo(() => {
    return momentsData?.getAllMoments?.data || [];
  }, [momentsData]);
  const momentsByIdMap = useMemo(() => {
    const map = new Map<string, Moment>();
    allMomentsList.forEach((m) => map.set(m.id, m));
    return map;
  }, [allMomentsList]);

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

  const [pinnedMomentIds, setPinnedMomentIds] = useState<string[]>(() => {
    const raw = data?.getEntitySettings?.momentsPinnedMomentIds;
    return Array.isArray(raw) ? (raw as string[]) : [];
  });

  const [hasChanged, setHasChanged] = useState(false);
  const { data: momentSettingData, refetch: refetchMomentSetting } = useGetMomentSetting();
  const [updateMomentSetting, { loading: isUpdatingMomentSetting }] = useUpdateMomentSetting();

  const [creatorSettings, setCreatorSettings] = useState({
    allowMomentsShareInFeed: true,
    momentsShareInFeedTitle: "Share in Feed",
    momentsShareInFeedDescription: "Make this visible across your community feed",
    allowMomentsAiLabel: true,
    momentsAiLabelTitle: "Add AI Label",
    momentsAiLabelDescription: "Label realistic content made with AI.",
    momentsMaxDuration: 60,
  });

  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (momentSettingData?.getMomentSetting) {
      const ms = momentSettingData.getMomentSetting;
      setCreatorSettings({
        allowMomentsShareInFeed: ms.allowMomentsShareInFeed ?? true,
        momentsShareInFeedTitle: ms.momentsShareInFeedTitle || "Share in Feed",
        momentsShareInFeedDescription: ms.momentsShareInFeedDescription || "Make this visible across your community feed",
        allowMomentsAiLabel: ms.allowMomentsAiLabel ?? true,
        momentsAiLabelTitle: ms.momentsAiLabelTitle || "Add AI Label",
        momentsAiLabelDescription: ms.momentsAiLabelDescription || "Label realistic content made with AI.",
        momentsMaxDuration: ms.momentsMaxDuration ?? 60,
      });
    }
  }, [momentSettingData]);

  const durationError = useMemo(() => {
    const d = Number(creatorSettings.momentsMaxDuration);
    if (isNaN(d) || !creatorSettings.momentsMaxDuration) {
      return "Duration is required";
    }
    if (d < 3) {
      return "Duration must be at least 3 seconds";
    }
    if (d > 120) {
      return "Duration cannot exceed 2 minutes (120 seconds)";
    }
    return null;
  }, [creatorSettings.momentsMaxDuration]);


  // Modals state
  const [isNewTabModalOpen, setIsNewTabModalOpen] = useState(false);
  const [newTabNameInput, setNewTabNameInput] = useState("");

  const [isCurateModalOpen, setIsCurateModalOpen] = useState(false);
  const [activeCurateTarget, setActiveCurateTarget] = useState<{
    id: string; // tab id or "__pinned__"
    title: string;
    description: string;
    momentIds: string[];
  } | null>(null);

  useEffect(() => {
    if (data?.getEntitySettings) {
      setFormData((prev) => ({
        ...prev,
        allowEntityMomentsInFeed:
          data.getEntitySettings.allowEntityMomentsInFeed ?? true,
      }));
      setTabs(createDefaultTabs(moduleName, singularName, data.getEntitySettings));
      setCtaName(data.getEntitySettings.momentsCtaName || "");
      const rawPinned = data.getEntitySettings.momentsPinnedMomentIds;
      setPinnedMomentIds(Array.isArray(rawPinned) ? (rawPinned as string[]) : []);
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

  // Add Custom Tab Flow
  const handleOpenNewTabModal = () => {
    setNewTabNameInput("");
    setIsNewTabModalOpen(true);
  };

  const handleCreateCustomTab = () => {
    const trimmed = newTabNameInput.trim();
    if (!trimmed) {
      toast.error("Please provide a name for the new tab.");
      return;
    }

    const newTabId = `custom-tab-${Date.now()}`;
    const newTab: ModuleTabItem = {
      id: newTabId,
      defaultName: trimmed,
      label: trimmed,
      description: `Custom curated collection of 0 ${singularName.toLowerCase()} clips.`,
      icon: Sparkles,
      canHide: true,
      enabled: true,
      isCustom: true,
      momentIds: [],
    };

    setTabs((prev) => [...prev, newTab]);
    setHasChanged(true);
    setIsNewTabModalOpen(false);

    // Prompt user immediately to select moments for this newly created tab
    setActiveCurateTarget({
      id: newTabId,
      title: `Curate ${trimmed}`,
      description: `Select and sequence ${singularName.toLowerCase()} clips for your new "${trimmed}" tab.`,
      momentIds: [],
    });
    setIsCurateModalOpen(true);
  };

  const handleDeleteCustomTab = (tabId: string) => {
    const targetTab = tabs.find((t) => t.id === tabId);
    if (!targetTab) return;
    setTabs((prev) => prev.filter((t) => t.id !== tabId));
    setHasChanged(true);
    toast.success(`Removed "${targetTab.label || targetTab.defaultName}" tab.`);
  };

  // Curate Tab Moments Flow
  const handleOpenCurateTab = (tabId: string) => {
    const targetTab = tabs.find((t) => t.id === tabId);
    if (!targetTab) return;
    setActiveCurateTarget({
      id: tabId,
      title: `Curate "${targetTab.label || targetTab.defaultName}"`,
      description: `Select and sequence ${singularName.toLowerCase()} clips for this tab.`,
      momentIds: targetTab.momentIds || [],
    });
    setIsCurateModalOpen(true);
  };

  // Curate Pinned Moments Flow
  const handleOpenCuratePinned = () => {
    setActiveCurateTarget({
      id: "__pinned__",
      title: "Admin Pinned Moments",
      description: `Select and sequence ${singularName.toLowerCase()} clips pinned to the top of Discover feed.`,
      momentIds: pinnedMomentIds,
    });
    setIsCurateModalOpen(true);
  };

  const handleConfirmSelectedMoments = (selectedIds: string[]) => {
    if (!activeCurateTarget) return;

    if (activeCurateTarget.id === "__pinned__") {
      setPinnedMomentIds(selectedIds);
      setHasChanged(true);
      toast.success(`Updated pinned moments (${selectedIds.length} pinned).`);
    } else {
      // It's a custom tab
      setTabs((prev) =>
        prev.map((t) => {
          if (t.id === activeCurateTarget.id) {
            return {
              ...t,
              momentIds: selectedIds,
              description: `Custom curated collection of ${selectedIds.length} ${singularName.toLowerCase()} clips.`,
            };
          }
          return t;
        })
      );
      setHasChanged(true);
      toast.success(`Updated moments for tab (${selectedIds.length} selected).`);
    }
  };

  const handleMovePinnedUp = (index: number) => {
    if (index === 0) return;
    setPinnedMomentIds((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
    setHasChanged(true);
  };

  const handleMovePinnedDown = (index: number) => {
    if (index >= pinnedMomentIds.length - 1) return;
    setPinnedMomentIds((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
    setHasChanged(true);
  };

  const handleRemovePinned = (id: string) => {
    setPinnedMomentIds((prev) => prev.filter((item) => item !== id));
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
    const rawPinned = data?.getEntitySettings?.momentsPinnedMomentIds;
    setPinnedMomentIds(Array.isArray(rawPinned) ? (rawPinned as string[]) : []);
    if (momentSettingData?.getMomentSetting) {
      const ms = momentSettingData.getMomentSetting;
      setCreatorSettings({
        allowMomentsShareInFeed: ms.allowMomentsShareInFeed ?? true,
        momentsShareInFeedTitle: ms.momentsShareInFeedTitle || "Share in Feed",
        momentsShareInFeedDescription: ms.momentsShareInFeedDescription || "Make this visible across your community feed",
        allowMomentsAiLabel: ms.allowMomentsAiLabel ?? true,
        momentsAiLabelTitle: ms.momentsAiLabelTitle || "Add AI Label",
        momentsAiLabelDescription: ms.momentsAiLabelDescription || "Label realistic content made with AI.",
        momentsMaxDuration: ms.momentsMaxDuration ?? 60,
      });
    }
    setHasChanged(false);
  };

  const handleSave = async () => {
    if (durationError) {
      toast.error(durationError);
      return;
    }
    try {
      await updateMomentSetting({
        variables: {
          input: {
            allowMomentsShareInFeed: creatorSettings.allowMomentsShareInFeed,
            momentsShareInFeedTitle: creatorSettings.momentsShareInFeedTitle.trim() || null,
            momentsShareInFeedDescription: creatorSettings.momentsShareInFeedDescription.trim() || null,
            allowMomentsAiLabel: creatorSettings.allowMomentsAiLabel,
            momentsAiLabelTitle: creatorSettings.momentsAiLabelTitle.trim() || null,
            momentsAiLabelDescription: creatorSettings.momentsAiLabelDescription.trim() || null,
            momentsMaxDuration: Number(creatorSettings.momentsMaxDuration),
          },
        },
      });
      refetchMomentSetting?.();
      if (data?.getEntitySettings) {
        const momentsTabNames: Record<string, string> = {};
        tabs.forEach((t) => {
          if (t.label && t.label.trim()) {
            momentsTabNames[t.id] = t.label.trim();
          }
        });

        const connectionsTab = tabs.find((t) => t.id === "connections");
        const myMomentsTab = tabs.find((t) => t.id === "myMoments");

        const momentsCustomTabs = tabs
          .filter((t) => t.isCustom)
          .map((t) => ({
            id: t.id,
            name: t.label || t.defaultName,
            icon: "Sparkles",
            enabled: t.enabled,
            momentIds: t.momentIds || [],
          }));

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
              momentsPinnedMomentIds: pinnedMomentIds,
              momentsCustomTabs,
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
                        <div className="flex items-center gap-1 shrink-0 ml-1">
                          {tab.isCustom && (
                            <Badge
                              variant="outline"
                              className="text-[8.5px] px-1 py-0 rounded-[2px] bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400"
                            >
                              {tab.momentIds?.length || 0} clips
                            </Badge>
                          )}
                          {idx === 0 && (
                            <span className="text-[9px] uppercase tracking-wider font-bold text-indigo-500">
                              Default
                            </span>
                          )}
                        </div>
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
                  label="Pinned Moments"
                  value={`${pinnedMomentIds.length} Pinned`}
                  highlight={pinnedMomentIds.length > 0}
                />
                <PolarisSummaryRow
                  label="Custom Tabs"
                  value={`${tabs.filter((t) => t.isCustom).length} Created`}
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
                />
                <PolarisSummaryRow
                  label="Max Duration"
                  value={`${creatorSettings.momentsMaxDuration}s (${creatorSettings.momentsMaxDuration > 60 ? (creatorSettings.momentsMaxDuration / 60).toFixed(1) + "m" : creatorSettings.momentsMaxDuration + "s"})`}
                  highlight
                />
                <PolarisSummaryRow
                  label="Share in Feed"
                  value={creatorSettings.allowMomentsShareInFeed ? "Allowed" : "Disabled"}
                  highlight={creatorSettings.allowMomentsShareInFeed}
                />
                <PolarisSummaryRow
                  label="AI Labeling"
                  value={creatorSettings.allowMomentsAiLabel ? "Enabled" : "Disabled"}
                  isLast
                />
              </div>
            </PolarisSidebarCard>

            {/* Tip Card */}
            <PolarisTipCard title="Navigation & Curation Tips">
              Create custom tabs like <strong>&quot;Staff Picks&quot;</strong> or <strong>&quot;Highlights&quot;</strong> and select exactly which clips members see. Pinned moments will appear prominently at the top of Discover.
            </PolarisTipCard>
          </div>
        }
      >
        <div className="space-y-3.5">
          {/* Section 1: Tab Navigation & CTA Configuration */}
          <PolarisFormCard
            step={1}
            title="Navigation Tabs & CTA Customization"
            description="Manage member navigation tabs. Reorder tabs, rename default tabs, or add new custom tabs with your own curated moment clips."
            badge="Navigation"
            badgeVariant="emerald"
            icon={Sliders}
          >
            <div className="space-y-4">
              {/* Tab Manager Component with Custom Tab Support */}
              <ModuleTabManager
                tabs={tabs}
                onChange={handleTabsChange}
                onAddCustomTab={handleOpenNewTabModal}
                onCurateMoments={handleOpenCurateTab}
                onDeleteCustomTab={handleDeleteCustomTab}
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

          {/* Section 2: Admin Pinned Moments (Discover Feed) */}
          <PolarisFormCard
            step={2}
            title="Admin Pinned Moments"
            description="Feature standout moments at the very top of the Discover feed. Members will see these clips highlighted with a pinned indicator."
            badge="Featured"
            badgeVariant="indigo"
            icon={Pin}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                    Featured Discover Stream Clips
                  </span>
                  <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                    {pinnedMomentIds.length} moment{pinnedMomentIds.length === 1 ? "" : "s"} currently pinned.
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleOpenCuratePinned}
                  className="text-[12px] h-7 gap-1.5 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
                >
                  <Pin className="h-3.5 w-3.5" />
                  <span>{pinnedMomentIds.length > 0 ? "Manage Pinned Clips" : "Select Moments to Pin"}</span>
                </Button>
              </div>

              {/* Pinned Items List */}
              {pinnedMomentIds.length === 0 ? (
                <div className="p-4 rounded-[6px] border border-dashed border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/40 flex flex-col items-center justify-center text-center gap-1.5">
                  <Pin className="h-5 w-5 text-[#8c9196]/50" />
                  <span className="text-[12px] font-medium text-[#303030] dark:text-zinc-300">
                    No moments pinned to Discover yet
                  </span>
                  <p className="text-[11px] text-[#8c9196] max-w-xs">
                    Pin key videos so they are immediately visible to members on the landing feed.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {pinnedMomentIds.map((id, idx) => {
                    const moment = momentsByIdMap.get(id);
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between p-2 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-800/80 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 w-4 text-center shrink-0">
                            #{idx + 1}
                          </span>
                          {moment?.thumbnailUrl ? (
                            <img
                              src={moment.thumbnailUrl}
                              alt=""
                              className="h-9 w-9 rounded-[4px] object-cover shrink-0"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-[4px] bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center shrink-0 text-[#8c9196]">
                              <Film className="h-4 w-4" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] font-medium text-[#303030] dark:text-zinc-100 truncate">
                              {moment?.caption || "Untitled Moment"}
                            </p>
                            <span className="text-[10.5px] text-[#8c9196]">
                              {moment?.owner
                                ? `${moment.owner.firstName || ""} ${moment.owner.lastName || ""}`.trim() || "Member"
                                : "Member"}
                            </span>
                          </div>
                        </div>

                        {/* Reorder and Remove buttons */}
                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => handleMovePinnedUp(idx)}
                            disabled={idx === 0}
                            title="Move up"
                            className="p-1 rounded text-[#8c9196] hover:text-[#303030] disabled:opacity-30"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMovePinnedDown(idx)}
                            disabled={idx === pinnedMomentIds.length - 1}
                            title="Move down"
                            className="p-1 rounded text-[#8c9196] hover:text-[#303030] disabled:opacity-30"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePinned(id)}
                            title="Unpin"
                            className="p-1 rounded text-[#8c9196] hover:text-red-600"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </PolarisFormCard>

          {/* Section 3: Visibility & Creator Permissions */}
          <PolarisFormCard
            step={3}
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

          {/* Section 4: Creator Studio & Upload Options */}
          <PolarisFormCard
            step={4}
            title="Creator Studio & Upload Options"
            description="Configure upload parameters, maximum video duration (up to 2 minutes), feed sharing rights, and AI labeling."
            badge="Creator Studio"
            badgeVariant="indigo"
            icon={Film}
          >
            <div className="space-y-4">
              {/* Duration Setting */}
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
                        Set the maximum allowed clip duration for uploaded {singularName.toLowerCase()}s. Max allowed limit is 2 minutes (120s).
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
                      min={3}
                      max={120}
                      value={creatorSettings.momentsMaxDuration}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        setCreatorSettings((prev) => ({
                          ...prev,
                          momentsMaxDuration: isNaN(val) ? 0 : val,
                        }));
                        setHasChanged(true);
                      }}
                      className={cn(
                        "text-[12px] h-8 px-2.5 w-24 rounded-[4px] border bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                        durationError
                          ? "border-destructive text-destructive focus:ring-destructive"
                          : "border-[#d2d5d9] dark:border-zinc-700"
                      )}
                    />
                    <span className="text-[11px] text-[#8c9196]">
                      seconds ({creatorSettings.momentsMaxDuration > 60 ? (creatorSettings.momentsMaxDuration / 60).toFixed(1) + " mins" : creatorSettings.momentsMaxDuration + "s"})
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[15, 30, 60, 90, 120].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => {
                          setCreatorSettings((prev) => ({
                            ...prev,
                            momentsMaxDuration: preset,
                          }));
                          setHasChanged(true);
                        }}
                        className={cn(
                          "px-2 py-1 text-[10.5px] rounded-[3px] border font-medium transition-all cursor-pointer",
                          creatorSettings.momentsMaxDuration === preset
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                            : "bg-white dark:bg-zinc-800 border-[#d2d5d9] dark:border-zinc-700 text-[#616161] dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                        )}
                      >
                        {preset}s {preset === 120 ? "(2m)" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                {durationError && (
                  <div className="flex items-center gap-1.5 text-[11px] text-destructive font-medium pt-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{durationError}</span>
                  </div>
                )}
              </div>

              {/* Share in Feed Settings Card */}
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
                            creatorSettings.allowMomentsShareInFeed
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                          )}
                        >
                          {creatorSettings.allowMomentsShareInFeed ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                        Permits creators to choose whether their uploaded moment is published to the community feed.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={creatorSettings.allowMomentsShareInFeed}
                    onCheckedChange={(checked) => {
                      setCreatorSettings((prev) => ({
                        ...prev,
                        allowMomentsShareInFeed: checked,
                      }));
                      setHasChanged(true);
                    }}
                  />
                </div>

                {creatorSettings.allowMomentsShareInFeed && (
                  <div className="pt-2.5 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70 space-y-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-300">
                        Custom Option Title (Default: &quot;Share in Feed&quot;)
                      </label>
                      <input
                        type="text"
                        placeholder="Share in Feed"
                        value={creatorSettings.momentsShareInFeedTitle}
                        onChange={(e) => {
                          setCreatorSettings((prev) => ({
                            ...prev,
                            momentsShareInFeedTitle: e.target.value,
                          }));
                          setHasChanged(true);
                        }}
                        className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-300">
                        Custom Option Subtitle (Default: &quot;Make this visible across your community feed&quot;)
                      </label>
                      <input
                        type="text"
                        placeholder="Make this visible across your community feed"
                        value={creatorSettings.momentsShareInFeedDescription}
                        onChange={(e) => {
                          setCreatorSettings((prev) => ({
                            ...prev,
                            momentsShareInFeedDescription: e.target.value,
                          }));
                          setHasChanged(true);
                        }}
                        className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Add AI Label Settings Card */}
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
                            creatorSettings.allowMomentsAiLabel
                              ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400"
                              : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                          )}
                        >
                          {creatorSettings.allowMomentsAiLabel ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                        Allows creators to disclose and label synthetic AI-generated content on uploaded clips.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={creatorSettings.allowMomentsAiLabel}
                    onCheckedChange={(checked) => {
                      setCreatorSettings((prev) => ({
                        ...prev,
                        allowMomentsAiLabel: checked,
                      }));
                      setHasChanged(true);
                    }}
                  />
                </div>

                {creatorSettings.allowMomentsAiLabel && (
                  <div className="pt-2.5 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70 space-y-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-300">
                        Custom Option Title (Default: &quot;Add AI Label&quot;)
                      </label>
                      <input
                        type="text"
                        placeholder="Add AI Label"
                        value={creatorSettings.momentsAiLabelTitle}
                        onChange={(e) => {
                          setCreatorSettings((prev) => ({
                            ...prev,
                            momentsAiLabelTitle: e.target.value,
                          }));
                          setHasChanged(true);
                        }}
                        className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-300">
                        Custom Option Subtitle (Default: &quot;Label realistic content made with AI.&quot;)
                      </label>
                      <input
                        type="text"
                        placeholder="Label realistic content made with AI."
                        value={creatorSettings.momentsAiLabelDescription}
                        onChange={(e) => {
                          setCreatorSettings((prev) => ({
                            ...prev,
                            momentsAiLabelDescription: e.target.value,
                          }));
                          setHasChanged(true);
                        }}
                        className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </PolarisFormCard>

          {/* Section 5: Moderation & Quality Protocols */}
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
          isSaving={isSaving || isUpdatingMomentSetting}
          onSave={handleSave}
          onReset={handleReset}
          title={`Save ${moduleName} Settings`}
          description={`You have unsaved changes to ${singularName.toLowerCase()} configuration parameters.`}
          buttonText="Save Settings"
        />
      </PolarisFormLayout>

      {/* Dialog for Adding New Custom Tab */}
      <Dialog open={isNewTabModalOpen} onOpenChange={setIsNewTabModalOpen}>
        <DialogContent className="max-w-md p-5 rounded-xl border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-[15px] font-semibold text-[#303030] dark:text-zinc-100 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Add New Custom Tab
            </DialogTitle>
            <DialogDescription className="text-[11.5px] text-[#616161] dark:text-zinc-400">
              Create a custom navigation tab. You can name it and curate specific {singularName.toLowerCase()} clips for it.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 py-3">
            <label className="text-[11.5px] font-medium text-[#303030] dark:text-zinc-200">
              Tab Display Name
            </label>
            <input
              type="text"
              placeholder="e.g. Staff Highlights, Top Demos, Weekly Best"
              value={newTabNameInput}
              onChange={(e) => setNewTabNameInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleCreateCustomTab();
                }
              }}
              autoFocus
              className="w-full text-[12px] h-8 px-3 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <DialogFooter className="flex items-center justify-end gap-2 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsNewTabModalOpen(false)}
              className="text-[12px] h-8"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleCreateCustomTab}
              className="text-[12px] h-8 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
            >
              Create & Curate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Moment Selector Modal */}
      {activeCurateTarget && (
        <MomentSelectorModal
          isOpen={isCurateModalOpen}
          onClose={() => {
            setIsCurateModalOpen(false);
            setActiveCurateTarget(null);
          }}
          title={activeCurateTarget.title}
          description={activeCurateTarget.description}
          selectedMomentIds={activeCurateTarget.momentIds}
          onConfirm={handleConfirmSelectedMoments}
        />
      )}
    </div>
  );
}

export default withSubscriptionCheck(
  withModulePermission(MomentsSettingsPage, "MOMENTS", "canEdit"),
  "moments",
);

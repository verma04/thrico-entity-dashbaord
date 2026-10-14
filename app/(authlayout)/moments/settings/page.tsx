/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import {
  EntitySettings,
  useEntitySettings,
  useUpdateEntitySettings,
} from "@/graphql/actions";
import {
  useGetAllMoments,
  Moment,
  useGetMomentSetting,
  useUpdateMomentSetting,
} from "@/graphql/actions/moments";
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
  Type,
  Play,
  Check,
  Heart,
  MessageSquare,
  Share2,
  Eye,
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
      canHide: false,
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

// Formik Form Values Interface
interface MomentsFormValues {
  ctaName: string;
  allowPublicMoments: boolean;
  enableShortUploads: boolean;
  allowEntityMomentsInFeed: boolean;
  autoModeration: boolean;
  moderatedFeed: boolean;
  uploadNotifications: boolean;

  // MomentSetting fields
  momentsUploadTitle: string;
  momentsUploadDescription: string;
  momentsUploadFormat: string;
  momentsUploadCardTitle: string;
  momentsUploadCardDescription: string;
  momentsMaxDuration: number;
  allowMomentsShareInFeed: boolean;
  momentsShareInFeedTitle: string;
  momentsShareInFeedDescription: string;
  allowMomentsAiLabel: boolean;
  momentsAiLabelTitle: string;
  momentsAiLabelDescription: string;
}

// Yup Validation Schema
const momentsFormValidationSchema = Yup.object().shape({
  ctaName: Yup.string().max(60, "CTA label cannot exceed 60 characters"),
  allowPublicMoments: Yup.boolean(),
  enableShortUploads: Yup.boolean(),
  allowEntityMomentsInFeed: Yup.boolean(),
  autoModeration: Yup.boolean(),
  moderatedFeed: Yup.boolean(),
  uploadNotifications: Yup.boolean(),

  momentsUploadTitle: Yup.string().max(80, "Upload title cannot exceed 80 characters"),
  momentsUploadDescription: Yup.string().max(180, "Upload description cannot exceed 180 characters"),
  momentsUploadFormat: Yup.string().max(20, "Format cannot exceed 20 characters"),
  momentsUploadCardTitle: Yup.string().max(60, "Card title cannot exceed 60 characters"),
  momentsUploadCardDescription: Yup.string().max(140, "Card description cannot exceed 140 characters"),

  momentsMaxDuration: Yup.number()
    .typeError("Duration must be a valid number")
    .required("Duration is required")
    .min(3, "Duration must be at least 3 seconds")
    .max(120, "Duration cannot exceed 2 minutes (120 seconds)"),

  allowMomentsShareInFeed: Yup.boolean(),
  momentsShareInFeedTitle: Yup.string().max(60, "Option title cannot exceed 60 characters"),
  momentsShareInFeedDescription: Yup.string().max(140, "Option description cannot exceed 140 characters"),

  allowMomentsAiLabel: Yup.boolean(),
  momentsAiLabelTitle: Yup.string().max(60, "Option title cannot exceed 60 characters"),
  momentsAiLabelDescription: Yup.string().max(140, "Option description cannot exceed 140 characters"),
});

type PreviewTabId = "step1" | "step2" | "step3" | "feed" | "navbar" | "pinned";

function MomentsSettingsPage() {
  const moduleName = useModuleStore((state) => state.momentName);
  const singularName = useModuleStore((state) => state.momentSingularName);

  const { data, refetch: refetchEntitySettings } = useEntitySettings();
  const [updateEntitySettings, { loading: isSavingEntitySettings }] = useUpdateEntitySettings({});

  const { data: momentSettingData, refetch: refetchMomentSetting } = useGetMomentSetting();
  const [updateMomentSetting, { loading: isUpdatingMomentSetting }] = useUpdateMomentSetting();

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

  // Tab & Pinned States
  const [tabs, setTabs] = useState<ModuleTabItem[]>(() =>
    createDefaultTabs(moduleName, singularName, data?.getEntitySettings)
  );
  const [pinnedMomentIds, setPinnedMomentIds] = useState<string[]>(() => {
    const raw = data?.getEntitySettings?.momentsPinnedMomentIds;
    return Array.isArray(raw) ? (raw as string[]) : [];
  });
  const [tabsDirty, setTabsDirty] = useState(false);
  const [pinnedDirty, setPinnedDirty] = useState(false);

  // Active Live Preview Tab Switcher
  const [previewTab, setPreviewTab] = useState<PreviewTabId>("step1");

  // Modals state
  const [isNewTabModalOpen, setIsNewTabModalOpen] = useState(false);
  const [newTabNameInput, setNewTabNameInput] = useState("");
  const [isCurateModalOpen, setIsCurateModalOpen] = useState(false);
  const [activeCurateTarget, setActiveCurateTarget] = useState<{
    id: string;
    title: string;
    description: string;
    momentIds: string[];
  } | null>(null);

  // Initial Formik Values from Backend & Cache
  const initialValues: MomentsFormValues = useMemo(() => {
    const ms = momentSettingData?.getMomentSetting;
    const es = data?.getEntitySettings;
    return {
      ctaName: es?.momentsCtaName || "",
      allowPublicMoments: true,
      enableShortUploads: true,
      allowEntityMomentsInFeed: es?.allowEntityMomentsInFeed ?? true,
      autoModeration: true,
      moderatedFeed: false,
      uploadNotifications: false,

      momentsUploadTitle: ms?.momentsUploadTitle || "",
      momentsUploadDescription: ms?.momentsUploadDescription || "",
      momentsUploadFormat: ms?.momentsUploadFormat || "9:16",
      momentsUploadCardTitle: ms?.momentsUploadCardTitle || "",
      momentsUploadCardDescription: ms?.momentsUploadCardDescription || "",
      momentsMaxDuration: ms?.momentsMaxDuration ?? 60,
      allowMomentsShareInFeed: ms?.allowMomentsShareInFeed ?? true,
      momentsShareInFeedTitle: ms?.momentsShareInFeedTitle || "Share in Feed",
      momentsShareInFeedDescription:
        ms?.momentsShareInFeedDescription || "Make this visible across your community feed",
      allowMomentsAiLabel: ms?.allowMomentsAiLabel ?? true,
      momentsAiLabelTitle: ms?.momentsAiLabelTitle || "Add AI Label",
      momentsAiLabelDescription:
        ms?.momentsAiLabelDescription || "Label realistic content made with AI.",
    };
  }, [momentSettingData, data]);

  // Formik Configuration
  const formik = useFormik<MomentsFormValues>({
    initialValues,
    validationSchema: momentsFormValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        // 1. Update Dedicated Moment Setting
        await updateMomentSetting({
          variables: {
            input: {
              momentsUploadTitle: values.momentsUploadTitle.trim() || null,
              momentsUploadDescription: values.momentsUploadDescription.trim() || null,
              momentsUploadFormat: values.momentsUploadFormat.trim() || "9:16",
              momentsUploadCardTitle: values.momentsUploadCardTitle.trim() || null,
              momentsUploadCardDescription: values.momentsUploadCardDescription.trim() || null,
              momentsMaxDuration: Number(values.momentsMaxDuration),
              allowMomentsShareInFeed: values.allowMomentsShareInFeed,
              momentsShareInFeedTitle: values.momentsShareInFeedTitle.trim() || null,
              momentsShareInFeedDescription:
                values.momentsShareInFeedDescription.trim() || null,
              allowMomentsAiLabel: values.allowMomentsAiLabel,
              momentsAiLabelTitle: values.momentsAiLabelTitle.trim() || null,
              momentsAiLabelDescription: values.momentsAiLabelDescription.trim() || null,
            },
          },
        });
        refetchMomentSetting?.();

        // 2. Update Entity Settings (Tabs, CTA, Feed, Pinned)
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
              enabled: t.enabled !== false,
              momentIds: t.momentIds || [],
            }));

          await updateEntitySettings({
            variables: {
              input: {
                momentsCtaName: values.ctaName.trim() || null,
                allowMomentsDiscoverTab: true,
                allowMomentsConnectionsTab: connectionsTab ? connectionsTab.enabled !== false : true,
                allowMomentsMyMomentsTab: myMomentsTab ? myMomentsTab.enabled !== false : true,
                momentsTabNames,
                momentsTabOrder: tabs.map((t) => t.id),
                momentsPinnedMomentIds: pinnedMomentIds,
                momentsCustomTabs,
                allowEntityMomentsInFeed: values.allowEntityMomentsInFeed,
              },
            },
          });
          refetchEntitySettings?.();
        }

        toast.success(`${moduleName} settings saved successfully!`);
        setTabsDirty(false);
        setPinnedDirty(false);
      } catch (err: unknown) {
        toast.error((err as Error).message || "Failed to update settings");
      }
    },
  });

  const hasChanged = formik.dirty || tabsDirty || pinnedDirty;

  const handleReset = () => {
    formik.resetForm();
    setTabs(createDefaultTabs(moduleName, singularName, data?.getEntitySettings));
    const rawPinned = data?.getEntitySettings?.momentsPinnedMomentIds;
    setPinnedMomentIds(Array.isArray(rawPinned) ? (rawPinned as string[]) : []);
    setTabsDirty(false);
    setPinnedDirty(false);
  };

  // Tab Manager Handlers
  const handleTabsChange = (updatedTabs: ModuleTabItem[]) => {
    setTabs(updatedTabs);
    setTabsDirty(true);
  };

  const handleOpenNewTabModal = () => {
    setNewTabNameInput("");
    setIsNewTabModalOpen(true);
  };

  const handleCreateCustomTab = () => {
    const trimmed = newTabNameInput.trim();
    if (!trimmed) {
      toast.error("Please enter a tab name");
      return;
    }
    const newTabId = `custom_${Date.now()}`;
    const newTab: ModuleTabItem = {
      id: newTabId,
      defaultName: trimmed,
      label: trimmed,
      description: `Curated collection of ${singularName.toLowerCase()} clips.`,
      icon: Sparkles,
      canHide: true,
      enabled: true,
      isCustom: true,
      momentIds: [],
    };
    setTabs((prev) => [...prev, newTab]);
    setTabsDirty(true);
    setIsNewTabModalOpen(false);
    setActiveCurateTarget({
      id: newTabId,
      title: `Curate Moments for "${trimmed}"`,
      description: `Select moments to feature in this custom tab.`,
      momentIds: [],
    });
    setIsCurateModalOpen(true);
  };

  const handleDeleteCustomTab = (tabId: string) => {
    setTabs((prev) => prev.filter((t) => t.id !== tabId));
    setTabsDirty(true);
  };

  const handleOpenCurateTab = (tab: ModuleTabItem) => {
    setActiveCurateTarget({
      id: tab.id,
      title: `Curate Moments for "${tab.label || tab.defaultName}"`,
      description: `Select and order clips for this custom tab.`,
      momentIds: tab.momentIds || [],
    });
    setIsCurateModalOpen(true);
  };

  // Pinned Moments Handlers
  const handleOpenCuratePinned = () => {
    setActiveCurateTarget({
      id: "__pinned__",
      title: `Curate Admin Pinned ${moduleName}`,
      description: `Select standout moments to feature at the top of the Discover feed.`,
      momentIds: pinnedMomentIds,
    });
    setIsCurateModalOpen(true);
  };

  const handleConfirmSelectedMoments = (selectedIds: string[]) => {
    if (!activeCurateTarget) return;
    if (activeCurateTarget.id === "__pinned__") {
      setPinnedMomentIds(selectedIds);
      setPinnedDirty(true);
    } else {
      setTabs((prev) =>
        prev.map((t) => (t.id === activeCurateTarget.id ? { ...t, momentIds: selectedIds } : t))
      );
      setTabsDirty(true);
    }
    setIsCurateModalOpen(false);
    setActiveCurateTarget(null);
  };

  const handleMovePinned = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= pinnedMomentIds.length) return;
    const next = [...pinnedMomentIds];
    const [moved] = next.splice(index, 1);
    next.splice(targetIdx, 0, moved);
    setPinnedMomentIds(next);
    setPinnedDirty(true);
  };

  const handleRemovePinned = (id: string) => {
    setPinnedMomentIds((prev) => prev.filter((item) => item !== id));
    setPinnedDirty(true);
  };

  const activeTabs = useMemo(() => tabs.filter((t) => t.enabled !== false), [tabs]);

  const PREVIEW_TABS = [
    { id: "step1", label: "Upload Modal", icon: Film },
    { id: "step2", label: "Trimmer", icon: Clock },
    { id: "step3", label: "Publish", icon: Send },
    { id: "feed", label: "Feed Post", icon: Rss },
    { id: "navbar", label: "Nav Bar", icon: Sliders },
    { id: "pinned", label: "Pinned", icon: Pin },
  ] as const;

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <div className="space-y-4">
            {/* Interactive Live Preview Card for All Components */}
            <PolarisSidebarCard
              title="Interactive Live Preview"
              badge={
                previewTab === "step1"
                  ? "Upload Modal"
                  : previewTab === "step2"
                  ? "Trimmer View"
                  : previewTab === "step3"
                  ? "Publish View"
                  : previewTab === "feed"
                  ? "Feed Card"
                  : previewTab === "pinned"
                  ? "Pinned Feed"
                  : "Navigation"
              }
              icon={Eye}
            >
              {/* Preview Mode Selector Pills */}
              <div className="flex items-center gap-1 p-1 rounded-lg bg-zinc-100 dark:bg-zinc-800/80 mb-3 overflow-x-auto scrollbar-none">
                {PREVIEW_TABS.map((t) => {
                  const TabIcon = t.icon;
                  const active = previewTab === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setPreviewTab(t.id)}
                      className={cn(
                        "flex items-center gap-1 px-2 py-1 rounded-[5px] text-[10.5px] font-medium transition-all shrink-0 cursor-pointer",
                        active
                          ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 font-semibold shadow-2xs"
                          : "text-[#616161] dark:text-zinc-400 hover:text-[#303030] dark:hover:text-zinc-200"
                      )}
                    >
                      <TabIcon className="h-3 w-3" />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* View 1: Step 1 Upload / Select Video Screen */}
              {previewTab === "step1" && (
                <div
                  className="rounded-xl border border-white/10 p-4 text-white space-y-3.5 shadow-xl relative overflow-hidden animate-in fade-in duration-200"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 30%, #1a1f3d 0%, #0d1025 60%, #080a16 100%)",
                  }}
                >
                  <div className="flex items-center justify-between text-[10.5px] text-white/50 border-b border-white/10 pb-2">
                    <span className="font-semibold text-white">Step 1 of 3</span>
                    <span className="text-[9.5px] uppercase tracking-wider">Select Video</span>
                  </div>

                  {/* Center Pulse Circle with Video Icon */}
                  <div className="flex justify-center pt-1">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                      <Video className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Upload Title & Subtitle */}
                  <div className="text-center space-y-1">
                    <h4 className="text-[13px] font-bold text-white tracking-tight leading-snug">
                      {formik.values.momentsUploadTitle || `Capture the ${singularName}`}
                    </h4>
                    <p className="text-[10px] text-zinc-400 leading-tight">
                      {formik.values.momentsUploadDescription ||
                        "Share your story with the world in a vertical short-form video."}
                    </p>
                  </div>

                  {/* Specs Box: Duration & Format */}
                  <div className="rounded-lg bg-white/[0.06] border border-white/10 p-2 flex items-center justify-around text-center">
                    <div>
                      <div className="text-[8px] uppercase tracking-wider font-bold text-zinc-400">
                        Duration
                      </div>
                      <div className="text-[11px] font-extrabold text-white">
                        3-{formik.values.momentsMaxDuration || 60}s
                      </div>
                    </div>
                    <div className="w-px h-5 bg-white/10" />
                    <div>
                      <div className="text-[8px] uppercase tracking-wider font-bold text-zinc-400">
                        Format
                      </div>
                      <div className="text-[11px] font-extrabold text-white">
                        {formik.values.momentsUploadFormat || "9:16"}
                      </div>
                    </div>
                  </div>

                  {/* Action Card Mock */}
                  <div className="p-2.5 rounded-lg border border-indigo-500/30 bg-gradient-to-r from-indigo-600/20 to-indigo-600/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                        <Film className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white truncate">
                          {formik.values.momentsUploadCardTitle || "Select from Library"}
                        </div>
                        <div className="text-[9px] text-zinc-400 truncate">
                          {formik.values.momentsUploadCardDescription ||
                            "Choose your best video or drag & drop here"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* View 2: Step 2 Trimmer Screen */}
              {previewTab === "step2" && (
                <div
                  className="rounded-xl border border-white/10 p-4 text-white space-y-3 shadow-xl relative overflow-hidden animate-in fade-in duration-200"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 30%, #1a1f3d 0%, #0d1025 60%, #080a16 100%)",
                  }}
                >
                  <div className="flex items-center justify-between text-[10.5px] text-white/50 border-b border-white/10 pb-2">
                    <span className="font-semibold text-white">Step 2 of 3</span>
                    <span className="text-[9.5px] uppercase tracking-wider">Trim Video</span>
                  </div>

                  {/* Simulated Phone Video Player */}
                  <div className="relative mx-auto w-32 aspect-[9/16] rounded-xl bg-black border border-white/15 overflow-hidden flex items-center justify-center shadow-lg">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                    <div className="absolute bottom-1 right-1 text-[8.5px] px-1 py-0.2 bg-black/60 rounded text-white/80 font-mono">
                      0:15
                    </div>
                  </div>

                  {/* Trimmer Controls Box */}
                  <div className="p-2.5 rounded-lg bg-white/[0.06] border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-[13px] font-extrabold text-white">15.0s</div>
                        <div className="text-[8.5px] text-white/50 uppercase tracking-wider font-semibold">
                          Selected Span
                        </div>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-bold bg-indigo-500/20 text-indigo-300 border-indigo-400/40">
                        Max {formik.values.momentsMaxDuration || 60}s
                      </Badge>
                    </div>

                    {/* Timeline bar with selected window */}
                    <div className="relative h-4 bg-white/10 rounded-md overflow-hidden flex items-center px-1">
                      <div className="absolute left-[10%] w-[50%] h-full bg-indigo-500/50 border-x-2 border-indigo-400" />
                    </div>

                    {/* Sounds Good Button */}
                    <div className="w-full h-8 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 shadow-md">
                      <span>Sounds Good</span>
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              )}

              {/* View 3: Step 3 Post / Sharing Screen */}
              {previewTab === "step3" && (
                <div
                  className="rounded-xl border border-white/10 p-4 text-white space-y-3 shadow-xl relative overflow-hidden animate-in fade-in duration-200"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 30%, #1a1f3d 0%, #0d1025 60%, #080a16 100%)",
                  }}
                >
                  <div className="flex items-center justify-between text-[10.5px] text-white/50 border-b border-white/10 pb-2">
                    <span className="font-semibold text-white">Step 3 of 3</span>
                    <span className="text-[9.5px] uppercase tracking-wider">Post Details</span>
                  </div>

                  {/* Thumbnail & Caption Mock */}
                  <div className="p-2.5 rounded-lg bg-white/[0.05] border border-white/10 flex gap-2.5">
                    <div className="w-12 aspect-[9/16] rounded-md bg-zinc-800 border border-white/10 flex items-center justify-center shrink-0 text-white/40">
                      <Film className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-zinc-300 font-medium">Write a catchy caption...</div>
                      <div className="text-[9px] text-zinc-500 mt-2">0/500 characters</div>
                    </div>
                  </div>

                  {/* AI Label Disclosure Preview Card */}
                  <div className="p-2.5 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                      <div className="w-6 h-6 rounded-md bg-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
                        <Sparkles className="w-3 h-3" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white truncate">
                          {formik.values.momentsAiLabelTitle || "Add AI Label"}
                        </div>
                        <div className="text-[9px] text-zinc-400 truncate">
                          {formik.values.momentsAiLabelDescription || "Label realistic content made with AI."}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[8.5px] font-bold px-1 py-0 rounded-[2px]",
                        formik.values.allowMomentsAiLabel
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : "bg-zinc-800 text-zinc-500 border-zinc-700"
                      )}
                    >
                      {formik.values.allowMomentsAiLabel ? "ON" : "OFF"}
                    </Badge>
                  </div>

                  {/* Share in Feed Preview Card */}
                  <div className="p-2.5 rounded-lg bg-white/[0.05] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                      <div className="w-6 h-6 rounded-md bg-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
                        <Send className="w-3 h-3" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-white truncate">
                          {formik.values.momentsShareInFeedTitle || "Share in Feed"}
                        </div>
                        <div className="text-[9px] text-zinc-400 truncate">
                          {formik.values.momentsShareInFeedDescription || "Make this visible across your community feed"}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[8.5px] font-bold px-1 py-0 rounded-[2px]",
                        formik.values.allowMomentsShareInFeed
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-zinc-800 text-zinc-500 border-zinc-700"
                      )}
                    >
                      {formik.values.allowMomentsShareInFeed ? "ON" : "OFF"}
                    </Badge>
                  </div>

                  {/* Share CTA */}
                  <div className="w-full h-8 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-[11px] font-bold text-white flex items-center justify-center gap-1.5 shadow-md">
                    <span>Share {singularName}</span>
                    <Check className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* View 4: Feed Post Card Preview */}
              {previewTab === "feed" && (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 space-y-2.5 shadow-md animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-1.5 border-b border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[11px] font-bold text-white">
                        AM
                      </div>
                      <div>
                        <div className="text-[11.5px] font-semibold text-[#303030] dark:text-zinc-100 leading-tight">
                          Alex Morgan
                        </div>
                        <div className="text-[9.5px] text-[#8c9196] leading-tight">@creator • 2h ago</div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[8.5px] font-bold px-1 py-0 rounded-[2px]",
                        formik.values.allowEntityMomentsInFeed
                          ? "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400"
                          : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                      )}
                    >
                      {formik.values.allowEntityMomentsInFeed ? "Included in Feed" : "Excluded"}
                    </Badge>
                  </div>

                  {/* Video Tile with play overlay and AI badge */}
                  <div className="relative aspect-[9/12] rounded-lg bg-zinc-900 overflow-hidden flex items-center justify-center shadow-inner">
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-lg">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>

                    {formik.values.allowMomentsAiLabel && (
                      <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[8.5px] font-bold text-purple-300 border border-purple-400/30 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>AI Generated</span>
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] font-mono font-medium text-white/90">
                      0:15 / {formik.values.momentsMaxDuration || 60}s
                    </div>
                  </div>

                  {/* Feed Caption & Engagement */}
                  <p className="text-[11px] text-[#303030] dark:text-zinc-200 leading-snug">
                    Exploring new {singularName.toLowerCase()}s! #creation ✨
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-[#8c9196]">
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                      <span>148</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      <span>24</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Share2 className="w-3 h-3" />
                      <span>Share</span>
                    </div>
                  </div>
                </div>
              )}

              {/* View 5: Navigation Bar & Tabs Preview */}
              {previewTab === "navbar" && (
                <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-3 shadow-2xs animate-in fade-in duration-200">
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
                      <span>{formik.values.ctaName || `Create ${singularName}`}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* View 6: Pinned Discover Stream Preview */}
              {previewTab === "pinned" && (
                <div className="rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 p-3 space-y-2.5 shadow-2xs animate-in fade-in duration-200">
                  <div className="flex items-center justify-between pb-1.5 border-b border-[#e1e3e5] dark:border-zinc-800">
                    <div className="flex items-center gap-1.5">
                      <Pin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                      <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
                        Pinned Discover Stream
                      </span>
                    </div>
                    <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0 rounded-[3px] bg-indigo-50 text-indigo-700 border-indigo-200">
                      {pinnedMomentIds.length} Pinned
                    </Badge>
                  </div>

                  {pinnedMomentIds.length === 0 ? (
                    <div className="p-3 text-center text-[11px] text-[#8c9196]">
                      No moments currently pinned to Discover.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {pinnedMomentIds.map((id, idx) => {
                        const moment = momentsByIdMap.get(id);
                        return (
                          <div
                            key={id}
                            className="flex items-center gap-2 p-1.5 rounded-[4px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 shadow-2xs"
                          >
                            <span className="text-[10px] font-bold text-indigo-600 w-4 text-center">
                              #{idx + 1}
                            </span>
                            {moment?.thumbnailUrl ? (
                              <img
                                src={moment.thumbnailUrl}
                                alt=""
                                className="h-7 w-7 rounded-[3px] object-cover shrink-0"
                              />
                            ) : (
                              <div className="h-7 w-7 rounded-[3px] bg-zinc-100 dark:bg-zinc-700 flex items-center justify-center shrink-0 text-[#8c9196]">
                                <Film className="h-3.5 w-3.5" />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-medium truncate text-[#303030] dark:text-zinc-100">
                                {moment?.caption || "Untitled Moment"}
                              </p>
                              <span className="text-[9.5px] text-[#8c9196] block truncate">
                                {moment?.owner ? `${moment.owner.firstName || ""} ${moment.owner.lastName || ""}`.trim() : "Member"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </PolarisSidebarCard>

            {/* Settings Overview Card */}
            <PolarisSidebarCard
              title="Overview & Metrics"
              badge="Parameters"
              icon={Sliders}
            >
              <div className="space-y-1">
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
                  label="Max Duration"
                  value={`${formik.values.momentsMaxDuration}s (${formik.values.momentsMaxDuration > 60 ? (formik.values.momentsMaxDuration / 60).toFixed(1) + "m" : formik.values.momentsMaxDuration + "s"})`}
                  highlight
                />
                <PolarisSummaryRow
                  label="Share in Feed"
                  value={formik.values.allowMomentsShareInFeed ? "Enabled" : "Disabled"}
                  highlight={formik.values.allowMomentsShareInFeed}
                />
                <PolarisSummaryRow
                  label="AI Content Label"
                  value={formik.values.allowMomentsAiLabel ? "Enabled" : "Disabled"}
                />
                <PolarisSummaryRow
                  label="Feed Integration"
                  value={formik.values.allowEntityMomentsInFeed ? "Included" : "Excluded"}
                />
              </div>
            </PolarisSidebarCard>

            <PolarisTipCard title="Pro-Tip">
              Click any of the preview tabs above (Upload, Trimmer, Publish, Feed, Nav, Pinned) to see exactly how your settings render for your community in real time.
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
              <div className="flex items-center justify-between pb-1">
                <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
                  Tabs & Header Actions
                </span>
                <button
                  type="button"
                  onClick={() => setPreviewTab("navbar")}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <Eye className="h-3 w-3" />
                  <span>Preview Nav Bar</span>
                </button>
              </div>

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
                          : "border-[#d2d5d9] dark:border-zinc-700"
                      )}
                    />
                    {formik.touched.ctaName && formik.errors.ctaName && (
                      <span className="text-[10.5px] text-destructive mt-0.5">{formik.errors.ctaName}</span>
                    )}
                  </div>
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
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("pinned")}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Preview Pinned</span>
                  </button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleOpenCuratePinned}
                    className="text-[12px] h-7 px-2.5 flex items-center gap-1.5"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Curate Moments</span>
                  </Button>
                </div>
              </div>

              {pinnedMomentIds.length === 0 ? (
                <div className="p-4 rounded-[6px] border border-dashed border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900/50 text-center">
                  <Pin className="h-5 w-5 mx-auto text-[#8c9196] mb-1 opacity-70" />
                  <p className="text-[12px] font-medium text-[#616161] dark:text-zinc-400">
                    No moments currently pinned
                  </p>
                  <p className="text-[10.5px] text-[#8c9196]">
                    Click &quot;Curate Moments&quot; above to feature clips on Discover.
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

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <button
                            type="button"
                            onClick={() => handleMovePinned(idx, "up")}
                            disabled={idx === 0}
                            className="p-1 rounded text-[#616161] hover:text-[#303030] dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleMovePinned(idx, "down")}
                            disabled={idx === pinnedMomentIds.length - 1}
                            className="p-1 rounded text-[#616161] hover:text-[#303030] dark:hover:text-zinc-100 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemovePinned(id)}
                            className="p-1 rounded text-[#8c9196] hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                            title="Unpin"
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

          {/* Section 3: Central Feed & Distribution */}
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
                    onClick={() => setPreviewTab("feed")}
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

          {/* Section 4: Creator Studio & Upload Screen Customization */}
          <PolarisFormCard
            step={4}
            title="Creator Studio & Upload Screen Customization"
            description="Customize upload modal copy (headline, subtitle, action cards), maximum video duration (up to 2 minutes), feed sharing rights, and AI labeling."
            badge="Creator Studio"
            badgeVariant="indigo"
            icon={Film}
          >
            <div className="space-y-4">
              {/* Quick Preview Switcher Buttons */}
              <div className="flex items-center justify-between pb-1 border-b border-[#e1e3e5]/70 dark:border-zinc-800/70">
                <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100">
                  Upload Flow & Modal Customization
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-[#8c9196]">Preview:</span>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("step1")}
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer",
                      previewTab === "step1" ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-[#616161] dark:text-zinc-300"
                    )}
                  >
                    Step 1 (Upload)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("step2")}
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer",
                      previewTab === "step2" ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-[#616161] dark:text-zinc-300"
                    )}
                  >
                    Step 2 (Trim)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("step3")}
                    className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors cursor-pointer",
                      previewTab === "step3" ? "bg-indigo-600 text-white" : "bg-zinc-100 dark:bg-zinc-800 text-[#616161] dark:text-zinc-300"
                    )}
                  >
                    Step 3 (Post)
                  </button>
                </div>
              </div>

              {/* Subcard 1: Upload Modal Copy Customization */}
              <div className="p-3.5 rounded-[6px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/40 space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-[#e1e3e5]/70 dark:border-zinc-800/70">
                  <div className="h-7 w-7 rounded-[4px] bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Type className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <span className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100">
                      Upload Modal Headline & Copy
                    </span>
                    <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                      Personalize the texts displayed to members on Step 1 of the upload workflow.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Upload Headline */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-200 flex items-center justify-between">
                      <span>Modal Headline</span>
                      <span className="text-[9.5px] text-[#8c9196]">(Default: &quot;Capture the {singularName}&quot;)</span>
                    </label>
                    <input
                      type="text"
                      name="momentsUploadTitle"
                      placeholder={`Capture the ${singularName}`}
                      value={formik.values.momentsUploadTitle}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        "text-[12px] h-8 px-2.5 rounded-[4px] border bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500",
                        formik.touched.momentsUploadTitle && formik.errors.momentsUploadTitle
                          ? "border-destructive focus:ring-destructive"
                          : "border-[#d2d5d9] dark:border-zinc-700"
                      )}
                    />
                    {formik.touched.momentsUploadTitle && formik.errors.momentsUploadTitle && (
                      <span className="text-[10px] text-destructive">{formik.errors.momentsUploadTitle}</span>
                    )}
                  </div>

                  {/* Format Badge */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-200 flex items-center justify-between">
                      <span>Video Aspect Ratio / Format</span>
                      <span className="text-[9.5px] text-[#8c9196]">(Default: &quot;9:16&quot;)</span>
                    </label>
                    <input
                      type="text"
                      name="momentsUploadFormat"
                      placeholder="9:16"
                      value={formik.values.momentsUploadFormat}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        "text-[12px] h-8 px-2.5 rounded-[4px] border bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono",
                        formik.touched.momentsUploadFormat && formik.errors.momentsUploadFormat
                          ? "border-destructive focus:ring-destructive"
                          : "border-[#d2d5d9] dark:border-zinc-700"
                      )}
                    />
                  </div>
                </div>

                {/* Upload Subtitle / Description */}
                <div className="space-y-1">
                  <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-200 flex items-center justify-between">
                    <span>Modal Subtitle / Description</span>
                    <span className="text-[9.5px] text-[#8c9196]">(Default: &quot;Share your story with the world in a vertical short-form video.&quot;)</span>
                  </label>
                  <input
                    type="text"
                    name="momentsUploadDescription"
                    placeholder="Share your story with the world in a vertical short-form video."
                    value={formik.values.momentsUploadDescription}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={cn(
                      "text-[12px] h-8 px-2.5 rounded-[4px] border bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500",
                      formik.touched.momentsUploadDescription && formik.errors.momentsUploadDescription
                        ? "border-destructive focus:ring-destructive"
                        : "border-[#d2d5d9] dark:border-zinc-700"
                    )}
                  />
                  {formik.touched.momentsUploadDescription && formik.errors.momentsUploadDescription && (
                    <span className="text-[10px] text-destructive">{formik.errors.momentsUploadDescription}</span>
                  )}
                </div>

                {/* Action Card Titles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-200 flex items-center justify-between">
                      <span>Action Card Title</span>
                      <span className="text-[9.5px] text-[#8c9196]">(Default: &quot;Select from Library&quot;)</span>
                    </label>
                    <input
                      type="text"
                      name="momentsUploadCardTitle"
                      placeholder="Select from Library"
                      value={formik.values.momentsUploadCardTitle}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="text-[12px] h-8 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-200 flex items-center justify-between">
                      <span>Action Card Subtitle</span>
                      <span className="text-[9.5px] text-[#8c9196]">(Default: &quot;Choose your best video or drag & drop here&quot;)</span>
                    </label>
                    <input
                      type="text"
                      name="momentsUploadCardDescription"
                      placeholder="Choose your best video or drag & drop here"
                      value={formik.values.momentsUploadCardDescription}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="text-[12px] h-8 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Subcard 2: Duration Setting */}
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
                        Set the maximum allowed clip duration for uploaded {singularName.toLowerCase()}s (Between 3s and 120s / 2 minutes).
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
                      name="momentsMaxDuration"
                      min={3}
                      max={120}
                      value={formik.values.momentsMaxDuration}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(
                        "text-[12px] h-8 px-2.5 w-24 rounded-[4px] border bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                        formik.touched.momentsMaxDuration && formik.errors.momentsMaxDuration
                          ? "border-destructive text-destructive focus:ring-destructive"
                          : "border-[#d2d5d9] dark:border-zinc-700"
                      )}
                    />
                    <span className="text-[11px] text-[#8c9196]">
                      seconds ({formik.values.momentsMaxDuration > 60 ? (formik.values.momentsMaxDuration / 60).toFixed(1) + " mins" : formik.values.momentsMaxDuration + "s"})
                    </span>
                  </div>

                  {/* Preset Buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {[15, 30, 60, 90, 120].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => formik.setFieldValue("momentsMaxDuration", preset)}
                        className={cn(
                          "px-2 py-1 text-[10.5px] rounded-[3px] border font-medium transition-all cursor-pointer",
                          formik.values.momentsMaxDuration === preset
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                            : "bg-white dark:bg-zinc-800 border-[#d2d5d9] dark:border-zinc-700 text-[#616161] dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700"
                        )}
                      >
                        {preset}s {preset === 120 ? "(2m)" : ""}
                      </button>
                    ))}
                  </div>
                </div>

                {formik.touched.momentsMaxDuration && formik.errors.momentsMaxDuration && (
                  <div className="flex items-center gap-1.5 text-[11px] text-destructive font-medium pt-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{formik.errors.momentsMaxDuration}</span>
                  </div>
                )}
              </div>

              {/* Subcard 3: Share in Feed Settings Card */}
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
                            formik.values.allowMomentsShareInFeed
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                          )}
                        >
                          {formik.values.allowMomentsShareInFeed ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                        Permits creators to choose whether their uploaded moment is published to the community feed.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formik.values.allowMomentsShareInFeed}
                    onCheckedChange={(checked) => formik.setFieldValue("allowMomentsShareInFeed", checked)}
                  />
                </div>

                {formik.values.allowMomentsShareInFeed && (
                  <div className="pt-2.5 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70 space-y-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-300">
                        Custom Option Title (Default: &quot;Share in Feed&quot;)
                      </label>
                      <input
                        type="text"
                        name="momentsShareInFeedTitle"
                        placeholder="Share in Feed"
                        value={formik.values.momentsShareInFeedTitle}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-300">
                        Custom Option Subtitle (Default: &quot;Make this visible across your community feed&quot;)
                      </label>
                      <input
                        type="text"
                        name="momentsShareInFeedDescription"
                        placeholder="Make this visible across your community feed"
                        value={formik.values.momentsShareInFeedDescription}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Subcard 4: Add AI Label Settings Card */}
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
                            formik.values.allowMomentsAiLabel
                              ? "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400"
                              : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                          )}
                        >
                          {formik.values.allowMomentsAiLabel ? "Enabled" : "Disabled"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                        Allows creators to disclose and label synthetic AI-generated content on uploaded clips.
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formik.values.allowMomentsAiLabel}
                    onCheckedChange={(checked) => formik.setFieldValue("allowMomentsAiLabel", checked)}
                  />
                </div>

                {formik.values.allowMomentsAiLabel && (
                  <div className="pt-2.5 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70 space-y-2">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-300">
                        Custom Option Title (Default: &quot;Add AI Label&quot;)
                      </label>
                      <input
                        type="text"
                        name="momentsAiLabelTitle"
                        placeholder="Add AI Label"
                        value={formik.values.momentsAiLabelTitle}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-[#303030] dark:text-zinc-300">
                        Custom Option Subtitle (Default: &quot;Label realistic content made with AI.&quot;)
                      </label>
                      <input
                        type="text"
                        name="momentsAiLabelDescription"
                        placeholder="Label realistic content made with AI."
                        value={formik.values.momentsAiLabelDescription}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
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
        </div>

        {/* Floating Save Action Bar */}
        <FloatingSavePanel
          hasChanged={hasChanged}
          saved={false}
          isSaving={isSavingEntitySettings || isUpdatingMomentSetting || formik.isSubmitting}
          onSave={formik.handleSubmit}
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

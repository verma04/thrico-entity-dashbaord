import * as Yup from "yup";
import { Compass, Users, PlaySquare, Sparkles, Sliders, Pin, Film, Clock, Send, Rss } from "lucide-react";
import { EntitySettings } from "@/graphql/actions";
import { ModuleTabItem } from "@/components/settings/shared/module-tab-manager";

export interface CustomTabConfig {
  id: string;
  name: string;
  icon?: string;
  enabled?: boolean;
  momentIds?: string[];
}

// Formik Form Values Interface
export interface MomentsFormValues {
  ctaName: string;
  allowPublicMoments: boolean;
  enableShortUploads: boolean;
  allowEntityMomentsInFeed: boolean;
  autoModeration: boolean;
  moderatedFeed: boolean;
  uploadNotifications: boolean;

  tabs: ModuleTabItem[];
  pinnedMomentIds: string[];

  // MomentSetting fields
  momentsUploadTitle: string;
  momentsUploadDescription: string;
  momentsUploadFormat: string;
  momentsUploadCardTitle: string;
  momentsUploadCardDescription: string;
  momentsMaxDuration: number;
  allowMomentsShareInFeed: boolean;
  allowMomentsInstantPublish: boolean;
  momentsShareInFeedTitle: string;
  momentsShareInFeedDescription: string;
  allowMomentsAiLabel: boolean;
  momentsAiLabelTitle: string;
  momentsAiLabelDescription: string;
}

// Yup Validation Schema
export const momentsFormValidationSchema = Yup.object().shape({
  ctaName: Yup.string().max(60, "CTA label cannot exceed 60 characters"),
  allowPublicMoments: Yup.boolean(),
  enableShortUploads: Yup.boolean(),
  allowEntityMomentsInFeed: Yup.boolean(),
  autoModeration: Yup.boolean(),
  moderatedFeed: Yup.boolean(),
  uploadNotifications: Yup.boolean(),

  tabs: Yup.array(),
  pinnedMomentIds: Yup.array(),

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
  allowMomentsInstantPublish: Yup.boolean(),
  momentsShareInFeedTitle: Yup.string().max(60, "Option title cannot exceed 60 characters"),
  momentsShareInFeedDescription: Yup.string().max(140, "Option description cannot exceed 140 characters"),

  allowMomentsAiLabel: Yup.boolean(),
  momentsAiLabelTitle: Yup.string().max(60, "Option title cannot exceed 60 characters"),
  momentsAiLabelDescription: Yup.string().max(140, "Option description cannot exceed 140 characters"),
});

export type PreviewTabId = "step1" | "step2" | "step3" | "feed" | "navbar" | "pinned";

export const PREVIEW_TABS = [
  { id: "navbar", label: "Nav Bar", icon: Sliders },
  { id: "pinned", label: "Pinned", icon: Pin },
  { id: "step1", label: "Upload Modal", icon: Film },
  { id: "step2", label: "Trimmer", icon: Clock },
  { id: "step3", label: "Publish", icon: Send },
  { id: "feed", label: "Feed Post", icon: Rss },
] as const;

export const createDefaultTabs = (
  moduleName: string,
  singularName: string,
  entitySettings?: EntitySettings | null
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

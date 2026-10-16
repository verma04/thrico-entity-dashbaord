"use client";

import React, { useState, useMemo } from "react";
import { useFormik } from "formik";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { withModulePermission } from "@/components/hoc/with-module-permission";
import { withSubscriptionCheck } from "@/components/hoc/with-subscription-check";
import {
  useEntitySettings,
  useUpdateEntitySettings,
} from "@/graphql/actions";
import {
  useGetAllMoments,
  Moment,
  useGetMomentSetting,
  useUpdateMomentSetting,
} from "@/graphql/actions/moments";
import { PolarisFormLayout } from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { ModuleTabItem } from "@/components/settings/shared/module-tab-manager";
import { useModuleStore } from "@/store/useModuleStore";
import {
  MomentsFormValues,
  momentsFormValidationSchema,
  createDefaultTabs,
  PreviewTabId,
  NavigationTabsSection,
  AdminPinnedSection,
  FeedDistributionSection,
  CreatorStudioSection,
  ModerationSection,
  MomentsSettingsSidebar,
  NewCustomTabDialog,
  MomentSelectorModal,
} from "@/components/settings/moments";

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

  // Active Live Preview Tab Switcher (Defaults to Nav Bar preview for Navigation & CTA)
  const [previewTab, setPreviewTab] = useState<PreviewTabId>("navbar");

  // Modals state
  const [isNewTabModalOpen, setIsNewTabModalOpen] = useState(false);
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
    const rawPinned = es?.momentsPinnedMomentIds;
    return {
      ctaName: es?.momentsCtaName || "",
      allowPublicMoments: true,
      enableShortUploads: true,
      allowEntityMomentsInFeed: es?.allowEntityMomentsInFeed ?? true,
      autoModeration: true,
      moderatedFeed: false,
      uploadNotifications: false,

      tabs: createDefaultTabs(moduleName, singularName, es),
      pinnedMomentIds: Array.isArray(rawPinned) ? (rawPinned as string[]) : [],

      momentsUploadTitle: ms?.momentsUploadTitle || "",
      momentsUploadDescription: ms?.momentsUploadDescription || "",
      momentsUploadFormat: ms?.momentsUploadFormat || "9:16",
      momentsUploadCardTitle: ms?.momentsUploadCardTitle || "",
      momentsUploadCardDescription: ms?.momentsUploadCardDescription || "",
      momentsMaxDuration: ms?.momentsMaxDuration ?? 60,
      allowMomentsShareInFeed: ms?.allowMomentsShareInFeed ?? true,
      allowMomentsInstantPublish: ms?.allowMomentsInstantPublish ?? true,
      momentsShareInFeedTitle: ms?.momentsShareInFeedTitle || "Share in Feed",
      momentsShareInFeedDescription:
        ms?.momentsShareInFeedDescription || "Make this visible across your community feed",
      allowMomentsAiLabel: ms?.allowMomentsAiLabel ?? true,
      momentsAiLabelTitle: ms?.momentsAiLabelTitle || "Add AI Label",
      momentsAiLabelDescription:
        ms?.momentsAiLabelDescription || "Label realistic content made with AI.",
    };
  }, [momentSettingData, data, moduleName, singularName]);

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
              allowMomentsInstantPublish: values.allowMomentsInstantPublish,
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
        const momentsTabNames: Record<string, string> = {};
        values.tabs.forEach((t) => {
          if (t.label && t.label.trim()) {
            momentsTabNames[t.id] = t.label.trim();
          }
        });

        const connectionsTab = values.tabs.find((t) => t.id === "connections");
        const myMomentsTab = values.tabs.find((t) => t.id === "myMoments");

        const momentsCustomTabs = values.tabs
          .filter((t) => t.isCustom)
          .map((t) => ({
            id: t.id,
            name: t.label || t.defaultName,
            icon: "Sparkles",
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
              momentsTabOrder: values.tabs.map((t) => t.id),
              momentsPinnedMomentIds: values.pinnedMomentIds,
              momentsCustomTabs,
              allowEntityMomentsInFeed: values.allowEntityMomentsInFeed,
            },
          },
        });
        refetchEntitySettings?.();

        toast.success(`${moduleName} settings saved successfully!`);
      } catch (err: unknown) {
        toast.error((err as Error).message || "Failed to update settings");
      }
    },
  });

  const hasChanged = formik.dirty;

  const handleReset = () => {
    formik.resetForm();
  };

  const handleOpenNewTabModal = () => {
    setIsNewTabModalOpen(true);
  };

  const handleCreateCustomTab = (tabName: string) => {
    const trimmed = tabName.trim();
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
    formik.setFieldValue("tabs", [...formik.values.tabs, newTab]);
    setActiveCurateTarget({
      id: newTabId,
      title: `Curate Moments for "${trimmed}"`,
      description: `Select moments to feature in this custom tab.`,
      momentIds: [],
    });
    setIsCurateModalOpen(true);
  };

  const handleDeleteCustomTab = (tabId: string) => {
    const targetTab = formik.values.tabs.find((t) => t.id === tabId);
    formik.setFieldValue(
      "tabs",
      formik.values.tabs.filter((t) => t.id !== tabId)
    );
    toast.success(`Removed custom tab "${targetTab?.label || targetTab?.defaultName || "Custom"}"`);
  };

  const handleOpenCurateTab = (tabOrId: ModuleTabItem | string) => {
    const targetTab =
      typeof tabOrId === "string"
        ? formik.values.tabs.find((t) => t.id === tabOrId)
        : tabOrId;
    if (!targetTab) return;
    setActiveCurateTarget({
      id: targetTab.id,
      title: `Curate Moments for "${targetTab.label || targetTab.defaultName}"`,
      description: `Select and sequence ${singularName.toLowerCase()} clips for "${targetTab.label || targetTab.defaultName}".`,
      momentIds: targetTab.momentIds || [],
    });
    setIsCurateModalOpen(true);
  };

  // Pinned Moments Handlers
  const handleOpenCuratePinned = () => {
    setActiveCurateTarget({
      id: "__pinned__",
      title: `Curate Admin Pinned ${moduleName}`,
      description: `Select standout moments to feature at the top of the Discover feed.`,
      momentIds: formik.values.pinnedMomentIds,
    });
    setIsCurateModalOpen(true);
  };

  const handleConfirmSelectedMoments = (selectedIds: string[]) => {
    if (!activeCurateTarget) return;
    if (activeCurateTarget.id === "__pinned__") {
      formik.setFieldValue("pinnedMomentIds", selectedIds);
    } else {
      formik.setFieldValue(
        "tabs",
        formik.values.tabs.map((t) =>
          t.id === activeCurateTarget.id ? { ...t, momentIds: selectedIds } : t
        )
      );
    }
    setIsCurateModalOpen(false);
    setActiveCurateTarget(null);
  };

  const handleMovePinned = (index: number, direction: "up" | "down") => {
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= formik.values.pinnedMomentIds.length) return;
    const next = [...formik.values.pinnedMomentIds];
    const [moved] = next.splice(index, 1);
    next.splice(targetIdx, 0, moved);
    formik.setFieldValue("pinnedMomentIds", next);
  };

  const handleRemovePinned = (id: string) => {
    formik.setFieldValue(
      "pinnedMomentIds",
      formik.values.pinnedMomentIds.filter((item) => item !== id)
    );
  };

  const activeTabs = useMemo(
    () => formik.values.tabs.filter((t) => t.enabled !== false),
    [formik.values.tabs]
  );

  return (
    <div className="w-full">
      <PolarisFormLayout
        sidebar={
          <MomentsSettingsSidebar
            previewTab={previewTab}
            onSelectPreviewTab={setPreviewTab}
            formValues={formik.values}
            singularName={singularName}
            activeTabs={activeTabs}
            allTabs={formik.values.tabs}
            pinnedMomentIds={formik.values.pinnedMomentIds}
            momentsByIdMap={momentsByIdMap}
          />
        }
      >
        <div className="space-y-3.5">
          {/* Section 1: Navigation Tabs & CTA Configuration */}
          <NavigationTabsSection
            formik={formik}
            singularName={singularName}
            onPreviewNavbar={() => setPreviewTab("navbar")}
            onAddCustomTab={handleOpenNewTabModal}
            onCurateTab={handleOpenCurateTab}
            onDeleteCustomTab={handleDeleteCustomTab}
          />

          {/* Section 2: Admin Pinned Moments on Discover */}
          <AdminPinnedSection
            pinnedMomentIds={formik.values.pinnedMomentIds}
            momentsByIdMap={momentsByIdMap}
            onPreviewPinned={() => setPreviewTab("pinned")}
            onOpenCuratePinned={handleOpenCuratePinned}
            onMovePinned={handleMovePinned}
            onRemovePinned={handleRemovePinned}
          />

          {/* Section 3: Central Feed & Platform Distribution */}
          <FeedDistributionSection
            formik={formik}
            moduleName={moduleName}
            singularName={singularName}
            onPreviewFeed={() => setPreviewTab("feed")}
          />

          {/* Section 4: Creator Studio & Upload Screen Customization */}
          <CreatorStudioSection
            formik={formik}
            singularName={singularName}
            previewTab={previewTab}
            onSelectPreviewTab={setPreviewTab}
          />

          {/* Section 5: Moderation & Quality Protocols */}
          <ModerationSection formik={formik} />
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
      <NewCustomTabDialog
        isOpen={isNewTabModalOpen}
        onClose={() => setIsNewTabModalOpen(false)}
        onCreateTab={handleCreateCustomTab}
        singularName={singularName}
      />

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

"use client";

import React from "react";
import { useState } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import {
  Puzzle,
  AlertCircle,
  Smartphone,
  LayoutGrid,
  Monitor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MobileNavigation from "./mobile-navigation";
import WebNavigation from "./web-navigation";
import ModuleRegistry from "./module-registry";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";

import { gql, useMutation } from "@apollo/client";
import {
  InputUpdateEntityModule,
  useCheckEntitySubscription,
} from "@/graphql/actions";

import type {
  ModuleItem,
  ActiveTab,
  UpdateEntityModuleResponse,
} from "./types";
import { EcosystemContainer } from "@/components/layout/ecosystem";

const UPDATE_ENTITY_MODULE = gql`
  mutation UpdateEntityModule($input: [inputUpdateEntityModule]) {
    updateEntityModule(input: $input) {
      success
    }
  }
`;

const moduleData = [
  {
    id: "1",
    name: "Directory",
    enabled: true,
    required: true,
    category: "Core",
    showInMobileNavigation: true,
    showInWebNavigation: true,
    icon: null,
    isPopular: false,
    isPublicFacing: false,
    canRename: true,
  },
  {
    id: "2",
    name: "Communities",
    enabled: true,
    required: false,
    category: "Social",
    showInMobileNavigation: true,
    showInWebNavigation: true,
    icon: null,
    isPopular: true,
    isPublicFacing: false,
    canRename: true,
  },
];

export default function ModuleManagement() {
  const [updateEntityModule, { loading: updateLoading }] = useMutation<
    UpdateEntityModuleResponse,
    { input: InputUpdateEntityModule[] }
  >(UPDATE_ENTITY_MODULE);

  const { data, loading, error } = useCheckEntitySubscription();
  const subscription = data?.checkEntitySubscription;

  const [modules, setModules] = useState<ModuleItem[]>(moduleData);
  const [originalModules, setOriginalModules] =
    useState<ModuleItem[]>(moduleData);
  const [modulesInitialized, setModulesInitialized] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("management");
  const [userRole] = useState("admin");
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
    description?: string;
  } | null>(null);

  const hasChanged = React.useMemo(() => {
    if (!modulesInitialized) return false;
    if (modules.length !== originalModules.length) return true;
    for (const m of modules) {
      const orig = originalModules.find((o) => o.id === m.id);
      if (!orig) return true;
      if (
        m.enabled !== orig.enabled ||
        m.showInMobileNavigation !== orig.showInMobileNavigation ||
        m.showInWebNavigation !== orig.showInWebNavigation ||
        m.isPopular !== orig.isPopular ||
        m.showInMobileNavigationSortNumber !==
          orig.showInMobileNavigationSortNumber ||
        m.showInWebNavigationSortNumber !==
          orig.showInWebNavigationSortNumber ||
        m.customName !== orig.customName ||
        m.customIcon !== orig.customIcon ||
        m.subtitle !== orig.subtitle
      ) {
        return true;
      }
    }
    return false;
  }, [modules, originalModules, modulesInitialized]);

  const onReset = () => {
    setModules(originalModules);
    setSaved(false);
  };

  React.useEffect(() => {
    if (subscription && Array.isArray(subscription.modules)) {
      const parsedModules = subscription.modules.map((m: any) => ({
        id: m.id,
        name: m.name,
        enabled: m.enabled ?? true,
        required: m.required ?? false,
        showInMobileNavigation: m.showInMobileNavigation ?? false,
        showInWebNavigation: m.showInWebNavigation ?? false,
        icon: m.customIcon || m.icon || null,
        customIcon: m.customIcon ?? null,
        showInMobileNavigationSortNumber:
          typeof m.showInMobileNavigationSortNumber === "number"
            ? m.showInMobileNavigationSortNumber
            : undefined,
        showInWebNavigationSortNumber:
          typeof m.showInWebNavigationSortNumber === "number"
            ? m.showInWebNavigationSortNumber
            : undefined,
        isPopular: m.isPopular ?? false,
        customName: m.customName ?? null,
        subtitle: m.subtitle ?? null,
        isPublicFacing: m.isPublicFacing ?? false,
        canRename: m.canRename ?? true,
      }));
      setModules(parsedModules);
      setOriginalModules(parsedModules);
      setModulesInitialized(true);
    }
  }, [subscription]);

  const toggleModule = (id: string) => {
    if (userRole === "directory") return;
    setModules((prev) =>
      prev.map((m) => {
        if (m.id === id && !m.required) {
          return m.enabled
            ? { ...m, enabled: false, showInMobileNavigation: false }
            : { ...m, enabled: true };
        }
        return m;
      }),
    );
  };

  const togglePopular = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isPopular: !m.isPopular } : m)),
    );
  };

  const toggleNavigation = (id: string) => {
    if (userRole === "directory") return;
    setModules((prev) => {
      const currentCount = prev.filter((m) => m.showInMobileNavigation).length;
      return prev.map((m) => {
        if (m.id !== id) return m;
        if (m.showInMobileNavigation)
          return { ...m, showInMobileNavigation: false };
        if (currentCount < 3) return { ...m, showInMobileNavigation: true };
        return m;
      });
    });
  };

  const toggleWebNavigation = (id: string) => {
    if (userRole === "directory") return;
    setModules((prev) => {
      return prev.map((m) => {
        if (m.id !== id) return m;
        return { ...m, showInWebNavigation: !m.showInWebNavigation };
      });
    });
  };

  const changeCustomName = (id: string, value: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, customName: value } : m)),
    );
  };

  const changeCustomIcon = (id: string, value: string) => {
    setModules((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, customIcon: value, icon: value } : m,
      ),
    );
  };

  const changeSubtitle = (id: string, value: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, subtitle: value } : m)),
    );
  };

  const saveChanges = async () => {
    setSaving(true);
    const input: InputUpdateEntityModule[] = modules.map((m, idx) => ({
      icon: m.icon ?? null,
      id: m.id ?? null,
      name: m.name ?? null,
      isEnabled: m.enabled ?? null,
      showInMobileNavigation: m.showInMobileNavigation ?? null,
      showInMobileNavigationSortNumber: m.showInMobileNavigation
        ? idx
        : undefined,
      showInWebNavigation: m.showInWebNavigation ?? null,
      showInWebNavigationSortNumber:
        m.showInWebNavigationSortNumber ?? undefined,
      isPopular: m.isPopular ?? null,
      customName: m.customName ?? null,
      customIcon: m.customIcon ?? m.icon ?? null,
      subtitle: m.subtitle ?? null,
      isPublicFacing: m.isPublicFacing ?? false,
    }));
    try {
      const response = await updateEntityModule({
        variables: { input },
        refetchQueries: ["CheckEntitySubscription"],
      });
      if (response.data?.updateEntityModule.success) {
        setOriginalModules(modules);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        setNotification({
          type: "success",
          message: "Changes saved successfully",
        });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({
          type: "error",
          message: "Save failed",
          description: "Mutation did not succeed",
        });
      }
    } catch (err: unknown) {
      setNotification({
        type: "error",
        message: "Save failed",
        description:
          err && typeof err === "object" && "message" in err
            ? String((err as { message?: string }).message)
            : "An error occurred",
      });
    } finally {
      setSaving(false);
    }
  };

  const navigationModules = modules
    .filter((m) => m.showInMobileNavigation)
    .sort(
      (a, b) =>
        (a.showInMobileNavigationSortNumber ?? 0) -
        (b.showInMobileNavigationSortNumber ?? 0),
    );

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const navModules = Array.from(navigationModules);
    const [removed] = navModules.splice(result.source.index, 1);
    if (removed) navModules.splice(result.destination.index, 0, removed);
    setModules((prev) =>
      prev.map((m) => {
        const idx = navModules.findIndex((nm) => nm.id === m.id);
        return idx !== -1 ? { ...m, showInMobileNavigationSortNumber: idx } : m;
      }),
    );
  };

  const webNavigationModules = modules
    .filter((m) => m.showInWebNavigation)
    .sort(
      (a, b) =>
        (a.showInWebNavigationSortNumber ?? 0) -
        (b.showInWebNavigationSortNumber ?? 0),
    );

  const onDragEndWeb = (result: DropResult) => {
    if (!result.destination) return;
    const navModules = Array.from(webNavigationModules);
    const [removed] = navModules.splice(result.source.index, 1);
    if (removed) navModules.splice(result.destination.index, 0, removed);
    setModules((prev) =>
      prev.map((m) => {
        const idx = navModules.findIndex((nm) => nm.id === m.id);
        return idx !== -1 ? { ...m, showInWebNavigationSortNumber: idx } : m;
      }),
    );
  };

  const filteredModules = modules
    .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const webNavDiff =
        (a.showInWebNavigationSortNumber ?? 999) -
        (b.showInWebNavigationSortNumber ?? 999);
      if (webNavDiff !== 0) return webNavDiff;

      if (a.isPopular !== b.isPopular) return a.isPopular ? -1 : 1;

      return (
        (a.showInMobileNavigationSortNumber ?? 999) -
        (b.showInMobileNavigationSortNumber ?? 999)
      );
    });

  const enabledCount = modules.filter((m) => m.enabled).length;
  const navCount = modules.filter((m) => m.showInMobileNavigation).length;
  const webNavCount = modules.filter((m) => m.showInWebNavigation).length;
  const publicCount = modules.filter((m) => m.isPublicFacing).length;
  const internalCount = modules.filter((m) => !m.isPublicFacing).length;

  // --- Loading state ---
  if (loading) {
    return (
      <EcosystemWrapper>
        <div className="rounded-xl border border-border/80 bg-card shadow-sm p-5 animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-muted" />
            <div className="space-y-2">
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-3 w-64 bg-muted rounded" />
            </div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-muted/50 rounded-lg" />
          ))}
        </div>
      </EcosystemWrapper>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <EcosystemWrapper>
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border bg-red-50 border-red-200">
          <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-semibold text-red-800">
              Failed to load modules
            </p>
            <p className="text-[12px] text-red-600 mt-0.5">{error.message}</p>
          </div>
        </div>
      </EcosystemWrapper>
    );
  }

  return (
    <EcosystemWrapper>
      {/* Page header */}
      <EcosystemHeader
        title="Modules"
        description="Activate, configure and sequence modular capabilities across your entity."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Modules" },
        ]}
        icon={Puzzle}
        badgeText="Platform"
        showLiveIndicator={false}
      />

      <EcosystemContainer className="p-0 border-none bg-transparent shadow-none ring-0">
        <div className="px-6 py-8 space-y-6">
          {/* Notification toast */}
          {notification && (
            <div
              className={cn(
                "flex items-start gap-3 px-4 py-3 rounded-xl border",
                notification.type === "error"
                  ? "bg-red-50 border-red-200"
                  : "bg-emerald-50 border-emerald-200",
              )}
            >
              <div
                className={cn(
                  "w-1.5 h-4 rounded-full shrink-0 mt-0.5",
                  notification.type === "error"
                    ? "bg-red-500"
                    : "bg-emerald-500",
                )}
              />
              <div>
                <p
                  className={cn(
                    "text-[12px] font-semibold leading-none",
                    notification.type === "error"
                      ? "text-red-700"
                      : "text-emerald-700",
                  )}
                >
                  {notification.message}
                </p>
                {notification.description && (
                  <p className="text-[11px] text-muted-foreground mt-1">
                    {notification.description}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Main card */}
          <div className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
            {/* Card header with tabs + stats */}
            <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-0.5 bg-muted p-0.5 rounded-md border border-border mr-2">
                <button
                  onClick={() => setActiveTab("management")}
                  className={cn(
                    "flex items-center gap-1 h-6 px-2 rounded-sm text-[11px] font-medium transition-all",
                    activeTab === "management"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <LayoutGrid className="h-3 w-3" />
                  Registry
                </button>
                <button
                  onClick={() => setActiveTab("navigation")}
                  className={cn(
                    "flex items-center gap-1 h-6 px-2 rounded-sm text-[11px] font-medium transition-all",
                    activeTab === "navigation"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Smartphone className="h-3 w-3" />
                  Mobile Nav
                </button>
                <button
                  onClick={() => setActiveTab("webNavigation")}
                  className={cn(
                    "flex items-center gap-1 h-6 px-2 rounded-sm text-[11px] font-medium transition-all",
                    activeTab === "webNavigation"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Monitor className="h-3 w-3" />
                  Web Nav
                </button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
                  {enabledCount} / {modules.length} active
                </span>
                <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                  {webNavCount} in web nav
                </span>
                <span className="text-[11px] font-semibold text-violet-700 bg-violet-50 border border-violet-200 px-2.5 py-1 rounded-md">
                  {navCount} / 3 mobile nav
                </span>
              </div>
            </div>

            {/* Tab content */}
            {activeTab === "management" && (
              <ModuleRegistry
                modules={modules}
                filteredModules={filteredModules}
                searchTerm={searchTerm}
                userRole={userRole}
                publicCount={publicCount}
                internalCount={internalCount}
                onSearchChange={setSearchTerm}
                onToggleModule={toggleModule}
                onTogglePopular={togglePopular}
                onToggleNavigation={toggleNavigation}
                onToggleWebNavigation={toggleWebNavigation}
                onChangeCustomName={changeCustomName}
                onChangeCustomIcon={changeCustomIcon}
                onChangeSubtitle={changeSubtitle}
              />
            )}

            {activeTab === "navigation" && (
              <div className="p-5">
                <MobileNavigation
                  modules={modules}
                  navigationModules={navigationModules}
                  userRole={userRole}
                  saving={saving}
                  saveChanges={saveChanges}
                  onDragEnd={onDragEnd}
                  toggleNavigation={toggleNavigation}
                />
              </div>
            )}

            {activeTab === "webNavigation" && (
              <div className="p-5">
                <WebNavigation
                  modules={modules}
                  navigationModules={webNavigationModules}
                  userRole={userRole}
                  saving={saving}
                  saveChanges={saveChanges}
                  onDragEnd={onDragEndWeb}
                  toggleNavigation={toggleWebNavigation}
                />
              </div>
            )}
          </div>
        </div>
      </EcosystemContainer>

      <FloatingSavePanel
        hasChanged={hasChanged}
        saved={saved}
        isSaving={saving}
        onSave={saveChanges}
        onReset={onReset}
      />
    </EcosystemWrapper>
  );
}

"use client";

import React from "react";
import { useState } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import { Search, Puzzle, AlertCircle, Save, Star, Smartphone, LayoutGrid, Loader2 } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import MobileNavigation from "./mobile-navigation";
import { EcosystemWrapper } from "@/components/layout/ecosystem/ecosystem-wrapper";
import { EcosystemHeader } from "@/components/layout/ecosystem/ecosystem-header";
import { EcosystemActionBar } from "@/components/layout/ecosystem/ecosystem-action-bar";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";

import { gql, useMutation } from "@apollo/client";
import {
  InputUpdateEntityModule,
  useCheckEntitySubscription,
} from "@/graphql/actions";

interface UpdateEntityModuleResponse {
  updateEntityModule: { success: boolean };
}

const UPDATE_ENTITY_MODULE = gql`
  mutation UpdateEntityModule($input: [inputUpdateEntityModule]) {
    updateEntityModule(input: $input) {
      success
    }
  }
`;

const moduleData = [
  { id: "1", name: "Directory", enabled: true, required: true, category: "Core", showInMobileNavigation: true, showInWebNavigation: true, icon: null, isPopular: false },
  { id: "2", name: "Communities", enabled: true, required: false, category: "Social", showInMobileNavigation: true, showInWebNavigation: true, icon: null, isPopular: true },
];

interface ModuleItem {
  id: string;
  name: string;
  icon: string | null;
  enabled: boolean;
  required?: boolean;
  showInMobileNavigation: boolean;
  showInWebNavigation: boolean;
  isPopular: boolean;
  showInMobileNavigationSortNumber?: number;
}

const getNavIcon = (icon: string | null) => {
  if (!icon || typeof icon !== "string" || !(icon in LucideIcons)) {
    return <Puzzle className="h-4 w-4 text-slate-500" />;
  }
  const IconComponent = (LucideIcons as any)[icon] as React.ElementType;
  return <IconComponent className="h-4 w-4 text-slate-500" />;
};

type ActiveTab = "management" | "navigation";

export default function ModuleManagement() {
  const [updateEntityModule, { loading: updateLoading }] = useMutation<
    UpdateEntityModuleResponse,
    { input: InputUpdateEntityModule[] }
  >(UPDATE_ENTITY_MODULE);

  const { data, loading, error } = useCheckEntitySubscription();
  const subscription = data?.checkEntitySubscription;

  const [modules, setModules] = useState<ModuleItem[]>(moduleData);
  const [originalModules, setOriginalModules] = useState<ModuleItem[]>(moduleData);
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
        m.isPopular !== orig.isPopular ||
        m.showInMobileNavigationSortNumber !== orig.showInMobileNavigationSortNumber
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
    if (!modulesInitialized && subscription && Array.isArray(subscription.modules)) {
      const parsedModules = subscription.modules.map((m: any) => ({
        id: m.id,
        name: m.name,
        enabled: m.enabled ?? true,
        required: m.required ?? false,
        showInMobileNavigation: m.showInMobileNavigation ?? false,
        showInWebNavigation: m.showInWebNavigation ?? false,
        icon: m.icon ?? null,
        showInMobileNavigationSortNumber:
          typeof m.showInMobileNavigationSortNumber === "number"
            ? m.showInMobileNavigationSortNumber
            : undefined,
        isPopular: m.isPopular ?? false,
      }));
      setModules(parsedModules);
      setOriginalModules(parsedModules);
      setModulesInitialized(true);
    }
  }, [subscription, modulesInitialized]);

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
      })
    );
  };

  const toggleNavigation = (id: string) => {
    if (userRole === "directory") return;
    setModules((prev) => {
      const currentCount = prev.filter((m) => m.showInMobileNavigation).length;
      return prev.map((m) => {
        if (m.id !== id) return m;
        if (m.showInMobileNavigation) return { ...m, showInMobileNavigation: false };
        if (currentCount < 3) return { ...m, showInMobileNavigation: true };
        return m;
      });
    });
  };

  const saveChanges = async () => {
    setSaving(true);
    const input: InputUpdateEntityModule[] = modules.map((m, idx) => ({
      icon: m.icon ?? null,
      id: m.id ?? null,
      name: m.name ?? null,
      isEnabled: m.enabled ?? null,
      showInMobileNavigation: m.showInMobileNavigation ?? null,
      showInMobileNavigationSortNumber: m.showInMobileNavigation ? idx : undefined,
      showInWebNavigation: m.showInWebNavigation ?? null,
      isPopular: m.isPopular ?? null,
    }));
    try {
      const response = await updateEntityModule({ variables: { input } });
      if (response.data?.updateEntityModule.success) {
        setOriginalModules(modules);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        setNotification({ type: "success", message: "Changes saved successfully" });
        setTimeout(() => setNotification(null), 3000);
      } else {
        setNotification({ type: "error", message: "Save failed", description: "Mutation did not succeed" });
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
    .sort((a, b) => (a.showInMobileNavigationSortNumber ?? 0) - (b.showInMobileNavigationSortNumber ?? 0));

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const navModules = Array.from(navigationModules);
    const [removed] = navModules.splice(result.source.index, 1);
    if (removed) navModules.splice(result.destination.index, 0, removed);
    setModules((prev) =>
      prev.map((m) => {
        const idx = navModules.findIndex((nm) => nm.id === m.id);
        return idx !== -1 ? { ...m, showInMobileNavigationSortNumber: idx } : m;
      })
    );
  };

  const filteredModules = modules.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const enabledCount = modules.filter((m) => m.enabled).length;
  const navCount = modules.filter((m) => m.showInMobileNavigation).length;

  // --- Loading state ---
  if (loading) {
    return (
      <EcosystemWrapper>
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm p-5 animate-pulse space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-100" />
            <div className="space-y-2">
              <div className="h-4 w-40 bg-slate-100 rounded" />
              <div className="h-3 w-64 bg-slate-100 rounded" />
            </div>
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-lg" />
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
            <p className="text-[13px] font-semibold text-red-800">Failed to load modules</p>
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
        icon={Puzzle}
        badgeText="Platform"
        showLiveIndicator={false}
      />

      {/* Notification toast */}
      {notification && (
        <div
          className={cn(
            "flex items-start gap-3 px-4 py-3 rounded-xl border",
            notification.type === "error"
              ? "bg-red-50 border-red-200"
              : "bg-emerald-50 border-emerald-200"
          )}
        >
          <div
            className={cn(
              "w-1.5 h-4 rounded-full shrink-0 mt-0.5",
              notification.type === "error" ? "bg-red-500" : "bg-emerald-500"
            )}
          />
          <div>
            <p
              className={cn(
                "text-[12px] font-semibold leading-none",
                notification.type === "error" ? "text-red-700" : "text-emerald-700"
              )}
            >
              {notification.message}
            </p>
            {notification.description && (
              <p className="text-[11px] text-slate-400 mt-1">{notification.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Main card */}
      <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        {/* Card header with tabs + stats */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            <button
              onClick={() => setActiveTab("management")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150",
                activeTab === "management"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              Module Registry
            </button>
            <button
              onClick={() => setActiveTab("navigation")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150",
                activeTab === "navigation"
                  ? "bg-white text-slate-900 shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile Navigation
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Stat pills */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                {enabledCount} / {modules.length} enabled
              </span>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md">
                {navCount} / 3 in nav
              </span>
            </div>

          </div>
        </div>

        {/* Tab content */}
        {activeTab === "management" && (
          <div className="p-5 space-y-4">
            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search modules..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-8 text-[13px] border-slate-200 bg-slate-50 focus:bg-white"
              />
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-3 pb-1 border-b border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Module</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-center w-16">Popular</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-center w-16">Enabled</span>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-center w-16">Mobile Nav</span>
            </div>

            {/* Module rows */}
            <div className="space-y-1">
              {filteredModules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                  <Puzzle className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-[13px]">No modules found</p>
                </div>
              ) : (
                filteredModules.map((module) => (
                  <div
                    key={module.id}
                    className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-3 py-3 rounded-lg border border-transparent hover:bg-slate-50 hover:border-slate-100 transition-colors group"
                  >
                    {/* Module info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-7 w-7 rounded-md bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                        {getNavIcon(module.icon)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-medium text-slate-800 truncate">
                            {module.name}
                          </span>
                          {module.required && (
                            <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded uppercase tracking-wide">
                              Required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Popular toggle */}
                    <div className="w-16 flex justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() =>
                                setModules((prev) =>
                                  prev.map((m) =>
                                    m.id === module.id ? { ...m, isPopular: !m.isPopular } : m
                                  )
                                )
                              }
                              className={cn(
                                "h-6 w-6 rounded flex items-center justify-center transition-colors",
                                module.isPopular
                                  ? "text-amber-500 bg-amber-50 border border-amber-200"
                                  : "text-slate-300 hover:text-amber-400 hover:bg-amber-50 border border-transparent hover:border-amber-100"
                              )}
                            >
                              <Star className="h-3.5 w-3.5" fill={module.isPopular ? "currentColor" : "none"} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {module.isPopular ? "Remove from popular" : "Mark as popular"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Enabled toggle */}
                    <div className="w-16 flex justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Switch
                                checked={module.enabled}
                                onCheckedChange={() => toggleModule(module.id)}
                                disabled={module.required || userRole === "directory"}
                                className="scale-90"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {module.required
                              ? "Required — cannot disable"
                              : module.enabled
                              ? "Disable module"
                              : "Enable module"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Mobile nav toggle */}
                    <div className="w-16 flex justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Switch
                                checked={module.showInMobileNavigation}
                                onCheckedChange={() => toggleNavigation(module.id)}
                                disabled={
                                  userRole === "directory" ||
                                  !module.enabled ||
                                  (!module.showInMobileNavigation &&
                                    modules.filter((m) => m.showInMobileNavigation).length >= 3)
                                }
                                className="scale-90"
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {!module.enabled
                              ? "Enable module first"
                              : module.showInMobileNavigation
                              ? "Remove from nav"
                              : modules.filter((m) => m.showInMobileNavigation).length >= 3
                              ? "Max 3 nav slots"
                              : "Add to navigation"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
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
      </div>

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

"use client";

import React from "react";
import { useState } from "react";
import type { DropResult } from "@hello-pangea/dnd";
import { Search, Puzzle, AlertCircle, Save, Star, Smartphone, LayoutGrid, Loader2, Globe, Monitor, Lock, Info, Pencil } from "lucide-react";
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
import WebNavigation from "./web-navigation";
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
  { id: "1", name: "Directory", enabled: true, required: true, category: "Core", showInMobileNavigation: true, showInWebNavigation: true, icon: null, isPopular: false, isPublicFacing: false, canRename: true },
  { id: "2", name: "Communities", enabled: true, required: false, category: "Social", showInMobileNavigation: true, showInWebNavigation: true, icon: null, isPopular: true, isPublicFacing: false, canRename: true },
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
  showInWebNavigationSortNumber?: number;
  customName?: string | null;
  isPublicFacing: boolean;
  canRename: boolean;
}

const getNavIcon = (icon: string | null, enabled: boolean = true) => {
  if (!icon || typeof icon !== "string" || !(icon in LucideIcons)) {
    return <Puzzle className={cn("h-4 w-4", enabled ? "text-muted-foreground" : "text-muted-foreground/40")} />;
  }
  const IconComponent = (LucideIcons as any)[icon] as React.ElementType;
  return <IconComponent className={cn("h-4 w-4", enabled ? "text-muted-foreground" : "text-muted-foreground/40")} />;
};

type ActiveTab = "management" | "navigation" | "webNavigation";

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
        m.showInWebNavigation !== orig.showInWebNavigation ||
        m.isPopular !== orig.isPopular ||
        m.showInMobileNavigationSortNumber !== orig.showInMobileNavigationSortNumber ||
        m.showInWebNavigationSortNumber !== orig.showInWebNavigationSortNumber ||
        m.customName !== orig.customName
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
        showInWebNavigationSortNumber:
          typeof m.showInWebNavigationSortNumber === "number"
            ? m.showInWebNavigationSortNumber
            : undefined,
        isPopular: m.isPopular ?? false,
        customName: m.customName ?? null,
        isPublicFacing: m.isPublicFacing ?? false,
        canRename: m.canRename ?? true,
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

  const toggleWebNavigation = (id: string) => {
    if (userRole === "directory") return;
    setModules((prev) => {
      return prev.map((m) => {
        if (m.id !== id) return m;
        return { ...m, showInWebNavigation: !m.showInWebNavigation };
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
      showInWebNavigationSortNumber: m.showInWebNavigationSortNumber ?? undefined,
      isPopular: m.isPopular ?? null,
      customName: m.customName ?? null,
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

  const webNavigationModules = modules
    .filter((m) => m.showInWebNavigation)
    .sort((a, b) => (a.showInWebNavigationSortNumber ?? 0) - (b.showInWebNavigationSortNumber ?? 0));

  const onDragEndWeb = (result: DropResult) => {
    if (!result.destination) return;
    const navModules = Array.from(webNavigationModules);
    const [removed] = navModules.splice(result.source.index, 1);
    if (removed) navModules.splice(result.destination.index, 0, removed);
    setModules((prev) =>
      prev.map((m) => {
        const idx = navModules.findIndex((nm) => nm.id === m.id);
        return idx !== -1 ? { ...m, showInWebNavigationSortNumber: idx } : m;
      })
    );
  };

  const filteredModules = modules
    .filter((m) => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      const webNavDiff = (a.showInWebNavigationSortNumber ?? 999) - (b.showInWebNavigationSortNumber ?? 999);
      if (webNavDiff !== 0) return webNavDiff;

      if (a.isPopular !== b.isPopular) return a.isPopular ? -1 : 1;

      return (a.showInMobileNavigationSortNumber ?? 999) - (b.showInMobileNavigationSortNumber ?? 999);
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
              <p className="text-[11px] text-muted-foreground mt-1">{notification.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Main card */}
      <div className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
        {/* Card header with tabs + stats */}
        <div className="px-5 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg">
            <button
              onClick={() => setActiveTab("management")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150",
                activeTab === "management"
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
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
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Smartphone className="h-3.5 w-3.5" />
              Mobile Navigation
            </button>
            <button
              onClick={() => setActiveTab("webNavigation")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-semibold transition-all duration-150",
                activeTab === "webNavigation"
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Monitor className="h-3.5 w-3.5" />
              Web Navigation
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
          <div className="p-5 space-y-4">
            {/* Search + Info bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
              <div className="relative max-w-sm w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search modules..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 h-8 text-[13px] border-border bg-muted/50 focus:bg-card"
                />
              </div>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3 w-3 text-emerald-500" />
                  <span className="font-medium">{publicCount} Public</span>
                </span>
                <span className="text-border">•</span>
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3 w-3 text-slate-400" />
                  <span className="font-medium">{internalCount} Internal</span>
                </span>
              </div>
            </div>

            {/* Column headers */}
            <div className="grid grid-cols-[2px_1.5fr_1.5fr_auto_auto_auto_auto] items-end gap-4 px-3 pb-2 border-b border-border">
              <span></span>
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Module</span>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Display Name</span>
                <p className="text-[9px] text-muted-foreground/60 mt-0.5">Rename for your members</p>
              </div>
              <div className="w-16 text-center">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Popular</span>
                <p className="text-[9px] text-muted-foreground/60 mt-0.5">Featured</p>
              </div>
              <div className="w-16 text-center">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Status</span>
                <p className="text-[9px] text-muted-foreground/60 mt-0.5">On / Off</p>
              </div>
              <div className="w-16 text-center">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Mobile</span>
                <p className="text-[9px] text-muted-foreground/60 mt-0.5">App nav bar</p>
              </div>
              <div className="w-16 text-center">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Web</span>
                <p className="text-[9px] text-muted-foreground/60 mt-0.5">Sidebar nav</p>
              </div>
            </div>

            {/* Module rows */}
            <div className="space-y-0.5">
              {filteredModules.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Puzzle className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-[13px]">No modules found</p>
                </div>
              ) : (
                filteredModules.map((module) => (
                  <div
                    key={module.id}
                    className={cn(
                      "grid grid-cols-[2px_1.5fr_1.5fr_auto_auto_auto_auto] items-center gap-4 px-3 py-3 rounded-lg border transition-all duration-200 group",
                      module.enabled
                        ? "border-transparent hover:bg-muted/40 hover:border-border/60"
                        : "border-transparent bg-muted/20 opacity-60 hover:opacity-80"
                    )}
                  >
                    {/* Left accent bar */}
                    <div className={cn(
                      "w-0.5 h-8 rounded-full transition-colors",
                      !module.enabled
                        ? "bg-muted-foreground/20"
                        : module.isPublicFacing
                        ? "bg-emerald-400"
                        : "bg-slate-300"
                    )} />

                    {/* Module info */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors",
                        module.enabled
                          ? module.isPublicFacing
                            ? "bg-emerald-50 border-emerald-200/60"
                            : "bg-muted border-border/60"
                          : "bg-muted/50 border-border/30"
                      )}>
                        {getNavIcon(module.icon, module.enabled)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={cn(
                            "text-[13px] font-medium truncate transition-colors",
                            module.enabled ? "text-foreground" : "text-muted-foreground"
                          )}>
                            {module.customName || module.name}
                          </span>
                          {module.customName && module.customName !== module.name && (
                            <span className="text-[10px] text-muted-foreground/50">
                              ({module.name})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          {module.required && (
                            <span className="text-[9px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/60 px-1.5 py-px rounded uppercase tracking-wide">
                              Required
                            </span>
                          )}
                          {module.isPublicFacing ? (
                            <span className="text-[9px] font-medium text-emerald-600 flex items-center gap-0.5">
                              <Globe className="h-2.5 w-2.5" />
                              Public
                            </span>
                          ) : (
                            <span className="text-[9px] font-medium text-slate-400 flex items-center gap-0.5">
                              <Lock className="h-2.5 w-2.5" />
                              Internal
                            </span>
                          )}
                          {!module.canRename && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <Lock className="h-2.5 w-2.5 text-muted-foreground/30" />
                                </TooltipTrigger>
                                <TooltipContent>Cannot rename this module</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Custom Name Input */}
                    <div className="min-w-0 pr-4">
                      {module.canRename && userRole !== "directory" ? (
                        <div className="relative group/input">
                          <Input
                            value={module.customName ?? ""}
                            placeholder={module.name}
                            onChange={(e) => {
                              setModules((prev) =>
                                prev.map((m) =>
                                  m.id === module.id ? { ...m, customName: e.target.value } : m
                                )
                              );
                            }}
                            disabled={!module.enabled}
                            className={cn(
                              "h-8 text-[13px] font-medium w-full transition-colors",
                              !module.enabled && "opacity-50"
                            )}
                          />
                          <Pencil className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/30 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
                        </div>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="h-8 flex items-center px-3 rounded-md bg-muted/30 border border-border/30 cursor-not-allowed">
                                <span className="text-[12px] text-muted-foreground/50 truncate">
                                  {module.customName || module.name}
                                </span>
                                <Lock className="h-3 w-3 text-muted-foreground/30 ml-auto shrink-0" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {userRole === "directory"
                                ? "Insufficient permissions"
                                : "Renaming is disabled for this module"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>

                    {/* Popular toggle */}
                    <div className="w-16 flex justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => {
                                if (module.isPublicFacing) return;
                                setModules((prev) =>
                                  prev.map((m) =>
                                    m.id === module.id ? { ...m, isPopular: !m.isPopular } : m
                                  )
                                );
                              }}
                              disabled={module.isPublicFacing}
                              className={cn(
                                "h-7 w-7 rounded-md flex items-center justify-center transition-all",
                                module.isPopular
                                  ? "text-amber-500 bg-amber-50 border border-amber-200 shadow-sm shadow-amber-100"
                                  : "text-muted-foreground/30 hover:text-amber-400 hover:bg-amber-50/50 border border-transparent hover:border-amber-100",
                                module.isPublicFacing && "opacity-40 cursor-not-allowed"
                              )}
                            >
                              <Star className="h-3.5 w-3.5" fill={module.isPopular ? "currentColor" : "none"} />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            {module.isPublicFacing
                              ? "Public module — popularity managed automatically"
                              : module.isPopular
                              ? "Remove from popular"
                              : "Mark as popular"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Enabled toggle */}
                    <div className="w-16 flex justify-center">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex flex-col items-center gap-0.5">
                              <Switch
                                checked={module.enabled}
                                onCheckedChange={() => toggleModule(module.id)}
                                disabled={module.required || userRole === "directory"}
                                className="scale-90"
                              />
                              <span className={cn(
                                "text-[9px] font-medium transition-colors",
                                module.enabled ? "text-emerald-600" : "text-muted-foreground/40"
                              )}>
                                {module.enabled ? "On" : "Off"}
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {module.required
                              ? "Required — cannot disable"
                              : module.enabled
                              ? "Click to disable this module"
                              : "Click to enable this module"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>

                    {/* Mobile nav toggle */}
                    <div className="w-16 flex justify-center">
                      {!module.isPublicFacing ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="h-7 w-10 rounded-md bg-muted/20 border border-dashed border-border/40 flex items-center justify-center">
                                <span className="text-muted-foreground/30 text-[9px] font-semibold">N/A</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[200px]">
                              Internal module — only visible in the admin dashboard, not in member-facing navigation
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col items-center gap-0.5">
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
                                {module.showInMobileNavigation && (
                                  <span className="text-[9px] font-medium text-violet-500">Active</span>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {!module.enabled
                                ? "Enable module first"
                                : module.showInMobileNavigation
                                ? "Remove from mobile navigation"
                                : modules.filter((m) => m.showInMobileNavigation).length >= 3
                                ? "Maximum 3 mobile nav slots reached"
                                : "Add to mobile app navigation bar"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>

                    {/* Web nav toggle */}
                    <div className="w-16 flex justify-center">
                      {!module.isPublicFacing ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <div className="h-7 w-10 rounded-md bg-muted/20 border border-dashed border-border/40 flex items-center justify-center">
                                <span className="text-muted-foreground/30 text-[9px] font-semibold">N/A</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-[200px]">
                              Internal module — only visible in the admin dashboard, not in member-facing navigation
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col items-center gap-0.5">
                                <Switch
                                  checked={module.showInWebNavigation}
                                  onCheckedChange={() => toggleWebNavigation(module.id)}
                                  disabled={userRole === "directory" || !module.enabled}
                                  className="scale-90"
                                />
                                {module.showInWebNavigation && (
                                  <span className="text-[9px] font-medium text-blue-500">Active</span>
                                )}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {!module.enabled
                                ? "Enable module first"
                                : module.showInWebNavigation
                                ? "Remove from website sidebar"
                                : "Add to website sidebar navigation"}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Legend footer */}
            <div className="flex items-center gap-4 pt-3 mt-2 border-t border-border/50">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="text-[10px] text-muted-foreground">Public — visible to members</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-slate-300" />
                <span className="text-[10px] text-muted-foreground">Internal — admin dashboard only</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                <span className="text-[10px] text-muted-foreground">Disabled</span>
              </div>
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

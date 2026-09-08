"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  GripVertical,
  X,
  Plus,
  Puzzle,
  Info,
  Home,
  Monitor,
  Globe,
  Layers,
  Sparkles,
  ChevronRight,
  Trophy,
  User,
  UserPlus,
  Bell,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getCustomDomain, getThricoDomain } from "@/graphql/actions/domain";
import { useGetEntity } from "@/graphql/actions";
import { getNavIcon } from "./utils";
import type { ModuleItem } from "./types";

export const dashboardNavigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
];

export const accountNavigation = [
  {
    name: "Gamification",
    href: "/dashboard/gamification",
    icon: Trophy,
    description: "Member points, achievement badges, leaderboards, and streak tracking.",
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
    description: "User public profile, bio, personal portfolio, and social identity.",
  },
  {
    name: "Refer & Earn",
    href: "/dashboard/refer",
    icon: UserPlus,
    description: "Referral links, invite tracking, community tier rewards, and perks.",
  },
  {
    name: "Notifications",
    href: "/dashboard/notifications",
    icon: Bell,
    description: "Real-time updates, interaction alerts, system announcements, and messages.",
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Account security, notifications preferences, credentials, and settings.",
  },
];

interface WebNavigationProps {
  modules: ModuleItem[];
  navigationModules: ModuleItem[];
  userRole: string;
  saving: boolean;
  saveChanges: () => void;
  onDragEnd: (result: DropResult) => void;
  toggleNavigation: (id: string) => void;
}

const WebNavigation: React.FC<WebNavigationProps> = ({
  modules,
  navigationModules,
  userRole,
  onDragEnd,
  toggleNavigation,
}) => {
  const [selectedPreviewModule, setSelectedPreviewModule] =
    useState<string>("dashboard");
  const [activeSectionTab, setActiveSectionTab] = useState<
    "modules" | "account" | "dashboard"
  >("modules");

  const { data: thricoData } = getThricoDomain();
  const { data: customData } = getCustomDomain();
  const { data: entityData } = useGetEntity();

  const NEXT_PUBLIC_SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL || "thrico.community";
  const customDomain = customData?.getCustomDomain?.domain;
  const thricoDomain = thricoData?.getThricoDomain?.domain;

  const resolvedDomainUrl = customDomain
    ? `https://${customDomain}/dashboard`
    : thricoDomain
      ? `https://${thricoDomain}.${NEXT_PUBLIC_SITE_URL}/dashboard`
      : "https://app.thrico.community/dashboard";

  const entityName = entityData?.getEntity?.name || "Entity Space";
  const entityLogo = entityData?.getEntity?.logo;

  // Available modules not yet in web navigation
  const availableModules = modules.filter(
    (m) => m.enabled && m.isPublicFacing && !m.showInWebNavigation,
  );

  const activeModuleItem = navigationModules.find(
    (m) => m.id === selectedPreviewModule,
  );
  const activeAccountItem = accountNavigation.find(
    (a) => `account-${a.name}` === selectedPreviewModule,
  );

  return (
    <div className="space-y-6">
      {/* Information Header Guide */}
      <div className="flex items-start gap-3.5 px-4 py-3.5 rounded-xl border border-blue-200/60 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-900/40">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-[13px] font-semibold text-blue-950 dark:text-blue-200">
              Web Sidebar Navigation Sequence
            </p>
            <p className="text-[12px] text-blue-800/80 dark:text-blue-400/80 mt-0.5">
              Sequence how modules appear in your entity&apos;s main web dashboard
              sidebar. Drag items in the center to reorder.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800">
              {navigationModules.length} Active in Center
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full border bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800">
              {accountNavigation.length} Account Tabs
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Web Browser / Dashboard Mockup Preview */}
        <div className="lg:col-span-5 xl:col-span-6 flex flex-col items-center">
          <div className="w-full rounded-2xl border border-border/90 bg-card shadow-xl overflow-hidden">
            {/* Browser Top Chrome Bar */}
            <div className="px-4 py-2.5 bg-muted/60 border-b border-border/80 flex items-center gap-3">
              <div className="flex items-center gap-1.5 shrink-0">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
              </div>
              <div className="flex-1 bg-background/80 border border-border/60 rounded-md px-2.5 py-1 text-[10px] font-mono text-muted-foreground flex items-center gap-1.5 truncate">
                <Globe className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                <span className="truncate">{resolvedDomainUrl}</span>
              </div>
            </div>

            {/* Dashboard Mockup Split Canvas */}
            <div className="flex h-[490px] bg-background">
              {/* Mini Sidebar */}
              <div className="w-52 bg-muted/30 border-r border-border/70 p-3 flex flex-col justify-start overflow-y-auto no-scrollbar">
                <div className="space-y-3">
                  {/* Entity Brand Header */}
                  <div className="flex items-center gap-2 px-2 py-1">
                    {entityLogo ? (
                      <img
                        src={entityLogo}
                        alt={entityName}
                        className="h-6 w-6 rounded-md object-cover shrink-0 border border-border/40"
                      />
                    ) : (
                      <div className="h-6 w-6 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold text-xs shrink-0">
                        {entityName.charAt(0).toUpperCase() || "E"}
                      </div>
                    )}
                    <div className="min-w-0 flex-1 leading-tight">
                      <span className="text-[12px] font-bold text-foreground truncate block">
                        {entityName}
                      </span>
                      <span className="text-[10px] text-muted-foreground truncate block">
                        Community Platform
                      </span>
                    </div>
                  </div>

                  {/* 1. Dashboard Navigation (Top) */}
                  <div className="space-y-0.5">
                    {dashboardNavigation.map((item) => {
                      const isSelected = selectedPreviewModule === "dashboard";
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setSelectedPreviewModule("dashboard")}
                          className={cn(
                            "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] font-medium transition-colors",
                            isSelected
                              ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground",
                          )}
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" />
                          <span>{item.name}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* 2. Main Navigation Modules (Center - User Customizable) */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between px-2 mb-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        Modules
                      </p>
                      <span className="text-[9px] font-mono text-muted-foreground/70">
                        {navigationModules.length}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {navigationModules.map((module) => {
                        const isSelected = selectedPreviewModule === module.id;
                        return (
                          <button
                            key={module.id}
                            type="button"
                            onClick={() => setSelectedPreviewModule(module.id)}
                            className={cn(
                              "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] font-medium transition-colors",
                              isSelected
                                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            <span className="shrink-0">
                              {getNavIcon(module.customIcon || module.icon, true)}
                            </span>
                            <span className="truncate">
                              {module.customName || module.name}
                            </span>
                          </button>
                        );
                      })}

                      {navigationModules.length === 0 && (
                        <div className="py-3 text-center text-[10px] text-muted-foreground/60 italic border border-dashed border-border/50 rounded-lg">
                          No modules active
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 3. Account Navigation (Bottom / Tabs) */}
                  <div className="pt-1">
                    <div className="flex items-center justify-between px-2 mb-1">
                      <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                        Account
                      </p>
                      <span className="text-[9px] font-mono text-muted-foreground/70">
                        {accountNavigation.length}
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {accountNavigation.map((item) => {
                        const isSelected =
                          selectedPreviewModule === `account-${item.name}`;
                        const Icon = item.icon;
                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() =>
                              setSelectedPreviewModule(`account-${item.name}`)
                            }
                            className={cn(
                              "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-left text-[11px] font-medium transition-colors",
                              isSelected
                                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            <Icon className="h-3.5 w-3.5 shrink-0" />
                            <span className="truncate">{item.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content Area Simulation */}
              <div className="flex-1 p-4 overflow-y-auto no-scrollbar space-y-3 bg-muted/10">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span>Workspace</span>
                  <ChevronRight className="h-3 w-3" />
                  <span className="font-semibold text-foreground truncate">
                    {selectedPreviewModule === "dashboard"
                      ? "Dashboard"
                      : activeAccountItem
                        ? `Account / ${activeAccountItem.name}`
                        : activeModuleItem?.customName ||
                          activeModuleItem?.name ||
                          "Module Page"}
                  </span>
                </div>

                {/* Simulated Header Banner */}
                <div className="p-3.5 rounded-xl border border-border/70 bg-card shadow-2xs space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      {selectedPreviewModule === "dashboard" ? (
                        <Home className="h-3.5 w-3.5" />
                      ) : activeAccountItem ? (
                        <activeAccountItem.icon className="h-3.5 w-3.5" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5" />
                      )}
                    </div>
                    <h4 className="text-[13px] font-bold text-foreground leading-none truncate">
                      {selectedPreviewModule === "dashboard"
                        ? "Overview & Analytics"
                        : activeAccountItem
                          ? activeAccountItem.name
                          : activeModuleItem?.customName || activeModuleItem?.name}
                    </h4>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {selectedPreviewModule === "dashboard"
                      ? "Main community overview, live analytics, feeds, and activity."
                      : activeAccountItem
                        ? activeAccountItem.description
                        : activeModuleItem?.subtitle ||
                          "Active web module layout and community functionality."}
                  </p>
                </div>

                {/* Simulated Content Cards */}
                {selectedPreviewModule === "dashboard" && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-3 rounded-lg border border-border/60 bg-card shadow-2xs space-y-1.5">
                      <div className="h-2 w-16 bg-muted rounded" />
                      <div className="h-4 w-12 bg-primary/20 rounded font-bold text-[10px] flex items-center px-1 text-primary">
                        +24%
                      </div>
                    </div>
                    <div className="p-3 rounded-lg border border-border/60 bg-card shadow-2xs space-y-1.5">
                      <div className="h-2 w-20 bg-muted rounded" />
                      <div className="h-4 w-14 bg-emerald-500/20 rounded font-bold text-[10px] flex items-center px-1 text-emerald-600">
                        Active
                      </div>
                    </div>
                  </div>
                )}

                {activeAccountItem && (
                  <div className="rounded-lg border border-border/60 bg-card p-3 shadow-2xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                        Route: {activeAccountItem.href}
                      </span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                        Built-in System Tab
                      </span>
                    </div>
                    <div className="h-2 w-3/4 bg-muted/80 rounded" />
                    <div className="h-2 w-1/2 bg-muted/60 rounded" />
                  </div>
                )}

                {!activeAccountItem && selectedPreviewModule !== "dashboard" && (
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="p-3 rounded-lg border border-border/60 bg-card shadow-2xs space-y-1.5">
                      <div className="h-2 w-16 bg-muted rounded" />
                      <div className="h-4 w-10 bg-primary/20 rounded" />
                    </div>
                    <div className="p-3 rounded-lg border border-border/60 bg-card shadow-2xs space-y-1.5">
                      <div className="h-2 w-20 bg-muted rounded" />
                      <div className="h-4 w-12 bg-emerald-500/20 rounded" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium mt-3 flex items-center gap-1.5">
            <Monitor className="h-3.5 w-3.5" />
            Interactive Web Preview (Click sidebar items to simulate navigation)
          </p>
        </div>

        {/* Right: Section Tabs & Navigation Manager */}
        <div className="lg:col-span-7 xl:col-span-6 space-y-4">
          {/* Segmented Navigation Tabs */}
          <div className="p-1 rounded-xl bg-muted/50 border border-border flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveSectionTab("modules")}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                activeSectionTab === "modules"
                  ? "bg-card text-foreground shadow-2xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Layers className="h-3.5 w-3.5 shrink-0" />
              <span>Center Modules</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-primary/10 text-primary font-mono ml-0.5">
                {navigationModules.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSectionTab("account")}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                activeSectionTab === "account"
                  ? "bg-card text-foreground shadow-2xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <User className="h-3.5 w-3.5 shrink-0" />
              <span>Account Navigation</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-mono ml-0.5">
                {accountNavigation.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveSectionTab("dashboard")}
              className={cn(
                "py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5",
                activeSectionTab === "dashboard"
                  ? "bg-card text-foreground shadow-2xs border border-border/60"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Home className="h-3.5 w-3.5 shrink-0" />
              <span>Dashboard</span>
            </button>
          </div>

          {/* TAB 1: Center Modules (User Customizable Sequence) */}
          {activeSectionTab === "modules" && (
            <div className="space-y-4">
              {/* Active Navigation Slots Card */}
              <div className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                      Center Navigation Sequence
                    </p>
                    <h4 className="text-[14px] font-semibold text-foreground mt-0.5">
                      Drag to Reorder Web Navigation ({navigationModules.length})
                    </h4>
                  </div>
                </div>

                <div className="p-4">
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="web-nav-slots">
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={cn(
                            "space-y-2.5 min-h-[140px] rounded-xl p-2 transition-colors",
                            snapshot.isDraggingOver &&
                              "bg-muted/40 ring-1 ring-primary/20",
                          )}
                        >
                          {navigationModules.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border border-dashed border-border rounded-xl">
                              <Puzzle className="h-8 w-8 mb-2 opacity-30 text-muted-foreground" />
                              <p className="text-[13px] font-medium text-foreground/80">
                                No modules in web navigation
                              </p>
                              <p className="text-[12px] text-muted-foreground mt-0.5">
                                Add modules from the available pool below.
                              </p>
                            </div>
                          ) : (
                            navigationModules.map((module, idx) => (
                              <Draggable
                                key={module.id || `web-mod-${idx}`}
                                draggableId={String(
                                  module.id || `web-mod-${idx}`,
                                )}
                                index={idx}
                              >
                                {(dragProvided, dragSnapshot) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    className={cn(
                                      "flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all duration-150 bg-card",
                                      dragSnapshot.isDragging
                                        ? "border-primary shadow-lg ring-2 ring-primary/20 scale-[1.01] z-30"
                                        : "border-border/70 hover:border-border hover:shadow-2xs",
                                    )}
                                  >
                                    {/* Drag Handle */}
                                    <div
                                      {...dragProvided.dragHandleProps}
                                      className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted"
                                    >
                                      <GripVertical className="h-4 w-4" />
                                    </div>

                                    {/* Position Number */}
                                    <span className="h-5 w-5 rounded-full bg-muted font-mono text-[10px] font-bold text-foreground flex items-center justify-center shrink-0">
                                      #{idx + 1}
                                    </span>

                                    {/* Icon */}
                                    <div className="h-8 w-8 rounded-lg bg-muted/60 border border-border/80 flex items-center justify-center shrink-0 text-foreground">
                                      {getNavIcon(
                                        module.customIcon || module.icon,
                                        true,
                                      )}
                                    </div>

                                    {/* Title & Subtitle */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[13px] font-semibold text-foreground truncate">
                                          {module.customName || module.name}
                                        </span>
                                        {module.customName && (
                                          <span className="text-[11px] text-muted-foreground">
                                            ({module.name})
                                          </span>
                                        )}
                                      </div>
                                      {module.subtitle ? (
                                        <p className="text-[11px] text-muted-foreground truncate">
                                          {module.subtitle}
                                        </p>
                                      ) : (
                                        <p className="text-[10px] text-muted-foreground/60 italic">
                                          Position {idx + 1} in web sidebar
                                        </p>
                                      )}
                                    </div>

                                    {/* Preview Button */}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setSelectedPreviewModule(module.id)
                                      }
                                      className="h-7 px-2 text-[11px] text-muted-foreground hover:text-foreground"
                                    >
                                      Preview
                                    </Button>

                                    {/* Remove Button */}
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        toggleNavigation(module.id)
                                      }
                                      disabled={userRole === "directory"}
                                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                      title="Remove from web navigation"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              </div>

              {/* Quick Add Available Modules Pool */}
              <div className="rounded-xl border border-border/80 bg-card shadow-sm p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="text-[13px] font-semibold text-foreground">
                      Available Modules to Add
                    </h5>
                    <p className="text-[11px] text-muted-foreground">
                      Click to add to web navigation sidebar (
                      {availableModules.length} available)
                    </p>
                  </div>
                </div>

                {availableModules.length === 0 ? (
                  <p className="text-[12px] text-muted-foreground italic py-2">
                    All public modules are currently added to the web sidebar.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {availableModules.map((module) => (
                      <button
                        key={module.id}
                        type="button"
                        disabled={userRole === "directory"}
                        onClick={() => toggleNavigation(module.id)}
                        className="flex items-center justify-between gap-2 p-2.5 rounded-lg border text-left transition-all bg-muted/30 border-border hover:bg-card hover:border-primary/50 hover:shadow-2xs cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="h-7 w-7 rounded-md bg-card border border-border/80 flex items-center justify-center shrink-0">
                            {getNavIcon(module.customIcon || module.icon, true)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-semibold text-foreground truncate">
                              {module.customName || module.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate">
                              {module.subtitle || "Public module"}
                            </p>
                          </div>
                        </div>

                        <div className="h-6 px-2 rounded-md flex items-center gap-1 text-[11px] font-medium bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors shrink-0">
                          <Plus className="h-3 w-3" />
                          <span>Add</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: Account Navigation (Built-in Tabs) */}
          {activeSectionTab === "account" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/80 bg-card shadow-sm p-4 space-y-3">
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    <h5 className="text-[14px] font-semibold text-foreground">
                      Member Account Navigation
                    </h5>
                  </div>
                  <p className="text-[12px] text-muted-foreground mt-0.5">
                    These standard system routes are anchored in the Account section of
                    your member dashboard sidebar.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  {accountNavigation.map((item, idx) => {
                    const Icon = item.icon;
                    const isPreviewed =
                      selectedPreviewModule === `account-${item.name}`;
                    return (
                      <div
                        key={item.name}
                        className={cn(
                          "flex items-center justify-between gap-3 p-3 rounded-xl border transition-all bg-card",
                          isPreviewed
                            ? "border-purple-500/60 ring-1 ring-purple-500/20 shadow-2xs"
                            : "border-border/70 hover:border-border",
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center shrink-0">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-semibold text-foreground">
                                {item.name}
                              </span>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground">
                                {item.href}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant={isPreviewed ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setSelectedPreviewModule(`account-${item.name}`)
                          }
                          className="h-7 px-2.5 text-xs shrink-0"
                        >
                          {isPreviewed ? "Viewing" : "Preview"}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Dashboard Route */}
          {activeSectionTab === "dashboard" && (
            <div className="space-y-4">
              <div className="rounded-xl border border-border/80 bg-card shadow-sm p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0">
                      <Home className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-[14px] font-bold text-foreground">
                          Primary Dashboard Route
                        </h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          Default Entry
                        </span>
                      </div>
                      <p className="text-[12px] text-muted-foreground mt-0.5">
                        The primary home route (/dashboard) anchored at the top
                        of the web sidebar.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant={
                      selectedPreviewModule === "dashboard"
                        ? "default"
                        : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedPreviewModule("dashboard")}
                    className="h-8 px-3 text-xs"
                  >
                    {selectedPreviewModule === "dashboard"
                      ? "Active in Canvas"
                      : "Preview Dashboard"}
                  </Button>
                </div>

                <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Fixed at position #1 above all dynamic modules</span>
                  </div>
                  <div className="flex items-center gap-2 text-foreground font-medium">
                    <Link2 className="h-3.5 w-3.5 text-primary" />
                    <span>Target Route: <code className="font-mono text-primary font-bold">/dashboard</code></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebNavigation;

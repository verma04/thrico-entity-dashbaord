"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  Home,
  Menu,
  User,
  GripVertical,
  X,
  Plus,
  Puzzle,
  Info,
  Smartphone,
  Sparkles,
  Wifi,
  Battery,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getNavIcon } from "./utils";
import type { ModuleItem } from "./types";

interface MobileNavigationProps {
  modules: ModuleItem[];
  navigationModules: ModuleItem[];
  userRole: string;
  saving: boolean;
  saveChanges: () => void;
  onDragEnd: (result: DropResult) => void;
  toggleNavigation: (id: string) => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  modules,
  navigationModules,
  userRole,
  onDragEnd,
  toggleNavigation,
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<string>("home");

  const navCount = navigationModules.length;
  const remainingSlots = Math.max(0, 3 - navCount);

  // Available modules that can be added to mobile navigation
  const availableModules = modules.filter(
    (m) => m.enabled && m.isPublicFacing && !m.showInMobileNavigation,
  );

  return (
    <div className="space-y-6">
      {/* Information Header Guide */}
      <div className="flex items-start gap-3.5 px-4 py-3.5 rounded-xl border border-blue-200/60 bg-blue-50/40 dark:bg-blue-950/20 dark:border-blue-900/40">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-[13px] font-semibold text-blue-950 dark:text-blue-200">
              Mobile App Navigation Sequence
            </p>
            <p className="text-[12px] text-blue-800/80 dark:text-blue-400/80 mt-0.5">
              <strong>Home</strong> and <strong>Profile/Menu</strong> are fixed anchors. Select and sequence up to <strong>3 dynamic modules</strong> in the mobile bottom bar.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span
              className={cn(
                "text-[11px] font-semibold px-2.5 py-1 rounded-full border",
                remainingSlots === 0
                  ? "bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800"
                  : "bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
              )}
            >
              {remainingSlots === 0 ? "3 / 3 Slots Filled" : `${remainingSlots} Slot${remainingSlots !== 1 ? "s" : ""} Available`}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Phone Mockup Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full max-w-[320px] rounded-[22px] border border-border/80 bg-card p-1 shadow-md relative">
            {/* Phone Speaker Notch / Pill */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-3 w-16 bg-muted-foreground/25 dark:bg-zinc-700 rounded-full flex items-center justify-end px-1.5 z-20">
              <div className="h-1.5 w-1.5 rounded-full bg-background/50" />
            </div>

            {/* Phone Screen Canvas */}
            <div className="w-full h-[480px] rounded-[18px] bg-background border border-border/50 overflow-hidden flex flex-col justify-between relative">
              {/* Status Bar */}
              <div className="px-4 pt-2 pb-1.5 flex items-center justify-between text-[10px] font-semibold text-foreground z-10">
                <span>09:41</span>
                <div className="flex items-center gap-1.5 opacity-80">
                  <Wifi className="h-3 w-3" />
                  <Battery className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Sample Screen Content based on Active Tab */}
              <div className="flex-1 px-4 py-3 overflow-y-auto no-scrollbar space-y-3">
                {/* Header Widget */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                      Mobile Preview
                    </p>
                    <h3 className="text-base font-bold text-foreground">
                      {activePreviewTab === "home"
                        ? "Discover & Feed"
                        : activePreviewTab === "menu"
                          ? "Explore Directory"
                          : activePreviewTab === "profile"
                            ? "Member Profile"
                            : navigationModules.find((m) => m.id === activePreviewTab)?.customName ||
                              navigationModules.find((m) => m.id === activePreviewTab)?.name ||
                              "Module Screen"}
                    </h3>
                  </div>
                  <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                    EP
                  </div>
                </div>

                {/* Banner / Card Widget */}
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-primary text-[11px] font-semibold">
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Live Simulation</span>
                  </div>
                  <p className="text-[12px] font-medium text-foreground leading-snug">
                    {activePreviewTab === "home"
                      ? "Welcome back to your mobile community hub."
                      : `You are viewing the simulated ${activePreviewTab} module view.`}
                  </p>
                </div>

                {/* Simulated Content Feed */}
                <div className="space-y-2 pt-1">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl border border-border/60 bg-card/60 shadow-2xs space-y-2"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-muted" />
                        <div className="space-y-1 flex-1">
                          <div className="h-2.5 w-24 bg-muted rounded" />
                          <div className="h-2 w-16 bg-muted/60 rounded" />
                        </div>
                      </div>
                      <div className="h-10 bg-muted/40 rounded-lg" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Navigation Bar */}
              <div className="bg-card/95 backdrop-blur-md border-t border-border px-2 py-2 flex items-center justify-around z-10">
                {/* Fixed: Home */}
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("home")}
                  className={cn(
                    "flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-all",
                    activePreviewTab === "home"
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Home className="h-4 w-4" />
                  <span className="text-[9px] font-medium leading-none">Home</span>
                </button>

                {/* Dynamic Configured Modules */}
                {navigationModules.map((module) => {
                  const isSelected = activePreviewTab === module.id;
                  return (
                    <button
                      key={module.id}
                      type="button"
                      onClick={() => setActivePreviewTab(module.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-all max-w-[64px]",
                        isSelected
                          ? "text-primary font-bold"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <div className={cn(isSelected ? "text-primary scale-105" : "text-muted-foreground")}>
                        {getNavIcon(module.customIcon || module.icon, true)}
                      </div>
                      <span className="text-[9px] font-medium leading-none truncate w-full text-center">
                        {module.customName || module.name}
                      </span>
                    </button>
                  );
                })}

                {/* Empty Slot Placeholders */}
                {Array.from({ length: Math.max(0, 3 - navigationModules.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex flex-col items-center gap-1 py-1 px-2 text-muted-foreground/30"
                  >
                    <div className="h-4 w-4 rounded border border-dashed border-border flex items-center justify-center">
                      <Plus className="h-2.5 w-2.5" />
                    </div>
                    <span className="text-[9px] font-normal leading-none">—</span>
                  </div>
                ))}

                {/* Fixed: Menu */}
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("menu")}
                  className={cn(
                    "flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-all",
                    activePreviewTab === "menu"
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <Menu className="h-4 w-4" />
                  <span className="text-[9px] font-medium leading-none">Menu</span>
                </button>

                {/* Fixed: Profile */}
                <button
                  type="button"
                  onClick={() => setActivePreviewTab("profile")}
                  className={cn(
                    "flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition-all",
                    activePreviewTab === "profile"
                      ? "text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <User className="h-4 w-4" />
                  <span className="text-[9px] font-medium leading-none">Profile</span>
                </button>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground font-medium mt-3 flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5" />
            Interactive iPhone Preview (Click tabs to test)
          </p>
        </div>

        {/* Right: Drag-to-Reorder & Slot Manager */}
        <div className="lg:col-span-7 space-y-5">
          {/* Active Navigation Slots Card */}
          <div className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                  Active Sequence
                </p>
                <h4 className="text-[14px] font-semibold text-foreground mt-0.5">
                  Drag to Reorder Navigation ({navCount}/3)
                </h4>
              </div>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 w-6 rounded-full transition-colors",
                      i < navCount
                        ? "bg-primary"
                        : "bg-muted border border-border/80",
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="p-4">
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="mobile-nav-slots">
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn(
                        "space-y-2.5 min-h-[140px] rounded-xl p-2 transition-colors",
                        snapshot.isDraggingOver && "bg-muted/40 ring-1 ring-primary/20",
                      )}
                    >
                      {navigationModules.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground border border-dashed border-border rounded-xl">
                          <Puzzle className="h-8 w-8 mb-2 opacity-30 text-muted-foreground" />
                          <p className="text-[13px] font-medium text-foreground/80">No modules added yet</p>
                          <p className="text-[12px] text-muted-foreground mt-0.5">
                            Choose from the available modules below to add up to 3 items.
                          </p>
                        </div>
                      ) : (
                        navigationModules.map((module, idx) => (
                          <Draggable
                            key={module.id || `mobile-mod-${idx}`}
                            draggableId={String(module.id || `mobile-mod-${idx}`)}
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

                                {/* Index Number Badge */}
                                <span className="h-5 w-5 rounded-full bg-muted font-mono text-[10px] font-bold text-foreground flex items-center justify-center shrink-0">
                                  #{idx + 1}
                                </span>

                                {/* Icon */}
                                <div className="h-8 w-8 rounded-lg bg-muted/60 border border-border/80 flex items-center justify-center shrink-0 text-foreground">
                                  {getNavIcon(module.customIcon || module.icon, true)}
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
                                      Position {idx + 1} in mobile bottom bar
                                    </p>
                                  )}
                                </div>

                                {/* Remove Button */}
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => toggleNavigation(module.id)}
                                  disabled={userRole === "directory"}
                                  className="h-7 w-7 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                  title="Remove from mobile nav"
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
                  Available Public Modules
                </h5>
                <p className="text-[11px] text-muted-foreground">
                  Click to add directly to mobile navigation ({availableModules.length} available)
                </p>
              </div>
            </div>

            {availableModules.length === 0 ? (
              <p className="text-[12px] text-muted-foreground italic py-2">
                All public modules are currently added or none are enabled.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {availableModules.map((module) => {
                  const isFull = navCount >= 3;
                  return (
                    <button
                      key={module.id}
                      type="button"
                      disabled={isFull || userRole === "directory"}
                      onClick={() => toggleNavigation(module.id)}
                      className={cn(
                        "flex items-center justify-between gap-2 p-2.5 rounded-lg border text-left transition-all",
                        isFull
                          ? "opacity-50 cursor-not-allowed bg-muted/20 border-border/50"
                          : "bg-muted/30 border-border hover:bg-card hover:border-primary/50 hover:shadow-2xs cursor-pointer group",
                      )}
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

                      <div
                        className={cn(
                          "h-6 px-2 rounded-md flex items-center gap-1 text-[11px] font-medium shrink-0",
                          isFull
                            ? "bg-muted text-muted-foreground"
                            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors",
                        )}
                      >
                        <Plus className="h-3 w-3" />
                        <span>Add</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;

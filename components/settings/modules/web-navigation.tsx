"use client";

import type React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Home, Menu, User, GripVertical, X, Puzzle, Info, LayoutDashboard } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ModuleItem {
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
  subtitle?: string | null;
}

interface WebNavigationProps {
  modules: ModuleItem[];
  navigationModules: ModuleItem[];
  userRole: string;
  saving: boolean;
  saveChanges: () => void;
  onDragEnd: (result: DropResult) => void;
  toggleNavigation: (id: string) => void;
}

const getNavIcon = (icon: string | null) => {
  if (!icon || typeof icon !== "string" || !(icon in LucideIcons)) {
    return <Puzzle className="h-4 w-4 text-muted-foreground" />;
  }
  const IconComponent = (LucideIcons as any)[icon] as React.ElementType;
  return <IconComponent className="h-4 w-4 text-muted-foreground" />;
};

const WebNavigation: React.FC<WebNavigationProps> = ({
  modules,
  navigationModules,
  userRole,
  onDragEnd,
  toggleNavigation,
}) => {
  return (
    <div className="space-y-5">
      {/* Info bar */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-muted/50 border border-border rounded-lg">
        <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <p className="text-[12px] font-semibold text-foreground">
            Web Sidebar Navigation. Reorder the modules to change their appearance in the sidebar.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Preview panel */}
        <div className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Preview
            </p>
            <p className="text-[13px] font-semibold text-foreground mt-0.5 leading-none">
              Sidebar Navigation
            </p>
          </div>

          <div className="p-4 flex-1 bg-muted/30">
            <div className="w-64 max-w-full bg-card border border-border rounded-lg shadow-sm h-full flex flex-col py-4 mx-auto">
              {/* Fixed: Dashboard */}
              <div className="px-4 mb-2">
                <div className="flex items-center gap-3 px-3 py-2 rounded-md bg-muted text-foreground">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="text-[13px] font-medium">Dashboard</span>
                </div>
              </div>
              
              <div className="px-4 mb-2">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-1">
                  Modules
                </p>
                <div className="space-y-0.5">
                  {navigationModules.map((module) => (
                    <div key={module.id} className="flex items-start gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors">
                      <div className="mt-0.5">
                        {getNavIcon(module.customIcon || module.icon)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-medium flex items-baseline gap-1.5">
                          <span>{module.customName || module.name}</span>
                          {module.customName && (
                            <span className="text-[11px] text-muted-foreground font-normal">({module.name})</span>
                          )}
                        </span>
                        {module.subtitle && (
                          <span className="text-[11px] text-muted-foreground truncate mt-0.5 leading-snug">
                            {module.subtitle}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {navigationModules.length === 0 && (
                    <div className="px-3 py-4 text-center text-muted-foreground">
                      <Puzzle className="h-4 w-4 mx-auto mb-1 opacity-50" />
                      <span className="text-[11px]">No modules</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Drag-to-reorder panel */}
        <div className="rounded-xl border border-border/80 bg-card shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
              Order
            </p>
            <p className="text-[13px] font-semibold text-foreground mt-0.5 leading-none">
              Drag to reorder
            </p>
          </div>

          <div className="p-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="web-nav-table">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "space-y-2 min-h-[120px] rounded-lg transition-colors",
                      snapshot.isDraggingOver && "bg-muted/50"
                    )}
                  >
                    {navigationModules.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-28 text-muted-foreground">
                        <Puzzle className="h-6 w-6 mb-2 opacity-20" />
                        <p className="text-[12px]">No modules selected</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          Enable modules in the Registry tab
                        </p>
                      </div>
                    ) : (
                      navigationModules.map((module, idx) => (
                        <Draggable key={module.id} draggableId={module.id} index={idx}>
                          {(dragProvided, dragSnapshot) => (
                            <div
                              ref={dragProvided.innerRef}
                              {...dragProvided.draggableProps}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-all duration-200",
                                dragSnapshot.isDragging
                                  ? "bg-card border-border shadow-md"
                                  : "bg-muted/50/80 border-border hover:border-border hover:bg-card"
                              )}
                            >
                              {/* Drag handle */}
                              <div
                                {...dragProvided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-muted-foreground transition-colors shrink-0"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>

                              {/* Position number */}
                              <span className="text-[10px] font-semibold text-muted-foreground w-4 text-center tabular-nums shrink-0">
                                {idx + 1}
                              </span>

                              {/* Icon + name */}
                              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                <div className="h-6 w-6 rounded-md bg-card border border-border/80 flex items-center justify-center shrink-0">
                                  {getNavIcon(module.customIcon || module.icon)}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[13px] font-medium text-foreground truncate flex items-baseline gap-1.5">
                                    <span>{module.customName || module.name}</span>
                                    {module.customName && (
                                      <span className="text-[11px] text-muted-foreground font-normal">({module.name})</span>
                                    )}
                                  </span>
                                  {module.subtitle && (
                                    <span className="text-[11px] text-muted-foreground truncate leading-none mt-0.5">
                                      {module.subtitle}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Remove */}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleNavigation(module.id)}
                                disabled={userRole === "directory"}
                                className="h-6 w-6 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
                              >
                                <X className="h-3.5 w-3.5" />
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
      </div>
    </div>
  );
};

export default WebNavigation;

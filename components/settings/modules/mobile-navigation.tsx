"use client";

import type React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Home, Menu, User, GripVertical, X, Puzzle, Info } from "lucide-react";
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
}

interface MobileNavigationProps {
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
    return <Puzzle className="h-4 w-4 text-slate-500" />;
  }
  const IconComponent = (LucideIcons as any)[icon] as React.ElementType;
  return <IconComponent className="h-4 w-4 text-slate-500" />;
};

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  modules,
  navigationModules,
  userRole,
  onDragEnd,
  toggleNavigation,
}) => {
  const navCount = modules.filter((m) => m.showInMobileNavigation).length;
  const remainingSlots = 3 - navCount;

  return (
    <div className="space-y-5">
      {/* Info bar */}
      <div className="flex items-start gap-2.5 px-4 py-3 bg-slate-50 border border-slate-100 rounded-lg">
        <Info className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <p className="text-[12px] font-semibold text-slate-700">
            Home and Profile are fixed nav items. Select up to 3 additional modules.
          </p>
          <p className={cn(
            "text-[11px] font-semibold",
            remainingSlots === 0 ? "text-amber-600" : "text-slate-400"
          )}>
            {remainingSlots === 0
              ? "All 3 slots filled"
              : `${remainingSlots} slot${remainingSlots !== 1 ? "s" : ""} remaining`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Preview panel */}
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Preview
            </p>
            <p className="text-[13px] font-semibold text-slate-800 mt-0.5 leading-none">
              Mobile Navigation Bar
            </p>
          </div>

          <div className="p-4">
            {/* Phone frame */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-3">
              {/* Status bar sim */}
              <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-200/60 mb-3">
                <span className="text-[9px] font-semibold text-slate-400">09:41</span>
                <div className="flex items-center gap-1">
                  <div className="h-1.5 w-4 bg-slate-300 rounded-full" />
                  <div className="h-1.5 w-1.5 bg-slate-300 rounded-full" />
                </div>
              </div>

              {/* Nav bar */}
              <div className="bg-white rounded-lg border border-slate-200 shadow-sm px-3 py-2.5 flex items-end justify-between gap-2">
                {/* Fixed: Home */}
                <NavItem label="Home" isActive>
                  <Home className="h-4 w-4 text-slate-900" />
                </NavItem>

                {/* Dynamic slots */}
                {navigationModules.map((module) => (
                  <NavItem key={module.id} label={module.name}>
                    {getNavIcon(module.icon)}
                  </NavItem>
                ))}

                {/* Empty slots */}
                {Array.from({ length: Math.max(0, 3 - navigationModules.length) }).map((_, i) => (
                  <NavItem key={`empty-${i}`} label="—" isEmpty>
                    <div className="h-4 w-4 rounded border border-dashed border-slate-300" />
                  </NavItem>
                ))}

                {/* Fixed: Menu */}
                <NavItem label="Menu">
                  <Menu className="h-4 w-4 text-slate-500" />
                </NavItem>

                {/* Fixed: Profile */}
                <NavItem label="Profile">
                  <User className="h-4 w-4 text-slate-500" />
                </NavItem>
              </div>

              <p className="text-center text-[9px] text-slate-300 font-medium mt-2 uppercase tracking-widest">
                Mobile Preview
              </p>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-3 px-1">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-slate-900" />
                <span className="text-[10px] text-slate-400">Active / Fixed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-sm border border-dashed border-slate-300" />
                <span className="text-[10px] text-slate-400">Empty slot</span>
              </div>
            </div>
          </div>
        </div>

        {/* Drag-to-reorder panel */}
        <div className="rounded-xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
              Order
            </p>
            <p className="text-[13px] font-semibold text-slate-800 mt-0.5 leading-none">
              Drag to reorder
            </p>
          </div>

          <div className="p-4">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="nav-table">
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "space-y-2 min-h-[120px] rounded-lg transition-colors",
                      snapshot.isDraggingOver && "bg-slate-50"
                    )}
                  >
                    {navigationModules.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-28 text-slate-400">
                        <Puzzle className="h-6 w-6 mb-2 opacity-20" />
                        <p className="text-[12px]">No modules selected</p>
                        <p className="text-[11px] text-slate-300 mt-0.5">
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
                                  ? "bg-white border-slate-300 shadow-md"
                                  : "bg-slate-50/80 border-slate-100 hover:border-slate-200 hover:bg-white"
                              )}
                            >
                              {/* Drag handle */}
                              <div
                                {...dragProvided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 transition-colors shrink-0"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>

                              {/* Position number */}
                              <span className="text-[10px] font-semibold text-slate-400 w-4 text-center tabular-nums shrink-0">
                                {idx + 1}
                              </span>

                              {/* Icon + name */}
                              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                <div className="h-6 w-6 rounded-md bg-white border border-slate-200/80 flex items-center justify-center shrink-0">
                                  {getNavIcon(module.icon)}
                                </div>
                                <span className="text-[13px] font-medium text-slate-800 truncate">
                                  {module.name}
                                </span>
                              </div>

                              {/* Remove */}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toggleNavigation(module.id)}
                                disabled={userRole === "directory"}
                                className="h-6 w-6 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0"
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

            {/* Slot usage meter */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Navigation slots</span>
              <div className="flex items-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-2 w-8 rounded-full transition-colors",
                      i < navCount ? "bg-slate-800" : "bg-slate-100 border border-slate-200"
                    )}
                  />
                ))}
                <span className="text-[11px] font-semibold text-slate-500 ml-1 tabular-nums">
                  {navCount} / 3
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Small helper sub-component for nav preview items
function NavItem({
  label,
  children,
  isActive,
  isEmpty,
}: {
  label: string;
  children: React.ReactNode;
  isActive?: boolean;
  isEmpty?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-1 min-w-0">
      <div
        className={cn(
          "h-8 w-8 flex items-center justify-center rounded-lg",
          isActive && "bg-slate-900",
          !isActive && !isEmpty && "bg-slate-100",
          isEmpty && "bg-transparent"
        )}
      >
        {children}
      </div>
      <span
        className={cn(
          "text-[8px] font-semibold text-center leading-none max-w-[36px] truncate",
          isEmpty ? "text-slate-300" : "text-slate-500"
        )}
      >
        {label}
      </span>
    </div>
  );
}

export default MobileNavigation;

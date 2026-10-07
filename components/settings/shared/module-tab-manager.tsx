"use client";

import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { GripVertical, LucideIcon, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface ModuleTabItem {
  id: string;
  key?: string;
  label: string;
  defaultName: string;
  description: string;
  icon: LucideIcon;
  canHide: boolean; // if false, cannot be hidden (e.g. Discover tab)
  enabled: boolean;
}

export interface ModuleTabManagerProps {
  tabs: ModuleTabItem[];
  onChange: (updatedTabs: ModuleTabItem[]) => void;
  className?: string;
}

export const ModuleTabManager: React.FC<ModuleTabManagerProps> = ({
  tabs,
  onChange,
  className,
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index === result.destination.index) return;

    const items = Array.from(tabs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange(items);
  };

  const handleToggle = (id: string) => {
    const nextTabs = tabs.map((tab) => {
      if (tab.id === id) {
        if (!tab.canHide) return tab;
        return { ...tab, enabled: !tab.enabled };
      }
      return tab;
    });
    onChange(nextTabs);
  };

  const handleLabelChange = (id: string, newLabel: string) => {
    const nextTabs = tabs.map((tab) => {
      if (tab.id === id) {
        return { ...tab, label: newLabel };
      }
      return tab;
    });
    onChange(nextTabs);
  };

  return (
    <div className={cn("space-y-3", className)}>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="module-tabs-droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-2.5"
            >
              {tabs.map((tab, index) => {
                const Icon = tab.icon;
                return (
                  <Draggable key={tab.id} draggableId={tab.id} index={index}>
                    {(dragProvided, dragSnapshot) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        className={cn(
                          "rounded-[8px] border border-[#d2d5d9] dark:border-zinc-800 bg-[#f6f6f7]/40 dark:bg-zinc-900/40 p-3 transition-all",
                          dragSnapshot.isDragging &&
                            "shadow-lg ring-2 ring-indigo-500/30 bg-white dark:bg-zinc-800 z-50",
                          !tab.enabled && "opacity-75 bg-[#f6f6f7]/20"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 flex-1 min-w-0">
                            {/* Drag Handle */}
                            <div
                              {...dragProvided.dragHandleProps}
                              className="mt-1 p-1 -ml-1 text-[#8c9196] hover:text-[#303030] dark:hover:text-zinc-200 cursor-grab active:cursor-grabbing rounded hover:bg-zinc-200/50 dark:hover:bg-zinc-800 transition-colors"
                              title="Drag to reorder tab"
                            >
                              <GripVertical className="h-4 w-4" />
                            </div>

                            {/* Icon */}
                            <div
                              className={cn(
                                "h-8 w-8 rounded-[6px] flex items-center justify-center shrink-0 border transition-colors mt-0.5",
                                tab.enabled
                                  ? "bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
                                  : "bg-[#f6f6f7] text-[#8c9196] border-[#d2d5d9] dark:bg-zinc-800 dark:border-zinc-700"
                              )}
                            >
                              <Icon className="h-4 w-4" />
                            </div>

                            {/* Label & Description */}
                            <div className="space-y-0.5 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[13px] font-semibold text-[#303030] dark:text-zinc-100 truncate">
                                  {tab.label || tab.defaultName}
                                </span>
                                {!tab.canHide ? (
                                  <Badge
                                    variant="outline"
                                    className="text-[9.5px] px-1.5 py-0 rounded-[3px] font-bold bg-indigo-50/80 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50 gap-1 flex items-center"
                                  >
                                    <Lock className="h-2.5 w-2.5" />
                                    Core Tab
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      "text-[9.5px] px-1.5 py-0 rounded-[3px] font-bold",
                                      tab.enabled
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400"
                                        : "bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800"
                                    )}
                                  >
                                    {tab.enabled ? "Visible" : "Hidden"}
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-[#616161] dark:text-zinc-400 leading-[15px]">
                                {tab.description}
                              </p>
                            </div>
                          </div>

                          {/* Toggle Switch */}
                          <div className="flex items-center gap-2 shrink-0 pt-0.5">
                            {tab.canHide ? (
                              <Switch
                                checked={tab.enabled}
                                onCheckedChange={() => handleToggle(tab.id)}
                              />
                            ) : (
                              <div className="text-[11px] text-[#8c9196] font-medium px-2 py-1 rounded bg-[#f1f2f4] dark:bg-zinc-800 select-none">
                                Always Active
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Inline Rename Field (shown when tab is enabled or locked) */}
                        {tab.enabled && (
                          <div className="mt-2.5 pt-2.5 border-t border-[#e1e3e5]/70 dark:border-zinc-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-1.5 text-[11px] text-[#616161] dark:text-zinc-400">
                              <span>Tab Display Name:</span>
                              <span className="text-[10px] text-[#8c9196]">
                                (Default: &quot;{tab.defaultName}&quot;)
                              </span>
                            </div>
                            <input
                              type="text"
                              placeholder={tab.defaultName}
                              value={tab.label}
                              onChange={(e) =>
                                handleLabelChange(tab.id, e.target.value)
                              }
                              className="text-[12px] h-7 px-2.5 rounded-[4px] border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[#303030] dark:text-zinc-100 w-full sm:w-[240px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

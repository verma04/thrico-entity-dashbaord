"use client";

import React, { useState } from "react";
import {
  useWebsiteBuilderStore,
  ModuleData,
} from "@/store/useWebsiteBuilderStore";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableProvided,
  DraggableStateSnapshot,
} from "@hello-pangea/dnd";
import { GripVertical, Eye, EyeOff, Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/pages/confirm-dialog";
import { NavigationManager } from "./navigation-manager";
import { FooterManager } from "./footer-manager";
import { AddModuleDialog } from "./modules/management/add-module-dialog";
import {
  useReorderModules,
  useDeleteModule,
  useToggleModule,
} from "@/graphql/actions/website";

const ModuleCard = ({
  module,
  isDraggable,
  provided,
  snapshot,
  onDelete,
  onToggle,
}: {
  module: ModuleData;
  isDraggable: boolean;
  provided?: DraggableProvided;
  snapshot?: DraggableStateSnapshot;
  onDelete: (moduleId: string) => void;
  onToggle: (moduleId: string, isEnabled: boolean) => void;
}) => {
  const { toggleModule, selectModule, selectedModuleId, deleteModule } =
    useWebsiteBuilderStore();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = () => {
    deleteModule(module.id);
    onDelete(module.id);
    setIsDeleteOpen(false);
  };

  const isSelected = selectedModuleId === module.id;

  return (
    <>
      <div
        ref={provided?.innerRef}
        {...provided?.draggableProps}
        className={cn(
          "group flex items-center gap-2 p-2 rounded-[6px] border transition-all select-none",
          snapshot?.isDragging
            ? "shadow-lg scale-[1.02] border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 z-50"
            : isSelected
              ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
              : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
          !isDraggable && "border-dashed bg-[#f6f6f7]/60 dark:bg-zinc-900/60 opacity-90",
          !module.isEnabled && "opacity-50 grayscale",
        )}
      >
        {/* Drag Handle */}
        <div
          {...provided?.dragHandleProps}
          className={cn(
            "text-[#616161] dark:text-zinc-400",
            isDraggable
              ? "cursor-grab active:cursor-grabbing hover:text-[#303030] dark:hover:text-zinc-100"
              : "cursor-default opacity-20",
          )}
        >
          <GripVertical className="h-3.5 w-3.5" />
        </div>

        {/* Content */}
        <div
          className="flex-1 cursor-pointer min-w-0"
          onClick={() => selectModule(module.id)}
        >
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-medium text-xs truncate",
                isSelected
                  ? "text-[#303030] dark:text-zinc-100 font-semibold"
                  : "text-[#303030] dark:text-zinc-200",
              )}
            >
              {module.name}
            </span>
            {module.isCustomized && (
              <span className="px-1 py-0.2 rounded-[3px] text-[9px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
                Edited
              </span>
            )}
            {!isDraggable && (
              <span className="px-1 py-0.2 rounded-[3px] text-[9px] uppercase font-semibold bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border border-[#d2d5d9] dark:border-zinc-700 shrink-0">
                Fixed
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const newEnabledState = !module.isEnabled;
              toggleModule(module.id);
              onToggle(module.id, newEnabledState);
            }}
            className="p-1 rounded-[4px] text-[#616161] hover:text-[#303030] dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 transition-colors cursor-pointer"
            title={module.isEnabled ? "Hide section" : "Show section"}
          >
            {module.isEnabled ? (
              <Eye className="h-3 w-3" />
            ) : (
              <EyeOff className="h-3 w-3" />
            )}
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              selectModule(module.id);
            }}
            className={cn(
              "p-1 rounded-[4px] transition-colors cursor-pointer",
              isSelected
                ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900"
                : "text-[#616161] hover:text-[#303030] dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800",
            )}
            title="Configure settings"
          >
            <Settings className="h-3 w-3" />
          </button>

          {/* Delete Button */}
          {isDraggable && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsDeleteOpen(true);
              }}
              className="p-1 rounded-[4px] transition-colors text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
              title="Delete section"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {isDraggable && (
        <ConfirmDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          title="Delete Section?"
          description={`Are you sure you want to delete '${module.name}'? All custom content configured for this section will be removed.`}
          confirmText="Delete Section"
          confirmVariant="destructive"
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

const ModuleManager = () => {
  const { pages, currentPageId, setModules } = useWebsiteBuilderStore();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [reorderModules] = useReorderModules();
  const [deleteModuleMutation] = useDeleteModule();
  const [toggleModuleMutation] = useToggleModule();

  const isMounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!isMounted) return null;

  // Get current page's modules
  const currentPage = pages.find((p) => p.id === currentPageId);
  const pageModules = currentPage?.modules || [];

  // Split modules into Navbar, Body, and Footer, then sort by sort field
  const bodyModules = pageModules
    .filter((m) => m.type !== "navbar" && m.type !== "footer")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleDeleteModule = (moduleId: string) => {
    deleteModuleMutation({
      variables: { moduleId },
    });
  };

  const handleToggleModule = (moduleId: string, isEnabled: boolean) => {
    toggleModuleMutation({
      variables: { moduleId, isEnabled },
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) return;

    const newBodyModules = Array.from(bodyModules);
    const [moved] = newBodyModules.splice(sourceIndex, 1);
    newBodyModules.splice(destIndex, 0, moved);

    // Assign sort indices to maintain explicit ordering
    const modulesWithSort = newBodyModules.map((module, index) => ({
      ...module,
      order: index,
    }));

    setModules(modulesWithSort);

    // Call API to persist reordering
    if (currentPageId) {
      reorderModules({
        variables: {
          pageId: currentPageId,
          moduleIds: modulesWithSort.map((m) => m.id),
        },
      });
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-[10.5px] font-bold text-[#616161] dark:text-zinc-400 uppercase tracking-wider">
          Layout Sections
        </h3>

        <AddModuleDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      </div>

      <div className="space-y-2">
        {/* Global Navigation */}
        <NavigationManager />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="body-modules">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-1.5 py-0.5"
              >
                {bodyModules.map((module, index) => (
                  <Draggable
                    key={module.id}
                    draggableId={module.id}
                    index={index}
                  >
                    {(draggableProvided, snapshot) => (
                      <ModuleCard
                        module={module}
                        isDraggable={true}
                        provided={draggableProvided}
                        snapshot={snapshot}
                        onDelete={handleDeleteModule}
                        onToggle={handleToggleModule}
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Global Footer */}
        <FooterManager />
      </div>
    </div>
  );
};

export default ModuleManager;

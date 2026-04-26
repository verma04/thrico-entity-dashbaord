"use client";

import React, { useEffect, useState } from "react";
import {
  useWebsiteBuilderStore,
  ModuleData,
  ModuleType,
} from "@/store/useWebsiteBuilderStore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Eye, EyeOff, Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
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
  index,
  isDraggable,
  provided,
  onDelete,
  onToggle,
}: {
  module: ModuleData;
  index?: number;
  isDraggable: boolean;
  provided?: any;
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

  return (
    <div
      ref={provided?.innerRef}
      {...provided?.draggableProps}
      className={cn(
        "group flex items-center gap-2 p-2 rounded-lg border bg-card text-card-foreground transition-all",
        provided?.snapshot?.isDragging
          ? "shadow-lg scale-[1.02] border-primary z-50"
          : "hover:border-border/80",
        !isDraggable && "border-dashed bg-muted/20 opacity-90",
        !module.isEnabled && "opacity-50 bg-muted/40 grayscale",
        selectedModuleId === module.id && "border-primary/60 bg-primary/5",
      )}
    >
      {/* Drag Handle */}
      <div
        {...provided?.dragHandleProps}
        className={cn(
          "text-muted-foreground/40",
          isDraggable
            ? "cursor-move hover:text-foreground"
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
          <span className="font-medium text-xs truncate">{module.name}</span>
          {module.isCustomized && (
            <span className="px-1 py-px rounded text-[9px] font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 shrink-0">
              Edited
            </span>
          )}
          {!isDraggable && (
            <span className="px-1 py-px rounded text-[9px] uppercase font-semibold bg-muted text-muted-foreground shrink-0">
              Fixed
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const newEnabledState = !module.isEnabled;
            toggleModule(module.id);
            onToggle(module.id, newEnabledState);
          }}
          className={cn(
            "p-1 rounded-md transition-colors",
            "text-muted-foreground/50 hover:bg-muted hover:text-foreground",
          )}
          title={module.isEnabled ? "Hide" : "Show"}
        >
          {module.isEnabled ? (
            <Eye className="h-3 w-3" />
          ) : (
            <EyeOff className="h-3 w-3" />
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            selectModule(module.id);
          }}
          className={cn(
            "p-1 rounded-md transition-colors",
            selectedModuleId === module.id
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground/50 hover:bg-muted hover:text-foreground",
          )}
          title="Settings"
        >
          <Settings className="h-3 w-3" />
        </button>

        {/* Delete Button - Only show for draggable modules (not header/footer) */}
        {isDraggable && (
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-1 rounded-md transition-colors text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive"
                title="Delete"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </DialogTrigger>
            <DialogContent className="z-[2000]">
              <DialogHeader>
                <DialogTitle>Delete Module</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete {module.name}? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="default" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

const ModuleManager = () => {
  const { pages, currentPageId, setModules } = useWebsiteBuilderStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [reorderModules] = useReorderModules();
  const [deleteModuleMutation] = useDeleteModule();
  const [toggleModuleMutation] = useToggleModule();

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  const onDragEnd = (result: any) => {
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
      console.log({
        pageId: currentPageId,
        moduleIds: modulesWithSort.map((m) => m.id),
      });
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
        <h3 className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider">
          Modules
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
                className="space-y-1 py-0.5"
              >
                {bodyModules.map((module, index) => (
                  <Draggable
                    key={module.id}
                    draggableId={module.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <ModuleCard
                        module={module}
                        isDraggable={true}
                        index={index}
                        provided={{ ...provided, snapshot }}
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

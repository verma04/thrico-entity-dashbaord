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
        "group flex items-center gap-3 p-3 rounded-xl border bg-card text-card-foreground transition-all",
        provided?.snapshot?.isDragging
          ? "shadow-lg scale-105 border-primary z-50"
          : "hover:border-primary/50",
        !isDraggable && "border-dashed bg-muted/20 opacity-90",
        !module.isEnabled && "opacity-60 bg-muted/50 grayscale",
        selectedModuleId === module.id && "border-primary ring-1 ring-primary",
      )}
    >
      {/* Drag Handle */}
      <div
        {...provided?.dragHandleProps}
        className={cn(
          "text-muted-foreground",
          isDraggable
            ? "cursor-move hover:text-foreground"
            : "cursor-default opacity-20",
        )}
      >
        <GripVertical className="h-5 w-5" />
      </div>

      {/* Content */}
      <div
        className="flex-1 cursor-pointer"
        onClick={() => selectModule(module.id)}
      >
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm">{module.name}</span>
          {module.isCustomized && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
              Customized
            </span>
          )}
          {!isDraggable && (
            <span className="px-1.5 py-0.5 rounded text-[10px] uppercase font-bold bg-muted text-muted-foreground">
              Fixed
            </span>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          Layout:{" "}
          <span className="capitalize">{module.layout.replace("-", " ")}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const newEnabledState = !module.isEnabled;
            toggleModule(module.id);
            onToggle(module.id, newEnabledState);
          }}
          className={cn(
            "p-2 rounded-lg transition-colors",
            module.isEnabled
              ? "text-muted-foreground hover:bg-muted hover:text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
          title={module.isEnabled ? "Disable Module" : "Enable Module"}
        >
          {module.isEnabled ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            selectModule(module.id);
          }}
          className={cn(
            "p-2 rounded-lg transition-colors",
            selectedModuleId === module.id
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </button>

        {/* Delete Button - Only show for draggable modules (not header/footer) */}
        {isDraggable && (
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                className="p-2 rounded-lg transition-colors text-muted-foreground hover:bg-destructive hover:text-destructive-foreground"
                title="Delete Module"
              >
                <Trash2 className="h-4 w-4" />
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Modules
        </h3>

        <AddModuleDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      </div>

      <div className="space-y-4">
        {/* Global Navigation */}
        <NavigationManager />

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="body-modules">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 py-1"
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

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
        "group relative flex items-center gap-4 p-4 rounded-2xl border bg-card transition-all duration-300",
        provided?.snapshot?.isDragging
          ? "shadow-2xl scale-[1.02] border-primary ring-4 ring-primary/10 z-50 cursor-grabbing"
          : "hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer",
        !isDraggable && "border-dashed bg-muted/20",
        !module.isEnabled && "opacity-50 grayscale bg-muted/30",
        selectedModuleId === module.id && "border-primary ring-2 ring-primary/20 shadow-md bg-primary/[0.02]"
      )}
      onClick={() => selectModule(module.id)}
    >
      {/* Drag Handle */}
      {isDraggable && (
        <div
          {...provided?.dragHandleProps}
          className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted/0 group-hover:bg-muted/50 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors duration-300"
        >
          <GripVertical className="h-4 w-4" />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="font-semibold text-[13px] tracking-tight truncate">{module.name}</span>
          {module.isCustomized && (
            <div className="flex items-center h-4 px-1.5 rounded-full bg-amber-500/10 text-amber-600">
              <span className="text-[9px] font-black uppercase tracking-tighter">Modified</span>
            </div>
          )}
          {!isDraggable && (
            <div className="flex items-center h-4 px-1.5 rounded-full bg-slate-500/10 text-slate-500">
              <span className="text-[9px] font-black uppercase tracking-tighter">System</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground/70">
          <span className="capitalize">{module.layout.replace("-", " ")}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span className="uppercase text-[9px] tracking-widest">{module.type}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            const newEnabledState = !module.isEnabled;
            toggleModule(module.id);
            onToggle(module.id, newEnabledState);
          }}
          className={cn(
            "p-2 rounded-xl transition-all duration-300",
            module.isEnabled
              ? "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
          )}
          title={module.isEnabled ? "Hide Module" : "Show Module"}
        >
          {module.isEnabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            selectModule(module.id);
          }}
          className={cn(
            "p-2 rounded-xl transition-all duration-300",
            selectedModuleId === module.id
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
              : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
          )}
          title="Module Settings"
        >
          <Settings className="h-3.5 w-3.5" />
        </button>

        {isDraggable && (
          <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
            <DialogTrigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="p-2 rounded-xl text-muted-foreground/50 hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                title="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </DialogTrigger>
            <DialogContent className="z-[2000] border-none shadow-2xl rounded-3xl p-8">
              <DialogHeader className="gap-2">
                <div className="w-12 h-12 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-2">
                  <Trash2 className="h-6 w-6" />
                </div>
                <DialogTitle className="text-xl font-bold tracking-tight">Remove Module?</DialogTitle>
                <DialogDescription className="text-muted-foreground leading-relaxed">
                  You are about to remove <span className="font-bold text-foreground">"{module.name}"</span>. This will delete all configuration for this module on this page.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-3 mt-4">
                <Button
                  variant="ghost"
                  onClick={() => setIsDeleteOpen(false)}
                  className="rounded-xl flex-1 h-12 font-semibold"
                >
                  Keep it
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                  className="rounded-xl flex-1 h-12 font-semibold shadow-lg shadow-destructive/20"
                >
                  Yes, Remove
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

  const currentPage = pages.find((p) => p.id === currentPageId);
  const pageModules = currentPage?.modules || [];

  const bodyModules = pageModules
    .filter((m) => m.type !== "navbar" && m.type !== "footer")
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const handleDeleteModule = (moduleId: string) => {
    deleteModuleMutation({ variables: { moduleId } });
  };

  const handleToggleModule = (moduleId: string, isEnabled: boolean) => {
    toggleModuleMutation({ variables: { moduleId, isEnabled } });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;
    if (sourceIndex === destIndex) return;

    const newBodyModules = Array.from(bodyModules);
    const [moved] = newBodyModules.splice(sourceIndex, 1);
    newBodyModules.splice(destIndex, 0, moved);

    const modulesWithSort = newBodyModules.map((module, index) => ({
      ...module,
      order: index,
    }));

    setModules(modulesWithSort);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
            Module Stack
          </h3>
          <p className="text-[10px] text-muted-foreground/60 font-medium">Drag to reorder elements</p>
        </div>

        <AddModuleDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      </div>

      <div className="space-y-4">
        {/* Global Navigation */}
        <div className="relative">
          <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-transparent rounded-full" />
          <NavigationManager />
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="body-modules">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-3 py-1"
              >
                {bodyModules.length > 0 ? (
                  bodyModules.map((module, index) => (
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
                  ))
                ) : (
                  <div className="py-12 px-4 rounded-3xl border-2 border-dashed border-muted flex flex-col items-center justify-center text-center space-y-3 opacity-60">
                    <div className="w-10 h-10 rounded-2xl bg-muted flex items-center justify-center">
                      <Plus className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">No modules yet</p>
                      <p className="text-xs text-muted-foreground">Add your first module to get started</p>
                    </div>
                  </div>
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Global Footer */}
        <div className="relative">
          <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-t from-primary/50 to-transparent rounded-full" />
          <FooterManager />
        </div>
      </div>
    </div>
  );
};

export default ModuleManager;

"use client";

import React, { useEffect, useState } from "react";
import { useWebsiteBuilderStore, ModuleData } from "@/store/useWebsiteBuilderStore";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { GripVertical, Eye, EyeOff, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const ModuleCard = ({ module, index, isDraggable, provided }: { module: ModuleData, index?: number, isDraggable: boolean, provided?: any }) => {
    const { toggleModule, selectModule, selectedModuleId } = useWebsiteBuilderStore();

    return (
        <div
            ref={provided?.innerRef}
            {...provided?.draggableProps}
            className={cn(
            "group flex items-center gap-3 p-3 rounded-xl border bg-card text-card-foreground transition-all",
            provided?.snapshot?.isDragging ? "shadow-lg scale-105 border-primary z-50" : "hover:border-primary/50",
            !isDraggable && "border-dashed bg-muted/20 opacity-90",
            !module.isEnabled && "opacity-60 bg-muted/50 grayscale",
            selectedModuleId === module.id && "border-primary ring-1 ring-primary"
            )}
        >
            {/* Drag Handle */}
            <div
            {...provided?.dragHandleProps}
            className={cn(
                "text-muted-foreground",
                isDraggable ? "cursor-move hover:text-foreground" : "cursor-default opacity-20"
            )}
            >
            <GripVertical className="h-5 w-5" />
            </div>

            {/* Content */}
            <div className="flex-1 cursor-pointer" onClick={() => selectModule(module.id)}>
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
                    Layout: <span className="capitalize">{module.layout.replace("-", " ")}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
            <button
                onClick={(e) => {
                e.stopPropagation();
                toggleModule(module.id);
                }}
                className={cn(
                    "p-2 rounded-lg transition-colors",
                    module.isEnabled 
                    ? "text-muted-foreground hover:bg-muted hover:text-foreground" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={module.isEnabled ? "Disable Module" : "Enable Module"}
            >
                {module.isEnabled ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
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
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title="Settings"
            >
                <Settings className="h-4 w-4" />
            </button>
            </div>
        </div>
    )
}


const ModuleManager = () => {
  const { pages, currentPageId, setModules } = useWebsiteBuilderStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  // Get current page's modules
  const currentPage = pages.find((p) => p.id === currentPageId);
  const pageModules = currentPage?.modules || [];

  // Split modules into Navbar, Body, and Footer
  const navbarModule = pageModules.find(m => m.type === "navbar");
  const footerModule = pageModules.find(m => m.type === "footer");
  const bodyModules = pageModules.filter(m => m.type !== "navbar" && m.type !== "footer");

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    if (sourceIndex === destIndex) return;

    const newBodyModules = Array.from(bodyModules);
    const [moved] = newBodyModules.splice(sourceIndex, 1);
    newBodyModules.splice(destIndex, 0, moved);

    // Reconstruct the full list, ensuring Navbar is always first and Footer is always last
    const newModules: ModuleData[] = [];
    if (navbarModule) newModules.push(navbarModule);
    newModules.push(...newBodyModules);
    if (footerModule) newModules.push(footerModule);

    setModules(newModules);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Modules</h3>
        <span className="text-xs text-muted-foreground/60">Drag to reorder</span>
      </div>

      <div className="space-y-2">
        {/* Fixed Navbar */}
        {navbarModule && (
             <ModuleCard module={navbarModule} isDraggable={false} />
        )}

        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="body-modules">
            {(provided) => (
                <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2 py-1" 
                >
                {bodyModules.map((module, index) => (
                    <Draggable key={module.id} draggableId={module.id} index={index}>
                    {(provided, snapshot) => (
                        <ModuleCard 
                            module={module} 
                            isDraggable={true} 
                            index={index}
                            provided={{...provided, snapshot}}
                        />
                    )}
                    </Draggable>
                ))}
                {provided.placeholder}
                </div>
            )}
            </Droppable>
        </DragDropContext>

        {/* Fixed Footer */}
        {footerModule && (
             <ModuleCard module={footerModule} isDraggable={false} />
        )}
      </div>
    </div>
  );
};

export default ModuleManager;

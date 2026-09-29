import React, { useState } from "react";
import { Search, Puzzle, Star, Globe, Lock, Info, LayoutGrid, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import ModuleRow from "./module-row";
import ModuleCard from "./module-card";
import type { ModuleItem } from "./types";

interface ModuleRegistryProps {
  modules: ModuleItem[];
  filteredModules: ModuleItem[];
  searchTerm: string;
  userRole: string;
  publicCount: number;
  internalCount: number;
  onSearchChange: (value: string) => void;
  onToggleModule: (id: string) => void;
  onTogglePopular: (id: string) => void;
  onToggleNavigation: (id: string) => void;
  onToggleWebNavigation: (id: string) => void;
  onChangeCustomName: (id: string, value: string) => void;
  onChangeCustomIcon?: (id: string, value: string) => void;
  onChangeSubtitle: (id: string, value: string) => void;
}

export default function ModuleRegistry({
  modules,
  filteredModules,
  searchTerm,
  userRole,
  publicCount,
  internalCount,
  onSearchChange,
  onToggleModule,
  onTogglePopular,
  onToggleNavigation,
  onToggleWebNavigation,
  onChangeCustomName,
  onChangeCustomIcon,
  onChangeSubtitle,
}: ModuleRegistryProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  return (
    <div className="p-6 space-y-6">
      {/* Write Guide */}
      <div className="flex items-start gap-4 px-5 py-4 rounded-xl border border-blue-200/60 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 shadow-sm">
        <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="text-[14px] font-semibold text-blue-900 leading-none">Configuration Guide</p>
          <p className="text-[13px] text-blue-700/80 leading-relaxed max-w-3xl">
            Toggle modules to enable them. Click any module's <strong>icon</strong> to customize it. 
            Use the <Star className="inline h-3.5 w-3.5 text-amber-500 -mt-0.5 mx-0.5" /> to mark modules as popular.
            You can seamlessly rename modules or add a subtitle directly on their row. Changes are saved together.
          </p>
        </div>
      </div>

      {/* Search + Info bar + View toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/70" />
          <Input
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 h-8 text-[12px] border-border/60 bg-muted/30 focus:bg-card shadow-2xs rounded-lg transition-colors"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Public / Internal indicator */}
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground bg-muted/30 px-3 h-8 rounded-lg border border-border/50">
            <span className="flex items-center gap-1.5">
              <Globe className="h-3 w-3 text-emerald-500" />
              <span className="font-medium text-foreground">{publicCount} Public</span>
            </span>
            <span className="w-px h-3 bg-border"></span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-3 w-3 text-slate-400" />
              <span className="font-medium text-foreground">{internalCount} Internal</span>
            </span>
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-0.5 bg-muted/40 p-0.5 rounded-lg border border-border/60">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-medium transition-all cursor-pointer",
                viewMode === "list"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="List View"
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={cn(
                "flex items-center gap-1.5 h-7 px-2.5 rounded-md text-[11px] font-medium transition-all cursor-pointer",
                viewMode === "grid"
                  ? "bg-card text-foreground shadow-2xs font-semibold"
                  : "text-muted-foreground hover:text-foreground",
              )}
              title="Grid View"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Grid</span>
            </button>
          </div>
        </div>
      </div>

      {/* Module list / grid content */}
      {filteredModules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed border-border/50 rounded-xl">
          <Puzzle className="h-10 w-10 mb-3 opacity-20" />
          <p className="text-[14px] font-medium text-foreground/70">No modules found</p>
          <p className="text-[13px] text-muted-foreground mt-1">Try adjusting your search terms</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredModules.map((module) => (
            <ModuleCard
              key={module.id}
              module={module}
              modules={modules}
              userRole={userRole}
              onToggleModule={onToggleModule}
              onTogglePopular={onTogglePopular}
              onToggleNavigation={onToggleNavigation}
              onToggleWebNavigation={onToggleWebNavigation}
              onChangeCustomName={onChangeCustomName}
              onChangeCustomIcon={onChangeCustomIcon}
              onChangeSubtitle={onChangeSubtitle}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredModules.map((module) => (
            <ModuleRow
              key={module.id}
              module={module}
              modules={modules}
              userRole={userRole}
              onToggleModule={onToggleModule}
              onTogglePopular={onTogglePopular}
              onToggleNavigation={onToggleNavigation}
              onToggleWebNavigation={onToggleWebNavigation}
              onChangeCustomName={onChangeCustomName}
              onChangeCustomIcon={onChangeCustomIcon}
              onChangeSubtitle={onChangeSubtitle}
            />
          ))}
        </div>
      )}

      {/* Legend footer */}
      <div className="flex items-center gap-5 pt-4 mt-2 border-t border-border/40">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm" />
          <span className="text-[11px] font-medium text-muted-foreground">Public</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-sm" />
          <span className="text-[11px] font-medium text-muted-foreground">Internal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/20 shadow-sm" />
          <span className="text-[11px] font-medium text-muted-foreground">Disabled</span>
        </div>
      </div>
    </div>
  );
}

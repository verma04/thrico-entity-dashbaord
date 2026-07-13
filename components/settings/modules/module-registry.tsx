import React from "react";
import { Search, Puzzle, Star, Globe, Lock, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import ModuleRow from "./module-row";
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
}: ModuleRegistryProps) {
  return (
    <div className="p-5 space-y-4">
      {/* Write Guide */}
      <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl border border-blue-200/80 bg-gradient-to-r from-blue-50/80 to-indigo-50/50">
        <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
        <div>
          <p className="text-[13px] font-semibold text-blue-800 leading-none">Write Guide</p>
          <p className="text-[12px] text-blue-600/80 mt-1.5 leading-relaxed">
            Toggle modules on or off, mark your favourites with the <Star className="inline h-3 w-3 text-amber-500 -mt-0.5" /> star to feature them prominently, configure mobile &amp; web navigation visibility, and rename modules using the display name field. Changes are saved together — click <strong>Save</strong> when ready.
          </p>
        </div>
      </div>

      {/* Search + Info bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 h-8 text-[13px] border-border bg-muted/50 focus:bg-card"
          />
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Globe className="h-3 w-3 text-emerald-500" />
            <span className="font-medium">{publicCount} Public</span>
          </span>
          <span className="text-border">•</span>
          <span className="flex items-center gap-1.5">
            <Lock className="h-3 w-3 text-slate-400" />
            <span className="font-medium">{internalCount} Internal</span>
          </span>
        </div>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-[2px_1.5fr_1.5fr_auto_auto_auto_auto] items-end gap-4 px-3 pb-2 border-b border-border">
        <span></span>
        <div>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Module</span>
        </div>
        <div>
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Display Name</span>
          <p className="text-[9px] text-muted-foreground/60 mt-0.5">Rename for your members</p>
        </div>
        <div className="w-16 text-center">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Popular</span>
          <p className="text-[9px] text-muted-foreground/60 mt-0.5">Featured</p>
        </div>
        <div className="w-16 text-center">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Status</span>
          <p className="text-[9px] text-muted-foreground/60 mt-0.5">On / Off</p>
        </div>
        <div className="w-16 text-center">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Mobile</span>
          <p className="text-[9px] text-muted-foreground/60 mt-0.5">App nav bar</p>
        </div>
        <div className="w-16 text-center">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Web</span>
          <p className="text-[9px] text-muted-foreground/60 mt-0.5">Sidebar nav</p>
        </div>
      </div>

      {/* Module rows */}
      <div className="space-y-0.5">
        {filteredModules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Puzzle className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-[13px]">No modules found</p>
          </div>
        ) : (
          filteredModules.map((module) => (
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
            />
          ))
        )}
      </div>

      {/* Legend footer */}
      <div className="flex items-center gap-4 pt-3 mt-2 border-t border-border/50">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] text-muted-foreground">Public — visible to members</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-slate-300" />
          <span className="text-[10px] text-muted-foreground">Internal — admin dashboard only</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
          <span className="text-[10px] text-muted-foreground">Disabled</span>
        </div>
      </div>
    </div>
  );
}

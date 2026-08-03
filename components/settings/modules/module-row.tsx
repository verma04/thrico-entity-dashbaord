import React from "react";
import { Star, Globe, Lock, Pencil, Eye, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getNavIcon } from "./utils";
import type { ModuleItem } from "./types";

interface ModuleRowProps {
  module: ModuleItem;
  modules: ModuleItem[];
  userRole: string;
  onToggleModule: (id: string) => void;
  onTogglePopular: (id: string) => void;
  onToggleNavigation: (id: string) => void;
  onToggleWebNavigation: (id: string) => void;
  onChangeCustomName: (id: string, value: string) => void;
  onChangeSubtitle: (id: string, value: string) => void;
}

export default function ModuleRow({
  module,
  modules,
  userRole,
  onToggleModule,
  onTogglePopular,
  onToggleNavigation,
  onToggleWebNavigation,
  onChangeCustomName,
  onChangeSubtitle,
}: ModuleRowProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-[2px_1.25fr_1.25fr_1.25fr_auto_auto_auto_auto] items-center gap-4 px-3 py-3 rounded-lg border transition-all duration-200 group",
        module.enabled
          ? "border-transparent hover:bg-muted/40 hover:border-border/60"
          : "border-transparent bg-muted/20 opacity-60 hover:opacity-80",
      )}
    >
      {/* Left accent bar */}
      <div
        className={cn(
          "w-0.5 h-8 rounded-full transition-colors",
          !module.enabled
            ? "bg-muted-foreground/20"
            : module.isPublicFacing
              ? "bg-emerald-400"
              : "bg-slate-300",
        )}
      />

      {/* Module info */}
      <div className="flex items-center gap-3 min-w-0 group/info">
        <div
          className={cn(
            "h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors",
            module.enabled
              ? module.isPublicFacing
                ? "bg-emerald-50 border-emerald-200/60"
                : "bg-muted border-border/60"
              : "bg-muted/50 border-border/30",
          )}
        >
          {getNavIcon(module.icon, module.enabled)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={cn(
                "text-[13px] font-medium truncate transition-colors",
                module.enabled ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {module.customName || module.name}
            </span>
            {module.customName && module.customName !== module.name && (
              <span className="text-[10px] text-muted-foreground/50">
                ({module.name})
              </span>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="h-5 w-5 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors opacity-0 group-hover/info:opacity-100"
                  title="Preview header"
                >
                  <Eye className="h-3 w-3" />
                </button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0 overflow-hidden shadow-lg border-border/80"
                align="start"
              >
                <div className="bg-background border-b border-border/50 px-4 py-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full border border-border/60 bg-background flex items-center justify-center shrink-0 shadow-sm">
                    <ChevronLeft className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col min-w-0 justify-center">
                    <span className="text-[20px] font-bold leading-none tracking-tight text-foreground truncate">
                      {module.customName || module.name}
                    </span>
                    {module.subtitle ? (
                      <span className="text-[13px] text-muted-foreground mt-1.5 truncate">
                        {module.subtitle}
                      </span>
                    ) : (
                      <span className="text-[13px] text-muted-foreground/50 mt-1.5 truncate italic">
                        No subtitle configured
                      </span>
                    )}
                  </div>
                </div>
                <div className="bg-muted/20 p-4 h-24 flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
                    Page Content Area
                  </span>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            {module.required && (
              <span className="text-[9px] font-semibold text-amber-600 bg-amber-50 border border-amber-200/60 px-1.5 py-px rounded uppercase tracking-wide">
                Required
              </span>
            )}
            {module.isPublicFacing ? (
              <span className="text-[9px] font-medium text-emerald-600 flex items-center gap-0.5">
                <Globe className="h-2.5 w-2.5" />
                Public
              </span>
            ) : (
              <span className="text-[9px] font-medium text-slate-400 flex items-center gap-0.5">
                <Lock className="h-2.5 w-2.5" />
                Internal
              </span>
            )}
            {!module.canRename && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Lock className="h-2.5 w-2.5 text-muted-foreground/30" />
                  </TooltipTrigger>
                  <TooltipContent>Cannot rename this module</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>

      {/* Custom Name Input */}
      <div className="min-w-0 pr-4">
        {module.canRename && userRole !== "directory" ? (
          <div className="relative group/input">
            <Input
              value={module.customName ?? ""}
              placeholder={module.name}
              onChange={(e) => onChangeCustomName(module.id, e.target.value)}
              disabled={!module.enabled}
              className={cn(
                "h-8 text-[13px] font-medium w-full transition-colors",
                !module.enabled && "opacity-50",
              )}
            />
            <Pencil className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/30 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-8 flex items-center px-3 rounded-md bg-muted/30 border border-border/30 cursor-not-allowed">
                  <span className="text-[12px] text-muted-foreground/50 truncate">
                    {module.customName || module.name}
                  </span>
                  <Lock className="h-3 w-3 text-muted-foreground/30 ml-auto shrink-0" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {userRole === "directory"
                  ? "Insufficient permissions"
                  : "Renaming is disabled for this module"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Subtitle Input */}
      <div className="min-w-0 pr-4">
        {module.canRename && userRole !== "directory" ? (
          <div className="relative group/input">
            <Input
              value={module.subtitle ?? ""}
              placeholder="Module subtitle"
              onChange={(e) => onChangeSubtitle(module.id, e.target.value)}
              disabled={!module.enabled}
              className={cn(
                "h-8 text-[13px] font-medium w-full transition-colors",
                !module.enabled && "opacity-50",
              )}
            />
            <Pencil className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground/30 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="h-8 flex items-center px-3 rounded-md bg-muted/30 border border-border/30 cursor-not-allowed">
                  <span className="text-[12px] text-muted-foreground/50 truncate">
                    {module.subtitle || "No subtitle"}
                  </span>
                  <Lock className="h-3 w-3 text-muted-foreground/30 ml-auto shrink-0" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {userRole === "directory"
                  ? "Insufficient permissions"
                  : "Renaming is disabled for this module"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Popular toggle */}
      <div className="w-16 flex justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (!module.enabled) return;
                  onTogglePopular(module.id);
                }}
                disabled={!module.enabled}
                className={cn(
                  "h-7 w-7 rounded-md flex items-center justify-center transition-all",
                  module.isPopular
                    ? "text-amber-500 bg-amber-50 border border-amber-200 shadow-sm shadow-amber-100"
                    : "text-muted-foreground/30 hover:text-amber-400 hover:bg-amber-50/50 border border-transparent hover:border-amber-100",
                  !module.enabled && "opacity-40 cursor-not-allowed",
                )}
              >
                <Star
                  className="h-3.5 w-3.5"
                  fill={module.isPopular ? "currentColor" : "none"}
                />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {!module.enabled
                ? "Enable module first"
                : module.isPopular
                  ? "Remove from popular"
                  : "Mark as popular"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Enabled toggle */}
      <div className="w-16 flex justify-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex flex-col items-center gap-0.5">
                <Switch
                  checked={module.enabled}
                  onCheckedChange={() => onToggleModule(module.id)}
                  disabled={module.required || userRole === "directory"}
                  className="scale-90"
                />
                <span
                  className={cn(
                    "text-[9px] font-medium transition-colors",
                    module.enabled
                      ? "text-emerald-600"
                      : "text-muted-foreground/40",
                  )}
                >
                  {module.enabled ? "On" : "Off"}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              {module.required
                ? "Required — cannot disable"
                : module.enabled
                  ? "Click to disable this module"
                  : "Click to enable this module"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Mobile nav toggle */}
      <div className="w-16 flex justify-center">
        {!module.isPublicFacing ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="h-7 w-10 rounded-md bg-muted/20 border border-dashed border-border/40 flex items-center justify-center">
                  <span className="text-muted-foreground/30 text-[9px] font-semibold">
                    N/A
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px]">
                Internal module — only visible in the admin dashboard, not in
                member-facing navigation
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-0.5">
                  <Switch
                    checked={module.showInMobileNavigation}
                    onCheckedChange={() => onToggleNavigation(module.id)}
                    disabled={
                      userRole === "directory" ||
                      !module.enabled ||
                      (!module.showInMobileNavigation &&
                        modules.filter((m) => m.showInMobileNavigation)
                          .length >= 3)
                    }
                    className="scale-90"
                  />
                  {module.showInMobileNavigation && (
                    <span className="text-[9px] font-medium text-violet-500">
                      Active
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {!module.enabled
                  ? "Enable module first"
                  : module.showInMobileNavigation
                    ? "Remove from mobile navigation"
                    : modules.filter((m) => m.showInMobileNavigation).length >=
                        3
                      ? "Maximum 3 mobile nav slots reached"
                      : "Add to mobile app navigation bar"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      {/* Web nav toggle */}
      <div className="w-16 flex justify-center">
        {!module.isPublicFacing ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="h-7 w-10 rounded-md bg-muted/20 border border-dashed border-border/40 flex items-center justify-center">
                  <span className="text-muted-foreground/30 text-[9px] font-semibold">
                    N/A
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-[200px]">
                Internal module — only visible in the admin dashboard, not in
                member-facing navigation
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-0.5">
                  <Switch
                    checked={module.showInWebNavigation}
                    onCheckedChange={() => onToggleWebNavigation(module.id)}
                    disabled={userRole === "directory" || !module.enabled}
                    className="scale-90"
                  />
                  {module.showInWebNavigation && (
                    <span className="text-[9px] font-medium text-blue-500">
                      Active
                    </span>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {!module.enabled
                  ? "Enable module first"
                  : module.showInWebNavigation
                    ? "Remove from website sidebar"
                    : "Add to website sidebar navigation"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
    </div>
  );
}

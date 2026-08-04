import React from "react";
import { Star, Globe, Lock, Pencil, Eye, ChevronLeft, Smartphone, Monitor } from "lucide-react";
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
import { getNavIcon, POPULAR_LUCIDE_ICONS, ALL_LUCIDE_ICONS } from "./utils";
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
  onChangeCustomIcon?: (id: string, value: string) => void;
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
  onChangeCustomIcon,
  onChangeSubtitle,
}: ModuleRowProps) {
  const [iconSearch, setIconSearch] = React.useState("");
  const [displayCount, setDisplayCount] = React.useState(60);

  React.useEffect(() => {
    setDisplayCount(60);
  }, [iconSearch]);

  const allFilteredIcons = React.useMemo(() => {
    if (!iconSearch.trim()) return ALL_LUCIDE_ICONS;
    const query = iconSearch.toLowerCase();
    return ALL_LUCIDE_ICONS.filter((name) =>
      name.toLowerCase().includes(query)
    );
  }, [iconSearch]);

  const visibleIcons = React.useMemo(() => {
    return allFilteredIcons.slice(0, displayCount);
  }, [allFilteredIcons, displayCount]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 40) {
      if (displayCount < allFilteredIcons.length) {
        setDisplayCount((prev) => Math.min(prev + 60, allFilteredIcons.length));
      }
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col lg:flex-row lg:items-center gap-5 px-5 py-4 rounded-xl border bg-card transition-all duration-200 group relative",
        module.enabled
          ? "border-border/60 hover:bg-muted/30 hover:border-border hover:shadow-sm"
          : "border-border/30 bg-muted/10 opacity-70 hover:opacity-100",
      )}
    >
      {/* Left accent bar */}
      <div
        className={cn(
          "absolute left-0 top-3 bottom-3 w-1 rounded-r-full transition-colors",
          !module.enabled
            ? "bg-muted-foreground/20"
            : module.isPublicFacing
              ? "bg-emerald-400"
              : "bg-slate-300",
        )}
      />

      {/* Left Section: Identity */}
      <div className="flex items-center gap-4 min-w-[240px] pl-2">
        <Popover>
          <PopoverTrigger asChild>
            <button
              disabled={!module.enabled || userRole === "directory"}
              className={cn(
                "h-11 w-11 rounded-xl border flex items-center justify-center shrink-0 transition-colors relative group/icon cursor-pointer",
                module.enabled
                  ? module.isPublicFacing
                    ? "bg-emerald-50 border-emerald-200 hover:border-emerald-400 shadow-sm"
                    : "bg-muted border-border hover:border-foreground/30 shadow-sm"
                  : "bg-muted/50 border-border/30 cursor-not-allowed",
              )}
              title="Click to customize icon"
            >
              <div className="scale-125">
                {getNavIcon(module.customIcon || module.icon, module.enabled, module.name)}
              </div>
              {module.enabled && userRole !== "directory" && (
                <div className="absolute inset-0 bg-background/80 rounded-xl flex items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity">
                  <Pencil className="h-4 w-4 text-foreground" />
                </div>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-3 space-y-3" align="start">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold text-foreground">
                Select Icon ({ALL_LUCIDE_ICONS.length}+ available)
              </span>
              {module.customIcon && (
                <button
                  onClick={() => onChangeCustomIcon?.(module.id, "")}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Custom Icon Search / Name Input */}
            <div className="relative">
              <Input
                placeholder={`Search ${ALL_LUCIDE_ICONS.length} icons (e.g. Sparkles, Users)...`}
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                className="h-8 text-[12px]"
              />
            </div>

            {/* Apply custom typed icon name */}
            {iconSearch.trim() && (
              <div className="flex items-center justify-between p-2 rounded-md bg-muted/40 border">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded bg-card border flex items-center justify-center">
                    {getNavIcon(iconSearch.trim(), true)}
                  </div>
                  <span className="text-[12px] font-mono truncate max-w-[140px]">{iconSearch.trim()}</span>
                </div>
                <button
                  onClick={() => {
                    onChangeCustomIcon?.(module.id, iconSearch.trim());
                  }}
                  className="text-[11px] font-medium bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90 transition-colors"
                >
                  Use Icon
                </button>
              </div>
            )}

            {/* Icons Grid with Optimized Infinite Scroll */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                <span>{iconSearch ? `Matching (${allFilteredIcons.length})` : "All Icons"}</span>
                <span>{visibleIcons.length} / {allFilteredIcons.length}</span>
              </div>
              <div
                onScroll={handleScroll}
                className="grid grid-cols-6 gap-1 max-h-48 overflow-y-auto p-1 border rounded-md bg-muted/20"
              >
                {visibleIcons.map((iconName) => (
                  <button
                    key={iconName}
                    onClick={() => {
                      onChangeCustomIcon?.(module.id, iconName);
                    }}
                    className={cn(
                      "h-8 w-8 rounded flex flex-col items-center justify-center transition-all hover:bg-card hover:shadow-sm border border-transparent",
                      (module.customIcon || module.icon) === iconName &&
                        "bg-primary/10 border-primary/40 text-primary shadow-sm"
                    )}
                    title={iconName}
                  >
                    {getNavIcon(iconName, true)}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "text-[14px] font-bold tracking-tight truncate transition-colors",
                module.enabled ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {module.name}
            </span>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="h-5 w-5 rounded-md flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
                  title="Preview header"
                >
                  <Eye className="h-3.5 w-3.5" />
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
          
          <div className="flex items-center gap-1.5 mt-1">
            {module.required && (
              <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-px rounded uppercase tracking-wide">
                Required
              </span>
            )}
            {module.isPublicFacing ? (
              <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                <Globe className="h-3 w-3" />
                Public
              </span>
            ) : (
              <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                <Lock className="h-3 w-3" />
                Internal
              </span>
            )}
            {!module.canRename && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Lock className="h-3 w-3 text-muted-foreground/40 ml-1" />
                  </TooltipTrigger>
                  <TooltipContent>Cannot rename this module</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </div>

      {/* Middle Section: Configuration Inputs */}
      <div className="flex-1 min-w-0 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
        {/* Custom Name */}
        <div className="relative group/input flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-2 flex items-center gap-1.5">
            Display Name
            <Pencil className="h-2.5 w-2.5 text-muted-foreground/30 opacity-0 group-hover/input:opacity-100 transition-opacity" />
          </label>
          {module.canRename && userRole !== "directory" ? (
            <Input
              value={module.customName ?? ""}
              placeholder={`e.g. ${module.name}`}
              onChange={(e) => onChangeCustomName(module.id, e.target.value)}
              disabled={!module.enabled}
              className={cn(
                "h-9 text-[13px] font-medium transition-all shadow-none",
                "bg-transparent border-transparent hover:border-border/80 focus:bg-background focus:border-ring",
                !module.enabled && "opacity-50 pointer-events-none",
              )}
            />
          ) : (
            <div className="h-9 flex items-center px-3 rounded-md bg-muted/20 border border-dashed border-border/40 cursor-not-allowed">
              <span className="text-[12px] text-muted-foreground/50 truncate">
                {module.customName || module.name}
              </span>
            </div>
          )}
        </div>

        {/* Subtitle */}
        <div className="relative group/input flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest pl-2 flex items-center gap-1.5">
            Subtitle
            <Pencil className="h-2.5 w-2.5 text-muted-foreground/30 opacity-0 group-hover/input:opacity-100 transition-opacity" />
          </label>
          {module.canRename && userRole !== "directory" ? (
            <Input
              value={module.subtitle ?? ""}
              placeholder="Add description..."
              onChange={(e) => onChangeSubtitle(module.id, e.target.value)}
              disabled={!module.enabled}
              className={cn(
                "h-9 text-[13px] font-medium transition-all shadow-none",
                "bg-transparent border-transparent hover:border-border/80 focus:bg-background focus:border-ring",
                !module.enabled && "opacity-50 pointer-events-none",
              )}
            />
          ) : (
            <div className="h-9 flex items-center px-3 rounded-md bg-muted/20 border border-dashed border-border/40 cursor-not-allowed">
              <span className="text-[12px] text-muted-foreground/50 truncate">
                {module.subtitle || "No subtitle"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Actions Box */}
      <div className="flex items-center gap-1.5 bg-muted/30 p-1.5 rounded-xl border border-border/50 shrink-0 w-full sm:w-auto overflow-x-auto">
        {/* Popular Toggle */}
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
                  "flex flex-col items-center justify-center gap-1 h-[42px] w-[52px] rounded-lg transition-all border",
                  module.isPopular
                    ? "bg-amber-50 border-amber-200 text-amber-500 shadow-sm"
                    : "bg-transparent border-transparent text-muted-foreground/50 hover:bg-muted hover:text-foreground",
                  !module.enabled && "opacity-40 cursor-not-allowed",
                )}
              >
                <Star className="h-4 w-4" fill={module.isPopular ? "currentColor" : "none"} />
                <span className="text-[9px] font-medium leading-none">Featured</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>{!module.enabled ? "Enable module first" : module.isPopular ? "Remove from featured" : "Feature this module"}</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="w-px h-6 bg-border mx-1"></div>

        {/* Mobile Nav Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (!module.enabled || !module.isPublicFacing || userRole === "directory") return;
                  if (!module.showInMobileNavigation && modules.filter((m) => m.showInMobileNavigation).length >= 3) return;
                  onToggleNavigation(module.id);
                }}
                disabled={!module.enabled || !module.isPublicFacing || userRole === "directory" || (!module.showInMobileNavigation && modules.filter((m) => m.showInMobileNavigation).length >= 3)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 h-[42px] w-[52px] rounded-lg transition-all border",
                  !module.isPublicFacing
                    ? "opacity-30 cursor-not-allowed bg-transparent border-transparent"
                    : module.showInMobileNavigation
                      ? "bg-violet-50 border-violet-200 text-violet-600 shadow-sm"
                      : "bg-transparent border-transparent text-muted-foreground/50 hover:bg-muted hover:text-foreground",
                  (!module.enabled || userRole === "directory") && "opacity-40 cursor-not-allowed",
                )}
              >
                <Smartphone className="h-4 w-4" />
                <span className="text-[9px] font-medium leading-none">App</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {!module.isPublicFacing
                ? "Internal modules cannot be added to mobile navigation"
                : !module.enabled
                  ? "Enable module first"
                  : module.showInMobileNavigation
                    ? "Remove from mobile navigation"
                    : modules.filter((m) => m.showInMobileNavigation).length >= 3
                      ? "Maximum 3 mobile nav slots reached"
                      : "Add to mobile app navigation"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Web Nav Toggle */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => {
                  if (!module.enabled || !module.isPublicFacing || userRole === "directory") return;
                  onToggleWebNavigation(module.id);
                }}
                disabled={!module.enabled || !module.isPublicFacing || userRole === "directory"}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 h-[42px] w-[52px] rounded-lg transition-all border",
                  !module.isPublicFacing
                    ? "opacity-30 cursor-not-allowed bg-transparent border-transparent"
                    : module.showInWebNavigation
                      ? "bg-blue-50 border-blue-200 text-blue-600 shadow-sm"
                      : "bg-transparent border-transparent text-muted-foreground/50 hover:bg-muted hover:text-foreground",
                  (!module.enabled || userRole === "directory") && "opacity-40 cursor-not-allowed",
                )}
              >
                <Monitor className="h-4 w-4" />
                <span className="text-[9px] font-medium leading-none">Web</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>
              {!module.isPublicFacing
                ? "Internal modules cannot be added to web navigation"
                : !module.enabled
                  ? "Enable module first"
                  : module.showInWebNavigation
                    ? "Remove from web sidebar"
                    : "Add to website sidebar navigation"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <div className="w-px h-6 bg-border mx-1"></div>

        {/* Main Status Switch */}
        <div className="flex items-center px-2 py-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1">
                  <Switch
                    checked={module.enabled}
                    onCheckedChange={() => onToggleModule(module.id)}
                    disabled={module.required || userRole === "directory"}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                  <span
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-wide transition-colors",
                      module.enabled ? "text-emerald-600" : "text-muted-foreground",
                    )}
                  >
                    {module.enabled ? "Enabled" : "Disabled"}
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
      </div>
    </div>
  );
}

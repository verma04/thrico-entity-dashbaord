import React from "react";
import {
  Star,
  Globe,
  Lock,
  Pencil,
  Eye,
  ChevronLeft,
  Smartphone,
  Monitor,
} from "lucide-react";
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
import { getNavIcon, ALL_LUCIDE_ICONS } from "./utils";
import type { ModuleItem } from "./types";

interface ModuleCardProps {
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

export default function ModuleCard({
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
}: ModuleCardProps) {
  const [iconSearch, setIconSearch] = React.useState("");
  const [displayCount, setDisplayCount] = React.useState(60);

  React.useEffect(() => {
    setDisplayCount(60);
  }, [iconSearch]);

  const allFilteredIcons = React.useMemo(() => {
    if (!iconSearch.trim()) return ALL_LUCIDE_ICONS;
    const query = iconSearch.toLowerCase();
    return ALL_LUCIDE_ICONS.filter((name) =>
      name.toLowerCase().includes(query),
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
        "flex flex-col justify-between rounded-xl border bg-card p-4 transition-all duration-200 group relative shadow-2xs hover:shadow-sm",
        module.enabled
          ? "border-border/70 hover:border-border hover:bg-card"
          : "border-border/30 bg-muted/10 opacity-70 hover:opacity-100",
      )}
    >
      {/* Top accent line */}
      <div
        className={cn(
          "absolute top-0 left-4 right-4 h-0.5 rounded-b-full transition-colors",
          !module.enabled
            ? "bg-muted-foreground/20"
            : module.isPublicFacing
              ? "bg-emerald-400"
              : "bg-slate-300",
        )}
      />

      <div className="space-y-4">
        {/* Top Bar: Icon + Identity + Switch */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-3 min-w-0">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  disabled={!module.enabled || userRole === "directory"}
                  className={cn(
                    "h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 transition-colors relative group/icon cursor-pointer",
                    module.enabled
                      ? module.isPublicFacing
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 hover:border-emerald-400 shadow-2xs"
                        : "bg-muted border-border hover:border-foreground/30 shadow-2xs"
                      : "bg-muted/50 border-border/30 cursor-not-allowed",
                  )}
                  title="Click to customize icon"
                >
                  <div className="scale-100">
                    {getNavIcon(
                      module.customIcon || module.icon,
                      module.enabled,
                      module.name,
                    )}
                  </div>
                  {module.enabled && userRole !== "directory" && (
                    <div className="absolute inset-0 bg-background/80 rounded-lg flex items-center justify-center opacity-0 group-hover/icon:opacity-100 transition-opacity">
                      <Pencil className="h-3.5 w-3.5 text-foreground" />
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

                {/* Custom Icon Search */}
                <div className="relative">
                  <Input
                    placeholder={`Search ${ALL_LUCIDE_ICONS.length} icons...`}
                    value={iconSearch}
                    onChange={(e) => setIconSearch(e.target.value)}
                    className="h-8 text-[12px]"
                  />
                </div>

                {/* Custom Typed Icon */}
                {iconSearch.trim() && (
                  <div className="flex items-center justify-between p-2 rounded-md bg-muted/40 border">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded bg-card border flex items-center justify-center">
                        {getNavIcon(iconSearch.trim(), true)}
                      </div>
                      <span className="text-[12px] font-mono truncate max-w-[140px]">
                        {iconSearch.trim()}
                      </span>
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

                {/* Icons Grid */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    <span>
                      {iconSearch
                        ? `Matching (${allFilteredIcons.length})`
                        : "All Icons"}
                    </span>
                    <span>
                      {visibleIcons.length} / {allFilteredIcons.length}
                    </span>
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
                          "h-8 w-8 rounded flex flex-col items-center justify-center transition-all hover:bg-card hover:shadow-2xs border border-transparent",
                          (module.customIcon || module.icon) === iconName &&
                            "bg-primary/10 border-primary/40 text-primary shadow-2xs",
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
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "text-[13px] font-bold tracking-tight truncate",
                    module.enabled ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {module.name}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      className="h-4 w-4 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
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
                      <div className="h-10 w-10 rounded-full border border-border/60 bg-background flex items-center justify-center shrink-0 shadow-2xs">
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
                  <span className="text-[9px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/60 px-1.5 py-px rounded uppercase tracking-wide">
                    Required
                  </span>
                )}
                {module.isPublicFacing ? (
                  <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                    <Globe className="h-2.5 w-2.5" />
                    Public
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
                    <Lock className="h-2.5 w-2.5" />
                    Internal
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Module Switch */}
          <div className="flex flex-col items-end gap-1 shrink-0">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center">
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={() => onToggleModule(module.id)}
                      disabled={module.required || userRole === "directory"}
                    />
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
            <span
              className={cn(
                "text-[9px] font-bold uppercase tracking-wide transition-colors",
                module.enabled ? "text-foreground" : "text-muted-foreground",
              )}
            >
              {module.enabled ? "Enabled" : "Disabled"}
            </span>
          </div>
        </div>

        {/* Middle Inputs: Display Name & Subtitle */}
        <div className="space-y-2.5 pt-1">
          <div className="relative group/input flex flex-col gap-1">
            <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Display Name</span>
              <Pencil className="h-2.5 w-2.5 text-muted-foreground/30 opacity-0 group-hover/input:opacity-100 transition-opacity" />
            </label>
            {module.canRename && userRole !== "directory" ? (
              <Input
                value={module.customName ?? ""}
                placeholder={`e.g. ${module.name}`}
                onChange={(e) => onChangeCustomName(module.id, e.target.value)}
                disabled={!module.enabled}
                className={cn(
                  "h-7 text-[11px] font-medium transition-all shadow-none bg-muted/20 border-border/50 hover:border-border focus:bg-background focus:border-ring rounded-md",
                  !module.enabled && "opacity-50 pointer-events-none",
                )}
              />
            ) : (
              <div className="h-7 flex items-center px-2 rounded-md bg-muted/20 border border-dashed border-border/40 cursor-not-allowed">
                <span className="text-[11px] text-muted-foreground/50 truncate">
                  {module.customName || module.name}
                </span>
              </div>
            )}
          </div>

          <div className="relative group/input flex flex-col gap-1">
            <label className="text-[9px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
              <span>Subtitle</span>
              <Pencil className="h-2.5 w-2.5 text-muted-foreground/30 opacity-0 group-hover/input:opacity-100 transition-opacity" />
            </label>
            {module.canRename && userRole !== "directory" ? (
              <Input
                value={module.subtitle ?? ""}
                placeholder="Add description..."
                onChange={(e) => onChangeSubtitle(module.id, e.target.value)}
                disabled={!module.enabled}
                className={cn(
                  "h-7 text-[11px] font-medium transition-all shadow-none bg-muted/20 border-border/50 hover:border-border focus:bg-background focus:border-ring rounded-md",
                  !module.enabled && "opacity-50 pointer-events-none",
                )}
              />
            ) : (
              <div className="h-7 flex items-center px-2 rounded-md bg-muted/20 border border-dashed border-border/40 cursor-not-allowed">
                <span className="text-[11px] text-muted-foreground/50 truncate">
                  {module.subtitle || "No subtitle"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Action Footer */}
      <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/50">
        <div className="flex items-center gap-1">
          {/* Popular Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    if (!module.enabled) return;
                    onTogglePopular(module.id);
                  }}
                  disabled={!module.enabled}
                  className={cn(
                    "flex items-center gap-1 h-6 px-2 rounded-md text-[10px] font-medium transition-all border",
                    module.isPopular
                      ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400 shadow-2xs"
                      : "bg-transparent border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                    !module.enabled && "opacity-40 cursor-not-allowed",
                  )}
                >
                  <Star
                    className="h-3 w-3"
                    fill={module.isPopular ? "currentColor" : "none"}
                  />
                  <span>Popular</span>
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

        {/* Navigation Toggles */}
        <div className="flex items-center gap-1">
          {/* Mobile Nav Toggle */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  onClick={() => {
                    if (
                      !module.enabled ||
                      !module.isPublicFacing ||
                      userRole === "directory"
                    )
                      return;
                    if (
                      !module.showInMobileNavigation &&
                      modules.filter((m) => m.showInMobileNavigation).length >= 3
                    )
                      return;
                    onToggleNavigation(module.id);
                  }}
                  disabled={
                    !module.enabled ||
                    !module.isPublicFacing ||
                    userRole === "directory" ||
                    (!module.showInMobileNavigation &&
                      modules.filter((m) => m.showInMobileNavigation).length >= 3)
                  }
                  className={cn(
                    "flex items-center gap-1 h-6 px-2 rounded-md text-[10px] font-medium transition-all border",
                    !module.isPublicFacing
                      ? "opacity-30 cursor-not-allowed bg-transparent border-transparent text-muted-foreground"
                      : module.showInMobileNavigation
                        ? "bg-violet-500/10 border-violet-500/30 text-violet-600 dark:text-violet-400 shadow-2xs"
                        : "bg-transparent border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                    (!module.enabled || userRole === "directory") &&
                      "opacity-40 cursor-not-allowed",
                  )}
                >
                  <Smartphone className="h-3 w-3" />
                  <span>App</span>
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
                  type="button"
                  onClick={() => {
                    if (
                      !module.enabled ||
                      !module.isPublicFacing ||
                      userRole === "directory"
                    )
                      return;
                    onToggleWebNavigation(module.id);
                  }}
                  disabled={
                    !module.enabled ||
                    !module.isPublicFacing ||
                    userRole === "directory"
                  }
                  className={cn(
                    "flex items-center gap-1 h-6 px-2 rounded-md text-[10px] font-medium transition-all border",
                    !module.isPublicFacing
                      ? "opacity-30 cursor-not-allowed bg-transparent border-transparent text-muted-foreground"
                      : module.showInWebNavigation
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400 shadow-2xs"
                        : "bg-transparent border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
                    (!module.enabled || userRole === "directory") &&
                      "opacity-40 cursor-not-allowed",
                  )}
                >
                  <Monitor className="h-3 w-3" />
                  <span>Web</span>
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
        </div>
      </div>
    </div>
  );
}

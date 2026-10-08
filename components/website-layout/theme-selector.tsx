import React from "react";
import {
  ThemeType,
  useWebsiteBuilderStore,
} from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  Building2,
  Palette,
  Users2,
  Rocket,
  Check,
  ChevronDown,
  Lock,
} from "lucide-react";
import { useIsPremium } from "@/hooks/useIsPremium";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useDrawerStore } from "@/store/drawerStore";
import { ThemeCustomizer } from "./theme-customizer";

const THEMES: {
  id: ThemeType;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  preview: string;
}[] = [
  {
    id: "academia",
    name: "Academia",
    description: "Clean, structured, educational",
    icon: GraduationCap,
    color: "text-blue-600 dark:text-blue-400",
    bgGradient: "from-blue-50 to-indigo-100",
    preview: "Perfect for schools & universities",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Professional, corporate, reliable",
    icon: Building2,
    color: "text-slate-700 dark:text-slate-300",
    bgGradient: "from-slate-50 to-gray-100",
    preview: "Ideal for business & corporate",
  },
  {
    id: "creator",
    name: "Creator",
    description: "Vibrant, personal, bold",
    icon: Palette,
    color: "text-purple-600 dark:text-purple-400",
    bgGradient: "from-purple-50 to-pink-100",
    preview: "Great for artists & creators",
  },
  {
    id: "association",
    name: "Association",
    description: "Community-focused, welcoming",
    icon: Users2,
    color: "text-emerald-600 dark:text-emerald-400",
    bgGradient: "from-emerald-50 to-green-100",
    preview: "Perfect for communities & NGOs",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Modern, dynamic, fast",
    icon: Rocket,
    color: "text-orange-600 dark:text-orange-400",
    bgGradient: "from-orange-50 to-yellow-100",
    preview: "Built for startups & tech",
  },
];

const ThemeSelector = () => {
  const { theme, currentTheme, setTheme } = useWebsiteBuilderStore();
  const [isExpanded, setIsExpanded] = React.useState(false);
  const { isPremium } = useIsPremium();

  const currentThemeData = THEMES.find((t) => t.id === theme) || THEMES[0];
  const CurrentIcon = currentThemeData.icon;
  const { openDrawer } = useDrawerStore();

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-bold text-[#616161] dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
          Theme Archetype
        </h3>
      </div>

      {/* Current Theme Display */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative group",
              isPremium ? "cursor-pointer" : "cursor-not-allowed opacity-80",
            )}
            onClick={() => isPremium && setIsExpanded(!isExpanded)}
          >
            <div
              className={cn(
                "flex items-center gap-2.5 p-2 rounded-[8px] border transition-all duration-150 bg-white dark:bg-zinc-900",
                isPremium
                  ? "border-[#d2d5d9] dark:border-zinc-800 hover:border-[#303030] dark:hover:border-zinc-500 shadow-2xs"
                  : "border-[#d2d5d9] dark:border-zinc-800 grayscale",
              )}
            >
              <div className="shrink-0 p-1.5 rounded-[5px] bg-[#f6f6f7] dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700">
                <CurrentIcon className="h-3.5 w-3.5 text-[#303030] dark:text-zinc-100" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100 block">
                  {currentThemeData.name}
                </span>
                <p className="text-[10.5px] text-[#616161] dark:text-zinc-400 truncate leading-tight">
                  {currentThemeData.description}
                </p>
              </div>
              {!isPremium ? (
                <Lock className="h-3 w-3 text-muted-foreground/50 shrink-0" />
              ) : (
                <ChevronDown
                  className={cn(
                    "h-3 w-3 text-muted-foreground transition-transform duration-150 shrink-0",
                    isExpanded && "rotate-180",
                  )}
                />
              )}
            </div>
          </div>
        </TooltipTrigger>
        {!isPremium && (
          <TooltipContent side="right" className="max-w-xs text-xs">
            <div className="space-y-1">
              <p className="font-semibold">Premium Feature</p>
              <p className="text-[11px] text-muted-foreground">
                Upgrade your subscription to customize themes and unlock premium layouts.
              </p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>

      {/* Upgrade Prompt for Non-Premium Users */}
      {!isPremium && (
        <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-lg border border-indigo-200 dark:border-indigo-800">
          <p className="text-[10.5px] font-medium text-indigo-950 dark:text-indigo-200 mb-1.5">
            Unlock {THEMES.length} premium design archetypes
          </p>
          <Button
            type="button"
            onClick={() => openDrawer()}
            size="sm"
            className="w-full h-6.5 text-[10px] font-semibold bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs cursor-pointer"
          >
            Upgrade Plan
          </Button>
        </div>
      )}

      {/* Theme Options Grid */}
      <div
        className={cn(
          "grid gap-2 transition-all duration-200 overflow-hidden",
          isExpanded
            ? "grid-rows-[1fr] opacity-100 pt-1"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-1.5 pb-1">
            {THEMES.map((item) => {
              const Icon = item.icon;
              const isSelected = currentTheme === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setTheme(item.id);
                    setIsExpanded(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-[6px] border text-left transition-all cursor-pointer w-full",
                    isSelected
                      ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
                      : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                  )}
                >
                  <div
                    className={cn(
                      "p-1.5 rounded-[4px] border shrink-0 transition-colors",
                      isSelected
                        ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
                        : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
                    )}
                  >
                    <Icon className="h-3 w-3" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100 block">
                        {item.name}
                      </span>
                      {isSelected && (
                        <Check className="h-3 w-3 text-[#303030] dark:text-zinc-100 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-[#616161] dark:text-zinc-400 truncate mt-0.5">
                      {item.preview}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Custom Colors Section */}
      <ThemeCustomizer />
    </div>
  );
};

export default ThemeSelector;

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
  Sparkles,
  Moon,
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
  icon: any;
  color: string;
  bgGradient: string;
  preview: string;
}[] = [
  {
    id: "academia",
    name: "Academia",
    description: "Clean, structured, educational",
    icon: GraduationCap,
    color: "text-blue-600",
    bgGradient: "from-blue-50 to-indigo-100",
    preview: "Perfect for schools & universities",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "Professional, corporate, reliable",
    icon: Building2,
    color: "text-slate-700",
    bgGradient: "from-slate-50 to-gray-100",
    preview: "Ideal for business & corporate",
  },
  {
    id: "creator",
    name: "Creator",
    description: "Vibrant, personal, bold",
    icon: Palette,
    color: "text-purple-600",
    bgGradient: "from-purple-50 to-pink-100",
    preview: "Great for artists & creators",
  },
  {
    id: "association",
    name: "Association",
    description: "Community-focused, welcoming",
    icon: Users2,
    color: "text-emerald-600",
    bgGradient: "from-emerald-50 to-green-100",
    preview: "Perfect for communities & NGOs",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Modern, dynamic, fast",
    icon: Rocket,
    color: "text-orange-600",
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
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5">
          <Palette className="h-3 w-3 text-primary/60" />
          Theme
        </h3>
      </div>

      {/* Current Theme Display */}
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "relative group",
              isPremium ? "cursor-pointer" : "cursor-not-allowed opacity-80"
            )}
            onClick={() => isPremium && setIsExpanded(!isExpanded)}
          >
            <div
              className={cn(
                "flex items-center gap-2.5 bg-card p-2.5 rounded-lg border transition-all duration-150",
                isPremium
                  ? "border-border/60 hover:border-primary/40 group-hover:shadow-sm"
                  : "border-muted-foreground/20 grayscale"
              )}
            >
              <div className="shrink-0 p-1.5 rounded-md bg-primary/8">
                <CurrentIcon className="h-3.5 w-3.5 text-primary/70" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-xs font-semibold text-foreground">
                  {currentThemeData.name}
                </span>
                <p className="text-[10px] text-muted-foreground/60 truncate">
                  {currentThemeData.description}
                </p>
              </div>
              {!isPremium ? (
                <Lock className="h-3 w-3 text-muted-foreground/50" />
              ) : (
                <ChevronDown
                  className={cn(
                    "h-3 w-3 text-muted-foreground/50 transition-transform duration-150",
                    isExpanded && "rotate-180"
                  )}
                />
              )}
            </div>
          </div>
        </TooltipTrigger>
        {!isPremium && (
          <TooltipContent side="right" className="max-w-xs">
            <div className="space-y-2">
              <p className="font-semibold">Premium Feature</p>
              <p className="text-xs">
                Upgrade your subscription to customize themes and unlock premium
                layouts.
              </p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>

      {/* Upgrade Prompt for Non-Premium Users */}
      {!isPremium && (
        <div className="mt-1.5 p-2 bg-muted/40 rounded-md border border-dashed">
          <p className="text-[10px] text-muted-foreground mb-1.5">
            🎨 Unlock {THEMES.length} premium themes
          </p>
          <Button
            onClick={() => openDrawer()}
            size="sm"
            variant="outline"
            className="w-full h-6 text-[10px]"
          >
            Upgrade
          </Button>
        </div>
      )}

      {/* Theme Options Grid */}
      <div
        className={cn(
          "grid gap-3 transition-all duration-300 overflow-hidden",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 gap-3 pb-2">
            {THEMES.map((theme) => {
              const Icon = theme.icon;
              const isSelected = currentTheme === theme.id;

              return (
                <button
                  key={theme.id}
                  onClick={() => {
                    setTheme(theme.id);
                    setIsExpanded(false);
                  }}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded-lg border transition-all duration-150 text-left group hover:scale-[1.01] active:scale-[0.99]",
                    isSelected
                      ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                      : "border-transparent hover:bg-muted/40 hover:border-border/40"
                  )}
                >
                  <div
                    className={cn(
                      "p-1.5 rounded-md transition-colors",
                      isSelected
                        ? "bg-primary/15"
                        : theme.id === "dark-mode"
                        ? "bg-slate-800"
                        : "bg-muted/60"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-3 w-3",
                        isSelected ? "text-primary" : theme.color
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        {theme.name}
                      </span>
                      {isSelected && <Check className="h-3 w-3 text-primary" />}
                    </div>
                    <p className="text-[10px] text-muted-foreground/60 truncate">
                      {theme.preview}
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

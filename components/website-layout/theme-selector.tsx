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
import { Separator } from "@/components/ui/separator";

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
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Palette className="h-4 w-4 text-primary" />
          Theme Style
        </h3>
        <span className="text-xs text-muted-foreground">
          {THEMES.length} themes
        </span>
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
                "flex items-center gap-3 bg-card p-4 rounded-xl border-2 transition-all duration-200",
                isPremium
                  ? "border-primary/30 hover:border-primary/50 group-hover:shadow-md"
                  : "border-muted-foreground/20 grayscale"
              )}
            >
              <div className="shrink-0 p-2 rounded-lg bg-primary/10">
                <CurrentIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {currentThemeData.name}
                  </span>
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {currentThemeData.description}
                </p>
              </div>
              {!isPremium ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
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
        <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-dashed">
          <p className="text-xs text-muted-foreground mb-2">
            🎨 Unlock {THEMES.length} premium themes
          </p>
          <Button
            onClick={() => openDrawer()}
            size="sm"
            variant="outline"
            className="w-full h-7 text-xs"
          >
            Upgrade Subscription
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
                    "flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 text-left group hover:scale-[1.02] active:scale-[0.98]",
                    isSelected
                      ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary/20"
                      : "border-border/30 bg-card hover:bg-muted/50 hover:border-border/60"
                  )}
                >
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      isSelected
                        ? "bg-primary/20"
                        : theme.id === "dark-mode"
                        ? "bg-slate-800"
                        : "bg-muted"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        isSelected ? "text-primary" : theme.color
                      )}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isSelected ? "text-primary" : "text-foreground"
                        )}
                      >
                        {theme.name}
                      </span>
                      {isSelected && <Check className="h-4 w-4 text-primary" />}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {theme.preview}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Theme Info */}
      <div className="pt-2 pb-1">
        <p className="text-xs text-muted-foreground text-center italic">
          Themes automatically adjust layouts and styling
        </p>
      </div>

      {/* Custom Colors Section */}
      <Separator className="my-4" />
      <ThemeCustomizer />
    </div>
  );
};

export default ThemeSelector;

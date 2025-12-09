import React from "react";
import { ThemeType, useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { cn } from "@/lib/utils";
import { GraduationCap, Building2, Palette, Users2, Rocket, Sparkles } from "lucide-react";

const THEMES: { id: ThemeType; name: string; description: string; icon: any; color: string }[] = [
  { id: "academia", name: "Academia", description: "Clean, structured, educational", icon: GraduationCap, color: "text-blue-600" },
  { id: "enterprise", name: "Enterprise", description: "Professional, corporate, reliable", icon: Building2, color: "text-slate-700" },
  { id: "creator", name: "Creator", description: "Vibrant, personal, bold", icon: Palette, color: "text-purple-600" },
  { id: "association", name: "Association", description: "Community-focused, welcoming", icon: Users2, color: "text-emerald-600" },
  { id: "startup", name: "Startup", description: "Modern, dynamic, fast", icon: Rocket, color: "text-orange-600" },
];

const ThemeSelector = () => {
  const { currentTheme, setTheme } = useWebsiteBuilderStore();
  
  const currentThemeData = THEMES.find(t => t.id === currentTheme) || THEMES[0];
  const CurrentIcon = currentThemeData.icon;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Select Theme
        </h3>
      </div>
      
      {/* Native Select with Icon */}
      <div className="relative">
        <div className="flex items-center gap-3 bg-background border-2 border-primary/20 rounded-lg px-3 py-3 hover:border-primary/40 transition-colors">
          <div className={cn("shrink-0", currentThemeData.color)}>
            <CurrentIcon className="h-5 w-5" />
          </div>
          <select
            value={currentTheme}
            onChange={(e) => setTheme(e.target.value as ThemeType)}
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium cursor-pointer"
          >
            {THEMES.map((theme) => (
              <option key={theme.id} value={theme.id}>
                {theme.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Theme Preview Cards */}
      <div className="grid grid-cols-2 gap-2">
        {THEMES.map((theme) => {
          const Icon = theme.icon;
          return (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border transition-all text-left hover:scale-105",
                currentTheme === theme.id 
                  ? "border-primary bg-primary/10 shadow-sm" 
                  : "border-border/50 bg-muted/30 hover:bg-muted/50"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", theme.color)} />
              <span className={cn(
                "text-xs font-medium truncate",
                currentTheme === theme.id ? "text-primary" : "text-foreground"
              )}>
                {theme.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* Theme Description at Bottom */}
      <div className="pt-1 pb-1">
        <p className="text-xs text-muted-foreground text-center italic">
          {currentThemeData.description}
        </p>
      </div>
    </div>
  );
};

export default ThemeSelector;

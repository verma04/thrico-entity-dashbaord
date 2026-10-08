"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useWebsiteBuilderStore } from "@/store/useWebsiteBuilderStore";
import { ColorPicker } from "./color-picker";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, Sparkles, ChevronDown } from "lucide-react";
import { applyCustomTheme, resetCustomTheme } from "@/lib/theme-color-utils";
import { useIsPremium } from "@/hooks/useIsPremium";
import { useDrawerStore } from "@/store/drawerStore";
import { cn } from "@/lib/utils";
import { useUpdateWebsiteCustomColors } from "@/graphql/actions/website";
import { useGetWebsite } from "@/graphql/actions/website";
import { useToast } from "@/hooks/use-toast";

export function ThemeCustomizer() {
  const { customColors, setCustomColor, resetCustomColors } =
    useWebsiteBuilderStore();
  const { isPremium } = useIsPremium();
  const { openDrawer } = useDrawerStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { toast } = useToast();

  // Get website ID
  const { data: websiteData } = useGetWebsite();
  const websiteId = websiteData?.getWebsite?.id;

  // GraphQL mutation for saving colors
  const [updateColors] = useUpdateWebsiteCustomColors();

  // Timeout ref for debounced save
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Debounced save function
  const debouncedSave = useCallback(
    (colors: typeof customColors) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(async () => {
        if (!websiteId || Object.keys(colors).length === 0) return;

        try {
          await updateColors({
            variables: {
              websiteId,
              customColors: {
                primary: colors.primary,
                secondary: colors.secondary,
                accent: colors.accent,
                background: colors.background,
                muted: colors.muted,
                border: colors.border,
                buttonColor: colors.buttonColor,
                buttonTextColor: colors.buttonTextColor,
                borderRadius: colors.borderRadius,
                spacing: colors.spacing,
                fontSize: colors.fontSize,
              },
            },
          });
        } catch (error) {
          console.error("Failed to save custom colors:", error);
          toast({
            title: "Error",
            description: "Failed to save custom colors",
            variant: "destructive",
          });
        }
      }, 1000); // 1 second debounce
    },
    [websiteId, updateColors, toast],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Apply custom colors when they change
  useEffect(() => {
    if (Object.keys(customColors).length > 0) {
      applyCustomTheme(customColors);
      debouncedSave(customColors);
    } else {
      resetCustomTheme();
    }
  }, [customColors, debouncedSave]);

  const handleColorChange = (
    colorKey: keyof typeof customColors,
    value: string | number,
  ) => {
    setCustomColor(colorKey, value as string);
  };

  const handleReset = async () => {
    resetCustomColors();
    resetCustomTheme();

    // Also reset on backend
    if (websiteId) {
      try {
        await updateColors({
          variables: {
            websiteId,
            customColors: {},
          },
        });
      } catch (error) {
        console.error("Failed to reset custom colors:", error);
      }
    }
  };

  const hasCustomColors = Object.keys(customColors).length > 0;

  if (!isPremium) {
    return (
      <div className="p-3 bg-white dark:bg-zinc-900 rounded-xl border border-[#d2d5d9] dark:border-zinc-800 shadow-2xs">
        <div className="flex items-start gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <div className="flex-1 space-y-1.5 min-w-0">
            <div>
              <h3 className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                Custom Palette
              </h3>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Unlock custom branding and theme colors.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => openDrawer()}
              size="sm"
              className="w-full h-7 text-[11px] font-medium bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white shadow-2xs cursor-pointer"
            >
              Upgrade Studio
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {/* Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer border shadow-2xs",
          isExpanded
            ? "border-indigo-600 dark:border-indigo-500 bg-indigo-50/70 dark:bg-indigo-950/40 ring-1 ring-indigo-500/20"
            : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-indigo-300 dark:hover:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800/60",
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Sparkles className="h-3 w-3" />
          </div>
          <span className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
            Brand Colors
          </span>
          {hasCustomColors && (
            <span className="text-[9.5px] bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 px-1.5 py-0.5 rounded-md font-semibold border border-indigo-200 dark:border-indigo-800">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasCustomColors && (
            <Button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              size="sm"
              variant="ghost"
              className="h-5 text-[10px] gap-0.5 px-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              Reset
            </Button>
          )}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground/60 transition-transform",
              isExpanded && "rotate-180",
            )}
          />
        </div>
      </button>

      {/* Expanded Content */}
      <div
        className={cn(
          "grid transition-all duration-200 overflow-hidden",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="p-2.5 space-y-2.5 bg-[#f6f6f7] dark:bg-zinc-950 rounded-xl border border-[#d2d5d9] dark:border-zinc-800 shadow-2xs">
            {/* Colors Section */}
            <div className="space-y-2">
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#616161] dark:text-zinc-400">
                Palette Tokens
              </div>

              {/* All 6 colors in a 3-column grid */}
              <div className="grid grid-cols-3 gap-2">
                <ColorPicker
                  label="Primary"
                  value={customColors.primary || "#3B82F6"}
                  onChange={(value) => handleColorChange("primary", value)}
                  compact
                />
                <ColorPicker
                  label="Secondary"
                  value={customColors.secondary || "#8B5CF6"}
                  onChange={(value) => handleColorChange("secondary", value)}
                  compact
                />
                <ColorPicker
                  label="Accent"
                  value={customColors.accent || "#10B981"}
                  onChange={(value) => handleColorChange("accent", value)}
                  compact
                />
                <ColorPicker
                  label="Background"
                  value={customColors.background || "#FFFFFF"}
                  onChange={(value) => handleColorChange("background", value)}
                  compact
                />
                <ColorPicker
                  label="Muted"
                  value={customColors.muted || "#F3F4F6"}
                  onChange={(value) => handleColorChange("muted", value)}
                  compact
                />
                <ColorPicker
                  label="Border"
                  value={customColors.border || "#E5E7EB"}
                  onChange={(value) => handleColorChange("border", value)}
                  compact
                />
              </div>

              {/* Button Colors */}
              <div className="text-[10.5px] font-bold uppercase tracking-wider text-[#616161] dark:text-zinc-400 pt-1">
                Button Accents
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ColorPicker
                  label="Button BG"
                  value={customColors.buttonColor || "#3B82F6"}
                  onChange={(value) => handleColorChange("buttonColor", value)}
                  compact
                />
                <ColorPicker
                  label="Button Text"
                  value={customColors.buttonTextColor || "#FFFFFF"}
                  onChange={(value) =>
                    handleColorChange("buttonTextColor", value)
                  }
                  compact
                />
              </div>
            </div>

            {/* Advanced Settings Toggle */}
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-900 transition-colors cursor-pointer border border-transparent hover:border-[#d2d5d9] dark:hover:border-zinc-800"
            >
              <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#616161] dark:text-zinc-400">
                Advanced Geometry
              </span>
              <ChevronDown
                className={cn(
                  "h-3 w-3 text-muted-foreground/60 transition-transform",
                  showAdvanced && "rotate-180",
                )}
              />
            </button>

            {/* Advanced Settings */}
            {showAdvanced && (
              <div className="space-y-2.5 pt-0.5">
                {/* Border Radius */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-medium text-muted-foreground/70">
                      Radius
                    </Label>
                    <span className="text-[10px] font-mono text-muted-foreground/50">
                      {customColors.borderRadius ?? 10}px
                    </span>
                  </div>
                  <Slider
                    value={[customColors.borderRadius ?? 10]}
                    onValueChange={([value]) =>
                      handleColorChange("borderRadius", value)
                    }
                    min={0}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>

                {/* Spacing */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-medium text-muted-foreground/70">
                      Spacing
                    </Label>
                    <span className="text-[10px] font-mono text-muted-foreground/50">
                      {customColors.spacing ?? 1}x
                    </span>
                  </div>
                  <Slider
                    value={[customColors.spacing ?? 1]}
                    onValueChange={([value]) =>
                      handleColorChange("spacing", value)
                    }
                    min={0.5}
                    max={2}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                {/* Font Size */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-[10px] font-medium text-muted-foreground/70">
                      Font Size
                    </Label>
                    <span className="text-[10px] font-mono text-muted-foreground/50">
                      {customColors.fontSize ?? 16}px
                    </span>
                  </div>
                  <Slider
                    value={[customColors.fontSize ?? 16]}
                    onValueChange={([value]) =>
                      handleColorChange("fontSize", value)
                    }
                    min={12}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

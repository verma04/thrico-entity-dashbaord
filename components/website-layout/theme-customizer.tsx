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

  // Debounced save function
  const debouncedSave = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (colors: typeof customColors) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(async () => {
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
      };
    })(),
    [websiteId, updateColors, toast]
  );

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
    value: string | number
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
      <div className="p-2 bg-linear-to-br from-primary/5 to-primary/8 rounded-md border border-primary/15">
        <div className="flex items-start gap-2">
          <div className="p-1.5 bg-primary/10 rounded-md shrink-0">
            <Sparkles className="h-3 w-3 text-primary/70" />
          </div>
          <div className="flex-1 space-y-1.5">
            <h3 className="text-xs font-semibold">Custom Colors</h3>
            <p className="text-[10px] text-muted-foreground/70">
              Match your brand colors
            </p>
            <Button
              onClick={() => openDrawer()}
              size="sm"
              className="w-full h-6 text-[10px]"
            >
              Upgrade
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center justify-between p-2 rounded-md transition-all",
          "hover:bg-muted/40 border",
          isExpanded ? "border-primary/25 bg-primary/5" : "border-transparent"
        )}
      >
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary/70" />
          <span className="text-xs font-semibold">Colors</span>
          {hasCustomColors && (
            <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-px rounded-full font-medium">
              Active
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasCustomColors && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleReset();
              }}
              size="sm"
              variant="ghost"
              className="h-5 text-[10px] gap-0.5 px-1.5"
            >
              <RotateCcw className="h-2.5 w-2.5" />
              Reset
            </Button>
          )}
          <ChevronDown
            className={cn(
              "h-3 w-3 text-muted-foreground/50 transition-transform",
              isExpanded && "rotate-180"
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
            : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <div className="p-2 space-y-2 bg-muted/20 rounded-md">
            {/* Colors Section */}
            <div className="space-y-2">
              <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
                Colors
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
              <div className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider pt-1">
                Buttons
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
                  onChange={(value) => handleColorChange("buttonTextColor", value)}
                  compact
                />
              </div>
            </div>

            {/* Advanced Settings Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between p-1.5 rounded-md hover:bg-background/50 transition-colors"
            >
              <span className="text-[10px] font-semibold text-muted-foreground/60 uppercase tracking-wider">
                Advanced
              </span>
              <ChevronDown
                className={cn(
                  "h-2.5 w-2.5 text-muted-foreground/40 transition-transform",
                  showAdvanced && "rotate-180"
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

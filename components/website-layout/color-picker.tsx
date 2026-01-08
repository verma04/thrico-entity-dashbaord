"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, Palette } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { isValidHexColor } from "@/lib/theme-color-utils";

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  showContrast?: boolean;
  contrastWith?: string;
  compact?: boolean;
}

const DEFAULT_PRESETS = [
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#F59E0B", // Amber
  "#10B981", // Emerald
  "#06B6D4", // Cyan
  "#EF4444", // Red
  "#6366F1", // Indigo
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#84CC16", // Lime
  "#A855F7", // Violet
];

export function ColorPicker({
  label,
  value,
  onChange,
  presets = DEFAULT_PRESETS,
  showContrast = false,
  contrastWith,
  compact = false,
}: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value || "#000000");
  const [isOpen, setIsOpen] = useState(false);

  const handleColorChange = (newColor: string) => {
    if (isValidHexColor(newColor)) {
      setInputValue(newColor);
      onChange(newColor);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    if (isValidHexColor(newValue)) {
      onChange(newValue);
    }
  };

  if (compact) {
    return (
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground">
          {label}
        </Label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <button
              className={cn(
                "w-full flex items-center gap-2 p-2 rounded-md border transition-all",
                "hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20"
              )}
            >
              <div
                className="w-8 h-8 rounded border shadow-sm shrink-0"
                style={{ backgroundColor: inputValue }}
              />
              <span className="text-xs font-mono flex-1 text-left truncate">
                {inputValue}
              </span>
              <Palette className="h-3 w-3 text-muted-foreground shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72" align="start">
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="#000000"
                  className="font-mono text-xs h-8"
                />
                <input
                  type="color"
                  value={inputValue}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-10 h-8 rounded border cursor-pointer"
                />
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      handleColorChange(preset);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full aspect-square rounded border transition-all hover:scale-110",
                      preset === inputValue ? "ring-2 ring-primary" : ""
                    )}
                    style={{ backgroundColor: preset }}
                    title={preset}
                  >
                    {preset === inputValue && (
                      <Check className="h-3 w-3 text-white drop-shadow-md mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>

      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all",
              "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            )}
          >
            <div
              className="w-10 h-10 rounded-md border-2 border-border shadow-sm"
              style={{ backgroundColor: inputValue }}
            />
            <div className="flex-1 text-left">
              <div className="text-sm font-medium">{inputValue}</div>
              <div className="text-xs text-muted-foreground">
                Click to customize
              </div>
            </div>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>

        <PopoverContent className="w-80" align="start">
          <div className="space-y-4">
            {/* Color Input */}
            <div className="space-y-2">
              <Label htmlFor="color-input" className="text-xs">
                Hex Color
              </Label>
              <div className="flex gap-2">
                <Input
                  id="color-input"
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="#000000"
                  className="font-mono"
                />
                <input
                  type="color"
                  value={inputValue}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-12 h-10 rounded border-2 border-border cursor-pointer"
                />
              </div>
            </div>

            {/* Preset Colors */}
            <div className="space-y-2">
              <Label className="text-xs">Preset Colors</Label>
              <div className="grid grid-cols-6 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => {
                      handleColorChange(preset);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-10 h-10 rounded-md border-2 transition-all",
                      "hover:scale-110 hover:shadow-md",
                      preset === inputValue
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border"
                    )}
                    style={{ backgroundColor: preset }}
                    title={preset}
                  >
                    {preset === inputValue && (
                      <Check className="h-4 w-4 text-white drop-shadow-md mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Info */}
            {showContrast && contrastWith && (
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Contrast Preview</span>
                  </div>
                  <div
                    className="mt-2 p-3 rounded-md"
                    style={{
                      backgroundColor: inputValue,
                      color: contrastWith,
                    }}
                  >
                    <p className="font-medium">Sample Text</p>
                    <p className="text-sm">This is how text will look</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

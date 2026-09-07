"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Palette, RotateCcw } from "lucide-react";
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

// Full organized palette: 12 color families × 7 shades
const PALETTE_GROUPS: { name: string; colors: string[] }[] = [
  {
    name: "Gray",
    colors: ["#f9fafb", "#f3f4f6", "#e5e7eb", "#d1d5db", "#9ca3af", "#6b7280", "#374151", "#1f2937", "#111827"],
  },
  {
    name: "Slate",
    colors: ["#f8fafc", "#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155", "#0f172a"],
  },
  {
    name: "Red",
    colors: ["#fef2f2", "#fee2e2", "#fecaca", "#f87171", "#ef4444", "#dc2626", "#b91c1c", "#991b1b", "#7f1d1d"],
  },
  {
    name: "Orange",
    colors: ["#fff7ed", "#ffedd5", "#fed7aa", "#fb923c", "#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12"],
  },
  {
    name: "Amber",
    colors: ["#fffbeb", "#fef3c7", "#fde68a", "#fbbf24", "#f59e0b", "#d97706", "#b45309", "#92400e", "#78350f"],
  },
  {
    name: "Yellow",
    colors: ["#fefce8", "#fef9c3", "#fef08a", "#facc15", "#eab308", "#ca8a04", "#a16207", "#854d0e", "#713f12"],
  },
  {
    name: "Lime",
    colors: ["#f7fee7", "#ecfccb", "#d9f99d", "#a3e635", "#84cc16", "#65a30d", "#4d7c0f", "#3f6212", "#365314"],
  },
  {
    name: "Green",
    colors: ["#f0fdf4", "#dcfce7", "#bbf7d0", "#4ade80", "#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"],
  },
  {
    name: "Emerald",
    colors: ["#ecfdf5", "#d1fae5", "#a7f3d0", "#34d399", "#10b981", "#059669", "#047857", "#065f46", "#064e3b"],
  },
  {
    name: "Teal",
    colors: ["#f0fdfa", "#ccfbf1", "#99f6e4", "#2dd4bf", "#14b8a6", "#0d9488", "#0f766e", "#115e59", "#134e4a"],
  },
  {
    name: "Cyan",
    colors: ["#ecfeff", "#cffafe", "#a5f3fc", "#22d3ee", "#06b6d4", "#0891b2", "#0e7490", "#155e75", "#164e63"],
  },
  {
    name: "Sky",
    colors: ["#f0f9ff", "#e0f2fe", "#bae6fd", "#38bdf8", "#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"],
  },
  {
    name: "Blue",
    colors: ["#eff6ff", "#dbeafe", "#bfdbfe", "#60a5fa", "#3b82f6", "#2563eb", "#1d4ed8", "#1e40af", "#1e3a8a"],
  },
  {
    name: "Indigo",
    colors: ["#eef2ff", "#e0e7ff", "#c7d2fe", "#818cf8", "#6366f1", "#4f46e5", "#4338ca", "#3730a3", "#312e81"],
  },
  {
    name: "Violet",
    colors: ["#f5f3ff", "#ede9fe", "#ddd6fe", "#a78bfa", "#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"],
  },
  {
    name: "Purple",
    colors: ["#faf5ff", "#f3e8ff", "#e9d5ff", "#c084fc", "#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#581c87"],
  },
  {
    name: "Fuchsia",
    colors: ["#fdf4ff", "#fae8ff", "#f5d0fe", "#e879f9", "#d946ef", "#c026d3", "#a21caf", "#86198f", "#701a75"],
  },
  {
    name: "Pink",
    colors: ["#fdf2f8", "#fce7f3", "#fbcfe8", "#f472b6", "#ec4899", "#db2777", "#be185d", "#9d174d", "#831843"],
  },
  {
    name: "Rose",
    colors: ["#fff1f2", "#ffe4e6", "#fecdd3", "#fb7185", "#f43f5e", "#e11d48", "#be123c", "#9f1239", "#881337"],
  },
];

const SPECIAL_COLORS = [
  { label: "Black", value: "#000000" },
  { label: "White", value: "#ffffff" },
  { label: "Transparent", value: "transparent" },
];

const RECENT_COLORS_KEY = "color-picker-recent";
const MAX_RECENT = 10;

function getRecentColors(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_COLORS_KEY) || "[]");
  } catch {
    return [];
  }
}

function addRecentColor(color: string) {
  if (typeof window === "undefined") return;
  if (color === "transparent") return;
  try {
    const recent = getRecentColors().filter((c) => c !== color);
    const updated = [color, ...recent].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updated));
  } catch {}
}

export function ColorPicker({
  label,
  value,
  onChange,
  presets,
  showContrast = false,
  contrastWith,
  compact = false,
}: ColorPickerProps) {
  const [inputValue, setInputValue] = useState(value || "#000000");
  const [isOpen, setIsOpen] = useState(false);
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"palette" | "custom">("palette");

  // Sync internal state when value prop changes externally
  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value);
    }
  }, [value]);

  useEffect(() => {
    if (isOpen) {
      setRecentColors(getRecentColors());
    }
  }, [isOpen]);

  const handleColorChange = (newColor: string) => {
    const valid =
      newColor === "transparent" || isValidHexColor(newColor);
    if (valid) {
      setInputValue(newColor);
      onChange(newColor);
      addRecentColor(newColor);
      setRecentColors(getRecentColors());
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (isValidHexColor(newValue)) {
      onChange(newValue);
      addRecentColor(newValue);
    }
  };

  const displayColor =
    inputValue === "transparent"
      ? "transparent"
      : inputValue;

  const swatchStyle =
    inputValue === "transparent"
      ? {
          backgroundImage:
            "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
          backgroundSize: "8px 8px",
          backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
        }
      : { backgroundColor: displayColor };

  const ColorPaletteContent = (
    <div className="space-y-3">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-border">
        <button
          onClick={() => setActiveTab("palette")}
          className={cn(
            "px-3 py-1.5 text-[11px] font-semibold transition-colors border-b-2 -mb-px",
            activeTab === "palette"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Palette
        </button>
        <button
          onClick={() => setActiveTab("custom")}
          className={cn(
            "px-3 py-1.5 text-[11px] font-semibold transition-colors border-b-2 -mb-px",
            activeTab === "custom"
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Custom
        </button>
      </div>

      {activeTab === "palette" && (
        <div className="space-y-2.5">
          {/* Special colors */}
          <div className="flex gap-1.5">
            {SPECIAL_COLORS.map((sc) => (
              <button
                key={sc.value}
                title={sc.label}
                onClick={() => {
                  handleColorChange(sc.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex-1 h-6 rounded border text-[9px] font-semibold transition-all hover:scale-[1.03]",
                  inputValue === sc.value
                    ? "border-primary ring-1 ring-primary/40"
                    : "border-border"
                )}
                style={
                  sc.value === "transparent"
                    ? {
                        backgroundImage:
                          "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
                        backgroundSize: "6px 6px",
                        backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0px",
                      }
                    : { backgroundColor: sc.value }
                }
              />
            ))}
          </div>

          {/* Color grid — all groups */}
          <div className="max-h-[260px] overflow-y-auto pr-0.5 space-y-1.5 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-border">
            {PALETTE_GROUPS.map((group) => (
              <div key={group.name}>
                <div className="flex gap-[2px]">
                  {group.colors.map((color) => (
                    <button
                      key={color}
                      title={color}
                      onClick={() => {
                        handleColorChange(color);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "flex-1 h-5 rounded-sm transition-all hover:scale-y-125 hover:z-10 relative",
                        inputValue === color
                          ? "ring-1 ring-offset-1 ring-primary scale-y-125 z-10"
                          : ""
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Recent colors */}
          {recentColors.length > 0 && (
            <div className="space-y-1 pt-1 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Recent
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem(RECENT_COLORS_KEY);
                    setRecentColors([]);
                  }}
                  className="text-[9px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-0.5"
                >
                  <RotateCcw className="h-2 w-2" /> Clear
                </button>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {recentColors.map((color, i) => (
                  <button
                    key={`${color}-${i}`}
                    title={color}
                    onClick={() => {
                      handleColorChange(color);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-5 h-5 rounded border transition-all hover:scale-110",
                      inputValue === color
                        ? "border-primary ring-1 ring-primary/40"
                        : "border-border/60"
                    )}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "custom" && (
        <div className="space-y-3">
          {/* Native color wheel */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={inputValue === "transparent" ? "#000000" : inputValue}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-12 h-12 rounded-lg border border-border cursor-pointer p-0.5 bg-transparent"
              />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label className="text-[10px] text-muted-foreground">Hex</Label>
              <div className="flex gap-1.5">
                <Input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="#000000"
                  className="font-mono text-xs h-8 flex-1"
                  spellCheck={false}
                />
              </div>
            </div>
          </div>

          {/* Color preview */}
          <div
            className="w-full h-12 rounded-md border border-border"
            style={swatchStyle}
          />

          {/* Quick shades of the current color */}
          {isValidHexColor(inputValue) && (
            <div className="space-y-1">
              <Label className="text-[10px] text-muted-foreground">
                Tints & Shades
              </Label>
              <div className="flex gap-1">
                {generateShades(inputValue).map((shade, i) => (
                  <button
                    key={i}
                    title={shade}
                    onClick={() => {
                      handleColorChange(shade);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "flex-1 h-7 rounded border transition-all hover:scale-y-110",
                      inputValue === shade
                        ? "border-primary ring-1 ring-primary/40"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: shade }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Contrast preview */}
          {showContrast && contrastWith && (
            <div className="pt-2 border-t border-border">
              <div
                className="p-3 rounded-md"
                style={{ backgroundColor: inputValue, color: contrastWith }}
              >
                <p className="text-xs font-semibold">Sample Text</p>
                <p className="text-[10px] opacity-80">How text will look</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Apply button */}
      <div className="pt-1 border-t border-border">
        <button
          onClick={() => setIsOpen(false)}
          className="w-full h-7 rounded bg-primary/10 hover:bg-primary/20 text-primary text-[11px] font-semibold transition-colors"
        >
          Apply
        </button>
      </div>
    </div>
  );

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
                "hover:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20",
                isOpen && "border-primary/50"
              )}
            >
              <div
                className="w-6 h-6 rounded border border-border/60 shadow-sm shrink-0"
                style={swatchStyle}
              />
              <span className="text-xs font-mono flex-1 text-left truncate">
                {inputValue}
              </span>
              <Palette className="h-3 w-3 text-muted-foreground shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-3" align="start" side="bottom">
            {ColorPaletteContent}
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
              "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20",
              isOpen && "border-primary/50"
            )}
          >
            <div
              className="w-10 h-10 rounded-md border border-border shadow-sm shrink-0"
              style={swatchStyle}
            />
            <div className="flex-1 text-left">
              <div className="text-sm font-mono">{inputValue}</div>
              <div className="text-xs text-muted-foreground">
                Click to customize
              </div>
            </div>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          {ColorPaletteContent}
        </PopoverContent>
      </Popover>
    </div>
  );
}

// Generate 9 tints/shades from a hex color
function generateShades(hex: string): string[] {
  try {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const steps = [0.9, 0.75, 0.6, 0.45, 0, -0.2, -0.35, -0.5, -0.65];
    return steps.map((step) => {
      const mix = step > 0 ? 255 : 0;
      const factor = Math.abs(step);
      const nr = Math.round(r + (mix - r) * factor);
      const ng = Math.round(g + (mix - g) * factor);
      const nb = Math.round(b + (mix - b) * factor);
      return `#${nr.toString(16).padStart(2, "0")}${ng.toString(16).padStart(2, "0")}${nb.toString(16).padStart(2, "0")}`;
    });
  } catch {
    return [];
  }
}

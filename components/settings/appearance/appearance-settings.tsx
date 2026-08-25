"use client";

import type React from "react";
import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { EntityTheme } from "@/store/ts-types";
import { useEditEntityTheme } from "@/graphql/actions";
import { useThemeStore } from "@/store/themeStore";
import ThemePreview from "./theme-preview";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { Palette, Layout, Type, Monitor, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AppearanceSettingsProps {
  theme: EntityTheme | null;
}

const quickPresets = [
  {
    name: "Default",
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    bg: "#ffffff",
    text: "#0f172a",
  },
  {
    name: "Slate",
    primary: "#475569",
    secondary: "#64748b",
    bg: "#f8fafc",
    text: "#0f172a",
  },
  {
    name: "Midnight",
    primary: "#0ea5e9",
    secondary: "#6366f1",
    bg: "#020617",
    text: "#f8fafc",
  },
  {
    name: "Forest",
    primary: "#059669",
    secondary: "#10b981",
    bg: "#f0fdfa",
    text: "#064e3b",
  },
];

const tabs = [
  { id: "colors", label: "Colors", icon: Palette },
  { id: "layout", label: "Layout", icon: Layout },
  { id: "typography", label: "Typography", icon: Type },
] as const;

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({
  theme,
}) => {
  const [formSettings, setFormSettings] = useState<EntityTheme>({
    primaryColor: "#3b82f6",
    secondaryColor: "#8b5cf6",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    buttonColor: "#0f172a",
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "#e2e8f0",
    inputBackground: "#f8fafc",
    inputBorderColor: "#cbd5e1",
    fontSize: 14,
    fontWeight: "400",
    boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    hoverEffect: "none",
    Button: {
      colorPrimary: "#0f172a",
      colorText: "#ffffff",
      colorBorder: "#0f172a",
      borderRadius: 6,
      defaultBg: "#f1f5f9",
      defaultColor: "#0f172a",
      defaultBorderColor: "#cbd5e1",
      fontSize: 13,
    },
  });

  const [activeTab, setActiveTab] = useState<
    "colors" | "layout" | "typography"
  >("colors");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );
  const [savedState, setSavedState] = useState(false);

  useEffect(() => {
    if (theme) {
      const { __typename, Button, ...restTheme } = theme as any;
      const { __typename: btnTypename, ...restButton } = (Button || {}) as any;
      setFormSettings((prev) => ({
        ...prev,
        ...restTheme,
        Button: { ...prev.Button, ...restButton },
      }));
    }
  }, [theme]);

  const setTheme = useThemeStore((state) => state.setTheme);
  const [update, { loading }] = useEditEntityTheme({
    onCompleted: () => {
      setTheme({
        ...formSettings,
        borderRadius: String(formSettings.borderRadius),
        borderWidth: String(formSettings.borderWidth),
        fontSize: String(formSettings.fontSize),
        Button: {
          colorPrimary: formSettings.Button?.colorPrimary ?? "#0f172a",
          colorText: formSettings.Button?.colorText ?? "#ffffff",
          colorBorder: formSettings.Button?.colorBorder ?? "#0f172a",
          borderRadius: formSettings.Button?.borderRadius ?? 6,
          defaultBg: formSettings.Button?.defaultBg ?? "#f1f5f9",
          defaultColor: formSettings.Button?.defaultColor ?? "#0f172a",
          defaultBorderColor:
            formSettings.Button?.defaultBorderColor ?? "#cbd5e1",
          fontSize: formSettings.Button?.fontSize ?? 13,
        },
      });
      setSavedState(true);
      toast.success("Theme tokens updated successfully.");
      setTimeout(() => setSavedState(false), 3000);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update theme.");
    },
  });

  const updateFormSetting = <K extends keyof EntityTheme>(
    key: K,
    value: EntityTheme[K],
  ) => {
    setFormSettings((prev) => ({
      ...prev,
      [key]:
        typeof value === "object" &&
        value !== null &&
        typeof prev[key] === "object" &&
        prev[key] !== null
          ? { ...prev[key], ...value }
          : value,
    }));
  };

  const handleSave = () => {
    update({ variables: { input: formSettings } });
  };

  const handleReset = () => {
    if (theme) {
      const { __typename, Button, ...restTheme } = theme as any;
      const { __typename: btnTypename, ...restButton } = (Button || {}) as any;
      setFormSettings({
        ...formSettings,
        ...restTheme,
        Button: { ...formSettings.Button, ...restButton },
      });
    }
  };

  const isChanged = useMemo(() => {
    if (!theme) return false;
    const { __typename: t1, Button: b1, ...s1 } = formSettings as any;
    const { __typename: t2, Button: b2, ...s2 } = theme as any;
    return (
      JSON.stringify(s1) !== JSON.stringify(s2) ||
      JSON.stringify(b1) !== JSON.stringify(b2)
    );
  }, [formSettings, theme]);

  return (
    <div className="max-w-[1280px] mx-auto pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start relative">
        {/* ── Settings Panel ── */}
        <div className="lg:col-span-5 rounded-[12px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
          {/* Tab Bar */}
          <div className="flex border-b border-[#e1e3e5] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-3 text-[13px] font-semibold transition-colors relative cursor-pointer",
                  activeTab === tab.id
                    ? "text-[#303030] dark:text-zinc-100 bg-white dark:bg-zinc-900"
                    : "text-[#616161] hover:text-[#303030] dark:hover:text-zinc-100",
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="appearance-tab-indicator"
                    className="absolute inset-x-0 bottom-0 h-[2px] bg-[#303030] dark:bg-zinc-100"
                    transition={{
                      type: "spring",
                      bounce: 0.15,
                      duration: 0.35,
                    }}
                  />
                )}
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 min-h-[440px]">
            <AnimatePresence mode="wait">
              {/* ────── Colors ────── */}
              {activeTab === "colors" && (
                <motion.div
                  key="colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {/* Presets */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#616161] block">
                      Curated Palettes
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {quickPresets.map((preset) => {
                        const active =
                          formSettings.primaryColor === preset.primary;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              updateFormSetting("primaryColor", preset.primary);
                              updateFormSetting(
                                "secondaryColor",
                                preset.secondary,
                              );
                              updateFormSetting("backgroundColor", preset.bg);
                              updateFormSetting("textColor", preset.text);
                            }}
                            className={cn(
                              "flex flex-col items-center gap-1 p-2 rounded-[8px] border transition-all cursor-pointer",
                              active
                                ? "border-[#303030] bg-[#f6f6f7] dark:border-zinc-100 dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-xs"
                                : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
                            )}
                          >
                            <div
                              className="h-7 w-full rounded-[4px] border border-black/5"
                              style={{
                                background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                              }}
                            />
                            <span
                              className={cn(
                                "text-[11px] font-semibold",
                                active
                                  ? "text-[#303030] dark:text-zinc-100"
                                  : "text-[#616161]",
                              )}
                            >
                              {preset.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="h-px bg-[#e1e3e5] dark:bg-zinc-800" />

                  {/* Color pickers */}
                  <div className="space-y-2.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-[#616161] block">
                      Color Tokens
                    </label>
                    <div className="space-y-2.5">
                      {[
                        { label: "Primary Brand", key: "primaryColor" as const },
                        {
                          label: "Secondary Accent",
                          key: "secondaryColor" as const,
                        },
                        {
                          label: "Canvas Background",
                          key: "backgroundColor" as const,
                        },
                        { label: "Content Text", key: "textColor" as const },
                      ].map(({ label, key }) => (
                        <div key={key} className="flex items-center gap-2.5">
                          <div className="relative shrink-0">
                            <Input
                              type="color"
                              value={formSettings[key] as string}
                              onChange={(e) =>
                                updateFormSetting(key, e.target.value)
                              }
                              className="w-9 h-9 p-0.5 rounded-[6px] cursor-pointer border-[#aeb4b9] dark:border-zinc-700 bg-white dark:bg-zinc-900"
                            />
                          </div>
                          <Input
                            type="text"
                            value={formSettings[key] as string}
                            onChange={(e) =>
                              updateFormSetting(key, e.target.value)
                            }
                            className="h-[40px] text-[13.5px] font-mono flex-1 bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]"
                          />
                          <span className="text-[12.5px] font-medium text-[#616161] w-28 shrink-0">
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ────── Layout ────── */}
              {activeTab === "layout" && (
                <motion.div
                  key="layout"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {/* Corner Radius */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200">
                        Corner Radius
                      </label>
                      <span className="text-[12.5px] font-mono font-bold text-[#303030] dark:text-zinc-100 tabular-nums">
                        {formSettings.borderRadius}px
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={32}
                      step={2}
                      value={[Number(formSettings.borderRadius)]}
                      onValueChange={(v) =>
                        updateFormSetting("borderRadius", v[0])
                      }
                      className="py-1"
                    />
                    <div className="flex justify-between text-[11px] text-[#616161]">
                      <span>Sharp (0px)</span>
                      <span>Rounded (32px)</span>
                    </div>
                  </div>

                  {/* Stroke Weight */}
                  <div className="space-y-2 pt-2 border-t border-[#e1e3e5] dark:border-zinc-800">
                    <div className="flex items-center justify-between">
                      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200">
                        Border Width
                      </label>
                      <span className="text-[12.5px] font-mono font-bold text-[#303030] dark:text-zinc-100 tabular-nums">
                        {formSettings.borderWidth}px
                      </span>
                    </div>
                    <Slider
                      min={0}
                      max={4}
                      step={1}
                      value={[Number(formSettings.borderWidth)]}
                      onValueChange={(v) =>
                        updateFormSetting("borderWidth", v[0])
                      }
                      className="py-1"
                    />
                  </div>

                  <div className="h-px bg-[#e1e3e5] dark:bg-zinc-800" />

                  {/* Selects */}
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 block">
                        Border Style
                      </label>
                      <Select
                        value={formSettings.borderStyle}
                        onValueChange={(v) =>
                          updateFormSetting("borderStyle", v)
                        }
                      >
                        <SelectTrigger className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="solid">Solid</SelectItem>
                          <SelectItem value="dashed">Dashed</SelectItem>
                          <SelectItem value="dotted">Dotted</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 block">
                        Surface Elevation / Shadow
                      </label>
                      <Select
                        value={formSettings.boxShadow || "none"}
                        onValueChange={(v) => updateFormSetting("boxShadow", v)}
                      >
                        <SelectTrigger className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="0 1px 2px 0 rgba(0, 0, 0, 0.05)">
                            Subtle Flat
                          </SelectItem>
                          <SelectItem value="0 4px 12px -2px rgba(0, 0, 0, 0.12)">
                            Elevated
                          </SelectItem>
                          <SelectItem value="0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)">
                            Floating Soft
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ────── Typography ────── */}
              {activeTab === "typography" && (
                <motion.div
                  key="typography"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-4"
                >
                  {/* Font Size */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200">
                        Base Body Font Size
                      </label>
                      <span className="text-[12.5px] font-mono font-bold text-[#303030] dark:text-zinc-100 tabular-nums">
                        {formSettings.fontSize}px
                      </span>
                    </div>
                    <Slider
                      min={12}
                      max={20}
                      step={1}
                      value={[Number(formSettings.fontSize)]}
                      onValueChange={(v) =>
                        updateFormSetting("fontSize", v[0])
                      }
                      className="py-1"
                    />
                    <div className="flex justify-between text-[11px] text-[#616161]">
                      <span>Compact (12px)</span>
                      <span>Comfortable (20px)</span>
                    </div>
                  </div>

                  <div className="h-px bg-[#e1e3e5] dark:bg-zinc-800" />

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 block">
                        Font Weight
                      </label>
                      <Select
                        value={String(formSettings.fontWeight)}
                        onValueChange={(v) =>
                          updateFormSetting("fontWeight", v)
                        }
                      >
                        <SelectTrigger className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="300">Light (300)</SelectItem>
                          <SelectItem value="400">Regular (400)</SelectItem>
                          <SelectItem value="500">Medium (500)</SelectItem>
                          <SelectItem value="600">Semibold (600)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[13.5px] font-medium text-[#303030] dark:text-zinc-200 block">
                        Interactive Hover Effect
                      </label>
                      <Select
                        value={formSettings.hoverEffect || "none"}
                        onValueChange={(v) =>
                          updateFormSetting("hoverEffect", v)
                        }
                      >
                        <SelectTrigger className="h-[40px] text-[14px] bg-white dark:bg-zinc-900 border-[#aeb4b9] dark:border-zinc-700 text-[#303030] dark:text-zinc-100 rounded-[8px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="lift">Lift</SelectItem>
                          <SelectItem value="scale">Scale</SelectItem>
                          <SelectItem value="glow">Glow</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Preview Panel ── */}
        <div className="lg:col-span-7 self-start sticky top-6 z-20">
          <div className="rounded-[12px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] overflow-hidden">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#e1e3e5] dark:border-zinc-800 bg-[#f6f6f7]/50 dark:bg-zinc-900">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#d2d5d9] dark:bg-zinc-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#d2d5d9] dark:bg-zinc-700" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#d2d5d9] dark:bg-zinc-700" />
                </div>
                <span className="text-[12px] text-[#616161] font-semibold ml-1">
                  Live Viewport Preview
                </span>
              </div>
              <div className="flex items-center gap-1 bg-white dark:bg-zinc-800 border border-[#d2d5d9] dark:border-zinc-700 rounded-[6px] p-0.5">
                <button
                  type="button"
                  onClick={() => setPreviewMode("desktop")}
                  className={cn(
                    "p-1.5 rounded-[4px] transition-all cursor-pointer",
                    previewMode === "desktop"
                      ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                      : "text-[#616161] hover:text-[#303030]",
                  )}
                >
                  <Monitor className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewMode("mobile")}
                  className={cn(
                    "p-1.5 rounded-[4px] transition-all cursor-pointer",
                    previewMode === "mobile"
                      ? "bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs"
                      : "text-[#616161] hover:text-[#303030]",
                  )}
                >
                  <Smartphone className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="p-4 bg-[#f6f6f7]/60 dark:bg-zinc-950 flex items-start justify-center min-h-[520px]">
              <motion.div
                layout
                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                className={cn(
                  "w-full transition-all",
                  previewMode === "desktop" ? "max-w-3xl" : "max-w-[340px]",
                )}
              >
                <ThemePreview theme={formSettings} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Bar */}
      <FloatingSavePanel
        hasChanged={isChanged}
        saved={savedState}
        isSaving={loading}
        onSave={handleSave}
        onReset={handleReset}
        title="Unsaved Theme Changes"
        description="Ready to publish your updated visual language?"
        buttonText="Save Theme"
      />
    </div>
  );
};

export default AppearanceSettings;

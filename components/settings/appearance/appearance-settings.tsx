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
import { Label } from "@/components/ui/label";
import type { EntityTheme } from "@/store/ts-types";
import { useEditEntityTheme } from "@/graphql/actions";
import { useThemeStore } from "@/store/themeStore";
import ThemePreview from "./theme-preview";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { Palette, Layout, Type, Monitor, Smartphone, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AppearanceSettingsProps {
  theme: EntityTheme | null;
}

const quickPresets = [
  { name: "Ocean", primary: "#3b82f6", secondary: "#8b5cf6", bg: "#ffffff", text: "#0f172a" },
  { name: "Slate", primary: "#475569", secondary: "#64748b", bg: "#f8fafc", text: "#0f172a" },
  { name: "Midnight", primary: "#0ea5e9", secondary: "#6366f1", bg: "#020617", text: "#f8fafc" },
  { name: "Forest", primary: "#059669", secondary: "#10b981", bg: "#f0fdfa", text: "#064e3b" },
  { name: "Sunset", primary: "#f97316", secondary: "#ef4444", bg: "#fff7ed", text: "#431407" },
  { name: "Rose", primary: "#e11d48", secondary: "#ec4899", bg: "#fff1f2", text: "#4c0519" },
];

const colorTokens = [
  { label: "Primary", key: "primaryColor" as const, description: "Buttons, links, active states" },
  { label: "Secondary", key: "secondaryColor" as const, description: "Badges, gradients, accents" },
  { label: "Background", key: "backgroundColor" as const, description: "Page & card surface" },
  { label: "Text", key: "textColor" as const, description: "Body copy and headings" },
];

const tabs = [
  { id: "colors", label: "Colors", icon: Palette },
  { id: "layout", label: "Layout", icon: Layout },
  { id: "typography", label: "Typography", icon: Type },
] as const;

const shadowOptions = [
  { value: "none", label: "None" },
  { value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", label: "Subtle" },
  { value: "0 4px 12px -2px rgba(0, 0, 0, 0.12)", label: "Elevated" },
  { value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", label: "Floating" },
];

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ theme }) => {
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

  const [activeTab, setActiveTab] = useState<"colors" | "layout" | "typography">("colors");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [savedState, setSavedState] = useState(false);

  useEffect(() => {
    if (theme) {
      const { __typename, Button, ...restTheme } = theme as any;
      const { __typename: _btn, ...restButton } = (Button || {}) as any;
      setFormSettings((prev) => ({ ...prev, ...restTheme, Button: { ...prev.Button, ...restButton } }));
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
          defaultBorderColor: formSettings.Button?.defaultBorderColor ?? "#cbd5e1",
          fontSize: formSettings.Button?.fontSize ?? 13,
        },
      });
      setSavedState(true);
      toast.success("Theme updated successfully.");
      setTimeout(() => setSavedState(false), 3000);
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to update theme.");
    },
  });

  const updateFormSetting = <K extends keyof EntityTheme>(key: K, value: EntityTheme[K]) => {
    setFormSettings((prev) => ({
      ...prev,
      [key]:
        typeof value === "object" && value !== null && typeof prev[key] === "object" && prev[key] !== null
          ? { ...prev[key], ...value }
          : value,
    }));
  };

  const handleSave = () => { update({ variables: { input: formSettings } }); };
  const handleReset = () => {
    if (theme) {
      const { __typename, Button, ...restTheme } = theme as any;
      const { __typename: _btn, ...restButton } = (Button || {}) as any;
      setFormSettings({ ...formSettings, ...restTheme, Button: { ...formSettings.Button, ...restButton } });
    }
  };

  const isChanged = useMemo(() => {
    if (!theme) return false;
    const { __typename: _t1, Button: b1, ...s1 } = formSettings as any;
    const { __typename: _t2, Button: b2, ...s2 } = theme as any;
    return JSON.stringify(s1) !== JSON.stringify(s2) || JSON.stringify(b1) !== JSON.stringify(b2);
  }, [formSettings, theme]);

  return (
    <div className="max-w-[1280px] mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">

        {/* ── Settings Panel ── */}
        <div className="lg:col-span-5 rounded-xl border border-border/50 bg-card shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] overflow-hidden">

          {/* Tab Bar */}
          <div className="flex border-b border-border/50 bg-muted/30">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12.5px] font-medium transition-colors relative cursor-pointer",
                    isActive
                      ? "text-foreground bg-card"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute inset-x-0 bottom-0 h-[2px] bg-primary"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
                    />
                  )}
                  <tab.icon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div className="p-4">
            <AnimatePresence mode="wait">

              {/* Colors */}
              {activeTab === "colors" && (
                <motion.div key="colors" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-5">

                  {/* Presets */}
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">Presets</Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {quickPresets.map((preset) => {
                        const isActive = formSettings.primaryColor === preset.primary;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              updateFormSetting("primaryColor", preset.primary);
                              updateFormSetting("secondaryColor", preset.secondary);
                              updateFormSetting("backgroundColor", preset.bg);
                              updateFormSetting("textColor", preset.text);
                            }}
                            className={cn(
                              "flex flex-col gap-1.5 p-2 rounded-lg border text-left transition-all duration-150 cursor-pointer",
                              isActive
                                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                                : "border-transparent hover:bg-muted/40 hover:border-border/40 bg-muted/20",
                            )}
                          >
                            <div
                              className="h-6 w-full rounded-md"
                              style={{ background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})` }}
                            />
                            <span className={cn("text-[10.5px] font-medium", isActive ? "text-primary" : "text-foreground/80")}>
                              {preset.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Color Tokens */}
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">Color Tokens</Label>
                    <div className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden divide-y divide-border/30">
                      {colorTokens.map(({ label, key, description }) => (
                        <div key={key} className="flex items-center justify-between px-3 py-2.5 gap-3">
                          <div className="relative shrink-0">
                            <div
                              className="h-7 w-7 rounded-md border border-border/50 overflow-hidden cursor-pointer shadow-2xs"
                              style={{ backgroundColor: formSettings[key] as string }}
                            >
                              <input
                                type="color"
                                value={formSettings[key] as string}
                                onChange={(e) => updateFormSetting(key, e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                              />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[12px] font-medium text-foreground">{label}</p>
                            <p className="text-[10.5px] text-muted-foreground/70">{description}</p>
                          </div>
                          <input
                            type="text"
                            value={(formSettings[key] as string).toUpperCase()}
                            onChange={(e) => updateFormSetting(key, e.target.value)}
                            className="w-[76px] h-6 text-[11px] font-mono text-center bg-muted/50 border border-border/40 text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30 px-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Button Tokens */}
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">Button Colors</Label>
                    <div className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden divide-y divide-border/30">
                      {([
                        { label: "Primary Fill", key: "colorPrimary" as const },
                        { label: "Primary Text", key: "colorText" as const },
                        { label: "Default Surface", key: "defaultBg" as const },
                        { label: "Default Text", key: "defaultColor" as const },
                      ]).map(({ label, key }) => (
                        <div key={key} className="flex items-center justify-between px-3 py-2.5 gap-3">
                          <div className="relative shrink-0">
                            <div
                              className="h-7 w-7 rounded-md border border-border/50 overflow-hidden cursor-pointer shadow-2xs"
                              style={{ backgroundColor: (formSettings.Button?.[key] as string) ?? "#000" }}
                            >
                              <input
                                type="color"
                                value={(formSettings.Button?.[key] as string) ?? "#000000"}
                                onChange={(e) => updateFormSetting("Button", { ...formSettings.Button, [key]: e.target.value } as any)}
                                className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
                              />
                            </div>
                          </div>
                          <span className="flex-1 text-[12px] font-medium text-foreground">{label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Live preview */}
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/30 border border-border/30">
                      <span className="text-[10.5px] text-muted-foreground/60 shrink-0">Preview</span>
                      <button
                        type="button"
                        className="px-3 py-1 text-[11.5px] font-semibold cursor-default"
                        style={{
                          backgroundColor: formSettings.Button?.colorPrimary,
                          color: formSettings.Button?.colorText,
                          borderRadius: `${formSettings.Button?.borderRadius ?? 6}px`,
                          fontSize: `${formSettings.Button?.fontSize ?? 13}px`,
                        }}
                      >
                        Primary
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 text-[11.5px] font-semibold border cursor-default"
                        style={{
                          backgroundColor: formSettings.Button?.defaultBg,
                          color: formSettings.Button?.defaultColor,
                          borderColor: formSettings.Button?.defaultBorderColor,
                          borderRadius: `${formSettings.Button?.borderRadius ?? 6}px`,
                          fontSize: `${formSettings.Button?.fontSize ?? 13}px`,
                        }}
                      >
                        Default
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Layout */}
              {activeTab === "layout" && (
                <motion.div key="layout" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-5">

                  {/* Corner Radius */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-[12.5px] font-medium text-foreground">Corner Radius</Label>
                      <span className="text-[12px] font-mono font-semibold text-foreground tabular-nums">{formSettings.borderRadius}px</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 border-2 border-primary shrink-0 transition-all duration-200"
                        style={{ borderRadius: `${Number(formSettings.borderRadius)}px` }}
                      />
                      <Slider
                        min={0} max={32} step={2}
                        value={[Number(formSettings.borderRadius)]}
                        onValueChange={(v) => updateFormSetting("borderRadius", v[0])}
                        className="flex-1 py-1"
                      />
                    </div>
                    <div className="flex justify-between text-[10.5px] text-muted-foreground/60">
                      <span>Sharp</span><span>Rounded</span>
                    </div>
                  </div>

                  {/* Border Width */}
                  <div className="space-y-2 pt-4 border-t border-border/40">
                    <div className="flex items-center justify-between">
                      <Label className="text-[12.5px] font-medium text-foreground">Border Width</Label>
                      <span className="text-[12px] font-mono font-semibold text-foreground tabular-nums">{formSettings.borderWidth}px</span>
                    </div>
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3, 4].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => updateFormSetting("borderWidth", w)}
                          className={cn(
                            "flex-1 flex flex-col items-center gap-1.5 py-2 rounded-lg border transition-all cursor-pointer",
                            formSettings.borderWidth === w
                              ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                              : "border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border/40",
                          )}
                        >
                          <div className="w-4/5 bg-foreground rounded-full transition-all" style={{ height: `${Math.max(1, w)}px` }} />
                          <span className="text-[9.5px] font-mono text-muted-foreground">{w}px</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Style + Color */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/40">
                    <div className="space-y-1.5">
                      <Label className="text-[12px] font-medium text-foreground">Border Style</Label>
                      <Select value={formSettings.borderStyle} onValueChange={(v) => updateFormSetting("borderStyle", v)}>
                        <SelectTrigger className="h-8 text-[12.5px]">
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
                      <Label className="text-[12px] font-medium text-foreground">Border Color</Label>
                      <div className="flex items-center gap-2 h-8 px-2.5 rounded-md border border-input bg-background">
                        <div className="relative h-4 w-4 shrink-0">
                          <div
                            className="h-4 w-4 rounded border border-border/50 overflow-hidden cursor-pointer"
                            style={{ backgroundColor: formSettings.borderColor }}
                          >
                            <input
                              type="color"
                              value={formSettings.borderColor}
                              onChange={(e) => updateFormSetting("borderColor", e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground flex-1 truncate">{formSettings.borderColor?.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Shadow */}
                  <div className="space-y-2 pt-4 border-t border-border/40">
                    <Label className="text-[12.5px] font-medium text-foreground">Surface Elevation</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {shadowOptions.map((opt) => {
                        const isActive = (formSettings.boxShadow || "none") === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => updateFormSetting("boxShadow", opt.value)}
                            className={cn(
                              "flex flex-col items-center gap-2 p-2.5 rounded-lg border transition-all cursor-pointer",
                              isActive
                                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                                : "border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border/40",
                            )}
                          >
                            <div
                              className="h-7 w-full rounded-md bg-card border border-border/40"
                              style={{ boxShadow: opt.value === "none" ? "none" : opt.value }}
                            />
                            <span className={cn("text-[11px] font-medium", isActive ? "text-primary" : "text-muted-foreground")}>{opt.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Typography */}
              {activeTab === "typography" && (
                <motion.div key="typography" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="space-y-5">

                  {/* Font Size */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-[12.5px] font-medium text-foreground">Base Font Size</Label>
                      <span className="text-[12px] font-mono font-semibold text-foreground tabular-nums">{formSettings.fontSize}px</span>
                    </div>
                    <div
                      className="px-3 py-2 rounded-lg bg-muted/30 border border-border/30 text-[12px] text-muted-foreground truncate"
                      style={{ fontSize: `${formSettings.fontSize}px`, color: formSettings.textColor }}
                    >
                      The quick brown fox
                    </div>
                    <Slider
                      min={12} max={20} step={1}
                      value={[Number(formSettings.fontSize)]}
                      onValueChange={(v) => updateFormSetting("fontSize", v[0])}
                      className="py-1"
                    />
                    <div className="flex justify-between text-[10.5px] text-muted-foreground/60">
                      <span>Compact (12px)</span><span>Comfortable (20px)</span>
                    </div>
                  </div>

                  {/* Font Weight */}
                  <div className="space-y-2 pt-4 border-t border-border/40">
                    <Label className="text-[12.5px] font-medium text-foreground">Font Weight</Label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {([
                        { value: "300", label: "Light" },
                        { value: "400", label: "Regular" },
                        { value: "500", label: "Medium" },
                        { value: "600", label: "Semibold" },
                      ]).map((w) => {
                        const isActive = String(formSettings.fontWeight) === w.value;
                        return (
                          <button
                            key={w.value}
                            type="button"
                            onClick={() => updateFormSetting("fontWeight", w.value)}
                            className={cn(
                              "flex flex-col items-center gap-1 py-2.5 rounded-lg border transition-all cursor-pointer",
                              isActive
                                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                                : "border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border/40",
                            )}
                          >
                            <span className={cn("text-[16px] leading-none", isActive ? "text-primary" : "text-foreground/80")} style={{ fontWeight: w.value }}>
                              Aa
                            </span>
                            <span className={cn("text-[9.5px]", isActive ? "text-primary font-semibold" : "text-muted-foreground")}>{w.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="space-y-2 pt-4 border-t border-border/40">
                    <Label className="text-[12.5px] font-medium text-foreground">Hover Effect</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {([
                        { value: "none", label: "None", desc: "No animation" },
                        { value: "lift", label: "Lift", desc: "Translates up" },
                        { value: "scale", label: "Scale", desc: "Grows slightly" },
                        { value: "glow", label: "Glow", desc: "Glows primary" },
                      ]).map((effect) => {
                        const isActive = (formSettings.hoverEffect || "none") === effect.value;
                        return (
                          <button
                            key={effect.value}
                            type="button"
                            onClick={() => updateFormSetting("hoverEffect", effect.value)}
                            className={cn(
                              "flex items-center justify-between gap-2 p-2.5 rounded-lg border text-left transition-all cursor-pointer group",
                              isActive
                                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                                : "border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border/40",
                            )}
                          >
                            <div>
                              <p className={cn("text-[12px] font-medium", isActive ? "text-primary" : "text-foreground/80 group-hover:text-foreground")}>{effect.label}</p>
                              <p className="text-[10px] text-muted-foreground/60">{effect.desc}</p>
                            </div>
                            {isActive && <Check className="h-3 w-3 text-primary shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Button sizing */}
                  <div className="space-y-3 pt-4 border-t border-border/40">
                    <Label className="text-[12.5px] font-medium text-foreground">Button Sizing</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11.5px] text-muted-foreground">Font Size</span>
                          <span className="text-[11px] font-mono text-foreground">{formSettings.Button?.fontSize ?? 13}px</span>
                        </div>
                        <Slider
                          min={11} max={16} step={1}
                          value={[Number(formSettings.Button?.fontSize ?? 13)]}
                          onValueChange={(v) => updateFormSetting("Button", { ...formSettings.Button, fontSize: v[0] } as any)}
                          className="py-1"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11.5px] text-muted-foreground">Radius</span>
                          <span className="text-[11px] font-mono text-foreground">{formSettings.Button?.borderRadius ?? 6}px</span>
                        </div>
                        <Slider
                          min={0} max={24} step={2}
                          value={[Number(formSettings.Button?.borderRadius ?? 6)]}
                          onValueChange={(v) => updateFormSetting("Button", { ...formSettings.Button, borderRadius: v[0] } as any)}
                          className="py-1"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Preview Panel ── */}
        <div className="lg:col-span-7 self-start sticky top-6 z-20">
          <div className="rounded-xl border border-border/50 bg-card shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-muted/30">
              <div className="flex items-center gap-2.5">
                <div className="flex gap-1.5">
                  <div className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <div className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="text-[11.5px] text-muted-foreground font-medium">Live Preview</span>
              </div>
              <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-muted/50 border border-border/30">
                {([
                  { mode: "desktop" as const, icon: Monitor, label: "Desktop" },
                  { mode: "mobile" as const, icon: Smartphone, label: "Mobile" },
                ]).map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPreviewMode(mode)}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer",
                      previewMode === mode
                        ? "bg-card text-foreground shadow-2xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Area */}
            <div className="p-4 bg-muted/20 flex items-start justify-center min-h-[520px]">
              <motion.div
                layout
                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                className={cn("w-full", previewMode === "desktop" ? "max-w-3xl" : "max-w-[340px]")}
              >
                <ThemePreview theme={formSettings} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

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

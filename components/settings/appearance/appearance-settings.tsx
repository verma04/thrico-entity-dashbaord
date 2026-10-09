"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import {
  Palette,
  Layout,
  Monitor,
  Smartphone,
  Check,
  Compass,
  Layers,
  PanelLeft,
} from "lucide-react";
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
  { id: "navigation", label: "Navigation", icon: Compass },
  { id: "sidebar", label: "Sidebar", icon: PanelLeft },
  { id: "sheets", label: "Sheets", icon: Layers },
  { id: "layout", label: "Layout", icon: Layout },
] as const;

type ActiveTabId = (typeof tabs)[number]["id"];

const shadowOptions = [
  { value: "none", label: "None" },
  { value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", label: "Subtle" },
  { value: "0 4px 12px -2px rgba(0, 0, 0, 0.12)", label: "Elevated" },
  { value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)", label: "Floating" },
];

const validationSchema = Yup.object().shape({
  primaryColor: Yup.string().required(),
  secondaryColor: Yup.string().required(),
  backgroundColor: Yup.string().required(),
  textColor: Yup.string().required(),
  borderRadius: Yup.number().min(0).max(40),
  borderWidth: Yup.number().min(0).max(10),
  fontSize: Yup.number().min(10).max(30),
});

function ColorRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description?: string;
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 gap-3">
      <div className="relative shrink-0">
        <div
          className="h-7 w-7 rounded-md border border-border/50 overflow-hidden cursor-pointer shadow-2xs"
          style={{ backgroundColor: value || "#000000" }}
        >
          <input
            type="color"
            value={value || "#000000"}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer h-full w-full"
          />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-foreground">{label}</p>
        {description && <p className="text-[10.5px] text-muted-foreground/70">{description}</p>}
      </div>
      <input
        type="text"
        value={(value || "").toUpperCase()}
        onChange={(e) => onChange(e.target.value)}
        className="w-[78px] h-6 text-[11px] font-mono text-center bg-muted/50 border border-border/40 text-foreground rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30 px-1"
      />
    </div>
  );
}

export const AppearanceSettings: React.FC<AppearanceSettingsProps> = ({ theme }) => {
  const [activeTab, setActiveTab] = useState<ActiveTabId>("colors");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [savedState, setSavedState] = useState(false);

  const setTheme = useThemeStore((state) => state.setTheme);

  const initialValues: EntityTheme = useMemo(() => {
    return {
      primaryColor: theme?.primaryColor || "#3b82f6",
      secondaryColor: theme?.secondaryColor || "#8b5cf6",
      backgroundColor: theme?.backgroundColor || "#ffffff",
      textColor: theme?.textColor || "#0f172a",
      buttonColor: theme?.buttonColor || "#0f172a",
      borderRadius: Number(theme?.borderRadius) || 8,
      borderWidth: Number(theme?.borderWidth) || 1,
      borderStyle: theme?.borderStyle || "solid",
      borderColor: theme?.borderColor || "#e2e8f0",
      inputBackground: theme?.inputBackground || "#f8fafc",
      inputBorderColor: theme?.inputBorderColor || "#cbd5e1",
      fontSize: Number(theme?.fontSize) || 14,
      fontWeight: theme?.fontWeight || "400",
      boxShadow: theme?.boxShadow || "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      hoverEffect: theme?.hoverEffect || "none",
      Button: {
        colorPrimary: theme?.Button?.colorPrimary || "#0f172a",
        colorText: theme?.Button?.colorText || "#ffffff",
        colorBorder: theme?.Button?.colorBorder || "#0f172a",
        borderRadius: Number(theme?.Button?.borderRadius) || 6,
        defaultBg: theme?.Button?.defaultBg || "#f1f5f9",
        defaultColor: theme?.Button?.defaultColor || "#0f172a",
        defaultBorderColor: theme?.Button?.defaultBorderColor || "#cbd5e1",
        fontSize: Number(theme?.Button?.fontSize) || 13,
      },
      Navigation: {
        tabBg: theme?.Navigation?.tabBg || "#ffffff",
        tabActiveColor: theme?.Navigation?.tabActiveColor || theme?.primaryColor || "#3b82f6",
        tabActiveBg: theme?.Navigation?.tabActiveBg || "rgba(59, 130, 246, 0.1)",
        tabInactiveColor: theme?.Navigation?.tabInactiveColor || "#64748b",
        tabBorderColor: theme?.Navigation?.tabBorderColor || "#e2e8f0",
        tabStyle: theme?.Navigation?.tabStyle || "pill",
        tabIndicatorColor: theme?.Navigation?.tabIndicatorColor || theme?.primaryColor || "#3b82f6",
        tabLayoutVariant: theme?.Navigation?.tabLayoutVariant || "pills",
      },
      Sidebar: {
        sidebarBg: theme?.Sidebar?.sidebarBg || "#ffffff",
        sidebarTextColor: theme?.Sidebar?.sidebarTextColor || "#334155",
        sidebarActiveColor: theme?.Sidebar?.sidebarActiveColor || theme?.primaryColor || "#3b82f6",
        sidebarActiveBg: theme?.Sidebar?.sidebarActiveBg || "rgba(59, 130, 246, 0.08)",
        sidebarBorderColor: theme?.Sidebar?.sidebarBorderColor || "#e2e8f0",
        sidebarHeaderBg: theme?.Sidebar?.sidebarHeaderBg || "#f8fafc",
      },
      BottomSheet: {
        sheetBg: theme?.BottomSheet?.sheetBg || "#f8fafc",
        sheetHandleColor: theme?.BottomSheet?.sheetHandleColor || "#cbd5e1",
        sheetBorderRadius: Number(theme?.BottomSheet?.sheetBorderRadius) || 28,
        sheetHeaderBg: theme?.BottomSheet?.sheetHeaderBg || "#ffffff",
        sheetHeaderTextColor: theme?.BottomSheet?.sheetHeaderTextColor || "#0f172a",
        sheetBorderColor: theme?.BottomSheet?.sheetBorderColor || "#f1f5f9",
      },
    };
  }, [theme]);

  const [update, { loading }] = useEditEntityTheme({
    onCompleted: () => {
      setTheme({
        ...formik.values,
        borderRadius: String(formik.values.borderRadius),
        borderWidth: String(formik.values.borderWidth),
        fontSize: String(formik.values.fontSize),
      });
      setSavedState(true);
      toast.success("Theme updated successfully.");
      setTimeout(() => setSavedState(false), 3000);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update theme.";
      toast.error(msg);
    },
  });

  const formik = useFormik<EntityTheme>({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      // Clean up values for GraphQL
      const cleanButton = values.Button
        ? {
            colorPrimary: values.Button.colorPrimary,
            colorText: values.Button.colorText,
            colorBorder: values.Button.colorBorder,
            borderRadius: Number(values.Button.borderRadius),
            defaultBg: values.Button.defaultBg,
            defaultColor: values.Button.defaultColor,
            defaultBorderColor: values.Button.defaultBorderColor,
            fontSize: Number(values.Button.fontSize),
          }
        : undefined;

      const cleanNavigation = values.Navigation
        ? {
            tabBg: values.Navigation.tabBg,
            tabActiveColor: values.Navigation.tabActiveColor,
            tabActiveBg: values.Navigation.tabActiveBg,
            tabInactiveColor: values.Navigation.tabInactiveColor,
            tabBorderColor: values.Navigation.tabBorderColor,
            tabStyle: values.Navigation.tabStyle,
            tabIndicatorColor: values.Navigation.tabIndicatorColor,
            tabLayoutVariant: values.Navigation.tabLayoutVariant,
          }
        : undefined;

      const cleanSidebar = values.Sidebar
        ? {
            sidebarBg: values.Sidebar.sidebarBg,
            sidebarTextColor: values.Sidebar.sidebarTextColor,
            sidebarActiveColor: values.Sidebar.sidebarActiveColor,
            sidebarActiveBg: values.Sidebar.sidebarActiveBg,
            sidebarBorderColor: values.Sidebar.sidebarBorderColor,
            sidebarHeaderBg: values.Sidebar.sidebarHeaderBg,
          }
        : undefined;

      const cleanBottomSheet = values.BottomSheet
        ? {
            sheetBg: values.BottomSheet.sheetBg,
            sheetHandleColor: values.BottomSheet.sheetHandleColor,
            sheetBorderRadius: Number(values.BottomSheet.sheetBorderRadius),
            sheetHeaderBg: values.BottomSheet.sheetHeaderBg,
            sheetHeaderTextColor: values.BottomSheet.sheetHeaderTextColor,
            sheetBorderColor: values.BottomSheet.sheetBorderColor,
          }
        : undefined;

      const input = {
        primaryColor: values.primaryColor,
        secondaryColor: values.secondaryColor,
        backgroundColor: values.backgroundColor,
        textColor: values.textColor,
        buttonColor: values.buttonColor,
        borderRadius: Number(values.borderRadius),
        borderWidth: Number(values.borderWidth),
        borderStyle: values.borderStyle,
        borderColor: values.borderColor,
        inputBackground: values.inputBackground,
        inputBorderColor: values.inputBorderColor,
        fontSize: Number(values.fontSize),
        fontWeight: values.fontWeight,
        boxShadow: values.boxShadow,
        hoverEffect: values.hoverEffect,
        Button: cleanButton,
        Navigation: cleanNavigation,
        Sidebar: cleanSidebar,
        BottomSheet: cleanBottomSheet,
      };

      update({ variables: { input } });
    },
  });

  const formValues = formik.values;

  return (
    <div className="max-w-[1280px] mx-auto pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* ── Settings Panel (5 Columns) ── */}
        <div className="lg:col-span-5 rounded-xl border border-border/50 bg-card shadow-[0_1px_2px_0_rgba(0,0,0,0.03)] overflow-hidden">
          {/* Navigation Bar across 5 Category Tabs */}
          <div className="flex border-b border-border/50 bg-muted/30 overflow-x-auto">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab.id);
                    if (
                      tab.id === "navigation" ||
                      tab.id === "sidebar" ||
                      tab.id === "bottomsheet"
                    ) {
                      setPreviewMode("mobile");
                    }
                  }}
                  className={cn(
                    "flex-1 min-w-[70px] flex items-center justify-center gap-1.5 py-2.5 text-[11.5px] font-medium transition-colors relative cursor-pointer whitespace-nowrap px-2",
                    isActive
                      ? "text-foreground bg-card font-semibold"
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
                  <tab.icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panel */}
          <div className="p-4">
            <AnimatePresence mode="wait">
              {/* 1. BRAND COLORS & BUTTONS */}
              {activeTab === "colors" && (
                <motion.div
                  key="colors"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  {/* Presets */}
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
                      Quick Presets
                    </Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {quickPresets.map((preset) => {
                        const isActive = formValues.primaryColor === preset.primary;
                        return (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              formik.setFieldValue("primaryColor", preset.primary);
                              formik.setFieldValue("secondaryColor", preset.secondary);
                              formik.setFieldValue("backgroundColor", preset.bg);
                              formik.setFieldValue("textColor", preset.text);
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
                              style={{
                                background: `linear-gradient(135deg, ${preset.primary}, ${preset.secondary})`,
                              }}
                            />
                            <span
                              className={cn(
                                "text-[10.5px] font-medium",
                                isActive ? "text-primary" : "text-foreground/80",
                              )}
                            >
                              {preset.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Base Color Tokens */}
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
                      Base Colors
                    </Label>
                    <div className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden divide-y divide-border/30">
                      {colorTokens.map(({ label, key, description }) => (
                        <ColorRow
                          key={key}
                          label={label}
                          description={description}
                          value={formValues[key] as string}
                          onChange={(val) => formik.setFieldValue(key, val)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Button Tokens */}
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
                      Button Colors
                    </Label>
                    <div className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden divide-y divide-border/30">
                      {[
                        { label: "Primary Fill", key: "colorPrimary" as const },
                        { label: "Primary Text", key: "colorText" as const },
                        { label: "Default Surface", key: "defaultBg" as const },
                        { label: "Default Text", key: "defaultColor" as const },
                      ].map(({ label, key }) => (
                        <ColorRow
                          key={key}
                          label={label}
                          value={formValues.Button?.[key] || "#000000"}
                          onChange={(val) => formik.setFieldValue(`Button.${key}`, val)}
                        />
                      ))}
                    </div>

                    {/* Button Live preview */}
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/30 border border-border/30">
                      <span className="text-[10.5px] text-muted-foreground/60 shrink-0">Preview</span>
                      <button
                        type="button"
                        className="px-3 py-1 text-[11.5px] font-semibold cursor-default"
                        style={{
                          backgroundColor: formValues.Button?.colorPrimary,
                          color: formValues.Button?.colorText,
                          borderRadius: `${formValues.Button?.borderRadius ?? 6}px`,
                          fontSize: `${formValues.Button?.fontSize ?? 13}px`,
                        }}
                      >
                        Primary
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 text-[11.5px] font-semibold border cursor-default"
                        style={{
                          backgroundColor: formValues.Button?.defaultBg,
                          color: formValues.Button?.defaultColor,
                          borderColor: formValues.Button?.defaultBorderColor,
                          borderRadius: `${formValues.Button?.borderRadius ?? 6}px`,
                          fontSize: `${formValues.Button?.fontSize ?? 13}px`,
                        }}
                      >
                        Default
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2. TAB NAVIGATION & MOBILE NAVBAR */}
              {activeTab === "navigation" && (
                <motion.div
                  key="navigation"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  {/* Tabbar Style Variant Selector */}
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
                      Mobile Navbar Style
                    </Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "pill", label: "Pill Accent", desc: "Rounded pill active fill" },
                        { id: "line", label: "Top Indicator", desc: "Horizontal accent line" },
                        { id: "floating", label: "Floating Dock", desc: "Detached elevated dock" },
                        { id: "minimal", label: "Minimal Dot", desc: "Subtle indicator dot" },
                      ].map((styleOpt) => {
                        const isSelected = (formValues.Navigation?.tabStyle || "pill") === styleOpt.id;
                        return (
                          <button
                            key={styleOpt.id}
                            type="button"
                            onClick={() => formik.setFieldValue("Navigation.tabStyle", styleOpt.id)}
                            className={cn(
                              "p-2.5 rounded-lg border text-left transition-all cursor-pointer",
                              isSelected
                                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                                : "border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border/40",
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <p className={cn("text-[11.5px] font-medium", isSelected ? "text-primary" : "text-foreground")}>
                                {styleOpt.label}
                              </p>
                              {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                            </div>
                            <p className="text-[10px] text-muted-foreground/70 mt-0.5">{styleOpt.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Mobile Tab Bar Colors */}
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
                      Mobile Tab Bar Colors
                    </Label>
                    <div className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden divide-y divide-border/30">
                      <ColorRow
                        label="Active Tab Color"
                        description="Icon and label for active tab"
                        value={formValues.Navigation?.tabActiveColor || formValues.primaryColor}
                        onChange={(val) => formik.setFieldValue("Navigation.tabActiveColor", val)}
                      />
                      <ColorRow
                        label="Active Tab Fill (Pill)"
                        description="Container highlight behind active tab"
                        value={formValues.Navigation?.tabActiveBg || "rgba(59, 130, 246, 0.1)"}
                        onChange={(val) => formik.setFieldValue("Navigation.tabActiveBg", val)}
                      />
                      <ColorRow
                        label="Inactive Tab Color"
                        description="Color for unselected tabs"
                        value={formValues.Navigation?.tabInactiveColor || "#64748b"}
                        onChange={(val) => formik.setFieldValue("Navigation.tabInactiveColor", val)}
                      />
                      <ColorRow
                        label="Tab Bar Background"
                        description="Surface of the bottom navigation bar"
                        value={formValues.Navigation?.tabBg || "#ffffff"}
                        onChange={(val) => formik.setFieldValue("Navigation.tabBg", val)}
                      />
                      <ColorRow
                        label="Tab Bar Border"
                        description="Top divider or dock outline"
                        value={formValues.Navigation?.tabBorderColor || "#e2e8f0"}
                        onChange={(val) => formik.setFieldValue("Navigation.tabBorderColor", val)}
                      />
                      <ColorRow
                        label="Indicator Line / Dot"
                        description="Accent color for active bar or dot"
                        value={formValues.Navigation?.tabIndicatorColor || formValues.primaryColor}
                        onChange={(val) => formik.setFieldValue("Navigation.tabIndicatorColor", val)}
                      />
                    </div>
                  </div>

                  {/* Desktop Layout Tabs Variant */}
                  <div className="space-y-2 pt-3 border-t border-border/40">
                    <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
                      Page Layout Tabs (Desktop & Layouts)
                    </Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { id: "pills", label: "Pills", desc: "Rounded solid badge tabs" },
                        { id: "underline", label: "Underline", desc: "Sleek bottom accent line" },
                        { id: "segmented", label: "Segmented", desc: "Contained segmented group" },
                        { id: "bordered", label: "Bordered", desc: "Outlined frame tabs" },
                      ].map((variantOpt) => {
                        const isSelected = (formValues.Navigation?.tabLayoutVariant || "pills") === variantOpt.id;
                        return (
                          <button
                            key={variantOpt.id}
                            type="button"
                            onClick={() => formik.setFieldValue("Navigation.tabLayoutVariant", variantOpt.id)}
                            className={cn(
                              "p-2.5 rounded-lg border text-left transition-all cursor-pointer",
                              isSelected
                                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                                : "border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border/40",
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <p className={cn("text-[11.5px] font-medium", isSelected ? "text-primary" : "text-foreground")}>
                                {variantOpt.label}
                              </p>
                              {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                            </div>
                            <p className="text-[10px] text-muted-foreground/70 mt-0.5">{variantOpt.desc}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 3. SIDEBAR & MOBILE DRAWER */}
              {activeTab === "sidebar" && (
                <motion.div
                  key="sidebar"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
                      Sidebar & Drawer Colors
                    </Label>
                    <div className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden divide-y divide-border/30">
                      <ColorRow
                        label="Sidebar Surface"
                        description="Background of sidebar & mobile drawer"
                        value={formValues.Sidebar?.sidebarBg || "#ffffff"}
                        onChange={(val) => formik.setFieldValue("Sidebar.sidebarBg", val)}
                      />
                      <ColorRow
                        label="Menu Item Text"
                        description="Color of inactive sidebar navigation items"
                        value={formValues.Sidebar?.sidebarTextColor || "#334155"}
                        onChange={(val) => formik.setFieldValue("Sidebar.sidebarTextColor", val)}
                      />
                      <ColorRow
                        label="Active Item Accent"
                        description="Icon and label color of active item"
                        value={formValues.Sidebar?.sidebarActiveColor || formValues.primaryColor}
                        onChange={(val) => formik.setFieldValue("Sidebar.sidebarActiveColor", val)}
                      />
                      <ColorRow
                        label="Active Item Fill"
                        description="Pill background behind active menu item"
                        value={formValues.Sidebar?.sidebarActiveBg || "rgba(59, 130, 246, 0.08)"}
                        onChange={(val) => formik.setFieldValue("Sidebar.sidebarActiveBg", val)}
                      />
                      <ColorRow
                        label="Border & Divider"
                        description="Dividers and outlines in sidebar"
                        value={formValues.Sidebar?.sidebarBorderColor || "#e2e8f0"}
                        onChange={(val) => formik.setFieldValue("Sidebar.sidebarBorderColor", val)}
                      />
                      <ColorRow
                        label="Drawer Profile Header"
                        description="Background of user card in mobile drawer"
                        value={formValues.Sidebar?.sidebarHeaderBg || "#f8fafc"}
                        onChange={(val) => formik.setFieldValue("Sidebar.sidebarHeaderBg", val)}
                      />
                    </div>
                  </div>

                  {/* Sidebar Item Live Preview Card */}
                  <div className="space-y-2 pt-2 border-t border-border/40">
                    <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
                      Item Preview
                    </Label>
                    <div
                      className="p-3 rounded-lg border space-y-1.5"
                      style={{
                        backgroundColor: formValues.Sidebar?.sidebarBg || "#ffffff",
                        borderColor: formValues.Sidebar?.sidebarBorderColor || "#e2e8f0",
                      }}
                    >
                      <div
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold"
                        style={{
                          backgroundColor: formValues.Sidebar?.sidebarActiveBg,
                          color: formValues.Sidebar?.sidebarActiveColor,
                        }}
                      >
                        <Compass className="w-4 h-4" />
                        <span>Active Item (Selected)</span>
                      </div>
                      <div
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs"
                        style={{ color: formValues.Sidebar?.sidebarTextColor }}
                      >
                        <PanelLeft className="w-4 h-4" />
                        <span>Default Inactive Item</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 4. BOTTOM SHEET DESIGN */}
              {activeTab === "sheets" && (
                <motion.div
                  key="sheets"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
                      Bottom Sheet Colors
                    </Label>
                    <div className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden divide-y divide-border/30">
                      <ColorRow
                        label="Sheet Surface"
                        description="Background of bottom sheet"
                        value={formValues.BottomSheet?.sheetBg || "#f8fafc"}
                        onChange={(val) => formik.setFieldValue("BottomSheet.sheetBg", val)}
                      />
                      <ColorRow
                        label="Drag Handle Color"
                        description="Pill handle at top of sheet"
                        value={formValues.BottomSheet?.sheetHandleColor || "#cbd5e1"}
                        onChange={(val) => formik.setFieldValue("BottomSheet.sheetHandleColor", val)}
                      />
                      <ColorRow
                        label="Header Background"
                        description="Surface of the sheet header strip"
                        value={formValues.BottomSheet?.sheetHeaderBg || "#ffffff"}
                        onChange={(val) => formik.setFieldValue("BottomSheet.sheetHeaderBg", val)}
                      />
                      <ColorRow
                        label="Header Title Color"
                        description="Color of sheet title text"
                        value={formValues.BottomSheet?.sheetHeaderTextColor || "#0f172a"}
                        onChange={(val) => formik.setFieldValue("BottomSheet.sheetHeaderTextColor", val)}
                      />
                      <ColorRow
                        label="Divider Line"
                        description="Header divider border"
                        value={formValues.BottomSheet?.sheetBorderColor || "#f1f5f9"}
                        onChange={(val) => formik.setFieldValue("BottomSheet.sheetBorderColor", val)}
                      />
                    </div>
                  </div>

                  {/* Corner Radius Slider for Bottom Sheet */}
                  <div className="space-y-3 pt-3 border-t border-border/40">
                    <div className="flex items-center justify-between">
                      <Label className="text-[12.5px] font-medium text-foreground">
                        Sheet Top Corner Radius
                      </Label>
                      <span className="text-[12px] font-mono font-semibold text-foreground tabular-nums">
                        {formValues.BottomSheet?.sheetBorderRadius ?? 28}px
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-14 border-2 border-primary shrink-0 transition-all duration-200"
                        style={{
                          borderTopLeftRadius: `${Number(formValues.BottomSheet?.sheetBorderRadius ?? 28)}px`,
                          borderTopRightRadius: `${Number(formValues.BottomSheet?.sheetBorderRadius ?? 28)}px`,
                        }}
                      />
                      <Slider
                        min={16}
                        max={36}
                        step={2}
                        value={[Number(formValues.BottomSheet?.sheetBorderRadius ?? 28)]}
                        onValueChange={(v) => formik.setFieldValue("BottomSheet.sheetBorderRadius", v[0])}
                        className="flex-1 py-1"
                      />
                    </div>
                    <div className="flex justify-between text-[10.5px] text-muted-foreground/60">
                      <span>Standard (16px)</span>
                      <span>Deep Curve (36px)</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 5. LAYOUT & TYPOGRAPHY */}
              {activeTab === "layout" && (
                <motion.div
                  key="layout"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-5"
                >
                  {/* Global Corner Radius */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-[12.5px] font-medium text-foreground">Corner Radius</Label>
                      <span className="text-[12px] font-mono font-semibold text-foreground tabular-nums">
                        {formValues.borderRadius}px
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 border-2 border-primary shrink-0 transition-all duration-200"
                        style={{ borderRadius: `${Number(formValues.borderRadius)}px` }}
                      />
                      <Slider
                        min={0}
                        max={32}
                        step={2}
                        value={[Number(formValues.borderRadius)]}
                        onValueChange={(v) => formik.setFieldValue("borderRadius", v[0])}
                        className="flex-1 py-1"
                      />
                    </div>
                    <div className="flex justify-between text-[10.5px] text-muted-foreground/60">
                      <span>Sharp</span>
                      <span>Rounded</span>
                    </div>
                  </div>

                  {/* Border Width */}
                  <div className="space-y-2 pt-4 border-t border-border/40">
                    <div className="flex items-center justify-between">
                      <Label className="text-[12.5px] font-medium text-foreground">Border Width</Label>
                      <span className="text-[12px] font-mono font-semibold text-foreground tabular-nums">
                        {formValues.borderWidth}px
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      {[0, 1, 2, 3, 4].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => formik.setFieldValue("borderWidth", w)}
                          className={cn(
                            "flex-1 flex flex-col items-center gap-1.5 py-2 rounded-lg border transition-all cursor-pointer",
                            formValues.borderWidth === w
                              ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                              : "border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border/40",
                          )}
                        >
                          <div
                            className="w-4/5 bg-foreground rounded-full transition-all"
                            style={{ height: `${Math.max(1, w)}px` }}
                          />
                          <span className="text-[9.5px] font-mono text-muted-foreground">{w}px</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Style + Color */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border/40">
                    <div className="space-y-1.5">
                      <Label className="text-[12px] font-medium text-foreground">Border Style</Label>
                      <Select
                        value={formValues.borderStyle}
                        onValueChange={(v) => formik.setFieldValue("borderStyle", v)}
                      >
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
                            style={{ backgroundColor: formValues.borderColor }}
                          >
                            <input
                              type="color"
                              value={formValues.borderColor}
                              onChange={(e) => formik.setFieldValue("borderColor", e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-muted-foreground flex-1 truncate">
                          {formValues.borderColor?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Surface Elevation Shadow */}
                  <div className="space-y-2 pt-4 border-t border-border/40">
                    <Label className="text-[12.5px] font-medium text-foreground">Surface Elevation</Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {shadowOptions.map((opt) => {
                        const isActive = (formValues.boxShadow || "none") === opt.value;
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => formik.setFieldValue("boxShadow", opt.value)}
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
                            <span
                              className={cn(
                                "text-[11px] font-medium",
                                isActive ? "text-primary" : "text-muted-foreground",
                              )}
                            >
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Base Font Size */}
                  <div className="space-y-3 pt-4 border-t border-border/40">
                    <div className="flex items-center justify-between">
                      <Label className="text-[12.5px] font-medium text-foreground">Base Font Size</Label>
                      <span className="text-[12px] font-mono font-semibold text-foreground tabular-nums">
                        {formValues.fontSize}px
                      </span>
                    </div>
                    <Slider
                      min={12}
                      max={20}
                      step={1}
                      value={[Number(formValues.fontSize)]}
                      onValueChange={(v) => formik.setFieldValue("fontSize", v[0])}
                      className="py-1"
                    />
                  </div>

                  {/* Font Weight */}
                  <div className="space-y-2 pt-4 border-t border-border/40">
                    <Label className="text-[12.5px] font-medium text-foreground">Font Weight</Label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { value: "300", label: "Light" },
                        { value: "400", label: "Regular" },
                        { value: "500", label: "Medium" },
                        { value: "600", label: "Semibold" },
                      ].map((w) => {
                        const isActive = String(formValues.fontWeight) === w.value;
                        return (
                          <button
                            key={w.value}
                            type="button"
                            onClick={() => formik.setFieldValue("fontWeight", w.value)}
                            className={cn(
                              "flex flex-col items-center gap-1 py-2.5 rounded-lg border transition-all cursor-pointer",
                              isActive
                                ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                                : "border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border/40",
                            )}
                          >
                            <span
                              className={cn("text-[16px] leading-none", isActive ? "text-primary" : "text-foreground/80")}
                              style={{ fontWeight: w.value }}
                            >
                              Aa
                            </span>
                            <span className={cn("text-[9.5px]", isActive ? "text-primary font-semibold" : "text-muted-foreground")}>
                              {w.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Live Preview Panel (7 Columns) ── */}
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
                {[
                  { mode: "desktop" as const, icon: Monitor, label: "Desktop" },
                  { mode: "mobile" as const, icon: Smartphone, label: "Mobile" },
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPreviewMode(mode)}
                    className={cn(
                      "flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium transition-all cursor-pointer",
                      previewMode === mode
                        ? "bg-card text-foreground shadow-2xs font-semibold"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview Viewport Canvas */}
            <div className="p-4 bg-muted/20 flex items-start justify-center min-h-[520px]">
              <motion.div
                layout
                transition={{ type: "spring", bounce: 0.1, duration: 0.4 }}
                className={cn("w-full flex justify-center", previewMode === "desktop" ? "max-w-3xl" : "max-w-[340px]")}
              >
                <ThemePreview
                  theme={formValues}
                  mode={previewMode}
                  activeMobileView={
                    activeTab === "sidebar"
                      ? "drawer"
                      : activeTab === "bottomsheet"
                        ? "sheet"
                        : "tabbar"
                  }
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Save Dock (Polaris Standard) */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={savedState}
        isSaving={loading}
        onSave={() => formik.handleSubmit()}
        onReset={() => formik.resetForm()}
        title="Unsaved Theme Changes"
        description="Ready to publish your updated visual language?"
        buttonText="Save Theme"
      />
    </div>
  );
};

export default AppearanceSettings;

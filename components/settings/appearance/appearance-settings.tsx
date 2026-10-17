"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { EntityTheme } from "@/store/ts-types";
import { useEditEntityTheme } from "@/graphql/actions";
import { useThemeStore } from "@/store/themeStore";
import ThemePreview from "./theme-preview";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  ColorsTab,
  NavbarTab,
  NavigationTab,
  SidebarTab,
  SheetsTab,
  LayoutTab,
} from "./tabs";
import {
  Palette,
  Layout,
  Monitor,
  Smartphone,
  Compass,
  Layers,
  PanelLeft,
  PanelTop,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface AppearanceSettingsProps {
  theme: EntityTheme | null;
}

const tabs = [
  { id: "colors", label: "Colors", icon: Palette },
  { id: "navbar", label: "Navbar", icon: PanelTop },
  { id: "navigation", label: "Navigation", icon: Compass },
  { id: "sidebar", label: "Sidebar", icon: PanelLeft },
  { id: "sheets", label: "Sheets", icon: Layers },
  { id: "layout", label: "Layout", icon: Layout },
] as const;

type ActiveTabId = (typeof tabs)[number]["id"];

const validationSchema = Yup.object().shape({
  primaryColor: Yup.string().required(),
  secondaryColor: Yup.string().required(),
  backgroundColor: Yup.string().required(),
  textColor: Yup.string().required(),
  borderRadius: Yup.number().min(0).max(40),
  borderWidth: Yup.number().min(0).max(10),
  fontSize: Yup.number().min(10).max(30),
});

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
      Navbar: {
        navbarBg: theme?.Navbar?.navbarBg || "#ffffff",
        navbarTextColor: theme?.Navbar?.navbarTextColor || "#0f172a",
        navbarBorderColor: theme?.Navbar?.navbarBorderColor || "#e2e8f0",
        navbarLogo: theme?.Navbar?.navbarLogo || "",
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
        tabBadgeBg: theme?.Navigation?.tabBadgeBg || "#ef4444",
        tabBadgeColor: theme?.Navigation?.tabBadgeColor || "#ffffff",
        tabSize: theme?.Navigation?.tabSize || "md",
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

      const cleanNavbar = values.Navbar
        ? {
            navbarBg: values.Navbar.navbarBg,
            navbarTextColor: values.Navbar.navbarTextColor,
            navbarBorderColor: values.Navbar.navbarBorderColor,
            navbarLogo: values.Navbar.navbarLogo,
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
            tabBadgeBg: values.Navigation.tabBadgeBg,
            tabBadgeColor: values.Navigation.tabBadgeColor,
            tabSize: values.Navigation.tabSize,
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
        Navbar: cleanNavbar,
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
          {/* Navigation Bar across 6 Category Tabs */}
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
                      tab.id === "sheets"
                    ) {
                      setPreviewMode("mobile");
                    } else if (
                      tab.id === "navbar" ||
                      tab.id === "colors" ||
                      tab.id === "layout"
                    ) {
                      setPreviewMode("desktop");
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
              {activeTab === "colors" && <ColorsTab formik={formik} />}
              {activeTab === "navbar" && <NavbarTab formik={formik} />}
              {activeTab === "navigation" && <NavigationTab formik={formik} />}
              {activeTab === "sidebar" && <SidebarTab formik={formik} />}
              {activeTab === "sheets" && <SheetsTab formik={formik} />}
              {activeTab === "layout" && <LayoutTab formik={formik} />}
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
                      : activeTab === "sheets"
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

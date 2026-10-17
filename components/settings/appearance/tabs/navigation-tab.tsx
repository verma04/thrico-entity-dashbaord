"use client";

import type React from "react";
import { motion } from "framer-motion";
import type { FormikProps } from "formik";
import type { EntityTheme } from "@/store/ts-types";
import { Label } from "@/components/ui/label";
import { ColorRow } from "./color-row";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationTabProps {
  formik: FormikProps<EntityTheme>;
}

export const NavigationTab: React.FC<NavigationTabProps> = ({ formik }) => {
  const formValues = formik.values;

  return (
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

      {/* Tab Size */}
      <div className="space-y-2 pt-3 border-t border-border/40">
        <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
          Tab Size (Padding & Scale)
        </Label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: "sm", label: "Small", desc: "Compact & dense" },
            { id: "md", label: "Medium", desc: "Default balanced" },
            { id: "lg", label: "Large", desc: "Spacious & prominent" },
          ].map((sizeOpt) => {
            const isSelected = (formValues.Navigation?.tabSize || "md") === sizeOpt.id;
            return (
              <button
                key={sizeOpt.id}
                type="button"
                onClick={() => formik.setFieldValue("Navigation.tabSize", sizeOpt.id)}
                className={cn(
                  "p-2.5 rounded-lg border text-left transition-all cursor-pointer",
                  isSelected
                    ? "border-primary/50 bg-primary/5 ring-1 ring-primary/15"
                    : "border-transparent bg-muted/20 hover:bg-muted/40 hover:border-border/40",
                )}
              >
                <div className="flex items-center justify-between">
                  <p className={cn("text-[11.5px] font-medium", isSelected ? "text-primary" : "text-foreground")}>
                    {sizeOpt.label}
                  </p>
                  {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
                </div>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sizeOpt.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Badges & Notification Badges */}
      <div className="space-y-2 pt-3 border-t border-border/40">
        <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
          Tab Badges & Alerts
        </Label>
        <div className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden divide-y divide-border/30">
          <ColorRow
            label="Badge Background"
            description="Color for notification and count badges on tabs"
            value={formValues.Navigation?.tabBadgeBg || "#ef4444"}
            onChange={(val) => formik.setFieldValue("Navigation.tabBadgeBg", val)}
          />
          <ColorRow
            label="Badge Text Color"
            description="Label and number color inside badges"
            value={formValues.Navigation?.tabBadgeColor || "#ffffff"}
            onChange={(val) => formik.setFieldValue("Navigation.tabBadgeColor", val)}
          />
        </div>
      </div>
    </motion.div>
  );
};

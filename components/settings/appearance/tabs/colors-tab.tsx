"use client";

import type React from "react";
import { motion } from "framer-motion";
import type { FormikProps } from "formik";
import type { EntityTheme } from "@/store/ts-types";
import { Label } from "@/components/ui/label";
import { ColorRow } from "./color-row";
import { cn } from "@/lib/utils";

interface ColorsTabProps {
  formik: FormikProps<EntityTheme>;
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

export const ColorsTab: React.FC<ColorsTabProps> = ({ formik }) => {
  const formValues = formik.values;

  return (
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
          <span className="text-[11px] text-muted-foreground font-medium mr-1">Preview:</span>
          <button
            type="button"
            className="px-3 py-1 font-medium shadow-2xs transition-opacity"
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
            className="px-3 py-1 font-medium border shadow-2xs transition-opacity"
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
  );
};

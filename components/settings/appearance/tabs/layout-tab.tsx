"use client";

import type React from "react";
import { motion } from "framer-motion";
import type { FormikProps } from "formik";
import type { EntityTheme } from "@/store/ts-types";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface LayoutTabProps {
  formik: FormikProps<EntityTheme>;
}

const shadowOptions = [
  { value: "none", label: "None" },
  { value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", label: "Subtle" },
  { value: "0 4px 12px -2px rgba(0, 0, 0, 0.12)", label: "Elevated" },
  {
    value: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    label: "Floating",
  },
];

export const LayoutTab: React.FC<LayoutTabProps> = ({ formik }) => {
  const formValues = formik.values;

  return (
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
                  className={cn(
                    "text-[16px] leading-none",
                    isActive ? "text-primary" : "text-foreground/80",
                  )}
                  style={{ fontWeight: w.value }}
                >
                  Aa
                </span>
                <span
                  className={cn(
                    "text-[9.5px]",
                    isActive ? "text-primary font-semibold" : "text-muted-foreground",
                  )}
                >
                  {w.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

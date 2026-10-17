"use client";

import type React from "react";
import { motion } from "framer-motion";
import type { FormikProps } from "formik";
import type { EntityTheme } from "@/store/ts-types";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ColorRow } from "./color-row";

interface SheetsTabProps {
  formik: FormikProps<EntityTheme>;
}

export const SheetsTab: React.FC<SheetsTabProps> = ({ formik }) => {
  const formValues = formik.values;

  return (
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
  );
};

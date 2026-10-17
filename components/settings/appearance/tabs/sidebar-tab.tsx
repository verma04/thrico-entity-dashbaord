"use client";

import type React from "react";
import { motion } from "framer-motion";
import type { FormikProps } from "formik";
import type { EntityTheme } from "@/store/ts-types";
import { Label } from "@/components/ui/label";
import { ColorRow } from "./color-row";
import { Compass, PanelLeft } from "lucide-react";

interface SidebarTabProps {
  formik: FormikProps<EntityTheme>;
}

export const SidebarTab: React.FC<SidebarTabProps> = ({ formik }) => {
  const formValues = formik.values;

  return (
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
  );
};

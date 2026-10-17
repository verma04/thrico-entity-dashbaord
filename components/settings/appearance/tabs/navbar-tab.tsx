"use client";

import type React from "react";
import { motion } from "framer-motion";
import type { FormikProps } from "formik";
import type { EntityTheme } from "@/store/ts-types";
import { Label } from "@/components/ui/label";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { ColorRow } from "./color-row";
import { Trash2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarTabProps {
  formik: FormikProps<EntityTheme>;
}

export const NavbarTab: React.FC<NavbarTabProps> = ({ formik }) => {
  const formValues = formik.values;

  const presets = [
    {
      name: "Clean Light",
      bg: "#ffffff",
      text: "#0f172a",
      border: "#e2e8f0",
      desc: "Classic crisp white surface",
    },
    {
      name: "Dark Slate",
      bg: "#0f172a",
      text: "#f8fafc",
      border: "#1e293b",
      desc: "High-contrast dark bar",
    },
    {
      name: "Brand Primary",
      bg: formValues.primaryColor,
      text: "#ffffff",
      border: "rgba(255, 255, 255, 0.15)",
      desc: "Cohesive brand color fill",
    },
    {
      name: "Soft Mist",
      bg: "#f8fafc",
      text: "#1e293b",
      border: "#e2e8f0",
      desc: "Subtle neutral background",
    },
  ];

  return (
    <motion.div
      key="navbar"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-5"
    >
      {/* Step 1: Dedicated Navbar Logo */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              1
            </span>
            <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
              Dedicated Navbar Logo
            </h4>
          </div>
          {formValues.Navbar?.navbarLogo && (
            <button
              type="button"
              onClick={() => formik.setFieldValue("Navbar.navbarLogo", "")}
              className="flex items-center gap-1 text-[11px] font-medium text-destructive hover:underline cursor-pointer"
            >
              <Trash2 className="w-3 h-3" />
              Remove
            </button>
          )}
        </div>

        <div className="rounded-lg bg-muted/40 border border-border/40 p-2.5 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            This logo will <strong>only show in the navigation bar</strong>. Your
            primary entity logo will continue to represent your entity for favicons,
            emails, member directories, and SEO snippets.
          </p>
        </div>

        {formValues.Navbar?.navbarLogo ? (
          <div className="space-y-2.5">
            <div
              className="p-4 rounded-lg border border-border/50 flex items-center justify-center min-h-[72px] transition-colors shadow-2xs"
              style={{
                backgroundColor: formValues.Navbar?.navbarBg || "#ffffff",
                borderColor: formValues.Navbar?.navbarBorderColor || "#e2e8f0",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={formValues.Navbar.navbarLogo}
                alt="Navbar Logo Preview"
                className="h-8 max-w-[200px] object-contain"
              />
            </div>
            <ImageUploadWithCrop
              label="Change Navbar Logo"
              currentImage={formValues.Navbar.navbarLogo}
              onImageUpdate={(url) => formik.setFieldValue("Navbar.navbarLogo", url)}
              recommendedWidth={200}
              recommendedHeight={60}
              aspectRatio={3.33}
              showDimensions
              uploadButtonText="Replace Navbar Logo"
              changeButtonText="Change Image"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <ImageUploadWithCrop
              label="Upload Navbar Logo"
              currentImage=""
              onImageUpdate={(url) => formik.setFieldValue("Navbar.navbarLogo", url)}
              recommendedWidth={200}
              recommendedHeight={60}
              aspectRatio={3.33}
              showDimensions
              uploadButtonText="Upload Dedicated Navbar Logo"
              changeButtonText="Upload Image"
            />
            <p className="text-[10.5px] text-muted-foreground">
              Recommended: Horizontal PNG or SVG with transparent background (approx 3:1 aspect ratio). If empty, your primary community name / logo will be used.
            </p>
          </div>
        )}
      </div>

      {/* Step 2: Navbar Color Schemes & Surface */}
      <div className="rounded-xl border border-border/70 p-4 bg-card shadow-2xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
            2
          </span>
          <h4 className="text-xs font-bold uppercase tracking-wide text-foreground">
            Navbar Colors & Surface
          </h4>
        </div>

        {/* Quick Surface Presets */}
        <div className="space-y-1.5">
          <Label className="uppercase text-[10px] text-muted-foreground/60 font-semibold tracking-wider">
            Quick Surface Presets
          </Label>
          <div className="grid grid-cols-2 gap-1.5">
            {presets.map((preset) => {
              const isActive =
                formValues.Navbar?.navbarBg === preset.bg &&
                formValues.Navbar?.navbarTextColor === preset.text;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => {
                    formik.setFieldValue("Navbar.navbarBg", preset.bg);
                    formik.setFieldValue("Navbar.navbarTextColor", preset.text);
                    formik.setFieldValue("Navbar.navbarBorderColor", preset.border);
                  }}
                  className={cn(
                    "p-2 rounded-lg border text-left transition-all cursor-pointer flex items-center justify-between",
                    isActive
                      ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                      : "border-border/40 bg-muted/20 hover:bg-muted/40",
                  )}
                >
                  <div className="min-w-0 pr-1">
                    <p className="text-[11px] font-medium text-foreground truncate">
                      {preset.name}
                    </p>
                    <p className="text-[9.5px] text-muted-foreground truncate">
                      {preset.desc}
                    </p>
                  </div>
                  <div
                    className="w-5 h-5 rounded-md border border-border/60 shrink-0 shadow-2xs"
                    style={{ backgroundColor: preset.bg }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Rows */}
        <div className="rounded-lg border border-border/40 bg-muted/10 overflow-hidden divide-y divide-border/30">
          <ColorRow
            label="Navbar Background"
            description="Main top bar surface color"
            value={formValues.Navbar?.navbarBg || "#ffffff"}
            onChange={(val) => formik.setFieldValue("Navbar.navbarBg", val)}
          />
          <ColorRow
            label="Text & Icon Color"
            description="Color for brand name, search, and navigation links"
            value={formValues.Navbar?.navbarTextColor || "#0f172a"}
            onChange={(val) => formik.setFieldValue("Navbar.navbarTextColor", val)}
          />
          <ColorRow
            label="Border Divider"
            description="Bottom border divider color"
            value={formValues.Navbar?.navbarBorderColor || "#e2e8f0"}
            onChange={(val) => formik.setFieldValue("Navbar.navbarBorderColor", val)}
          />
        </div>
      </div>
    </motion.div>
  );
};

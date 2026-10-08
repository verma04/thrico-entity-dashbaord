# Thrico Master Form & UI Design System Standard

**Scope**: Dashboard-wide architecture, layout patterns, form standards, component library, media upload, and design tokens  
**Target Environment**: Next.js 14 / React / TailwindCSS / Formik + Yup / Polaris & Linear Aesthetic  
**Primary Reference**: `docs/THRICO_FORM_AND_DESIGN_SYSTEM.md`

---

## Table of Contents
1. [Core Design Philosophy & Visual Language](#1-core-design-philosophy--visual-language)
2. [Mandatory Form Architecture (Formik & Yup)](#2-mandatory-form-architecture-formik--yup)
3. [The 4 Standard Form Layout Patterns](#3-the-4-standard-form-layout-patterns)
   - [Pattern A: Full-Page 2-Column Builder](#pattern-a-full-page-2-column-builder)
   - [Pattern B: Slide-Over Drawer / Sheet (3-Tier)](#pattern-b-slide-over-drawer--sheet-3-tier)
   - [Pattern C: Modal Dialogs](#pattern-c-modal-dialogs)
   - [Pattern D: Module Settings & Quick Config Panels](#pattern-d-module-settings--quick-config-panels)
4. [Atomic Polaris & Linear UI Primitives](#4-atomic-polaris--linear-ui-primitives)
   - [`PolarisFormCard`](#polarisformcard)
   - [`PolarisModeTile` / Interactive Selection Tiles](#polarismodetile--interactive-selection-tiles)
   - [`PolarisSummaryRow`](#polarissummaryrow)
   - [`PolarisQuickChip`](#polarisquickchip)
   - [`PolarisInfoBanner`](#polarisinfobanner)
   - [`FloatingSavePanel`](#floatingsavepanel)
5. [Media & Image Upload Standard (`ImageUploadWithCrop`)](#5-media--image-upload-standard-imageuploadwithcrop)
   - [Free Dimensions vs Proportional Crop](#free-dimensions-vs-proportional-crop)
   - [Editor Dialog Architecture](#editor-dialog-architecture)
   - [Dropzone & Preview Standards](#dropzone--preview-standards)
6. [Design Tokens & Dark Mode Palette](#6-design-tokens--dark-mode-palette)
7. [App Layout, Navigation & Typography](#7-app-layout-navigation--typography)
8. [Production Code Templates](#8-production-code-templates)
   - [Template 1: Full-Page 2-Column Form with Floating Dock](#template-1-full-page-2-column-form-with-floating-dock)
   - [Template 2: 3-Tier Slide-Over Drawer Form](#template-2-3-tier-slide-over-drawer-form)
   - [Template 3: Polaris Modal Dialog Form](#template-3-polaris-modal-dialog-form)
9. [Code Quality & Linting Checklist](#9-code-quality--linting-checklist)

---

## 1. Core Design Philosophy & Visual Language

The **Thrico Design Language** combines the functional precision of **Shopify Polaris** with the sleek, high-contrast craft of **Linear**:

1. **Information Density with Breathing Room**:
   - Compact `h-9` primary inputs (`h-8` for nested/secondary), crisp `text-xs` font sizing, paired with deliberate padding (`p-3.5` to `p-4`) and clear card boundaries.
2. **Clear Spatial Grouping**:
   - Inputs are never left floating on bare page canvases. Every input group belongs to an isolated card with clean 1px borders (`border-[#d2d5d9]` light, `dark:border-zinc-800` dark).
3. **Interactive Tiles Over Plain Radio Buttons**:
   - Modes, types, goals, and strategies must use interactive card tiles (`PolarisModeTile`) featuring distinct icons, title badges, and 2-line descriptions instead of plain radio buttons.
4. **Seamless Dark Mode First**:
   - Hardcoded gray classes like `bg-gray-100` or `text-black` are prohibited. Every surface, border, and text element utilizes semantic tokens (`bg-white dark:bg-zinc-900`, `border-[#d2d5d9] dark:border-zinc-800`, `text-[#303030] dark:text-zinc-100`).
5. **High-Contrast Primary Actions**:
   - Primary action buttons feature crisp monochrome inversion: `bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white` with subtle `shadow-2xs`.

---

## 2. Mandatory Form Architecture (Formik & Yup)

> [!IMPORTANT]
> **ALL FORMS MUST USE FORMIK AND YUP.**  
> Never manage individual form fields, error states, or submit loading states with ad-hoc `useState` hooks.

### Core Rules:
1. **Schema Validation via Yup**:
   - Define a strict `Yup.object().shape({...})` schema for every form.
   - Use `.trim()` on text inputs, `.min()` / `.max()` on numbers, and `.oneOf()` for enumerations.
2. **Hook Initialization (`useFormik`)**:
   - Always initialize forms using `useFormik({ initialValues, validationSchema, enableReinitialize: true, onSubmit })`.
   - `enableReinitialize: true` ensures edit forms stay synchronized with external/GraphQL data without causing infinite render loops.
3. **Inline Error Display & Destruction Highlighting**:
   - Highlight invalid inputs with `border-destructive focus-visible:ring-destructive`.
   - Display errors immediately below inputs:
     ```tsx
     {formik.touched.fieldName && formik.errors.fieldName && (
       <p className="text-[11px] text-destructive font-medium mt-1">
         {formik.errors.fieldName}
       </p>
     )}
     ```
4. **Helper & Character Counters**:
   - Place helper text and counters below inputs in `text-[11px] text-muted-foreground leading-snug`.

---

## 3. The 4 Standard Form Layout Patterns

### Pattern A: Full-Page 2-Column Builder
**Use Case**: Creation and detailed configuration flows (e.g. Discounts, UTM Campaigns, Member Creation, Point Rules, Website Builder).

- **Grid Architecture**:
  - `lg:col-span-8`: Main form pane holding grouped configuration cards.
  - `lg:col-span-4`: Sticky sidebar pane (`sticky top-6`) holding real-time live preview cards, channel badges, and metadata.
- **Top Bar**: Zero-clutter header with back navigation, breadcrumbs, title, and live status badge.
- **Bottom Dock**: Mounts `FloatingSavePanel` via React portal at `bottom-6`, displaying unsaved changes pulse indicator, discard button, and primary save button.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header: [← Back]  Create UTM Campaign                     [Status: Active] │
├─────────────────────────────────────────────────────────────────────────────┤
│ Max Width: 1280px Centered Canvas (px-4 sm:px-8 py-6)                       │
│                                                                             │
│ ┌──────────────────────────────────────┬──────────────────────────────────┐ │
│ │ Main Configuration Pane (8 Cols)     │ Sticky Sidebar Pane (4 Cols)     │ │
│ │                                      │ (sticky top-6)                   │ │
│ │ ┌──────────────────────────────────┐ │ ┌──────────────────────────────┐ │ │
│ │ │ Card 1: Identity & Destination   │ │ │ Card 1: Real-Time Live       │ │ │
│ │ │  • Interactive Selection Tiles   │ │ │         Summary & URL        │ │ │
│ │ │  • Campaign Name & Slug          │ │ │  - Destination Funnel       │ │ │
│ │ └──────────────────────────────────┘ │ │  - Tracking URL Box + Copy   │ │ │
│ │                                      │ │  - UTM Param Badges          │ │ │
│ │ ┌──────────────────────────────────┐ │ └──────────────────────────────┘ │ │
│ │ │ Card 2: Parameters & Tracking    │ │                                  │ │
│ │ │  • Source & Medium Chips         │ │ ┌──────────────────────────────┐ │ │
│ │ │  • Term & Content Inputs         │ │ │ Card 2: Attribution Insights │ │ │
│ │ └──────────────────────────────────┘ │ └──────────────────────────────┘ │ │
│ └──────────────────────────────────────┴──────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ FloatingSavePanel: [● Unsaved changes]  •  [Discard] [ Save Campaign ]      │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

### Pattern B: Slide-Over Drawer / Sheet (3-Tier)
**Use Case**: Entity editors, tier configurations, quick creators, sidebar slide-overs.

- **3-Tier Structure**:
  1. **Sticky Header**: `p-5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90` with icon avatar box, title, and subtitle.
  2. **Scrollable Body**: `flex-1 overflow-y-auto p-5 space-y-4` containing grouped `PolarisFormCard`s.
  3. **Sticky Footer**: `p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex justify-end gap-2`.

---

### Pattern C: Modal Dialogs
**Use Case**: Focused, low-to-medium complexity tasks, confirmations, image cropping, item assignment.

- Container: `DialogContent className="max-w-xl p-0 gap-0 overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl bg-white dark:bg-zinc-900"`
- Header: Avatar icon box (`h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100`), title, status chip, and close button.
- Body: Isolated configuration cards with `p-4 space-y-3.5`.
- Footer: Cancel outline button + Primary CTA button.

---

### Pattern D: Module Settings & Quick Config Panels
**Use Case**: In-page toggle panels, tabbed entity settings, inline module configuration.

- Section card with header switch:
  ```tsx
  <div className="flex items-center justify-between p-3 rounded-lg border border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/40">
    <div>
      <h4 className="text-xs font-semibold text-[#303030] dark:text-zinc-100">Enable Feature</h4>
      <p className="text-[11px] text-[#616161] dark:text-zinc-400">Activate live sync across member portals</p>
    </div>
    <Switch checked={enabled} onCheckedChange={setEnabled} />
  </div>
  ```

---

## 4. Atomic Polaris & Linear UI Primitives

All forms utilize standardized primitives. Components should import from `@/components/gamification/shared/polaris-form-ui` or follow the specifications below.

### `PolarisFormCard`
Grouped card container with optional icon, title, description, and status tag badge.

```tsx
interface PolarisFormCardProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "outline" | "indigo";
  children: React.ReactNode;
  className?: string;
}

export function PolarisFormCard({
  icon: Icon,
  title,
  description,
  badge,
  badgeVariant = "outline",
  children,
  className,
}: PolarisFormCardProps) {
  return (
    <div
      className={cn(
        "rounded-[10px] border border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)] p-3.5 transition-all duration-150",
        className,
      )}
    >
      <div className="mb-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {Icon && (
              <Icon className="h-3.5 w-3.5 text-[#616161] dark:text-zinc-400 shrink-0" />
            )}
            <h4 className="text-[12.5px] font-semibold text-[#303030] dark:text-zinc-100 leading-[18px]">
              {title}
            </h4>
          </div>
          {badge && (
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] font-medium px-1.5 py-0.2 rounded-[4px]",
                badgeVariant === "indigo"
                  ? "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800"
                  : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#303030] dark:text-zinc-200 border-[#d2d5d9] dark:border-zinc-700",
              )}
            >
              {badge}
            </Badge>
          )}
        </div>
        {description && (
          <p className="text-[11px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[15px]">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
```

---

### `PolarisModeTile` / Interactive Selection Tiles
Presents selectable methods, types, or categories with icons and 2-line descriptions.

```tsx
export function PolarisModeTile({
  label,
  description,
  badge,
  icon: Icon,
  selected,
  onClick,
}: {
  label: string;
  description: string;
  badge?: string;
  icon: React.ElementType;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex items-start gap-2.5 p-2.5 rounded-[6px] border text-left transition-all cursor-pointer w-full",
        selected
          ? "border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100 shadow-2xs"
          : "border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-[#aeb4b9]",
      )}
    >
      <div
        className={cn(
          "h-7 w-7 rounded-[4px] flex items-center justify-center shrink-0 border transition-colors",
          selected
            ? "bg-[#303030] text-white border-[#303030] dark:bg-zinc-100 dark:text-zinc-900 dark:border-zinc-100"
            : "bg-[#f6f6f7] dark:bg-zinc-800 text-[#616161] dark:text-zinc-400 border-[#d2d5d9] dark:border-zinc-700",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[12px] font-semibold text-[#303030] dark:text-zinc-100 block">
            {label}
          </span>
          {badge && (
            <Badge
              variant="outline"
              className="text-[9px] px-1 py-0 font-mono border-border/80 text-muted-foreground"
            >
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-[10.5px] text-[#616161] dark:text-zinc-400 mt-0.5 leading-[14px]">
          {description}
        </p>
      </div>
    </button>
  );
}
```

---

### `PolarisSummaryRow`
Crisp key-value rows used in live sidebar previews and specification cards.

```tsx
export function PolarisSummaryRow({
  label,
  value,
  isLast = false,
}: {
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between py-1.5 text-xs",
        !isLast && "border-b border-[#e1e3e5]/60 dark:border-zinc-800/60",
      )}
    >
      <span className="text-[11px] text-[#616161] dark:text-zinc-400">{label}</span>
      <span className="text-[11.5px] font-medium text-[#303030] dark:text-zinc-100">
        {value}
      </span>
    </div>
  );
}
```

---

### `PolarisQuickChip`
Interactive pill buttons for rapid presets and tags.

```tsx
export function PolarisQuickChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-[10.5px] px-2.5 py-1 rounded-md border transition-all cursor-pointer font-medium",
        active
          ? "bg-indigo-50 border-indigo-300 text-indigo-700 dark:bg-indigo-950/60 dark:border-indigo-700 dark:text-indigo-300 font-semibold shadow-2xs"
          : "border-[#d2d5d9] dark:border-zinc-700 text-[#616161] dark:text-zinc-400 hover:border-[#aeb4b9] dark:hover:border-zinc-500 hover:text-[#303030] dark:hover:text-zinc-200 bg-white dark:bg-zinc-900",
      )}
    >
      {label}
    </button>
  );
}
```

---

### `PolarisInfoBanner`
Contextual callout card with icon, title, description, and optional action button.

```tsx
export function PolarisInfoBanner({
  title,
  description,
  icon: Icon = Info,
  action,
}: {
  title?: string;
  description: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200/80 dark:border-indigo-800/60">
      <Icon className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0">
        {title && (
          <span className="text-[11.5px] font-semibold text-indigo-950 dark:text-indigo-200 block mb-0.5">
            {title}
          </span>
        )}
        <p className="text-[11px] text-indigo-800 dark:text-indigo-300 leading-relaxed">
          {description}
        </p>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
}
```

---

### `FloatingSavePanel`
Floating bottom dock anchored at `bottom-6` to manage dirty state and submission without cluttering the page header.

Import: `@/components/ui/platform/floating-save-panel`

```tsx
<FloatingSavePanel
  show={formik.dirty}
  isSaving={formik.isSubmitting}
  onSave={formik.handleSubmit}
  onDiscard={() => formik.resetForm()}
  saveText="Save discount"
  discardText="Discard"
/>
```

---

## 5. Media & Image Upload Standard (`ImageUploadWithCrop`)

Located at: [`components/ui/image-upload-with-crop.tsx`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/ui/image-upload-with-crop.tsx)

### Free Dimensions vs Proportional Crop
The image editor supports two primary dimension paradigms:

1. **Free Dimensions (`dimensionMode: "free"`)**:
   - **Full Image (100% Original)**: Bypasses container crop locks and uploads the natural image resolution directly.
   - **Freeform Crop**: Unlocks crop bounding box handles so users can crop to any unconstrained width and height.
   - **Direct Save CTA**: Includes a dedicated *"Upload Free Dimensions Directly"* button.
   - **Bypasses Exact Dimension Constraints**: `enforceExactDimensions` is automatically bypassed in Free Dimensions mode.
2. **Recommended Proportions (`dimensionMode: "recommended"`)**:
   - Locks the crop to the recommended container ratio (e.g., 16:9, 1:1, or `recommendedWidth / recommendedHeight`).
3. **Standard Presets (`dimensionMode: "preset"`)**:
   - Quick aspect ratio chips: `1:1 Square`, `16:9 Banner`, `4:3 Standard`, `3:4 Portrait`, `2:1 Wide`.

### Editor Dialog Architecture
- **Header**: Icon avatar box (`h-8 w-8 rounded-lg bg-indigo-50 border border-indigo-100`), title, mode badge, and live pixel dimension badge (`[W] × [H] px`).
- **Left Canvas**: Neutral dark/light canvas (`bg-[#f8f9fa] dark:bg-zinc-950`) with live ReactCrop frame and floating bottom toolbar (Rotate CCW, Rotate CW, Flip Horizontal, Flip Vertical, Full Frame toggle, Reset).
- **Right Sidebar**:
  - Tab 1: **Dimensions & Sizing** (Dimension Mode tiles, 100% Full Image vs Freeform chips, live pixel width/height inputs with Lock Ratio toggle, Polaris summary rows).
  - Tab 2: **Enhance & Output** (Brightness, Contrast, Zoom Scale, Output Format selector: PNG/JPEG/WebP, Image Quality slider).
- **Footer**: Secondary Reset button + Cancel button + High-contrast primary Save button (`bg-[#303030] text-white`).

### Dropzone & Preview Standards
- **Empty State**: Rounded card with dashed border (`border-[#d2d5d9] dark:border-zinc-800`), avatar icon box, title, and badges displaying both recommended dimensions and **"Free Dimensions"**.
- **Preview State**: Aspect preview container with dark-tint hover overlay and clean Change / Remove action buttons.

---

## 6. Design Tokens & Dark Mode Palette

| Element | Light Mode Token | Dark Mode Token | Standard Tailwinds |
| :--- | :--- | :--- | :--- |
| **Canvas Background** | `#f6f6f7` | `#09090b` (Zinc 950) | `bg-[#f6f6f7] dark:bg-zinc-950` |
| **Card Surface** | `#ffffff` | `#18181b` (Zinc 900) | `bg-white dark:bg-zinc-900` |
| **Muted Surface** | `#f9fafb` / `#f6f6f7` | `#27272a` (Zinc 800) | `bg-[#f6f6f7] dark:bg-zinc-800` |
| **Primary Border** | `#d2d5d9` | `#27272a` (Zinc 800) | `border-[#d2d5d9] dark:border-zinc-800` |
| **Subtle Divider** | `#e1e3e5`/60 | `#27272a`/60 | `border-[#e1e3e5]/60 dark:border-zinc-800/60` |
| **Primary Text** | `#303030` | `#f4f4f5` (Zinc 100) | `text-[#303030] dark:text-zinc-100` |
| **Secondary / Helper** | `#616161` | `#a1a1aa` (Zinc 400) | `text-[#616161] dark:text-zinc-400` |
| **Primary CTA Button** | `#303030` (hover `#202020`) | `#f4f4f5` (Zinc 100) | `bg-[#303030] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs` |
| **Secondary Button** | Border `#d2d5d9` | Border `#3f3f46` | `border border-[#d2d5d9] dark:border-zinc-700 bg-white dark:bg-zinc-900 text-[#303030] dark:text-zinc-200` |
| **Active Mode Tile** | Ring `#303030` + `#f6f6f7` | Ring `#f4f4f5` + Zinc 800 | `border-[#303030] dark:border-zinc-100 bg-[#f6f6f7] dark:bg-zinc-800 ring-1 ring-[#303030] dark:ring-zinc-100` |
| **Indigo Accent Badge** | BG `indigo-50` / Text `indigo-700` | BG `indigo-950/40` / Text `indigo-300`| `bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800` |

---

## 7. App Layout, Navigation & Typography

### Layout Shell
- Root container: Centered max-width canvas `max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8`.
- Header: Zero-clutter navigation with back arrow, title, subtitle, and breadcrumbs.

### Sidebar Architecture
- **Parent Sidebar (`parent-sidebar.tsx`)**: Slim icon rail with top ecosystem button, icon menu buttons with active highlight, and user profile trigger.
- **Child Sidebar (`child-sidebar.tsx`)**: Secondary module navigation with section headers, collapsible trees, and search filter. Preserves active module context across route transitions.

### Typography Hierarchy
- Fonts available via `next/font`: **Inter**, **Plus Jakarta Sans**, **Roobert**, **Figtree**, **Space Grotesk**.
- Section Headings: `text-[13px] font-semibold text-[#303030] dark:text-zinc-100 leading-[18px]`.
- Input Labels: `text-xs font-semibold text-[#303030] dark:text-zinc-100`.
- Body / Form Inputs: `h-9 text-xs`.
- Slugs, Code & Pixel Dimensions: `font-mono text-xs`.
- Helper Text: `text-[11px] text-[#616161] dark:text-zinc-400 leading-snug`.

---

## 8. Production Code Templates

### Template 1: Full-Page 2-Column Form with Floating Dock

```tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  PolarisFormCard,
  PolarisModeTile,
  PolarisSummaryRow,
  PolarisQuickChip,
  PolarisInfoBanner,
} from "@/components/gamification/shared/polaris-form-ui";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ImageUploadWithCrop } from "@/components/ui/image-upload-with-crop";
import { ArrowLeft, Tag, Sparkles, Globe, Link2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const validationSchema = Yup.object().shape({
  name: Yup.string().trim().required("Campaign name is required").min(2, "Min 2 characters"),
  destinationType: Yup.string().oneOf(["SIGNUP", "LOGIN", "CUSTOM"]).required(),
  destinationUrl: Yup.string().trim().required("Destination URL is required"),
  imageUrl: Yup.string().trim(),
});

export default function CreateCampaignFormPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      name: "",
      destinationType: "SIGNUP",
      destinationUrl: "https://thrico.network/signup",
      imageUrl: "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        // Perform mutation
        toast.success("Campaign created successfully!");
        router.push("/marketing/campaigns");
      } catch (err: unknown) {
        toast.error((err as Error)?.message || "Failed to create campaign");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#f6f6f7] dark:bg-zinc-950 pb-28">
      {/* Zero-Clutter Header */}
      <header className="px-4 sm:px-8 py-5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="h-8 w-8 rounded-lg border border-[#d2d5d9] dark:border-zinc-700 hover:bg-[#f6f6f7] dark:hover:bg-zinc-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold text-[#303030] dark:text-zinc-100">
                  Create Marketing Campaign
                </h1>
                <Badge variant="outline" className="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 font-semibold">
                  New
                </Badge>
              </div>
              <p className="text-[11px] text-[#616161] dark:text-zinc-400">
                Configure destination funnel, attribution parameters, and media assets
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 2-Column Responsive Layout Canvas */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
        <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Configuration Pane (8 Cols) */}
          <div className="lg:col-span-8 space-y-5">
            {/* Card 1: Identity & Funnel Goal */}
            <PolarisFormCard
              icon={Tag}
              title="Identity & Destination Goal"
              description="Name your campaign and select the primary user funnel"
            >
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                  Campaign Name *
                </Label>
                <Input
                  name="name"
                  placeholder="e.g. Summer 2026 Growth Drop"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={cn(
                    "h-9 text-xs",
                    formik.touched.name && formik.errors.name && "border-destructive focus-visible:ring-destructive"
                  )}
                />
                {formik.touched.name && formik.errors.name && (
                  <p className="text-[11px] text-destructive font-medium">{formik.errors.name}</p>
                )}
              </div>

              {/* Interactive Mode Tiles */}
              <div className="space-y-2 pt-2 border-t border-[#e1e3e5]/60 dark:border-zinc-800/80">
                <Label className="text-xs font-semibold text-[#303030] dark:text-zinc-100">
                  Destination Funnel Goal
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <PolarisModeTile
                    label="Signup Funnel"
                    description="Direct to member registration"
                    icon={Globe}
                    selected={formik.values.destinationType === "SIGNUP"}
                    onClick={() => formik.setFieldValue("destinationType", "SIGNUP")}
                  />
                  <PolarisModeTile
                    label="Login Funnel"
                    description="Direct to user authentication"
                    icon={Link2}
                    selected={formik.values.destinationType === "LOGIN"}
                    onClick={() => formik.setFieldValue("destinationType", "LOGIN")}
                  />
                  <PolarisModeTile
                    label="Custom Landing"
                    description="Custom external landing page"
                    icon={Sparkles}
                    selected={formik.values.destinationType === "CUSTOM"}
                    onClick={() => formik.setFieldValue("destinationType", "CUSTOM")}
                  />
                </div>
              </div>
            </PolarisFormCard>

            {/* Card 2: Campaign Creative & Image Upload */}
            <PolarisFormCard
              icon={Sparkles}
              title="Creative Asset & Social Preview"
              description="Upload campaign promotional image (Free dimensions supported)"
            >
              <ImageUploadWithCrop
                label="Campaign Cover Image"
                currentImage={formik.values.imageUrl}
                onImageUpdate={(cdnUrl) => formik.setFieldValue("imageUrl", cdnUrl)}
                recommendedWidth={1200}
                recommendedHeight={630}
                aspectRatio={1200 / 630}
                allowFreeDimensions={true}
              />
            </PolarisFormCard>
          </div>

          {/* Sticky Live Preview Sidebar (4 Cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="sticky top-24 space-y-4">
              <PolarisFormCard
                title="Live Campaign Preview"
                description="Real-time summary of configured parameters"
              >
                <div className="space-y-1">
                  <PolarisSummaryRow label="Campaign Name" value={formik.values.name || <span className="text-muted-foreground italic">Untitled</span>} />
                  <PolarisSummaryRow label="Goal Funnel" value={formik.values.destinationType} />
                  <PolarisSummaryRow label="Creative" value={formik.values.imageUrl ? "Uploaded" : "None"} isLast />
                </div>

                <PolarisInfoBanner
                  title="360° Tracking Active"
                  description="Attribution visits, conversions, and journeys are recorded automatically via ClickHouse."
                />
              </PolarisFormCard>
            </div>
          </div>
        </form>
      </main>

      {/* Floating Save Panel Dock */}
      <FloatingSavePanel
        show={formik.dirty}
        isSaving={formik.isSubmitting}
        onSave={formik.handleSubmit}
        onDiscard={() => formik.resetForm()}
        saveText="Save Campaign"
        discardText="Discard Changes"
      />
    </div>
  );
}
```

---

### Template 2: 3-Tier Slide-Over Drawer Form

```tsx
"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { Settings2, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface EditDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: { title: string; maxUsers: number };
}

export function EditDrawer({ open, onOpenChange, initialData }: EditDrawerProps) {
  const formik = useFormik({
    initialValues: {
      title: initialData?.title || "",
      maxUsers: initialData?.maxUsers || 100,
    },
    validationSchema: Yup.object({
      title: Yup.string().trim().required("Title is required"),
      maxUsers: Yup.number().min(1, "Must be at least 1").required(),
    }),
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        toast.success("Settings updated");
        onOpenChange(false);
      } catch (err: unknown) {
        toast.error((err as Error)?.message || "Failed to save");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col justify-between overflow-hidden">
        <form onSubmit={formik.handleSubmit} className="flex flex-col h-full justify-between">
          {/* 1. Sticky Header */}
          <div className="p-5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                <Settings2 className="h-4 w-4" />
              </div>
              <div>
                <SheetTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                  Edit Tier Settings
                </SheetTitle>
                <SheetDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                  Update capacity and tier configuration
                </SheetDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-7 w-7 rounded-md hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* 2. Scrollable Body */}
          <div className="p-5 space-y-4 flex-1 overflow-y-auto">
            <PolarisFormCard title="Capacity & Limits">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Tier Title *</Label>
                <Input
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  className="h-9 text-xs"
                />
              </div>
            </PolarisFormCard>
          </div>

          {/* 3. Sticky Footer */}
          <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-8.5 px-3 text-xs border-[#d2d5d9] dark:border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="h-8.5 px-4 text-xs font-medium bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
            >
              {formik.isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Save Changes
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
```

---

### Template 3: Polaris Modal Dialog Form

```tsx
"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PolarisFormCard } from "@/components/gamification/shared/polaris-form-ui";
import { Sparkles, Loader2, X } from "lucide-react";
import { toast } from "sonner";

export function CreateQuickItemDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const formik = useFormik({
    initialValues: { label: "" },
    validationSchema: Yup.object({
      label: Yup.string().trim().required("Label is required"),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      try {
        toast.success("Created successfully");
        resetForm();
        onOpenChange(false);
      } catch (err: unknown) {
        toast.error((err as Error)?.message || "Failed");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden border border-[#d2d5d9] dark:border-zinc-800 shadow-2xl rounded-xl bg-white dark:bg-zinc-900">
        <form onSubmit={formik.handleSubmit}>
          {/* Header */}
          <div className="px-5 py-3.5 border-b border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-xs font-bold text-[#303030] dark:text-zinc-100">
                  Quick Add Item
                </DialogTitle>
                <DialogDescription className="text-[11px] text-[#616161] dark:text-zinc-400">
                  Define item label and parameters
                </DialogDescription>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-7 w-7 rounded-md hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3.5">
            <PolarisFormCard title="General Details">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Item Label *</Label>
                <Input
                  name="label"
                  placeholder="e.g. VIP Member Perk"
                  value={formik.values.label}
                  onChange={formik.handleChange}
                  className="h-9 text-xs"
                />
              </div>
            </PolarisFormCard>
          </div>

          {/* Footer */}
          <div className="p-3.5 border-t border-[#d2d5d9] dark:border-zinc-800 bg-[#f9fafb] dark:bg-zinc-900/90 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-8.5 px-3 text-xs border-[#d2d5d9] dark:border-zinc-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="h-8.5 px-4 text-xs font-medium bg-[#303030] hover:bg-[#202020] text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs"
            >
              {formik.isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Save Item
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 9. Code Quality & Linting Checklist

Before committing any form or UI change:

1. **Lint Verification**:
   ```bash
   pnpm exec eslint <modified_file_path>
   ```
   Must exit with **0 errors and 0 warnings**.
2. **Type Safety**:
   - Zero `any` types.
   - Catch errors typed as `err: unknown` and cast with `(err as Error).message`.
3. **No Unused Imports**:
   - Ensure all Lucide icons, components, and React hooks imported are actively referenced.
4. **Deploy Pipeline**:
   - Primary release branch is `production`.
   - Pushing to `origin/production` automatically triggers `.github/workflows/docker-hub-deploy.yml` which deploys to the DigitalOcean production droplet.

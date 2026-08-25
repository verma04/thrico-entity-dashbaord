# Thrico Clean Form Design Standard (Polaris-Inspired Form Architecture)
**Scope**: Dashboard-wide form standard for all creation, configuration, and editing pages  
**Architecture**: 2-Column Responsive Grid (8-col Form Pane + 4-col Sticky Live Sidebar) with `FloatingSavePanel` Bottom Dock

---

## 1. Executive Summary & Design Principles

The **Thrico Clean Form Design Standard** establishes a cohesive, high-converting, and distraction-free user experience across all form pages in the dashboard (e.g. Shopify Discounts, Coupons, Member Creation, Point Rules, Community Settings, Tickets, and Modules).

### Core Design Principles:
1. **Asymmetric 2-Column Layout**:
   - **Main Form Pane (`lg:col-span-8`)**: Logical, progressively disclosed form cards containing intuitive inputs, segmented toggles, and contextual descriptions.
   - **Sticky Sidebar Pane (`lg:col-span-4`)**: Live summary card that instantly mirrors user inputs in real time, accompanied by metadata (e.g., sales channels, status tags, tips).
2. **Zero-Clutter Header**:
   - Back arrow navigation, crisp title, optional breadcrumbs, and status badge without redundant top action buttons.
3. **Non-Blocking Floating Save Dock (`FloatingSavePanel`)**:
   - Clean dark-glassmorphism floating capsule anchored at `bottom-6` of the viewport.
   - Mounts via React Portal, appears seamlessly on form dirty state with spring animations (`framer-motion`), and provides Discard + Save actions with loading feedback.
4. **Smart Error Detection & Auto-Scroll**:
   - When the user submits with invalid fields, a toast alerts the user, and the viewport smoothly scrolls to and focuses the first erroneous input field.
5. **Dark Mode & Responsive Excellence**:
   - Flawless contrast, smooth border definitions (`border-[#e1e3e5]` / `dark:border-zinc-800`), backdrop blurs, and typography tuned for readability.

---

## 2. Layout Structure & Wireframe

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header: [← Back]  Page Title (e.g., "Create discount")                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ Max Width: 1280px Centered Canvas (px-4 sm:px-8 md:px-10 py-6 sm:py-8)      │
│                                                                             │
│ ┌──────────────────────────────────────┬──────────────────────────────────┐ │
│ │ Main Configuration Pane (8 Cols)     │ Sticky Sidebar Pane (4 Cols)     │ │
│ │                                      │ (sticky top-6)                   │ │
│ │ ┌──────────────────────────────────┐ │ ┌──────────────────────────────┐ │ │
│ │ │ Card 1: Method & Identity        │ │ │ Card 1: Live Real-Time       │ │ │
│ │ │  • Segmented Control (Code/Auto) │ │ │         Summary Preview      │ │ │
│ │ │  • Code Input + Generate Button  │ │ │  - Type & Value Badge        │ │ │
│ │ │  • Helper text & validations     │ │ │  - Applies To / Target Scope │ │ │
│ │ └──────────────────────────────────┘ │ │  - Minimum Requirements     │ │ │
│ │                                      │ │  - Customer Eligibility      │ │ │
│ │ ┌──────────────────────────────────┐ │ │  - Usage Limits              │ │ │
│ │ │ Card 2: Value & Application      │ │ │  - Active Date Range         │ │ │
│ │ │  • Type (Percentage / Fixed Amt) │ │ └──────────────────────────────┘ │ │
│ │ │  • Value Input + Applies To      │ │                                  │ │
│ │ │  • Browse Resource Modals        │ │ ┌──────────────────────────────┐ │ │
│ │ └──────────────────────────────────┘ │ │ Card 2: Channel Access / Tags │ │ │
│ │                                      │ │  - Online Store, POS, App    │ │ │
│ │ ┌──────────────────────────────────┐ │ │  - Interactive Tag Input     │ │ │
│ │ │ Card 3: Eligibility & Rules      │ │ └──────────────────────────────┘ │ │
│ │ │  • Radio Group & Segment Lists   │ │                                  │ │
│ │ │  • Minimum Purchase Conditions   │ │                                  │ │
│ │ └──────────────────────────────────┘ │                                  │ │
│ └──────────────────────────────────────┴──────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ FloatingSavePanel: [● Unsaved changes]  •  [Discard] [ Save discount ]       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Standard Component Directory & Primitives

All clean forms leverage modular cards and atomic primitives located in `@/components/discounts/shopify-discount-form/primitives` and `@/components/ui/platform/floating-save-panel`.

### Core Atomic Primitives:
| Component | Import Path | Purpose |
| :--- | :--- | :--- |
| `PolarisCard` | `@/.../primitives/polaris-card` | Container card with clean borders, title slot, subtitle, and action headers. |
| `SegmentedControl` | `@/.../primitives/segmented-control` | High-polish tab pill switcher with sliding highlight indicator. |
| `PolarisInput` | `@/.../primitives/polaris-input` | Clean Polaris input supporting prefix/suffix icons, currency symbols, and inline error messages. |
| `PolarisSelect` | `@/.../primitives/polaris-select` | Standardized custom dropdown selector. |
| `PolarisRadioGroup` | `@/.../primitives/polaris-radio-group` | Radio option list with expandable sub-content for selected items. |
| `PolarisCheckbox` | `@/.../primitives/polaris-checkbox` | Accessible checkbox with subtitle and nested conditional fields. |
| `PolarisCollapsible`| `@/.../primitives/polaris-collapsible` | Smooth animated accordion collapse for advanced settings. |
| `TagInputField` | `@/.../primitives/tag-input-field` | Tokenized chip input with add, remove, and duplicate prevention. |
| `BrowseModal` | `@/.../primitives/browse-modal` | Resource picker modal with search, multi-selection, and thumbnail previews. |
| `FloatingSavePanel` | `@/components/ui/platform/floating-save-panel` | Docked bottom floating action bar with animated dirty state, discard reset, and save loader. |

---

## 4. Design Tokens & Styling Specifications

| Token | Light Mode | Dark Mode | Usage |
| :--- | :--- | :--- | :--- |
| **Page Background** | `bg-[#f6f6f7]` | `dark:bg-zinc-950` | Full page backdrop |
| **Card Background** | `bg-white` | `dark:bg-zinc-900` | `PolarisCard` surfaces |
| **Card Border** | `border-[#e1e3e5]` | `dark:border-zinc-800` | 1px clean separation |
| **Card Radius** | `rounded-[12px]` | `rounded-[12px]` | Standard surface curve |
| **Primary Text** | `text-[#303030]` | `dark:text-zinc-100` | Headings, labels, values |
| **Secondary Text** | `text-[#616161]` | `dark:text-zinc-400` | Subtitles, helper text |
| **Brand Accent** | `#008060` (Shopify) / `#005bd3` (Polaris) | `#00a37a` / `#3888ff` | Selected states, primary buttons |
| **Unsaved Pulse** | `bg-amber-500` / `bg-amber-400` | `bg-amber-500` / `bg-amber-400` | Pulse indicator in FloatingSavePanel |
| **Save Pill Surface**| `bg-[#212121]/95` | `dark:bg-[#1c1c1c]/95` | Floating action bar backdrop blur |

---

## 5. Standard Implementation Blueprint

To build or migrate any page to this standard, follow this 4-step blueprint:

### Step 1: Define Form Schema & Types (`types.ts`)
```typescript
import * as Yup from "yup";

export interface MyFeatureFormValues {
  title: string;
  code: string;
  status: "ACTIVE" | "DRAFT";
  category: string;
  tags: string[];
}

export const initialMyFeatureValues: MyFeatureFormValues = {
  title: "",
  code: "",
  status: "ACTIVE",
  category: "general",
  tags: [],
};

export const myFeatureSchema = Yup.object().shape({
  title: Yup.string().trim().required("Title is required"),
  code: Yup.string().trim().required("Code is required"),
});
```

---

### Step 2: Assemble the Form Component (`my-feature-form.tsx`)
```tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

import { PolarisCard } from "@/components/discounts/shopify-discount-form/primitives/polaris-card";
import { PolarisInput } from "@/components/discounts/shopify-discount-form/primitives/polaris-input";
import { FloatingSavePanel } from "@/components/ui/platform/floating-save-panel";
import {
  MyFeatureFormValues,
  initialMyFeatureValues,
  myFeatureSchema,
} from "./types";

export interface MyFeatureFormProps {
  initialValues?: Partial<MyFeatureFormValues>;
  onSubmit?: (values: MyFeatureFormValues) => Promise<void> | void;
  onCancel?: () => void;
  backHref?: string;
  pageTitle?: string;
  className?: string;
}

export function MyFeatureForm({
  initialValues: propInitialValues,
  onSubmit,
  onCancel,
  backHref = "/my-feature",
  pageTitle = "Create Feature",
  className,
}: MyFeatureFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saved, setSaved] = useState(false);

  const formik = useFormik<MyFeatureFormValues>({
    initialValues: { ...initialMyFeatureValues, ...propInitialValues },
    validationSchema: myFeatureSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        if (onSubmit) {
          await onSubmit(values);
        } else {
          // Default mutation logic
          await new Promise((res) => setTimeout(res, 600));
          setSaved(true);
          toast.success("Saved successfully");
          if (backHref) router.push(backHref);
        }
      } catch (err: any) {
        toast.error("Failed to save", {
          description: err.message || "An unexpected error occurred.",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleBack = () => {
    if (onCancel) onCancel();
    else if (backHref) router.push(backHref);
    else router.back();
  };

  const handleSaveAttempt = (e?: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();

    if (Object.keys(formik.errors).length > 0) {
      const firstErrorKey = Object.keys(formik.errors)[0];
      toast.error("Please review highlighted errors", {
        description: String(formik.errors[firstErrorKey as keyof typeof formik.errors]),
      });

      const element = document.getElementById(firstErrorKey);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.focus();
      }
    }

    formik.handleSubmit();
  };

  const handleDiscard = () => {
    formik.resetForm();
    toast.info("Unsaved changes discarded");
  };

  return (
    <div
      className={cn(
        "min-h-screen bg-[#f6f6f7] dark:bg-zinc-950 text-[#303030] dark:text-zinc-100 px-4 sm:px-8 md:px-10 py-6 sm:py-8 pb-28 sm:pb-32 font-sans antialiased",
        className
      )}
    >
      <div className="max-w-[1280px] mx-auto space-y-4">
        {/* ── Page Header ── */}
        <header className="flex items-center gap-2.5 h-[48px] mb-4">
          <button
            type="button"
            onClick={handleBack}
            className="h-9 w-9 rounded-[8px] flex items-center justify-center text-[#616161] hover:text-[#303030] dark:text-zinc-400 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 stroke-[2.2]" />
          </button>
          <h1 className="text-[20px] font-semibold text-[#303030] dark:text-zinc-100 leading-[28px] tracking-tight">
            {pageTitle}
          </h1>
        </header>

        {/* ── Form Layout (8 Cols Main + 4 Cols Sticky Sidebar) ── */}
        <form onSubmit={handleSaveAttempt}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Main Column */}
            <div className="lg:col-span-8 space-y-4 min-w-0">
              <PolarisCard title="General Information">
                <PolarisInput
                  id="title"
                  label="Title"
                  value={formik.values.title}
                  onChange={(val) => formik.setFieldValue("title", val)}
                  error={formik.touched.title && formik.errors.title ? String(formik.errors.title) : null}
                  placeholder="e.g. Summer Special"
                />
              </PolarisCard>
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="sticky top-6 space-y-4">
                <PolarisCard title="Summary">
                  <div className="text-[13px] text-zinc-500">
                    {formik.values.title ? formik.values.title : "No title set"}
                  </div>
                </PolarisCard>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* ── Floating Action Bar ── */}
      <FloatingSavePanel
        hasChanged={formik.dirty}
        saved={saved}
        isSaving={isSubmitting}
        onSave={() => handleSaveAttempt()}
        onReset={handleDiscard}
        title="Unsaved changes"
        buttonText="Save"
        discardButtonText="Discard"
      />
    </div>
  );
}
```

---

### Step 3: Connect to Next.js Page Route (`page.tsx`)
```tsx
"use client";

import React from "react";
import { MyFeatureForm } from "@/components/my-feature/my-feature-form";

export default function CreateFeaturePage() {
  return (
    <MyFeatureForm
      pageTitle="Create Feature"
      backHref="/my-feature"
    />
  );
}
```

---

## 6. Form Migration Checklist

When refactoring legacy forms across the entity dashboard, verify that each requirement is satisfied:

- [ ] **Canvas Width**: Wrapped in `max-w-[1280px] mx-auto` with `pb-28 sm:pb-32` bottom padding to accommodate floating bar.
- [ ] **Grid Ratio**: 8 columns for configuration (`lg:col-span-8`) and 4 columns for sidebar (`lg:col-span-4`).
- [ ] **Sticky Preview**: Sidebar is wrapped in `<div className="sticky top-6 space-y-4">` and updates dynamically with Formik values.
- [ ] **Atomic Cards**: Each logical step is wrapped in `<PolarisCard>` rather than generic cards or raw borders.
- [ ] **No Static Submit Buttons**: Remove bottom card submit buttons in favor of `<FloatingSavePanel />`.
- [ ] **Error Auto-Focus**: Form submit handler scrolls to first error key when validation fails.
- [ ] **Discard Support**: `onReset` resets Formik dirty state and displays info toast.
- [ ] **Dark Mode Audit**: Text and surface tokens utilize standard Tailwind `dark:` color classes.

# Formik & Yup Form Standards & Architecture

**Scope**: Mandatory standard for all forms across `thrico-entity-dashboard` (dialogs, drawers, settings tabs, page creators, and modal sheets).  
**Target Audience**: Developers and AI Agents working in this repository.

---

## 1. Core Rule & Mandatory Requirement

> [!IMPORTANT]
> **MANDATORY FOR ALL AI AGENTS & DEVELOPERS:**  
> **NEVER** use scattered individual `useState` hooks to manage form fields, error states, and submission states.  
> **ALWAYS** use **`formik`** (via `useFormik` or `<FormikProvider>`) and **`yup`** for schema validation in every form component.

### Why Formik + Yup is Required:
1. **Zero State Sprawl**: Prevents 10–20 individual `useState` calls and manual synchronization logic.
2. **Eliminates `set-state-in-effect` Bugs**: When syncing data for "Edit" modes, `enableReinitialize: true` automatically updates initial values without triggering React cascading re-render lint errors.
3. **Declarative Validation Schemas**: Validation logic is isolated in reusable Yup schemas instead of scattered imperative `if (!val) toast.error(...)` statements.
4. **Instant Touched & Error Tracking**: Visual feedback (`border-destructive`, helper error text) occurs cleanly on blur or submission.
5. **Predictable Submission Flow**: Provides `formik.isSubmitting`, `formik.resetForm`, and safe async submission handling.

---

## 2. Standard Form Architecture Blueprint

Every form in this project should follow this structure:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. TypeScript Form Values Interface                         │
│    `interface MyEntityFormValues { ... }`                   │
├─────────────────────────────────────────────────────────────┤
│ 2. Yup Validation Schema                                    │
│    `const myEntityValidationSchema = Yup.object().shape(...)`│
├─────────────────────────────────────────────────────────────┤
│ 3. Formik Hook Configuration                                │
│    `const formik = useFormik<MyEntityFormValues>({ ... })`  │
├─────────────────────────────────────────────────────────────┤
│ 4. JSX Layout & Input Bindings                              │
│    `<form onSubmit={formik.handleSubmit}>`                  │
│      - Inputs with `value={formik.values.field}`            │
│      - Handlers: `onChange={formik.handleChange}`           │
│      - Blur: `onBlur={formik.handleBlur}`                   │
│      - Error UI: `{formik.touched.x && formik.errors.x}`    │
├─────────────────────────────────────────────────────────────┤
│ 5. Action Buttons with Submitting State                     │
│    `<Button disabled={formik.isSubmitting} ...>`            │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Step-by-Step Implementation Guide

### Step 1: Define TypeScript Types

Always define a dedicated interface for your form values:

```typescript
import type { CustomFieldType, ValidationMode } from "./types";

export interface CustomFieldFormValues {
  label: string;
  key: string;
  type: CustomFieldType;
  placeholder: string;
  helperText: string;
  required: boolean;
  options: string[];
  validationMode: ValidationMode;
  validationRegex: string;
  validationErrorMessage: string;
  blockIfNotExists: boolean;
  preventDuplicate: boolean;
}
```

---

### Step 2: Define the Yup Validation Schema

Use descriptive error messages and conditional validations (`.when()`):

```typescript
import * as Yup from "yup";

export const customFieldValidationSchema = Yup.object().shape({
  label: Yup.string()
    .trim()
    .required("Field label is required"),

  key: Yup.string()
    .trim()
    .required("Field key is required")
    .matches(
      /^[a-z0-9_]+$/,
      "Field key can only contain lowercase letters, numbers, and underscores"
    ),

  type: Yup.string()
    .required("Field type is required"),

  placeholder: Yup.string().optional(),
  helperText: Yup.string().optional(),
  required: Yup.boolean().default(false),

  // Conditional array validation for dropdowns
  options: Yup.array()
    .of(Yup.string().required())
    .when("type", {
      is: "select",
      then: (schema) => schema.min(1, "Dropdown select fields must have at least one option"),
      otherwise: (schema) => schema.optional(),
    }),

  validationMode: Yup.string()
    .oneOf(["NONE", "REGEX", "CSV_ROSTER", "BOTH"])
    .default("NONE"),

  // Conditional regex pattern verification
  validationRegex: Yup.string().when("validationMode", {
    is: (mode: string) => mode === "REGEX" || mode === "BOTH",
    then: (schema) =>
      schema
        .trim()
        .required("Regex validation pattern is required")
        .test("is-valid-regex", "Invalid regular expression pattern syntax", (val) => {
          if (!val) return false;
          try {
            new RegExp(val);
            return true;
          } catch {
            return false;
          }
        }),
    otherwise: (schema) => schema.optional(),
  }),

  validationErrorMessage: Yup.string().optional(),
  blockIfNotExists: Yup.boolean().default(true),
  preventDuplicate: Yup.boolean().default(true),
});
```

---

### Step 3: Configure `useFormik`

Initialize `useFormik` inside your component:

```typescript
import { useFormik } from "formik";
import { toast } from "sonner";

export function CustomFieldDrawer({
  open,
  onOpenChange,
  fieldToEdit,
  onSave,
}: CustomFieldDrawerProps) {
  const formik = useFormik<CustomFieldFormValues>({
    initialValues: {
      label: fieldToEdit?.label || "",
      key: fieldToEdit?.key || "",
      type: fieldToEdit?.type || "text",
      placeholder: fieldToEdit?.placeholder || "",
      helperText: fieldToEdit?.helperText || "",
      required: fieldToEdit?.required ?? false,
      options: fieldToEdit?.options ? [...fieldToEdit.options] : [],
      validationMode: fieldToEdit?.validationMode || "NONE",
      validationRegex: fieldToEdit?.validationRegex || "",
      validationErrorMessage: fieldToEdit?.validationErrorMessage || "",
      blockIfNotExists: fieldToEdit?.blockIfNotExists ?? true,
      preventDuplicate: fieldToEdit?.preventDuplicate ?? true,
    },
    validationSchema: customFieldValidationSchema,
    enableReinitialize: true, // Crucial for edit dialogs/drawers
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await onSave(values);
        onOpenChange(false);
      } catch (err: unknown) {
        toast.error((err as Error)?.message || "Failed to save field");
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle external submit button trigger with first error feedback
  const handleSubmitClick = () => {
    formik.handleSubmit();
    if (!formik.isValid && Object.keys(formik.errors).length > 0) {
      const firstError = Object.values(formik.errors)[0];
      if (typeof firstError === "string") {
        toast.error(firstError);
      }
    }
  };
```

---

### Step 4: Component Binding Recipes

#### A. Standard Text / Number Input
```tsx
<div className="space-y-1.5">
  <Label className="text-xs font-semibold">Field Label *</Label>
  <Input
    name="label"
    value={formik.values.label}
    onChange={formik.handleChange}
    onBlur={formik.handleBlur}
    className={cn(
      "h-9 text-xs",
      formik.touched.label && formik.errors.label && "border-destructive focus-visible:ring-destructive"
    )}
    placeholder="e.g. Employee ID"
  />
  {formik.touched.label && formik.errors.label && (
    <p className="text-[11px] text-destructive font-medium mt-1">
      {formik.errors.label}
    </p>
  )}
</div>
```

#### B. Auto-slugifying Input (Label -> Key)
```tsx
const handleLabelChange = (val: string) => {
  formik.setFieldValue("label", val);
  // Auto-slug key only if creating new field and key hasn't been manually touched
  if (!fieldToEdit && !formik.touched.key) {
    const slug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    formik.setFieldValue("key", slug);
  }
};
```

#### C. Radix / Shadcn `<Select>`
```tsx
<Select
  value={formik.values.type}
  onValueChange={(val: string) => formik.setFieldValue("type", val)}
>
  <SelectTrigger className="h-9 text-xs">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="text">Text</SelectItem>
    <SelectItem value="number">Number</SelectItem>
    <SelectItem value="select">Dropdown Select</SelectItem>
  </SelectContent>
</Select>
```

#### D. Radix / Shadcn `<Switch>`
```tsx
<Switch
  checked={formik.values.required}
  onCheckedChange={(checked) => formik.setFieldValue("required", checked)}
  className="data-[state=checked]:bg-indigo-600"
/>
```

#### E. Dynamic Array of Items (e.g. Select Options)
```tsx
const [newOptionInput, setNewOptionInput] = useState("");

const handleAddOption = () => {
  const trimmed = newOptionInput.trim();
  if (!trimmed) return;
  if (formik.values.options.includes(trimmed)) {
    toast.error("Option already exists.");
    return;
  }
  formik.setFieldValue("options", [...formik.values.options, trimmed]);
  setNewOptionInput("");
};

const handleRemoveOption = (index: number) => {
  formik.setFieldValue(
    "options",
    formik.values.options.filter((_, i) => i !== index)
  );
};
```

#### F. Submit Buttons
```tsx
<Button
  type="button"
  size="sm"
  onClick={handleSubmitClick}
  disabled={formik.isSubmitting}
  className="text-xs h-9 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs font-medium"
>
  {formik.isSubmitting ? "Saving..." : fieldToEdit ? "Save Changes" : "Create Field"}
</Button>
```

---

## 4. UI & Visual Design Style Standard (Mandatory for All Forms)

All forms (whether inside full pages, slide-over Sheets/Drawers, or Dialog modals) must strictly adhere to the **Thrico Polaris & Linear-Inspired Design Language**. Do not build generic or plain forms; maintain high-density, polished, professional aesthetics.

### A. Color Tokens & Theme Surfaces
| Element | Light Mode | Dark Mode | Tailwind Classes |
| :--- | :--- | :--- | :--- |
| **Drawer / Modal Canvas** | Pure White | Deep Zinc | `bg-white dark:bg-zinc-950` |
| **Form Section Cards** | Card surface | Dark Card | `bg-card border border-border/70 shadow-2xs rounded-xl p-4` |
| **Header / Sub-bars** | Soft Muted Tint | Dark Muted Tint | `bg-muted/20 border-b border-border/60` |
| **Sticky Footer** | Muted Base | Muted Base | `bg-muted/10 border-t border-border/60` |
| **Primary CTA Button** | Rich Charcoal `#303030` | Bright Zinc `#f4f4f5` | `bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900` |
| **Secondary Button** | Crisp Outline | Crisp Outline | `variant="outline" text-xs h-9 cursor-pointer` |
| **Error Feedback** | Red-600 | Red-400 | `border-destructive text-destructive text-[11px] font-medium` |

---

### B. Typography Scale & Sizing Standards
- **Drawer / Dialog Title**: `text-base font-bold text-foreground`
- **Drawer / Dialog Subtitle**: `text-xs text-muted-foreground mt-0.5`
- **Section Group Header**: `text-xs font-bold text-foreground uppercase tracking-wide`
- **Step Number Circle**: `flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white`
- **Field Labels**: `text-xs font-semibold text-foreground`
- **Input Text**: `text-xs`
- **Key / Code / Regex Inputs**: `text-xs font-mono`
- **Helper / Explanatory Text**: `text-[11px] text-muted-foreground leading-snug`
- **Inline Error Messages**: `text-[11px] text-destructive font-medium mt-1`
- **Standard Input Height**: `h-9` (36px) for primary inputs; `h-8` (32px) for secondary/nested fields.

---

### C. Standard Form Section Card Pattern
Wrap each logical group of fields inside an isolated Polaris-style card with a numbered step badge:

```tsx
<div className="space-y-4 rounded-xl border border-border/70 p-4 bg-card shadow-2xs">
  {/* Card Header */}
  <div className="flex items-center justify-between border-b border-border/50 pb-2.5">
    <div className="flex items-center gap-2">
      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">
        1
      </span>
      <span className="text-xs font-bold text-foreground uppercase tracking-wide">
        Section Title
      </span>
    </div>
    <Badge variant="outline" className="text-[10px] font-mono">
      context_meta
    </Badge>
  </div>

  {/* Inputs Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
    {/* Form inputs go here */}
  </div>
</div>
```

---

### D. Interactive Selection Tiles (Radio / Mode Selectors)
When presenting multiple options (e.g. Auth Mode, Verification Mode, Layout Type), **do not** use plain radio circles. Use interactive card tiles:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
  <button
    type="button"
    onClick={() => formik.setFieldValue("mode", "VALUE")}
    className={cn(
      "p-3 rounded-lg border text-left transition-all cursor-pointer flex items-start gap-2.5",
      formik.values.mode === "VALUE"
        ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-600"
        : "border-border bg-muted/10 hover:border-border/80"
    )}
  >
    <div className="p-1.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 mt-0.5 shrink-0">
      <Sparkles className="w-3.5 h-3.5" />
    </div>
    <div>
      <span className="text-xs font-bold text-foreground block">
        Option Title
      </span>
      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
        Concise explanation of this mode and its consequences.
      </p>
    </div>
  </button>
</div>
```

---

### E. Switch Row with Descriptive Context
When toggling a feature or setting, place the toggle in a padded row with clear explanatory copy:

```tsx
<div className="flex items-center justify-between p-2.5 rounded-lg border border-border/60">
  <div className="space-y-0.5 pr-4">
    <span className="text-xs font-semibold text-foreground block">
      Prevent Duplicate Registrations (1:1 Claim)
    </span>
    <p className="text-[11px] text-muted-foreground">
      Block multiple members from claiming the exact same identifier in your community.
    </p>
  </div>
  <Switch
    checked={formik.values.preventDuplicate}
    onCheckedChange={(val) => formik.setFieldValue("preventDuplicate", val)}
    className="data-[state=checked]:bg-indigo-600"
  />
</div>
```

---

### F. Slide-Over Sheet / Drawer Frame Standard
All drawer forms must maintain this 3-tier layout:

```tsx
<Sheet open={open} onOpenChange={onOpenChange}>
  <SheetContent
    side="right"
    className="sm:max-w-xl md:max-w-2xl w-full p-0 flex flex-col gap-0 border-l border-border/80 shadow-2xl bg-white dark:bg-zinc-950"
  >
    {/* Tier 1: Sticky Top Header with Icon Avatar */}
    <SheetHeader className="p-6 pb-4 border-b border-border/60 bg-muted/20">
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-900/40 shrink-0">
          <Sparkles className="h-4 w-4" />
        </div>
        <div>
          <SheetTitle className="text-base font-bold text-foreground">
            {title}
          </SheetTitle>
          <SheetDescription className="text-xs text-muted-foreground mt-0.5">
            {description}
          </SheetDescription>
        </div>
      </div>
    </SheetHeader>

    {/* Tier 2: Scrollable Form Body */}
    <form onSubmit={formik.handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Grouped section cards */}
    </form>

    {/* Tier 3: Sticky Bottom Footer */}
    <SheetFooter className="p-4 border-t border-border/60 bg-muted/10 flex sm:flex-row gap-2 justify-end">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onOpenChange(false)}
        className="text-xs h-9 cursor-pointer"
      >
        Cancel
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={handleSubmitClick}
        disabled={formik.isSubmitting}
        className="text-xs h-9 bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 cursor-pointer shadow-2xs font-medium"
      >
        {formik.isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

---

## 5. Reference Implementations in Codebase

To see real production examples adhering to both Formik+Yup validation and this UI design style, inspect:

1. [custom-field-drawer.tsx](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/members/customization/custom-field-drawer.tsx)
   - Step numbered cards, interactive validation mode tiles, live regex tester, custom option chips, Formik + Yup schema, and sticky footer.
2. [member-customization-settings.tsx](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/members/customization/member-customization-settings.tsx)
   - 2-column layout with live smartphone preview sidebar, Polaris form cards, and Formik state.
3. [tier-modal.tsx](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/members/settings/tier-modal.tsx)
   - Membership tier creation with numeric validation and Formik provider.

---

## 6. Checklist for AI Agents & Engineers

Before submitting code with any form:

- [ ] Is `useFormik` or `<FormikProvider>` used instead of multiple `useState` calls?
- [ ] Is a `Yup.object().shape({...})` validation schema defined?
- [ ] Are all fields properly typed in a TypeScript interface (`MyFormValues`)?
- [ ] Is `enableReinitialize: true` enabled if the form supports editing existing data?
- [ ] Do inputs display inline errors when `formik.touched[name] && formik.errors[name]`?
- [ ] Are inputs styled with `border-destructive` when invalid and touched?
- [ ] Is input sizing compact and uniform (`h-9 text-xs`)?
- [ ] Are cards styled with `rounded-xl border border-border/70 p-4 bg-card shadow-2xs`?
- [ ] Are selection modes presented as rich interactive tiles with icons and descriptions?
- [ ] Are switches wrapped in dedicated padded rows (`p-2.5 rounded-lg border border-border/60`)?
- [ ] Is the primary CTA styled as `bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900`?
- [ ] Is `formik.isSubmitting` used to disable buttons and prevent double-submissions?
- [ ] Did you run `pnpm exec eslint` on the file to confirm 0 errors?


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
  className="text-xs h-9 bg-[#303030] text-white hover:bg-[#202020] cursor-pointer"
>
  {formik.isSubmitting ? "Saving..." : fieldToEdit ? "Save Changes" : "Create Field"}
</Button>
```

---

## 4. Reference Implementations in Codebase

To see real production examples adhering to this standard, inspect:

1. [custom-field-drawer.tsx](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/members/customization/custom-field-drawer.tsx)
   - Dynamic validation mode switches, regex validator with live test string, and dropdown options management.
2. [member-customization-settings.tsx](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/members/customization/member-customization-settings.tsx)
   - Nested configuration object validation (authMethod, referral, customFields array).
3. [tier-modal.tsx](file:///Users/pulseplay/thrico/thrico-entity-dashboard/components/members/settings/tier-modal.tsx)
   - Membership tier creation with numeric validation and Formik provider.

---

## 5. Checklist for AI Agents & Engineers

Before submitting code with any form:

- [ ] Is `useFormik` or `<FormikProvider>` used instead of multiple `useState` calls?
- [ ] Is a `Yup.object().shape({...})` validation schema defined?
- [ ] Are all fields properly typed in a TypeScript interface (`MyFormValues`)?
- [ ] Is `enableReinitialize: true` enabled if the form supports editing existing data?
- [ ] Do inputs display inline errors when `formik.touched[name] && formik.errors[name]`?
- [ ] Are inputs styled with `border-destructive` when invalid and touched?
- [ ] Is `formik.isSubmitting` used to disable buttons and prevent double-submissions?
- [ ] Did you run `pnpm exec eslint` on the file to confirm 0 errors?

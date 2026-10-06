# Rule: Formik and Yup for All Forms

## Description
All forms across the `thrico-entity-dashboard` codebase must use **Formik** and **Yup**.

## Instructions
1. **Never use manual `useState` hooks for form state**:
   Do not declare separate `useState` for each input, error, or dirty state.
2. **Always use `useFormik` or `<FormikProvider>`**:
   Define a TypeScript interface for values and initialize `useFormik<FormValues>`.
3. **Always define a Yup validation schema**:
   Use `Yup.object().shape({...})` with descriptive error messages.
4. **Enable `enableReinitialize: true` on drawers/dialogs**:
   Whenever a modal or drawer can edit existing entities, set `enableReinitialize: true` so values sync when props change.
5. **Display inline error messages**:
   Show `{formik.touched.fieldName && formik.errors.fieldName}` and add `border-destructive` to invalid inputs.
6. **Strict UI & Design Style Standard**:
   - Card container: `rounded-xl border border-border/70 p-4 bg-card shadow-2xs`
   - Step numbered badges: `<span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">1</span>`
   - Compact input sizing: `h-9 text-xs` (primary) or `h-8 text-xs` (secondary/nested), `font-mono text-xs` for keys and regex
   - Selection tiles: Interactive cards with icons and descriptions (no plain radio dots)
   - Primary button: `bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-xs h-9 font-medium cursor-pointer`
   - Drawer structure: 3-tier layout (Sticky Header + Scrollable Section Cards Body + Sticky Bottom Footer)
   - Full dark mode support using semantic tokens (`bg-card`, `text-foreground`, `text-muted-foreground`, `border-border/70`)
7. **Reference Document**:
   See [docs/FORMIK_AND_YUP_GUIDELINES.md](file:///Users/pulseplay/thrico/thrico-entity-dashboard/docs/FORMIK_AND_YUP_GUIDELINES.md) for complete templates and recipes.

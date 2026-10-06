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
6. **Reference Document**:
   See [docs/FORMIK_AND_YUP_GUIDELINES.md](file:///Users/pulseplay/thrico/thrico-entity-dashboard/docs/FORMIK_AND_YUP_GUIDELINES.md) for complete templates and recipes.

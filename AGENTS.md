# Agent Rules & Coding Standards

This file contains mandatory instructions for all AI agents and automated coding assistants working in the `thrico-entity-dashboard` repository.

---

## 1. Forms: Formik and Yup Requirement (MANDATORY)

> [!IMPORTANT]
> **ALL FORMS MUST USE FORMIK AND YUP.**  
> When creating, modifying, or refactoring forms (modals, drawers, dialogs, settings panels, or page forms):
> - **DO NOT** use individual `useState` hooks to manage form fields, error states, or submit handlers.
> - **ALWAYS** use `useFormik` (or `<FormikProvider>`) with schema validation via `Yup.object().shape(...)`.
> - Always enable `enableReinitialize: true` for edit dialogs/drawers to keep state synchronized without causing React effect re-render loops.
> - Always display inline error messages (`formik.touched.field && formik.errors.field`) and highlight inputs with `border-destructive`.
> - **Full specification and code templates**: See [`docs/FORMIK_AND_YUP_GUIDELINES.md`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/docs/FORMIK_AND_YUP_GUIDELINES.md).

---

## 2. Form Layout & UX Standard

- Follow the 2-column responsive layout standard (8-column main form cards + 4-column live preview sidebar) where applicable.
- Use `FloatingSavePanel` bottom dock for dirty state management on full-page forms.
- Refer to [`docs/CLEAN_FORM_DESIGN_STANDARD.md`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/docs/CLEAN_FORM_DESIGN_STANDARD.md).

---

## 3. Icons & Visual Aesthetics

- Use `lucide-react` icons throughout the interface.
- Maintain premium UI aesthetics: rounded cards (`rounded-xl`), soft borders (`border-border/70`), subtle backdrops, and seamless dark mode support.
- Refer to [`docs/LUCIDE_V1_MIGRATION_AND_BRAND_ICONS.md`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/docs/LUCIDE_V1_MIGRATION_AND_BRAND_ICONS.md).

---

## 4. Code Quality & Linting

- Always check ESLint on modified files before submitting:
  ```bash
  pnpm exec eslint <modified_file_path>
  ```
- Ensure zero errors and zero warnings on newly introduced code.
- Avoid using `any`; type catch errors as `err: unknown` and cast with `(err as Error).message`.

---

## 5. Git & Deployment Pipeline

- The primary release branch is `production`.
- Pushing to `origin/production` automatically triggers GitHub Actions (`.github/workflows/docker-hub-deploy.yml`), which builds and deploys the Docker container to the production DigitalOcean droplet.
- Ensure builds compile cleanly before pushing to `production`.

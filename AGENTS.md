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

## 2. Form Layout & Visual Design Style Standard (MANDATORY)

All forms (whether full-page builders, slide-over Sheets/Drawers, or Dialog modals) must strictly adhere to the **Thrico Polaris & Linear-Inspired Design Language**:
- **Section Cards**: Group related inputs in isolated cards: `rounded-xl border border-border/70 p-4 bg-card shadow-2xs`.
- **Numbered Step Badges**: Use high-contrast step badges: `<span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white">1</span>` with section title `text-xs font-bold uppercase tracking-wide`.
- **Input Sizing & Typography**:
  - Labels: `text-xs font-semibold text-foreground`
  - Inputs: `h-9 text-xs` (primary) or `h-8 text-xs` (secondary/nested)
  - Keys, Slugs & Regex: `font-mono text-xs`
  - Helpers: `text-[11px] text-muted-foreground leading-snug`
  - Inline Errors: `text-[11px] text-destructive font-medium mt-1` + `border-destructive focus-visible:ring-destructive`
- **Interactive Selection Tiles**: Present options (e.g. modes, methods, types) as interactive card tiles with icons and 2-line descriptions instead of plain radio buttons.
- **Switches**: Place in padded rows (`p-2.5 rounded-lg border border-border/60`) with title + description.
- **Primary CTA Buttons**: Use `bg-[#303030] text-white hover:bg-[#202020] dark:bg-zinc-100 dark:text-zinc-900 shadow-2xs text-xs h-9 font-medium cursor-pointer`.
- **Slide-Over Drawers (3-Tier Structure)**:
  1. Sticky Header: `p-6 pb-4 border-b border-border/60 bg-muted/20` with icon avatar.
  2. Scrollable Body: `flex-1 overflow-y-auto p-6 space-y-6` containing grouped cards.
  3. Sticky Footer: `p-4 border-t border-border/60 bg-muted/10 flex sm:flex-row gap-2 justify-end`.
- **Full-Page Form Standard**: Follow the 2-column layout standard (8-col main form cards + 4-col sticky live preview sidebar) with `FloatingSavePanel` bottom dock. Refer to [`docs/CLEAN_FORM_DESIGN_STANDARD.md`](file:///Users/pulseplay/thrico/thrico-entity-dashboard/docs/CLEAN_FORM_DESIGN_STANDARD.md).

---

## 3. Dark Mode & Visual Aesthetics

- Seamless dark mode support using semantic Tailwind tokens (`bg-card`, `bg-background`, `border-border/70`, `text-foreground`, `text-muted-foreground`, `bg-muted/20`). **Never use hardcoded light-only grays or black text**.
- Use `lucide-react` icons throughout the interface.
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
